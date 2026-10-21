# Campaign One 1.1 — Release Qualification Contract

**Status:** CURRENT CONTRACT FOR 1.1 DEVELOPMENT; QUALIFICATION OPEN
**Supersedes:** nothing from the completed 1.0 release
**Owner program:** `Version11ScopeContract.md`
**Existing release evidence:** `docs/release/ReleaseCandidateResult.md` belongs to 1.0 and must not be relabeled as 1.1.

## Release target

Version `1.1.0` of the same self-contained client-side desktop browser game, at a minimum of 1280x720, on supported Chromium and Firefox. Gameplay scope is Campaign One: Prologue, Chapters 1–7, Telluric Echo Finale and state-responsive Epilogue. 1.1's feature addition is universal Trait assimilation/selection, not a new campaign.

## Candidate and authority

A 1.1 promotion candidate MUST identify:

- exact source commit SHA and built artifact;
- `package.json`, lockfile and `APP_VERSION` in agreement for version `1.1.0`;
- exact-head Build Validation run/URL/conclusion;
- full normal-UI two-route campaign artifacts in Chromium and Firefox;
- focused positive and rejection tests for assimilation/expression, Doctrine, sharing, procedural-combat payoff, and keyboard controls;
- migration from real supported 1.0 schema-v2 saves, with ownership and progression preserved;
- KnownDefects disposition for every regression with potential to affect saves, campaign completion or a primary browser;
- release notes disclosing the human evidence ceiling;
- an explicit promotion decision after all gates pass.

A draft PR or a successful historical 1.0 Build Validation is **not** a 1.1 qualification.

## Required deterministic and UI evidence

1. `npm run universal-traits:validate`: ownership, expression, free swapping, provenance, Stabilization, meaningful non-cognitive combat behavior, UI accessibility.
2. `npm run trait-depth:validate`: Relationship-derived capabilities and Doctrine/Copy/narrative consumers.
3. `npm run release:validate`: complete Jest/TypeScript/production/security/content/architecture/Alpha/browser checks without downgrading historical contracts.
4. CI full ordinary-UI `npm run release:campaign -- --browser all --route all` on the production build, including divergent Distributed and Fortified outcomes and save/Continue/export/import checkpoints.
5. Save-schema qualification: previous `schemaVersion: 2` state with assimilated Traits, focus and occupied/locked slots migrates deterministically to v3; no ownership invention or loss, idempotent current-schema saves, safe invalid imports and preserved timed Quest/offline semantics.
6. At least two different meaningful expressed Trait/Doctrine build paths are covered in deterministic gameplay, while a viable unaugmented route remains.
7. Normal UI controls remain available with mouse and keyboard, dynamic names and focus; the Trait lifecycle shows discovered, qualifying/assimilation, assimilated, expressed and suppressed states.
8. Browser and reliability qualification includes 1280×720, session lifecycle, normal load, no debug-only required progression, no dependency on unqualified NPC proximity to swap expression.
9. All content-integrity, timing, refund/double-spend and Copy master-familiarity boundaries remain intact.
10. No known open release-blocking defect, corrupted import, progression softlock, or broken primary browser remains.

## Independent 1.1 evidence and human claim ceiling

- Keep original `docs/release/ReleaseCandidateResult.md` (1.0) and `BetaResult.md` unchanged as historical evidence.
- Record new candidate and exact qualification in `docs/release/Version11CandidateResult.md`.
- Record 1.1 release notes separately until promotion; a release-tag workflow must select notes for the version being published.
- The owner has authorized implementation, not a fictional `BETA_PASS`. If release is a personal release without external participants, record the 1.1 owner release decision and disclose **not externally playtested**; count no synthetic sessions as human.
- On actual human sessions, issue #109's documentation can be used for human experience evidence, but technical gates do not gain such authority.

## Promotion and stop conditions

1.1 may be promoted only when all named gates pass on the exact candidate, the version and release notes match, no blocker remains, and the candidate is intentionally merged/tagged under the permitted branch/merge policy. A pending, cancelled or failing Build Validation keeps this result **NOT QUALIFIED**.

If technical execution cannot complete, keep the draft branch and explicit evidence gap; no force merge, release tag, or beta-quality claim. A future valid CI result may justify continuation, but no asynchronous coding work is promised.
