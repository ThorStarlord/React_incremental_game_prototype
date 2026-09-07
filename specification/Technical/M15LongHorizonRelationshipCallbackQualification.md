# M15 — Long-Horizon Relationship Callback Qualification

**Status:** preregistered v2; production implementation not yet started  
**Baseline:** corrected post-M14 `main` at `76569543fa12e318e61db0aed8f7355048cb3dc0`  
**Baseline tree:** `91805bb69d89536142e63dbb3d44cf7fd1d104a1`  
**Branch:** `feature/m15-long-horizon-relationship-callbacks-v2`

## 1. Experimental lineage

The first M15 attempt was preregistered on `feature/m15-long-horizon-relationship-callbacks` before production behavior changed.

Its pre-implementation gate found a pre-existing M14 correctness defect: the M14 council and repair-ledger policy dialogues were replayable, so mutually exclusive response-specific Relationship Experiences could accumulate in one playthrough.

That first M15 attempt stopped and preserved its result rather than working around the defect.

The defect was repaired separately in PR #37 through a qualified generic `repeatable: false` Dialogue contract using existing `NPC.completedDialogues` persistence. The exact repair head `7b21378fe54495793b46f5fe0746e4e7d0aa6078` passed Build Validation #164 and merged as `76569543fa12e318e61db0aed8f7355048cb3dc0` with identical integrated tree `91805bb69d89536142e63dbb3d44cf7fd1d104a1`.

M15 v2 therefore restarts from corrected `main`. The stopped v1 branch remains historical failure evidence and is not rewritten.

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
M15 now tests temporal composition.

## 3. Primary hypothesis

The existing generic contracts are sufficient:

- durable Relationship Experiences and Memories retain old history;
- M14 policy Experiences are now mutually exclusive when produced through ordinary one-shot production dialogue;
- Dialogue `requiredExperienceIds` and `anyOfExperienceIds` can consume positive historical evidence;
- Dialogue `repeatable: false` can mark new landmark/callback topics as one-shot without a new story-state domain;
- ordinary Dialogue effects can record new Relationship evidence and unlock quests;
- ordinary Quest/location/resolution contracts can carry history-conditioned access into gameplay;
- existing save/load preserves all causal layers;
- no negative-condition DSL, shadow boolean, new Relationship dimension, new Connection tier, or NPC-specific generic branch is necessary.

## 4. Counter-hypotheses / stop conditions

Stop and preserve the finding if M15 requires:

- `silasRemembersSecret`, `silasWillTestify`, `silasTrustRestored`, `oldDebtActive`, `ledgerRouteUnlocked`, or equivalent persistent shadow state;
- `if (npcId === 'npc_rogue_silas')` or any M15-specific branch in generic runtime;
- deletion, invalidation, or rewriting of `silas_memory_secret_neither_sold` to represent later contradiction;
- Affinity or legacy `connectionDepth` as a proxy for landmark history;
- a new Relationship dimension or Connection tier solely for M15;
- a save-schema change solely for M15;
- generalized `NOT` / excluded-Experience / boolean condition syntax from this one authoring case;
- direct Relationship Experience injection as the principal route for new M15 behavior;
- UI-only gating that the interaction thunk does not also enforce;
- evidence that the repaired M14 council can still accumulate a second policy outcome through the qualified production UI/thunk path.

A clean FAIL is evidence and must not be normalized away.

## 5. Re-run prerequisite gate

Before relying on M14 policy histories in the principal M15 tests, the dedicated M15 qualification must confirm the corrected production contract:

- `valerius_m14_aftermath_council.repeatable === false`;
- after one valid council response is processed, a direct attempt to process a different response is rejected;
- no second policy Experience is recorded.

This is a verification of the merged prerequisite repair, not a new M15 abstraction.

## 6. Historical evidence under test

### Old landmark

Silas M12:

- Experience: `silas_exp_secret_neither_sold`
- Memory: `silas_memory_secret_neither_sold`
- title: **The Secret Neither Sold**

This is the old landmark whose later causal relevance M15 tests.

### Reinforcing M14 evidence

One of:

- `silas_exp_aftermath_protect_source` — **The Source You Left Alive**;
- `silas_exp_aftermath_quiet_reroute` — **The Pattern You Made Worth Less**.

