# Dialogue System Specification

**Implementation Status:** ✅ Data-driven dialogue + deterministic responses + Relationship evidence gates + opt-in one-shot decisions

The Dialogue system presents explicit player choices, applies authored effects, unlocks quests/services/items, can record durable Relationship Experiences, and can explicitly mark a decision topic as non-repeatable when its authored meaning requires one historical outcome.

## 1. Runtime shape

Dialogue nodes are loaded from:

`/public/data/dialogues.json`

A current node may contain:

```json
{
  "id": "willow_three_nights_teaching",
  "npcId": "npc_elder_willow",
  "title": "Three Nights of Teaching",
  "text": "...",
  "requiredExperienceIds": ["willow_exp_willow_disagrees"],
  "responses": {
    "begin": "Begin.",
    "later": "Not yet."
  },
  "effects": [
    {
      "type": "RELATIONSHIP_EXPERIENCE",
      "experienceId": "willow_exp_three_nights_teaching",
      "responseId": "begin"
    }
  ],
  "next": {
    "begin": null,
    "later": null
  }
}
```

Relationship Experience definitions themselves live in dedicated bundles such as:

`/public/data/relationships/elder-willow.json`

Dialogue routing therefore stays separate from durable relationship semantics.

## 2. Deterministic player response

The prototype previously selected a response randomly after a dialogue topic click.

That behavior is incompatible with durable relationship evidence because the recorded consequence could differ from the player's actual choice.

The current UI renders each authored response as an explicit button and dispatches the exact response id selected by the player.

## 3. Evidence gates

Dialogue supports two relationship-evidence gates on topics.

### All required Experiences

```json
"requiredExperienceIds": ["experience_a", "experience_b"]
```

Every listed Experience must exist.

### At least one alternative Experience

```json
"anyOfExperienceIds": ["choice_a", "choice_b"]
```

At least one listed Experience must exist.

The UI hides topics whose evidence gate is not satisfied, and the interaction thunk checks the same rule defensively so a caller cannot bypass the presentation layer.

These are evidence gates, not Affinity thresholds.

## 4. Effects

Current effect types include:

### `AFFINITY_DELTA`

```json
{ "type": "AFFINITY_DELTA", "value": 2 }
```

Applies the legacy short-horizon NPC relationship delta.

For Relationship-authoritative content, authored Affinity is normally carried inside the Relationship Experience itself so the same causal event drives both the Bond Profile and compatibility projection.

### `UNLOCK_QUEST`

```json
{ "type": "UNLOCK_QUEST", "questId": "quest_id" }
```

Adds the quest to the current NPC's available quests.

### `GIVE_ITEM`

```json
{ "type": "GIVE_ITEM", "itemId": "item_id", "amount": 1 }
```

Adds an item through Inventory state.

### `OPEN_SERVICE`

Signals that a service is available through the appropriate NPC surface.

### `RELATIONSHIP_EXPERIENCE`

Fixed event:

```json
{
  "type": "RELATIONSHIP_EXPERIENCE",
  "experienceId": "willow_exp_first_lesson"
}
```

Response-mapped event:

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

The effect records the durable authored Experience through the Relationships domain. The Relationship thunk owns idempotency, Memory formation, qualification, and Relationship-derived rate recalculation.

## 5. Response-scoped effects

Any effect may declare:

```json
"responseId": "accept"
```

A response-scoped effect fires only when that exact response was selected.

This fixes a general prototype bug where an effect attached to a node could execute even when the player selected the node's decline/later response.

The Willow Seed offer uses this so only `accept`:

- unlocks the Ancient Seed quest;
- supplies the tutorial Sunstone;
- records `A Seed of Potential`.

Declining does none of those things.

The same convention is used by other acceptance dialogue where appropriate.

## 6. Opt-in one-shot decisions

Most dialogue remains repeatable by default. Authors opt into one-shot semantics explicitly:

