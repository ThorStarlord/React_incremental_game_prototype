# M12 — Relationship Authoring Scalability Qualification

**Status:** Preregistered experiment; implementation in progress  
**Baseline main commit:** `5b27cc0942e46190cfac88dc59a735fdcfe6c0b6`  
**Baseline tree:** `cf0b4f90b635a5674d1d4fb602d674ec87d2c4e4`  
**Branch:** `feature/relationship-authoring-scalability`

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

Record per NPC:

| Metric | Gronk | Silas | Valerius |
|---|---:|---:|---:|
| Existing dialogues reused | TBD | TBD | TBD |
| New/reconciled dialogues authored | TBD | TBD | TBD |
| Existing quests reused | TBD | TBD | TBD |
| New quests authored | TBD | TBD | TBD |
| Experiences authored | TBD | TBD | TBD |
| Memories authored | TBD | TBD | TBD |
| Production JSON files changed | TBD | TBD | TBD |
| Generic TS behavioral files changed | TBD | TBD | TBD |
| Generic tooling/adaptor files changed | TBD | TBD | TBD |
| NPC-specific runtime branches | TBD | TBD | TBD |
| Custom Relationship UI | TBD | TBD | TBD |
| New domain concepts | TBD | TBD | TBD |
| New save schema | TBD | TBD | TBD |
| Candidate-invalidating fixes | TBD | TBD | TBD |
| CI failures attributable to case | TBD | TBD | TBD |
| Cross-file authoring defects | TBD | TBD | TBD |
| Route-only defects | TBD | TBD | TBD |
| Persistence defects | TBD | TBD | TBD |

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
