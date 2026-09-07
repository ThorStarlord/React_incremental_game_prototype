# Post-M16 Trait Gameplay Design Reconciliation

**Status:** Canonical design reconciliation after M16  
**Baseline:** `main` at `3fc4fe2dc6049aaf03d825faccafde64780d17f8`  
**Baseline tree:** `d26b8dd400fabb63ac8987794575ac6c500b88db`  
**Scope:** Documentation/product-design reconciliation only; no runtime/content behavior changes

## 1. Purpose

M16 qualified the missing gameplay payoff in the relationship-to-power loop:

```text
Relationship evidence
-> learning / assimilation
-> permanent Trait
-> different gameplay capability
-> different player action
-> different consequence
-> new Relationship evidence
```

This checkpoint reconciles product/design canon so later combat, exploration, Tether, Copy automation, and offline work do not silently redefine what a Trait is or who owns capability authority.

This document distinguishes four kinds of statements:

- **EMPIRICALLY QUALIFIED** — directly demonstrated by M16 or prior qualification;
- **DESIGN DECISION** — chosen product doctrine, not experimentally proven as fun/balanced;
- **DEFERRED** — requires a later production experiment;
- **REJECTED FOR CURRENT SCOPE** — intentionally not part of the present design/runtime contract.

## 2. Audit findings before reconciliation

The post-M16 audit found documentation drift, not a runtime correctness defect.

### 2.1 Trait definition drift

`Features/TraitSystem.md` still opens by saying Traits provide "passive modifications to player capabilities." That is now too narrow. The same document already describes discovery, assimilation, internalization, and permanent Resonance, while M16 demonstrates a permanent Trait authorizing a qualitatively different quest resolution.

**Classification:** contradicted/underspecified by M16; documentation correction required.

### 2.2 Quest contract drift

`Features/QuestSystem.md` does not yet document the M16 production contract `QuestResolutionOption.requiredPermanentTraitIds?: string[]`, the shared UI/runtime availability check, or the requirement that invalid direct resolution attempts fail before effects commit.

**Classification:** runtime already qualified; documentation lag.

### 2.3 Roadmap/status drift

`GameDesignDocument.md`, `README.md`, `RelationshipProgressionRedesign.md`, and `RelationshipExperienceSystem.md` still describe M15 and/or Trait-driven gameplay as future work and stop empirical history at M14.

**Classification:** historical/status drift; documentation correction required.

### 2.4 Combat document

`Features/CombatSystem_MVP.md` correctly states that combat is only an event-bus scaffold with no turn system. No implementation claim needs correction. It does, however, need the post-M16 design constraints that future combat must preserve.

**Classification:** current implementation description is correct; future design doctrine needs reconciliation.

### 2.5 Essence / Relationship authority

Current Essence and Relationship documents already preserve the key ownership boundary that Relationship evidence qualifies learning while migrated Trait Resonance requires discovery, assimilation, Memory evidence, qualified Connection, and Essence. No runtime change is warranted.

## 3. Canonical Trait identity

### DESIGN DECISION

A Trait is an **internalized capability or pattern**: a durable change in what the protagonist can perceive, understand, attempt, perform, or passively sustain.

A Trait is therefore broader than a stat modifier and narrower than an arbitrary content key.

Useful design categories include:

- perceptual — notice something previously unavailable;
- interpretive — reason about evidence/problem differently;
- procedural — know how to perform a new action;
- tactical — recognize/exploit an actionable pattern;
- social — use an internalized interpersonal technique;
- physical — perform a learned bodily/combat technique;
- productive — perform work differently or more effectively;
- passive — continuously modify an existing process.

These are authoring concepts, not a requirement to add a runtime `TraitCategory` enum.

## 4. Capability authority

### EMPIRICALLY QUALIFIED

M16 qualifies the following ownership chain:

```text
Relationship -> acquisition provenance / learning qualification
Trait        -> durable learned capability
Gameplay     -> local applicability of that capability
Player       -> whether to use an available capability
Relationship -> later interpretation of what actually happened
```

A strong Relationship, Memory, Connection level, Affinity value, or legacy `connectionDepth` must not substitute for permanent Trait ownership when gameplay is asking whether the protagonist has learned the capability.

M16 specifically demonstrated that a highly qualified Willow Relationship without permanent `WillowsWisdom` remains insufficient for the Trait-only gameplay route.

## 5. Capability is not decision

### EMPIRICALLY QUALIFIED

```text
capability != decision
```

M16's `WillowsWisdom` route becomes available when the permanent Trait exists, but the player still chooses whether to use it.

### DESIGN DECISION

Traits may reveal information, authorize actions, modify actions, or improve options, but should not normally make irreversible narrative decisions automatically.

This doctrine should later constrain combat automation, Copies, offline progress, dialogue assistance, and quest resolution.

