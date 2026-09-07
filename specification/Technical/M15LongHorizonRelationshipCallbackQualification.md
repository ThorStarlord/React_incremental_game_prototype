# M15 — Long-Horizon Relationship Callback Qualification

**Status:** preregistered; implementation not yet started  
**Baseline:** post-reconciliation `main` at `6eac07a973eb032ccbf4a89fa3ba6fc5003101fb`  
**Baseline tree:** `4615624c08bd2ff4d41b117114c3b65443e09ed6`  
**Branch:** `feature/m15-long-horizon-relationship-callbacks`

## 1. Question

Can old Relationship evidence remain causally relevant to a later production story situation after substantial intervening content, subsequent reinforcing or contradictory Relationship evidence, unrelated NPC activity, and save/load, without shadow story flags, NPC-specific runtime branches, or a generalized narrative-condition engine?

The target causal shape is:

```text
old Relationship event
-> durable Experience / Memory
-> later story and Relationship history
-> unrelated NPC content
-> additional reinforcing or contradictory evidence
-> save / load
-> late story crisis
-> old + recent evidence jointly shape callback availability
-> materially different later gameplay access
-> new Relationship evidence
```

M13 qualified bounded Story -> Relationship -> later Story causality.
M14 qualified one shared event producing distinct consequences across several relationships.
M15 tests temporal composition: whether accumulated history can remain meaningful rather than being replaced by the latest state.

## 2. Primary hypothesis

The existing generic contracts are sufficient for a bounded long-horizon callback:

- durable Relationship Experiences and Memories retain old history;
- Dialogue `requiredExperienceIds` and `anyOfExperienceIds` can consume positive historical evidence;
- ordinary Dialogue effects can produce new Relationship evidence and unlock quests;
- ordinary Quest/location/resolution paths can carry a history-conditioned consequence into gameplay;
- existing save/load preserves all causal evidence;
- no negative-condition DSL, shadow boolean, new Relationship dimension, new Connection tier, or NPC-specific generic branch is necessary.

## 3. Counter-hypotheses / useful failure modes

M15 should fail or stop if repository evidence shows that:

1. M14 policy choices are not mutually exclusive in ordinary production and one playthrough can accumulate `public_crackdown`, `protect_source`, and `quiet_reroute` outcomes from the same council decision;
2. old Silas evidence cannot remain available after later contradictory evidence without mutating or deleting history;
3. UI-only gating is insufficient because the interaction thunk accepts a history-invalid callback;
4. save/load loses or corrupts one of the required historical layers;
5. the slice requires persistent shadow state such as `silasRemembersSecret`, `silasWillTestify`, `oldDebtActive`, or `ledgerRouteUnlocked`;
6. the slice requires `if (npcId === 'npc_rogue_silas')` or equivalent NPC-specific behavior in generic runtime;
7. the slice requires generalized negative/boolean condition syntax from only this one production case.

A clean stop or FAIL is evidence and must be preserved rather than hidden behind a workaround.

## 4. Pre-implementation correctness gate — M14 policy exclusivity

Before adding M15 production behavior, verify whether ordinary production interaction with `valerius_m14_aftermath_council` can record more than one policy outcome over repeated interaction.

The intended M14 event is one policy decision:

- `public_crackdown`;
- `protect_source`;
- `quiet_reroute`.

M15 plans to use those Experiences as historical discriminators. They are unsafe for that purpose if the same ordinary playthrough can accumulate several mutually exclusive outcomes.

### Gate result policy

- **PASS:** ordinary production ensures one council policy history per playthrough, or existing idempotent/completion behavior makes replay unable to add another policy.
- **FAIL:** more than one M14 council policy can be recorded in the same ordinary playthrough.

If FAIL, stop M15. Fix and qualify the pre-existing M14 decision-exclusivity defect narrowly on its own basis, then rebase/restart M15 from corrected `main`. Do not add an M15 story flag to work around it.

## 5. Existing historical evidence under test

### Old landmark

Silas M12:

- Experience: `silas_exp_secret_neither_sold`
- Memory: `silas_memory_secret_neither_sold`
- title: **The Secret Neither Sold**

This is the old landmark whose causal relevance M15 tests.

### Later reinforcing evidence

M14 supplies two acceptable reinforcing outcomes:

- `silas_exp_aftermath_protect_source` — **The Source You Left Alive**;
- `silas_exp_aftermath_quiet_reroute` — **The Pattern You Made Worth Less**.

They represent later decisions that preserve Silas's channel or solve the leak without simply burning the network.

### Later contradictory evidence

M14 supplies:

- `silas_exp_aftermath_public_crackdown` — **The Source You Burned**.

