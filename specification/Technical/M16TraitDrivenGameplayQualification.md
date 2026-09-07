# M16 — Trait-Driven Gameplay Qualification

**Status:** behavioral candidate qualified; documentation-complete head pending requalification  
**Baseline:** post-M15 `main` at `337231772cfb1f0cd63ae7378a38219227499134`  
**Baseline tree:** `c56bda0b0dc678a2bb1ef3f905283f9945c66896`  
**Branch:** `feature/m16-trait-driven-gameplay`

## 1. Scientific question

Can an existing production Trait acquired through qualified Relationship evidence materially change the solution space of an ordinary gameplay problem, producing a different story/Relationship consequence, without NPC-specific gameplay branches, duplicate story flags, legacy Affinity/`connectionDepth` authority, or a general-purpose ability/condition framework?

Target causal shape:

```text
Relationship evidence
-> permanent learned Trait
-> ordinary gameplay problem
-> Trait changes available reasoning/action
-> different player resolution
-> different consequence
-> new Relationship evidence
```

M4-M15 qualified Relationship evidence, Memory, Connection, persistence, multi-NPC consequence, long-horizon callback, and relationship-mediated Trait discovery/assimilation/Resonance. M16 tests the missing gameplay payoff.

## 2. Existing capability that must be reused

`WillowsWisdom` is already a production relationship-mediated Trait. The existing authority includes:

- source NPC `npc_elder_willow`;
- authored discovery;
- qualified Connection requirement;
- 100% assimilation threshold;
- compatibility threshold;
- required `Application` Memory evidence;
- 40 Essence final stabilization cost;
- authored final Resonance Experience;
- permanent ownership in player Trait state.

M16 must not rebuild Trait assimilation or substitute a legacy Affinity/`connectionDepth` gate.

## 3. Primary production slice — The Withering Grove

A bounded forest problem presents visible corrupted root growth and declining Essence flow.

### Ordinary resolution

The player can complete the problem without `WillowsWisdom` by removing the visibly corrupted root mass.

Target semantic consequence: the grove survives, but part of it is sacrificed. This path is valid rather than a failure state.

### Trait-enabled resolution

A player who permanently owns `WillowsWisdom` can recognize that the visible corruption is a symptom of a slower Essence-flow imbalance and may choose a restoration-oriented resolution instead of removal.

The Trait must reveal or authorize an alternate action; it must not automatically make the choice for the player.

Core invariant:

```text
capability != decision
```

## 4. Gameplay-authority boundary

M16 must preserve:

```text
Relationship history -> explains/qualifies how the capability was learned
Trait state           -> owns whether the learned capability now exists
```

Gameplay must not query Willow Relationship history directly to decide whether the M16 capability is available.

A strong Willow Relationship without permanent `WillowsWisdom` must not grant the special gameplay route.

## 5. Controls

### Control A — no permanent Trait

- ordinary solution available;
- Trait-enabled solution unavailable;
- direct runtime attempt to invoke Trait-only resolution is rejected;
- ordinary completion remains possible.

### Control B — strong Willow Relationship but Trait not permanent

A history that otherwise looks highly qualified, including existing Relationship evidence/assimilation where convenient for the fixture, must still lack the gameplay capability if `WillowsWisdom` is not permanent.

This proves Relationship evidence is not a duplicate gameplay capability flag.

### Qualified Trait history

A player with permanent `WillowsWisdom` after ordinary save/load must have both the ordinary and Wisdom-enabled resolutions available, may choose the Wisdom route, and receives its distinct consequence.

## 6. Relationship consequences

Ordinary-resolution Experience:

`willow_exp_grove_saved_by_cutting`

Frozen vector:

- Trust `+1`
- Understanding `+2`
- Shared Meaning `+1`
- Reciprocity `+1`
- Connection Progress `+2`

Interpretation: Willow accepts that the player acted decisively and preserved what could be preserved, without pretending the destructive cost was invisible.

Wisdom-resolution Experience:

`willow_exp_wisdom_used_in_world`