```json
{
  "id": "example_policy_decision",
  "repeatable": false,
  "responses": {
    "a": "Choose policy A.",
    "b": "Choose policy B."
  }
}
```

When `repeatable` is absent or `true`, current repeatable behavior is preserved.

For `repeatable: false`:

1. if the node declares response options, the interaction requires one valid authored response id;
2. the selected response's normal effects run;
3. after successful processing, the node id is recorded once in that NPC's existing `completedDialogues` array;
4. the production Dialogue UI hides the completed topic;
5. `processNPCInteractionThunk` independently rejects a direct attempt to invoke the completed topic, so the presentation layer is not the only guard;
6. completion persists through existing NPC save state without a separate dialogue save schema.

The M14 policy decisions use this contract:

- `valerius_m14_aftermath_council` — the player may choose only one aftermath policy per playthrough;
- `gronk_m14_repair_ledger` — the player may choose only one repair policy per playthrough.

This contract is intentionally small. It does not turn Dialogue into a full persistent conversation-state engine and does not add generalized branch rollback or arbitrary condition expressions.

## 7. Lightweight continuation behavior

The current dialogue runtime is not a full conversation-state machine.

When a selected response points to a `next` node, the runtime displays that next node's text inline. For compatibility with that presentation behavior, **relationship-only** effects on the displayed continuation may be recorded immediately because that narrative content was actually shown.

Resource/quest effects on a continuation are not auto-committed; they require an explicit later interaction.

A richer persistent dialogue-state engine remains deferred.

## 8. Willow M4 sequence

Current evidence-gated topics support:

```text
She Saw Through the Question
-> The First Lesson
-> A Seed of Potential
-> Ancient Seed resolution
-> Willow Disagrees
-> Three Nights of Teaching
-> The Lesson Made Yours
```

The final WE-08 Resonance beat is emitted by Trait permanent acquisition rather than a dialogue button.

This sequence deliberately includes `Willow Disagrees`, where immediate warmth may fall while Understanding and Connection Progress rise.

## 9. Affinity and Connection during migration

For unmigrated NPCs:

```text
legacy Affinity update
-> may still roll into legacy connectionDepth
```

For Relationship-authoritative NPCs:

- Bond Profile is the Connection authority;
- Affinity is disposition only;
- authored Affinity effects may project to the legacy NPC Affinity field for UI/service compatibility;
- Affinity does not level Relationship-authoritative Connection.

Dialogue must not silently reintroduce Affinity-as-XP for a migrated NPC.

## 10. Error handling

- missing NPC: interaction fails;
- unmet Affinity gate: interaction fails with feedback;
- unmet relationship-evidence gate: interaction fails with feedback;
- completed non-repeatable dialogue: interaction fails before effects run;
- missing/invalid response on a non-repeatable node with authored response options: interaction fails without consuming the decision;
- unknown authored Relationship Experience: relationship thunk rejects;
- missing next node: conversation ends gracefully;
- unknown optional effect types are skipped by the current lightweight loop unless explicitly handled.

## 11. Deferred

- full persistent dialogue-tree cursor/state;
- generalized condition expression language;
- branch rollback / undo;
- localized string system;
- reusable subtrees/includes;
- cinematic sequencing;
- broad campaign conversion to relationship evidence;
- richer per-response visual consequence previews.

## 12. Invariants

1. The response shown/selected by the player determines the response-scoped consequence.
2. Future relationship topics cannot bypass their Experience prerequisites.
3. Dialogue routing data does not duplicate the full Relationship Experience definition.
4. A declined response cannot accidentally fire an accept-only effect.
5. Relationship-authoritative dialogue cannot deepen Connection merely by accumulating Affinity.
6. Existing dialogue is repeatable unless authoring explicitly sets `repeatable: false`.
7. A completed non-repeatable decision cannot execute a second response through either UI or direct thunk invocation.
8. An invalid response cannot consume a non-repeatable decision.
