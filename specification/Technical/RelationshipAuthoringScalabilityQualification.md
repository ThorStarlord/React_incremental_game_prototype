# M12 — Relationship Authoring Scalability Qualification

**Status:** Complete — **PASS-A (strong scalability)**  
**Baseline main commit:** `5b27cc0942e46190cfac88dc59a735fdcfe6c0b6`  
**Baseline tree:** `cf0b4f90b635a5674d1d4fb602d674ec87d2c4e4`  
**Branch:** `feature/relationship-authoring-scalability`

> Sections 1–14 below define the preregistered protocol. Sections 15 onward record the observed result. The protocol was frozen before the ordered cases were completed.

## 1. Purpose

M11 proved that Lyra can move from an adversarial ontology proof to ordinary production gameplay without an NPC-specific Relationship-engine branch. M12 asks a different question:

> Can relationship production become routine across several materially different NPCs, or do repeated migrations reveal bespoke-engine pressure, fragile authoring, or missing universal capabilities?

M12 is a scalability experiment on the authoring process. It is not a whole-cast migration and it is not another single-NPC vertical slice.

## 2. Primary hypothesis

The current Relationship runtime, manifest-driven content loading, Experience/Memory model, Connection qualification, generic Relationship UI, generic Essence calculation, and save/reconciliation architecture are sufficiently generalized that three additional heterogeneous production NPCs can be migrated predominantly through authored content and existing adapters.

The three ordered cases are:

1. **Blacksmith Gronk** — professional / transactional respect; baseline migration.
2. **Rogue Silas** — instrumental / ambiguous trust; replication and stress case.
3. **Captain Valerius** — hierarchical / institutional respect; confirmation case.

## 3. Counter-hypothesis

The apparent generality demonstrated by Willow, Elara, and Lyra depends on unusually careful bespoke vertical slices. Broader production migration will reveal repeated requirements for NPC-specific engine logic, custom UI, duplicated adapters, or domain concepts that the current model cannot represent cleanly.

M12 is allowed to fail or return a conditional verdict.

## 4. Standard migration unit

Each migrated NPC should receive, as warranted by existing content:

- production NPC wiring;
- one manifest-registered `RelationshipDefinitionBundle`;
- ordinary Dialogue and optionally Quest-driven authored Experiences;
- evidence-qualified Connection I and II;
- zero to two landmark Memories;
- generic passive relationship Essence when enabled;
- normal routed player-facing qualification;
- persistence qualification.

Relationship-mediated Traits are deliberately excluded from M12.

## 5. Hard architecture invariants

M12 must not introduce:

- NPC-id conditionals for Gronk, Silas, or Valerius inside generic Relationship/Essence/Trait/save/UI behavior;
- per-NPC Relationship screens;
- relationship-archetype engine subclasses such as `ProfessionalRelationship` or `CriminalRelationship`;
- a new save schema merely to represent one of these relationships;
- fabricated Experiences, Memories, dimensions, or qualification evidence when reconciling legacy saves.

A generic correctness fix or evidence-backed authoring/adaptor improvement is not equivalent to an NPC-specific engine exception and must be recorded separately.

## 6. Rule of Two

> Do not generalize an authoring inconvenience observed in only one migrated NPC unless it is a correctness defect.

Friction observed in Gronk is recorded first. Only when Silas independently demonstrates the same need does it become an evidence-backed generic authoring/adaptor candidate. Semantic/domain gaps repeated across two cases are a stop-and-investigate signal rather than permission for silent redesign.

## 7. Baseline authoring friction already observed

Before M12 content changes, the production NPC catalog references dialogue IDs that are not consistently present in `public/data/dialogues.json`:

- Gronk advertises `gronk_greeting`, `gronk_craft_request`, and `gronk_rumors`, while only the greeting path is currently authored.
- Silas advertises `silas_approach`, `silas_shady_deal`, and `silas_trait_hint`, but those production dialogue nodes are absent from the current dialogue file.
- Valerius advertises `valerius_report`, `valerius_training_offer`, and `valerius_city_issues`, while the existing dialogue file instead contains `valerius_greeting` / `valerius_offer_patrol`.

