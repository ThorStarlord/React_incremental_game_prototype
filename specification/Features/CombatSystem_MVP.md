# Combat System MVP Specification

**Implementation Status:** ✅ Event bus + one M17-qualified transient deterministic encounter vertical slice; not a general combat system  
**Trait doctrine:** See `../Technical/PostM16TraitGameplayReconciliation.md`.  
**M17 evidence:** See `../Technical/M17NarrowCombatVerticalSliceQualification.md`, `../Technical/M17NarrowCombatVerticalSliceReconAmendment.md`, and `../Technical/M17NarrowCombatVerticalSliceResult.md`.

This document defines the currently qualified combat surface for the prototype. The original lightweight combat event bus remains in place, and M17 adds one bounded player-facing encounter proof without making combat persistent campaign state or introducing a generalized ability framework.

## 1. Current qualified scope

The current combat surface has two layers:

1. **Combat event bridge** — `targetKilled({ targetId })` remains a lightweight Redux event consumed by Quest listeners.
2. **M17 encounter proof** — a Combat-owned transient deterministic state machine renders one player-facing production encounter and emits `targetKilled` on legitimate victory.

The M17 loop is:

```text
active Quest KILL objective
-> matching Combat encounter definition
-> deterministic player-facing encounter
-> ordinary or Trait-sensitive tactical choices
-> legitimate victory
-> targetKilled({ targetId })
-> existing Quest listener
-> KILL objective advances
```

The evidence ceiling remains intentionally narrow: one bounded encounter is qualified, not a complete combat game.

## 2. Runtime authority

### 2.1 Redux event surface

`src/features/Combat/CombatSlice.ts` remains event-bus-only.

Current action:

```text
targetKilled({ targetId })
```

The Combat reducer is **not registered in `RootState`**.

M17 deliberately did not add persistent combat state because baseline save envelopes serialize `RootState` and the first encounter did not justify a save-schema migration merely to hold ephemeral round state.

### 2.2 Transient encounter state

`CombatEngine.ts` owns a pure deterministic encounter state machine with bounded state including:

```text
encounter id / target id
active | victory | defeat
round
encounter-local player HP
enemy HP
enemy phase
pattern-read state
feedback-disrupted state
```

The production React encounter panel holds this state transiently.

This architecture is qualified only for the current bounded proof. It is not a permanent prohibition on later persistent Combat state if future requirements justify it.

## 3. Production encounter — The Telluric Echo

M17 authors one encounter definition:

```text
encounter_m17_telluric_echo
enemy_m17_telluric_echo_fragment
```

The Telluric Echo Fragment cycles deterministically through:

```text
stable
-> building
-> release
-> stable
```

The release phase regenerates the Echo unless the feedback loop has been disrupted.

### 3.1 Ordinary actions

`Strike`

- deals deterministic encounter-local damage;
- if the target reaches zero, victory resolves before another enemy response.

`Guard`

- deals no damage;
- reduces the next enemy response by a deterministic amount.

No-Trait victory is deliberately valid.

### 3.2 Willow's Wisdom tactical expression

Permanent `WillowsWisdom` does not grant a flat combat bonus in M17. It exposes a two-step tactical possibility coherent with the Trait's slow-pattern/systemic-causation identity:

```text
Trace the Cycle
-> read the repeating feedback pattern
-> accept immediate tempo risk

Disrupt the Feedback
-> valid only after tracing
-> valid only during release
-> prevent future regeneration
```

The Trait does not choose either action automatically.

The ordinary Strike/Guard strategy remains available to a Trait owner.

## 4. Capability authority

M17 preserves the post-M16 authority chain:

```text
Relationship -> qualifies how the capability was learned
Trait        -> owns durable learned capability
Combat       -> determines local tactical applicability
Player       -> decides whether to use it
```

Combat does not query Willow Connection, Affinity, Trust, Memory, or legacy `connectionDepth` as substitutes for capability ownership.

Permanent capability requirements are evaluated against `player.permanentTraits`.

### 4.1 Shared bounded predicate

M16 first qualified the semantic that an authored gameplay option may require permanent Traits. M17 independently needed the same semantic in a second gameplay domain.

The pure predicate therefore lives in:

```text
src/features/Traits/state/TraitCapabilityRequirements.ts
```

Quest and Combat both reuse it.

This is a bounded positive abstraction result. It does **not** imply support for:

- any-of Trait requirements;
- forbidden Traits;
- temporary/equipped Trait capability equivalence;
- stat checks;
- skill checks;
- arbitrary boolean condition trees;
- generalized ability definitions.

## 5. UI and runtime enforcement

