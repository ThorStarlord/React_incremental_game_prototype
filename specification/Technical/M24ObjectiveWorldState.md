# M24 — Objective World State Qualification

**Status:** Preregistered before M24 behavior changes  
**Branch:** `feature/m24-objective-world-state`  
**Frozen baseline `main`:** `4aa2acdeab56e4f350acc88b52a78be926118f8e`  
**Frozen baseline tree:** `1b69ee72e23d339de43b8e425a3c2e8b57393f40`  
**Prior milestone:** M23 Faction Reputation = `M23_PASS`  
**Next milestone if M24 qualifies and merges:** M25 Complete Chapter Vertical Slice

---

## 1. Scientific question

> Can player actions alter persistent objective world conditions that later gameplay consumes, without storing those conditions in Relationship, Faction Reputation, Knowledge, or ad-hoc story booleans?

This is the M24 question from the post-M17 roadmap, now frozen against the actual post-M23 merged repository.

---

## 2. Hypothesis

The repository should be able to support a small first-class objective World State authority that is:

- changed by explicit player-caused production events;
- persisted as ordinary campaign state;
- consumed later by ordinary gameplay/content;
- independent from Relationship, Knowledge, and Faction standing;
- enforced below the UI where it controls availability or legality;
- narrow enough to avoid becoming a generalized simulation engine.

This hypothesis does **not** predeclare a PASS. Recon may reveal a prerequisite defect or that current content does not support a valid bounded proof.

---

## 3. Authority boundary

M24 must preserve:

```text
WORLD STATE        -> what objectively exists now
KNOWLEDGE          -> which NPC knows which objective facts
RELATIONSHIP       -> what shared history means between people
FACTION REPUTATION -> how an institution regards the player
PLAYER / QUEST     -> player-owned capability, choices, and local quest lifecycle
```

The same campaign must be able to represent combinations such as:

```text
objective Watch presence: HEAVY
City Watch reputation: negative
Valerius personal Relationship: positive
Valerius Knowledge: independently present or absent
```

without deriving one axis automatically from another.

---

## 4. Bounded-region scope

Prefer a bounded Merchant District / City Center production slice because that area already contains qualified Travel, NPC, Relationship, Knowledge, Faction, Quest, and Copy content.

The exact region identifier, world-state fields, mutation events, and downstream consumers are **not frozen by this preregistration**. They must be chosen only after fresh recon of the current post-M23 runtime/content.

Roadmap examples such as:

```text
watchPresence: low | normal | heavy
tradeFlow: blocked | disrupted | normal | strong
```

are candidate shapes only, not implementation requirements.

---

## 5. Rule of Two requirement

M24 may introduce a reusable World State authority only if the production proof contains at least:

1. **two materially independent objective world conditions**;
2. **two real downstream gameplay/content consumers**;
3. at least one explicit player-caused mutation path for each qualified condition;
4. controls demonstrating that the downstream consequence reads World State rather than a social-state substitute.

This prevents extracting a generic world-state framework from a single hard-coded story flag.

---

## 6. Required positive controls

The final production qualification must prove, at minimum:

1. A valid player-caused event mutates one bounded objective world condition.
2. A second materially different player-caused event mutates another objective world condition.
3. A real downstream consumer changes behavior because of the first World State field.
4. A different real downstream consumer changes behavior because of the second World State field.
5. World State persists through ordinary save/load.
6. A new-game/reset boundary clears campaign World State appropriately.
7. Mutation has explicit provenance in the event/content path; it is not inferred from elapsed time or social state.
8. Any availability/legality gate introduced by M24 is checked below the UI as well as in presentation.

---

## 7. Independence controls

The qualification must include controls showing:

```text
same Relationship state + different World State
-> different world-sensitive consequence
```

and:

```text
same Faction standing + different World State
-> different world-sensitive consequence
```

It must also prove that changing World State does **not** automatically:

- create a Relationship Experience;
- mutate Bond dimensions, Connection, or Affinity;
- mutate Faction Reputation;
- grant Knowledge to NPCs;
- alter objective Player location unless the selected event independently requires travel;
- resolve an irreversible player narrative choice.

If a production scene legitimately has both a World State consequence and a social consequence, those effects must remain independently authored and independently authoritative.

---

## 8. Persistence / compatibility requirements

Recon must determine the current save-state tolerance before representation is frozen.

The final qualified implementation must establish:

- current save/load persistence for the new World State authority;
- behavior for current-schema legacy-like state lacking the new root/field;
- new-game/reset behavior;
- whether the save schema version can remain unchanged safely.

Do not bump schema version merely because a backward-tolerant optional root can be persisted by the existing envelope.

---

## 9. Falsification / stop conditions

M24 must stop, produce a non-PASS result, or split out a prerequisite repair if recon/implementation shows any of the following:

1. The only viable implementation is an ad-hoc boolean disguised as a new system with no second independent production case.
2. Objective conditions must be stored inside Relationship, Knowledge, Faction, NPC Relationship metadata, or Quest completion flags to work.
3. A downstream consumer actually reads social state while the test merely labels it World State.
4. World-state legality can be bypassed by direct thunk/action invocation where M24 introduces a gate.
5. Save/load cannot preserve the condition without a broader incompatible migration not preregistered here.
6. The implementation requires a generalized city simulation, economy simulation, population model, procedural ecology, arbitrary condition DSL, or generalized world-rule engine.
7. M24 silently introduces M25 chapter-scale composition rather than a bounded capability proof.
8. The two selected fields are not materially independent (for example, one is merely a computed alias of the other).

A clean falsification is evidence, not a reason to weaken the criteria.

---

## 10. Explicit non-goals

M24 does **not** attempt to qualify:

- city simulation;
- macroeconomic simulation;
- population or demographic simulation;
- procedural ecology;
- territory-control simulation;
- patrol AI;
- faction diplomacy or reputation propagation;
- automatic social interpretation of world changes;
- institutional Knowledge/consensus;
- generalized fact/condition registries;
- arbitrary state-expression DSLs;
- event-sourcing infrastructure;
- background/offline world simulation;
- M25 complete-chapter integration;
- final pacing, balance, comprehension, fun, or retention.

---

## 11. Qualification workflow

After this preregistration is committed:

```text
fresh recon
-> freeze recon amendment if implementation semantics become concrete
-> implement smallest Rule-of-Two production proof
-> add dedicated M24 qualification suite
-> add M24 as an additive Build Validation gate
-> freeze first complete behavioral SHA/tree
-> exact-head Build Validation
-> record M24 result + evidence ceiling
-> reconcile only canon actually superseded by M24
-> freeze documentation-complete SHA/tree
-> exact-head Build Validation again
-> expected-head merge only if PASS
-> verify integrated tree / parents / signature
-> query merge SHA separately for actual post-merge workflows
-> stop at M24 boundary
```

Repository Gemini review remains diagnostic only. Build Validation plus these preregistered criteria are merge authority.

---

## 12. Verdict vocabulary

The result document must use exactly one of:

```text
M24_PASS
M24_WEAK
M24_FAIL
```

### `M24_PASS`

The Rule-of-Two objective World State proof satisfies the frozen controls and no blocking architectural contradiction remains. After merge, M25 becomes the next authorized candidate.

### `M24_WEAK`

The direction remains viable but a bounded prerequisite/integration repair is required. M25 remains unauthorized until repair qualification and a fresh M24 rerun/qualification as appropriate.

### `M24_FAIL`

The proposed World State direction is contradicted materially enough that the roadmap should stop for architectural/product reconsideration.

---

## 13. Evidence ceiling target

If qualified, the strongest intended claim is only:

> A bounded region can maintain at least two persistent objective world conditions independently of social interpretation, explicit player-caused events can mutate those conditions, and later real gameplay/content can consume them through their own authority.

Nothing broader is implied.