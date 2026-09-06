# M11 — Lyra Production Relationship Vertical Slice

**Status:** Implemented; final exact-head qualification pending documentation/review closeout  
**Scope:** Productionize Lyra's adversarial Relationship arc through ordinary player-facing NPC, Dialogue, Quest, Relationship, Essence, and persistence surfaces.  
**Baseline:** `main` at `c2e558f3d1ea2fbd35e488bd3aa4c2f5307cbe4a` (qualified M10 mainline).

## 1. Purpose

M6 established an ontology proof: the generic Relationship model can represent a bond with negative Affinity, high evidence-qualified Connection, and unresolved ideological conflict. M11 asks the stronger production question:

> Can the player actually experience that adversarial relationship through ordinary gameplay without adding Lyra-specific behavior to generic Relationship mechanics?

M11 is a productionization experiment, not a broad cast-migration wave.

## 2. Product hypothesis

A hostile but mutually significant relationship can deepen through confrontation, reciprocal modelling, instrumental cooperation, ideological disagreement, and shared consequential action without becoming friendship or requiring positive Affinity.

The implementation hypothesis is:

> Existing Experience → dimensions → Connection Progress → Memory → evidence-qualified Connection mechanics are expressive enough to author Lyra as production content through data and existing adapters.

A generic runtime branch such as `if (npcId === 'npc_lyra')` would count as evidence against that hypothesis.

## 3. Scope boundaries

M11 includes:

- a production `npc_lyra` NPC definition;
- six player-facing authored relationship beats;
- one real Quest → Relationship Experience beat;
- evidence-qualified Connection I and II;
- the landmark Memory `Enemies in Phase`;
- negative final Affinity with Connection II;
- generic relationship-derived passive Essence;
- normal player-facing causal visibility;
- save/load continuity;
- save-code import/export continuity;
- pre-Relationships legacy-save coexistence;
- automated generic-code audit for Lyra-specific behavioral branches.

M11 deliberately does **not** include:

- a Lyra Trait;
- a new rivalry/archetype subsystem;
- broad campaign or cast migration;
- a new save schema;
- redesign of Relationship state;
- global economy balance;
- replacement of the Willow-only New Game onboarding sequence;
- human enjoyment or comprehension qualification.

The production proof starts from the normal full production NPC catalog. Campaign discovery/onboarding order is a separate product concern.

## 4. Production route

The canonical M11 route is:

```text
Strategic Defeat, Not Submission
→ Coercion Reflected
→ Connection I
→ A Problem Neither Side Can Solo
→ Quest: Reluctant Co-Training
→ Ideological Friction
→ Mutual Calibration
→ Enemies in Phase
→ Memory: Enemies in Phase
→ Connection II
```

No Debug Experience injection is required by the routed qualification.

## 5. Authored Experiences

### 5.1 Strategic Defeat, Not Submission

The player loses a tactical position without conceding the principle Lyra expected the victory to settle.

Relationship consequences intentionally include:

```text
Affinity       -18
Trust           -8
Understanding  +10
Shared Meaning  +2
Vulnerability   +3
Connection Progress +10
```

The beat establishes that tactical defeat can increase relational information while warmth falls.

### 5.2 Coercion Reflected

The protagonist recognizes the structure of Lyra's harmonic coercion and answers it through modelling rather than submission.

Consequences:

```text
Affinity       -12
Trust           -4
Understanding  +10
Shared Meaning  +3
Vulnerability   +2
Connection Progress +10
```

After the first two Experiences, the deterministic state includes:

```text
Affinity: -30
Understanding: 20
Connection Progress: 20
Connection: I
```

Connection I therefore arrives while the immediate relationship is strongly negative.

### 5.3 Reluctant Co-Training

This beat is routed through a real quest rather than a dialogue-only proof.

Dialogue `lyra_offer_cotraining` unlocks:

`quest_lyra_chrono_crypt_calibration`

and gives the quest's harmonic key. Starting the GATHER quest recognizes the already-held key, making it ready for resolution through the existing generic Quest runtime.

The authored resolution `Coordinate Without Conceding`:

- validates and records `lyra_exp_reluctant_cotraining` first;
- consumes the harmonic key;
- gives no immediate relationship Essence reward;
- creates real Reliance and Reciprocity without friendship.

Consequences:

```text
Affinity        +4
Trust           +8
Understanding  +12
Shared Meaning +10
Reliance        +8
Reciprocity     +3
Connection Progress +15
```

### 5.4 Ideological Friction

After successful cooperation, Lyra and the protagonist explicitly reject each other's political/ethical conclusions rather than treating coordination as reconciliation.

Consequences:

