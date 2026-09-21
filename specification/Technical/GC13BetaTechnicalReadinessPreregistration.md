# GC-13 Beta Technical Readiness Preregistration

**Status:** DETERMINISTIC BETA PREPARATION  
**Program:** Campaign One / 1.0 Game Completion  
**Prepared:** 2026-09-20

## Goal

Complete every repository-controlled Beta gate that can be established deterministically, while preserving the Beta contract's genuine human-evidence requirement.

Automation, browser smoke, synthetic observation, and repository analysis must never be translated into fresh-player evidence.

## Entry

This package is downstream of:

- `ALPHA_PASS / HUMAN_UNVALIDATED`;
- `CONTENT_ALPHA / HUMAN_UNVALIDATED`;
- the reconciled GC-06→GC-10 canonical campaign;
- the retained release-hardening utilities from the concurrent branch.

## Deterministic gates

### Architecture and persistence

- relative import-cycle qualification;
- single persistence-authority qualification;
- canonical schema migration/recovery tests;
- early/mid/pre-finale/completed save coverage inherited from Alpha;
- invalid/incompatible import fails closed with visible player feedback;
- bounded offline authority remains idempotent and non-narrative.

### Timing and reliability

Reuse the existing deterministic GameLoop timing/stress contracts, including:

- serial backpressure;
- fresh-loop reset;
- long-horizon drift;
- live/offline boundary;
- timed-Quest precision semantics.

These are implementation reliability evidence, not arbitrary-hardware UX claims.

### Browser/input matrix

The release browser runner must execute in fresh contexts for:

- Chromium;
- Firefox;
- 1280×720 minimum viewport.

Each browser must prove through visible DOM only:

- Main Menu loads;
- primary controls are visible;
- keyboard focus reaches a visible actionable control;
- New Game activates by keyboard;
- ordinary game navigation appears;
- invalid route recovers;
- empty load state is explicit;
- invalid import stays non-destructive and shows visible error feedback.

### Version/provenance consistency

During technical Beta preparation:

- package metadata;
- package lock root metadata;
- in-app version display

must agree on `0.9.0-beta.1`.

This is a technical candidate identity only. It does not assert `BETA_PASS`.

### Release tooling

Wire the existing release-hardening commands so they are executable from one authoritative package surface:

- `architecture:cycles`;
- `architecture:persistence`;
- `lint:release`;
- `security:release`;
- `release:evidence:validate`;
- `release:manifest`;
- `release:browser`;
- `release:validate`;
- `release:1.0`.

GC-13 does not run final 1.0 promotion.

## Human gate

`BETA_PASS` remains forbidden until issue #109 records, on a current supported build:

- at least 5 fresh-player first-session observations;
- at least 3 external beginning-to-ending fresh-save playthroughs;
- exact build/browser/session provenance;
- required classification and resolution/acceptance of repeated severe findings.

## Exit

If the deterministic gates pass and the human floor remains incomplete, the only valid result is:

```text
CONTENT_ALPHA
TECHNICAL_BETA_READY
HUMAN_EVIDENCE_BLOCKED
BETA_PASS = NO
```

No 1.0 tag, publication, or release approval follows from that state.
