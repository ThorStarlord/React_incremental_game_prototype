# Release Candidate Result — Campaign One / 1.0

**Status:** RC-1 QUALIFIED — PASS; PROMOTED TO 1.0.0 (personal release, HUMAN-UNVALIDATED)
**Basis:** owner waiver (`specification/Technical/OwnerPersonalReleaseDecision.md`); BETA_PASS = NO / HUMAN-UNVALIDATED
**Last updated:** 2026-10-20

## Candidate identity

| Field | Value |
| --- | --- |
| Version | `1.0.0-rc.1` |
| Commit SHA | `6e308880e7dbc9be01bf9a1de2fdf04f23561a01` (PR #176 exact head) |
| Merged to main | `c67fd76bc94afced1163bb247a101e1161b7c2ed` — merge commit with a tree identical to the candidate; tagged `v1.0.0-rc.1` |
| Build Validation run | Build Validation #564 / run `39381506897` — PASS |
| Production artifact | `npm run build` in that run; served by `npm run release:serve` for the full-campaign run |
| Deployment | `.github/workflows/deploy-pages.yml` publishes `main` to GitHub Pages once Pages is enabled (subpath build verified locally with both campaign routes) |
| Release date | 2026-10-20 |
| Browser matrix | Chromium 153.0.8010.12 + Firefox 155.0, Linux CI, 1280×720 — `docs/release/BrowserQualification.md` |
| Known defects | `docs/release/KnownDefects.md` — no open release-blocking row |

## Gates (Build Validation #564 unless noted)

| Gate | Result |
| --- | --- |
| Documentation authority, content intelligence, chapter integrity | PASS |
| GC-01 … GC-12, Alpha, Content Alpha, Beta technical, GC-14 guard, accessibility baseline | PASS |
| Timing, offline, persistence and historical M4–M25 qualifications | PASS |
| TypeScript and production build | PASS |
| Browser smoke matrix (`gc13-browser-qualification`, artifact 12245224759) | PASS — Chromium + Firefox |
| Full ordinary-UI campaign (`full-campaign-release-run`, artifact 12246061168) | PASS — Chromium + Firefox × Distributed Dissipation (105 steps) + Fortified Containment (104 steps), each with four save → Main Menu → Continue checkpoints and an export → import → load round trip |
| `release:rc:eligibility` | PASS (owner waiver / HUMAN-UNVALIDATED) — asserted by the GC-14 suite in #564 and run locally |
| Local `release:validate` steps on the candidate tree | PASS — full Jest suite 89 suites / 451 tests, `security:release` (no high/critical runtime advisories), `release:evidence:validate`, `alpha:validate`, lint, cycles, persistence, manifest; Chromium browser and campaign runs |

## Save / load / recovery evidence

- Save → Main Menu → Continue after the opening, at midgame, immediately before the finale, and after campaign completion (both histories, both browsers).
- Export → import → load of a completed campaign (both histories, both browsers).
- Invalid import fails safely inside the import flow (browser smoke matrix).
- Reload or direct `/game` URL without a session returns to the main menu (`GameSessionLifecycle.test.tsx`).
- Startup catalog loads cannot overwrite a New Game or loaded save (`StartupCatalogRaceRegression.test.ts`).
- Offline settlement idempotence and migration commitments: existing M21 and save-schema suites in Build Validation.

## Promotion to 1.0.0

The 1.0.0 commit differs from the qualified RC-1 candidate only in version metadata (`package.json`, `package-lock.json`, `APP_VERSION`), release and authority documentation, and the documentation-authority validator; no game source or content changes. It carries its own exact-head Build Validation before merge, and the `v1.0.0` tag and GitHub Release identify that exact commit.

## Human evidence

None. The human Beta floor was waived for 1.0, not satisfied (KD-001, accepted for release). The release notes state that the game was not externally playtested. No human-experience claim is made.

## Release decision

Promote to **1.0.0** as a personal release under the 2026-10-20 owner decision.
