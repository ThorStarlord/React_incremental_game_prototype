# Objective World State System

**Status:** M24 bounded production authority qualified behaviorally; documentation-complete exact-head qualification pending  
**Scope:** persistent objective regional conditions; not social interpretation or generalized world simulation

---

## 1. Purpose

The World State system answers one narrow question:

```text
What objectively exists now in a bounded region?
```

It exists so the game can represent objective conditions such as:

```text
Merchant District patrol density is heavy
Merchant District freight throughput is strong
```

without hiding those facts inside Relationship history, NPC Knowledge, Faction Reputation, Quest completion, or ad-hoc story booleans.

Canonical separation:

```text
WORLD STATE        -> what objectively exists now
KNOWLEDGE          -> which NPC knows which objective facts
RELATIONSHIP       -> what shared history means between people
FACTION REPUTATION -> how an institution regards the player
```

---

## 2. Qualified M24 region

The only region qualified by M24 is the existing canonical exploration location:

```text
location_merchant_district
```

M24 does not create a parallel regional identity system.

---

## 3. Qualified state

Runtime root:

```text
worldState
```

Bounded shape:

```ts
interface WorldState {
  regions: Record<string, RegionalWorldState>;
}

interface RegionalWorldState {
  watchPresence?: 'normal' | 'heavy';
  tradeFlow?: 'normal' | 'strong';
}
```

Selector defaults are neutral:

```text
missing watchPresence -> normal
missing tradeFlow     -> normal
```

Missing current-schema `worldState` from a legacy-like save is also interpreted through these neutral defaults.

---

## 4. Mutation authority

M24 qualifies one typed mutation family:

```ts
type WorldStateMutation =
  | {
      regionId: string;
      field: 'watchPresence';
      value: 'normal' | 'heavy';
    }
  | {
      regionId: string;
      field: 'tradeFlow';
      value: 'normal' | 'strong';
    };
```

The reducer does not expose an arbitrary field/value registry.

Malformed or unqualified values do not become new World State semantics.

---

## 5. M24 production mutation — patrol density

Production content:

```text
valerius_m24_redeploy_patrols
Patrols Where the Threat Actually Is
```

The topic is downstream of:

```text
valerius_exp_m23_public_override
```

but that Relationship evidence is only a prerequisite for the player's explicit operational action.

The objective consequence is separately authored:

```text
WORLD_STATE_SET
location_merchant_district.watchPresence = heavy
```

The M24 mutation does not automatically create new Relationship evidence, Faction standing, Knowledge, or Affinity.

---

## 6. M24 production mutation — freight throughput

Production content:

```text
gronk_m24_release_verified_freight
Move the Contracts, Not Just the Numbers
```

The topic requires:

```text
Merchants Guild reputation >= 10
```

The institutional standing enables the explicit action but is not itself objective freight throughput.

Before the player acts:

```text
Guild standing >= 10
tradeFlow = normal
```

After the explicit release:

```text
Guild standing unchanged
tradeFlow = strong
```

This separation is load-bearing.

---

## 7. Dialogue consumption contract

M24 extends authored dialogue with:

```ts
requiredWorldState?: WorldStateRequirement[];
```

The bounded requirement union supports exact equality for the two qualified fields only.

Availability is enforced in both:

```text
NPCDialogueTab
+
processNPCInteractionThunk
```

using the same fail-closed requirement helper.

A direct thunk invocation cannot bypass the World State gate.

Malformed requirements are unavailable rather than permissive.

---

## 8. Qualified downstream consumers

### Silas — patrol pressure

```text
silas_m24_patrol_pressure
```

requires:

```text
watchPresence == heavy
```

At the same Silas Relationship and social standing:

```text
normal -> unavailable/rejected
heavy  -> available/accepted
```

### Valerius — freight corridor

```text
valerius_m24_freight_corridor
```

requires:

```text
tradeFlow == strong
```

At the same Valerius Relationship and social standing:

```text
normal -> unavailable/rejected
strong -> available/accepted
```

These cross-NPC consumers prove that objective conditions persist beyond the NPC who participated in the mutation scene.

---

## 9. Relationship boundary

World State is not a Relationship dimension or Experience ledger.

Valid composition:

```text
Relationship history
-> permits meaningful player action
-> player explicitly changes objective world condition
```

Invalid generic inference:

