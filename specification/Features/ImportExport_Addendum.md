Implementation Status: ✅ IMPLEMENTED (manual export/import) — versioned format

# Import/Export Addendum

This addendum formalizes the transferable save format and validation rules.

## 1. Overview
- Purpose: Enable safe transfer of game progress as a shareable string.
- Core Loop: Export → Copy code → Paste to import → Validate → Replace state.

## 2. Format
- Envelope: base64(UTF-8(JSON)) with whitespace trimmed.
- JSON schema (conceptual):
```json
{
	"version": "1.0.0",
	"timestamp": 1712345678901,
	"slices": {
		"player": { /* ... */ },
		"traits": { /* ... */ },
		"npc": { /* ... */ },
		"copy": { /* ... */ },
		"inventory": { /* ... */ },
		"quest": { /* ... */ },
		"settings": { /* ... */ },
		"meta": { /* ... */ }
	}
}
```

## 3. Validation & Safety
- Steps on import:
	1) Base64 decode → JSON parse; reject on failure.
	2) Require `version` and `slices` keys; reject otherwise.
	3) Optional per-slice shape checks (basic guards only in prototype).
	4) Migrations: run `applyMigrations(save.version)` to current version.
	5) Replace full Redux state via `meta/replaceState` action.
- Security: no code execution, user-only local data; redact PII if ever introduced.

## 4. Migrations
- Copy–Trait slots: backfill `traitSlots` for Copies if missing (see Save/Load spec).
- Future migrations appended as pure functions; never mutate original imported object.

## 5. UI/UX
- Export: button produces code and copies to clipboard with a success toast.
- Import: text area + "Validate" preview (optional) + "Import"; errors shown inline.
- Warning modal: "This will overwrite your current progress" with confirm.

## 6. Integration
- Save/Load: serialization/deserialization and state replacement.
- Settings: optional flags for including/excluding settings in exports.
- Notifications: success/failure results.

## 7. Roadmap (Deferred)
- Compressed (gzip) variant for shorter codes.
- QR code export/import for mobile.
- Partial exports (single character slot / feature-only exports).
