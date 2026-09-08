# Quest System Specification

**Implementation Status:** ✅ Expanded foundation + authored resolution choices + permanent-Trait resolution gates + M23 faction-tagged reputation routing  
**Relationship migration:** ✅ Ancient Seed uses M4 resolution semantics; M16 qualifies Trait-driven authored resolutions.  
**Faction integration:** ✅ M23 qualifies faction-tagged `REPUTATION` rewards as institutional standing rather than giver-NPC Affinity.

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
- ordinary rewards: Gold, Essence, Items, and faction-tagged Reputation;
- NPC quest availability;
- return-to-giver turn-in checks;
- repeatable/radiant quest foundation;
- authored pre-turn-in resolution choices;
- generic permanent-Trait requirements on authored resolution choices.

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
  requiredPermanentTraitIds?: string[];
  relationshipExperienceId?: string;
  consumeItems?: Array<{ itemId: string; quantity: number }>;
  rewards?: QuestReward[];
  logMessage?: string;
}
```

This is intentionally generic. The Quest system does not contain an `if Ancient Seed`, `if Willow`, `if Elara`, or `if M16` branch.

### Permanent-Trait availability

M16 introduced and qualified the bounded contract:

```text
requiredPermanentTraitIds
```

Semantics:

- every listed Trait id must exist in `player.permanentTraits`;
- absent/empty requirements preserve prior resolution behavior;
- one shared pure availability check is used by both presentation and authoritative resolution processing;
- UI hiding is not the correctness boundary: direct thunk invocation without the required permanent Trait is rejected;
- rejection occurs before Relationship evidence, item consumption, rewards, or resolution lock.

This contract intentionally does **not** define:

- temporary/equipped-Trait gameplay authority;
- OR/NOT Trait expressions;
- stat/skill checks;
- a generalized ability-condition DSL.

### Resolution transaction order

`resolveQuestOutcomeThunk` validates and commits in this order:

1. quest exists;
2. objectives are complete;
3. no mutually exclusive resolution was already selected;
4. resolution id is valid;
5. required permanent Traits are owned;
6. required items exist;
7. referenced Relationship Experience validates/records;
8. items are consumed;
9. independently justified option rewards are applied;
10. resolution id is locked;
11. player feedback is emitted.

This order prevents bad authoring or invalid capability access from consuming items, paying rewards, or locking a resolution before the consequence is valid and durably recordable.

A selected resolution cannot later be replaced by another option.

## 5. Relationship consequences vs. rewards

A relationship consequence and a consumable or institutional reward are different concepts.

```text
Relationship Experience = durable causal/evidentiary personal history
Quest/resource reward = immediate inventory/currency consequence
Faction Reputation reward = explicit institutional-standing consequence
```

A quest resolution may have several of these, but one must not be disguised as another.

For relationship milestones, the normal progression consequence is a future change in Bond/Connection/Essence-rate inputs rather than a one-time relationship Essence drop or an implicit faction score.

### 5.1 M23 faction-tagged reputation authority

The authoring model already supported:

```typescript
{
  type: 'REPUTATION',
  value: number,
  faction?: string,
}
```

Before M23, runtime behavior ignored the `faction` field and changed the quest giver's personal NPC relationship/Affinity. That was an authority conflation.

M23 qualifies the corrected rule:

```text
REPUTATION + non-empty faction
-> Faction authority
-> named institution changes
-> giver NPC personal Relationship does not implicitly change
```

Production control:

```text
quest_valerius_patrol_duty
-> +10 City Watch
-> Valerius Affinity unchanged by that REPUTATION reward
-> Relationship state unchanged by that REPUTATION reward
-> Knowledge unchanged
```

The separately authored Relationship consequences of a quest remain Relationship-owned.

No production factionless `REPUTATION` reward was found during M23 recon. A factionless value therefore must not silently fall back to personal Relationship semantics.

See `FactionSystem.md` and `../Technical/M23FactionReputationResult.md`.

## 6. Ancient Seed — first resolution proof

`quest_willow_ancient_seed` requires an explicit decision after the Sunstone objective is complete.

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

## 7. M16 — permanent Trait as gameplay capability

M16 qualifies two independent production probes using the same generic quest-resolution contract.

### The Withering Grove

Without permanent `WillowsWisdom`:

- **Remove the Corrupted Roots** remains a valid completion route;
- **Restore the Underlying Flow** is unavailable;
- a direct attempt to invoke the Wisdom-only resolution is rejected;
- the ordinary route records `willow_exp_grove_saved_by_cutting`.

With permanent `WillowsWisdom`:

- both routes are available;
- the player still chooses whether to use the capability;
- the Wisdom route records `willow_exp_wisdom_used_in_world`.

### The Impossible Inventory

Without permanent `ScholarlyInsight`:

- **Accept the Most Plausible Inventory** remains valid;
- **Reopen the Model Around the Contradiction** is unavailable.

With permanent `ScholarlyInsight`:

- the alternate route becomes available;
- the production path records `elara_exp_insight_reopens_inventory`.

These two independent probes justified exactly one bounded generic addition: `requiredPermanentTraitIds`.

The authority boundary is:

```text
Relationship -> qualifies learning
Trait        -> owns durable capability
Quest        -> decides local applicability
Player       -> chooses the resolution
Relationship -> interprets the consequence
```

See `../Technical/PostM16TraitGameplayReconciliation.md`.

## 8. Tutorial Sunstone compression

The current prototype does not yet provide robust world exploration/item acquisition for `item_sunstone`.

For the Willow vertical slice, accepting the authored Seed challenge grants the tutorial Sunstone through dialogue. This is deliberate vertical-slice compression so the relationship decision is playable without pretending the missing exploration layer exists.

The Quest system also reconciles GATHER objectives against inventory at quest start. If the required item is already held, objective progress reflects it immediately.

This is a general fix, not a Willow-only special case.

## 9. Turn-in behavior

`turnInQuestThunk`:

- requires `READY_TO_COMPLETE`;
- refuses turn-in when `resolutionRequired` is true but no resolution is selected;
- enforces return-to-giver for non-auto-complete quests;
- applies ordinary top-level quest rewards through their domain authorities;
- completes the quest;
- exposes prerequisite-linked follow-up quests where applicable.

For faction-tagged `REPUTATION`, the named Faction is the reward authority. The quest giver is not implicitly the reputation target.

The NPC Quest tab only shows the turn-in action for a resolution-required quest after the authored choice has been locked.

## 10. Puzzle support

Puzzle objectives may provide outcomes with:

- Gold;
- Essence;
- Items;
- Status Effects;
- log messages.

Puzzle consequences remain independent from M4/M16 relationship/Trait resolution unless explicitly connected by authored data later.

## 11. Radiant/repeatable foundation

The existing radiant quest thunk can generate repeatable delivery work against available NPCs and currently authors an `Adventurer's Guild` faction-tagged reputation reward.

