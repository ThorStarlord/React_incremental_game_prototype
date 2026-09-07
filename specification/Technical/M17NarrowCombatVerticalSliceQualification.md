# M17 — Narrow Combat Vertical Slice Qualification

**Status:** Preregistered before behavioral implementation  
**Baseline:** `main` at `cc5b6d352edfbd435ee08517fa6c5cf6b95b5688`  
**Baseline tree:** `bf7dbcc82575b2698fd915f3cc4ae41dc75c0aac`  
**Branch:** `feature/m17-narrow-combat-vertical-slice`

## 1. Scientific question

> Can an existing Relationship-derived permanent Trait create a meaningful tactical option in one bounded production combat encounter—without becoming an automatic best action, a pure passive stat bonus, or a prerequisite for victory—while preserving Trait-state capability authority and producing an ordinary combat result consumable by the existing Quest system?

M17 is not a project to build a generalized combat engine. It is a bounded empirical qualification of the post-M16 / Checkpoint-A product doctrine:

```text
Relationship-derived learning
-> permanent Trait
-> combat applicability
-> player tactical choice
-> encounter consequence
-> ordinary Quest consequence
```

## 2. Existing authority at baseline

At the frozen baseline:

- `CombatSlice` contains no encounter state and only exposes the side-effect-only `targetKilled({ targetId })` action;
- the existing game-event listener advances ordinary `KILL` quest objectives from `targetKilled`;
- permanent learned capability authority is `player.permanentTraits`;
- M16 qualified permanent-Trait gameplay consumption in Quest through `requiredPermanentTraitIds`;
- Checkpoint A canonized that Relationship qualifies learning, Trait owns durable learned capability, the consuming gameplay system owns local applicability, and the player owns the decision to use an available capability;
- temporary/equipped Trait gameplay semantics remain intentionally unresolved.

M17 must preserve those authority boundaries.

## 3. Primary production Trait

Primary Trait candidate: `WillowsWisdom`.

Its qualified gameplay identity is not the legacy/passive `learningSpeed` bonus alone. Post-M16 canon treats it as an internalized slow-pattern / systemic-causation capability.

Semantic hypothesis for M17:

> A protagonist who has permanently internalized Willow's Wisdom can recognize a repeating Essence feedback cycle in a combatant and thereby perceive a tactical opportunity that an ordinary fighter does not perceive.

This hypothesis must pass the semantic-fit gate in Section 4 before behavioral implementation proceeds.

## 4. Pre-implementation semantic-fit gate

After preregistration, inspect the exact combat, player, Trait, Quest, save, and UI surfaces.

Proceed only if all are true:

1. Willow's Wisdom can be expressed in the encounter as recognition of slow/repeating systemic causation rather than an arbitrary Willow-themed combat power.
2. The combat action can be authorized by permanent Trait ownership without reading Willow Relationship state directly.
3. A viable no-Trait strategy can exist in the same encounter.
4. The Trait can expose an optional tactical possibility rather than automatically resolving the encounter.
5. The encounter can produce a normal `targetKilled` result that the existing Quest listener consumes.
6. The first bounded proof does not require a generalized ability/condition DSL.

If any of these fail, stop M17 and record the prerequisite/semantic finding instead of accommodating the milestone.

## 5. Production slice — The Telluric Echo

Working IDs:

```text
encounter_m17_telluric_echo
enemy_m17_telluric_echo_fragment
quest_m17_telluric_echo
```

Narrative premise:

A Telluric Echo Fragment is sustained by a repeating Essence feedback cycle. An ordinary fighter can defeat the manifestation through conventional attrition. A protagonist with permanent `WillowsWisdom` can recognize the causal cycle and deliberately interfere with it.

The Trait must not create an instant-win button.

## 6. Intended bounded combat model

M17 should introduce only the smallest state necessary for one deterministic encounter.

Expected conceptual state:

```text
active encounter
encounter status: idle / active / victory / defeat
round
player combat health
enemy combat health
enemy phase
whether the feedback pattern has been read
```

The exact runtime shape is not frozen until post-preregistration reconnaissance confirms the least disruptive authority surface.

M17 must not assume that all legacy Player combat stats need to become authoritative. If integrating the old stat model expands scope substantially, encounter-local deterministic values are preferred for this bounded proof, with generalized stat authority deferred.

## 7. Baseline player actions

Minimum ordinary action set:

- `Strike` — deterministic damage;
- `Guard` — deterministic incoming-damage mitigation;
- an additional neutral/observe action only if the production encounter genuinely requires it.

Do not add mana, spells, items, critical hits, dodge, status effects, equipment combat rules, targeting, or skill bars unless the bounded encounter cannot function without one of them.

## 8. Trait-sensitive tactical sequence

Preferred design:

```text
permanent WillowsWisdom
-> Trace the Cycle
-> accept immediate tempo/opportunity cost
-> feedback pattern becomes legible
-> wait for / recognize the appropriate phase
-> Disrupt the Feedback
```

`Trace the Cycle` should require permanent `WillowsWisdom`.

`Disrupt the Feedback` should require both the learned pattern and the correct local tactical state.

The disruption should suppress or alter a regeneration/feedback event, not produce automatic victory.

This two-step design is preferred because it lets the Trait route carry a tactical cost and remain non-dominant in some board states.

## 9. Control route

A player without permanent `WillowsWisdom` must be able to defeat the exact same enemy through ordinary actions.

The no-Trait route may be slower, riskier, or more resource-intensive, but it must be a legitimate strategy rather than a fake failure path.

Required invariant:

```text
no Trait -> viable strategy A
Trait    -> strategy A remains available + strategy B becomes available
```

## 10. Capability authority

Combat capability must be based on permanent Trait ownership, conceptually:

```text
player.permanentTraits contains WillowsWisdom
```

Combat must not substitute:

- Willow Connection level;
- Affinity;
- Trust;
- Willow Memories;
- legacy `connectionDepth`;
- an M17-specific story boolean.

Relationship history explains and qualifies learning. Permanent Trait state owns the durable learned capability.

## 11. Reuse of permanent-Trait requirement semantics

M16 already justified the semantic concept that an authored gameplay option may require one or more permanent Traits.

M17 may reuse or minimally extract a pure permanent-Trait requirement predicate if reconnaissance shows that doing so reduces duplication cleanly.

M17 does **not** justify a generalized RPG condition system.

Out of scope:

```text
anyOfTraits
forbiddenTraits
requiredStats
skill checks
AND/OR/NOT condition AST
ability registry
combat scripting language
```

## 12. UI/runtime agreement

The player-facing combat surface must expose only currently valid actions.

However, UI hiding is not the correctness boundary.

A direct attempt to execute a missing-Trait or wrong-phase tactical action must be rejected before any encounter mutation, including:

- player health change;
- enemy health change;
- round advancement;
- pattern state change;
- victory/defeat transition;
- `targetKilled` emission;
- Quest progress.

## 13. Quest integration

M17 should reuse the existing combat-to-Quest bridge rather than invent a new generic bridge.

The production Quest should contain a normal `KILL` objective targeting `enemy_m17_telluric_echo_fragment`.

Expected path:

```text
legitimate combat victory
-> targetKilled({ targetId: enemy_m17_telluric_echo_fragment })
-> existing Quest listener
-> KILL objective advances
```

Victory must emit the kill result exactly once.

## 14. Relationship consequence scope

A direct Combat -> Relationship bridge is **not required** for M17 PASS.

Quest consumption is the required downstream integration proof.

Relationship interpretation may be authored only if existing ordinary contracts can express it without introducing a new generic bridge or shadow social state.

## 15. Defeat and replay

Defeat must produce no kill event and no Quest progress.

Post-victory actions must be rejected, and repeated/stale victory attempts must not duplicate `targetKilled` or Quest progress.

M17 must not recreate the one-shot/replay defect class previously found in M14 dialogue decisions.

## 16. Persistence boundary

Required persistence proof:

```text
permanent WillowsWisdom
-> save
-> load
-> start encounter
-> Trait tactical option remains available
```

Mid-combat persistence is not required unless reconnaissance shows that combat state already participates naturally in the existing save schema.

Do not expand the save schema solely to prove M17.

## 17. Dedicated qualification test

Preferred ownership location:

```text
src/features/Combat/CombatM17TraitTacticalVerticalSlice.test.tsx
```

The primary test belongs to Combat because Combat owns the new experimental behavior.

Expected cases:

1. architecture / production wiring;
2. no-Trait control victory;
3. permanent-Willow-Trait tactical route;
4. strong Willow Relationship without permanent Trait does not grant capability;
5. owning the Trait does not force its use;
6. wrong-phase tactical action is rejected without mutation;
7. defeat produces no Quest progress;
8. victory is one-shot / replay-safe.

