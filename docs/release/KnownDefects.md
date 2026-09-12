# Known Defects and Accepted Release Debt — Campaign One / 1.0

**Status:** RELEASE REVIEW INPUT; does not grant promotion approval
**Last updated:** 2026-09-12

This ledger separates product defects from evidence/tooling limitations. A missing
qualification artifact is not silently treated as a pass.

| ID | Severity | Area | Status | Player impact | Disposition |
| --- | --- | --- | --- | --- | --- |
| KD-001 | Release blocker | Beta / human product review | Open | Comprehension, pacing, balance, and accessibility have not received the required human validation. | Must close with the Beta evidence required by `BetaCompletionContract.md`. |
| KD-002 | Release blocker | Full UI campaign evidence | Open | Deterministic production-action tests do not prove a fresh player can complete the campaign through the normal UI. | Must close with one complete UI run and two materially divergent histories. |
| KD-003 | Release blocker | Firefox qualification | Host-blocked | Firefox page creation times out on the current Windows Playwright host; this is not a browser pass. | Rerun the exact candidate on the supported CI runner. |
| KD-004 | Release blocker | CI/deployment identity | Open | The candidate has local build evidence but no recorded Build Validation run or deployment identity. | Attach CI artifacts and the static-host verification to the immutable candidate. |
| KD-005 | Low / test-only | React `act(...)` warnings | Open | No known production impact; test output is noisy and can hide a real asynchronous UI regression. | Convert affected direct-thunk UI tests to `act`/`waitFor` flows in a separate test-quality pass. |
| KD-006 | Moderate / maintenance | React Router 6 advisory line | Accepted pending migration | No known impact on this client-only static route usage; two moderate advisories remain. | Qualify a CRA-to-modern-build/router migration separately; do not force-upgrade the current candidate. |
| KD-007 | Low / maintenance | Browserslist data age | Open | Build emits a maintenance warning; no current runtime failure identified. | Refresh browser data as part of the next dependency/toolchain qualification. |

KD-001 through KD-004 prohibit 1.0 promotion. KD-005 through KD-007 are
documented debt and do not independently prohibit release unless new evidence
shows player-facing impact.
