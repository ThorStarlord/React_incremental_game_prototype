# Adaptive Adventure Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the seven agreed P0–P6 presentation slices of the Adaptive Adventure Workspace over Campaign One's existing canonical state, with an Adventure-first beginning and truthful inspectable progression.

**Architecture:** Add compact read-only projection/presentation components and reuse current Redux selectors, MUI and React Router. Keep gameplay, travel, memories, Traits, Copy eligibility, save schema and release authority unchanged; no second navigation or decision engine.

**Tech Stack:** React 18, TypeScript, MUI, Redux Toolkit, React Router, existing CRA toolchain.

**Spec:** `docs/superpowers/specs/2026-10-26-adaptive-adventure-workspace-design.md`

**Execution context:** GitHub connector has source read/write; the session container cannot reach GitHub or clone the project. Current owner policy in `AGENTS.md` waives unit/browser/evidence prerequisites for **ordinary PR merge** but NOT release qualification. Source-only review of the change is possible, local build/runtime/Playwright is **NOT EXECUTED**. Do not claim executed tests or a qualified UI. Future independent checks should run before a protected release.

## Global constraints

- No new gameplay root, no new save/schema authority, no new chapter or generic system.
- No fictional co-presence: confirmed NPC here / confirmed elsewhere / unanchored story contact must stay distinct.
- Never reveal future/undiscovered content, fabricate Memories or combine Dialogue, Knowledge, Faction and World State.
- Unlocked Trait slot expression is different from permanent assimilation. Doctrine actions retain existing preview/confirmation.
- Player routine familiarity is distinct from Copy eligibility. One-shot work, standing orders and unresolved exceptions remain separate.
- Keep current dashboard/NPC/trait/Copy routes. The AppRouter stays the only page authority.
- No use of synthetic results or deterministic scripts as evidence of human comprehension.
- Original `v1.0.0` tag and independent release qualifications are protected.
- New presentation should remain accessible on narrow screens, keyboard and reduced motion.

## Review Focus

1. Missing/unknown player location: keep existing safe fallback and no inferred roads/encounters.
2. Prologue before/after Willow dialogue: highlight only a canonical legal action; no scripted teleport or automatic Memory.
3. Undiscovered NPC and authored story contact with no world anchor: neither becomes a mapped visitor.
4. Trait discovered but not assimilated, or assimilated but suppressed: visual status and active effect must remain distinct.
5. Copy exceptions acknowledged but unresolved, plus missing mastery/Copy eligibility: no false completion or dispatch authority.

---

### Task 0 — Reconcile baseline and source ownership

**Files:** `docs/ui/AdaptiveAdventureWorkspaceImplementation.md` (new)

**Interfaces:** Source identity + component/authority map for all subsequent tasks.

- [ ] Read `AGENTS.md`, `STATUS.md`, `docs/CURRENT.md`, the approved spec and current `main`.
- [ ] Trace existing CurrentMoment, Player Insight, Trait System, Copy, Travel, World State and navigation presenters.
- [ ] Record evidence ceiling and the safe source-only construction/review boundary.

**Review:** Named files/current contracts match direct GitHub source. Do not confuse branch source inspection with build/test evidence.

### Task 1 — Adventure first-session hierarchy

**Files:** `src/pages/DashboardPage.tsx`; `src/features/Story/components/CurrentMomentPanel.tsx`.

**Interfaces:** Consume `selectCurrentMoment` and existing `CurrentMomentAction` links; produce one primary actionable lead plus subordinate available actions and contextual inspect entry.

- [ ] Implement Glance / Decide / Inspect sections, preserving existing `current-moment`, `district-aftercare`, `story-contacts` semantic surfaces.
- [ ] Keep first Willow travel action as a link to actual adjacent `TravelPanel` rather than dispatching direct travel.
- [ ] Expose the Chronicle separately from advanced stats; use existing legal navigation paths.

**Verification later:** fresh City Center -> Gate -> Woods -> Willow ordinary-UI journey, empty/missing choices, timed quest urgency, DOM focus and mobile action visibility.

### Task 2 — Relationship constellation and consequence Chronicle

**Files:** Create `src/features/Story/RelationshipConstellationSelectors.ts`, `src/features/Story/components/RelationshipConstellationPanel.tsx`, `src/features/Story/components/ChronicleOfConsequencesPanel.tsx`; modify `src/pages/NPCsPage.tsx` and `src/pages/DashboardPage.tsx`.

**Interfaces:** A memoized `selectKnownRelationshipConstellation(state: RootState)` over discovered NPCs and player-visible memories; reuse `selectCausalJournalEntries`, `selectRecentRecordedDialogueExperiences`, `selectRecordedDistrictRequests`.

