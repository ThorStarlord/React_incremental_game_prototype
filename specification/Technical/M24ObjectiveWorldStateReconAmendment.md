# M24 — Objective World State Recon Amendment

**Status:** Frozen after fresh post-M23 recon and before M24 runtime behavior changes  
**Preregistration:** `M24ObjectiveWorldState.md`  
**Frozen baseline:** `4aa2acdeab56e4f350acc88b52a78be926118f8e` / tree `1b69ee72e23d339de43b8e425a3c2e8b57393f40`  
**Preregistration commit:** `29a4cedd84e5e10f5c37b5c6fc737b15f2a75d4f`

---

## 1. Recon summary

Fresh recon found no first-class Objective World State authority on the M23 baseline.

The repository already has several **objective facts owned by other domains**:

- `Player.location` + M18 location topology own player position and legal travel;
- canonical NPC anchors own the bounded M19 presence facts already qualified;
- Quest state owns quest lifecycle/objective completion;
- Player routine familiarity owns the existing Forge-practice fact used by M22;
- NPC operational fields own NPC-specific status/availability;
- Faction owns institutional standing;
- Knowledge owns per-NPC awareness;
- Relationship owns interpersonal history/meaning.

None of these is a suitable authority for persistent regional conditions such as patrol density or trade throughput.

A repository search found no existing `worldState`, `watchPresence`, `tradeFlow`, or equivalent regional-state runtime. M23 canon explicitly reserves objective conditions such as patrol density and district lockdown for M24.

Therefore M24 may introduce a new bounded root rather than normalizing an existing hidden authority.

---

## 2. Canonical bounded region

M24 will use the existing canonical M18 location identifier:

```text
location_merchant_district
```

No second region/location identity will be introduced.

The Merchant District is the correct first region because existing production history already describes:

- Watch checkpoints and patrol patterns;
- caravans and supply lanes;
- Merchant Guild contracts/audits;
- M13-M15 leak/network consequences;
- M23 personal-vs-institutional consequences.

M24 will not reinterpret those historical social records as World State. It will author new explicit M24 operational actions downstream of existing qualified history.

---

## 3. Frozen World State model

Root key:

```text
worldState
```

State shape:

```ts
interface WorldState {
  regions: Record<string, RegionalWorldState>;
}

interface RegionalWorldState {
  watchPresence?: 'normal' | 'heavy';
  tradeFlow?: 'normal' | 'strong';
}
```

Selector defaults for a missing region/field are:

```text
watchPresence -> normal
tradeFlow     -> normal
```

This keeps legacy-like saves neutral and avoids eagerly materializing every possible region.

The two fields are materially independent:

```text
watchPresence = objective patrol density in the bounded region
tradeFlow     = objective throughput of verified caravan/contracts in the bounded region
```

M24 does **not** define crime, syndicate influence, infrastructure condition, prices, population, or any other regional variables.

---

## 4. Mutation contract

M24 will add one bounded typed mutation union:

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

The World State slice exposes a set-style reducer for this union and reset behavior.

This is **not** an arbitrary key/value world-state API. Unknown fields/values are not part of the qualified contract.

---

## 5. Dialogue integration contract

The existing NPC dialogue system is the best bounded production integration surface because it already provides:

- data-driven authored nodes;
- response-scoped effects;
- Relationship / Knowledge / Faction gates;
- UI filtering;
- below-UI revalidation in `processNPCInteractionThunk`;
- non-repeatable event semantics;
- ordinary campaign persistence through NPC/dialogue state.

M24 will extend it with exactly:

```ts
requiredWorldState?: WorldStateRequirement[]
```

and one effect:

```ts
{
  type: 'WORLD_STATE_SET',
  regionId,
  field,
  value
}
```

`WorldStateRequirement` uses the same two-field typed union and exact-value equality.

Both UI and thunk will consume the same selector semantics. A direct thunk call cannot bypass the requirement.

