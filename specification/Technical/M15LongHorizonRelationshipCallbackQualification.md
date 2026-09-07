# M15 — Long-Horizon Relationship Callback Qualification

**Status:** results recorded; PASS subject only to exact-final-head requalification  
**Baseline:** corrected post-M14 `main` at `76569543fa12e318e61db0aed8f7355048cb3dc0`  
**Baseline tree:** `91805bb69d89536142e63dbb3d44cf7fd1d104a1`  
**Branch:** `feature/m15-long-horizon-relationship-callbacks-v2`

## 1. Experimental lineage

The first M15 attempt was preregistered on `feature/m15-long-horizon-relationship-callbacks` before production behavior changed.

Its pre-implementation gate found a pre-existing M14 correctness defect: the M14 council and repair-ledger policy dialogues were replayable, so mutually exclusive response-specific Relationship Experiences could accumulate in one playthrough.

That first M15 attempt stopped and preserved its result rather than working around the defect.

The defect was repaired separately in PR #37 through a qualified generic `repeatable: false` Dialogue contract using existing `NPC.completedDialogues` persistence. The exact repair head `7b21378fe54495793b46f5fe0746e4e7d0aa6078` passed Build Validation #164 and merged as `76569543fa12e318e61db0aed8f7355048cb3dc0` with identical integrated tree `91805bb69d89536142e63dbb3d44cf7fd1d104a1`.

M15 v2 then restarted from corrected `main`. The stopped v1 branch remains historical failure evidence and was not rewritten.

## 2. Question

Can old Relationship evidence remain causally relevant to a later production story situation after substantial intervening content, subsequent reinforcing or contradictory Relationship evidence, unrelated NPC activity, and save/load, without shadow story flags, NPC-specific runtime branches, or a generalized narrative-condition engine?

Target causal shape:

```text
old Relationship landmark
-> later story / Relationship history
-> reinforcing OR contradictory evidence
-> unrelated NPC Relationship content
-> late independent crisis
-> save / load
-> old + recent evidence jointly shape callback availability
-> materially different later gameplay access
-> new Relationship evidence
```

M13 qualified bounded Story -> Relationship -> later Story causality.
M14 qualified shared social breadth.
The M14 exclusivity repair restored the assumption that a one-shot policy decision has one historical outcome.
M15 tests temporal composition.

## 3. Preregistered hypothesis

The experiment froze the expectation that the existing generic contracts would be sufficient:

- durable Relationship Experiences and Memories retain old history;
- M14 policy Experiences are mutually exclusive through ordinary one-shot production dialogue;
- Dialogue `requiredExperienceIds` and `anyOfExperienceIds` consume positive historical evidence;
- Dialogue `repeatable: false` marks one-shot callback topics without a new story-state domain;
- ordinary Dialogue effects record new Relationship evidence and unlock quests;
- ordinary Quest/location/resolution contracts carry history-conditioned access into gameplay;
- existing save/load preserves all causal layers;
- no negative-condition DSL, shadow boolean, new Relationship dimension, new Connection tier, or NPC-specific generic branch is necessary.

The preregistration also required a stop if M15 needed shadow state such as `silasRemembersSecret`, an NPC-ID generic branch, Memory deletion/rewrite, Affinity/legacy `connectionDepth` as historical proxies, a new save schema, or a generalized boolean condition language derived from this single case.

None of those stop conditions occurred in v2.

## 4. Historical evidence under test

### Old landmark

Silas M12:

- Experience: `silas_exp_secret_neither_sold`
- Memory: `silas_memory_secret_neither_sold`
- title: **The Secret Neither Sold**

### Reinforcing M14 evidence

The authored reinforced callback accepts either:

- `silas_exp_aftermath_protect_source` — **The Source You Left Alive**;
- `silas_exp_aftermath_quiet_reroute` — **The Pattern You Made Worth Less**.

The dedicated principal reinforced test uses the quiet-reroute history.

### Contradictory M14 evidence

- `silas_exp_aftermath_public_crackdown` — **The Source You Burned**.

The contradiction remains historical evidence. It does not delete or invalidate **The Secret Neither Sold**.

## 5. Implemented production slice — A Debt That Survived the Fire

Captain Valerius receives a forged broker ledger that appears to prove the player sold Watch information.

The accusation is credible enough that Valerius cannot dismiss it. Existing delegated-judgment history instead lets him treat the document as evidence that must be tested before it becomes a verdict.

The crisis is independent of Silas history: Silas history changes what additional assistance becomes available, not whether the accusation/investigation can occur.

### Valerius late inquiry

Production topic:

`valerius_m15_forged_ledger_inquiry`

Properties:

- `repeatable: false`;
- gate: `valerius_exp_merchant_leak_broken`;
- response: `investigate`;
- records `valerius_exp_forged_ledger_inquiry`;
- unlocks default quest `quest_m15_verify_forged_ledger`.

`valerius_exp_forged_ledger_inquiry` uses the preregistered vector:

- Trust `+2`
- Understanding `+4`
- Shared Meaning `+2`
- Reliance `+2`
- Reciprocity `+2`
- Connection Progress `+6`

### Control fallback

Production topic:

`silas_m15_brokers_price` — **A Broker's Price**

Gate:

`valerius_exp_forged_ledger_inquiry`

It explains the forgery method but does not unlock privileged live-broker access.

### Reinforced callback

Production topic:

`silas_m15_debt_still_counts` — **A Debt He Still Counts**

Properties:

- `repeatable: false`;
- requires `valerius_exp_forged_ledger_inquiry`;
- requires `silas_exp_secret_neither_sold`;
- requires at least one of `silas_exp_aftermath_protect_source` / `silas_exp_aftermath_quiet_reroute`.

Response `risk_chain` records:

`silas_exp_old_silence_repaid`

with the preregistered vector:

- Affinity `+2`
- Trust `+6`
- Understanding `+4`
- Shared Meaning `+7`
- Reliance `+4`
- Vulnerability `+3`
- Reciprocity `+6`
- Connection Progress `+8`

It also unlocks:

`quest_m15_follow_hidden_chain`

### Contradicted callback

Production topic:

`silas_m15_debt_not_renewed` — **A Debt Remembered, Not Renewed**

Properties:

- `repeatable: false`;
- requires `valerius_exp_forged_ledger_inquiry`;
- requires `silas_exp_secret_neither_sold`;
- requires `silas_exp_aftermath_public_crackdown`.

Response `confirm_limit` records:

`silas_exp_old_silence_reinterpreted`

with the preregistered vector:

- Trust `-1`
- Understanding `+6`
- Shared Meaning `+4`
- Reliance `-2`
- Vulnerability `+1`
- Reciprocity `+2`
- Connection Progress `+5`

It does **not** unlock the hidden-chain quest.

The resulting invariant is:

```text
old Memory survives
!= Trust restored
!= same future access
```

## 6. Gameplay consequence

### Default route

`quest_m15_verify_forged_ledger`

- giver: Valerius;
- ordinary `REACH_LOCATION` objective;
- target: `location_merchant_district`;
- one ordinary resolution option;
- no privileged Silas Relationship Experience.

The default route remains available independent of the old Silas landmark because it is unlocked by Valerius's inquiry.

### Reinforced privileged route

`quest_m15_follow_hidden_chain`

- giver: Silas;
- unlocked only by the reinforced callback;
- ordinary `REACH_LOCATION` objective;
- target: `location_merchant_district`;
- one normal resolution option;
- resolution records `silas_exp_hidden_chain_verified`.

`silas_exp_hidden_chain_verified` uses the preregistered vector:

- Affinity `+1`
- Trust `+3`
- Understanding `+3`
- Shared Meaning `+4`
- Reliance `+4`
- Vulnerability `+2`
- Reciprocity `+3`
- Connection Progress `+6`

The contradicted history does not receive this quest.

## 7. Unrelated intervening Relationship content

The principal control, reinforced, and contradicted tests perform ordinary Elder Willow production dialogue before the late Silas callback.

They use:

`elder_willow_greeting` / **She Saw Through the Question**

with response `respect`, producing `willow_exp_first_question_admit` through the normal NPC Dialogue UI.

This Willow Experience is not a Silas prerequisite. It exists only to prove that unrelated Relationship history can accumulate in the same persisted game state while old Silas history remains causally available.

## 8. Save/load result

Each principal history reaches the late Valerius inquiry through ordinary production UI and then saves before the Silas callback.

The qualified persistence route uses:

```text
createSave
-> loadSavedGameWithMigration
-> replaceState
```

After load, the tests verify the required historical layers before invoking Silas.

### Reinforced state after load

Present simultaneously:

- `silas_memory_secret_neither_sold`;
- `silas_exp_aftermath_quiet_reroute`;
- `willow_exp_first_question_admit`;
- `valerius_exp_forged_ledger_inquiry`.

### Contradicted state after load

Present simultaneously:

- `silas_memory_secret_neither_sold`;
- `silas_exp_aftermath_public_crackdown`;
- `willow_exp_first_question_admit`;
- `valerius_exp_forged_ledger_inquiry`.

No save-schema change was required.

## 9. Repaired M14 prerequisite result

The dedicated M15 architecture test re-runs the repaired M14 decision boundary before relying on M14 outcomes as historical discriminators.

It verifies:

1. `valerius_m14_aftermath_council.repeatable === false`;
2. a valid `public_crackdown` response succeeds;
3. a later direct `quiet_reroute` attempt on the same node returns `Dialogue already completed.`;
4. `silas_exp_aftermath_quiet_reroute` remains absent.

**Prerequisite gate: PASS.**

The prerequisite defect that stopped M15 v1 therefore remains repaired on the corrected baseline used by M15 v2.

## 10. Control-history result

The control history includes required Valerius history but omits `silas_exp_secret_neither_sold`.

After unrelated Willow interaction, late Valerius inquiry, and save/load:

- **A Broker's Price** is available;
- **A Debt He Still Counts** is unavailable;
- **A Debt Remembered, Not Renewed** is unavailable;
- direct thunk invocation of the reinforced callback is rejected for missing Relationship evidence;
- `quest_m15_follow_hidden_chain` is not available;
- `quest_m15_verify_forged_ledger` remains available on Valerius.

**Control result: PASS.**

The late crisis alone is insufficient to manufacture the old relational callback.

## 11. Reinforced-history result

Historical setup contains:

- the old Silas M12 landmark and Memory;
- qualified later Silas/Valerius history;
- `silas_exp_aftermath_quiet_reroute` as reinforcing M14 evidence.

After unrelated Willow interaction, late Valerius inquiry, and save/load:

- the old Silas Memory persists;
- quiet-reroute evidence persists;
- Willow evidence persists;
- Valerius inquiry evidence persists;
- fallback topic remains available;
- **A Debt He Still Counts** becomes available;
- the contradicted callback remains unavailable.

Selecting the reinforced callback through ordinary Silas Dialogue UI:

- records `silas_exp_old_silence_repaid`;
- unlocks `quest_m15_follow_hidden_chain`;
- leaves the old Silas Memory present.

The test then accepts **Follow the Hidden Chain** through the ordinary Quest UI, moves through ordinary player location state to the Merchant District, resolves the quest through the normal resolution UI, and records:

`silas_exp_hidden_chain_verified`

The old Memory remains present afterward.

**Reinforced result: PASS.**

The old relationship history therefore produces materially different later gameplay access rather than merely alternate flavor text.

## 12. Contradicted-history result

Historical setup contains:

- the old Silas M12 landmark and Memory;
- qualified later Silas/Valerius history;
- `silas_exp_aftermath_public_crackdown` as contradictory M14 evidence.

After unrelated Willow interaction, late Valerius inquiry, and save/load:

- the old Silas Memory persists;
- the public-crackdown Experience persists;
- Willow evidence persists;
- fallback remains available;
- **A Debt Remembered, Not Renewed** becomes available;
- **A Debt He Still Counts** remains unavailable.

Selecting the contradicted callback through ordinary Silas Dialogue UI records:

`silas_exp_old_silence_reinterpreted`

The test verifies the authored current-state change relative to the pre-callback profile:

- Trust `-1`;
- Understanding `+6`;
- Shared Meaning `+4`;
- Reliance `-2`.

The hidden-chain quest remains unavailable, while Valerius's default investigation remains available.

Both the old Silas Memory and the later public-crackdown Experience remain present after the callback.

**Contradicted result: PASS.**

The system therefore does not require historical erasure or automatic reconciliation into a single approval score. The player can have once demonstrated restraint and later violated a related expectation; both facts remain causally meaningful.

## 13. Condition-language / architecture result

M15 succeeded using only existing positive evidence contracts:

- `requiredExperienceIds`;
- `anyOfExperienceIds`;
- `repeatable: false` inherited from the separately qualified M14 correctness repair.

No M15 change was made to generic runtime behavior.

The candidate adds no:

- `excludedExperienceIds`;
- `forbiddenMemoryIds`;
- generic `NOT` or condition AST/DSL;
- shadow story/Relationship boolean;
- NPC-ID generic branch;
- new Relationship dimension;
- new Connection tier;
- new save schema;
- new quest condition language.

The dedicated architecture audit verifies representative generic Relationship, NPC, Quest, game-event, and save files contain no M15 identifiers.

This is another **negative abstraction result**: the evidence does not justify a generalized historical-condition language for this bounded use case.

## 14. Implementation scope

Compared with corrected baseline `76569543fa12e318e61db0aed8f7355048cb3dc0`, the first complete behavioral candidate changed exactly eight intended files:

- `.github/workflows/build-validation.yml`;
- `public/data/dialogues.json`;
- `public/data/npcs.json`;
- `public/data/quests.json`;
- `public/data/relationships/silas.json`;
- `public/data/relationships/valerius.json`;
- `specification/Technical/M15LongHorizonRelationshipCallbackQualification.md`;
- `src/features/Relationships/state/RelationshipM15LongHorizonCallback.test.tsx`.

No generic runtime behavioral file differed from the corrected baseline.

