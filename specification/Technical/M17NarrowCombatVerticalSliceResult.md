# M17 — Narrow Combat Vertical Slice Result

**Verdict:** QUALIFIED — PASS  
**Baseline:** `cc5b6d352edfbd435ee08517fa6c5cf6b95b5688`  
**Baseline tree:** `bf7dbcc82575b2698fd915f3cc4ae41dc75c0aac`  
**Preregistration commit:** `d4ed04bae96e85ac6782f8bfa675115d72da90e2`  
**Reconnaissance amendment commit:** `1caf5ef8ee007eee83a998da906f50945f13bcbc`

## 1. Question answered

M17 asked:

> Can an existing Relationship-derived permanent Trait create a meaningful tactical option in one bounded production combat encounter—without becoming an automatic best action, a pure passive stat bonus, or a prerequisite for victory—while preserving Trait-state capability authority and producing an ordinary combat result consumable by the existing Quest system?

**Answer: yes, within the bounded evidence ceiling below.**

## 2. Production slice qualified

M17 implemented **The Echo Beneath the Grove** with one deterministic Telluric Echo Fragment encounter.

Production identifiers:

```text
quest_m17_telluric_echo
encounter_m17_telluric_echo
enemy_m17_telluric_echo_fragment
```

The Quest is a normal Willow SIDE quest whose prerequisite is completion of `quest_m16_withering_grove` and whose objective is a normal `KILL` objective for the Echo target.

The production Dashboard surfaces a Combat encounter generically when an active `KILL` objective target maps to an authored encounter definition.

## 3. Control path

Without permanent `WillowsWisdom`, the exact production encounter remains winnable through ordinary actions.

Frozen deterministic path:

```text
Strike
Guard
Strike
Strike
Guard
Strike
```

Result:

```text
victory
6 rounds
5 / 12 encounter HP remaining
feedback not disrupted
```

This is a real control strategy, not a placeholder failure route.

## 4. Relationship-derived Trait path

With permanent `WillowsWisdom`, the same encounter additionally exposes:

```text
Trace the Cycle
-> read the repeating Essence feedback pattern

Disrupt the Feedback
-> valid only after tracing
-> valid only during release
-> suppress future regeneration
```

Frozen tactical path:

```text
Strike
Trace the Cycle
Disrupt the Feedback
Strike
Strike
```

Result:

```text
victory
5 rounds
4 / 12 encounter HP remaining
feedback disrupted
```

The Trait route is therefore materially different but not universally dominant: it wins one round earlier in the frozen line while leaving one less encounter HP because pattern-reading spends offensive/defensive tempo.

The test also verifies that a player who owns `WillowsWisdom` may ignore the Trait tactic and execute the ordinary control line unchanged.

## 5. Capability / decision boundary

M17 preserves:

```text
Relationship -> learning provenance / qualification
Trait        -> durable learned capability
Combat       -> local tactical applicability
Player       -> decision whether to use it
```

Strong Willow Relationship evidence without permanent `WillowsWisdom` does not expose the Trait combat action.

Combat does not use Connection, Affinity, Trust, Memory, or legacy `connectionDepth` as capability substitutes.

## 6. Runtime enforcement

The player-facing UI hides Trait actions when the required permanent Trait is absent.

More importantly, `CombatEngine.performCombatAction` rejects invalid direct invocations before mutation.

Qualified rejected cases include:

- `Trace the Cycle` without permanent `WillowsWisdom`;
- feedback disruption in the wrong phase;
- terminal post-victory action.

The dedicated test asserts state equality before/after invalid calls where applicable.

## 7. Quest integration

M17 reused the existing ordinary bridge:

```text
legitimate combat victory
-> targetKilled({ targetId })
-> existing GameEventListeners combat listener
-> active matching KILL objective increments
-> Quest becomes READY_TO_COMPLETE
```

No new Combat -> Quest bridge was added.

Defeat emits no kill consequence and does not advance the Quest.

Victory is reported once, and terminal state rejects replay.

