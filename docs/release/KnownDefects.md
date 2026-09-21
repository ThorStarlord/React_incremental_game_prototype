# Known Defects and Accepted Release Debt — Campaign One / 1.0

**Status:** RELEASE REVIEW INPUT; does not grant promotion approval
**Last updated:** 2026-09-21

This ledger separates product defects from evidence/tooling limitations. A missing
qualification artifact is not silently treated as a pass.

| ID | Severity | Area | Status | Player impact | Disposition |
| --- | --- | --- | --- | --- | --- |
| KD-001 | Release blocker | Beta / human product review | Open | Comprehension, pacing, balance, and accessibility have not received the required human validation. | Must close with the Beta evidence required by `BetaCompletionContract.md`. |
| KD-002 | Release blocker | Full UI campaign evidence | Open | Deterministic production-action tests do not prove a fresh player can complete the campaign through the normal UI. | Must close with one complete UI run and two materially divergent histories. |
| KD-003 | Release blocker | Firefox qualification | Resolved | Historical Windows Playwright page creation timed out, but the same visible-UI matrix now passes in Firefox 155.0 on Linux CI. | Closed by Build Validation #394 artifact `gc13-browser-qualification`. |
| KD-004 | Release blocker | Immutable RC / deployment identity | Open | Technical Beta builds have recorded CI evidence, but no immutable RC/deployment identity exists because RC entry is correctly blocked before BETA_PASS. | After Beta PASS, intentionally version one 1.0.0-rc.N candidate and attach its CI/deployment/static-host evidence. |
| KD-005 | Low / test-only | React `act(...)` warnings | Open | No known production impact; test output is noisy and can hide a real asynchronous UI regression. | Convert affected direct-thunk UI tests to `act`/`waitFor` flows in a separate test-quality pass. |
| KD-006 | Moderate / maintenance | React Router 6 advisory line | Accepted pending migration | No known impact on this client-only static route usage; two moderate advisories remain. | Qualify a CRA-to-modern-build/router migration separately; do not force-upgrade the current candidate. |
| KD-007 | Low / maintenance | Browserslist data age | Open | Build emits a maintenance warning; no current runtime failure identified. | Refresh browser data as part of the next dependency/toolchain qualification. |
| KD-008 | Release blocker | Production debug boundary | Resolved | Direct navigation to `/game/debug` could expose state-mutating developer tools even though production navigation hid the item. | Production routing now mounts the debug route only in development; GC-01 regression coverage rejects debug availability in non-development builds. Exact-head Build Validation remains required before integration. |

KD-001, KD-002 and KD-004 still prohibit 1.0 promotion. KD-003 is resolved by
the GC-13 dual-browser CI artifact. KD-008 is resolved by the production debug-route
boundary repair and its GC-01 regression coverage. KD-005 through KD-007 are
documented debt and do not independently prohibit release unless new evidence
shows player-facing impact.