```text
Affinity       -10
Trust           -2
Understanding  +12
Shared Meaning  +9
Connection Progress +12
```

Shared Meaning here means shared relational/ideological territory, not agreement.

### 5.5 Mutual Calibration

Each changes tactics because each correctly predicts what the other will notice.

Consequences:

```text
Trust           +7
Understanding  +12
Shared Meaning +10
Reciprocity     +7
Connection Progress +16
```

This is explicit reciprocal modelling rather than one-sided observation.

### 5.6 Enemies in Phase

The Chrono Crypt destabilizes too quickly for explicit coordination. Both act using models constructed across prior confrontations and solve the problem without resolving the ideological opposition.

Consequences:

```text
Affinity        +1
Trust           +6
Understanding   +8
Shared Meaning +12
Reliance        +8
Vulnerability   +8
Reciprocity     +8
Connection Progress +20
```

This defining Experience forms the landmark Memory `Enemies in Phase`.

## 6. Connection qualification

Lyra uses the same generic `RelationshipProgressionDefinition` and `ConnectionQualificationRule` mechanism as Willow and Elara.

### Connection I

Requires:

- Connection Progress ≥ 18;
- at least two meaningful Experiences;
- `Strategic Defeat, Not Submission`;
- `Coercion Reflected`;
- Understanding ≥ 18.

Affinity is not a positive qualification requirement.

### Connection II

Requires:

- Connection Progress ≥ 70;
- at least six meaningful Experiences;
- `Reluctant Co-Training`;
- `Mutual Calibration`;
- `Enemies in Phase` Experience;
- a Memory tagged `AdversarialBond`;
- Understanding ≥ 55;
- Shared Meaning ≥ 40;
- Reciprocity ≥ 15.

The Reciprocity requirement is important to M11. The player cannot reach the qualified adversarial bond through unilateral observation alone; the arc must contain evidence that both participants are adapting to one another.

## 7. Landmark Memory

`lyra_memory_enemies_in_phase` is a player-visible defining Memory with:

- origin Experience `lyra_exp_proto_bond`;
- shared participants: player and Lyra;
- `AdversarialBond` / `MutualCalibration` / `HarmonicResonance` / `IdeologicalFriction` tags;
- contested persistence;
- `Dialectic Counterparts — emerging` bond contribution.

The Memory represents durable relational significance, not friendship and not spendable currency.

## 8. Deterministic qualified state

The complete production route preserves the M6 adversarial proof state:

```text
Connection Level:      2
Connection Progress:  83
Affinity:             -35
Trust:                 19
Understanding:         64
Shared Meaning:        46
Reliance:              16
Vulnerability:         13
Reciprocity:           18
Stability:      contested
Memory:         Enemies in Phase
```

The central ontology result is therefore preserved under real player-facing content:

> High evidence-qualified Connection can coexist with negative Affinity and unresolved ideological opposition.

## 9. Relationship-derived Essence

M6 deliberately disabled Lyra Essence so the ontology proof would not also become an economy cutover.

M11 enables it because the production question is now whether meaningful hostile entanglement is an actual relationship source rather than merely representable metadata.

No Lyra-specific Essence formula was added.

The existing generic calculation remains:

```text
Connection base rate
× Resonance Quality multiplier
× Tether multiplier
× Stability multiplier
```

At the deterministic M11 final state:

- Connection II base = `0.100/sec`;
- Resonance Quality = Stable band = `1.00x`;
- Tether = present = `1.00x`;
- Stability = contested = `0.65x`.

Therefore:

```text
0.100 × 1.00 × 1.00 × 0.65 = 0.065 Essence/sec
```

This is an ongoing bond consequence. None of the six relationship Experiences or the co-training quest resolution mints current Essence as a relationship scene reward.

M11 therefore demonstrates:

> Negative Affinity does not prevent a meaningful relationship from becoming metaphysically productive; contested Stability changes the rate through generic semantics.

## 10. Player-facing causal visibility

M11 reuses `MigratedRelationshipSummary`; no Lyra-specific Relationship screen was introduced.

The ordinary Relationship tab exposes:

- Connection level;
- Affinity separately from Connection;
- Trust, Understanding, Shared Meaning, Reciprocity;
- Stability;
- progress toward the next authored Connection threshold;
- concrete qualification evidence;
- landmark Memories;
- recent meaningful Experiences;
- passive Essence and its generic factors.

At the qualified final state the same generic UI can visibly show:

```text
Affinity: -35
Connection: 2
Stability: contested
Passive Essence: 0.065/sec
Memory: Enemies in Phase
```

No UI claim implies that negative Affinity secretly means affection.

## 11. Save/load continuity

