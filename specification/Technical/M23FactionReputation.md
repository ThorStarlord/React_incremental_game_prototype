# M23 — Faction Reputation Qualification

**Status:** Preregistered before implementation recon  
**Milestone:** M23 — Faction Reputation  
**Frozen baseline:** `main` = `6770df0ffd1d59cd3218af91cdcf7e241910c435`  
**Frozen baseline tree:** `2a9378016e6d3a58fec60e8e937ecf6030beb424`  
**Predecessor:** qualified merged M22 Social Knowledge Propagation (`M22_PASS`)  
**Next milestone if PASS:** M24 — Objective World State  

---

## 1. Scientific question

> Can the player's standing with an institution differ materially from their personal Relationship with an NPC belonging to that institution?

M23 is not a request for a generalized diplomacy simulation. It is a bounded qualification of **institutional standing as an authority distinct from personal Relationship state**.

The core invariant is:

```text
Valerius Relationship != City Watch Reputation
```

A valid game state must be able to express, for example:

```text
Valerius personally trusts the player
while
City Watch institutionally distrusts the player
```

without forcing either value to mirror, overwrite, average into, or implicitly derive the other.

---

## 2. Authority boundary

M23 preserves the post-M22 ontology:

```text
WORLD        -> what objectively happened?
KNOWLEDGE    -> who knows it happened?
RELATIONSHIP -> what shared history means between specific people
FACTION      -> how an institution regards the player
```

Faction authority may consume explicit authored events, but it must not become a second Relationship engine.

Relationship authority remains responsible for personal semantic history such as:

- Trust;
- Affinity where still used as a short-horizon compatibility signal;
- Connection;
- Bond dimensions;
- authored Relationship Experiences;
- Memories;
- relationship-mediated Trait/Essence consequences.

Faction authority is responsible only for institution-level standing proven by this milestone.

---

## 3. Preregistered hypothesis

A bounded first-class Faction domain can be added on top of the current repository without changing Relationship authority, if:

1. institutional standing has its own persisted state;
2. mutations occur only through explicit authored faction consequences;
3. at least two independent institutions exercise the same runtime contract;
4. personal Relationship and institutional standing can diverge in both directions;
5. later institutional content consumes faction standing directly;
6. later interpersonal content continues to consume personal Relationship state directly;
7. direct runtime calls cannot bypass faction gates that the UI presents;
8. save/load preserves institutional standing and its divergence from Relationship state.

This hypothesis is **not** a PASS declaration. Recon may reveal that the repository already contains incompatible or partially authoritative reputation concepts that require amendment or a prerequisite repair.

---

## 4. Rule of Two

M23 must exercise the same faction contract with **at least two independent institutions**.

Roadmap candidates are:

```text
City Watch
Merchants Guild
```

These names are provisional until recon confirms that the current repository has usable faction identities or equivalent production concepts.

A third institution is out of scope unless recon shows it is required to avoid a false abstraction.

---

## 5. Required production evidence

The final production proof must include both directions of divergence.

### Probe A — personal benefit / institutional harm

An authored event must be able to:

```text
improve or preserve a specific NPC Relationship
while
reducing standing with that NPC's institution
```

The important proposition is not the exact numbers. It is that the two authorities can move independently for a coherent reason.

### Probe B — institutional benefit / no personal improvement

A second authored event must be able to:

```text
improve institutional standing
while
not automatically improving the relevant personal Relationship
```

The two probes should use the same generic faction mutation/consumption contract rather than two one-off handlers.

---

## 6. Required controls

M23 must prove at minimum:

### 6.1 Same Relationship, different faction standing

Holding the relevant personal Relationship constant:

```text
Faction Standing A
!=
Faction Standing B
```

must produce a different **institutional** consequence in real production content.

### 6.2 Same faction standing, different personal Relationship

Holding faction standing constant:

```text
Relationship A
!=
Relationship B
```

must produce a different **interpersonal** consequence through existing Relationship authority.