No OR/NOT/range/expression language is added.

---

## 6. Production mutation probe A — Watch redeployment

New non-repeatable Valerius topic:

```text
valerius_m24_redeploy_patrols
```

Title:

```text
Patrols Where the Threat Actually Is
```

Prerequisite:

```text
valerius_exp_m23_public_override
```

Narrative semantics:

After the player publicly broke the stale checkpoint order in M23, Valerius presents the operational follow-through: the old fixed checkpoint is gone, but the district still needs protection. The player explicitly chooses to redeploy mobile Watch teams through the Merchant District freight corridors rather than restoring the obsolete checkpoint.

World consequence only:

```text
location_merchant_district.watchPresence
normal -> heavy
```

The M24 node adds **no** Relationship Experience, Affinity delta, Faction change, or Knowledge fact.

The existing M23 history is a prerequisite, not the World State itself.

---

## 7. Production consumer A — Silas reacts to patrol density

New non-repeatable Silas topic:

```text
silas_m24_patrol_pressure
```

Title:

```text
Too Many Uniforms for the Old Route
```

Requirement:

```text
location_merchant_district.watchPresence == heavy
```

No Relationship/Faction/Knowledge prerequisite is required.

The topic exists to prove:

```text
same Silas Relationship
same faction standing
watchPresence normal -> unavailable/rejected
watchPresence heavy  -> available/accepted
```

It produces no automatic social mutation.

This is a cross-NPC consumer: Valerius's explicit operational action changes an objective condition later read by Silas content.

---

## 8. Production mutation probe B — Verified freight release

New non-repeatable Gronk topic:

```text
gronk_m24_release_verified_freight
```

Title:

```text
Move the Contracts, Not Just the Numbers
```

Prerequisite:

```text
Merchants Guild reputation >= 10
```

This reuses M23's qualified institutional audit as a prerequisite while preserving authority separation.

Narrative semantics:

With the Guild willing to trust the verified audit, the player explicitly routes the reconciled manifests to the gate clerks and releases stalled contract caravans instead of leaving the audit as paperwork.

World consequence only:

```text
location_merchant_district.tradeFlow
normal -> strong
```

The node adds no Gronk Relationship effect and does not further change Merchants Guild standing.

Thus:

```text
Guild +12 + tradeFlow normal
!=
Guild +12 + tradeFlow strong
```

until the player takes the explicit world-changing action.

---

## 9. Production consumer B — Valerius reads freight throughput

New non-repeatable Valerius topic:

```text
valerius_m24_freight_corridor
```

Title:

```text
Supplies Are Moving Again
```

Requirement:

```text
location_merchant_district.tradeFlow == strong
```

No Faction or Relationship requirement is required.

This proves:

```text
same City Watch / Merchants Guild standings
same Valerius Relationship
tradeFlow normal -> unavailable/rejected
tradeFlow strong -> available/accepted
```

The consumer adds no automatic social effect.

This is also cross-NPC: Gronk's operational freight-release event changes an objective condition later consumed by Valerius content.

---

## 10. Why not Trade / Combat as the first consumers

Recon examined both surfaces.

### Trade

`NPCTradeTab` currently performs purchase/sell mutations directly from UI callbacks rather than through a below-UI trade thunk/authority boundary. Making M24's first World State proof depend on trade availability would either leave the gate presentation-only or force a separate trade-transaction refactor.

That refactor is not required to answer M24's scientific question and would violate bounded scope.

### Combat

Combat already has a qualified location availability bridge, but adding a second World State encounter plus quest/combat content would enlarge M24 into a new combat vertical slice.

M24 does not need that to prove objective regional conditions.

Therefore the first two consumers remain ordinary production dialogue/content gates, where below-UI enforcement is already a qualified architectural pattern.

This does not claim that dialogue is the only future World State consumer.

---

## 11. Persistence / compatibility