`ActiveQuestCombatPanel` generically inspects active `KILL` objectives and renders an encounter when the objective target has a known Combat encounter definition.

The generic launcher contains no Willow/M17-specific branch.

`CombatEncounterPanel` renders currently valid actions, but presentation is not the correctness boundary. `CombatEngine.performCombatAction` independently rejects invalid calls before encounter mutation.

Rejected cases include:

- missing permanent Trait;
- tracing an already-read pattern;
- disrupting before tracing;
- disrupting in the wrong phase;
- action after victory;
- action after defeat.

An invalid call must not advance the round, change health, mutate pattern state, emit a kill, or advance a Quest.

## 6. Quest integration

M17 adds production Quest **The Echo Beneath the Grove**:

```text
quest_m17_telluric_echo
```

It is a normal Willow SIDE quest with:

```text
QUEST_COMPLETED prerequisite: quest_m16_withering_grove
KILL target: enemy_m17_telluric_echo_fragment
```

The existing follow-on quest logic makes it available after the M16 grove quest is completed.

The existing `GameEventListeners` combat listener consumes `targetKilled` and advances the matching KILL objective. M17 introduces no new Combat -> Quest bridge.

Victory is reported once. Defeat reports no kill and leaves the Quest objective incomplete.

## 7. Deterministic qualified paths

The frozen M17 arithmetic qualified two different viable strategies against the same encounter.

### No-Trait control

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

### Permanent Willow's Wisdom

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

The Trait route is faster in the frozen line but accepts more tempo/health risk. It is therefore materially different without being universally dominant.

A player who owns Willow's Wisdom may still use the ordinary control route and obtain the same ordinary outcome.

## 8. Persistence boundary

M17 qualifies:

```text
permanent WillowsWisdom
-> ordinary save
-> load/migration
-> begin fresh encounter
-> Trait tactical option remains available
```

M17 does **not** save an active encounter.

No Combat key was added to `RootState`, and no save schema change was required.

Mid-combat persistence is deferred until a future production requirement justifies it.

## 9. Relationship boundary

Combat results do not automatically become Relationship history.

M17 requires downstream Quest consumption only. It does not add a generic Combat -> Relationship bridge.

If later story or NPC content interprets a combat consequence relationally, that interpretation must be explicitly authored through ordinary Relationship Experience contracts.

## 10. M17 qualification

Dedicated qualification:

```text
src/features/Combat/CombatM17TraitTacticalVerticalSlice.test.tsx
```

The suite covers:

1. production wiring and domain boundaries;
2. deterministic no-Trait and Willow routes;
3. missing-Trait and wrong-phase direct bypass rejection before mutation;
4. no-Trait production UI and real Quest advancement;
5. permanent Willow's Wisdom through save/load and the tactical production route;
6. strong Willow Relationship history without permanent Trait remaining insufficient;
7. defeat producing no Quest consequence;
8. one-shot victory and terminal replay rejection.

The first complete behavioral candidate passed Build Validation #171 on exact SHA `8c94e5d3253240da3484283421cd42fb3047b99d`, tree `b44e3cc234a395951d1c254b9e93ae981c6fdf0d`.

Run:

```text
34121885910
job 101741576025
```

Passed:

- dependency installation;
- TypeScript;
- accumulated M4-M17 behavioral qualification;
- production build.

No repair cycle occurred after the first complete behavioral candidate entered CI.

The documentation-complete final candidate must be requalified independently before merge.

## 11. Evidence ceiling

M17 may establish only:

> One bounded production encounter demonstrates that an existing Relationship-derived permanent Trait can create a meaningful optional tactical combat capability, while a viable no-Trait strategy remains available, player choice remains authoritative, and combat victory integrates with an existing Quest objective through the ordinary combat event bridge.

M17 does **not** establish:

- combat-system completeness;
- combat fun or pacing;
- balance beyond the frozen deterministic proof;
- generalized abilities;
- all-Trait combat relevance;
- generalized Player stat authority;
- enemy-AI quality;
- multi-enemy or party combat;
- targeting architecture;
- temporary/equipped Trait combat semantics;
- campaign build diversity;
- long-term combat progression;
- mid-combat persistence;
- Combat -> Relationship interpretation.

## 12. Deferred future combat work

Potential future work, only when separately justified, includes:

- broader encounter catalogues;
- persistent encounter/campaign combat state;
- Player stat integration;
- initiative/speed semantics;
- additional ordinary actions;
- damage/mitigation expansion;
- enemy behavior beyond deterministic phase definitions;
- multi-enemy/party combat;
- equipment and item use;
- status effects;
- Trait combinations;
- temporary Trait combat semantics.

Do not infer that any of these are required merely because M17 passed.
