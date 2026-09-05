Implementation Status: ✅ SPEC UPDATED (JSON schema, gates, effects, deterministic response UI, and relationship-shadow integration aligned to code)

# Dialogue System Specification

Branching conversation system that drives relationships, quest flow, service access, and authored Relationship Experience evidence.

## 1. Overview
- Purpose: Present narrative content and explicit player choices that mutate game state (affinity, quests, inventory, services) and can record durable Relationship Experiences.
- Core Loop: Interact with NPC → Load dialogue node → Render node text and explicit responses → Apply effects → Transition → Exit.
- Migration note: legacy Affinity effects remain authoritative for current gameplay while `RELATIONSHIP_EXPERIENCE` records additive shadow evidence for the Relationship Progression Redesign.

## 2. Data Model (JSON)
- File: `/public/data/dialogues.json` (prototype).
- Runtime nodes use the following shape:

```json
{
  "id": "elder_willow_greeting",
  "npcId": "npc_elder_willow",
  "title": "A Gentle Rustle",
  "text": "...",
  "responses": {
    "admit": "...",
    "deflect": "...",
    "challenge": "..."
  },
  "effects": [
    {
      "type": "RELATIONSHIP_EXPERIENCE",
      "experienceIdByResponse": {
        "admit": "willow_exp_first_question_admit",
        "deflect": "willow_exp_first_question_deflect",
        "challenge": "willow_exp_first_question_challenge"
      }
    }
  ],
  "next": {
    "admit": "elder_willow_wisdom",
    "deflect": null,
    "challenge": "elder_willow_lore"
  }
}
```

Relationship Experience definitions are not embedded in the dialogue file. They live in dedicated relationship-authoring bundles such as:

```text
/public/data/relationships/elder-willow.json
```

This keeps dialogue routing separate from durable relationship semantics.

### 2.1 Conditions (evaluated before showing a choice)
- Examples/current conventions:
  - `HAS_TRAIT { traitId }`
  - `AFFINITY_AT_LEAST { value }`
  - `HAS_ITEM { itemId, quantity }`
  - `QUEST_STATE { questId, state: 'notStarted'|'active'|'completed' }`
  - `CONNECTION_DEPTH_AT_LEAST { npcId, level }`

Not every listed condition has a full generic runtime interpreter yet. Existing node-level `minAffinity` / `minConnectionDepth` fields remain the current lightweight gate mechanism.

### 2.2 Effects (applied on choice select)
- `AFFINITY_DELTA { value }` — updates the legacy NPC Affinity path.
- `UNLOCK_QUEST { questId }` — adds a quest to NPC availability and notifies the player.
- `GIVE_ITEM { itemId, amount }` — grants items to Inventory.
- `OPEN_SERVICE { serviceId }` — informs the player that the relevant service/tab is available.
- `RELATIONSHIP_EXPERIENCE { experienceId }` — records one authored Relationship Experience by stable ID.
- `RELATIONSHIP_EXPERIENCE { experienceIdByResponse }` — maps each explicit response to a mutually exclusive authored Experience variant.

Example:

```json
{
  "type": "RELATIONSHIP_EXPERIENCE",
  "experienceIdByResponse": {
    "respect": "willow_exp_first_question_admit",
    "casual": "willow_exp_first_question_deflect",
    "inquire_lore": "willow_exp_first_question_challenge"
  }
}
```

The authored Experience runtime enforces stable unique keys, so replaying a one-time beat cannot stack its relationship deltas.

Notes:
- Additional planned legacy types such as ADVANCE_QUEST, TAKE_ITEM, and DISCOVER_TRAITS remain deferred.
- Relationship Experience effects are intentionally narrow: they reference authored definitions rather than embedding relationship deltas into dialogue JSON.

## 3. Runtime & State
- Dialogue runtime itself remains transient UI state; there is no dedicated Dialogue slice.
- `/data/dialogues.json` is loaded during NPC initialization into `npcs.dialogueNodes`.
- Legacy effects are dispatched through existing domain thunks/actions.
- `RELATIONSHIP_EXPERIENCE` dispatches `recordAuthoredRelationshipExperienceThunk` in the Relationships feature.
- Relationship events are stored in the normalized `relationships` Redux slice, not duplicated into the NPC dialogue history.
- During M3 shadow mode, the two paths intentionally coexist:

```text
Dialogue choice
├─ legacy effect(s) → current Affinity / current gameplay
└─ RELATIONSHIP_EXPERIENCE → shadow Experience / Memory / Bond Profile evidence
```

This coexistence is temporary and allows side-by-side validation before Connection authority changes.

### 3.1 Next-node relationship evidence

The existing dialogue runtime can resolve the next node immediately after a response. During shadow migration, it may process `RELATIONSHIP_EXPERIENCE` effects found on that resolved next node so that a visible teaching response can create its authored evidence.

It intentionally does **not** automatically execute the next node's unrelated legacy effects. This preserves pre-migration gameplay behavior while allowing relationship evidence to mirror what the player actually saw.

## 4. UI/UX
- Panel embedded in the NPC view with:
  - current node/topic text;
  - one explicit button per authored response;
  - recent conversation history;
  - free-text fallback for prototype experimentation.
- Response selection is deterministic. The UI must never randomly choose a response on the player's behalf because Relationship Experience evidence depends on what the player actually selected.
- Accessibility: responses are normal keyboard-focusable buttons; semantic labels remain visible rather than hidden behind a random topic action.

### 4.1 Elder Willow first proof

The first onboarding dialogue now exposes three explicit reactions to Willow accurately identifying the protagonist's instrumental search for knowledge. Each response maps to a different `WE-01 — She Saw Through the Question` Experience variant.

This is the first runtime proof that dialogue can preserve **why** an interaction mattered instead of reducing every outcome to one Affinity delta.

## 5. Integration
- NPC System:
  - continues to own legacy `affinity`, `connectionDepth`, services, and dialogue history during shadow mode;
  - provides NPC identity/context to Relationship Experience authoring.
- Relationships System:
  - records durable Experiences;
  - applies multidimensional deltas;
  - enforces idempotency;
  - forms explicitly authored landmark Memories;
  - derives the shadow Bond Profile.
- Quest System: unlocks/advances quests; later Willow quest decisions will emit authored Relationship Experiences at resolution.
- Inventory/Trading: GIVE/TAKE_ITEM and shop-opening behavior remains separate.
- Trait System: discovery still occurs through existing NPC interaction behavior; Trait assimilation/Memory gating is a later migration phase.
- Essence System: current generation still reads legacy `connectionDepth`; relationship-derived generation is not cut over in M3.

## 6. Error Handling
- Missing `next` node ends the conversation gracefully.
- Unknown legacy effects remain safely ignored by the existing loop.
- An unknown authored Relationship Experience is rejected by the Relationships thunk rather than inventing state.
- Relationship definition fetch failures are retryable; a failed fetch does not permanently poison the definition cache.
- Stable unique keys prevent duplicate application of one-time authored beats.
- Defensive gating: insufficient affinity blocks legacy gated choices and can show a hint.

## 7. Migration Boundary

M3 establishes the relationship evidence path without changing current progression authority.

Implemented in M3:
- explicit deterministic responses;
- `RELATIONSHIP_EXPERIENCE` dialogue effect;
- authored Willow Experience definitions;
- idempotent Experience recording;
- authored Memory formation;
- shadow Bond Profile/debug visibility.

Not yet authoritative:
- qualified Connection Level progression;
- relationship-derived Essence generation;
- Trait assimilation;
- Memory/assimilation-gated permanent Resonance;
- the complete Ancient Seed decision branch.

Those changes must follow the staged migration in `../Technical/RelationshipSystemMigrationPlan.md` rather than being folded silently into dialogue handling.

## 8. Roadmap (Deferred)
- Localized strings with i18n and variable interpolation.
- Dialogue variables, flags, and script expressions.
- Re-usable subtrees and includes to reduce duplication.
- Cinematic sequencing hooks (animations, sound cues).
- Generic authored conditions over Bond Profile dimensions and Memories after the relationship runtime becomes authoritative.