M23 must not rewrite that interpersonal consumer to use faction state.

### 6.3 Persistence

Save/load must preserve:

- faction standing;
- personal Relationship state;
- their divergence.

### 6.4 No mirroring

Changing faction standing must not automatically mutate:

- Relationship Connection;
- Bond dimensions;
- Relationship Memories;
- Relationship Experience ledger;
- personal Trust/Affinity unless an independently authored Relationship effect is explicitly part of the same player event.

Changing a personal Relationship must not automatically mirror into faction standing.

### 6.5 Below-UI enforcement

If institutional content requires a faction threshold or faction state, the requirement must be checked by runtime authority, not merely by hiding or disabling a UI element.

A direct thunk/action path that violates the gate must reject before the protected consequence occurs.

---

## 7. Minimal-state expectation

The roadmap suggested a model no larger than conceptually:

```ts
FactionStanding {
  factionId
  reputation
}
```

This is **not yet implementation authority**.

Recon must determine:

- whether a faction/reputation slice already exists;
- whether NPC `faction` fields are canonical identities or display metadata;
- whether any current `REPUTATION` effect/event already mutates real player standing;
- whether current quests/dialogues already carry faction-shaped consequences;
- how new-game reset currently works for adjacent domains;
- whether full RootState persistence is sufficient without a save-schema bump;
- what existing production content can consume institutional standing without inventing a disconnected demo.

If existing substrate is sufficient, M23 should reuse it. If existing concepts are misleading legacy terminology, the recon amendment must state that explicitly before behavior changes.

---

## 8. Mutation doctrine

Faction standing changes must have an explicit production cause.

Preferred shape:

```text
player chooses / completes meaningful event
-> authored faction consequence
-> Faction authority changes institutional standing
-> later institutional content reads Faction authority
```

Do not implement implicit rules such as:

```text
NPC Affinity average -> faction score
all known facts -> faction score
Connection level -> faction score
automatic per-tick faction drift
```

unless a future milestone separately proves such rules.

---

## 9. Knowledge boundary

M22 established that:

```text
fact happened
!=
NPC knows fact
```

M23 must preserve the further distinction:

```text
NPC knows fact
!=
institution regards player positively
```

Knowledge may be used as an authored prerequisite for an institutional response if a production case naturally requires it, but Knowledge itself must not be treated as reputation.

No automatic rule such as:

```text
Valerius learns good fact
-> City Watch reputation +X
```

may be introduced unless the authored event explicitly defines that institution-level consequence.

---

## 10. Relationship boundary

M23 must preserve:

```text
personal history
!=
institutional standing
```

For a Relationship-authority NPC such as Valerius, legitimate final states include:

```text
high Trust + low City Watch standing
low Trust + high City Watch standing
high Trust + high City Watch standing
low Trust + low City Watch standing
```

M23 only needs to qualify enough bounded production behavior to prove the independent axes. It does not need to populate every quadrant with full story content.

---

## 11. Falsification criteria

M23 must be recorded as **not PASS** if any of the following is required for the bounded proof:

1. faction standing is merely an alias for personal Affinity/Trust/Connection;
2. a faction score is computed by averaging NPC Relationship state;
3. faction changes silently mutate Relationship dimensions to keep them synchronized;
4. personal Relationship changes silently mutate faction standing;
5. only one hard-coded institution can use the runtime path;
6. institutional consequences are gated only in UI;
7. save/load loses or reconstructs faction standing from unrelated personal state;
8. the proof requires generalized politics, diplomacy, faction-vs-faction simulation, or M24 objective regional world state;
9. the implementation requires broad NPC-ID or faction-ID branches instead of a reusable bounded contract;
10. existing repository substrate reveals a prerequisite authority conflict that cannot be safely repaired inside M23.

If a prerequisite authority conflict is found, stop M23, record the finding, repair/qualify the prerequisite separately, then restart M23 from the corrected merged baseline.