This increases Silas's Understanding while reducing Trust/Reliance. It is the preregistered contradictory history.

The old Memory must remain true and durable even when this later contradictory Experience exists.

## 6. Production story slice — A Debt That Survived the Fire

Much later, Captain Valerius receives a forged broker ledger that appears to prove the player sold Watch information.

The accusation is credible enough that Valerius cannot dismiss it, but his existing history with the player justifies an investigation rather than immediate judgment.

The late crisis is intentionally independent of Silas history: Silas's old landmark changes how help is available, not whether the crisis can exist.

## 7. Valerius late inquiry

Planned production topic:

`valerius_m15_forged_ledger_inquiry`

Planned prerequisite:

- existing Valerius evidence from the qualified Merchant District sequence, preferably `valerius_exp_merchant_leak_broken` if reconnaissance confirms it is the cleanest production gate.

The topic records:

`valerius_exp_forged_ledger_inquiry`

Frozen planning Relationship effects:

- Affinity: `0`
- Trust: `+2`
- Understanding: `+4`
- Shared Meaning: `+2`
- Reliance: `+2`
- Vulnerability: `0`
- Reciprocity: `+2`
- Connection Progress: `+6`

Interpretation target:

> Valerius treats contradictory evidence as grounds for disciplined inquiry rather than immediate judgment because prior delegated judgment established that appearances deserve verification when stakes are high.

The inquiry unlocks the ordinary default investigation quest:

`quest_m15_verify_forged_ledger`

The default quest must be available independently of special Silas history.

## 8. Three historical routes

### Route A — Control

History deliberately lacks:

`silas_exp_secret_neither_sold`

It still reaches the late Valerius inquiry.

Expected Silas result:

- ordinary fallback topic is available;
- reinforced callback is unavailable;
- contradicted callback is unavailable;
- direct thunk attempt to invoke a privileged callback is rejected.

Planned fallback topic:

`silas_m15_brokers_price`

The fallback may explain how forged ledgers circulate, but must not grant the privileged hidden-chain route.

The fallback is not itself evidence that old history existed.

### Route B — Reinforced old history

Required historical shape:

```text
silas_exp_secret_neither_sold
+ valerius_exp_forged_ledger_inquiry
+ one of:
    silas_exp_aftermath_protect_source
    silas_exp_aftermath_quiet_reroute
```

Planned topic:

`silas_m15_debt_still_counts`

Planned gate:

```json
{
  "requiredExperienceIds": [
    "valerius_exp_forged_ledger_inquiry",
    "silas_exp_secret_neither_sold"
  ],
  "anyOfExperienceIds": [
    "silas_exp_aftermath_protect_source",
    "silas_exp_aftermath_quiet_reroute"
  ]
}
```

Planned callback Experience:

`silas_exp_old_silence_repaid`

Frozen planning effects:

- Affinity: `+2`
- Trust: `+6`
- Understanding: `+4`
- Shared Meaning: `+7`
- Reliance: `+4`
- Vulnerability: `+3`
- Reciprocity: `+6`
- Connection Progress: `+8`

Meaning target:

> Silas treats the old mutual restraint as still creditworthy because later conduct reinforced rather than contradicted it. He risks access to a broker chain rather than merely selling generic information.

This response unlocks:

`quest_m15_follow_hidden_chain`

### Route C — Contradicted old history

Required historical shape:

```text
silas_exp_secret_neither_sold
+ silas_exp_aftermath_public_crackdown
+ valerius_exp_forged_ledger_inquiry
```

Planned topic:

`silas_m15_debt_not_renewed`

Planned callback Experience:

`silas_exp_old_silence_reinterpreted`

Frozen planning effects:

- Affinity: `0`
- Trust: `-1`
- Understanding: `+6`
- Shared Meaning: `+4`
- Reliance: `-2`
- Vulnerability: `+1`
- Reciprocity: `+2`
- Connection Progress: `+5`

Meaning target:

> Silas remembers that the player once refused to sell his secret and treats that historical fact as still true. He also remembers that the player later burned a source exposed under expectations of restraint. He will confirm the old fact or explain the forgery, but he will not expose another channel.

This route must **not** unlock `quest_m15_follow_hidden_chain`.

The key invariant is:

```text
old Memory survives
!= Trust restored
!= same future access
```

## 9. Memory-history invariant

M15 must not delete, invalidate, or overwrite:

`silas_memory_secret_neither_sold`

when `silas_exp_aftermath_public_crackdown` exists.

Both historical facts remain durable:

```text
The Secret Neither Sold
AND
The Source You Burned
```

The new callback expresses a current interpretation of both facts rather than mutating historical truth.

## 10. Unrelated intervening content

