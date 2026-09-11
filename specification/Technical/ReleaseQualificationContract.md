# Release Qualification Contract — Campaign One / 1.0

**Status:** CURRENT AUTHORITY — PROVISIONAL 1.0 RELEASE CONTRACT  
**Parent:** `../GameCompletionDefinition.md`  
**Requires:** `BetaCompletionContract.md`  
**Prepared:** 2026-09-11

## Purpose

A Release Candidate is a **specific production candidate**, not a general statement that `main` looks healthy.

This contract defines the evidence required to promote one exact build to 1.0.

## Release target

Campaign One / 1.0 is a client-side desktop-web game.

Primary supported target:

```text
current stable Chromium-class desktop browser (Chrome / Edge)
current stable Firefox desktop
minimum viewport 1280x720
reference viewport 1920x1080
```

Full mobile product support, live-service infrastructure, and post-campaign content are outside the 1.0 release target unless separately promoted.

## RC entry conditions

Do not create an RC until:

- `BETA_PASS` is recorded;
- feature scope is locked;
- campaign content is locked except release-blocking corrections;
- no known blocker/critical defect remains;
- the candidate is based on the exact intended release content/configuration;
- release version metadata is intentionally set.

## Candidate immutability

Every RC record must identify:

```text
commit SHA
Build Validation run
production build artifact / deployment identity if applicable
version
release-date candidate
supported browser matrix
```

If source, content, dependency lockfile, configuration, or release metadata changes, the candidate changes and must be requalified.

## Required release scenarios

### Installation / startup

- [ ] clean dependency installation succeeds in the authoritative CI environment;
- [ ] production build succeeds;
- [ ] release-like static hosting serves the app successfully;
- [ ] root route loads the main menu;
- [ ] a browser with no prior game storage can start New Game;
- [ ] an invalid route safely returns to an intended entry route.

### Fresh New Game -> ending

At least one release qualification must exercise the entire production path:

```text
clean browser storage
-> New Game
-> Prologue
-> Chapters 1–7
-> Telluric Echo finale
-> state-responsive Epilogue
-> campaign-complete state
```

No debug route, direct Redux mutation, local-storage editing, developer console intervention, or hidden test-only action may be necessary for required progression.

### Representative divergence

The RC must qualify at least two representative campaign histories that differ materially in some combination of:

- chapter route decisions;
- Relationship Memories;
- capability/build profile;
- Knowledge distribution;
- Faction standing;
- World State;
- delegated routine choices;
- finale preparation / epilogue consequences.

The goal is not exhaustive combinatorial testing. It is proof that the release did not accidentally collapse the intended state divergence into one path.

### Save / load / recovery

- [ ] save/load succeeds after the opening;
- [ ] save/load succeeds in representative midgame state;
- [ ] save/load succeeds immediately before the finale;
- [ ] save/load succeeds after campaign completion;
- [ ] import/export round-trip succeeds for a representative progressed save;
- [ ] corrupted/invalid import fails safely;
- [ ] one-time rewards/actions are not duplicated by reload;
- [ ] offline settlement is idempotent;
- [ ] current migration commitments are preserved.

### Offline boundary

- [ ] allowed passive/routine work progresses according to current M21 authority;
- [ ] timed Quests retain current online-only offline-settlement behavior;
- [ ] Relationship does not advance from offline narrative inference;
- [ ] Knowledge does not transfer offline;
- [ ] Faction/World State does not change offline without explicit current authority;
- [ ] travel/combat/narrative choices never auto-resolve offline;
- [ ] return summary accurately explains allowed progress.

### Timing / lifecycle

All current timing contracts must remain green, including:

- `SERIAL_BACKPRESSURE_V1`;
- `FRESH_LOOP_RESET_V1`;
- timed-Quest comparison-only precision semantics;
- long-horizon progression drift qualification;
- live/offline boundary qualification.

A release fix must not quietly weaken these contracts to improve a superficial metric.

## Content integrity

