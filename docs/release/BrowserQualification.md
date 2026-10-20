# Browser Qualification Record — Campaign One / 1.0

**Status:** RC-1 EXACT-CANDIDATE PASS — Chromium + Firefox (smoke matrix and full campaign)  
**Command:** `npm run release:browser`  
**Supported matrix:** Chromium-class desktop browser and Firefox desktop, 1280×720 minimum viewport  
**Last updated:** 2026-10-20

## What the automated check covers

The qualification runner creates a fresh Playwright browser context for each
browser family and verifies, through visible UI only:

- the root route loads the main menu;
- the main heading and primary actions are present;
- keyboard tabbing reaches actionable controls with visible focus;
- New Game can be activated by keyboard;
- the New Game introduction is a modal dialog confirmed by keyboard alone;
- the game route mounts after New Game;
- the game navigation landmark and at least one navigation control are visible;
- an invalid route redirects to the entry route.
- an empty load surface reports that no saves exist;
- an invalid import remains safely inside the import flow instead of navigating
  or mutating the session.

The runner does not inspect Redux, localStorage, source maps, hidden debug state or
content files. It is therefore safe to use as a player-facing smoke check, not as
a substitute for full human campaign evidence.

## RC-1 exact-candidate record (1.0.0-rc.1)

Build Validation #564 / run `39381506897` qualified PR #176 exact head
`6e308880e7dbc9be01bf9a1de2fdf04f23561a01` (merged to `main` as
`c67fd76bc94afced1163bb247a101e1161b7c2ed` with an identical tree; tagged
`v1.0.0-rc.1`).

| Browser | Version | OS | Viewport | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| Chromium | 153.0.8010.12 | Linux CI | 1280x720 | PASS | `gc13-browser-qualification` (12245224759) + `full-campaign-release-run` (12246061168) |
| Firefox | 155.0 | Linux CI | 1280x720 | PASS | `gc13-browser-qualification` (12245224759) + `full-campaign-release-run` (12246061168) |

Browser versions are the builds pinned by the lockfile's Playwright 1.63.0
(Chrome for Testing 153.0.8010.12, Firefox 155.0), the same builds the CI log
records for run #562. Full-campaign results in run #564: Chromium Distributed
105/105 and Fortified 104/104; Firefox Distributed 105/105 and Fortified 104/104.

Per browser family, that run covered:

- New Game startup from clean storage, the keyboard-confirmed introduction,
  critical navigation, invalid-route recovery, invalid-import rejection and the
  empty-load state (smoke matrix, dev server);
- campaign completion through ordinary UI on the static production build for two
  divergent histories (Distributed Dissipation; Fortified Containment): dialogue,
  quest acceptance/resolution/turn-in, travel, Forge practice, four
  save → Main Menu → Continue checkpoints, and export → import → load.

Not covered: Copy creation and combat encounters are exercised by deterministic
suites, not by the browser campaign run; screen-reader quality and player
comprehension are not established by any automated run.

## Historical records

The September 2026 Windows-host smoke (Chromium PASS; Firefox blocked by a
Playwright page-creation timeout on that host) and GC-13 Build Validation #394
(Chromium 153.0.8010.12 + Firefox 155.0 PASS on Linux CI, artifact `10617277390`)
remain historical evidence. They are superseded for release purposes by the
RC-1 record above.