The routed M11 qualification crosses a real save boundary after Connection I:

```text
Strategic Defeat
→ Coercion Reflected
→ Connection I
→ createSave
→ loadSavedGameWithMigration
→ replaceState
→ current runtime reconciliation
→ continue normal Lyra route
```

The checkpoint preserves:

- Connection I;
- negative Affinity;
- recorded Experiences;
- current Essence balance;
- authored Relationship state.

Migration/reload does not mint Essence or duplicate relationship history.

## 12. Import/export continuity

After Connection II, the qualification:

1. creates a current-schema save;
2. encodes its canonical envelope with the M10 UTF-8-safe save-code transport;
3. decodes the save code;
4. imports through `createSaveFromPayload`;
5. reloads the imported save through `loadSavedGameWithMigration`.

The imported result preserves:

- Connection II;
- Affinity `-35`;
- contested Stability;
- `Enemies in Phase` Memory;
- defining Experience history;
- passive generation rate;
- unchanged current Essence balance.

This is an M10-in-production proof rather than a new save architecture.

## 13. Historical-save coexistence

M11 also qualifies a raw pre-Relationships Lyra save containing:

```text
legacy Affinity: -20
legacy connectionDepth: 7
no Relationships slice
```

M10 first interprets that historical representation as schema v0 and migrates it to the current persistent envelope.

M9/current runtime reconciliation then maps the old depth to the highest currently authored Lyra Connection level while preserving provenance.

Expected migrated state:

```text
Connection: 2
Connection Progress: 0
Affinity: -20
Understanding: 0
Shared Meaning: 0
Reciprocity: 0
Experiences: 0
Memories: 0
qualification evidence: none
provenance.legacyDerived: true
provenance.legacyConnectionDepth: 7
```

A subsequent real Lyra dialogue then records only the newly experienced `Strategic Defeat` event. It does not retroactively fabricate the five other modern Experiences, the landmark Memory, or modern Connection qualification evidence.

This preserves the M9/M10 invariant:

> Historical progress may be preserved; unavailable causal history must not be invented.

## 14. Generic architecture audit

M11's production test checks that `npc_lyra` does not appear in generic behavioral files including:

- `RelationshipSlice.ts`;
- `RelationshipSelectors.ts`;
- `RelationshipThunks.ts`;
- generic Essence-rate calculation;
- generic Trait acquisition;
- save-schema migration;
- generic routed NPC detail rendering.

Lyra identity belongs in authored data, Lyra-specific tests, and narrative/specification material.

No rivalry subclass or `if Lyra` engine branch was required.

## 15. Automated qualification

The Build Validation gate now includes:

- M4 Relationship runtime;
- M5 routed Willow;
- M6 Lyra ontology/universality;
- M7 Elara collaboration;
- M8 Trait discovery;
- M9 legacy Relationship migration;
- M10 save schema/versioning;
- M11 Lyra production route;
- production build.

### First implementation candidate

Candidate:

`6c6fc139d6ef2eb4e99b8037db3b5ca3b3f3667b`

Build Validation **#127**: **PASS**

This run qualified the implementation/data/test candidate before this documentation record was added. A final exact-head qualification is still required after documentation/review closeout.

## 16. Evidence ceiling

M11 supports these claims:

- Lyra is a real production NPC in the full production catalog;
- the adversarial arc is traversable through ordinary routed Dialogue and Quest surfaces;
- Connection II can coexist with Affinity `-35`;
- a contested landmark Memory forms from a real player-facing Experience;
- hostile but meaningful Connection can produce passive Essence through generic bond semantics;
- modern Lyra history survives save/load and import/export;
- historical Lyra progress can coexist with new modern history without fabrication;
- generic relationship infrastructure requires no Lyra-specific behavioral branch.

M11 does **not** prove:

- that a fresh human understands the adversarial ontology without assistance;
- that players enjoy the route;
- that `0.065/sec` is globally balanced;
- that Lyra should have a relationship-mediated Trait;
- that the Willow-only New Game onboarding should immediately expose Lyra;
- that the entire campaign/cast has been migrated;
- that broad content authoring throughput is sufficient.

Those remain separate product/research questions.

## 17. M11 stop condition

M11 is complete when the final exact PR head proves:

> Through ordinary player-facing production surfaces, Lyra can progress from adversarial contact to evidence-qualified Connection II and a persistent contested Memory while Affinity remains negative; the relationship can generate passive Essence through generic bond semantics; current state survives persistence and import/export; legacy progress does not fabricate modern causal history; and no Lyra-specific behavioral branch exists in generic Relationship infrastructure.

Once that condition is qualified, broad cast migration belongs in a later milestone rather than this PR.