The existing save envelope persists full Redux RootState and M23 already demonstrates a missing-root compatibility pattern.

Frozen M24 semantics:

```text
CURRENT_SAVE_SCHEMA_VERSION remains 1
```

because:

- adding a new root is backward-tolerant under the existing envelope;
- selectors will tolerate a missing `worldState` root;
- missing root/region/field means the neutral defaults (`normal`, `normal`);
- ordinary RootState save/load preserves explicit mutations;
- no incompatible representation migration is required.

`resetPlayerState` will clear World State so one campaign cannot leak regional conditions into another.

No startup inference will reconstruct World State from Faction, Relationship, Knowledge, completed dialogues, or quests.

---

## 12. Offline / time boundary

M24 adds no M21 offline consumer.

Elapsed time does not change:

```text
watchPresence
tradeFlow
```

World State changes only through explicit authored M24 events.

No decay, normalization, background simulation, or scheduled world update is introduced.

---

## 13. Dedicated qualification plan

`M24ObjectiveWorldState.test.tsx` must prove at least:

### Rule of Two

1. Default Merchant District state is `watchPresence=normal`, `tradeFlow=normal`.
2. `valerius_m24_redeploy_patrols` is causally unavailable until its M23 Relationship prerequisite exists.
3. Successful patrol redeployment sets only `watchPresence=heavy`.
4. Silas patrol-pressure consumer is rejected directly and hidden in UI while watch presence is normal.
5. With Silas Relationship and all faction standing held constant, heavy watch presence makes that consumer available/accepted.
6. `gronk_m24_release_verified_freight` is unavailable until Merchants Guild standing reaches the existing M23 threshold.
7. At the same Merchants Guild standing, before the explicit freight release, `tradeFlow` remains normal.
8. Successful freight release sets only `tradeFlow=strong` and leaves Guild standing / Gronk Relationship unchanged.
9. Valerius freight-corridor consumer is rejected/hidden while trade flow is normal and available/accepted when strong.

### Domain independence

10. Patrol mutation leaves Relationship, Faction, Knowledge, Quest, and player location unchanged except for already-existing prerequisite state.
11. Freight mutation leaves Relationship, Faction, Knowledge, Quest, and player location unchanged.
12. Direct World State reducer mutation does not mirror into social domains.

### Persistence / reset

13. `heavy + strong` persists through `createSave` + `loadSavedGameWithMigration` + `replaceState`.
14. Current-schema legacy-like state lacking `worldState` reads both fields as normal without inference.
15. `resetPlayerState` restores neutral World State.

### Gate correctness

16. Both world-state consumers are enforced in `processNPCInteractionThunk`, not only hidden in UI.
17. Unknown/malformed authored World State requirements fail closed rather than becoming accidental availability.

### Boundary guard

18. M24 runtime does not add generalized world simulation, arbitrary condition DSL, offline world progression, faction spillover, or M25 chapter-scale state.

---

## 14. Historical gate amendment

M23's qualification test currently contains an explicit guard that `worldState` is undefined because M24 did not yet exist.

M24 will update that historical guard narrowly:

```text
M23 faction mutation
-> M24 World State remains at neutral defaults
```

The test must continue proving that M23 does not itself mutate World State or activate faction spillover.

No other historical criterion is weakened.

---

## 15. Frozen evidence ceiling

A successful M24 can claim only:

> The Merchant District can persist two typed objective conditions (`watchPresence`, `tradeFlow`) independently from Relationship, Knowledge, and Faction; two explicit player-authored operational events can change those conditions; and two later cross-NPC production dialogue consumers read the objective state through UI plus below-UI gates.

It does not qualify:

- more regions;
- more condition types;
- generic world-fact registries;
- arbitrary condition expressions;
- world simulation or AI;
- trade-system authority;
- combat world-state gating;
- economy balance;
- automatic social interpretation;
- offline world progression;
- M25 complete chapter integration;
- human pacing, comprehension, or fun.
