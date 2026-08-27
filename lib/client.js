window.__ModuleLoader__.load({
	id: "memo-notebook",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		const { createElement } = react;

		const CSS = [
			'.memo-panel button{appearance:none;-webkit-appearance:none}',
			'.memo-toggle{box-sizing:border-box;display:flex;align-items:center;gap:8px;width:calc(100% + 8px);height:34px;margin:4px -4px;padding:6px 2px 6px 10px;border:0;border-radius:12px;background:transparent;color:var(--dsw-alias-label-primary,#16181d);font:14px/22px system-ui;cursor:pointer}',
			'.memo-toggle:hover{background:var(--dsw-alias-interactive-bg-hover,#f1f3f6)}',
			'.memo-toggle.is-rail{width:36px;height:36px;margin:8px 0 10px;padding:0;justify-content:center;border-radius:12px}',
			'.memo-toggle__icon{position:relative;box-sizing:border-box;flex:none;width:14px;height:16px;border:1.7px solid currentColor;border-radius:12px}',
			'.memo-toggle__icon::after{position:absolute;left:3px;top:4px;width:6px;height:1.5px;border-radius:2px;background:currentColor;content:""}',
			'.memo-toggle__icon::before{position:absolute;left:3px;top:8px;width:6px;height:1.5px;border-radius:2px;background:currentColor;content:""}',
			'.memo-toggle__label{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}',
			'.memo-panel{position:fixed;top:24px;right:24px;z-index:900;box-sizing:border-box;width:360px;max-width:calc(100vw - 48px);max-height:min(75vh,680px);display:flex;flex-direction:column;border:1px solid var(--dsw-alias-border-normal,#cfd5dd);border-radius:12px;background:var(--dsw-alias-surface-panel,#ffffff);color:var(--dsw-alias-label-primary,#16181d);box-shadow:0 8px 30px rgba(0,0,0,.18);font:13px/1.5 system-ui;overflow:hidden}',
			'.memo-panel.is-dragging{transition:none}',
			'.memo-panel__head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;border-bottom:1px solid var(--dsw-alias-border-subtle,#e1e5eb);font-weight:600;cursor:move;user-select:none;touch-action:none}',
			'.memo-panel__head:active{cursor:grabbing}',
			'.memo-panel__head-left{display:flex;align-items:center;gap:8px;min-width:0}',
			'.memo-panel__head-ops{display:flex;align-items:center;gap:6px}',
			'.memo-panel__btn{flex:none;min-height:26px;padding:2px 10px;border:1px solid var(--dsw-alias-border-normal,#cfd5dd);border-radius:12px;background:transparent;color:inherit;font:12px/1.4 system-ui;cursor:pointer}',
			'.memo-panel__btn.primary{border-color:var(--dsw-alias-brand-normal,#3b82f6);background:var(--dsw-alias-brand-normal,#3b82f6);color:#fff}',
			'.memo-panel__btn:disabled{opacity:.45;cursor:default}',
			'.memo-panel__btn.danger{border-color:rgba(220,38,38,.55);color:#dc2626}',
			'.memo-panel__bar{display:flex;align-items:center;gap:6px;flex-wrap:nowrap;padding:8px 14px;border-bottom:1px solid var(--dsw-alias-border-subtle,#e1e5eb);background:var(--dsw-alias-interactive-bg-hover,#f4f6f9)}',
			'.memo-panel__bar-count{flex:0 1 auto;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:12px;color:var(--dsw-alias-label-secondary,#606873)}',
			'.memo-panel__bar .memo-panel__btn{flex:none;min-height:24px;padding:2px 6px;font-size:11px;border-radius:12px}',
			'.memo-panel__filter{display:flex;align-items:center;gap:4px;flex-wrap:wrap;padding:6px 14px;border-bottom:1px solid var(--dsw-alias-border-subtle,#e1e5eb);background:var(--dsw-alias-interactive-bg-hover,#f4f6f9)}',
			'.memo-filter__btn{flex:none;min-height:24px;padding:2px 8px;border:1px solid var(--dsw-alias-border-normal,#cfd5dd);border-radius:12px;background:transparent;color:inherit;font:12px/1.4 system-ui;cursor:pointer}',
			'.memo-filter__btn:hover{background:var(--dsw-alias-interactive-bg-hover,#eef1f5)}',
			'.memo-filter__btn--all{border-color:#a8b3bf;color:#606873}',
			'.memo-filter__btn--queued{border-color:var(--dsw-alias-brand-normal,#3b82f6);color:#3b82f6}',
			'.memo-filter__btn--running{border-color:#b45309;color:#b45309}',
			'.memo-filter__btn--asking{border-color:#7c3aed;color:#7c3aed}',
			'.memo-filter__btn--failed{border-color:#dc2626;color:#dc2626}',
			'.memo-filter__btn--error{border-color:#991b1b;color:#991b1b}',
			'.memo-filter__btn--interrupted{border-color:#ea580c;color:#ea580c}',
			'.memo-filter__btn--completed{border-color:#9ca3af;color:#6b7280}',
			'.memo-filter__btn.active{border-color:var(--dsw-alias-brand-normal,#3b82f6);background:var(--dsw-alias-brand-normal,#3b82f6);color:#fff}',
			'.memo-filter__btn--all.active{border-color:#606873;background:#606873;color:#fff}',
			'.memo-filter__btn--queued.active{border-color:#3b82f6;background:#3b82f6;color:#fff}',
			'.memo-filter__btn--running.active{border-color:#b45309;background:#b45309;color:#fff}',
			'.memo-filter__btn--asking.active{border-color:#7c3aed;background:#7c3aed;color:#fff}',
			'.memo-filter__btn--failed.active{border-color:#dc2626;background:#dc2626;color:#fff}',
			'.memo-filter__btn--error.active{border-color:#991b1b;background:#991b1b;color:#fff}',
			'.memo-filter__btn--interrupted.active{border-color:#ea580c;background:#ea580c;color:#fff}',
			'.memo-filter__btn--completed.active{border-color:#6b7280;background:#6b7280;color:#fff}',
			'.memo-panel__body{padding:10px 14px;overflow-y:auto}',
			'.memo-panel__add{display:flex;gap:8px;margin-bottom:10px}',
			'.memo-panel__input{flex:1 1 0;min-width:0;box-sizing:border-box;min-height:32px;padding:5px 8px;border:1px solid var(--dsw-alias-border-normal,#cfd5dd);border-radius:12px;background:var(--dsw-alias-surface-input,#ffffff);color:inherit;font:13px/1.4 system-ui;outline:none}',
			'.memo-panel__input:focus{border-color:var(--dsw-alias-brand-normal,#3b82f6)}',
			'.memo-panel__msg{color:var(--dsw-alias-label-secondary,#606873);font-size:12px;margin:6px 0}',
			'.memo-item{position:relative;padding:10px 0 8px 26px;border-bottom:1px solid var(--dsw-alias-border-subtle,#e1e5eb)}',
			'.memo-item:last-child{border-bottom:0}',
			'.memo-item__check{position:absolute;left:0;top:14px;width:16px;height:16px;margin:0;cursor:pointer;accent-color:var(--dsw-alias-brand-normal,#3b82f6)}',
			'.memo-item__text{white-space:pre-wrap;word-break:break-word;font-size:13px;padding-right:128px}',
			'.memo-item__meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:4px;font-size:11px;color:var(--dsw-alias-label-secondary,#606873)}',
			'.memo-item__status{flex:none;padding:0 6px;border-radius:12px;font-size:10px;line-height:16px}',
			'.memo-item__status.queued{background:rgba(59,130,246,.12);color:#3b82f6}',
			'.memo-item__status.running{background:rgba(234,179,8,.16);color:#b45309}',
			'.memo-item__status.asking{background:rgba(168,85,247,.14);color:#7c3aed}',
			'.memo-item__status.failed{background:rgba(239,68,68,.12);color:#dc2626}',
			'.memo-item__status.error{background:rgba(127,29,29,.12);color:#991b1b}',
			'.memo-item__status.interrupted{background:rgba(234,88,12,.12);color:#ea580c}',
			'.memo-item__status.completed{background:rgba(107,114,128,.14);color:#6b7280}',
			'.memo-item.is-completed{opacity:.6}',
			'.memo-item.is-completed .memo-item__text{text-decoration:line-through}',
			'.memo-item.is-completed .memo-item__ws{display:none}',
			'.memo-item.is-completed .memo-item__op{opacity:.55}',
			'.memo-item__ws{position:absolute;top:8px;right:6px;max-width:calc(100% - 132px);box-sizing:border-box;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:1px 6px;border-radius:12px;background:rgba(59,130,246,.10);color:#3b82f6;font-size:10px;line-height:16px;text-align:right}',
			'.memo-item__ops{display:flex;gap:6px;margin-top:6px}',
			'.memo-item__op{flex:none;min-height:24px;padding:2px 8px;border:1px solid var(--dsw-alias-border-normal,#cfd5dd);border-radius:12px;background:transparent;color:inherit;font:12px/1.4 system-ui;cursor:pointer}',
			'.memo-item__op.primary{border-color:var(--dsw-alias-brand-normal,#3b82f6);color:#3b82f6}',
			'.memo-item__op.danger{border-color:rgba(220,38,38,.5);color:#dc2626}',
		].join('')

		async function requestJson(path, init) {
			const response = await fetch(path, {
				...init,
				headers: {
					'content-type': 'application/json',
					...(init && init.headers),
				},
			})
			const body = await response.json()
			if (!response.ok) throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${String(response.status)}`)
			return body
		}

		/** Mount the memo control button and overlay panel. */
		function apply(ctx) {
			const slots = ctx.get('slots')
			if (slots === undefined) return

			const store = {
				open: false,
				items: [],
				loading: false,
				error: '',
				draft: '',
				selected: new Set(),
				filter: 'all',
				pos: loadPos(),
				dragging: false,
				listeners: new Set(),
				eventSource: null,
			}

			function loadPos() {
				try {
					const raw = localStorage.getItem('memo-panel-pos')
					if (!raw) return null
					const p = JSON.parse(raw)
					if (typeof p.left === 'number' && typeof p.top === 'number') return p
				} catch {}
				return null
			}
			function savePos() {
				try {
					if (store.pos) localStorage.setItem('memo-panel-pos', JSON.stringify(store.pos))
				} catch {}
			}

			// --- panel helpers (defined once at apply scope so the memoized row
			// component keeps a stable identity across renders) ---
			const basename = (p) => {
				const parts = String(p || '').split(/[\\/]/)
				return parts[parts.length - 1] || ''
			}
			const fmt = (t) => {
				try {
					return new Date(t).toLocaleString()
				} catch {
					return ''
				}
			}
			const statusLabel = (st) => {
				switch (st) {
					case 'queued': return '排队'
					case 'running': return '正在进行'
					case 'asking': return '提问'
					case 'failed': return '失败'
					case 'error': return '失败'
					case 'interrupted': return '打断'
					case 'completed': return '已完成'
					default: return '已完成'
				}
			}
			function emit() {
				store.listeners.forEach((fn) => fn())
			}
			function subscribe(fn) {
				store.listeners.add(fn)
				return () => store.listeners.delete(fn)
			}

			async function refresh() {
				store.loading = true
				emit()
				try {
					const res = await requestJson('/api/memo/list')
					store.items = Array.isArray(res.items) ? res.items : []
					store.error = ''
				} catch (e) {
					store.error = String((e && e.message) || e)
				}
				store.loading = false
				emit()
			}

			function stopLive() {
				if (store.eventSource) {
					try {
						store.eventSource.close()
					} catch { /* ignore */ }
					store.eventSource = null
				}
			}

			function startLive() {
				stopLive()
				try {
					const es = new EventSource('/api/memo/events')
					store.eventSource = es
					let pending = null
					es.onmessage = () => {
						// state changed server-side -> refetch without flashing loading.
						// debounce so bursty saves (batch ops) collapse into one fetch
						if (pending) return
						pending = setTimeout(() => {
							pending = null
							requestJson('/api/memo/list')
								.then((res) => {
									store.items = Array.isArray(res.items) ? res.items : []
									store.error = ''
									emit()
								})
								.catch((e) => {
									store.error = String((e && e.message) || e)
									emit()
								})
						}, 150)
					}
					es.onerror = () => {
						// transient reconnect handled by the browser; fall back to a poll
					}
				} catch {
					store.eventSource = null
				}
			}

			async function call(method, args) {
				try {
					await requestJson(method, { method: 'POST', body: JSON.stringify(args || {}) })
				} catch (e) {
					store.error = String((e && e.message) || e)
					emit()
				}
				refresh()
			}

			async function batch(method) {
				const ids = [...store.selected]
				if (ids.length === 0) return
				try {
					await requestJson(method, { method: 'POST', body: JSON.stringify({ ids }) })
				} catch (e) {
					store.error = String((e && e.message) || e)
					emit()
				}
				// local immediate update: complete marks rows (they sink to the bottom),
				// remove drops them. No refresh() here: the debounced SSE ping
				// reconciles with the server, so the click stays instant.
				const idSet = new Set(ids)
				if (method === '/api/memo/batch-complete') {
					for (const i of store.items) {
						if (idSet.has(i.id)) {
							i.status = 'completed'
							i.updatedAt = Date.now()
						}
					}
				} else if (method === '/api/memo/batch-remove') {
					store.items = store.items.filter((i) => !idSet.has(i.id))
				}
				store.selected.clear()
				emit()
			}

			const style = document.createElement('style')
			style.dataset.plugin = 'memo-notebook'
			style.textContent = CSS
			document.head.append(style)

			slots.inject('sidebar.footer.action', () => slots.register(
				{ name: 'sidebar.footer.action', id: 'memo-toggle', order: 5 },
				({ wide }) => createElement('button', {
					type: 'button',
					'aria-label': '备忘录',
					title: '备忘录',
					className: `memo-toggle${wide ? '' : ' is-rail'}`,
					onClick: () => {
						store.open = !store.open
						emit()
						if (store.open) {
							refresh()
							startLive()
						} else {
							stopLive()
						}
					},
				}, createElement('span', { 'aria-hidden': true, className: 'memo-toggle__icon' }),
					wide ? createElement('span', { className: 'memo-toggle__label' }, '备忘录') : undefined),
			))

			// --- native-DOM floating panel, mounted directly on <body> ---
			// Mounted outside the React tree and outside the shell's overlay layer
			// so it paints above everything (dsh-better-sidebar floats included).
			// Uses native events only — no React synthetic event delegation to break.
			const panelEl = document.createElement('div')
			panelEl.className = 'memo-panel'
			panelEl.style.zIndex = '900'
			document.body.appendChild(panelEl)

			const FILTERS = [
				{ key: 'all', label: '全部', cls: '--all' },
				{ key: 'queued', label: '排队', cls: '--queued' },
				{ key: 'running', label: '正在进行', cls: '--running' },
				{ key: 'asking', label: '提问', cls: '--asking' },
				{ key: 'failed', label: '失败', cls: '--failed' },
				{ key: 'interrupted', label: '打断', cls: '--interrupted' },
				{ key: 'completed', label: '已完成', cls: '--completed' },
			]

			function el(tag, cls, text) {
				const node = document.createElement(tag)
				if (cls) node.className = cls
				if (text !== undefined) node.textContent = text
				return node
			}

			// --- panel DOM refs (built once, updated in place) ---
			const panelRefs = {
				built: false,
				barCount: null,
				selectAllBtn: null,
				batchBtns: [],
				filterBtns: [],
				input: null,
				listEl: null,
			}

			function buildPanel() {
				if (panelRefs.built) return
				panelRefs.built = true

				// --- head ---
				const head = el('div', 'memo-panel__head')
				head.title = '拖动标题栏可移动窗口'
				const headLeft = el('div', 'memo-panel__head-left')
				headLeft.appendChild(el('span', null, '备忘录'))
				headLeft.appendChild(el('span', 'memo-panel__msg', `${store.items.length} 条`))
				head.appendChild(headLeft)
				const headOps = el('div', 'memo-panel__head-ops')
				const closeBtn = el('button', 'memo-panel__btn', '关闭')
				closeBtn.type = 'button'
				closeBtn.addEventListener('click', () => { store.open = false; stopLive(); emit() })
				headOps.appendChild(closeBtn)
				head.appendChild(headOps)
				// drag
				head.addEventListener('pointerdown', (e) => {
					if (e.button !== 0) return
					const rect = panelEl.getBoundingClientRect()
					const startX = e.clientX, startY = e.clientY
					const startLeft = rect.left, startTop = rect.top
					store.dragging = true
					emit()
					const onMove = (ev) => {
						store.pos = { left: Math.max(0, startLeft + ev.clientX - startX), top: Math.max(0, startTop + ev.clientY - startY) }
						emit()
					}
					const onUp = () => {
						store.dragging = false
						savePos()
						emit()
						window.removeEventListener('pointermove', onMove)
						window.removeEventListener('pointerup', onUp)
					}
					window.addEventListener('pointermove', onMove)
					window.addEventListener('pointerup', onUp)
					e.preventDefault()
				})
				panelEl.appendChild(head)

				// --- bar ---
				const bar = el('div', 'memo-panel__bar')
				panelRefs.barCount = el('span', 'memo-panel__bar-count', '未选择')
				bar.appendChild(panelRefs.barCount)
				panelRefs.selectAllBtn = el('button', 'memo-panel__btn', '全选')
				panelRefs.selectAllBtn.type = 'button'
				panelRefs.selectAllBtn.addEventListener('click', () => {
					const visible = visibleItems()
					if (store.selected.size === visible.length) store.selected.clear()
					else visible.forEach((i) => store.selected.add(i.id))
					emit()
				})
				bar.appendChild(panelRefs.selectAllBtn)
				const mkBarBtn = (label, cls, method) => {
					const b = el('button', `memo-panel__btn${cls ? ` ${cls}` : ''}`, label)
					b.type = 'button'
					b.disabled = true
					b.addEventListener('click', () => batch(method))
					bar.appendChild(b)
					panelRefs.batchBtns.push(b)
					return b
				}
				mkBarBtn('一键恢复', 'primary', '/api/memo/batch-resume')
				mkBarBtn('一键完成', '', '/api/memo/batch-complete')
				mkBarBtn('一键删除', 'danger', '/api/memo/batch-remove')
				panelEl.appendChild(bar)

				// --- filter ---
				const filter = el('div', 'memo-panel__filter')
				for (const f of FILTERS) {
					const b = el('button', `memo-filter__btn${f.cls}`, `${f.label} 0`)
					b.classList.add('memo-filter__btn')
					b.type = 'button'
					b.addEventListener('click', () => {
						store.filter = f.key
						for (const id of [...store.selected]) {
							const it = store.items.find((i) => i.id === id)
							if (it && f.key !== 'all' && !matchesFilter(it.status, f.key)) store.selected.delete(id)
						}
						emit()
					})
					filter.appendChild(b)
					panelRefs.filterBtns.push(b)
				}
				panelEl.appendChild(filter)

				// --- body: add row + list ---
				const body = el('div', 'memo-panel__body')
				const addRow = el('div', 'memo-panel__add')
				panelRefs.input = el('input', 'memo-panel__input')
				panelRefs.input.placeholder = '记一条待办…'
				panelRefs.input.addEventListener('input', (e) => { store.draft = e.target.value })
				panelRefs.input.addEventListener('keydown', (e) => {
					if (e.key === 'Enter' && store.draft.trim()) {
						const text = store.draft.trim()
						store.draft = ''
						panelRefs.input.value = ''
						call('/api/memo/add', { text })
					}
				})
				addRow.appendChild(panelRefs.input)
				const addBtn = el('button', 'memo-panel__btn primary', '添加')
				addBtn.type = 'button'
				addBtn.addEventListener('click', () => {
					if (!store.draft.trim()) return
					const text = store.draft.trim()
					store.draft = ''
					panelRefs.input.value = ''
					call('/api/memo/add', { text })
				})
				addRow.appendChild(addBtn)
				body.appendChild(addRow)
				panelRefs.listEl = el('div', 'memo-panel__list')
				body.appendChild(panelRefs.listEl)
				panelEl.appendChild(body)
			}

			// 'failed' and 'error' share one bucket in the UI (错误 merged into 失败)
			function matchesFilter(st, key) {
				if (key === 'all') return true
				if (key === 'failed') return st === 'failed' || st === 'error'
				return st === key
			}

			function visibleItems() {
				return (store.filter === 'all' ? store.items : store.items.filter((i) => matchesFilter(i.status, store.filter)))
					.slice()
					.sort((a, b) => {
						const da = a.status === 'completed' ? 1 : 0
						const db = b.status === 'completed' ? 1 : 0
						if (da !== db) return da - db
						return (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0)
					})
			}

			function renderList() {
				const visible = visibleItems()
				const list = panelRefs.listEl
				list.textContent = ''
				if (store.error) list.appendChild(el('div', 'memo-panel__msg', store.error))
				if (store.loading && visible.length === 0) list.appendChild(el('div', 'memo-panel__msg', '加载中…'))
				if (visible.length === 0 && !store.loading) {
					list.appendChild(el('div', 'memo-panel__msg',
						store.items.length === 0
							? '暂无备忘录。发给助手的新指令会自动捕获到这里，完成后自动划线标记。'
							: `当前分类（${statusLabel(store.filter)}）暂无条目。`))
				}
				for (const it of visible) {
					const item = el('div', `memo-item${it.status === 'completed' ? ' is-completed' : ''}`)
					const cb = el('input', 'memo-item__check')
					cb.type = 'checkbox'
					cb.checked = store.selected.has(it.id)
					cb.addEventListener('change', () => {
						if (store.selected.has(it.id)) store.selected.delete(it.id)
						else store.selected.add(it.id)
						emit()
					})
					item.appendChild(cb)
					item.appendChild(el('div', 'memo-item__text', it.text))
					if (it.cwd) {
						const ws = el('div', 'memo-item__ws', basename(it.cwd))
						ws.title = it.cwd
						item.appendChild(ws)
					}
					const meta = el('div', 'memo-item__meta')
					meta.appendChild(el('span', `memo-item__status ${it.status}`, statusLabel(it.status)))
					meta.appendChild(el('span', null, fmt(it.createdAt)))
					item.appendChild(meta)
					const ops = el('div', 'memo-item__ops')
					const done = it.status === 'completed'
					if (!done && it.sessionId) {
						const rb = el('button', 'memo-item__op primary', '恢复')
						rb.type = 'button'
						rb.addEventListener('click', () => call('/api/memo/resume', { id: it.id }))
						ops.appendChild(rb)
					}
					if (!done) {
						const cb2 = el('button', 'memo-item__op', '完成')
						cb2.type = 'button'
						cb2.addEventListener('click', () => call('/api/memo/complete', { id: it.id }))
						ops.appendChild(cb2)
					}
					const db = el('button', 'memo-item__op danger', '删除')
					db.type = 'button'
					db.addEventListener('click', () => call('/api/memo/remove', { id: it.id }))
					ops.appendChild(db)
					item.appendChild(ops)
					list.appendChild(item)
				}
			}

			function renderPanel() {
				if (!store.open) {
					panelEl.style.display = 'none'
					return
				}
				panelEl.style.display = ''
				// position
				if (store.pos) {
					panelEl.style.left = `${store.pos.left}px`
					panelEl.style.top = `${store.pos.top}px`
					panelEl.style.right = 'auto'
				} else {
					panelEl.style.right = '24px'
					panelEl.style.top = '24px'
				}
				panelEl.classList.toggle('is-dragging', store.dragging)
				buildPanel()

				// head count
				panelEl.querySelector('.memo-panel__head .memo-panel__msg').textContent = store.items.length > 0 ? `${store.items.length} 条` : ''

				// bar state
				panelRefs.barCount.textContent = store.selected.size === 0 ? '未选择' : `已选 ${store.selected.size} 条`
				const visible = visibleItems()
				panelRefs.selectAllBtn.textContent = store.selected.size === visible.length && visible.length > 0 ? '取消' : '全选'
				panelRefs.batchBtns.forEach((b) => { b.disabled = store.selected.size === 0 })

				// filter state + counts
				const countOf = (key) => (key === 'all' ? store.items.length : store.items.filter((i) => matchesFilter(i.status, key)).length)
				FILTERS.forEach((f, i) => {
					const b = panelRefs.filterBtns[i]
					b.textContent = `${f.label} ${countOf(f.key)}`
					b.classList.toggle('active', store.filter === f.key)
				})

				renderList()
			}

			subscribe(renderPanel)
			renderPanel()

			return () => {
				stopLive()
				style.remove()
				panelEl.remove()
			}
		}
		const inject = ['slots'];
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
