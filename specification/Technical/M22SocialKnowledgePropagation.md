# M22 — Social Knowledge Propagation Preregistration

**Status:** PREREGISTERED — behavior not yet changed  
**Frozen baseline:** `main` = `092b91d947e9ad71b3a79569f8e97ab990c64639`  
**Frozen baseline tree:** `e9193e77bccd55b1186b0f6326e53b2c117615a3`  
**Branch:** `feature/m22-social-knowledge-propagation`  
**Prerequisite:** fresh Checkpoint C rerun = `CHECKPOINT_C_PASS`

---

## 1. Scientific question

> Can one objective gameplay event produce different persistent knowledge states for different NPCs based on actual acquisition paths, and can later production content consume that knowledge independently of Relationship, Faction, and objective World-State authority?

M22 is specifically testing whether the game can represent:

```text
what happened
!=
who knows what happened
!=
what a person feels about what happened
```

The milestone is not authorized to build generalized epistemic simulation.

---

## 2. Domain boundary

The intended authority separation is:

```text
WORLD        -> what happened / what objectively exists
KNOWLEDGE    -> which NPC knows which objective fact
RELATIONSHIP -> what shared history means between specific people
FACTION      -> how an institution regards the player
```

Core invariant:

```text
event happened != every NPC knows event happened
```

Additional invariants:

```text
NPC knows fact != NPC likes player
NPC knows fact != NPC trusts player
NPC knows fact != faction standing
NPC knows fact != objective world condition
```

M22 must not store objective truth inside per-NPC knowledge merely because that is convenient.

---

## 3. Required positive proposition

A successful M22 must establish one composed production path with all of the following properties:

```text
objective event occurs
-> a canonical objective fact becomes true
-> NPC A legitimately acquires the fact through direct witnessing
-> NPC B remains ignorant because the same acquisition condition does not hold
-> save/load preserves the divergence
-> an explicit player-driven communication/report reaches NPC B
-> NPC B acquires the same canonical fact
-> later production content consumes canonical NPC knowledge
-> Relationship authority remains independently governed
```

At least two acquisition paths must be exercised:

1. direct witnessing;
2. explicit communication/report.

The two paths must be materially different production mechanisms rather than two buttons that both call the same knowledge mutation without surrounding game semantics.

---

## 4. Production-probe policy

The roadmap suggests a Merchant District / Gronk / Valerius structure. That is a **candidate**, not frozen implementation truth.

Recon must determine:

- the strongest existing objective event/fact identity;
- the strongest existing witness/presence authority;
- the strongest existing explicit communication surface;
- the strongest existing downstream content consumer;
- whether Merchant District / Gronk / Valerius remains the smallest production proof after repository inspection.

No exact `factId`, event ID, NPC pair, or downstream dialogue/quest branch is frozen by this preregistration.

---

## 5. Acceptance criteria

M22 can qualify PASS only if all of the following are demonstrated on one exact behavioral head.

### A. Objective truth and knowledge are separate

- the underlying event/fact has an authority independent of per-NPC knowledge;
- at least one NPC can remain ignorant after the event is objectively true;
- knowledge state does not become the source of objective truth.

### B. Direct witnessing

- a legitimate witness acquires the fact;
- a non-witness does not acquire the fact;
- witnessing uses an existing or freshly justified production authority rather than global propagation.

### C. Explicit communication/report

- a previously ignorant NPC can later acquire the already-true fact through an explicit player-driven communication action;
- transfer is intentional and attributable to that interaction;
- the communication path is distinct from direct witnessing.

### D. Persistence

- known fact survives ordinary save/load;
- ignorance survives ordinary save/load as ignorance;
- old/current-schema state handling is deterministic and documented;
- repeated load/reconciliation does not invent knowledge without an acquisition path.

### E. Idempotence

- granting the same fact twice does not create duplicate knowledge records or duplicate side effects;
- reporting an already-known fact does not duplicate knowledge state.

### F. Relationship separation

- acquisition of knowledge alone does not automatically mutate Relationship dimensions, Connection, Experience, or Memory;
- if the chosen objective event independently has a legitimate Relationship consequence, qualification must show that the Relationship consequence and Knowledge consequence are separately authoritative rather than suppressing the existing Relationship behavior.

