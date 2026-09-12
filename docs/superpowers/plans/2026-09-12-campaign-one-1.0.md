# Campaign One 1.0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete the smallest releasable Campaign One by removing misleading surfaces, connecting the existing systems into a legal campaign, authoring the missing campaign units and ending, and adding deterministic Alpha/Release qualification plus release hardening.

**Architecture:** Preserve the existing feature-local Redux architecture and canonical domain authorities. Add campaign progression as authored content and thin derived projections over existing Relationship, Trait, Quest, Knowledge, Faction, World State, Copy, and persistence state; do not introduce a generalized ChapterEngine, narrative DSL, or second save system.

**Tech Stack:** React 18, TypeScript 4.9, Redux Toolkit, React Router 6, Material UI, CRA/react-scripts, Jest/React Testing Library, Node validation scripts, Playwright smoke tooling.

**Spec:** `specification/GameCompletionDefinition.md`, `specification/Features/FeatureScopeMatrix.md`, `specification/Technical/GameCompletionRoadmap.md`, `specification/Technical/AlphaCompletionContract.md`, `specification/Technical/BetaCompletionContract.md`, `specification/Technical/ReleaseQualificationContract.md`.

## Global Constraints

- Preserve `SERIAL_BACKPRESSURE_V1` and `FRESH_LOOP_RESET_V1`.
- Keep Relationship, Knowledge, Faction Reputation, World State, Trait, and Copy authority separate.
- Use canonical save/load/import/export; add migrations only when new canonical state requires them.
- Do not add generic Skills, Crafting, Inventory/Equipment economy, ChapterEngine, narrative DSL, Copy planner, or offline narrative authority.
- Every production behavior change gets a failing focused test before implementation.
- Preserve the existing user modification in `scripts/chatgpt-loop.js`.

---

### Task 1: Scope-clean 1.0 player surfaces

**Files:**
- Modify: `src/routes/AppRouter.tsx`
- Modify: `src/layout/constants/navigationConfig.ts`
- Modify: `src/pages/MainMenu/**` only where stale save-management wording is exposed
- Test: add `src/routes/PlayerSurfaceScope.test.tsx`

- [ ] Write tests proving Skills, Crafting, Inventory, and duplicate Saves are absent from primary 1.0 navigation and their routes do not advertise required progression.
- [ ] Run the focused test and observe the expected failure.
- [ ] Remove or redirect the misleading routes and navigation entries while preserving canonical main-menu persistence.
- [ ] Run the focused test and the existing router/UI tests.
- [ ] Run `npm run docs:authority:validate`.

### Task 2: Add the Prologue and fresh-game onboarding contract

**Files:**
- Modify: `public/data/dialogues.json`, `public/data/quests.json`, `public/data/relationships/*.json` as required by the authored opening
- Modify: `src/features/NPCs/state/NPCThunks.ts`, `src/features/Quest/state/QuestThunks.ts`, or existing startup code only where required to surface the opening
- Test: add `src/features/Story/PrologueOnboarding.test.tsx`

- [ ] Write a failing test for clean New Game -> first objective -> first meaningful relationship evidence -> Chapter 1 entry.
- [ ] Run it and confirm it fails because no legal opening path exists.
- [ ] Author the smallest opening using existing NPC, dialogue, quest, and relationship authorities.
- [ ] Verify the opening through production thunks/actions rather than direct state injection.
- [ ] Add save/load coverage at the prologue boundary.

### Task 3: Connect Chapters 1–3 into a legal campaign spine

**Files:**
- Modify: `src/features/Story/ChapterDefinitions.ts`
- Modify: `src/features/Story/ChapterSelectors.ts`
- Modify: `public/data/m25-chapter-content.json` and related authored content
- Modify: `scripts/content-intelligence/**` only to cover the connected production spine
- Test: add `src/features/Story/CampaignSpineReachability.test.ts`

- [ ] Write a failing reachability test for Prologue -> Merchant District -> Archive Inquiry -> Enemies in Phase.
- [ ] Run it and confirm the missing legal transition.
- [ ] Add derived entry/exit requirements using canonical evidence only.
- [ ] Add content graph assertions for the connected spine.
- [ ] Verify positive and rejection paths, including incomplete prior chapter evidence.

### Task 4: Close capability/buildcraft breadth

**Files:**
- Modify: `public/data/traits.json` and relationship bundles only for the smallest missing capability identities
- Modify: `src/features/Traits/**`, `src/features/Story/**`, or feature-specific gameplay files for semantic applications
- Test: add `src/features/Traits/OnePointZeroBuildcraftQualification.test.ts`

- [ ] Audit existing production Traits and identify the minimum missing count against four identities, three anchors, two cross-domain uses, and two viable profiles.
- [ ] Write failing qualification tests for the missing floor.
- [ ] Implement only the required authored Traits and semantic gameplay gates/consequences.
- [ ] Verify provenance remains player-readable and hidden future requirements are not exposed.
- [ ] Verify baseline routes remain legal.

### Task 5: Close earned-delegation breadth

**Files:**
- Modify: `src/features/Copy/CopyTaskDefinitions.ts`
- Modify: `src/features/Copy/CopyRoutineStrategy.ts`
- Modify: `src/features/Copy/state/**` only where persistence or explicit prioritization requires it
- Modify: authored quest/relationship content for the learning contexts
- Test: add `src/features/Copy/OnePointZeroDelegationQualification.test.ts`

- [ ] Audit existing routines and write failing tests for three personally mastered routines across two contexts.
- [ ] Run the tests and confirm the current two-routine implementation fails the floor.
- [ ] Add the smallest third routine and learning path.
- [ ] Verify explicit player assignment, Copy-specific readiness separation, offline bounds, and idempotent settlement.
- [ ] Add save/load coverage for routine familiarity and active delegated work.

