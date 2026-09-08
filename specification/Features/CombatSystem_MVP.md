# Combat System MVP Specification

**Implementation Status:** ✅ Event bus + one M17-qualified transient deterministic encounter vertical slice + bounded world-presence launch gate; not a general combat system  
**Trait doctrine:** See `../Technical/PostM16TraitGameplayReconciliation.md`.  
**M17 evidence:** See `../Technical/M17NarrowCombatVerticalSliceQualification.md`, `../Technical/M17NarrowCombatVerticalSliceReconAmendment.md`, and `../Technical/M17NarrowCombatVerticalSliceResult.md`.  
**Active-loop repair evidence:** See `../Technical/ActiveRpgLoopIntegrationRepairQualification.md`, `../Technical/ActiveRpgLoopIntegrationRepairReconAmendment.md`, and `../Technical/ActiveRpgLoopIntegrationRepairResult.md`.

This document defines the currently qualified combat surface for the prototype. The original lightweight combat event bus remains in place, M17 adds one bounded player-facing encounter proof, and the post-Checkpoint-B active-loop repair makes canonical world presence authoritative for entering that encounter without making combat persistent campaign state or introducing a generalized ability/world-condition framework.

## 1. Current qualified scope

The current combat surface has three bounded layers:

1. **Combat event bridge** — `targetKilled({ targetId })` remains a lightweight Redux event consumed by Quest listeners.
2. **M17 encounter proof** — a Combat-owned transient deterministic state machine renders one player-facing production encounter and emits `targetKilled` on legitimate victory.
3. **World-presence launch gate** — an encounter definition may declare one canonical `requiredLocationId`; the production launcher consumes `Player.location` before exposing the existing encounter.

The qualified loop is now:

```text
active Quest KILL objective
-> matching Combat encounter definition
-> canonical encounter-location availability
-> deterministic player-facing encounter
-> ordinary or Trait-sensitive tactical choices
-> legitimate victory
-> targetKilled({ targetId })
-> existing Quest listener
-> KILL objective advances
```

The evidence ceiling remains intentionally narrow: one bounded encounter and one bounded canonical-location launch requirement are qualified, not a complete combat game or generalized encounter-condition system.

## 2. Runtime authority

### 2.1 Redux event surface

`src/features/Combat/CombatSlice.ts` remains event-bus-only.

Current action:

```text
targetKilled({ targetId })
```

The Combat reducer is **not registered in `RootState`**.

M17 deliberately did not add persistent combat state because baseline save envelopes serialize `RootState` and the first encounter did not justify a save-schema migration merely to hold ephemeral round state.

The active-loop repair does not change that persistence boundary.

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

### 2.3 Encounter world-presence availability

`CombatEncounterDefinition` now supports the bounded optional field:

```ts
requiredLocationId?: string
```

`CombatEncounterAvailability.ts` compares that canonical authored location with canonical `Player.location` before the production launcher exposes the encounter.

The pure combat engine does not interpret world state. The world-presence rule exists at encounter-entry availability, preserving separation between:

```text
World / Player -> where the player is
Combat authoring -> where this encounter is
Combat engine -> what happens once the encounter begins
```

This does **not** establish an arbitrary encounter-condition expression language.

## 3. Production encounter — The Telluric Echo

M17 authors one encounter definition:

```text
encounter_m17_telluric_echo
enemy_m17_telluric_echo_fragment
```

The active-loop repair canonically situates that encounter at:

```text
location_whispering_woods
```

Away from Whispering Woods, the active Quest may remain visible but the encounter launcher explains the required location and does not expose `Begin Encounter`.

At Whispering Woods, the unchanged M17 encounter becomes available.

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

The active-loop repair adds an orthogonal world authority:

```text
Player.location + encounter.requiredLocationId
-> whether the encounter can be entered here
```

World presence does not substitute for Trait ownership, and Trait ownership does not bypass world presence.

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

`ActiveQuestCombatPanel` generically inspects active `KILL` objectives and finds a matching Combat encounter definition.

If that definition has a `requiredLocationId`, the panel consumes canonical `Player.location` through the bounded encounter-availability helper before exposing the encounter. Away from the required location, it presents the location requirement rather than the encounter itself.

The generic launcher contains no Willow/M17-specific branch.

Once an encounter is legitimately entered, `CombatEncounterPanel` renders currently valid actions, but presentation is not the tactical correctness boundary. `CombatEngine.performCombatAction` independently rejects invalid tactical calls before encounter mutation.

Rejected tactical cases include:

- missing permanent Trait;
- tracing an already-read pattern;
- disrupting before tracing;
- disrupting in the wrong phase;
- action after victory;
- action after defeat.

An invalid tactical call must not advance the round, change health, mutate pattern state, emit a kill, or advance a Quest.

The active-loop repair's location rule is qualified at the production encounter-entry boundary; it does not add world-state interpretation to the pure combat engine.

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

The active-loop repair also introduces no new Combat -> Quest bridge: it only determines whether the existing encounter can be entered at the player's current canonical location.

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

The active-loop repair does not change any of this arithmetic.

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

The active-loop repair also requires no save-schema change: canonical `Player.location` already persists through the existing save envelope, while the encounter's required location is static authored definition data.

Mid-combat persistence is deferred until a future production requirement justifies it.

## 9. Relationship boundary

Combat results do not automatically become Relationship history.

M17 requires downstream Quest consumption only. It does not add a generic Combat -> Relationship bridge.

Likewise, being at the required encounter location does not alter Connection, Trust, Memories, or other Relationship history.

If later story or NPC content interprets a combat consequence relationally, that interpretation must be explicitly authored through ordinary Relationship Experience contracts.

## 10. Qualification

### M17

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

### Active RPG Loop Integration Repair

Dedicated cross-system qualification:

```text
src/features/Exploration/ActiveRpgLoopIntegrationRepair.test.tsx
```

The repair qualifies that the existing Telluric Echo cannot be entered away from its canonical Whispering Woods location and becomes available when canonical player location matches, without changing the M17 combat engine or Quest consequence bridge.

The first fully qualified repair behavior candidate is:

```text
SHA  3dc8ce8f2ae70cbc15eba2e80277902c5e8b513a
tree f7cd974f73989d62557bb57eb7fbb6bba439fc01
```

Build Validation #194:

```text
run 34182041060
job 101922918366
```

passed dependency installation, TypeScript, dedicated repair qualification, modified historical qualification, otherwise unchanged accumulated M4-M19 qualification, and production build.

See `../Technical/ActiveRpgLoopIntegrationRepairResult.md` for the diagnostic history and evidence ceiling.

## 11. Evidence ceiling

M17 may establish only:

> One bounded production encounter demonstrates that an existing Relationship-derived permanent Trait can create a meaningful optional tactical combat capability, while a viable no-Trait strategy remains available, player choice remains authoritative, and combat victory integrates with an existing Quest objective through the ordinary combat event bridge.

The active-loop repair additionally establishes only:

> That same bounded encounter can require one canonical authored location at the production encounter-entry boundary, making objective player location relevant without adding a generalized world/encounter-condition engine or changing combat arithmetic.

These results do **not** establish:

- combat-system completeness;
- combat fun or pacing;
- balance beyond the frozen deterministic proof;
- generalized abilities;
- generalized encounter-condition expressions;
- arbitrary encounter placement rules;
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
- temporary Trait combat semantics;
- richer encounter placement only if repeated production evidence warrants it.

Do not infer that any of these are required merely because M17 or the bounded active-loop repair passed.
