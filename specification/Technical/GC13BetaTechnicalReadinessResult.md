# GC-13 Deterministic Beta Technical Readiness Result

**Disposition:** `TECHNICAL_BETA_READY / HUMAN_EVIDENCE_BLOCKED`  
**Product maturity:** `CONTENT_ALPHA / HUMAN-UNVALIDATED`  
**BETA_PASS:** `NO`  
**Qualified branch head:** `fa163681f1249c9a570386dc17d7193fbd2a72dc`  
**Build Validation:** #394 / run `35549032298` — PASS, 61/61 workflow steps  
**PR:** #136  
**Prepared:** 2026-09-20

## What GC-13 now proves

All repository-controlled deterministic Beta preparation implemented by this package is green on the exact PR head.

The qualification includes:

- GC-01 through GC-12 current campaign/content gates;
- `beta:technical:validate`;
- relative import-cycle qualification;
- persistence-authority qualification;
- canonical save/schema/recovery tests;
- bounded offline authority;
- long-horizon timing/backpressure/drift contracts;
- TypeScript;
- Chromium + Firefox player-facing browser smoke;
- historical regression tail;
- production build.

## Browser/input evidence

Build Validation #394 uploaded artifact:

- name: `gc13-browser-qualification`
- artifact ID: `10617277390`
- artifact digest: `sha256:874971735d3cd235d39a6cb17003bad56e484be9195facc6c2ee1d304819bd2b`
- generated: `2026-09-21T00:57:06.830Z`
- host: `linux 6.17.0-1022-azure x64`
- viewport: `1280x720`
- overall result: `PASS`

The GitHub Actions artifact records the checked-out pull-request merge ref
`be1f60b5d9e6efc5e08aad30acb8ed470ad6d1e6`, produced from PR #136 whose
qualified source head is `fa163681f1249c9a570386dc17d7193fbd2a72dc`.

### Chromium

- version: `153.0.8010.12`
- result: `PASS`

Passed visible-UI checks:

1. root route loads;
2. primary actions visible;
3. keyboard focus visible;
4. New Game keyboard activation;
5. game navigation visible;
6. invalid-route recovery;
7. invalid import remains in import flow with visible rejection feedback;
8. empty load state explicit.

### Firefox

- version: `155.0`
- result: `PASS`

The same eight player-facing checks passed.

This resolves the previous host-specific Firefox smoke blocker. It does **not**
replace the Release Qualification Contract's later full-campaign/browser evidence
on an immutable RC.

## Recovery / persistence improvement

Invalid or incompatible save-code import now:

- fails closed;
- does not replace active game state;
- remains in the import flow;
- displays visible accessible error feedback with `role="alert"`.

The message is:

> Invalid or incompatible save code. Check the code and try again.

## Version/provenance consistency

Technical prerelease identity is now aligned across:

- `package.json`;
- root `package-lock.json` metadata;
- in-app `APP_VERSION`.

Current identity:

`0.9.0-beta.1`

This is a technical prerelease identifier. It is **not** an assertion of
`BETA_PASS` and must not be promoted to `1.0.0` before the governing release
entry conditions are satisfied.

## Release-hardening command surface

The retained concurrent hardening utilities are now wired through package scripts,
including:

- `architecture:cycles`;
- `architecture:persistence`;
- `lint:release`;
- `security:release`;
- `release:evidence:validate`;
- `release:manifest`;
- `release:browser`;
- `release:validate`;
- `release:1.0`.

`release:validate` remains deterministic preparation, not promotion authority.

## Human evidence remains absent

Issue #109 remains `OPEN / UNPROVEN`.

Current accepted human evidence count:

```text
fresh-player first-session observations: 0 / 5
external full fresh-save playthroughs:   0 / 3
```

A dedicated real-human evidence template now exists at:

`docs/release/BetaHumanEvidenceTemplate.md`

Synthetic browser traversal, LLM review, repository analysis, and automated tests
do not count toward those numbers.

## Remaining Beta blockers

Before `BETA_PASS`:

1. collect at least 5 accepted fresh-player first-session observations;
2. collect at least 3 accepted external beginning-to-ending fresh-save playthroughs;
3. preserve exact build/browser/session provenance;
4. classify and resolve or explicitly accept repeated severe findings;
5. keep exact-head deterministic CI green on the build being promoted.

## Valid current state

```text
CONTENT_ALPHA
TECHNICAL_BETA_READY
HUMAN_EVIDENCE_BLOCKED
BETA_PASS = NO
```

GC-14 deterministic release preparation may be hardened, but RC entry and 1.0
promotion remain forbidden until the Beta contract passes.
