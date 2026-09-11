# Alpha Completion Contract — Campaign One / 1.0

**Status:** CURRENT AUTHORITY — PROVISIONAL / HUMAN-UNVALIDATED  
**Parent:** `../GameCompletionDefinition.md`  
**Campaign:** `../Narrative/CampaignArchitecture.md`  
**Prepared:** 2026-09-11

## Purpose

Alpha means the repository contains a **whole playable game structure**, not merely a growing set of qualified subsystems.

Alpha is primarily an implementation/composition gate. It does not claim final comprehension, pacing, balance, enjoyment, presentation, or retention.

## Alpha definition

> **A normal player can start a fresh game and legally reach the Campaign One epilogue through ordinary player UI, with every required 1.0 system present at required scope and no debug-only progression dependency.**

## Preconditions

Before Alpha may be declared:

- `GameCompletionDefinition.md` is current and contains an explicit 1.0 stop condition;
- `Features/FeatureScopeMatrix.md` has no `UNDECIDED` item on the 1.0 critical path;
- `Progression/GameProgressionArc.md` defines the complete player transformation;
- `Narrative/CampaignArchitecture.md` defines the complete campaign spine;
- the active implementation baseline passes current exact-head Build Validation.

## Required functional gates

### New Game / onboarding

- [ ] New Game enters a valid fresh-save state through normal UI.
- [ ] The first actionable objective is discoverable without debug tools.
- [ ] The player can reach the first meaningful Relationship interaction through normal UI.
- [ ] The prologue teaches `action -> remembered consequence` through play.
- [ ] No required first-session action is available only through DebugPage or injected state.

### Campaign spine

- [ ] Prologue is playable.
- [ ] Chapter 1 — Merchant District Crisis is legally reachable and completable.
- [ ] Chapter 2 — Archive Inquiry is legally reachable and completable.
- [ ] Chapter 3 — Enemies in Phase is legally reachable and completable.
- [ ] Chapter 4 — Lattice Under Strain is legally reachable and completable.
- [ ] Chapter 5 — The Chrono-Crypt is legally reachable and completable.
- [ ] Chapter 6 — Network Under Pressure is legally reachable and completable.
- [ ] Chapter 7 — Counterphase is legally reachable and completable.
- [ ] Telluric Echo finale is legally reachable and resolvable.
- [ ] A state-responsive epilogue is rendered.
- [ ] Campaign-complete state persists across save/load.

Alpha content may still be terse or visually unfinished, but no required campaign unit may be a route-level dead end or pure placeholder.

### Relationship / capability loop

- [ ] All six anchor NPCs have a legal campaign presence.
- [ ] Every anchor NPC has at least one later callback/consumer.
- [ ] At least four relationship-derived durable capability identities are obtainable.
- [ ] At least three source relationships contribute to that capability floor.
- [ ] At least two capabilities have meaningful cross-domain application.
- [ ] At least two viable late-game capability/build profiles exist.
- [ ] Baseline routes remain viable where the local contract requires them.
- [ ] Hidden future Relationship/Memory requirements are not exposed as spoiler lists.

### Multi-domain consequence loop

- [ ] Relationship state is not used as a substitute for Knowledge.
- [ ] Knowledge is not used as a substitute for Faction Reputation.
- [ ] Faction Reputation is not used as a substitute for objective World State.
- [ ] At least one campaign sequence makes each distinction player-relevant.
- [ ] The finale/epilogue consumes meaningful prior state rather than one universal completion meter.

### Earned delegation / incremental loop

- [ ] At least three routine identities can be personally mastered.
- [ ] At least two gameplay contexts teach those routines.
- [ ] Personal mastery remains separate from Copy-specific readiness.
- [ ] The player explicitly assigns/prioritizes delegated work.
- [ ] No automatic task chain makes a new strategic choice for the player.
- [ ] Bounded offline progress advances only current authorized safe work.
- [ ] Offline time cannot complete narrative, social, faction, world-state, quest-resolution, travel, or combat decisions.

### Persistence

- [ ] Normal save/load works in early campaign.
- [ ] Normal save/load works in mid campaign.
- [ ] Normal save/load works immediately before the finale.
- [ ] Normal save/load works after campaign completion.
- [ ] Import/export preserves a representative whole-campaign state.
- [ ] Legacy/migration protections still pass current qualification.
- [ ] GameLoop fresh-mount timing invariants remain preserved after load.

### Player-facing surface cleanup

- [ ] No primary navigation entry presents a `CUT` 1.0 system as an upcoming required feature.
- [ ] Separate Skills placeholder is removed from 1.0 player navigation.
- [ ] Generic Crafting placeholder is removed from 1.0 player navigation.
- [ ] General Inventory placeholder is removed from primary 1.0 navigation while deferred.
- [ ] Dedicated Saves placeholder is removed or reduced to a thin view over canonical existing save authority.
- [ ] Required campaign progression does not depend on a placeholder screen.

## Technical qualification requirements

Alpha must add a dedicated whole-game qualification command, expected form:

```bash
npm run alpha:validate
```

The final exact command may evolve, but it must cover at least:

1. fresh-game start contract;
2. legal campaign reachability from opening to ending;
3. representative divergent route state;
4. capability-build floor;
5. routine/delegation floor;
6. save/load at representative campaign boundaries;
7. persisted campaign-complete state;
8. negative proof that debug injection is unnecessary;
9. negative proof that offline progression cannot resolve prohibited authorities;
10. content/chapter integrity over every production campaign unit.

Build Validation must run the Alpha gate before Alpha is declared.

## Definition of “ordinary UI”

Alpha qualification must use the same production actions available to a player.

Permitted test setup may create a fresh deterministic store or accelerate purely repetitive test time where the contract explicitly allows it, but the **end-to-end Alpha route** must demonstrate that required state can be produced through the same thunks/actions that production UI invokes.

A result produced only by direct state mutation/debug injection does not establish campaign reachability.

## Placeholder and TODO rule

Alpha does not require zero TODO comments in the repository.

It does require:

- no placeholder on the critical campaign path;
- no player-visible `planned` surface advertised as a required 1.0 feature;
- no known missing `CORE_1_0` behavior;
- no unfinished chapter in the Campaign One spine.

## Human evidence boundary

Alpha may be declared without a human Product Review PASS because it is an implementation-completeness gate.

However Alpha must be labeled **HUMAN-UNVALIDATED** until real evidence exists. Alpha does not prove:

- a fresh player knows what to do;
- causal explanations are understandable;
- pacing is good;
- combat/economy is balanced;
- delegation feels rewarding;
- the game is fun.

Those become Beta-critical evidence.

## Alpha failure classification

An Alpha candidate fails if any critical-path gap is:

```text
MISSING_SYSTEM
MISSING_CAMPAIGN_UNIT
UNREACHABLE_CONTENT
BROKEN_STATE_TRANSITION
SAVE_INCOMPATIBILITY
PROHIBITED_AUTOMATION
PLACEHOLDER_DEPENDENCY
SCOPE_DRIFT
QUALIFICATION_GAP
```

Fix the smallest demonstrated layer. Do not answer an Alpha failure by automatically creating a generalized framework.

## Alpha exit

Declare `ALPHA_PASS` only when all required checkboxes are satisfied and one exact candidate head passes the complete Build Validation chain including `alpha:validate`.

After Alpha:

```text
feature expansion freezes by default
-> complete authored content
-> continuous human review
-> Content Alpha
-> Beta
```

A green Alpha does not authorize unrelated systems or post-1.0 scope.