Frozen vector:

- Trust `+2`
- Understanding `+5`
- Shared Meaning `+6`
- Reciprocity `+3`
- Connection Progress `+5`

Interpretation: the player independently used Willow's way of perceiving slow systems on a problem Willow did not solve for them.

No M16 Memory is created. Trait use does not automatically create Memories.

## 7. Reconnaissance / Rule of Two

Reconnaissance found that existing quest-resolution authoring had no Trait condition:

- `QuestResolutionOption` had no Trait requirement;
- `resolveQuestOutcomeThunk` validated readiness, option identity, item costs, Relationship effects, rewards, and resolution locking but did not inspect player Traits;
- `NPCQuestsTab` rendered authored resolution options without Trait filtering;
- permanent learned capabilities were already authoritative in `player.permanentTraits`.

Probe A, **The Withering Grove**, therefore exposed a real missing semantic capability. Per the preregistered Rule of Two, no generic extension was added from that one case.

A second independent production probe using permanent `ScholarlyInsight` — **The Impossible Inventory** — required the same missing semantic. The reconnaissance result was frozen before behavioral implementation in `M16TraitDrivenGameplayReconAmendment.md` at commit `2e5cf0711229db5df8f5f5078a7e13abf52a9d1e`.

Two independent production cases therefore justified exactly one bounded generic contract:

```ts
requiredPermanentTraitIds?: string[];
```

Semantics:

- omitted/empty preserves existing behavior;
- all listed Trait IDs must exist in `state.player.permanentTraits`;
- the authoritative thunk rejects an unmet option before Relationship evidence, item consumption, rewards, or resolution lock;
- the NPC Quest UI uses the same generic availability helper;
- temporary/equipped-Trait semantics remain deliberately deferred.

M16 does not add:

- negative Trait conditions;
- any-of Trait conditions;
- generalized ability requirements;
- stat/skill check DSL;
- arbitrary boolean expression syntax.

## 8. Persistence boundary

The principal qualified path includes ordinary save/load after `WillowsWisdom` is permanent and after the M16 quest is ready, but before the Trait-enabled resolution is consumed.

After load the qualification verifies:

- permanent `WillowsWisdom` still exists;
- the quest remains `READY_TO_COMPLETE`;
- both the ordinary and Trait-enabled resolutions are available;
- the Trait-enabled resolution can be chosen normally.

No M16 save-schema change was required.

## 9. Runtime enforcement

UI hiding alone is insufficient.

The authoritative runtime gate is generic and checks only `QuestResolutionOption.requiredPermanentTraitIds` against `state.player.permanentTraits`.

A direct attempt to process a Trait-only resolution without its permanent Trait is rejected before any Relationship consequence or resolution lock occurs.

No generic runtime branch checks `npc_elder_willow`, `npc_scholar_elara`, `WillowsWisdom`, `ScholarlyInsight`, or an M16 quest ID as a special case.

## 10. Actual implementation scope

M16 changed the following bounded surfaces:

- `public/data/quests.json` — authored the two production probes;
- `public/data/relationships/m16-gameplay.json` — four probe consequences;
- `public/data/relationships/index.json` — registered the M16 bundle;
- `src/features/Quest/state/QuestTypes.ts` — optional `requiredPermanentTraitIds` field;
- `src/features/Quest/state/QuestResolutionAvailability.ts` — shared pure gate helper;
- `src/features/Quest/state/QuestThunks.ts` — authoritative rejection;
- `src/features/NPCs/components/ui/tabs/NPCQuestsTab.tsx` — matching option visibility;
- `src/features/Quest/state/QuestM16TraitDrivenGameplay.test.tsx` — dedicated qualification;
- `.github/workflows/build-validation.yml` — accumulated M16 gate;
- the M16 preregistration and reconnaissance documents.

No Relationship runtime behavioral file or save-schema file changed.

`public/data/quests.json` was formatting-normalized while the two probes were added, making its textual diff larger than the semantic change. The accumulated behavioral suite and production build were therefore retained as the authority for compatibility rather than treating line-count size as evidence of behavioral scope.

