# Browser Qualification Record — Campaign One / 1.0

**Status:** CI DUAL-BROWSER SMOKE PASS; FULL RC BROWSER EVIDENCE STILL PENDING  
**Command:** `npm run release:browser`  
**Supported matrix:** Chromium-class desktop browser and Firefox desktop, 1280×720 minimum viewport  
**Last updated:** 2026-09-20

## What the automated check covers

The qualification runner creates a fresh Playwright browser context for each
browser family and verifies, through visible UI only:

- the root route loads the main menu;
- the main heading and primary actions are present;
- keyboard tabbing reaches actionable controls with visible focus;
- New Game can be activated by keyboard;
- the game route mounts after New Game;
- the game navigation landmark and at least one navigation control are visible;
- an invalid route redirects to the entry route.
- an empty load surface reports that no saves exist;
- an invalid import remains safely inside the import flow instead of navigating
  or mutating the session.

The runner does not inspect Redux, localStorage, source maps, hidden debug state or
content files. It is therefore safe to use as a player-facing smoke check, not as
a substitute for full human campaign evidence.

## Execution record

The command writes a JSON and Markdown artifact under the requested output
directory (default: `.release-artifacts/browser-qualification`). The generated
record must be copied here or linked from a dated candidate record and must include
browser version, operating system, viewport, URL, test results and timestamp.

| Browser | Version | OS | Viewport | Result | Artifact |
| --- | --- | --- | --- | --- | --- |
| Chromium | 153.0.8010.12 | Windows 10 x64 | 1280×720 | PASS (candidate smoke) | `.release-artifacts/final-candidate-chromium/browser-qualification.md` |
| Firefox | 155.0 | Windows 10 x64 | 1280×720 | BLOCKED: Playwright page creation timeout on this host | `.release-artifacts/final-candidate-firefox/browser-qualification.md` |

## GC-13 current CI record

Build Validation #394 / run `35549032298` qualified PR #136 source head
`fa163681f1249c9a570386dc17d7193fbd2a72dc`.

GitHub Actions checked out pull-request merge ref
`be1f60b5d9e6efc5e08aad30acb8ed470ad6d1e6`.

Artifact:

- name: `gc13-browser-qualification`
- ID: `10617277390`
- digest: `sha256:874971735d3cd235d39a6cb17003bad56e484be9195facc6c2ee1d304819bd2b`
- host: `linux 6.17.0-1022-azure x64`
- viewport: `1280x720`
- overall: **PASS**

| Browser | Version | OS | Viewport | Result | Evidence |
| --- | --- | --- | --- | --- | --- |
| Chromium | 153.0.8010.12 | Linux CI | 1280x720 | PASS | Build Validation #394 artifact |
| Firefox | 155.0 | Linux CI | 1280x720 | PASS | Build Validation #394 artifact |

All eight visible-UI checks passed in both browser families, including keyboard
focus/New Game activation, invalid-route recovery, visible invalid-import
rejection, and explicit empty-load state.

This resolves the earlier Windows-host Firefox smoke limitation.

## Human follow-up still required

The historical Windows Firefox result above remains useful host evidence, but
the same smoke matrix now passes on the supported Linux CI runner.

The smoke runner does not establish full campaign completion, representative
divergent histories, save/load recovery, combat/quest depth, Copy/delegation depth,
screen-reader quality or player comprehension. Those remain required release
evidence under `specification/Technical/ReleaseQualificationContract.md`.

## Current hardening working-tree run

This is a local verification of the uncommitted hardening work, not a release
candidate artifact. It is recorded here to prevent it being mistaken for the
immutable candidate evidence above.

| Browser | Result | Coverage | Artifact |
| --- | --- | --- | --- |
| Chromium 153.0.8010.12 | PASS | 8 player-facing checks, including invalid import and empty load state | `.release-artifacts/browser-qualification-current/browser-qualification.md` |
| Firefox 155.0 | BLOCKED | Page creation timeout on the Windows host | `.release-artifacts/browser-qualification-current-all/browser-qualification.md` |