## 15. First complete behavioral candidate

Candidate SHA:

`7f3baf5cba5fba1d37d5abc8684351a3f5fd52f6`

Candidate tree:

`7e59d578110fe7f393bccadd8fed19e13a40ffa5`

Compared with corrected baseline:

- 8 commits ahead;
- exactly 8 intended changed files;
- no generic runtime behavior changes.

Build Validation #165 (`34107453093`), job `101695632462`: **PASS**

- dependency installation: PASS;
- TypeScript: PASS;
- accumulated M4-M14 Relationship / Trait discovery / save migration / narrative qualification: PASS;
- M14 dialogue-exclusivity regression: PASS;
- dedicated M15 long-horizon callback qualification: PASS;
- production build: PASS.

No implementation repair cycle was required after the first complete M15 v2 behavioral candidate entered CI.

## 16. Acceptance criteria

- [x] corrected exact baseline frozen;
- [x] fresh v2 branch created from corrected `main`;
- [x] v1 STOP evidence preserved rather than rewritten;
- [x] v2 preregistration committed before production behavior changes;
- [x] repaired M14 policy-exclusivity prerequisite reverified;
- [x] one old Silas landmark reused;
- [x] reinforcing later history exercised;
- [x] contradictory later history exercised;
- [x] control history lacks old landmark;
- [x] unrelated NPC Relationship evidence occurs between historical setup and callback;
- [x] additional Relationship state changes before callback;
- [x] save/load occurs before callback;
- [x] old Silas Memory survives save/load;
- [x] old Silas Memory survives later contradictory evidence;
- [x] contradictory M14 evidence remains present;
- [x] callback interpretation composes old + recent evidence;
- [x] control history cannot invoke privileged callback through UI or direct thunk;
- [x] reinforced history receives materially different later gameplay access;
- [x] contradicted history does not receive the same privileged access;
- [x] new M15 callbacks produce new Relationship evidence;
- [x] no shadow story/Relationship boolean;
- [x] no NPC-ID generic runtime branch;
- [x] no new Relationship dimension or Connection tier;
- [x] no new save schema solely for M15;
- [x] no generalized condition language from this one case;
- [x] accumulated M4-M14 + exclusivity qualification remains green;
- [x] dedicated M15 qualification passes;
- [x] TypeScript passes;
- [x] production build passes;
- [x] first complete behavioral candidate SHA/tree recorded;
- [x] actual results/evidence ceiling recorded before merge;
- [ ] documentation-complete exact final head passes Build Validation;
- [ ] merge uses exact qualified head with expected-head guard.

The two remaining unchecked items are intentionally external to this results commit: this document update changes the PR head, so the documentation-complete candidate must receive its own exact-head Build Validation before merge.

## 17. Verdict

**PASS, contingent only on exact-final-head requalification of this documentation-complete candidate.**

The bounded M15 hypothesis survived without a new generic narrative-history abstraction:

> Old Relationship evidence remains causally relevant after later reinforcing or contradictory Relationship history, unrelated NPC Relationship activity, and save/load. Old and newer evidence can jointly determine later story availability and materially different gameplay access while both historical facts remain durable.

The strongest conceptual result is:

> **The past is not replaced by the present. The present changes what the past means now.**

M13 showed that Relationship state can cause later story.
M14 showed that one event can mean different things to several relationships.
M15 now shows that a relationship can accumulate history whose earlier and later evidence remain jointly causal.

## 18. Evidence ceiling

M15 does **not** establish:

- whole-campaign continuity;
- automatic Memory aging, decay, or reinterpretation algorithms;
- arbitrary historical reasoning;
- NPC belief simulation;
- emergent/procedural storytelling;
- a generalized temporal query language;
- human satisfaction, pacing, emotional quality, or comprehensibility;
- campaign-scale branching scalability.

"Long horizon" here means substantial causal distance in authored game history, including intervening relationship events and a persistence boundary. It is not a claim about real-world play duration.

The maximum qualified claim remains:

> A bounded production relationship history can remain causally relevant across intervening events, additional reinforcing or contradictory relationship evidence, unrelated NPC activity, and save/load; old and newer evidence can jointly determine later story availability and differentiated gameplay consequence without duplicate story flags or NPC-specific generic runtime branches.

## 19. Merge boundary

PR #38 must remain draft until the documentation-complete exact head passes Build Validation.

If that final gate passes:

1. record the exact final SHA/tree and run in PR metadata;
2. mark the PR ready;
3. verify the head has not moved and the PR is mergeable;
4. merge only with an expected-head SHA guard;
5. verify `main`, integrated tree, and merge parents;
6. separately check whether GitHub created a post-merge Build Validation before claiming one.

Per owner instruction, Gemini is not merge authority.