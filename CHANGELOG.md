# Changelog

All notable changes to dsh-memo-notebook are documented in this file.

## [1.0.0] - 2026-08-27

### Added
- Per-workspace memo/todo panel for DeepSeek Harness (dsh)
- Auto-capture of queued/running user instructions via `agent/inbox/inserted`
- Preempt interrupt: new message marks old tasks `interrupted` and records `previousStatus`
- One-click restore: returns tasks to their previous state (queued → queued, running → running)
- Line-through completion (kept, not deleted) with manual/auto completion distinction
- Status filters: all / queued / running / asking / failed / interrupted / completed (failed merges error)
- Floating panel pinned between sidebar and settings; draggable title bar with persisted position
- Synchronous disk persistence (writeFileSync) — no data loss on web restart
- SSE live updates via `/api/memo/events`
- Batch operations: complete / remove / resume
