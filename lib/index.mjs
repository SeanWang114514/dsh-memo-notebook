import { promises as fsp } from 'node:fs'
import { writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

/** Stable Cordis plugin name. */
export const name = 'memo-notebook'

/** WebServer serves the /api/memo control API; agents is optional for resume. */
export const inject = ['webServer']

function sendJson(response, status, value) {
  if (response.headersSent || response.destroyed) return
  const body = `${JSON.stringify(value)}\n`
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  })
  response.end(body)
}

function sendFailure(response, status, code) {
  sendJson(response, status, { error: code })
}

async function readJsonObject(request, maximumBytes = 65536) {
  const chunks = []
  let total = 0
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > maximumBytes) throw new Error('payload_too_large')
    chunks.push(buffer)
  }
  let parsed
  try {
    parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw new Error('bad_request')
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('bad_request')
  return parsed
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function extractText(content) {
  let out = ''
  for (const block of content || []) {
    if (block && block.type === 'text' && typeof block.text === 'string') out += block.text
  }
  return out.trim()
}

function summarize(text) {
  const one = text.replace(/\s+/g, ' ').trim()
  return one.length > 300 ? `${one.slice(0, 300)}…` : one
}

/**
 * Resolve the live agent for a persisted session. In-memory `agents.get()`
 * only sees agents created in this process; after a restart the historical
 * session's agent is absent, so we resume it from persistence first.
 * Returns undefined when the session has no agent and cannot be resumed.
 */
async function resolveAgent(ctx, sessionId) {
  const agents = ctx.get('agents')
  if (!agents) return undefined
  const live = agents.get(sessionId)
  if (live) return live
  try {
    const handle = await agents.resume({ resumeSessionId: sessionId })
    return handle && handle.agent ? handle.agent : undefined
  } catch (error) {
    console.error(`[memo-notebook] resume agent ${sessionId} failed:`, error)
    return undefined
  }
}

/** Mount the /api/memo control API plus automatic inbox capture. */
export async function apply(ctx, config) {
  const stateFile = config.stateFile
  await fsp.mkdir(dirname(stateFile), { recursive: true })

  // --- live update: Server-Sent Events clients notified on every state change ---
  const sseClients = new Set()
  function notifyClients() {
    if (sseClients.size === 0) return
    const payload = `data: ${JSON.stringify({ ts: Date.now() })}\n\n`
    for (const res of sseClients) {
      try {
        res.write(payload)
      } catch {
        sseClients.delete(res)
      }
    }
  }

  // --- in-memory state: the single source of truth. Loaded once at startup;
  // every event callback and API handler mutates this object synchronously and
  // save() persists it asynchronously. This removes the file-IO race that kept
  // entries stuck at 'queued' (inserted's write had not landed when claimed read).
  let cache = null
  async function load() {
    if (cache) return cache
    try {
      const raw = await fsp.readFile(stateFile, 'utf8')
      const parsed = JSON.parse(raw)
      cache = parsed && Array.isArray(parsed.items) ? parsed : { version: 1, items: [] }
    } catch {
      cache = { version: 1, items: [] }
    }
    return cache
  }

  function save(state) {
    cache = state // update memory first: listeners see it immediately
    notifyClients()
    // Synchronous write so a killed process never loses the last change:
    // async fire-and-forget writes can be dropped when the web server is
    // stopped right after an operation, which looked like "memos cleared".
    try {
      writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8')
    } catch (error) {
      console.error('[memo-notebook] save failed:', error)
    }
  }

  function upsert(item) {
    const state = cache
    state.items = state.items.filter((i) => i.id !== item.id)
    state.items.unshift(item)
    save(state)
  }

  // ensure cache is populated before wiring listeners (no await inside handlers)
  await load()

  // --- automatic capture: a real user instruction entered the inbox ---
  ctx.on('agent/inbox/inserted', (payload) => {
    try {
      const agent = payload && payload.agent
      const message = payload && payload.message
      if (!agent || !message) return
      if (!message.source || message.source.kind !== 'user') return
      // messages injected by /api/memo/resume are re-runs of an existing entry:
      // skip them so the panel does not spawn a duplicate todo
      if (message.memoResume === true) return
      const text = extractText(message.content)
      if (!text) return
      // A new user instruction preempts any other pending/running work of this
      // agent: mark its other live entries as interrupted so they neither stay
      // queued nor turn into failed when the preempted tool errors out.
      // previousStatus remembers where the task was, so the restore button can
      // put it back (queued -> queued, running -> running, asking -> asking).
      const state = cache
      let preempted = false
      for (const it of state.items) {
        if (it.sessionId !== agent.id) continue
        if (it.status === 'queued' || it.status === 'running' || it.status === 'asking') {
          it.previousStatus = it.status
          it.status = 'interrupted'
          it.updatedAt = Date.now()
          preempted = true
        }
      }
      if (preempted) save(state)
      const header = agent.session && agent.session.header
      upsert({
        id: makeId(),
        messageId: message.id,
        text: summarize(text),
        sessionId: agent.id,
        cwd: (header && header.cwd) || '',
        status: 'queued',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    } catch {
      /* capture is best-effort */
    }
  })

  // --- automatic capture: the instruction started executing ---
  ctx.on('agent/inbox/claimed', (payload) => {
    try {
      const agent = payload && payload.agent
      const message = payload && payload.message
      if (!agent || !message) return
      const state = cache
      const it = state.items.find(
        (i) => i.sessionId === agent.id && i.messageId === message.id && i.status === 'queued',
      )
      if (!it) return
      it.status = 'running'
      it.updatedAt = Date.now()
      save(state)
    } catch {
      /* best-effort */
    }
  })

  /** Mark the agent's currently-running memo entry as asking (ask_user_question). */
  ctx.on('tools/execute', async (exec, next) => {
    try {
      if (exec && exec.name === 'tool-ask-user' && exec.agent) {
        const state = cache
        const it = state.items.find(
          (i) => i.sessionId === exec.agent.id && i.status === 'running',
        )
        if (it) {
          it.status = 'asking'
          it.updatedAt = Date.now()
          save(state)
        }
      }
    } catch {
      /* best-effort */
    }
    return next()
  })

  // --- tool finished: failure -> failed; asking resolved -> back to running ---
  ctx.on('tools/result', (exec, result) => {
    try {
      if (!exec || !exec.agent) return
      const state = cache
      const it = state.items.find(
        (i) => i.sessionId === exec.agent.id && (i.status === 'running' || i.status === 'asking'),
      )
      if (!it) return
      if (result && result.isError) {
        it.status = 'failed'
        it.updatedAt = Date.now()
        save(state)
      } else if (it.status === 'asking') {
        // question answered, work resumes
        it.status = 'running'
        it.updatedAt = Date.now()
        save(state)
      }
    } catch {
      /* best-effort */
    }
  })

  // --- a step or turn errored -> error ---
  ctx.on('agent/error', (payload) => {
    try {
      const agent = payload && payload.agent
      if (!agent) return
      const state = cache
      const it = state.items.find(
        (i) => i.sessionId === agent.id && (i.status === 'running' || i.status === 'asking'),
      )
      if (!it) return
      it.status = 'error'
      it.updatedAt = Date.now()
      save(state)
    } catch {
      /* best-effort */
    }
  })

  // --- automatic capture: the turn is closing naturally -> the memo entry is done ---
  // NOTE: agent/turn-stopping ONLY fires for normal completion (turnEnds set before dispatch).
  // User-initiated aborts go through the catch block and never reach this event.
  // Completed entries stay in the list struck through at the bottom (auto-complete),
  // instead of being deleted, so the user can still see what finished.
  ctx.on('agent/turn-stopping', (payload) => {
    try {
      const agent = payload && payload.agent
      if (!agent) return
      const state = cache
      let changed = false
      for (const it of state.items) {
        if (it.sessionId !== agent.id) continue
        if (it.status === 'running' || it.status === 'asking') {
          it.status = 'completed'
          it.updatedAt = Date.now()
          changed = true
        }
      }
      if (changed) save(state)
    } catch {
      /* best-effort */
    }
  })

  // --- user-initiated stop detection: agent goes idle while a memo entry is still running ---
  // When the user stops/pauses the agent, agent/turn-stopping does NOT fire (aborted turns
  // skip it). Instead the agent transitions from running to idle. We detect this by listening
  // for agent/status → idle and checking for orphaned running entries.
  const runningBefore = new Map() // agent.id → boolean (was running before this status change)
  ctx.on('agent/status', (payload) => {
    try {
      const agent = payload && payload.agent
      if (!agent) return
      const isRunning = payload.status === 'running'
      const wasRunning = runningBefore.get(agent.id) || false
      runningBefore.set(agent.id, isRunning)
      // agent just went from running → idle: check for orphaned entries
      if (wasRunning && !isRunning) {
        const state = cache
        let changed = false
        for (const it of state.items) {
          if (it.sessionId !== agent.id) continue
          if (it.status === 'running' || it.status === 'asking') {
            it.previousStatus = it.status
            it.status = 'interrupted'
            it.updatedAt = Date.now()
            changed = true
          }
        }
        if (changed) save(state)
      }
    } catch {
      /* best-effort */
    }
  })

  // --- control API ---
  const unregister = ctx.webServer.register({
    kind: 'prefix',
    path: '/api/memo',
    handler: async (req, res) => {
      try {
        const url = new URL(req.url || '/', 'http://localhost')
        const method = req.method || 'GET'
        const path = url.pathname

        if (method === 'GET' && path === '/api/memo/list') {
          sendJson(res, 200, { items: cache.items })
          return
        }

        if (method === 'GET' && path === '/api/memo/events') {
          // Server-Sent Events: push a ping on every state change so the
          // panel refreshes live instead of waiting for a manual reload.
          res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
          })
          res.write(`retry: 2000\n\n`)
          sseClients.add(res)
          const drop = () => sseClients.delete(res)
          req.on('close', drop)
          res.on('close', drop)
          return
        }

        if (method === 'POST' && path === '/api/memo/add') {
          const body = await readJsonObject(req)
          const text = String(body.text || '').trim()
          if (!text) throw new Error('empty')
          const item = {
            id: makeId(),
            messageId: '',
            text: summarize(text),
            sessionId: '',
            cwd: '',
            status: 'queued',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          upsert(item)
          sendJson(res, 200, { ok: true, item })
          return
        }

        if (method === 'POST' && path === '/api/memo/complete') {
          const body = await readJsonObject(req)
          const id = String(body.id || '')
          const it = cache.items.find((i) => i.id === id)
          if (!it) throw new Error('not_found')
          // completed entries stay in the list (struck through, sorted last);
          // only /api/memo/remove actually deletes them
          it.status = 'completed'
          it.updatedAt = Date.now()
          save(cache)
          sendJson(res, 200, { ok: true })
          return
        }

        if (method === 'POST' && path === '/api/memo/remove') {
          const body = await readJsonObject(req)
          const id = String(body.id || '')
          cache.items = cache.items.filter((i) => i.id !== id)
          save(cache)
          sendJson(res, 200, { ok: true })
          return
        }

        // --- batch operations (multi-select) ---
        if (method === 'POST' && path === '/api/memo/batch-complete') {
          const body = await readJsonObject(req)
          const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
          let marked = 0
          for (const it of cache.items) {
            if (ids.includes(it.id) && it.status !== 'completed') {
              it.status = 'completed'
              it.updatedAt = Date.now()
              marked += 1
            }
          }
          save(cache)
          sendJson(res, 200, { ok: true, marked })
          return
        }

        if (method === 'POST' && path === '/api/memo/batch-remove') {
          const body = await readJsonObject(req)
          const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
          cache.items = cache.items.filter((i) => !ids.includes(i.id))
          save(cache)
          sendJson(res, 200, { ok: true, removed: ids.length })
          return
        }

        if (method === 'POST' && path === '/api/memo/batch-resume') {
          const body = await readJsonObject(req)
          const ids = Array.isArray(body.ids) ? body.ids.map(String) : []
          let resumed = 0
          for (const id of ids) {
            const it = cache.items.find((i) => i.id === id)
            if (!it) continue
            // restore the task to where it was before it was interrupted:
            // queued -> queued (waiting), running/asking -> running (and re-run)
            const backTo = it.previousStatus === 'running' || it.previousStatus === 'asking'
              ? 'running'
              : 'queued'
            if (backTo === 'running' && it.sessionId) {
              const agent = await resolveAgent(ctx, it.sessionId)
              if (agent) {
                const message = {
                  id: crypto.randomUUID(),
                  role: 'user',
                  content: [{ type: 'text', text: it.text }],
                  source: { kind: 'user' },
                  memoResume: true,
                }
                agent.followup(message)
              }
            }
            it.status = backTo
            it.updatedAt = Date.now()
            resumed += 1
          }
          save(cache)
          sendJson(res, 200, { ok: true, resumed })
          return
        }

        if (method === 'POST' && path === '/api/memo/resume') {
          const body = await readJsonObject(req)
          const id = String(body.id || '')
          const it = cache.items.find((i) => i.id === id)
          if (!it) throw new Error('not_found')
          // restore to the pre-interruption state (defaults to queued)
          const backTo = it.previousStatus === 'running' || it.previousStatus === 'asking'
            ? 'running'
            : 'queued'
          if (backTo === 'running') {
            if (!it.sessionId) throw new Error('no_session')
            const agent = await resolveAgent(ctx, it.sessionId)
            if (!agent) throw new Error('no_agent')
            const message = {
              id: crypto.randomUUID(),
              role: 'user',
              content: [{ type: 'text', text: it.text }],
              source: { kind: 'user' },
              memoResume: true,
            }
            agent.followup(message)
          }
          it.status = backTo
          it.updatedAt = Date.now()
          save(cache)
          sendJson(res, 200, { ok: true })
          return
        }

        sendFailure(res, 404, 'not_found')
      } catch (error) {
        const message = error instanceof Error ? error.message : ''
        if (message === 'empty') return sendFailure(res, 400, 'empty')
        if (message === 'not_found') return sendFailure(res, 404, 'not_found')
        if (message === 'no_session') return sendFailure(res, 409, 'no_session')
        if (message === 'no_agent') return sendFailure(res, 409, 'no_agent')
        if (message === 'bad_request') return sendFailure(res, 400, 'bad_request')
        if (message === 'payload_too_large') return sendFailure(res, 413, 'payload_too_large')
        console.error('[memo-notebook] route error:', error)
        sendFailure(res, 500, 'internal_error')
      }
    },
  })

  return async () => {
    unregister()
  }
}