## 6. Expand solution space; do not require the golden button

### EMPIRICALLY QUALIFIED

M16 proved a bounded pattern where the no-Trait path remains valid and the Trait adds another materially different route.

### DESIGN DECISION

Relationship-derived Traits should usually **expand meaningful solution space** rather than replace baseline progression with a universally superior answer.

A Trait-enabled option may differ in:

- speed;
- risk;
- resource cost;
- information gained;
- collateral damage;
- social consequence;
- future optionality;
- visibility;
- reversibility;
- short-term vs. long-term payoff.

`Trait-enabled` must not mean `objectively best` by default.

Future UI should avoid turning every Trait option into an obvious glowing "correct answer."

## 7. Coherent capability identity across contexts

### DESIGN DECISION

A good important Trait should have a reusable semantic identity across multiple situations.

Authoring test:

```text
Because the protagonist internalized [TRAIT],
they can now ____________________________________.
```

Every significant gameplay use should be defensible from the same sentence.

Example:

```text
Because the protagonist internalized Willow's Wisdom,
they can now recognize and reason about slow, interdependent causal patterns.
```

This can plausibly support ecological diagnosis, long-horizon investigation, or a future tactical pattern-recognition use; it does not automatically justify unrelated lockpicking, persuasion, or elemental damage.

## 8. Passive modifiers remain legitimate

### DESIGN DECISION

Numerical/passive effects are not forbidden.

The rule is instead:

> Important Relationship-derived Traits should ideally possess a recognizable capability identity beyond an interchangeable percentage bonus.

A passive modifier may be one mechanical expression of a broader capability rather than the whole definition.

## 9. Permanent internalization

### DESIGN DECISION

A permanent Trait represents a durable transformation of the protagonist.

Once permanently Resonated, the capability belongs to the protagonist rather than remaining an NPC permission token. The source NPC need not be present, nearby, approving, or still friendly for the permanent Trait to exist.

Relationship deterioration should therefore **not normally erase a permanent Trait**.

A deteriorated Relationship may still change:

- future teaching/discovery;
- assimilation of not-yet-permanent Traits;
- Essence generation;
- access to new authored content;
- emotional/narrative meaning.

Any future mechanic that removes an internalized Trait requires its own explicit fictional/mechanical justification.

## 10. Temporary/equipped Trait gameplay semantics

### DEFERRED

M16 qualifies **permanent** Trait ownership as gameplay authority through `requiredPermanentTraitIds`.

It does not establish whether a discovered/equipped non-permanent Trait should grant:

- full capability access;
- unstable/partial capability access;
- only passive effects;
- context-specific access.

Do not infer equivalence between temporary equipping and permanent mastery. Do not infer the opposite either. A future production case must qualify that semantic.

## 11. Multiple Traits and synergy

### DESIGN DECISION

Multiple independently owned Traits may naturally make multiple ordinary options available in the same problem.

### DEFERRED

Dedicated combo/synergy actions are not yet justified.

Do not add a general Trait-combination engine merely because two Traits coexist.

## 12. Relationship consequence after Trait use

### EMPIRICALLY QUALIFIED

M16 proved that Trait-enabled and ordinary actions can produce different Relationship Experiences.

### DESIGN DECISION

Using a source NPC's Trait must not automatically award positive Relationship progress with that NPC.

The Relationship domain interprets **what the player actually did** and may raise some dimensions while lowering others. A brilliant use of a learned capability could still violate the source character's values.

Canonical direction:

```text
Trait
-> player action
-> actual consequence
-> Relationship interpretation
```

not:

```text
Trait used
-> automatic Relationship reward
```

## 13. Trait-option visibility

### EMPIRICALLY QUALIFIED

M16 qualifies the hidden-option model for missing permanent Traits: unavailable Trait-only quest resolutions are not rendered, and direct bypass is rejected below UI.

### DESIGN DECISION

Future content may use either:

- hidden options when the protagonist cannot conceive the possibility; or
- visible-but-unavailable presentation when recognizing the limitation helps player understanding/progression planning.

### DEFERRED

No global UI policy or new runtime representation for visible-but-unavailable Trait options is introduced by this checkpoint.

## 14. M17 combat doctrine

### DESIGN DECISION

The next combat vertical slice, if preregistered, should preserve these constraints:

1. use an existing Relationship-derived permanent Trait where semantically appropriate;
2. give the Trait a tactical effect beyond a flat passive stat bonus;
3. keep a viable control strategy without the Trait;
4. require the player to choose when/how to use the capability;
5. avoid making the Trait route universally dominant;
6. keep Trait ownership as capability authority;
7. produce an ordinary combat/gameplay result that another system can consume;
8. avoid a generalized ability/condition DSL unless repeated production evidence warrants it.