- [ ] Display only known people; relate them only to actual visible history/discovered learned pattern provenance.
- [ ] Display Memories, recorded dialogue and district requests as explicitly different kinds of information.
- [ ] Allow existing NPC detail links; no NPC positional inference or time synthesis across unrelated evidence.

**Verification later:** new save empty state, known NPC without Memory, repeated dialogue, records from other NPCs and unanchored contacts.

### Task 3 — Trait expression Loom

**Files:** Create `src/features/Traits/components/ui/TraitLoomOverview.tsx`; modify `TraitSystemTabs.tsx`.

**Interfaces:** Consume current `traitSlots`, `permanentTraits`, `discoveredTraits`, `allTraits` props; leave current Doctrine/slot actions untouched.

- [ ] Display actual unlocked and locked slots and named expressed patterns.
- [ ] Distinguish assimilated/suppressed from temporarily expressed discovered patterns.
- [ ] Use current Doctrine tab for authoritative preview and change; no new slot logic or costs.

**Verification later:** empty slots, saved owned-but-suppressed Traits, temporarily expressed discoveries, Doctrine switch and migration fixture.

### Task 4 — Mastery-to-delegation Copy operations

**Files:** Create `src/features/Copy/components/ui/CopyOperationsOverview.tsx`; modify `src/pages/CopiesPage.tsx`.

**Interfaces:** Consume existing `selectMasteredRoutines`, `selectOpenCopyExceptions`, and Copy count; keep CopyCard and CopyDetailPanel as action owners.

- [ ] Explain learned routine provenance, Copy-specific readiness, player authorization and exception handback.
- [ ] Prioritize unresolved exceptions without making acknowledgements equivalent to solutions.
- [ ] Do not add task-chain/standing-order planning or bulk actions.

**Verification later:** no Copy/no familiarity, mastered but Copy-ineligible, standing order, unresolved acknowledged exception.

### Task 5 — Known roads and recorded world responsiveness

**Files:** Create `src/features/Exploration/components/KnownRoadsPanel.tsx`; modify `src/features/Exploration/components/TravelPanel.tsx`, `src/features/Story/CurrentMomentSelectors.ts`, `src/features/Story/components/LocationVignette.tsx`, `CurrentMomentPanel.tsx`.

**Interfaces:** `getConnectedLocationDefinitions` and `getMissingLocationExperienceIds` own adjacency/gates; `state.worldState.regions[MERCHANT_DISTRICT_LOCATION_ID]` owns watch/trade conditions.

- [ ] Render read-only adjacent road overview and actual access locks; TravelPanel retains dispatch authority.
- [ ] Add a conditional Merchant District vignette and legible recorded watch/trade presentation.
- [ ] No new NPC schedules, routes, shops, patrol encounters, or objective World State mutations.

**Verification later:** forged road rejection, locked Chrono-Crypt, normal/heavy watch and normal/strong trade, legacy location alias.

### Task 6 — Unified shell and truthful closure

**Files:** `src/layout/constants/navigationConfig.ts`, `src/pages/DashboardPage.tsx`, `docs/ui/AdaptiveAdventureWorkspaceImplementation.md`, `docs/CURRENT.md`, `STATUS.md`, `HANDOFF.md`.

**Interfaces:** Keep route key `dashboard` and existing routes; present the label as Adventure; preserve global timers, Copy attention and actual save/menu controls.

- [ ] Reconcile readable hierarchy, semantic labels, tiny-screen presentation and non-interactive visual effects.
- [ ] Inspect full source diff for broken imports, shadow-state assumptions, secret/new mechanics, and ungrounded claims.
- [ ] Open, source-review and merge owner-directed PR under `AGENTS.md`, if mergeable; mark `MERGED / UNTESTED / UNQUALIFIED` if no build/browser verification exists.
- [ ] Recheck main SHA and entry documentation; do not claim unexecuted tests or release qualification.

**Protected release verification, deferred (not ordinary PR gate):** `npm run build`, TypeScript/RTL, accessibility, Chrome/Firefox full Campaign One and save/import/export, keyboard/mobile checks, source-candidate exact-head qualification before any new release. Human preferences require actual external first-player sessions.

## Current owner decisions

- Select integrated, reversible vertical slices; do not build all fifteen speculative UI ideas.
- Presentation changes use existing canonical Redux state and existing gameplay actions.
- Preserve both advanced pages and situational entry. Avoid an all-encompassing dashboard rewrite.
- User explicitly selected implementation and autonomous ordinary merge. No owner question is required for bounded local UI choice.