```text
high Trust
-> patrol density automatically changes
```

or:

```text
world condition changed
-> automatic Trust / Connection change
```

When future content legitimately has both objective and relational consequences, author them separately and qualify their composition.

---

## 10. Faction boundary

Faction Reputation represents institutional regard, not objective conditions.

M24 proves:

```text
Merchants Guild +12
+
tradeFlow normal
```

can exist before the player explicitly releases verified freight.

Likewise, the City Watch's opinion of the player does not define patrol density.

Never derive World State simply by mapping a Faction score to a regional condition unless a future milestone explicitly qualifies that rule.

---

## 11. Knowledge boundary

Knowledge answers who knows an objective fact.

World State answers what objectively exists.

M24 does not automatically teach NPCs that:

```text
watchPresence became heavy
tradeFlow became strong
```

A future story may represent awareness of those objective conditions through Knowledge, but acquisition must be separately authored/qualified.

M22's Forge Knowledge path remains independent and its historical qualification now explicitly verifies that Knowledge activity leaves World State unchanged.

---

## 12. Quest and Player boundaries

World State does not replace Quest lifecycle or Player state.

M24 does not infer regional conditions from:

- completed quest flags;
- player location;
- routine familiarity;
- permanent Traits;
- elapsed time.

A Quest or player capability may later be a valid cause/prerequisite of a World State mutation, but the objective consequence should remain separately authoritative.

---

## 13. Persistence

World State is ordinary persisted RootState.

M24 keeps the existing save schema version because the current envelope can carry the new root without an incompatible representation migration.

Qualified behavior:

```text
heavy / strong
-> save
-> load
-> heavy / strong
```

For a legacy-like current-schema state lacking the root:

```text
watchPresence = normal
tradeFlow = normal
```

No startup inference reconstructs the state from social domains.

---

## 14. New-game reset

World State is campaign-scoped.

The existing Player new-game reset boundary clears `worldState.regions`.

This prevents regional conditions from one campaign leaking into another.

---

## 15. Offline boundary

M24 adds no offline consumer.

M21 settlement does not change World State.

Elapsed time alone cannot alter patrol density or freight throughput.

No decay, autonomous update, scheduled normalization, or background simulation is qualified.

---

## 16. Invariants

1. World State describes objective conditions, not social interpretation.
2. Relationship does not automatically mutate World State.
3. Faction Reputation does not automatically mutate World State.
4. Knowledge does not automatically mutate World State.
5. World State mutation does not automatically create Relationship, Faction, or Knowledge consequences.
6. Missing World State is interpreted through neutral defaults.
7. M24-qualified mutation fields are limited to `watchPresence` and `tradeFlow`.
8. World-sensitive dialogue requirements are enforced below UI as well as in presentation.
9. Malformed World State requirements fail closed.
10. New-game reset clears campaign World State.
11. Offline elapsed time does not progress World State.
12. The Merchant District is the only M24-qualified region.

---

## 17. Explicit non-goals / evidence ceiling

The current system does not qualify:

- additional regions or condition fields;
- generalized World Facts or condition registries;
- arbitrary state-expression DSLs;
- city simulation;
- economy simulation;
- population/demographic simulation;
- procedural ecology;
- territory control;
- patrol AI;
- dynamic NPC scheduling from World State;
- World-State-gated trade transaction authority;
- World-State-gated Combat;
- automatic social interpretation of objective changes;
- background/offline world simulation;
- M25 chapter composition.

These are not missing details required to complete M24; they are outside its qualified claim.

---

## 18. Qualified production path

```text
M23 personal/institutional history
-> player explicitly redeploys Watch patrols
-> Merchant District watchPresence = heavy
-> Silas later consumes objective patrol density

M23 Guild standing
-> player explicitly releases verified freight
-> Merchant District tradeFlow = strong
-> Valerius later consumes objective freight throughput
```

See:

- `../Technical/M24ObjectiveWorldState.md`
- `../Technical/M24ObjectiveWorldStateReconAmendment.md`
- `../Technical/M24ObjectiveWorldStateResult.md`

---

## 19. Next boundary

After the documentation-complete M24 PASS is requalified and merged, the next candidate is:

```text
M25 — Complete Chapter Vertical Slice
```

M25 must compose qualified systems into a coherent playable chapter; M24 itself does not perform that chapter-scale integration.
