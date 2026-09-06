# Quest System Specification

**Implementation Status:** ✅ Expanded foundation + authored resolution choices  
**Relationship migration:** ✅ Ancient Seed uses M4 resolution semantics.

Feature directory: `src/features/Quest/`  
Redux slice key: `quest`

## 1. Purpose

The Quest system provides structured goals, narrative progression, objective tracking, decisions, and rewards.

Current general loop:

```text
Discover / unlock
-> Accept
-> Track objectives
-> READY_TO_COMPLETE
-> optional authored Resolution
-> Turn in / complete
-> ordinary quest rewards
```

## 2. Current runtime foundation

Implemented:

- quest initialization from `/data/quests.json`;
- add/start/complete/fail lifecycle;
- objective progress and field patching;
- GATHER, DELIVER, KILL, REACH_LOCATION and puzzle-related objective support;
- timed quest processing;
- ordinary rewards: Gold, Essence, Items, Reputation;
- NPC quest availability;
- return-to-giver turn-in checks;
- repeatable/radiant quest foundation;
- authored pre-turn-in resolution choices.

## 3. Quest states

```typescript
type QuestStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'READY_TO_COMPLETE'
  | 'COMPLETED'
  | 'FAILED';
```

When all objectives complete, an in-progress quest becomes `READY_TO_COMPLETE`.

## 4. Authored resolution choices

A quest may declare:

```typescript
resolutionRequired?: boolean;
resolutionOptions?: QuestResolutionOption[];
selectedResolutionId?: string;
```

Each option may contain:

```typescript
interface QuestResolutionOption {
  id: string;
  label: string;
  description: string;
  relationshipExperienceId?: string;
  consumeItems?: Array<{ itemId: string; quantity: number }>;
  rewards?: QuestReward[];
  logMessage?: string;
}
```

This is intentionally generic. The Quest system does not contain an `if Ancient Seed` branch.

### Resolution transaction order

`resolveQuestOutcomeThunk` validates and commits in this order:

1. quest exists;
2. objectives are complete;
3. no mutually exclusive resolution was already selected;
4. resolution id is valid;
5. required items exist;
6. referenced Relationship Experience validates/records;
7. items are consumed;
8. independently justified option rewards are applied;
9. resolution id is locked;
10. player feedback is emitted.

This order prevents bad relationship-authoring data from consuming an item or paying a reward before the narrative consequence is durably recordable.

A selected resolution cannot later be replaced by another option.

## 5. Relationship consequences vs. rewards

A relationship consequence and a consumable reward are different concepts.

```text
Relationship Experience = durable causal/evidentiary history
Quest/resource reward = immediate inventory/currency consequence
```

A quest resolution may have both, but one must not be disguised as the other.

For relationship milestones, the normal progression consequence is a future change in Bond/Connection/Essence-rate inputs rather than a one-time relationship Essence drop.

## 6. Ancient Seed — first resolution proof

`quest_willow_ancient_seed` now requires an explicit decision after the Sunstone objective is complete.

### Awaken / preserve the Seed

- consumes one `item_sunstone`;
- records `willow_exp_sunstone_decision_preserve`;
- forms `The Seed Preserved` Memory through relationship authoring;
- grants no immediate relationship Essence payout.

### Extract / consume the Sunstone

- consumes one `item_sunstone`;
- records `willow_exp_sunstone_decision_consume`;
- grants a small immediate Essence reward from the **Sunstone's extracted resource value**, not from the relationship event.

This preserves the rule that meaningful relationship Experiences normally change future progression rather than acting as loot drops.

## 7. Tutorial Sunstone compression

The current prototype does not yet provide robust world exploration/item acquisition for `item_sunstone`.

For the Willow vertical slice, accepting the authored Seed challenge grants the tutorial Sunstone through dialogue. This is deliberate vertical-slice compression so the relationship decision is playable without pretending the missing exploration layer exists.

The Quest system also reconciles GATHER objectives against inventory at quest start. If the required item is already held, objective progress reflects it immediately.

This is a general fix, not a Willow-only special case.

## 8. Turn-in behavior

`turnInQuestThunk`:

- requires `READY_TO_COMPLETE`;
- refuses turn-in when `resolutionRequired` is true but no resolution is selected;
- enforces return-to-giver for non-auto-complete quests;
- applies ordinary top-level quest rewards;
- completes the quest;
- exposes prerequisite-linked follow-up quests where applicable.

The NPC Quest tab only shows the turn-in action for a resolution-required quest after the authored choice has been locked.

## 9. Puzzle support

Puzzle objectives may provide outcomes with:

- Gold;
- Essence;
- Items;
- Status Effects;
- log messages.

Puzzle consequences remain independent from M4 relationship resolution unless explicitly connected by authored data later.

## 10. Radiant/repeatable foundation

The existing radiant quest thunk can generate repeatable delivery work against available NPCs.

M4 does not redesign procedural quest generation or make procedural quests automatically produce deep relationship evidence.

## 11. Invariants

1. Objectives must complete before resolution/turn-in.
2. A required authored resolution is mutually exclusive and locks once chosen.
3. Missing relationship-authoring data must fail before item consumption/reward application.
4. Relationship Experiences are not interchangeable with quest rewards.
5. GATHER objectives consider items already held when the quest starts.
6. Completion rewards are applied once through the normal quest lifecycle.

## 12. Deferred

- production exploration/map delivery for Sunstone acquisition;
- richer branching quest graphs;
- map markers;
- general quest authoring tools;
- broad relationship consequences for every quest;
- procedural generation of deep Relationship Experiences;
- richer campaign-scale acceptance/hand-in presentation.