This cross-file drift is baseline evidence for the Authoring Friction Ledger. It must not be erased from the final report merely because M12 repairs the selected production paths.

## 8. Authoring Friction Ledger

Counting convention: “existing dialogues reused” counts canonical M12 route IDs already present at baseline, even if their content was reconciled. “New/reconciled dialogues” counts canonical route nodes newly added or materially rewritten. Production JSON counts include the shared relationship manifest when the case registered its bundle.

| Metric | Gronk | Silas | Valerius |
|---|---:|---:|---:|
| Existing dialogues reused | 1 | 0 | 0 |
| New/reconciled dialogues authored | 4 | 4 | 3 |
| Existing quests reused | 0 | 1 | 1 |
| New quests authored | 0 | 0 | 0 |
| Experiences authored | 4 | 4 | 3 |
| Memories authored | 1 | 1 | 1 |
| Production JSON files changed | 4 | 5 | 4 |
| Generic TS behavioral files changed | 0 | 0 | 0 |
| Generic tooling/adaptor files changed directly for the NPC | 0 | 0 | 0 |
| NPC-specific runtime branches | 0 | 0 | 0 |
| Custom Relationship UI | 0 | 0 | 0 |
| New domain concepts | 0 | 0 | 0 |
| New save schema | 0 | 0 | 0 |
| Candidate-invalidating semantic fixes | 0 | 0 | 0 |
| CI failures attributable to relationship semantics | 0 | 0 | 0 |
| Baseline missing advertised dialogue IDs | 2 | 3 | 3 |
| Route-only defects after authoring | 0 | 0 | 0 |
| Persistence defects | 0 | 0 | 0 |

A separate shared qualification-fixture intervention occurred during Case B and is recorded in Section 16 rather than charged as an NPC-specific runtime or authoring concept.

## 9. Case order and intervention policy

### Case A — Gronk

Migrate without convenience-driven framework changes. Record every friction point.

### Case B — Silas

Migrate independently. Compare its friction with Gronk. Apply the Rule of Two.

### Optional bounded generic intervention

Only repeated evidence may justify a generic authoring validator, shared adapter, or test utility. A repeated semantic representation gap instead pauses the experiment.

### Case C — Valerius

Use the third migration as confirmation after any evidence-backed intervention. Valerius should not trigger another speculative framework expansion.

## 10. Multi-NPC qualification

After all three cases, qualify coexistence in one runtime:

- Relationship histories remain NPC-scoped;
- Memories cannot qualify the wrong NPC;
- Connection evidence remains correctly scoped;
- dimensions do not cross-contaminate;
- unique keys do not collide;
- all enabled relationship Essence sources aggregate generically;
- legacy Connection is not double-counted;
- save/load and save-code import/export preserve the mixed state without minting current Essence.

## 11. Hard stop conditions

Pause or stop broad migration if:

1. an NPC-specific branch appears necessary inside generic behavior;
2. two independent cases expose the same missing universal semantic concept;
3. one archetype requires a new persistent representation/save schema;
4. generic Relationship UI cannot honestly represent the resulting state;
5. the authored route cannot be reached through ordinary production surfaces without Debug/direct Experience injection;
6. Relationship histories or evidence cross-contaminate across NPCs;
7. authoring duplication becomes too severe to review reliably.

## 12. Verdict rubric

### PASS-A — strong scalability

Three heterogeneous NPCs migrate with zero NPC-specific engine branches, no custom Relationship UI, no new save schema, and no material domain-behavior redesign.

### PASS-B — domain scales; authoring tooling does not

All three migrate cleanly at runtime, but repeated authoring fragility/duplication is substantial enough that tooling or validation should become the next milestone.

### CONDITIONAL — generic adapter gap

The domain remains sufficient, but repeated cases require one missing universal production adapter/tooling capability.

### FAIL-MODEL

Repeated cases cannot be represented honestly without a new universal semantic/domain concept.

### FAIL-ARCH

Bespoke runtime behavior, per-NPC UI, or other engine exceptions accumulate.

## 13. Evidence ceiling

M12 may establish production authoring scalability and multi-profile mechanical coexistence. It does not establish:

- human enjoyment or comprehension;
- global Essence balance;
- relationship-mediated Trait scalability;
- campaign discovery/onboarding design;
- procedural Memories or social simulation;
- whole-cast completion.

## 14. Stop condition

M12 is complete when all three ordered cases have been attempted under this frozen protocol, their authoring friction is recorded, the multi-NPC coexistence/persistence gate has run where the experiment reaches it, generic-engine audits are complete, and the evidence supports an explicit PASS-A, PASS-B, CONDITIONAL, FAIL-MODEL, or FAIL-ARCH verdict.

## 15. Case results

### Case A — Gronk: professional / transactional respect

Gronk established the control case through ordinary production dialogue. Four authored Experiences move from craft-specific judgment to durable professional reliance, culminating in the stable Memory **The Blade That Held** and Connection II.

The production route required content reconciliation and a new relationship bundle, but no generic Relationship, Essence, Trait, save, quest-runtime, or UI behavior changed for Gronk. The routed production qualification remained green in the later accumulated M12 gates.

Observed final relationship state in qualification:

- Connection: 2
- Connection Progress: 56
- Affinity: 4
- Trust: 33
- Understanding: 26
- Shared Meaning: 25
- Reliance: 19
- Reciprocity: 14
- Stability: stable
- Memory: `gronk_memory_blade_that_held`

### Case B — Silas: instrumental / ambiguous trust

Silas independently stressed a different region of the same model. His route combines dangerous information, a sealed-package quest, mutually recognized leverage, and reciprocal restraint. It reaches Connection II while Affinity remains negative.

The routed production test uses the ordinary NPC panel, dialogue effects, quest resolution, and generic relationship runtime. It does not inject Silas Experiences directly.

Observed final relationship state:

- Connection: 2
- Connection Progress: 58
- Affinity: -4
- Trust: 20
- Understanding: 29
- Shared Meaning: 20
- Reliance: 20
- Vulnerability: 27
- Reciprocity: 16
- Memory: `silas_memory_secret_neither_sold`
- Memory persistence: contested
- Relationship-derived Essence: enabled

Exact Silas candidate `00ac99faaf900a9a46c8d2503ce01f387c03a847` passed the accumulated Build Validation gate before Case C proceeded.

### Case C — Valerius: hierarchical / institutional respect

Valerius served as the confirmatory case after the bounded Rule-of-Two intervention. The existing patrol quest and generic `REACH_LOCATION` game-event bridge were reused. The quest outcome was connected to authored relationship evidence through the existing generic quest-resolution contract.

The route establishes that hierarchical respect does not require a new Duty, Authority, Obedience, or Hierarchy dimension. Existing Trust, Understanding, Shared Meaning, Reliance, Vulnerability, Reciprocity, Affinity, Experience, Memory, and Connection semantics were sufficient.

Observed final relationship state:

- Connection: 2
- Connection Progress: 55
- Affinity: 1
- Trust: 28
- Understanding: 24
- Shared Meaning: 22
- Reliance: 22
- Vulnerability: 6
- Reciprocity: 15
- Memory: `valerius_memory_order_questioned`
- Memory persistence: stable
- Relationship-derived Essence: enabled

No Valerius-specific branch was added to generic Relationship, Essence, Trait, Quest, game-event, save, or routed NPC behavior.

## 16. Rule-of-Two intervention result

Silas registration expanded the production relationship manifest and exposed repeated qualification-fixture fragility: several accumulated tests manually enumerated the known relationship bundle catalog instead of deriving their generic fetch fixture from `public/data/relationships/index.json`.

This was observed repeatedly rather than inferred from one inconvenience. The bounded intervention made the generic relationship-bundle fixture manifest-driven in:

- `src/features/Traits/state/TraitDiscovery.test.ts`
- `src/features/Relationships/state/RelationshipLyraProduction.test.tsx`
- `src/features/Relationships/state/RelationshipGronkProduction.test.tsx`
- `src/features/Relationships/state/RelationshipElaraCollaboration.test.ts`
- `src/features/Relationships/state/RelationshipLegacySaveMigration.test.ts`

The intervention deliberately retained direct NPC-specific bundle variables where semantic assertions required them; only generic catalog discovery changed.

