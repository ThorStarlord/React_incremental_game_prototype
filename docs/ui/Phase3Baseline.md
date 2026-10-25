# UX3 baseline — 2026-10-24

**Base head:** `87f99628a8fbf901234b2d6ec7d5da75c8e60469` (post UI2/UI3). **Qualification source:** [PR #181](https://github.com/ThorStarlord/React_incremental_game_prototype/pull/181), [Build Validation #40090580707](https://github.com/ThorStarlord/React_incremental_game_prototype/actions/runs/40090580707). Existing browser evidence from the run: `chromium-first-session.png`, `chromium-mobile-current-moment.png`, `firefox-first-session.png`, `firefox-mobile-current-moment.png` plus complete campaign artifacts.

This is a **source-backed and existing CI-artifact baseline**, not a new screenshot capture on a locally executed app or a human study. Candidate browser screenshots must be compared with these prior artifacts after exact-head qualification.

## Finding register

| Finding | Before | Expected candidate evidence |
| --- | --- | --- |
| Dark NPC bubble contrast | NPC historical response used `grey.100` with theme-dependent `text.primary` | Dialogue surface uses compatible semantic tokens; dark-mode browser visual evaluation still to be recorded |
| Willow travel lead | Current Moment points to generic Travel; next legal location not named | Next connected City Gate / Whispering Woods step is explained and prioritized |
| Optional forge practice priority | Workshop button used stronger style than story travel | Next Willow travel step is visually primary; forge action remains available |
| NPC Same Location truth | Unanchored fallback compared legacy `npc.location` string | Only canonical, confirmed physical co-presence qualifies |
| Raw quest / save names | `READY_TO_COMPLETE` and `Autosave_exit_...` could display | Readable labels without changing persistence data |
| Mobile overhead | Nonurgent status and verbose save line above the moment | Compact nonurgent chrome; urgent alerts never hidden |
| World identity | Primarily dashboard framing | Reversible journal location and consequence styles; player enjoyment remains unknown |

Current maturity: `FEATURE_COMPLETE / HUMAN-UNVALIDATED`, `BETA_PASS=NO`. Existing personal release remains unchanged.
