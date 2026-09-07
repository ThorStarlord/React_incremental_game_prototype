# M14 Dialogue Decision Exclusivity Repair

**Status:** results recorded; PASS subject only to exact-final-head requalification  
**Baseline:** post-reconciliation `main` at `6eac07a973eb032ccbf4a89fa3ba6fc5003101fb`  
**Baseline tree:** `4615624c08bd2ff4d41b117114c3b65443e09ed6`  
**Trigger:** M15 pre-implementation gate discovered that M14 one-time policy decisions were replayable.

## 1. Defect

Two M14 production dialogues represent mutually exclusive policy decisions:

- `valerius_m14_aftermath_council` — `public_crackdown` / `protect_source` / `quiet_reroute`;
- `gronk_m14_repair_ledger` — `build_for_load` / `restore_visible_order`.

Before this repair, the production Dialogue UI kept a topic visible whenever it remained in `npc.availableDialogues` and its positive Relationship evidence gates were satisfied. It did not consult `npc.completedDialogues`.

`processNPCInteractionThunk` likewise did not consult `completedDialogues`; a later call could process the same node with a different response. Relationship idempotency prevented replaying the same Experience `uniqueKey`, but each response has a different Experience id/unique key, so contradictory outcomes from one decision node could accumulate.

This violated the narrative meaning M14 claimed and made those Experiences unsafe as historical discriminators for M15.

## 2. Repair hypothesis and result

The repository already had `NPC.completedDialogues`. The repair tested whether a small generic opt-in one-shot dialogue contract could repair both independent production cases without NPC-specific branches or save-schema changes.

Implemented semantics:

- Dialogue nodes may declare `repeatable: false`.
- Absence of the field preserves current behavior: dialogue remains repeatable.
- A non-repeatable node with authored responses requires a valid authored `selectedResponse`; malformed or missing responses fail without consuming the node.
- After successful processing of a valid non-repeatable response, the node id is appended once to the NPC's existing `completedDialogues`.
- The production Dialogue UI hides completed non-repeatable topics.
- `processNPCInteractionThunk` independently rejects direct attempts to invoke a completed non-repeatable topic.
- Completion persists automatically through existing NPC save state.
- Both M14 decision topics are marked `repeatable: false`.

**Result:** the hypothesis survived. Both independently authored M14 decisions now exhibit one-shot semantics through the same generic contract.

## 3. Implemented scope

Runtime/content changes are limited to:

- `src/features/NPCs/state/NPCTypes.ts`
  - types `requiredExperienceIds` / `anyOfExperienceIds` on `DialogueNode`;
  - adds `repeatable?: boolean`.
- `src/features/NPCs/state/NPCSlice.ts`
  - adds bounded `markDialogueCompleted({ npcId, dialogueId })`;
  - de-duplicates completion ids.
- `src/features/NPCs/state/NPCThunks.ts`
  - rejects a completed `repeatable: false` node before effects;
  - rejects invalid/missing authored responses for non-repeatable nodes;
  - records successful one-shot completion after normal effects/continuation processing.
- `src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx`
  - hides completed non-repeatable topics using the same `completedDialogues` state.
- `public/data/dialogues.json`
  - changes by exactly two authoring lines: `repeatable: false` on the two M14 decisions.
- `src/features/Relationships/state/RelationshipM14DialogueExclusivity.test.tsx`
  - dedicated regression qualification.
- `.github/workflows/build-validation.yml`
  - adds the dedicated regression to the accumulated gate.
- `specification/Features/DialogueSystem.md`
  - documents the one-shot contract and error semantics.

No Relationship ontology, Quest schema, save schema, Essence/Trait behavior, or NPC-specific generic branch changed.

## 4. Invariants — result

1. **Existing dialogue remains repeatable by default.** Verified with unannotated `valerius_greeting`, successfully processed twice without completion state.
2. **`repeatable: false` is explicit author intent.** Only the two M14 policy nodes are annotated.
3. **Invalid/missing response cannot consume a one-shot choice.** Dedicated test invokes a non-authored council response and verifies failure, no completion, and no policy Experiences.
4. **Successful one-shot choice records completion exactly once.** Both M14 decisions place their node id in the relevant NPC's `completedDialogues`.
5. **UI and thunk enforce the same rule.** Completed topics disappear from production UI, while direct thunk calls fail with `Dialogue already completed.`
6. **Later response-specific effects are blocked.** A second council/repair response cannot add its mutually exclusive Experiences or quest unlock.
7. **Relationship Experience idempotency is unchanged.** The repair acts at the Dialogue decision boundary.
8. **Save/load preserves completion without a schema change.** Council completion survives `createSave` -> `loadSavedGameWithMigration` -> `replaceState`; UI and thunk remain locked after restore.
9. **Generic runtime contains no M14 or target-NPC branch.** Dedicated architecture audit verifies the modified generic NPC runtime does not contain council/repair ids or Valerius/Gronk ids.

## 5. Dedicated behavioral qualification

Qualification file:

`src/features/Relationships/state/RelationshipM14DialogueExclusivity.test.tsx`