The principal reinforced and contradicted tests must perform at least one ordinary production Relationship interaction with another NPC between the Silas/M14 historical setup and the late callback.

Preferred existing content:

- Elder Willow's production route beginning with `elder_willow_greeting` / **She Saw Through the Question**.

The unrelated Willow Experience is not a Silas prerequisite. It exists only to prove that other Relationship history can accumulate in the same save before the late callback.

If the exact Willow topic is unsuitable for a test fixture after reconnaissance, another already-qualified production Relationship event may substitute, but the substitution must be recorded in the results section and must remain unrelated to Silas callback gating.

## 11. Save/load boundary

The primary save boundary occurs after:

- old Silas evidence exists where applicable;
- reinforcing or contradictory M14 evidence exists where applicable;
- unrelated NPC Relationship content has occurred;
- `valerius_exp_forged_ledger_inquiry` has been recorded;

but before the Silas M15 callback is selected.

After load, tests must verify preservation of every historical layer before invoking the callback.

Use the existing production save/load + migration path. No M15 save schema is permitted unless an independently discovered correctness defect requires one.

## 12. Gameplay consequence

### Default investigation

Planned quest:

`quest_m15_verify_forged_ledger`

It should use existing Quest contracts, preferably a small `REACH_LOCATION` objective at an existing location and one ordinary resolution option.

The default route exists regardless of privileged Silas callback history.

### Reinforced-history alternate investigation

Planned quest:

`quest_m15_follow_hidden_chain`

It is unlocked only by `silas_m15_debt_still_counts`.

It should also use existing Quest/location/resolution contracts.

Planned resolution Experience:

`silas_exp_hidden_chain_verified`

Frozen planning effects:

- Affinity: `+1`
- Trust: `+3`
- Understanding: `+3`
- Shared Meaning: `+4`
- Reliance: `+4`
- Vulnerability: `+2`
- Reciprocity: `+3`
- Connection Progress: `+6`

The contradicted route must not receive this quest or Experience.

## 13. Condition-language policy

Current Dialogue supports positive evidence gates:

- `requiredExperienceIds` — all required;
- `anyOfExperienceIds` — at least one alternative.

M15 must first attempt the slice with these existing contracts.

Do not add from one authoring inconvenience:

- `excludedExperienceIds`;
- `forbiddenMemoryIds`;
- generic `NOT`;
- boolean condition AST/DSL;
- arbitrary expression language.

### Rule of Two

A generic negative/advanced condition capability is justified only if two independently authored production situations naturally require the same missing semantic capability.

One M15 callback being cleaner with absence logic is not sufficient evidence.

Fallback and special positive-evidence topics may coexist if that preserves correct semantics without a new condition language.

## 14. Expected implementation scope

Expected production changes are limited to:

- `public/data/dialogues.json`;
- `public/data/npcs.json`;
- `public/data/quests.json`;
- `public/data/relationships/silas.json`;
- `public/data/relationships/valerius.json`;
- one dedicated M15 test file;
- accumulated Build Validation wiring;
- this qualification document's later results section.

Expected generic-runtime behavioral changes: **none**.

If implementation evidence requires more, record why before making the change.

## 15. Principal dedicated test

Create:

`src/features/Relationships/state/RelationshipM15LongHorizonCallback.test.tsx`

At minimum it must include:

### Test A — production authoring / architecture audit

Verify:

- exact M15 dialogue gates;
- quest wiring;
- new Experience definitions and source IDs;
- fallback vs reinforced vs contradicted semantics;
- `quest_m15_follow_hidden_chain` can only be unlocked through the reinforced callback;
- no M15 identifier appears in audited generic Relationship/NPC/Quest/game-event/save runtime files;
- no new negative-condition DSL or M15 shadow boolean exists.

### Test B — control history

- initialize production runtime;
- create a late Valerius inquiry history without `silas_exp_secret_neither_sold`;
- perform unrelated production Relationship content;
- save/load before callback;
- verify fallback available;
- verify privileged callbacks unavailable;
- directly attempt invalid privileged interaction thunk and expect rejection;
- verify hidden-chain quest remains unavailable.

### Test C — reinforced history

- use independently qualified historical M12-M14 evidence as setup;
- ensure `silas_exp_secret_neither_sold` exists;
- ensure either protect-source or quiet-reroute M14 evidence exists;
- perform unrelated production Relationship content;
- trigger Valerius inquiry through ordinary production route;
- save/load;
- verify old Silas Memory, reinforcing M14 evidence, unrelated NPC evidence, and inquiry evidence all persist;
- use ordinary Silas Dialogue UI to select reinforced callback;
- verify `silas_exp_old_silence_repaid`;
- verify hidden-chain quest unlock;
- complete the hidden-chain quest through ordinary Quest/location/resolution path;
- verify `silas_exp_hidden_chain_verified`;
- verify old Memory remains present.

