# GC-13 Beta Technical Readiness Preregistration

**Status:** DETERMINISTIC BETA PREPARATION  
**Program:** Campaign One / 1.0 Game Completion  
**Prepared:** 2026-09-20

## Goal

Complete every repository-controlled Beta gate that can be established deterministically while preserving the Beta contract's genuine human-evidence requirement.

Automation, synthetic browser traversal, repository analysis, and LLM review are not human Product Review evidence.

## Entry

GC-13 technical work begins from:

```text
ALPHA_PASS / HUMAN_UNVALIDATED
CONTENT_ALPHA / HUMAN_UNVALIDATED
```

## Deterministic workstreams

### Save / recovery

Qualify canonical save boundaries, import/export, corrupt/future save rejection, repeated load safety, and bounded offline idempotence.

### Architecture / reliability

Qualify:

- relative import cycles;
- persistence authority;
- TypeScript;
- release-scope lint;
- runtime dependency security policy;
- existing timing/backpressure/offline contracts;
- production build.

### Browser / input

For Chromium and Firefox at the minimum supported 1280x720 viewport:

- fresh ephemeral context;
- Main Menu startup;
- keyboard reachability/activation of New Game;
- ordinary game navigation after New Game;
- invalid-route recovery;
- invalid-save import remains safe and presents visible player feedback.

This is a practical automated baseline, not formal accessibility certification.

### Presentation

Preserve Content Alpha copy integrity, current terminology, visible critical actions, and unambiguous campaign-completion presentation.

## Human gate

`BETA_PASS` remains forbidden until issue #109 records at least:

- 5 fresh-player first-session observations;
- 3 external beginning-to-ending fresh-save playthroughs;
- exact build/browser/session provenance;
- classification and resolution or explicit acceptance of repeated severe findings.

## Exit

If all deterministic work passes while issue #109 remains incomplete, record:

```text
CONTENT_ALPHA
TECHNICAL_BETA_READY
HUMAN_EVIDENCE_BLOCKED
BETA_PASS = NO
```

Do not set 1.0 release metadata and do not create an RC from that state.
