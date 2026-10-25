# UI Phase 2 — Source, responsibility, and qualification

## 2026-10-24 — Final UI2/UI3 qualification and integration
**Integrated state:** PR #181 merged on main at `41037697019dc7dcb8c9256d37002f230f737c26` (exact qualifying PR head `e1f32ca70d231b0f415032bc50c0ac29d5a08fcf`).
**Final gate:** Build Validation #40090580707 **PASS** across focused UI2/UI3 regressions, all historical/chapter/Copy/Trait/Quest qualification, TypeScript, production build and real browser matrix including mobile and desktop geometry. The ordinary-UI Campaign One artifact reports **PASS** for Distributed Dissipation 105/105 and Fortified Containment 104/104 in **both Chromium and Firefox**, four save/Continue checkpoints and export/import verification per route.
**Intermediate failure:** Earlier head `fa82a862` timed out while accepting Elara's Lost Tome in Firefox Distributed; all other three routes passed. Later exact-head full 2x2 run passed. Preserve as a non-reproduced intermittent reliability observation rather than claiming either a proven product bug or perfect reliability.
**Excluded:** actual human usability comprehension and 1.1 universal Trait save schema. Neither was established by CI; the original `v1.0.0` tag is not amended.
**Disposition:** all authorized UI2/UI3 source work integrated. The 'pending qualification' language lower in this document describes the pre-merge construction interval, not an active blocker.


**Date:** 2026-10-23. **Owner scope:** UI correctness and world-first experience within Campaign One.
**PR:** #181 (`codex/ui2-world-first-experience-20261023`) **merged** into `main` at `41037697019dc7dcb8c9256d37002f230f737c26` after exact-head `e1f32ca70d231b0f415032bc50c0ac29d5a08fcf` Build Validation `40090580707` **PASS**.
**Main baseline:** `4259e94573d189228af5ab71cf29ce7c5ab3c2d5`; original `v1.0.0` unchanged.
**Claim ceiling:** `FEATURE_COMPLETE / HUMAN-UNVALIDATED`, `BETA_PASS=NO`.

## Control decisions

Prefer `situation → actually available action → recorded consequence → progression` over repeating administrative navigation. Keep GameLayout, canonical Redux selectors/thunks, authored world/location/Quest gates, save schema v2 and Chapters 1–7 plus finale. UI only projects what the player already knows. All 1.1 expression migrations, slot semantics and Doctrine previews remain owned by separate PR #178/#180 and are excluded from this 1.0-based PR.

## Selected work and test ownership

| Package | Candidate source | Invariants and required checks |
|---|---|---|
| UI2-A | Current status and this file | Docs authority, no release state mislabel |
| UI2-B | NPCListCard, NPCListView, NPCSelectors | Keyboard CardActionArea, canonical migrated Connection, legacy fallback |
| UI2-C | Redux-driven ThemeProvider, app startup migration, SettingsPage | Live dark/font, persisted/reload/reset; no inert controls |
| UI2-D | QuestPuzzleModal, QuestThunks, QuestsPage | Incorrect answer retains input, Force It confirms known effects, Active & Ready |
| UI2-E | NPCPortrait and NPC list/detail | Offline-safe identity, no broken image URLs |
| UI2-F | Dashboard, GameControlPanel, CurrentMomentPanel | Travel/combat context, optional guidance, advanced statistics |
| UI2-G | CurrentMomentSelectors, NPCDialogueTab, NPC Overview | Available authored choices only; recorded outcome vs Memory truth |
| UI2-H | CopiesPage and CopyCard | Exceptions require judgment; notes/one-shot/standing order distinct |
| UI2-I | TraitSystemTabs, TraitSlotsUI, CharacterPage | Codex direct and 1.0 slot-preview clarity, no 1.1 semantics |
| UI2-J | theme defaults, provider typography, global reduced motion | Focus/contrast, screenshots, browser matrix |
| UI2-K | **Excluded from this PR** | Requires qualified + reconciled PR #178 and stacked #180 |

## Finding-specific rejection tests

- Proximity without available dialogue cannot create a fake 'Talk' link. Known contacts remain inspectable.
- UI actions cannot leak undiscovered characters, create Memories, force hidden Quests, or mutate canonical progress during rendering.
- Puzzle wrong answers cannot close or claim success; Force It cannot be executed before explicit confirmation.
- Copy acknowledgement is not resolution; status is derived from canonical exceptions and actual task state.
- Effective appearance must match persisted Settings; fake audio/quality/theme controls are not offered.
- Unavailable/restricted Trait ownership and Doctrine behavior are not changed.

## Qualification before promotion

1. Focused tests: `UI2ExperienceRepair.test.tsx`, `PlayerExperienceUX.test.tsx`, `QuestPuzzleModalUX.test.tsx`, GC02 and GC03.
2. All existing authoritative Build Validation jobs on the **exact PR head**: 1.0 historic M4–M19, chapters, Copy, Traits, TS, production bundle, Chromium and Firefox, two divergent ordinary-UI campaigns, persistence/import/export.
3. Visual/render accessibility checks where actual screenshots/evidence exist; static code is not a human UX outcome.
4. Under AGENTS.md D3 only this agent's own PR can be merged after exact-head PASS. Release/version promotion is independent.
5. Real portraits and human testing are missing external evidence/assets. Monograms are deliberately honest visual fallbacks, not a claim that illustrated character art exists.

**Stop:** Do not merge or report completion on an unqualified head; first reconcile returned CI evidence, repair exact causes, and re-run the authoritative gate.
## 2026-10-24 UI3 review-response continuation

The first exact-head 1.0 UI2 candidate at `9f535361` passed full Build Validation run `40058927308` with Chromium+Firefox release-browser matrix and two divergent ordinary-UI campaign histories. That green result is **historical** after UI3 commits.

Owner authorized the follow-on bounded fixes to the same PR, without a generic UI framework or new game rule:

| Review finding | Implementation | Rejection/acceptance evidence |
|---|---|---|
| Desktop double margin | `GameLayout` relies on sidebar flex footprint | Desktop browser checks actual sidebar-to-main gap |
| Mobile giant cards | Responsive `CurrentMomentPanel` action flex-basis | Mobile browser screenshot + source regression |
| Dark menu contrast | Explicit light heading on dark gradient | Source regression + screenshot review |
| Inert Gameplay controls | Show actual autosave only; keep old payload fields | RTL excludes difficulty/tutorial controls, verifies switch |
| Split migrated NPC Affinity | Canonical Bond profile Affinity for sort/filter; bond label from Relationship authority | RTL card + migrated source semantics |
| Spatial/story availability confusion | Separate confirmed local encounter vs unanchored available story contact; truthful NPC profile copy | RTL story gate, no future/unseen contacts |
| Ontology wording in world situation | Situation derived from chapter identity and *currently player-known* contact/quest availability | Source/RTL regression, human comprehension still unproven |
| Trait proximity copy | 1.0 slot manipulation does not invent NPC vicinity rule; preview explicit known modifiers | RTL/source regression, no 1.1 effect extrapolation |

**Required:** exact-head focused `UI3LayoutAndSettings` + `UI3WorldTruth`, original UI2 regression and full Build Validation (historic M4–M19, chapters, browser, static production, divergent campaigns, save/Continue). Human-facing quality can be established only by real participants according to `docs/ui/Phase2HumanEvaluation.md`. The tests are code/runtime correctness evidence, not cognitive/experiential results.