Build Validation runs #141–#143 exposed the remaining stale fixture assumptions incrementally. Exact intervention head `c85b4164b1521d6309034f40c9e0f0a6b8cedead` then passed typecheck, the accumulated Relationship/Trait/save suite, and the production build in Build Validation #145.

Classification:

- **Domain semantic change:** none
- **Runtime behavioral change:** none
- **Save-schema change:** none
- **NPC-specific branch:** none
- **Generic qualification/test infrastructure change:** yes, bounded and evidence-backed

The result supports the Rule of Two rather than weakening it: the shared repair was made only after repeated catalog-expansion failures demonstrated the seam.

## 17. Multi-NPC coexistence and persistence result

`RelationshipM12MultiNpcProduction.test.ts` constructs a mixed Gronk + Silas + Valerius relationship state after the individual routed tests have independently established production reachability.

The mixed-state gate verifies that:

- each NPC begins under Relationship authority rather than inheriting legacy `connectionDepth` as fabricated modern evidence;
- all three independently reach Connection II;
- Experience histories remain target-scoped;
- each landmark Memory remains target-scoped;
- Connection qualification evidence remains NPC-scoped;
- Experience IDs and Memory IDs do not collide;
- all enabled relationship Essence contributions aggregate through the generic selector/calculator;
- recording Relationship Experiences changes passive generation rate but does not mint current Essence;
- local save/load preserves all three profiles, histories, Memories, and Essence-rate state;
- base64 save-code export/import preserves the same mixed relationship state without minting current Essence.

Exact behavioral candidate `59875074beb27365ec29819eb66b4d54bdb10e9d` passed Build Validation #155 (`34065694918`):

- TypeScript: PASS
- accumulated Relationship/Trait/save/M12 tests: PASS
- production build: PASS

## 18. Generic-engine audit

The three M12 NPC IDs are absent from the generic behavior files audited by their production qualification tests. Across M12, production relationship support required **zero generic TypeScript behavioral changes** for Gronk, Silas, or Valerius.

M12 therefore added no:

- professional-relationship engine subtype;
- criminal/instrumental-relationship engine subtype;
- institutional/hierarchical engine subtype;
- NPC-specific Connection rule;
- NPC-specific Essence rule;
- NPC-specific save rule;
- custom per-NPC Relationship UI;
- new persistent relationship dimension;
- new save schema.

The only generic intervention was the manifest-driven qualification-fixture repair described in Section 16.

## 19. Verdict — PASS-A (strong scalability)

M12 supports **PASS-A — strong scalability**.

The decisive evidence is not merely that all three NPCs can be made to work. It is that three materially different relationship archetypes were productionized primarily through ordinary content/data while the generic Relationship domain and runtime remained unchanged:

- Gronk: professional respect and proven craft reliance;
- Silas: instrumental trust, leverage, reciprocal restraint, and negative Affinity;
- Valerius: institutional trust and disciplined dissent within hierarchy.

The counter-hypothesis was not supported. No repeated semantic representation gap appeared, no NPC-specific engine logic accumulated, and the confirmation case did not require another abstraction after Silas.

The repeated friction that did appear was real but narrower: qualification fixtures had duplicated knowledge of the relationship bundle catalog. That defect was observable, satisfied the Rule of Two, was repaired once through the production manifest, and requalified without changing domain or runtime behavior. It is therefore insufficient to downgrade the result to PASS-B.

## 20. What M12 does and does not justify next

M12 is evidence that adding a fresh production relationship can now be predominantly a **story/content authoring task** rather than a mini engine-development project.

It does **not** prove that the relationship system is narratively integrated across a real campaign. The highest-value next experiment is therefore not another isolated NPC migration and not a speculative authoring framework. It is a bounded narrative integration slice that tests the two-way contract:

```text
Story / gameplay event
        ↓
Relationship Experience / Memory / Connection
        ↓
Relationship state changes later story availability or consequence
        ↓
New story / gameplay event
```

A subsequent milestone should test that loop with a small real story slice, several already-migrated NPCs, and a bounded player objective. That work should begin only after M12 is accepted and merged.