M23's generic routing means that reward now targets the named institution rather than the giver NPC. The radiant path itself is not part of the M23 Rule-of-Two production claim.

Procedural quest generation is not automatically authorized to produce deep Relationship Experiences, permanent-Trait capability gates, or broader faction simulation without explicit authoring.

## 12. Invariants

1. Objectives must complete before resolution/turn-in.
2. A required authored resolution is mutually exclusive and locks once chosen.
3. Missing relationship-authoring data must fail before item consumption/reward application.
4. Relationship Experiences are not interchangeable with quest rewards.
5. GATHER objectives consider items already held when the quest starts.
6. Completion rewards are applied once through the normal quest lifecycle.
7. Missing required permanent Traits reject the resolution below the UI before consequence/reward/lock.
8. Relationship state does not substitute for permanent Trait ownership when the resolution requires a learned capability.
9. Capability availability does not automatically make the player's decision.
10. Faction-tagged `REPUTATION` rewards update Faction authority, not giver-NPC Affinity.
11. Faction Reputation does not automatically imply a Relationship or Knowledge consequence.
12. Objective M24 World State must not be smuggled through a reputation reward.

## 13. Deferred

- production exploration/map delivery for Sunstone acquisition;
- richer branching quest graphs;
- map markers;
- general quest authoring tools;
- broad relationship consequences for every quest;
- procedural generation of deep Relationship Experiences;
- richer campaign-scale acceptance/hand-in presentation;
- temporary/equipped-Trait resolution semantics;
- OR/NOT Trait requirements;
- generalized stat/skill/ability condition language;
- reputation tiers/bands;
- faction diplomacy or ally/rival spillover;
- objective regional World State (M24).