### G. Faction separation

- no faction-reputation authority is introduced or mutated as an automatic consequence of knowing a fact;
- M23 semantics remain out of scope.

### H. World-State separation

- knowledge is not used as the storage location for objective Merchant District/world conditions;
- M24 semantics remain out of scope.

### I. Real downstream consumer

At least one production content gate must read canonical knowledge state.

Required comparison:

```text
same relevant NPC
same relevant Relationship state
same relevant objective event/world state
knowledge absent
-> downstream result A

knowledge present
-> downstream result B
```

The consumer must not secretly gate on the underlying quest/event flag while merely displaying a knowledge label.

### J. Rule of Two

The milestone must exercise both:

```text
objective event -> direct witness -> knows
```

and:

```text
already-true fact -> explicit report -> previously ignorant NPC knows
```

---

## 6. Falsification criteria

Any of the following is evidence against a PASS claim.

### F1 — global knowledge leak

```text
event occurs
-> all or unrelated NPCs automatically know
```

without an authored acquisition path.

### F2 — Relationship-as-knowledge

High Trust/Affinity/Connection alone causes an NPC to know an event they did not witness and were not told.

### F3 — knowledge-as-Relationship

Learning a fact automatically changes Trust, Affinity, Bond, Connection, Experience, or Memory merely because knowledge changed.

### F4 — shadow knowledge flags

Later content continues to treat ad-hoc flags such as `hasBeenTold`, `dialogueSeen`, or quest-specific booleans as the real knowledge authority while a parallel Knowledge model is introduced.

### F5 — witnessing without legitimate presence/acquisition

An NPC learns from an event despite failing the exact witness condition frozen after recon.

### F6 — report without explicit transfer

A previously ignorant NPC becomes knowledgeable merely because time passes, a screen opens, or some unrelated reconciliation runs.

### F7 — technical-only knowledge

The repository can store `factIds`, but no real production content behaves differently because a specific NPC knows the fact.

### F8 — inappropriate fact identity

The implementation reuses a Relationship Experience or Memory ID as objective fact identity without demonstrating that the ID actually represents objective truth independently of relational interpretation.

### F9 — M23 leakage

Knowledge automatically creates or modifies City Watch, Merchants Guild, or other institutional reputation.

### F10 — M24 leakage

Per-NPC knowledge becomes the storage surface for objective world conditions such as trade flow, watch presence, infrastructure, or encounter state.

### F11 — overbuilt epistemics

M22 introduces rumor graphs, misinformation engines, confidence scores, belief probabilities, recursive theory-of-mind, forgetting/decay, or generalized gossip without a production requirement.

### F12 — persistence/reconciliation invention

Save/load, migration, or startup reconciliation creates knowledge that was never legitimately acquired.

---

## 7. Recon questions that must be answered before implementation semantics freeze

1. What current production authority best represents **objective event/fact identity**?
2. Is a new fact catalog actually necessary, or can Knowledge reference an existing objective event/quest/world identity safely?
3. What current authority best establishes **direct witnessing**?
4. Can existing canonical player/NPC presence participate, or would that be a false fit for the chosen event?
5. What existing player-driven dialogue/quest/service interaction best represents **explicit communication/report**?
6. What current content can serve as a genuine downstream knowledge consumer?
7. Are there existing scattered knowledge-like booleans/flags that would conflict with a new canonical authority?
8. How does the current save envelope handle a new knowledge field/slice?
9. Does current schema version remain valid, or is an explicit migration required?
10. Should an old save lacking M22 knowledge start empty, or is there a narrowly justified deterministic reconstruction for authored history?
11. Does actual content need acquisition provenance (`witnessed`, `reported`, etc.), or is `knows/does-not-know` sufficient?
12. Which NPC pair/event forms the smallest honest Rule-of-Two production proof?

Any implementation-semantic answer discovered during recon must be frozen in a recon amendment before behavior changes.

---

## 8. Minimal-model bias

The roadmap permits a model as small as:

```ts
NpcKnowledge {
  npcId
  factIds
}
```

M22 should prefer the minimum representation required by actual authoring.

Do not add provenance unless downstream production behavior requires distinguishing acquisition source.

Do not add:

- truth confidence;
- belief confidence;
- lies/deception state;
- rumor propagation;
- automatic social graphs;
- forgetting;
- knowledge decay;
- generalized logical inference;
- “A knows that B knows” state.

---

## 9. Persistence policy to resolve in recon

The existing application persists broad Redux state. Recon must confirm whether M22 can use that authority without a save-schema bump.

The default safety preference is:

```text
missing knowledge field
-> no recorded M22 knowledge
```

rather than silently inferring historical knowledge, unless recon identifies an existing canonical fact that old saves necessarily and unambiguously imply.

Offline elapsed time must not teach knowledge.

---

## 10. Qualification controls

The dedicated M22 qualification should prove, at minimum:

1. fact absent before objective event;
2. event/fact becomes objectively true;
3. legitimate witness learns;
4. non-witness remains ignorant;
5. knowledge acquisition is idempotent;
6. witness knowledge persists through save/load;
7. ignorance persists through save/load;
8. explicit report transfers fact;
9. reporting already-known fact does not duplicate knowledge;
10. Relationship authority remains independently governed;
11. no Faction authority is created/mutated;
12. no objective World-State authority is stored in Knowledge;
13. downstream content differs while ignorant vs informed;
14. downstream consumer reads canonical knowledge authority;
15. no automatic global propagation occurs.

Where practical, qualification should also snapshot unrelated domains before and after pure knowledge transfer and assert they are unchanged.

---

## 11. Build/merge discipline

M22 must preserve the repository qualification process:

```text
verify baseline
-> preregister
-> recon actual runtime
-> freeze recon amendment
-> implement smallest production proof
-> add focused M22 qualification
-> add M22 Build Validation gate without deleting historical gates
-> qualify first complete behavioral head/tree
-> write result + evidence ceiling
-> reconcile canon
-> requalify documentation-complete exact head/tree
-> verify main has not moved
-> merge with expected-head guard
-> verify merge parents/tree/signature
-> claim post-merge CI only if an actual merge-commit workflow exists
-> stop at M23 boundary
```

Build Validation and the preregistered acceptance/falsification criteria are milestone merge authority. Repository review bots are not merge authority.

---

## 12. Outcome rubric

### `M22_PASS`

Use only if objective truth and per-NPC knowledge can genuinely diverge, both acquisition paths work and persist, a real downstream consumer reads Knowledge, and the Relationship/Faction/World boundaries remain intact.

### `M22_WEAK`

Use if the core model is promising but one required seam is missing, such as no honest production consumer, persistence ambiguity, a shadow story flag remaining authoritative, or an acquisition path that is only technically simulated rather than integrated.

A WEAK verdict authorizes only a bounded M22 repair followed by fresh qualification. It does not authorize M23.

### `M22_FAIL`

Use if the implementation cannot maintain the authority separation or would require premature generalized social/world simulation to make the proof work.

A FAIL verdict blocks M23 and requires product/architecture reconsideration.

---

## 13. Evidence ceiling for a possible PASS

Even a successful M22 will establish only:

> One bounded objective production event can produce divergent persistent per-NPC knowledge through direct witnessing and later explicit communication, and later production content can consume that knowledge independently of Relationship authority.

A PASS will **not** qualify:

- generalized rumor propagation;
- misinformation or deception;
- confidence/belief models;
- forgetting/decay;
- theory-of-mind;
- global NPC gossip;
- automatic fact inference;
- player-knowledge simulation unless separately justified;
- faction reputation (M23);
- objective regional world-state simulation (M24);
- complete chapter integration (M25);
- human comprehension, pacing, or narrative quality.

---

## 14. Authorized stop boundary

M22 must stop after its own exact-head qualification and merge.

If and only if M22 reaches a qualified merged `M22_PASS`, the next roadmap candidate becomes:

```text
M23 — Faction Reputation
```

M23 must receive its own preregistration and fresh recon. No faction reputation implementation belongs in the M22 branch.
