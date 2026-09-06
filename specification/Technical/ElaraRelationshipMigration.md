# Elara Collaborative Relationship Migration

**Status:** M7 implemented and exact-head qualified; Build Validation #98 passed  
**Scope:** Scholar Elara production relationship migration stacked on PR #25  
**Purpose:** Prove that the relationship framework can express a third materially different relational logic primarily through authored data and existing generic mechanics.

---

## 1. Why Elara is the M7 proof

The relationship framework already has two materially different proofs:

- **Elder Willow — mentor/student:** meaningful teaching, correction, application, passive Essence, and permanent Trait Resonance.
- **Lyra — adversarial/dialectic:** deep Connection can coexist with negative Affinity and unresolved ideological conflict.

A third proof should not merely repeat either shape.

Scholar Elara tests **reciprocal intellectual collaboration**:

```text
useful scholar
-> credible challenger
-> co-investigator
-> epistemic peer
```

The defining question is not whether the protagonist likes Elara or learns facts from her. It is whether both participants become willing and able to **revise their own models when shared evidence contradicts them**.

The relationship therefore stresses:

- Understanding;
- Shared Meaning;
- Reciprocity;
- correction in both directions;
- independent verification;
- co-produced knowledge rather than hierarchical instruction.

---

## 2. Architectural falsification target

M7 should be considered an architectural failure if migrating Elara requires generic relationship code such as:

```ts
if (npcId === 'npc_scholar_elara') {
  // special relationship behavior
}
```

inside reducers, selectors, thunks, Essence calculation, Connection qualification, Memory formation, or Trait Resonance.

The intended authoring path is:

```text
relationship manifest
-> Elara RelationshipDefinitionBundle
-> generic Experience recorder
-> generic Bond Profile updates
-> generic Connection qualification
-> generic Memory formation
-> generic Bond-derived Essence
-> generic Trait assimilation / Resonance
```

The stacked PR diff is intentionally constrained to:

- relationship/content JSON;
- the existing build-validation workflow;
- one dedicated M7 qualification test;
- this migration record.

No generic Relationship reducer, selector, thunk, Essence calculator, or Trait engine implementation file is modified by the M7 migration.

---

## 3. Relationship authority

`npc_scholar_elara` now declares:

```text
connectionAuthority = relationships
essence.enabled = true
```

Elara therefore uses the same Relationships-domain Connection authority introduced for Willow.

Her starting Bond Profile is intentionally low but non-zero in current disposition/credibility:

```text
Affinity: 5
Trust: 4
Understanding: 2
Shared Meaning: 0
Reliance: 0
Vulnerability: 0
Reciprocity: 0
Connection: 0
Progress: 0
Tether: present
```

The migration also reconciles stale NPC dialogue identifiers so every advertised Elara dialogue now resolves to actual authored dialogue content.

---

## 4. Authored collaborative sequence

### EC01 — A Useful Objection

The protagonist identifies circular evidence in Elara's accepted chronology instead of treating expertise as authority.

Core evidence:

- Understanding increases;
- Reciprocity begins;
- `ScholarlyInsight` receives first exposure/assimilation evidence.

The relationship begins through **serious disagreement about evidence**, not approval-seeking.

### EC02 — The Contradictory Footnote

A marginal note threatens the accepted chronology.

Elara and the protagonist agree to treat the contradiction as evidence until it is either explained or disproven.

After EC01 + EC02, Connection I can qualify because the relationship has already demonstrated:

- sufficient Connection Progress;
- two meaningful Experiences;
- minimum Understanding;
- minimum Reciprocity.

### EC03 — A Model Put at Risk

Elara gives the protagonist the source volume underlying her own published claim.

This matters because collaboration becomes costly to Elara: she is no longer merely assigning the protagonist research that can only confirm her expertise.

### EC04 — The Contradictory Tome decision

The existing Elara tome quest is reauthored into a real evidence-resolution decision.

#### Publish the Correction

