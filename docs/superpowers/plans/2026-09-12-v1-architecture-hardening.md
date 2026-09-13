# Version 1.0 Architecture Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce the highest-risk v1.0 design debt by separating persisted state from runtime state, enforcing complete save invariants, consolidating canonical rule evaluation, removing the legacy game-save path, and extending release verification across real UI transitions.

**Architecture:** Introduce a deep persistence Module with an explicit `PersistedGameState` Interface and per-domain normalization/validation seams. Keep Redux `RootState` as runtime composition only. Move cross-domain policies behind typed projections and explicit domain events, while keeping the existing Redux store as the composition root. Replace permissive compatibility behavior with deterministic rejection or migration at the load seam.

**Tech Stack:** React 18, TypeScript, Redux Toolkit, Jest/React Testing Library, Playwright, Node validation scripts.

---

### Task 1: Establish the persisted-state Interface

**Files:**
- Create: `src/shared/persistence/PersistedGameState.ts`
- Create: `src/shared/persistence/PersistedGameState.test.ts`
- Modify: `src/shared/utils/saveSchema.ts`
- Modify: `src/shared/utils/saveUtils.ts`

- [ ] Define a persisted-state projection that excludes notifications, loading/error flags, selected UI state, and other runtime-only fields.
- [ ] Add a strict root validator requiring every canonical domain projection.
- [ ] Make save creation serialize the projection, not `RootState`.
- [ ] Make migration return the projection and reconstruct runtime state through an explicit rehydration function.
- [ ] Add tests for missing domains, malformed domain payloads, and exclusion of runtime-only state.

### Task 2: Make state replacement transactional and typed

**Files:**
- Create: `src/shared/persistence/rehydrateGameState.ts`
- Create: `src/shared/persistence/rehydrateGameState.test.ts`
- Modify: `src/app/store.ts`
- Modify: `src/pages/MainMenu/hooks/useGameActions.ts`

- [ ] Replace the unvalidated whole-state replacement path with a typed rehydration result.
- [ ] Reconcile derived state before committing the replacement.
- [ ] Preserve the previous state if offline settlement or required reconciliation fails.
- [ ] Add regression coverage for rejected loads and partially failing reconciliation.

### Task 3: Deepen cross-domain rule Interfaces

**Files:**
- Create: `src/features/NPCs/state/dialogueAvailability.ts`
- Create: `src/features/NPCs/state/dialogueAvailability.test.ts`
- Modify: `src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx`
- Modify: `src/features/NPCs/state/DialogueAvailabilityPresentation.ts`
- Modify: `src/features/Essence/utils/essenceRate.ts`
- Modify: `src/features/Relationships/state/RelationshipSelectors.ts`

- [ ] Expose canonical rule evaluators that accept narrow domain projections rather than `RootState`.
- [ ] Make the UI consume a memoized NPC-facing projection instead of assembling six domain records itself.
- [ ] Remove the partial `RootState` cast from aggregate relationship calculations.
- [ ] Test that presentation and authoritative eligibility agree for all prerequisite classes.

### Task 4: Replace convention-based objective behavior with authored contracts

**Files:**
- Modify: `src/app/listeners/GameEventListeners.ts`
- Modify: relevant quest types and authored quest JSON under `public/data`
- Modify: content validation scripts/tests

- [ ] Require explicit escort destination data.
- [ ] Reject authored escort objectives without a destination during content validation.
- [ ] Remove description parsing from runtime behavior.
- [ ] Add a fixture proving copy changes cannot alter objective semantics.

### Task 5: Remove the legacy game-save surface

**Files:**
- Modify: `src/shared/utils/storage.ts`
- Modify: `src/features/Settings/state/SettingsThunks.ts`
- Modify: imports/tests referring to legacy game save functions

- [ ] Restrict `storage.ts` to settings/layout persistence or remove unused game-save functions.
- [ ] Route any remaining game import/export through `saveUtils.ts` and `saveSchema.ts`.
- [ ] Add a test that legacy game save keys cannot become an alternate load authority.

### Task 6: Expand release qualification at the UI seam

**Files:**
- Modify: `scripts/release-browser-qualification.js`
- Create: `scripts/release-browser-qualification.test.js` or fixture tests as appropriate
- Modify: release qualification documentation

- [ ] Add visible-UI checks for save/load and invalid import handling.
- [ ] Add one representative quest/combat/campaign transition without direct Redux access.
- [ ] Bind browser artifacts to candidate metadata.
- [ ] Preserve the distinction between smoke qualification and human Beta evidence.

### Task 7: Full verification and release documentation

**Files:**
- Modify: `docs/release/KnownDefects.md`
- Modify: `docs/release/ReleaseCandidateResult.md`
- Modify: architecture and release contract documents

- [ ] Run targeted RED/GREEN tests for every new invariant.
- [ ] Run typecheck, lint, complete Jest, build, content validation, browser qualification, and evidence validation.
- [ ] Record any remaining blockers with exact evidence.
- [ ] Do not claim v1.0 if external Beta/CI/deployment evidence remains absent.
