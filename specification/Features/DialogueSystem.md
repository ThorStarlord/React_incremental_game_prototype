Implementation Status: 📋 SPEC COMPLETE (runtime + UI wired in NPCs page planned)

# Dialogue System Specification

Branching conversation system that drives relationships, quest flow, and service access.

## 1. Overview
- Purpose: Present narrative content and choices that mutate game state (affinity, quests, inventory, services) and unlock systems (trading, traits).
- Core Loop: Interact with NPC → Load dialogue tree → Render node text/choices → Apply effects → Transition → Exit.

## 2. Data Model (JSON)
- File: `/public/data/dialogues.json` (prototype) with structure:
```json
{
	"npcId": "npc_alex",
	"trees": {
		"intro": {
			"start": "n1",
			"nodes": {
				"n1": {
					"text": "string or i18n key",
					"choices": [
						{ "id": "c1", "label": "...", "next": "n2", "conditions": [ ... ], "effects": [ ... ] },
						{ "id": "c2", "label": "...", "next": null, "effects": [ ... ] }
					]
				},
				"n2": { "text": "...", "choices": [ ... ] }
			}
		}
	}
}
```

### 2.1 Conditions (evaluated before showing a choice)
- Examples:
	- `HAS_TRAIT { traitId }`
	- `AFFINITY_AT_LEAST { value }`
	- `HAS_ITEM { itemId, quantity }`
	- `QUEST_STATE { questId, state: 'notStarted'|'active'|'completed' }`
	- `CONNECTION_DEPTH_AT_LEAST { npcId, level }`

### 2.2 Effects (applied on choice select)
- `AFFINITY_DELTA { npcId, amount }`
- `UNLOCK_QUEST { questId }`
- `ADVANCE_QUEST { questId, objectiveId }`
- `GIVE_ITEM { itemId, quantity }`
- `TAKE_ITEM { itemId, quantity }`
- `OPEN_SERVICE { service: 'shop'|'training'|'resonance' }`
- `DISCOVER_TRAITS { traitIds: string[] }`

## 3. Runtime & Slice
- Dialogue runtime held transiently in UI state (no dedicated Redux slice required for MVP).
- Selector helpers read NPC relationship and inventory to evaluate conditions.
- Effects are dispatched via domain thunks (Quest, Inventory, NPC, Traits, Trading).

## 4. UI/UX
- Panel embedded in NPC view with:
	- Node text (supports i18n keys later).
	- List of visible choices (disabled choices can show tooltip with unmet condition).
	- Back/Exit when appropriate.
- Accessibility: keyboard navigation for choices; screen-reader friendly structure.

## 5. Integration
- NPC System: adjusts `affinity` and reads `connectionDepth` for gates.
- Quest System: unlocks/advances quests; puzzle modal can be launched by `OPEN_SERVICE: 'puzzle'` if needed.
- Inventory/Trading: GIVE/TAKE_ITEM and shop opening.
- Trait System: discovery on interaction.

## 6. Error Handling
- Missing `next` node ends conversation gracefully.
- Unknown effect/condition logs a warning and is skipped.
- Circular references detection (dev-only) to avoid infinite loops.

## 7. Roadmap (Deferred)
- Localized strings with i18n and variable interpolation.
- Dialogue variables, flags, and script expressions.
- Re-usable subtrees and includes to reduce duplication.
- Cinematic sequencing hooks (animations, sound cues).