## 11. Explicit non-goals

M16 does not build:

- combat;
- a generalized skill-check system;
- dice rolls;
- stat checks;
- cooldowns/mana/status effects;
- equipment requirements;
- Trait synergy engine;
- dynamic environmental simulation;
- procedural puzzles;
- exploration graph redesign;
- faction reputation;
- social knowledge propagation;
- world-state framework;
- Copy automation;
- offline progress.

## 12. Stop / falsification conditions

M16 did not require:

- `willowWisdomUsed`, `willowCanSolveGrove`, `groveWisdomRouteUnlocked`, `playerLearnedWillowMethod`, or equivalent duplicate persistent booleans;
- a generic runtime branch keyed on Willow, Elara, either Trait, or an M16 ID;
- direct Willow Relationship inspection as gameplay capability authority;
- legacy Affinity or `connectionDepth` as the gameplay gate;
- UI-only gating with a bypassable runtime action;
- re-earning the permanent Trait after save/load;
- mechanically/relationally identical alternate resolutions;
- a generalized ability/condition framework;
- a save-schema change solely for M16.

No preregistered stop condition fired after implementation began.

## 13. Dedicated qualification result

`src/features/Quest/state/QuestM16TraitDrivenGameplay.test.tsx` passes five cases.

### Test A — production authoring / architecture / Rule of Two

Proves:

- Willow and Elara probes use the same generic permanent-Trait gate;
- ordinary routes have no Trait requirement;
- Willow requires `WillowsWisdom` and Elara requires `ScholarlyInsight`;
- all-of semantics work generically;
- the M16 Relationship bundle is manifest-registered;
- all four authored consequences exist;
- M16 adds no Memory;
- no negative/any-of/expression-language Trait condition appears;
- audited generic runtime files contain no M16 quest IDs, NPC IDs, or Trait IDs as special cases.

### Test B — no-Trait Willow control

Proves:

- **Remove the Corrupted Roots** remains available;
- **Restore the Underlying Flow** is hidden;
- direct thunk invocation of the Wisdom route is rejected and does not lock a resolution or create the special Experience;
- the ordinary route completes through production UI and records `willow_exp_grove_saved_by_cutting`;
- the Wisdom Experience remains absent.

### Test C — permanent Willow Trait + save/load

Proves:

- independently qualified permanent Trait ownership survives save/load;
- the ready quest survives save/load;
- both ordinary and Wisdom routes are visible after load;
- choosing **Restore the Underlying Flow** through production UI records `willow_exp_wisdom_used_in_world`;
- the ordinary-only consequence is absent;
- permanent `WillowsWisdom` remains owned.

### Test D — strong Willow Relationship without permanent Trait

Seeds previously qualified Willow Relationship evidence through independent application and the landmark `willow_memory_lesson_made_yours`, while deliberately withholding permanent `WillowsWisdom`.

The Wisdom route remains hidden and direct invocation remains rejected.

This qualifies the authority boundary:

```text
Relationship evidence != learned gameplay capability
permanent Trait state  == learned gameplay capability authority
```

### Test E — independent Scholarly Insight corroboration

Without permanent `ScholarlyInsight`, the ordinary **Accept the Most Plausible Inventory** route remains available while **Reopen the Model Around the Contradiction** is hidden and direct invocation is rejected.

With permanent `ScholarlyInsight`, the same generic gate exposes the alternate route, which completes through production UI and records `elara_exp_insight_reopens_inventory` rather than the ordinary Elara consequence.

## 14. Acceptance criteria

