# M16 — Trait-Driven Gameplay Qualification

**Status:** preregistered; production implementation not yet started  
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

Planned ordinary-resolution Experience:

`willow_exp_grove_saved_by_cutting`

Frozen target vector:

- Trust `+1`
- Understanding `+2`
- Shared Meaning `+1`
- Reciprocity `+1`
- Connection Progress `+2`

Interpretation target: Willow accepts that the player acted decisively and preserved what could be preserved, without pretending the destructive cost was invisible.

Planned Wisdom-resolution Experience:

`willow_exp_wisdom_used_in_world`

Frozen target vector:

- Trust `+2`
- Understanding `+5`
- Shared Meaning `+6`
- Reciprocity `+3`
- Connection Progress `+5`

Interpretation target: the player independently used Willow's way of perceiving slow systems on a problem Willow did not solve for them.

No new M16 Memory is required for qualification. A Memory may be added only if the authored event is independently judged landmark-worthy; Trait use must not automatically create Memories.

## 7. Reconnaissance / Rule of Two

Before implementation, inspect whether existing generic gameplay authoring already supports Trait-conditioned choices/resolutions.

M16 must not preemptively add:

- `requiredTraitIds`;
- `forbiddenTraitIds`;
- generalized ability requirements;
- stat/skill check DSL;
- arbitrary boolean expression syntax.

If existing contracts are sufficient, reuse them.

If Probe A (Withering Grove) exposes a missing generic semantic capability, a generic extension is not justified from that single inconvenience alone.

A second independent production probe using `ScholarlyInsight` may be added only if necessary to test whether the same authoring gap repeats. A bounded generic Trait-condition contract is warranted only if two independent production cases need the same missing capability.

## 8. Persistence boundary

The principal qualified path must include ordinary save/load after `WillowsWisdom` is permanent and before the M16 Trait-enabled resolution is consumed.

After load verify:

- permanent `WillowsWisdom` still exists;
- M16 gameplay state remains valid;
- Trait-enabled resolution availability is preserved.

No M16 save-schema change is permitted absent an independently discovered persistence defect.

## 9. Runtime enforcement

UI hiding alone is insufficient.

A direct attempt to process the Wisdom-only resolution without permanent `WillowsWisdom` must be rejected below the presentation layer.

The authoritative runtime gate must be generic with respect to Trait identity; no generic runtime branch may check `npc_elder_willow`, `WillowsWisdom`, or any M16-specific ID as a special case.

## 10. Expected implementation scope

Expected changes are limited to the smallest necessary production and qualification surface, likely among:

- `public/data/quests.json`;
- `public/data/dialogues.json` if needed for introduction/turn-in;
- `public/data/npcs.json` if an existing NPC topic list must reference new content;
- `public/data/relationships/elder-willow.json`;
- the existing Quest or Dialogue authoring/runtime contract if a generic Trait gate is empirically justified;
- one dedicated M16 behavioral qualification test;
- `.github/workflows/build-validation.yml`;
- this document's later result section.

Expected Relationship runtime behavioral changes: **none**.

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

Stop and preserve the finding if M16 requires:

- `willowWisdomUsed`, `willowCanSolveGrove`, `groveWisdomRouteUnlocked`, `playerLearnedWillowMethod`, or equivalent duplicate persistent booleans;
- a generic runtime branch keyed on `npc_elder_willow`, `WillowsWisdom`, or an M16 ID;
- direct Willow Relationship inspection as gameplay capability authority;
- legacy Affinity or `connectionDepth` as the gameplay gate;
- UI-only gating with a bypassable runtime action;
- re-earning the permanent Trait after save/load;
- two visually different resolutions with mechanically/relationally identical consequence;
- a generalized ability/condition framework introduced from only one production case;
- a save-schema change solely for M16.

A clean FAIL is evidence and must not be normalized away.

## 13. Dedicated qualification

Create one dedicated M16 test in the feature that owns the authoritative resolution gate after reconnaissance.

At minimum it must prove:

### Test A — production authoring / architecture

- existing relationship-mediated Willow Trait acquisition remains intact;
- M16 uses Trait state as gameplay capability authority;
- no duplicate Willow story flag;
- no legacy Relationship proxy;
- no M16-specific generic runtime branch;
- any generic Trait-gate extension is justified by the recorded Rule-of-Two evidence.

### Test B — no-Trait control

- ordinary route available;
- Wisdom route unavailable;
- direct bypass rejected;
- ordinary route completes;
- `willow_exp_grove_saved_by_cutting` recorded;
- Wisdom consequence absent.

### Test C — qualified permanent-Trait route

- permanent `WillowsWisdom` established through qualified state/production path;
- save/load before M16 resolution;
- ordinary and Wisdom routes available after load;
- Wisdom route completes through ordinary production UI/runtime;
- `willow_exp_wisdom_used_in_world` recorded;
- ordinary-only consequence absent;
- permanent Trait remains owned.

### Test D — strong Relationship, no permanent Trait

- Willow Relationship may be highly qualified;
- `WillowsWisdom` is not permanent;
- Wisdom route remains unavailable;
- direct bypass rejected.

Historical Willow evidence may be seeded only where independently qualified by earlier tests. New M16 Experiences/resolutions must be exercised through ordinary production paths.

## 14. Acceptance criteria

- [x] exact post-M15 baseline SHA/tree frozen;
- [x] fresh M16 branch created from exact baseline;
- [x] preregistration committed before behavior changes;
- [ ] existing Trait-consumption/gameplay contracts reconnoitered;
- [ ] existing Willow assimilation reused rather than rebuilt;
- [ ] one ordinary gameplay problem authored;
- [ ] problem completable without Trait;
- [ ] permanent `WillowsWisdom` creates a materially different optional solution;
- [ ] Relationship state is not gameplay capability authority;
- [ ] strong Relationship without permanent Trait does not grant capability;
- [ ] direct invalid bypass rejected below UI;
- [ ] permanent Trait and route survive save/load;
- [ ] ordinary route records ordinary Relationship consequence;
- [ ] Trait route records different Relationship consequence;
- [ ] no shadow boolean;
- [ ] no NPC-specific generic branch;
- [ ] no generalized ability/condition DSL from one case;
- [ ] no new Relationship dimension or Connection tier;
- [ ] no save-schema change unless an independent defect is discovered;
- [ ] accumulated M4-M15 qualification remains green;
- [ ] dedicated M16 qualification passes;
- [ ] TypeScript passes;
- [ ] production build passes;
- [ ] first complete behavioral candidate SHA/tree recorded;
- [ ] result + architecture finding + evidence ceiling recorded;
- [ ] documentation-complete final head requalified;
- [ ] exact qualified head merged with expected-head guard;
- [ ] integrated `main` SHA/tree verified;
- [ ] post-merge CI claimed only if it actually exists.

## 15. Evidence ceiling

Even on PASS, the maximum claim is:

> An existing Relationship-derived permanent Trait can materially alter the solution space of a bounded production gameplay problem and produce a distinct later Relationship consequence through generic gameplay contracts.

M16 does not qualify full build diversity, a complete ability/skill system, balanced Trait usefulness, combat viability, generalized RPG skill checks, campaign-scale Trait relevance, puzzle quality, or human enjoyment.

## 16. Merge authority

Build Validation on the exact candidate SHA is merge authority. Gemini is not merge authority.