---

## 12. Non-goals

M23 does not qualify:

- faction diplomacy;
- faction-vs-faction matrices;
- alliances/wars;
- political simulation;
- territory control;
- objective regional world-state simulation (M24);
- rumor propagation as institutional consensus;
- institution-wide Knowledge modeling;
- hidden reputation dimensions;
- reputation decay over time;
- automatic reputation propagation between factions;
- NPC schedules or faction patrol simulation;
- generalized access-control DSLs;
- campaign-scale balancing;
- human narrative quality, pacing, or fun;
- complete chapter integration (M25).

---

## 13. Qualification suite

The dedicated M23 test must prove the bounded scientific proposition through production/runtime surfaces, including:

1. two independent faction identities use one shared contract;
2. one explicit event can harm an institution without automatically harming/improving the relevant personal Relationship;
3. one explicit event can help an institution without automatically improving the relevant personal Relationship;
4. faction state persists through ordinary save/load;
5. Relationship state remains independently persisted;
6. institutional consumer behavior changes when faction standing changes while Relationship is held constant;
7. interpersonal consumer behavior changes when Relationship changes while faction standing is held constant;
8. direct runtime bypass of an institutional gate is rejected;
9. new-game reset does not leak faction state across campaigns;
10. M22 Knowledge state is not automatically mutated merely by faction standing changes;
11. no M24 World-State authority is introduced.

Exact production events, faction IDs, numeric thresholds, and consumers remain unfrozen until recon.

---

## 14. Accumulated qualification

The M23 gate must be additive to the existing Build Validation stack.

The final candidate must retain, at minimum:

```text
TypeScript
M23 faction reputation qualification
M22 social knowledge propagation qualification
Checkpoint C incremental integration repair qualification
M21 bounded offline progress qualification
M20 Copy production automation qualification
Active-loop repair qualification
modified historical qualification
accumulated M4-M19 baseline qualification
production build
```

Do not remove earlier gates to make M23 easier to merge.

---

## 15. Result vocabulary

The formal result must be one of:

```text
M23_PASS
M23_WEAK
M23_FAIL
```

### M23_PASS

The bounded evidence proves first-class institutional standing can diverge from personal Relationship state and later production behavior consumes each authority independently.

### M23_WEAK

The core direction appears sound but one or more preregistered independence, persistence, Rule-of-Two, consumer, or below-UI requirements remain unproven. Record the exact gap and require a bounded repair/requalification before M24.

### M23_FAIL

The repository cannot support the scientific proposition without violating authority boundaries or requiring a substantially different architecture. Stop and reconsider before M24.

---

## 16. Evidence ceiling if PASS

A PASS may claim only:

> At least two bounded production institutions can hold persisted player standing independently from personal NPC Relationship state; authored events can move the institutional axis without automatic Relationship mirroring; and real institutional/interpersonal consumers can read their respective authorities independently.

A PASS does **not** authorize claims about generalized politics, diplomacy, faction simulation, final reputation balance, institutional Knowledge, M24 World State, M25 chapter integration, or human playability.

---

## 17. Required execution order

```text
freeze current main SHA/tree
-> create dedicated M23 branch
-> commit this preregistration
-> recon actual faction/reputation/event/dialogue/quest/save substrate
-> freeze a recon amendment before behavior changes if implementation semantics need specificity
-> implement the smallest Rule-of-Two production proof
-> add focused M23 qualification
-> add M23 gate to Build Validation
-> freeze first complete behavioral SHA/tree
-> qualify exact behavioral head
-> record result + evidence ceiling
-> reconcile canon
-> freeze documentation-complete head/tree
-> re-run full Build Validation on exact final head
-> mark PR ready only after exact-head PASS
-> verify main/head concurrency
-> merge with expected-head guard
-> verify integrated tree equality and merge signature
-> check merge SHA for actual post-merge workflows
-> stop at M24 boundary
```

M24 must not be implemented on the M23 branch.