Release qualification must reject:

- dangling campaign content references;
- duplicate chapter/route identity;
- unreachable required campaign units;
- chapter requirements pointing at non-existent canonical evidence;
- required conclusion/ending nodes that cannot be reached from legal production state;
- hidden future requirements exposed as player spoilers;
- required content depending on debug-only setup.

By RC, content-intelligence tooling should cover the entire production Campaign One spine, not only the original post-M25 examples.

## Browser qualification

For each primary supported browser family, record:

- browser/version;
- OS;
- viewport;
- New Game startup result;
- critical navigation result;
- representative interaction/dialog result;
- save/load result;
- at least one combat/quest interaction;
- Copy/delegation interaction;
- campaign completion or a documented representative full-run source for that browser.

Chromium and Firefox must both receive release evidence. Edge does not require a separate full campaign run if the same Chromium engine version is covered, unless an Edge-specific defect exists.

## Accessibility / input smoke

Before 1.0 promotion:

- [ ] critical main-menu actions can be reached and activated by keyboard;
- [ ] critical game navigation can be reached by keyboard;
- [ ] dialogs can be dismissed/confirmed predictably;
- [ ] focus remains visible on required interactions;
- [ ] campaign-blocking information is not encoded solely by color;
- [ ] supported browser zoom does not make critical actions unreachable at the minimum viewport.

This is a practical release baseline, not a claim of formal accessibility certification.

## Error-handling / resilience smoke

- [ ] missing optional content fails safely where expected;
- [ ] failed save import produces player-facing failure rather than corrupted active state;
- [ ] startup data-loading failures do not silently create a partially valid campaign;
- [ ] asynchronous GameLoop consumer rejection does not create concurrent tick consumers or unbounded queued work;
- [ ] reload after ordinary browser interruption resumes from persisted state without duplicating offline settlement.

## Versioning / release metadata

Before final 1.0 promotion:

- package/application version must be intentionally set to `1.0.0` or the repository's explicitly selected equivalent;
- main-menu/about/version display must agree with release metadata;
- release notes must identify Campaign One scope and known accepted limitations;
- the Git release/tag must identify the exact qualified candidate;
- documentation must no longer describe the current release as a prototype or pre-alpha.

Repository naming may remain historical if renaming creates unnecessary operational risk, but player-facing/product documentation must describe maturity correctly.

## Known-defect policy

RC may contain known low-severity defects only when each has:

- documented reproduction status;
- severity;
- player impact;
- reason it is accepted for 1.0;
- workaround if relevant.

`BLOCKER` and `CRITICAL` defects prohibit release.

A `HIGH` defect that can corrupt saves, soft-lock normal progression, invalidate campaign outcomes, or make a primary supported browser unusable also prohibits release.

## Human evidence carry-forward

RC does not repeat all Beta playtesting, but must preserve evidence that:

- required Beta human-review floor was reached;
- no later RC change invalidated the relevant player-facing area without re-checking it;
- repeated severe comprehension/progression failures are closed or explicitly accepted with release rationale.

## Release qualification command

Before RC, create an executable aggregate release command, expected form:

```bash
npm run release:validate
```

It should orchestrate deterministic repository qualification that is safe to automate. Human/browser manual evidence remains separately recorded rather than faked by the command.

## Required RC record

Create `ReleaseCandidateResult.md` (or versioned equivalent) containing:

```text
candidate SHA
version
Build Validation run
release:validate result
browser matrix
full-run evidence
save/import-export evidence
human-evidence references
known defects / accepted risks
release decision
```

## 1.0 promotion rule

Promote an exact RC to 1.0 only when:

```text
BetaCompletionContract = PASS
AND ReleaseQualificationContract deterministic gates = PASS
AND primary browser evidence = PASS
AND full New Game -> Epilogue run = PASS
AND no release-blocking defect remains
AND exact release candidate is unchanged since qualification
```

After promotion, new ideas belong to 1.1/expansion work unless they are release-hotfix defects.