M17 should test whether the Checkpoint A doctrine produces meaningful tactical choice, not whether a large combat engine can be built.

## 15. Rejected for current scope

The following are intentionally not introduced here:

- a generic stat/skill-check DSL;
- arbitrary boolean ability expressions;
- Trait categories as required runtime schema;
- Trait synergy/combo engine;
- temporary-Trait gameplay equivalence;
- new combat runtime;
- new quests/content;
- new save fields;
- new Relationship dimensions or Connection tiers.

## 16. Canonical invariants after M16

1. Relationship qualifies learning; Trait owns learned capability.
2. Capability does not make the player's decision.
3. Traits should usually expand solution space rather than replace baseline progression.
4. Trait-enabled does not mean objectively best.
5. Permanent Traits represent internalized character change.
6. Relationship deterioration does not normally erase permanent learning.
7. One important Trait should express a coherent capability identity across contexts.
8. Gameplay consequences, not Trait usage itself, determine later Relationship interpretation.

## 17. Evidence boundary

### Empirically established through M16

- Relationship-mediated discovery/assimilation/Resonance exists for Willow and Elara;
- permanent Trait state can gate an ordinary quest resolution generically;
- a strong Relationship without the permanent Trait is insufficient for capability access;
- UI and thunk enforce the same permanent-Trait requirement;
- permanent Trait ownership survives save/load;
- two independent production probes justified the bounded `requiredPermanentTraitIds` contract;
- Trait-enabled and ordinary routes can produce different Relationship consequences.

### Not empirically established by this checkpoint

- that these principles are fun;
- that Trait routes avoid golden-option bias in human play;
- temporary/equipped Trait gameplay semantics;
- combat usefulness;
- campaign-scale build diversity or balance;
- multi-Trait synergy;
- player comprehension/pacing;
- broad Trait reuse across many contexts.

## 18. Documentation authority

For Trait-gameplay questions after M16, read:

1. this document — post-M16 gameplay doctrine and evidence/design distinction;
2. `../GameDesignDocument.md` — product loop and current direction;
3. `../Features/TraitSystem.md` — Trait lifecycle/runtime authority;
4. `../Features/QuestSystem.md` — currently qualified permanent-Trait gameplay consumption surface;
5. `PostM14ProductReconciliation.md` — broader domain authority/migration boundaries;
6. milestone qualification documents, especially `M16TraitDrivenGameplayQualification.md`, for empirical evidence.

Historical documents remain evidence of prior decisions but do not override later explicit reconciliation.

## 19. Checkpoint acceptance

This checkpoint is complete only when:

- canonical docs are reconciled with M15/M16 history;
- the Trait definition no longer collapses to passive modifiers;
- the Quest spec documents the exact M16 permanent-Trait gate;
- future combat doctrine is aligned with the capability/decision boundary;
- no runtime/content behavior changes are included;
- exact final-head Build Validation passes;
- the exact qualified head is merged and integrated tree verified.

## 20. Evidence ceiling

This reconciliation may establish only:

> The canonical product design now defines how Relationship-derived Traits are intended to function as gameplay capabilities, grounded where possible in M16's qualified behavior and clearly distinguishing design policy from empirical evidence.

It does not qualify fun, combat, temporary Trait semantics, build balance, player comprehension, or campaign-scale Trait relevance.

## 21. Qualification result

**Verdict:** PASS — documentation-only reconciliation candidate qualified.

Baseline:

- `main`: `3fc4fe2dc6049aaf03d825faccafde64780d17f8`
- baseline tree: `d26b8dd400fabb63ac8987794575ac6c500b88db`

First complete reconciliation candidate:

- SHA: `da1a30aec189b88fc1f6746a2e31cae93e6891c6`
- tree: `0ee7c55989f59b66ada9fb0c51aa63aed960edbe`
- Build Validation #169: run `34116403966`, job `101724143414` — **PASS**
- dependency install: PASS
- TypeScript: PASS
- accumulated M4-M16 qualification suite: PASS
- production build: PASS

Diff audit against the exact baseline found exactly eight changed files, all under `specification/`:

1. `specification/Features/CombatSystem_MVP.md`
2. `specification/Features/QuestSystem.md`
3. `specification/Features/RelationshipExperienceSystem.md`
4. `specification/Features/TraitSystem.md`
5. `specification/GameDesignDocument.md`
6. `specification/README.md`
7. `specification/RelationshipProgressionRedesign.md`
8. `specification/Technical/PostM16TraitGameplayReconciliation.md`

No `src/`, production content JSON, save schema, tests, or workflow files changed. No runtime/content behavior was introduced by the checkpoint.

Recording this result creates a documentation-complete final head. That final head must receive its own exact-head Build Validation before merge; Build Validation #169 alone is not the merge authority for the later documentation-complete commit.