### Council decision

Through ordinary production UI, the test:

1. initializes production NPC/Quest/Relationship data;
2. seeds the already-qualified M12/M13 prerequisites used by M14;
3. selects `public_crackdown` in **The Cost of Closing the Leak**;
4. verifies all three public-crackdown Relationship Experiences;
5. verifies `valerius_m14_aftermath_council` enters Valerius `completedDialogues`;
6. verifies the council topic disappears from production UI;
7. verifies the quiet-reroute quest was not unlocked;
8. saves and reloads the game through the current migration path;
9. verifies completion remains present and the topic remains hidden;
10. directly invokes `processNPCInteractionThunk` with `quiet_reroute`;
11. verifies rejection and absence of all quiet-reroute Experiences/quest unlock.

### Repair-ledger decision

Through ordinary production UI, the test:

1. provides already-qualified Gronk/Valerius history plus `gronk_exp_quiet_reroute_proven` as historical setup;
2. selects `build_for_load` in **The Repair Ledger**;
3. verifies Gronk and Valerius build-for-load Experiences;
4. verifies `gronk_m14_repair_ledger` enters Gronk `completedDialogues` and disappears;
5. directly attempts `restore_visible_order`;
6. verifies rejection and absence of both restore-for-show Experiences.

### Invalid-response safety

A non-authored response to the one-shot council:

- returns `success: false`;
- does not add the council to `completedDialogues`;
- does not record a policy Experience.

### Repeatability compatibility

`valerius_greeting` has no `repeatable: false` annotation. It is processed twice successfully and never enters `completedDialogues`.

## 6. First complete behavioral candidate

Candidate SHA:

`f1645e955df2aed46c187ce99649c4ebacd170c7`

Candidate tree:

`3b4c9f0393acac0a9881e6af6bedecf97b7b0319`

Compared with baseline `6eac07a973eb032ccbf4a89fa3ba6fc5003101fb`:

- 9 commits ahead;
- 9 intended changed files;
- `public/data/dialogues.json`: exactly `+2/-0`, corresponding only to the two `repeatable: false` authoring annotations.

Build Validation #163 (`34105736643`): **PASS**

- dependency installation: PASS;
- TypeScript: PASS;
- accumulated M4-M14 Relationship / Trait discovery / save migration / narrative qualification: PASS;
- dedicated M14 dialogue-exclusivity regression: PASS;
- production build: PASS.

No implementation repair cycle was required after the first complete behavioral candidate entered CI.

## 7. Acceptance criteria

- [x] defect reproduced by code-path audit before implementation;
- [x] two independent production decision nodes require the same missing one-shot semantic;
- [x] `repeatable: false` authoring contract implemented generically;
- [x] existing dialogues remain repeatable by default;
- [x] completed non-repeatable topics are hidden in UI;
- [x] completed non-repeatable topics are rejected by thunk;
- [x] invalid/missing response cannot consume a non-repeatable decision;
- [x] council cannot accumulate a second policy outcome through the qualified UI/thunk path;
- [x] repair ledger cannot accumulate a second decision outcome through the qualified UI/thunk path;
- [x] completion survives save/load;
- [x] no save schema change;
- [x] no M14/NPC-specific generic runtime branch;
- [x] accumulated M4-M14 suite remains green;
- [x] dedicated exclusivity qualification passes;
- [x] TypeScript passes;
- [x] production build passes;
- [x] first behavioral candidate exact SHA/tree recorded;
- [x] results recorded;
- [ ] documentation-complete final head requalified;
- [ ] merge uses exact qualified head guard.

The two remaining unchecked items are intentionally external to this results commit: updating this document changes the PR head, so the documentation-complete SHA must receive its own exact-head Build Validation before merge.

## 8. Verdict

**PASS, contingent only on exact-final-head requalification of this documentation-complete candidate.**

The repair restores the historical semantics M14 intended:

> An explicitly authored non-repeatable production Dialogue decision can record one valid response history, persist that completion, and block mutually exclusive later responses through both UI and direct runtime invocation using the existing NPC persistence domain.

This also clears the specific prerequisite that stopped M15, provided the final repair head is qualified and merged to `main`.

## 9. Evidence ceiling

A PASS proves only that explicitly authored non-repeatable dialogue decisions execute at most once through the qualified UI/thunk/save paths and that the two M14 decisions therefore have mutually exclusive per-playthrough outcomes.

It does not establish:

- a full conversation-state machine;
- arbitrary branch rollback or undo;
- chapter locking;
- generalized negative/boolean conditions;
- automatic conversion of every consequential dialogue to one-shot behavior;
- global event-sourcing;
- campaign-scale narrative consistency.

The repair deliberately leaves all existing unannotated dialogue repeatable.

## 10. Merge boundary

PR #37 must remain draft until this documentation-complete exact head passes Build Validation. Per owner instruction, Gemini is not merge authority.

If the exact-final-head gate passes and the PR remains mergeable on that exact SHA, merge with an expected-head guard. After merge, verify the integrated tree and separately check whether GitHub created a post-merge Build Validation before claiming one.