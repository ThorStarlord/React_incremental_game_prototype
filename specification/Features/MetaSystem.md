Implementation Status: ✅ BASIC STATE PRESENT VIA Save/Load integration (extendable)

# Meta System Specification

Tracks session lifecycle and global metadata not owned by a specific feature slice.

## 1. Overview
- Purpose: Provide session IDs, timestamps, build/version info, and autosave flags to coordinate persistence and analytics.
- Core Loop: App launch → Session start → Periodic updates (auto-save) → Session end.

## 2. Data Model & Slice
- Slice key: `meta`
- Fields:
	- sessionId: string (UUID)
	- appVersion: string (from package.json or constants)
	- createdAt: number (epoch ms)
	- updatedAt: number (epoch ms) — touch on save and significant events
	- autosaveEnabled: boolean (mirrors Settings with immediate persistence)
	- lastManualSaveAt?: number
	- lastAutoSaveAt?: number
- Reducers:
	- setAutosaveEnabled(boolean)
	- touchUpdatedAt()
	- setSaveTimestamps({ type: 'auto'|'manual', at: number })

## 3. UI/UX
- Save/Load panel shows session info, timestamps, and autosave toggle (proxy to Settings slice).
- Footer/status bar indicator for autosave events (optional).

## 4. Integration
- Save/Load: Store meta fields in root save; unaffected by slice migrations.
- Settings: source of truth for autosave interval and toggle; Meta mirrors toggle for quick read.
- GameLoop: on auto-save, dispatch `setSaveTimestamps` with type 'auto'.

## 5. Error Handling
- Missing version defaults to 'dev'.
- If invalid timestamps encountered, reset to current time and notify (debug only).

## 6. Roadmap (Deferred)
- Session analytics (durations per page/feature, opt-in).
- A/B flags or feature toggles for experiments.