## 8. Persistence boundary

The permanent Willow Trait is saved and restored through the existing save/load/migration path before the encounter starts.

After load:

- the Quest remains active;
- `WillowsWisdom` remains in `player.permanentTraits`;
- the Trait tactical action is available in the fresh encounter.

M17 deliberately does not persist active combat state.

No Combat reducer was registered in `RootState`, and no save-schema migration was introduced.

## 9. Architecture finding

### 9.1 Transient encounter state — sufficient for this proof

Reconnaissance found that baseline Combat was an event bus, not a registered Redux state domain.

M17 demonstrates that one stateful player-facing combat proof can remain Combat-owned and transient while still:

- consuming authoritative permanent Trait state from Redux;
- providing deterministic tactical state;
- producing an ordinary combat event;
- integrating with a persisted Quest objective.

This does not prove transient local state is the final combat architecture. It establishes only that persistent Combat state was not required for the first bounded proof.

### 9.2 Permanent-Trait predicate — bounded positive abstraction

M16 had already qualified permanent-Trait requirements in Quest. M17 independently needed the same semantic in Combat.

The pure predicate was therefore extracted into:

```text
src/features/Traits/state/TraitCapabilityRequirements.ts
```

Quest and Combat now reuse that Trait-owned predicate.

This is the abstraction justified by the evidence. M17 did not add any-of/forbidden Traits, stat checks, skill checks, boolean condition ASTs, or a generic ability registry.

## 10. Diff boundary

The first complete behavioral candidate differed from baseline in exactly 13 intended files.

`public/data/quests.json` changed by only +12 lines: the single M17 quest.

No changes occurred to:

- `src/app/store.ts`;
- save schema;
- Relationship runtime;
- NPC data;
- Trait catalogue.

## 11. Dedicated qualification suite

`src/features/Combat/CombatM17TraitTacticalVerticalSlice.test.tsx` qualifies:

1. production wiring / domain boundaries;
2. deterministic control and Trait routes;
3. missing-Trait and wrong-phase bypass rejection before mutation;
4. no-Trait production UI plus real Quest advancement;
5. permanent Willow Trait through save/load plus tactical production route;
6. strong Willow Relationship without permanent Trait remaining insufficient;
7. defeat producing no Quest progress;
8. one-shot victory / terminal replay rejection.

## 12. First complete behavioral candidate

Exact candidate:

```text
SHA  8c94e5d3253240da3484283421cd42fb3047b99d
tree b44e3cc234a395951d1c254b9e93ae981c6fdf0d
```

Build Validation:

```text
run 34121885910
job 101741576025
Build Validation #171
```

Result: **PASS**

- dependency installation ✅
- TypeScript ✅
- accumulated M4-M17 behavioral qualification ✅
- production build ✅

No implementation repair cycle occurred after the first complete behavioral candidate entered CI.

## 13. Final-head requirement

The documentation-complete candidate is not merge-qualified merely because #171 passed.

After this result record and the Combat specification update are committed, the new exact branch head must receive another full Build Validation PASS before merge.

## 14. Qualified claim / evidence ceiling

M17 may establish only:

> One bounded production encounter demonstrates that an existing Relationship-derived permanent Trait can create a meaningful optional tactical combat capability, while a viable no-Trait strategy remains available, player choice remains authoritative, and combat victory integrates with an existing Quest objective through the ordinary combat event bridge.

M17 does **not** establish:

- combat-system completeness;
- combat fun, pacing, or human preference;
- broad combat balance;
- generalized ability architecture;
- combat usefulness of every Trait;
- generalized Player combat-stat authority;
- enemy-AI quality;
- multi-enemy or party combat;
- equipment/item combat;
- temporary/equipped Trait combat capability;
- Trait synergy;
- campaign-scale build diversity;
- long-term combat progression;
- mid-combat persistence;
- automatic Combat -> Relationship interpretation.

## 15. Next boundary

After exact final-head qualification and merge, stop M17.

Do not create M18 in this pull request.