- [x] exact post-M15 baseline SHA/tree frozen;
- [x] fresh M16 branch created from exact baseline;
- [x] preregistration committed before behavior changes;
- [x] existing Trait-consumption/gameplay contracts reconnoitered;
- [x] existing Willow assimilation reused rather than rebuilt;
- [x] one ordinary gameplay problem authored;
- [x] problem completable without Trait;
- [x] permanent `WillowsWisdom` creates a materially different optional solution;
- [x] Relationship state is not gameplay capability authority;
- [x] strong Relationship without permanent Trait does not grant capability;
- [x] direct invalid bypass rejected below UI;
- [x] permanent Trait and route survive save/load;
- [x] ordinary route records ordinary Relationship consequence;
- [x] Trait route records different Relationship consequence;
- [x] no shadow boolean;
- [x] no NPC-specific generic branch;
- [x] no generalized ability/condition DSL from one case;
- [x] no new Relationship dimension or Connection tier;
- [x] no save-schema change;
- [x] accumulated M4-M15 qualification remains green;
- [x] dedicated M16 qualification passes;
- [x] TypeScript passes;
- [x] production build passes;
- [x] first complete behavioral candidate SHA/tree recorded;
- [x] result + architecture finding + evidence ceiling recorded;
- [ ] documentation-complete final head requalified;
- [ ] exact qualified head merged with expected-head guard;
- [ ] integrated `main` SHA/tree verified;
- [ ] post-merge CI claimed only if it actually exists.

## 15. First complete behavioral candidate

Candidate:

- SHA `93840cc7312c1359e216f961abd3e7c8785560a0`
- tree `2887395b34678ece059338881b101746a88f7b28`
- compared with M15 baseline: 11 commits / 11 intended changed files

Build Validation #167:

- run `34113734869`
- job `101715611695`
- exact head `93840cc7312c1359e216f961abd3e7c8785560a0`
- dependency installation: **PASS**
- TypeScript: **PASS**
- accumulated M4-M16 behavioral qualification: **PASS**
- production build: **PASS**
- overall verdict: **PASS**

No implementation repair cycle occurred after the first complete behavioral candidate entered CI.

## 16. Architecture finding

M16 produced a bounded positive abstraction result.

The existing architecture was sufficient for Relationship provenance, permanent Trait ownership, quest consequences, Relationship consequence recording, location objectives, and persistence. The only repeated missing semantic was a way for an authored quest resolution to require an already-permanent learned capability.

The Rule-of-Two demonstrated this independently with:

```text
WillowsWisdom
-> The Withering Grove alternate restoration

ScholarlyInsight
-> The Impossible Inventory alternate model revision
```

Therefore the warranted abstraction is only:

```ts
requiredPermanentTraitIds?: string[];
```

The result does **not** warrant a generalized ability system, skill-check DSL, temporary-Trait capability semantics, negative Trait conditions, or arbitrary predicate language.

A second important boundary is now qualified:

```text
Relationship owns why/how the protagonist learned from someone.
Trait owns the durable learned capability.
Quest/gameplay consumes the Trait capability.
Relationship interprets the consequence afterward.
```

## 17. Qualified claim

> An existing Relationship-derived permanent Trait can materially alter the solution space of a bounded production gameplay problem and produce a distinct later Relationship consequence through a generic permanent-Trait quest-resolution gate. Strong Relationship evidence without the permanent Trait remains insufficient for the gameplay capability, and invalid Trait-only resolutions are rejected below the UI.

Conceptually:

```text
Relationship
-> learning
-> permanent capability
-> different action
-> different consequence
-> Relationship
```

## 18. Evidence ceiling

M16 does **not** qualify:

- a complete ability or skill system;
- broad build diversity;
- balanced Trait usefulness;
- temporary/equipped-Trait gameplay semantics;
- generalized RPG skill checks;
- stat checks or probability systems;
- combat viability;
- exploration-system maturity;
- campaign-scale Trait relevance;
- puzzle quality;
- human enjoyment, pacing, or perceived meaningfulness;
- that every Trait should produce bespoke alternate quest resolutions.

The strongest supported claim is bounded to two production quest-resolution probes using two already-qualified permanent Relationship-derived Traits through one generic positive permanent-Trait gate.

## 19. Merge authority

Build Validation on the exact candidate SHA is merge authority. Gemini is not merge authority.

The documentation-complete head produced by this results record must receive its own exact-head Build Validation before merge.