### Task 6: Author Chapter 4 — Lattice Under Strain

**Files:**
- Create/modify: authored chapter content under `public/data/`
- Modify: `src/features/Story/ChapterDefinitions.ts`
- Modify: existing domain slices/thunks only for concrete campaign requirements
- Test: add `src/features/Story/Chapter4LatticeQualification.test.ts`

- [ ] Write failing route, consequence, and save-compatible qualification tests.
- [ ] Author multi-anchor, Knowledge, Faction, and World State consequences with two legal responses.
- [ ] Verify legal exit evidence for Chapter 5.

### Task 7: Author Chapter 5 — The Chrono-Crypt

**Files:**
- Modify: authored content under `public/data/`
- Modify: `src/features/Story/ChapterDefinitions.ts`
- Test: add `src/features/Story/Chapter5ChronoCryptQualification.test.ts`

- [ ] Write failing tests for Lyra callbacks, authored location access, capability-sensitive resolution, and counterphase knowledge.
- [ ] Author the smallest two-route or baseline-plus-capability route satisfying the campaign contract.
- [ ] Verify durable Relationship/Memory consequences and legal Chapter 6 entry.

### Task 8: Author Chapter 6 — Network Under Pressure

**Files:**
- Modify: authored content under `public/data/`
- Modify: existing Knowledge/Faction/World State/Copy surfaces only where required
- Test: add `src/features/Story/Chapter6NetworkQualification.test.ts`

- [ ] Write failing tests for three-anchor consumption, information asymmetry, institutional/world consequences, build divergence, and delegated preparation.
- [ ] Author and integrate the chapter through existing authorities.
- [ ] Verify strategic choices remain manual and Chapter 7 entry is legal.

### Task 9: Author Chapter 7 — Counterphase

**Files:**
- Modify: authored content under `public/data/`
- Modify: `src/features/Story/**`
- Test: add `src/features/Story/Chapter7CounterphaseQualification.test.ts`

- [ ] Write failing tests for two finale-preparation profiles and player-owned final commitment.
- [ ] Author preparation routes with causal `Available because` explanations.
- [ ] Verify Copies perform only mastered safe work.

### Task 10: Author Telluric Echo and state-responsive epilogue

**Files:**
- Modify: authored content under `public/data/`
- Modify: `src/features/Story/**`
- Modify: `src/pages/**` for campaign-complete presentation
- Test: add `src/features/Story/FinaleEpilogueQualification.test.ts`

- [ ] Write failing tests for legal finale reachability, two preparation profiles, state consumption, epilogue callbacks, and persisted completion.
- [ ] Author the finale and epilogue using canonical state projections.
- [ ] Add clear campaign-complete UI and save/load coverage.
- [ ] Verify final commitment cannot be resolved by offline settlement or Copy automation.

### Task 11: Implement whole-game Alpha qualification

**Files:**
- Create: `scripts/alpha-validate.js`
- Modify: `package.json`
- Modify: `.github/workflows/build-validation.yml`
- Test: add the aggregate qualification tests under `src/features/Story/`

- [ ] Write failing command-level tests for the Alpha contract.
- [ ] Implement `npm run alpha:validate` using production-equivalent actions and existing content-intelligence tools.
- [ ] Cover fresh start, full spine, divergence, breadth floors, persistence boundaries, debug independence, offline negative proofs, and full content integrity.
- [ ] Add the command to CI.

### Task 12: Complete Content Alpha and release-facing player copy

**Files:**
- Modify: required campaign JSON content
- Modify: `README.md`, `STATUS.md`, `docs/CURRENT.md`, `RUNBOOK.md`, and version/about surfaces as maturity changes
- Test: extend content-intelligence checks for required Campaign One units

- [ ] Identify every required placeholder/diagnostic string on the production path.
- [ ] Replace required content with authored text and remove stale pre-alpha claims only when the corresponding gate is actually reached.
- [ ] Verify all six anchor callbacks and ending variants.

### Task 13: Add Beta and release qualification orchestration

**Files:**
- Create: `scripts/release-validate.js`
- Modify: `package.json`
- Modify: `.github/workflows/build-validation.yml`
- Create: release/qualification result templates as required by contracts
- Test: add script self-tests

- [ ] Write failing tests for command composition and required release metadata.
- [ ] Implement `npm run release:validate` for deterministic gates without fabricating human evidence.
- [ ] Add browser/save/import/offline/content/timing/error-handling checks that are automatable.
- [ ] Add explicit records for human evidence and known defects.

### Task 14: Reliability, accessibility, performance, and release hardening

**Files:**
- Modify: affected UI/components and tests based on observed failures
- Modify: save/import/error surfaces
- Modify: package/version/about/release metadata
- Test: add targeted regression tests for each observed blocker

- [ ] Run the full campaign and synthetic/browser qualification on supported desktop browsers.
- [ ] Fix repeated discoverability, pacing, balance, save/recovery, accessibility, responsiveness, and presentation failures.
- [ ] Verify keyboard/focus/zoom/readability requirements.
- [ ] Set intentional 1.0 metadata only after the release candidate passes.

### Task 15: Final verification and authority reconciliation

**Files:**
- Modify: `STATUS.md`, `docs/CURRENT.md`, `RUNBOOK.md`, and relevant specification result documents

- [ ] Run the full authoritative validation chain.
- [ ] Review the complete diff and preserve unrelated user work.
- [ ] Confirm no blocking defects, required placeholders, or unqualified campaign units remain.
- [ ] Record exact candidate identity and qualification evidence.

