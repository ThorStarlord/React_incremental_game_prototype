# Browser Qualification Record — Campaign One / 1.0

**Status:** TOOLING IMPLEMENTED; LOCAL PARTIAL RECORD  
**Command:** `npm run release:browser`  
**Supported matrix:** Chromium-class desktop browser and Firefox desktop, 1280×720 minimum viewport  
**Last updated:** 2026-09-12

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
| Chromium | 153.0.8010.12 | Windows 10 x64 | 1280×720 | PASS (candidate smoke) | `.release-artifacts/final-hardening-chromium/browser-qualification.md` |
| Firefox | 155.0 | Windows 10 x64 | 1280×720 | BLOCKED: Playwright page creation timeout on this host | `.release-artifacts/final-hardening-firefox/browser-qualification.md` |

## Human follow-up still required

The Firefox result is a host/tooling execution limitation, not a browser PASS.
CI must execute the same matrix on its supported Linux runner before RC evidence
can be accepted.

The smoke runner does not establish full campaign completion, representative
divergent histories, save/load recovery, combat/quest depth, Copy/delegation depth,
screen-reader quality or player comprehension. Those remain required release
evidence under `specification/Technical/ReleaseQualificationContract.md`.