### Contradictory M14 evidence

- `silas_exp_aftermath_public_crackdown` — **The Source You Burned**.

The contradiction is semantic rather than historical deletion: the old Memory remains true while later Trust/Reliance damage also remains true.

## 7. Production story slice — A Debt That Survived the Fire

Much later, Captain Valerius receives a forged broker ledger that appears to prove the player sold Watch information.

The accusation is credible enough that Valerius cannot dismiss it. His already-qualified history of delegated judgment allows an investigation rather than immediate condemnation.

The crisis is deliberately independent of Silas history: old Silas history changes what assistance becomes available, not whether the crisis can occur.

## 8. Valerius late inquiry

Planned topic:

`valerius_m15_forged_ledger_inquiry`

Planned gate:

`requiredExperienceIds: ["valerius_exp_merchant_leak_broken"]`

The topic is a one-shot authored event (`repeatable: false`).

Planned response:

`investigate`

Planned effects:

- record `valerius_exp_forged_ledger_inquiry`;
- unlock `quest_m15_verify_forged_ledger`.

Frozen Relationship vector for `valerius_exp_forged_ledger_inquiry`:

- Trust `+2`
- Understanding `+4`
- Shared Meaning `+2`
- Reliance `+2`
- Reciprocity `+2`
- Connection Progress `+6`

Interpretation target:

> Valerius treats contradictory evidence as grounds for disciplined inquiry rather than immediate judgment because prior delegated judgment proved that appearances deserve verification when the stakes are high.

## 9. Three history routes

### Route A — Control

The control reaches the Valerius inquiry but deliberately lacks:

`silas_exp_secret_neither_sold`

Expected Silas state after save/load:

- fallback topic available;
- reinforced callback unavailable;
- contradicted callback unavailable;
- direct thunk attempt to invoke either privileged callback rejected by Relationship evidence gates;
- hidden-chain quest unavailable.

Planned fallback topic:

`silas_m15_brokers_price`

It may explain how forged ledgers circulate but grants no privileged broker-chain access.

### Route B — Reinforced history

Required evidence:

```text
valerius_exp_forged_ledger_inquiry
+ silas_exp_secret_neither_sold
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

The topic is one-shot (`repeatable: false`).

Planned response `risk_chain` records:

`silas_exp_old_silence_repaid`

Frozen vector:

- Affinity `+2`
- Trust `+6`
- Understanding `+4`
- Shared Meaning `+7`
- Reliance `+4`
- Vulnerability `+3`
- Reciprocity `+6`
- Connection Progress `+8`

The response unlocks:

`quest_m15_follow_hidden_chain`

Meaning target:

> Silas treats the old mutual restraint as still creditworthy because later conduct reinforced it. He risks access to a broker chain rather than merely selling generic information.

### Route C — Contradicted history

Required evidence:

```text
valerius_exp_forged_ledger_inquiry
+ silas_exp_secret_neither_sold
+ silas_exp_aftermath_public_crackdown
```

Planned topic:

`silas_m15_debt_not_renewed`

The topic is one-shot (`repeatable: false`).

Planned response `confirm_limit` records:

`silas_exp_old_silence_reinterpreted`

Frozen vector:

- Trust `-1`
- Understanding `+6`
- Shared Meaning `+4`
- Reliance `-2`
- Vulnerability `+1`
- Reciprocity `+2`
- Connection Progress `+5`

It does **not** unlock `quest_m15_follow_hidden_chain`.

Meaning target:

> Silas remembers that the player once refused to sell his secret and treats that historical fact as still true. He also remembers that the player later burned a source exposed under expectations of restraint. He will confirm the old fact or explain the forgery, but he will not expose another channel.

Core invariant:

```text
old Memory survives
!= Trust restored
!= same future access
```

## 10. Memory-history invariant

M15 must not delete, invalidate, or overwrite:

`silas_memory_secret_neither_sold`

when `silas_exp_aftermath_public_crackdown` exists.

Both facts remain durable:

```text
The Secret Neither Sold
AND
The Source You Burned
```

The callback expresses current interpretation of both facts rather than mutating historical truth.

No new M15 Memory is required for this proof.

## 11. Unrelated intervening content

The principal reinforced and contradicted paths must perform at least one ordinary production Relationship interaction with another NPC after historical Silas/M14 setup and before the late Silas callback.

Preferred content:

- Elder Willow `elder_willow_greeting` / **She Saw Through the Question**;
- response `respect`, producing `willow_exp_first_question_admit` and the existing displayed continuation evidence.

This Willow evidence is not a Silas callback prerequisite. It exists solely to prove that another relationship can accumulate in the same save while old Silas history remains causally available.

## 12. Save/load boundary

Primary save occurs after:

- old Silas landmark exists where applicable;
- reinforcing or contradictory M14 evidence exists where applicable;
- unrelated Willow production evidence has been created;
- `valerius_exp_forged_ledger_inquiry` has been created and default quest unlocked;

but before the Silas M15 callback is selected.

Use existing:

`createSave -> loadSavedGameWithMigration -> replaceState`

After load, verify every historical layer before invoking Silas.

No M15 save schema is permitted absent an independently discovered persistence defect.

## 13. Gameplay consequence

### Default investigation

Quest:

`quest_m15_verify_forged_ledger`

- giver: Valerius;
- use existing Quest contracts;
- preferred objective: ordinary `REACH_LOCATION` at an existing production location;
- one ordinary resolution option;
- available regardless of special Silas history because Valerius inquiry unlocks it.

The default route provides a valid investigation but no hidden broker-chain access.

### Reinforced alternate investigation

Quest:

`quest_m15_follow_hidden_chain`

- giver: Silas;
- unlocked only by `silas_m15_debt_still_counts` response `risk_chain`;
- use existing Quest/location/resolution contracts.

Resolution records:

`silas_exp_hidden_chain_verified`

Frozen vector:

- Affinity `+1`
- Trust `+3`
- Understanding `+3`
- Shared Meaning `+4`
- Reliance `+4`
- Vulnerability `+2`
- Reciprocity `+3`
- Connection Progress `+6`

The contradicted route must not receive this quest or Experience.

## 14. Condition-language policy

M15 must first use only existing positive evidence gates:

- `requiredExperienceIds`;
- `anyOfExperienceIds`.

Do not add from this one authoring case:

- `excludedExperienceIds`;
- `forbiddenMemoryIds`;
- generic `NOT`;
- boolean condition AST/DSL;
- arbitrary expression language.

Fallback and special positive-evidence topics may coexist. The special callback represents additional history-conditioned opportunity rather than requiring the fallback to disappear.

### Rule of Two

A generic negative/advanced condition capability is justified only if two independently authored production situations naturally require the same missing semantic capability.

## 15. Expected implementation scope

Expected production changes:

- `public/data/dialogues.json`;
- `public/data/npcs.json`;
- `public/data/quests.json`;
- `public/data/relationships/silas.json`;
- `public/data/relationships/valerius.json`;
- `src/features/Relationships/state/RelationshipM15LongHorizonCallback.test.tsx`;
- `.github/workflows/build-validation.yml`;
- this qualification document's later results section.

Expected generic-runtime behavioral changes: **none**.

If implementation evidence requires more, record the reason before changing generic runtime.

## 16. Principal dedicated qualification

Create:

`src/features/Relationships/state/RelationshipM15LongHorizonCallback.test.tsx`

At minimum:

### Test A — production authoring / architecture / repaired prerequisite

Verify:

- merged M14 council remains `repeatable: false`;
- one M14 council response blocks a later different response;
- exact M15 evidence gates and quest wiring;
- no generalized negative-condition field/DSL added;
- no M15 identifier appears in generic Relationship/NPC/Quest/game-event/save runtime;
- no new Relationship dimension, Connection tier, or save schema is introduced.

### Test B — control history

- initialize production runtime;
- create required Valerius history but omit `silas_exp_secret_neither_sold`;
- perform unrelated Willow production Relationship content;
- trigger Valerius inquiry through ordinary production UI;
- save/load before Silas callback;
- verify fallback available;
- verify reinforced/contradicted callbacks unavailable;
- directly invoke privileged callback thunk and expect evidence-gate rejection;
- verify hidden-chain quest unavailable.

### Test C — reinforced history

- use independently qualified M12-M14 evidence as historical setup;
- old Silas landmark present;
- one reinforcing M14 policy Experience present;
- perform unrelated Willow production content;
- trigger Valerius inquiry through ordinary production UI;
- save/load;
- verify old Silas Memory, reinforcing evidence, Willow evidence, and Valerius inquiry all persist;
- select reinforced callback through ordinary Silas Dialogue UI;
- verify `silas_exp_old_silence_repaid`;
- verify hidden-chain quest unlock;
- complete hidden-chain quest through ordinary Quest/location/resolution UI;
- verify `silas_exp_hidden_chain_verified`;
- verify old Silas Memory remains present.

### Test D — contradicted history

- old Silas landmark present;
- `silas_exp_aftermath_public_crackdown` present;
- perform unrelated Willow content;
- trigger Valerius inquiry;
- save/load;
- verify old Memory + contradictory Experience both survive;
- select contradicted callback through ordinary Silas Dialogue UI;
- verify `silas_exp_old_silence_reinterpreted`;
- verify hidden-chain quest is not unlocked;
- verify Trust is not falsely restored while Understanding/Shared Meaning change as authored;
- verify old Memory remains present.

Historical M12-M14 evidence may be seeded directly only because those routes were independently qualified earlier. Every new M15 Experience and quest consequence must be exercised through ordinary production paths.

## 17. Acceptance criteria

- [x] corrected exact baseline frozen;
- [x] fresh v2 branch created from corrected `main`;
- [x] v1 STOP evidence preserved rather than rewritten;
- [x] v2 preregistration committed before production behavior changes;
- [ ] repaired M14 policy-exclusivity prerequisite reverified;
- [ ] one old Silas landmark reused;
- [ ] reinforcing later history exercised;
- [ ] contradictory later history exercised;
- [ ] control history lacks old landmark;
- [ ] unrelated NPC Relationship evidence occurs between historical setup and callback;
- [ ] additional Relationship state changes before callback;
- [ ] save/load occurs before callback;
- [ ] old Silas Memory survives save/load;
- [ ] old Silas Memory survives later contradictory evidence;
- [ ] contradictory M14 evidence remains present;
- [ ] callback interpretation composes old + recent evidence;
- [ ] control history cannot invoke privileged callback through UI or direct thunk;
- [ ] reinforced history receives materially different later gameplay access;
- [ ] contradicted history does not receive the same privileged access;
- [ ] new M15 callbacks produce new Relationship evidence;
- [ ] no shadow story/Relationship boolean;
- [ ] no NPC-ID generic runtime branch;
- [ ] no new Relationship dimension or Connection tier;
- [ ] no new save schema solely for M15;
- [ ] no generalized condition language from this one case;
- [ ] accumulated M4-M14 + exclusivity qualification remains green;
- [ ] dedicated M15 qualification passes;
- [ ] TypeScript passes;
- [ ] production build passes;
- [ ] first complete behavioral candidate SHA/tree recorded;
- [ ] actual results/evidence ceiling recorded before merge;
- [ ] documentation-complete exact final head passes Build Validation;
- [ ] merge uses exact qualified head with expected-head guard.

## 18. Evidence ceiling

Even a PASS establishes only:

> A bounded production relationship history can remain causally relevant across intervening events, additional reinforcing or contradictory relationship evidence, unrelated NPC activity, and save/load; old and newer evidence can jointly determine later story availability without a duplicate story flag or NPC-specific generic runtime branch.

M15 does not establish:

- whole-campaign continuity;
- automatic Memory aging/decay;
- arbitrary historical reasoning;
- NPC belief simulation;
- emergent/procedural storytelling;
- human satisfaction, pacing, emotional quality, or comprehensibility;
- campaign-scale branching scalability.

"Long horizon" means causal distance in authored game history, not a claim about real-world play duration.

## 19. Merge boundary

Open the eventual PR as draft. Merge only after:

1. first complete behavioral candidate passes Build Validation;
2. actual results are recorded here;
3. documentation-complete final head passes Build Validation again;
4. PR remains mergeable and still points to that exact final SHA.

Merge with an expected-head guard.

Per owner instruction, Gemini is not merge authority.