### Test D — contradicted history

- use independently qualified historical M12-M14 evidence as setup;
- ensure `silas_exp_secret_neither_sold` exists;
- ensure `silas_exp_aftermath_public_crackdown` exists;
- perform unrelated production Relationship content;
- trigger Valerius inquiry;
- save/load;
- verify old Silas Memory and public-crackdown Experience both persist;
- use ordinary Silas Dialogue UI to select contradicted callback;
- verify `silas_exp_old_silence_reinterpreted`;
- verify hidden-chain quest is not unlocked;
- verify no false Trust restoration; Understanding/Shared Meaning may increase as authored;
- verify old Memory remains present.

Historical M12-M14 evidence may be seeded directly only because those routes were independently qualified earlier. Every new M15 Experience and quest consequence must be exercised through ordinary production paths.

## 16. Stop conditions

Stop implementation and preserve the finding if any of these becomes necessary:

- persistent `silasWillTestify`, `silasRemembersSecret`, `silasTrustRestored`, `oldDebtActive`, `ledgerRouteUnlocked`, or equivalent shadow state;
- NPC-ID branches in generic runtime;
- deleting or rewriting old Memory history to produce current interpretation;
- using Affinity or legacy `connectionDepth` as proxy for specific historical evidence;
- a new Relationship dimension or Connection tier solely for M15;
- a new save schema solely for M15;
- generalized condition language based on only this one authoring case;
- direct Experience injection as the principal route for any new M15 behavior;
- UI-only gating that the interaction thunk does not enforce;
- silently tolerating non-exclusive M14 policy outcomes if the pre-implementation gate fails.

## 17. Acceptance criteria

- [x] exact post-reconciliation baseline frozen;
- [x] fresh M15 branch created from that exact baseline;
- [x] preregistration committed before production behavior changes;
- [ ] M14 policy-exclusivity correctness gate passes before M15 implementation;
- [ ] one old Silas landmark is reused;
- [ ] at least one reinforcing later history is exercised;
- [ ] at least one contradictory later history is exercised;
- [ ] one control history lacks the old landmark;
- [ ] unrelated NPC Relationship evidence occurs between old history and callback;
- [ ] additional Relationship state changes before callback;
- [ ] save/load occurs before callback;
- [ ] old Silas Memory survives save/load;
- [ ] old Silas Memory survives later contradictory evidence;
- [ ] contradictory M14 evidence remains present rather than being erased;
- [ ] callback interpretation reflects old + recent evidence;
- [ ] control history cannot invoke privileged callback through UI or direct thunk;
- [ ] reinforced history receives materially different later gameplay access;
- [ ] contradicted history does not receive the same privileged access;
- [ ] new callbacks produce new Relationship evidence;
- [ ] no shadow story/Relationship boolean is added;
- [ ] no NPC-ID generic runtime branch is added;
- [ ] no new Relationship dimension or Connection tier is added;
- [ ] no new save schema is added solely for M15;
- [ ] no generalized condition language is added unless independently justified by Rule of Two;
- [ ] accumulated M4-M14 qualification remains green;
- [ ] dedicated M15 qualification passes;
- [ ] TypeScript passes;
- [ ] production build passes;
- [ ] first complete behavioral candidate SHA/tree recorded;
- [ ] actual results and evidence ceiling recorded before merge;
- [ ] documentation-complete exact final PR head passes Build Validation;
- [ ] merge uses the exact qualified head with an expected-head guard.

## 18. Evidence ceiling

Even a PASS establishes only:

> A bounded production relationship history can remain causally relevant across intervening events, additional reinforcing or contradictory relationship evidence, unrelated NPC activity, and save/load; old and newer evidence can jointly determine later story availability without a duplicate story flag or NPC-specific generic runtime branch.

M15 does not establish:

- whole-campaign continuity;
- real-world years of simulated relationship history;
- automatic Memory aging/decay;
- arbitrary historical reasoning;
- NPC belief simulation;
- emergent/procedural storytelling;
- human satisfaction, pacing, emotional quality, or comprehensibility;
- campaign-scale branching scalability.

"Long horizon" means large causal distance in authored game history, not a claim about real-world play duration.

## 19. Merge boundary

M15 must remain on a draft PR until:

1. the first complete behavioral candidate passes Build Validation;
2. actual results are recorded in this document;
3. the documentation-complete final head passes Build Validation again;
4. the PR remains mergeable and points to that exact qualified head.

Merge only with an expected-head SHA guard.

Per owner instruction, the repository Gemini workflow is not merge authority.