The contradictory evidence overturns Elara's published chronology.

Consequences:

- stronger Trust / Understanding / Shared Meaning / Reciprocity;
- stronger `ScholarlyInsight` compatibility and assimilation;
- landmark Memory **The Footnote That Won**.

The relationship deepens partly because Elara accepts being wrong in public rather than protecting ownership of the old conclusion.

#### Preserve the Accepted Chronology

The player records the anomaly but refuses to overturn consensus without stronger corroboration.

This branch:

- remains legitimate relationship history;
- gives weaker peer/assimilation evidence;
- does not form **The Footnote That Won**;
- delays the Trait path;
- **does not permanently brick Connection II or `ScholarlyInsight`.**

That recovery property is intentional. A difficult early decision should shape provenance and pacing without becoming a hidden permanent moral fail-state when later evidence demonstrates the same underlying capability more strongly.

### EC05 — Revision Is Mutual

After the protagonist challenges Elara's model, Elara finds a counterexample that breaks the protagonist's preferred replacement.

This is the key anti-hierarchy beat:

```text
player corrects Elara
!=
player becomes new authority
```

Reciprocity now means the correction can move in either direction.

### EC06 — A Theory Neither Owned

Both prior models fail.

Elara and the protagonist construct a third model that neither can claim as a protected personal conclusion.

Landmark Memory:

**A Theory Neither Owned**

This is the clearest transition from researcher/assistant framing toward epistemic peers.

### EC07 — The Result Held Without Her

The protagonist applies the evidence-first revision method to an unrelated archive problem where Elara was absent.

Elara later reproduces the result independently.

This is the defining assimilation proof.

It therefore carries the strongest late Trait effect:

- substantial assimilation gain;
- substantial compatibility gain;
- landmark Memory **The Result Held Without Her**;
- `IndependentVerification` evidence.

This event is deliberately strong enough to let the cautious EC04 branch recover. Independent verification is better evidence of internalized method than one earlier willingness to publish a correction.

### EC08 — Resonance: Scholarly Insight

After relationship, Memory, assimilation, compatibility, and Essence gates are satisfied, Essence stabilizes the already-demonstrated pattern as permanent `ScholarlyInsight`.

---

## 5. Connection qualification

### Connection I — credible collaborator

Requires:

- at least 18 Connection Progress;
- at least two meaningful Experiences;
- `A Useful Objection`;
- `The Contradictory Footnote`;
- Understanding >= 12;
- Reciprocity >= 5.

This is deliberately not a liking threshold.

### Connection II — epistemic peer

Requires:

- at least 70 Connection Progress;
- at least seven meaningful Experiences;
- `A Theory Neither Owned`;
- `The Result Held Without Her`;
- a Memory tagged `IndependentVerification`;
- Understanding >= 45;
- Shared Meaning >= 35;
- Reciprocity >= 25.

**Reciprocity is a first-class qualification requirement in M7.**

That is the central structural difference from Willow. The protagonist cannot become Elara's epistemic peer merely by receiving good instruction or agreeing with her conclusions.

---

## 6. Trait migration — Scholarly Insight

`ScholarlyInsight` is now relationship-mediated with:

```text
source NPC: Scholar Elara
minimum Connection: 2
assimilation threshold: 100%
minimum compatibility: 25
required Memory tag: IndependentVerification
final Essence cost: 30
final authored Resonance Experience: EC08
```

Its semantic meaning is:

> **Contradictory evidence prompts model revision instead of defense of the first plausible conclusion.**

This is intentionally different from Willow's Wisdom.

- Willow's Wisdom = recognizing slow causal patterns and delayed consequences.
- Scholarly Insight = making one's explanatory model answerable to contradictory evidence.

Elara is therefore not another teacher who supplies a different stat bonus. The relationship produces a distinct cognitive pattern through reciprocal inquiry.

---

## 7. Bond-derived Essence

Elara enables the same generic Bond-derived passive Essence mechanism used by migrated relationships.

