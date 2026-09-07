# M14 Dialogue Decision Exclusivity Repair

**Status:** preregistered correctness repair; implementation not yet started  
**Baseline:** post-reconciliation `main` at `6eac07a973eb032ccbf4a89fa3ba6fc5003101fb`  
**Baseline tree:** `4615624c08bd2ff4d41b117114c3b65443e09ed6`  
**Trigger:** M15 pre-implementation gate discovered that M14 one-time policy decisions are replayable.

## 1. Defect

Two M14 production dialogues represent mutually exclusive policy decisions:

- `valerius_m14_aftermath_council` — `public_crackdown` / `protect_source` / `quiet_reroute`;
- `gronk_m14_repair_ledger` — `build_for_load` / `restore_visible_order`.

Current production UI keeps any topic in `npc.availableDialogues` visible whenever its positive Relationship evidence gates are satisfied. It does not consult `npc.completedDialogues`.

`processNPCInteractionThunk` likewise does not consult `completedDialogues`; a later call can process the same node with a different response. Relationship idempotency prevents replaying the same Experience `uniqueKey`, but each response has a different Experience id/unique key, so contradictory outcomes from one decision node can accumulate.

This violates the narrative meaning M14 claimed and makes those Experiences unsafe as historical discriminators for M15.

## 2. Repair hypothesis

The repository already has `NPC.completedDialogues`. A small generic opt-in one-shot dialogue contract can repair both independent production cases without NPC-specific branches or save-schema changes.

Proposed semantics:

- Dialogue nodes may declare `repeatable: false`.
- Absence of the field preserves current behavior: dialogue remains repeatable.
- A completed non-repeatable topic is hidden by the production UI.
- The interaction thunk rejects direct attempts to invoke a completed non-repeatable topic.
- A successful valid response to a non-repeatable topic appends its node id to `npc.completedDialogues` exactly once.
- Completion persists automatically through existing NPC save state.
- Both M14 decision topics are marked `repeatable: false`.

This is justified by two independently authored production cases, not by one NPC-specific inconvenience.

## 3. Scope

Expected runtime changes:

- `src/features/NPCs/state/NPCTypes.ts` — authoring type for `repeatable` plus existing evidence-gate fields if needed for type alignment;
- `src/features/NPCs/state/NPCSlice.ts` — bounded `markDialogueCompleted` reducer;
- `src/features/NPCs/state/NPCThunks.ts` — defensive one-shot guard and completion recording;
- `src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx` — hide completed non-repeatable topics;
- `public/data/dialogues.json` — mark only the two M14 decision nodes non-repeatable;
- dedicated qualification test;
- Build Validation wiring;
- Dialogue spec/results documentation.

No Relationship ontology, Quest schema, save schema, Essence/Trait behavior, or NPC-specific generic branch is expected.

## 4. Invariants

1. Existing dialogue is repeatable by default.
2. `repeatable: false` is explicit author intent.
3. A non-repeatable node with authored responses must not be consumed by an invalid/missing response id.
4. Once a valid response succeeds, the dialogue id is recorded exactly once in `completedDialogues`.
5. UI and thunk enforce the same completion rule.
6. Completion blocks later response-specific effects from the same node.
7. Existing Relationship Experience idempotency remains unchanged.
8. Save/load preserves completion through existing NPC state; no schema version change is introduced.
9. No generic runtime condition references M14 IDs or specific NPC IDs.

## 5. Required qualification

### Council decision

Through ordinary production UI:

- seed already-qualified M14 prerequisites;
- select one council response, preferably `public_crackdown`;
- verify the three corresponding NPC Experiences exist;
- verify `valerius_m14_aftermath_council` is in Valerius `completedDialogues`;
- verify the topic disappears from UI;
- directly invoke the thunk with a different response such as `quiet_reroute`;
- expect rejection;
- verify no quiet-reroute Experiences or quest unlock are produced.

### Repair-ledger decision

Through ordinary production UI:

- seed/produce `gronk_exp_quiet_reroute_proven`;
- select `build_for_load`;
- verify Gronk/Valerius build-for-load Experiences;
- verify `gronk_m14_repair_ledger` is completed and disappears;
- directly invoke `restore_visible_order` afterward;
- expect rejection;
- verify restore-visible-order Experiences do not appear.

### Persistence

At least one completed M14 decision must be saved and loaded through the existing save/migration path. After restore:

- `completedDialogues` still contains the decision id;
- production UI keeps the topic hidden;
- direct thunk bypass remains rejected.

### Compatibility

At least one existing dialogue without `repeatable: false` must remain repeatable to prove default behavior is preserved.

## 6. Acceptance criteria

- [x] defect reproduced by code-path audit before implementation;
- [x] two independent production decision nodes require the same missing one-shot semantic;
- [ ] `repeatable: false` authoring contract implemented generically;
- [ ] existing dialogues remain repeatable by default;
- [ ] completed non-repeatable topics are hidden in UI;
- [ ] completed non-repeatable topics are rejected by thunk;
- [ ] invalid/missing response cannot consume a non-repeatable decision;
- [ ] council cannot accumulate a second policy outcome;
- [ ] repair ledger cannot accumulate a second decision outcome;
- [ ] completion survives save/load;
- [ ] no save schema change;
- [ ] no M14/NPC-specific generic runtime branch;
- [ ] accumulated M4-M14 suite remains green;
- [ ] dedicated exclusivity qualification passes;
- [ ] TypeScript passes;
- [ ] production build passes;
- [ ] first behavioral candidate exact SHA/tree recorded;
- [ ] results recorded;
- [ ] documentation-complete final head requalified;
- [ ] merge uses exact qualified head guard.

## 7. Evidence ceiling

A PASS proves only that explicitly authored non-repeatable dialogue decisions execute at most once through the qualified UI/thunk/save paths and that the two M14 decisions therefore have mutually exclusive per-playthrough outcomes.

It does not establish a full conversation-state machine, arbitrary branch rollback, undo, chapter locking, generalized negative conditions, or global event-sourcing.

## 8. Merge boundary

Open as draft. Merge only after the documentation-complete exact head passes Build Validation and the PR still points to that SHA. Gemini is not merge authority.