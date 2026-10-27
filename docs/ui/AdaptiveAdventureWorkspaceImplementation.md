# Adaptive Adventure Workspace — P0–P6 Source Integration Record

**Date:** 2026-10-27  
**Status:** SOURCE IMPLEMENTATION ON PR #194 / UNTESTED / UNQUALIFIED / HUMAN-UNVALIDATED  
**Approved design:** `docs/superpowers/specs/2026-10-26-adaptive-adventure-workspace-design.md` (merged PR #193)  
**Implementation plan:** `docs/superpowers/plans/2026-10-27-adaptive-adventure-workspace.md`  
**Baseline:** `main` at `db6e45c10d3cd17edfa6ccf6356c8d2605fab9b7` (2026-10-26), original `v1.0.0` tag unchanged  
**Pull request:** [#194](https://github.com/ThorStarlord/React_incremental_game_prototype/pull/194) — GitHub state is authoritative for actual merge result; do not infer it from this document.

## Purpose and scope decision

The owner delegated implementation of the approved Adaptive Adventure Workspace direction, across P0–P6, without an approval pause. Implemented **bounded presentation slices**, not all fifteen optional divergent ideas, because the owner-approved design explicitly distinguishes possibilities from a compulsory backlog. No new gameplay or save authority was needed. Work stays within current Redux, MUI, React Router, narrative and Trait contracts. This is **ordinary owner-directed source construction**, not a new 1.1 release or a proof of improved player understanding.

## P0 — Current source and authority map

| Presentation domain | Canonical source/actions | New read-only/visual surface |
| --- | --- | --- |
| Adventure choices | `CurrentMomentSelectors.ts`, NPC dialogue/Quest selectors, React Router; legal `TravelPanel` thunks | `CurrentMomentPanel.tsx` single primary action + supporting choices |
| Recorded history | `relationships.memoriesById`, `experiencesById`, `DistrictAftercareProjection` | `ChronicleOfConsequencesPanel.tsx` and existing `PlayerInsightPanel` |
| Known characters | `npcs.discoveredNPCs`, `npcs.npcs`, player-visible Relationship records, Traits metadata | `RelationshipConstellationSelectors.ts`, `RelationshipConstellationPanel.tsx` |
| Trait expression | `Player.permanentTraits`, `traitSlots`, discovered Trait catalogue; existing Expression/Doctrine actions | `TraitLoomOverview.tsx`, mounted by `TraitSystemTabs.tsx` |
| Copy delegation | `Player.routineFamiliarity`, Copy eligibility/action UI, unresolved exceptions | `CopyOperationsOverview.tsx`, mounted by `CopiesPage.tsx` |
| Travel | `LocationDefinitions.ts` adjacency and required Experience IDs, `TravelThunks` | `KnownRoadsPanel.tsx` within `TravelPanel.tsx` |
| District appearance | `state.worldState.regions[location_merchant_district]` | `CurrentMomentSelectors.ts` `districtConditions` and `LocationVignette.tsx` merchant art |
| Navigation/layout | `AppRouter.tsx`, `GameLayout.tsx`, `DashboardPage.tsx`, `navigationConfig.ts` | Existing `/game/dashboard` is labelled Adventure; hash `#chronicle` opens inspector |

The developer tooling available in this session consisted of the connected GitHub source API. The session container could not resolve `github.com`, so an executable checkout and installed project dependencies were unavailable. No user machine commands or external UI/browser sessions were attempted.

## Source changes by phase

### P1 — Adventure and the Elder Willow journey

- `CurrentMomentPanel` now emphasizes **Glance** (current place/situation), **Decide** (one selected legal primary `CurrentMomentAction`, remaining actions separately) and **Inspect** (links to the existing people, Traits, Copy and Chronicle views).
- The primary link uses the existing `action.to`, so Prologue "Find Elder Willow" still reaches `#travel-controls`, not a new teleport/dispatch authority. The actual Travel buttons continue to enforce adjacency.
- `DashboardPage` is titled **Adventure**, the existing `Campaign Overview` copy remains for orientation, and the Player Insight / grouped Chronicle move to a standalone expandable section. The `#chronicle` anchor opens that section using the ordinary router hash, without a second page state system.
- District aftercare, story contacts of unknown position, reference actions, Copy exceptions, timed quests and recent consequences retain their original projections and controls.

### P2 — Earned relationships and Chronicle

- `selectKnownRelationshipConstellation` is memoized over actual discovered NPCs, visible Memories, recorded dialogue, player-known Trait metadata, permanent assimilation and expression slots.
- `RelationshipConstellationPanel` is an opt-in expandable view on the existing NPC list. An NPC record is **not** a claim of present physical location, and a known Trait pattern is not an unearned relationship/Memory.
- `ChronicleOfConsequencesPanel` groups lasting Memories, recorded dialogues and recorded district requests by source domain. It intentionally avoids inventing a single all-domain timestamp or implying that a request to one NPC caused a finished audit/other NPC awareness.

### P3 — Trait Loom

- `TraitLoomOverview` uses actual slot records, catalogue, discovered Trait ids and permanent assimilated ids. Locked, empty, temporarily expressed, assimilated and suppressed states remain distinguishable.
- Canonical slot expression, suppression, Stabilization, Doctrine selection, preview and confirmation remain entirely in existing Trait components/thunks. No new rules, cooldown, costs, proximity gating or Trait save schema are introduced by this UI.
- This UI runs on the previously source-merged but **UNQUALIFIED** universal Trait 1.1 code. It does not qualify that runtime or its v2→v3 migration.

### P4 — Mastery and Copy operations

- `CopyOperationsOverview` shows the conceptual `Learn -> Prepare -> Delegate -> Judge` arc and real personally mastered routine provenance from `selectMasteredRoutines`.
- The overview explicitly says each Copy must separately satisfy role/maturity/loyalty/location/task eligibility. It does **not** count existing Copies as ready for a task.
- The preexisting unresolved exception alert remains before the overview, preserving judgment priority. One-shot/standing command forms, bulk-scoped actions and actual exception resolution remain in existing Copy controls.

### P5 — Place and recorded World State

- `KnownRoadsPanel` is a collapsible read-only map of **adjacent defined** locations and actual `requiredExperienceIds` locks. Only the preexisting `TravelPanel` can dispatch travel; no new travel edges or fast travel are added.
- `CurrentMomentView.districtConditions` carries a current-location-only projection of the region's recorded Watch presence and trade flow.
- The merchant vignette changes abstract, decorative canopy/banner density only when those corresponding world-condition fields are recorded. It shows no new actors, businesses, routes, services, schedules or other world-state authority. Text chips disclose the underlying recorded conditions.

### P6 — Coherence and boundaries

- Existing route ID and URL `dashboard` remain stable; its nav label and tooltip become **Adventure**, with no new route table or layout engine.
- The various panels use existing MUI `Paper`, `Grid`, `Typography`, `Button`, theme palette roles and responsive stacking; expandable presentation avoids replacing advanced pages.
- No external images, new packages, gameplay reducers, persistent state, repository workflows, CI scripts, or original release artifacts were changed.

## Evidence obtained and limits

**Observed through GitHub connector:** current baseline SHA; canonical source paths and signatures; new file content; source diff and changed-file list for PR #194; import paths and selector/consumer contracts inspected manually. The PR/merge state must be obtained from GitHub after integration.

**NOT performed:** `npm install`, TypeScript compilation, production build, RTL/unit tests, interactive browser test, Playwright campaign, first-session eye-tracking/UX tests, accessibility audit, load/import/migration simulation, CI run, or human-player sessions. No PASS, fully working UI, release readiness or direct player preference claim is warranted solely by the source diff.

**Needed for a qualified build:** full TypeScript/build verification, tests for new presentation invariants and legacy UI4 behavior, Chrome/Firefox full-campaign/playback/import/export paths, responsive keyboard/accessibility inspection, and an exact release candidate identity. Human preference and enjoyment still need actual external participants; issue #109 remains a separate outstanding lane. Blind synthetic issue #188 is also not satisfied by the present source-only work.

**PR merge boundary:** the 2026-10-25 `AGENTS.md` owner instruction permits ordinary owner-directed PR integration without waiting for unit/browser/evidence tests, while requiring explicit `UNTESTED / UNQUALIFIED` disclosure. It does **not** waive release/tag qualification or human evidence.

## Open uncertainties and reversible corrections

- **Cognitive load:** even the grouped Chronicle or Trait Loom might overwhelm some players; collapse/relocate panels rather than invent a UI-mode state system.
- **NPC-list layout:** the opt-in relationship section precedes the existing NPC list, with detail navigation unchanged. Actual mobile/scroll/focus behavior needs a browser before claiming smoothness.
- **Trait migration:** the visual summaries assume the current 1.1 source's slot/assimilation semantics; save v3 correctness must be qualified independently.
- **Refresh behavior:** inexpensive selector projections should remain stable across high-frequency ticks; inspect actual render performance before adding caching machinery.
- **No false prerequisites:** a visually highlighted Willow lead must never skip authored conversation or bypass travel. If an encounter is unavailable, it must not appear as a primary action.
- **New visual responsiveness:** decorative market flags/canopies must only represent recorded Watch/trade fields, not newly spawned patrol NPCs or a working trade economy.

## Decision/stop statement

This package implements a bounded retained UI composition because the existing product already contains the state needed for useful new presentation. A wholesale UI rewrite would increase risk; a documentation-only or separate throwaway spike would not create the desired player-facing capability. The **source construction responsibility** is done when PR #194's intended files are present on `main` after an eligible merge. The **technical qualification and human-value claims** remain explicitly open until real evidence exists.
