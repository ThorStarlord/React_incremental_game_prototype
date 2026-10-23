# UI Phase 2 — Source, responsibility, and qualification

**Date:** 2026-10-23. **Owner scope:** UI correctness and world-first experience within Campaign One.
**PR:** #181 (`codex/ui2-world-first-experience-20261023`), draft / exact-head qualification pending.
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