No Elara-specific Essence formula exists.

Her contribution is therefore derived from the generic relationship state and configured participation rather than from quest completion or direct scene rewards.

The Contradictory Tome resolution gives no relationship-Essence payout. Its progression value is evidence and future Bond state.

---

## 8. Production content integration

M7 reuses existing production surfaces rather than inventing an Elara-only subsystem:

- NPC dialogue list;
- dialogue prerequisite/effect adapter;
- quest unlock and item handoff;
- generic quest resolution options;
- Relationship page;
- generic Bond-derived Essence;
- generic Traits/Resonance UI.

The quest handoff item `item_elara_contradictory_tome` is valid at the current Inventory boundary because Inventory stores arbitrary item-id quantities and Quest objectives consume/observe those ids directly; no separate required item-definition registry exists at that boundary.

App startup continues to initialize the full NPC catalog, so Elara remains a normal production NPC rather than a debug-only proof.

---

## 9. Automated qualification

`RelationshipElaraCollaboration.test.ts` intentionally reads the **actual production JSON files** rather than maintaining a duplicated Elara fixture.

It verifies:

1. Elara is registered through the relationship manifest.
2. Elara uses Relationships-domain Connection authority.
3. Elara enables generic relationship-derived Essence.
4. Every Elara NPC dialogue id resolves to an actual Elara dialogue node.
5. The quest handoff item matches the quest objective target.
6. Every quest-resolution Experience id exists in the Elara relationship bundle.
7. `ScholarlyInsight` declares generic relationship-mediated metadata.
8. Core relationship reducer/selector/thunk files contain no Elara NPC-id branch.
9. Enough Essence alone cannot prematurely Resonate `ScholarlyInsight`.
10. The strong evidence-following path reaches Connection II.
11. The strong path forms all three intended Memories.
12. Elara contributes passive Essence after qualifying the Bond.
13. The strong path reaches full Trait assimilation/compatibility and permanent Resonance.
14. The cautious quest branch can recover through later mutual revision + independent verification rather than becoming a permanent dead end.

### First red run

The first M7 qualification correctly failed the recovery expectation.

The cautious branch could reach the relational state but ended around:

```text
Assimilation: 80%
Compatibility: 21
```

That contradicted the intended branch semantics.

The fix strengthened EC07 **The Result Held Without Her** as the decisive evidence:

```text
Assimilation delta: 40
Compatibility delta: 10
```

The test was not weakened.

This makes independent replication the strongest evidence that the protagonist has actually internalized the pattern, which is narratively and mechanically preferable to treating one earlier publication decision as permanently decisive.

### Exact-head result

Build Validation run **#98** on exact head `652d1f3518b510633791f78041603c309c9f32ee` passed:

- `npm ci`;
- `npx tsc --noEmit`;
- Willow/M4 regression suite;
- routed Willow/M5 suite;
- Lyra/M6 universality suite;
- Elara/M7 collaboration suite;
- production build.

This record reflects the qualified M7 candidate; any later review-fix commit must receive a new exact-head Build Validation run before merge.

---

## 10. M7 conclusion

M7 provides a third materially different proof of the same relationship engine:

```text
Willow
mentor/student
learning through teaching + application

Lyra
adversarial/dialectic
significance despite negative Affinity

Elara
reciprocal intellectual collaboration
epistemic peerhood through mutual correction + independent verification
```

The architectural result is stronger than merely adding another NPC:

> **The relationship engine can express mentorship, adversarial significance, and reciprocal collaboration without introducing a third NPC-specific relationship implementation.**

The remaining claim ceiling is still bounded: three successful archetypes do not prove every future relationship shape. Dependency, coercion, romance, loyalty, manipulation, asymmetric care, and group relationships may expose requirements not exercised here.

M7 nevertheless crosses an important threshold: adding a materially different relationship is now primarily an **authoring/configuration task**, not a generic-engine redesign task.
