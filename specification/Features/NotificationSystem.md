Implementation Status: ✅ IMPLEMENTED (slice + toasts) — extendable

# Notification System Specification

Global, lightweight feedback mechanism for actions and events.

## 1. Overview
- Purpose: Provide consistent, non-blocking user feedback with severity and optional actions.
- Core Loop: Feature dispatches notification → UI displays → Auto-dismiss/manual clear.

## 2. Data Model & Slice
- Slice key: `notifications`
- Notification shape:
	- id: string
	- message: string
	- severity: 'success' | 'error' | 'info' | 'warning'
	- timeoutMs?: number (default from constants)
	- action?: { label: string; onClickType: string; payload?: any } (dispatched action type)
	- context?: string (e.g., 'trading', 'traits') for filtering/logging
- Reducers/actions:
	- enqueueNotification(payload)
	- dismissNotification(id)
	- clearAll()

## 3. UI/UX
- Toast stack (top-right by default), max N visible, with auto-dismiss and hover pause.
- Notification Center panel (optional) to review recent messages.
- Accessible: role="status"/"alert" based on severity; focus management for critical errors.

## 4. Integration
- Trait equip/resonate, Copy actions, Quest updates, Save/Load results, Trading transactions.
- Listener middleware can intercept domain events and enqueue standardized messages.

## 5. Constants
- `NOTIFICATIONS` in `gameConstants.ts`:
	- DEFAULT_TIMEOUT_MS, MAX_VISIBLE_TOASTS, ERROR_PERSIST_MS.

## 6. Roadmap (Deferred)
- Per-feature channels and mute toggles (from Settings).
- Rich notifications with inline buttons and deep links (e.g., "Open Quest Log").