## 18. Explicit non-goals

M17 does not implement or qualify:

- generalized ability system;
- spellcasting or mana;
- cooldowns;
- status effects;
- elemental damage;
- critical-hit or dodge systems;
- equipment combat integration;
- loot tables;
- generalized enemy AI;
- procedural encounters;
- party or multi-enemy combat;
- target-selection architecture;
- Trait synergy/combo engine;
- temporary/equipped Trait combat semantics;
- faction/world-state consequence;
- offline combat;
- Copy combat automation.

## 19. Stop / falsification conditions

Stop M17 rather than accommodate it if:

1. Willow's Wisdom only fits by becoming an arbitrary Willow-themed combat power.
2. The no-Trait route is not legitimately winnable.
3. The Trait route collapses to a flat passive stat bonus.
4. Combat needs Willow Relationship state directly to grant the learned capability.
5. One encounter requires a generalized ability/condition architecture before it can function.
6. The existing `targetKilled` -> Quest bridge proves unsafe or replay-corrupting; isolate and qualify that prerequisite separately.
7. Correct runtime enforcement cannot prevent UI bypass before state mutation.

A preregistered stop is a valid experimental outcome.

## 20. Acceptance criteria

M17 PASS requires:

- exact baseline SHA/tree frozen;
- preregistration committed before behavior changes;
- combat/player/Trait/Quest/save/UI reconnaissance recorded;
- semantic-fit gate passed explicitly;
- one player-facing production encounter;
- one production Quest consuming encounter victory;
- one enemy and deterministic flow;
- meaningful ordinary attack/defense decisions;
- no-Trait route genuinely winnable;
- permanent `WillowsWisdom` creates a materially different optional tactical possibility;
- ordinary strategy remains available with the Trait;
- the Trait does not automatically execute or decide;
- the Trait route is not only a passive numerical bonus;
- the Trait route is not unconditionally superior;
- strong Willow Relationship without permanent Trait does not grant the capability;
- unavailable/wrong-phase actions are rejected below UI before mutation;
- defeat does not advance Quest;
- victory advances Quest through the existing `targetKilled` bridge;
- victory emission/progress is one-shot;
- no Willow/NPC-specific generic-runtime branch;
- no generalized RPG ability DSL;
- no new Relationship dimension/tier;
- temporary Trait semantics remain deferred;
- permanent Trait survives save/load before encounter use;
- no new save schema unless an actual persistence prerequisite is discovered;
- accumulated M4-M16 suite passes;
- dedicated M17 suite passes;
- TypeScript passes;
- production build passes;
- first complete behavioral candidate SHA/tree recorded;
- exact-head Build Validation passes;
- result, architecture finding, and evidence ceiling recorded;
- documentation-complete final head receives a second exact-head Build Validation;
- exact qualified head is merged and integrated tree verified;
- post-merge CI is claimed only if it actually exists;
- stop before M18.

## 21. Evidence ceiling

On PASS, M17 may establish only:

> One bounded production encounter demonstrates that an existing Relationship-derived permanent Trait can create a meaningful optional tactical combat capability, while a viable no-Trait strategy remains available, player choice remains authoritative, and combat victory integrates with an existing Quest objective through the ordinary combat event bridge.

M17 does not establish combat-system completeness, fun, balance, generalized abilities, all-Trait combat relevance, enemy-AI quality, multi-enemy combat, temporary-Trait combat semantics, campaign build diversity, or long-term combat progression.

## 22. Qualification sequence

1. verify/freeze `main`;
2. create M17 branch;
3. commit this preregistration;
4. recon exact combat/player/Trait/Quest/save/UI surfaces;
5. apply semantic-fit gate;
6. freeze deterministic encounter arithmetic;
7. implement smallest ordinary encounter loop;
8. prove no-Trait control first;
9. add permanent-Trait tactical path;
10. add UI/runtime authority enforcement;
11. reuse `targetKilled` for Quest integration;
12. add dedicated M17 qualification test;
13. add M17 test to accumulated Build Validation;
14. freeze first complete behavioral candidate;
15. open draft PR;
16. exact-head Build Validation;
17. record results / architecture finding / evidence ceiling;
18. freeze documentation-complete head;
19. exact-head Build Validation again;
20. mark PR ready;
21. verify head unchanged;
22. merge with expected-head guard;
23. verify integrated `main` tree;
24. inspect actual post-merge workflow reality;
25. stop before M18.
