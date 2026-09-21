# GC-12 Concurrent Release-Hardening Reconciliation

**Status:** CURRENT RECONCILIATION RECORD  
**Prepared:** 2026-09-20  
**Reconciled base:** `02f06426e05c345380e51ae19a1061b5ed5e1bb2`

## Context

A concurrent release-hardening line was merged into `main` after GC-11 had already qualified and merged. That line was based on an older campaign baseline and introduced both:

1. useful release-hardening infrastructure; and
2. a second, parallel Campaign One implementation.

The merge therefore required semantic reconciliation rather than choosing one branch wholesale.

## Retained release-hardening work

The reconciliation keeps the independent hardening work that does not compete with campaign authority, including:

- persisted-state projection / save-boundary hardening;
- corrupt-save classification and recovery work;
- import-cycle and persistence-authority checks;
- release manifest generation;
- dependency-security tooling and records;
- Chromium/Firefox browser qualification runner;
- release evidence metadata validation;
- release lint / helper scripts;
- selector and test-quality repairs that remain compatible with current domain authority.

These remain subject to GC-13 / GC-14 qualification before they can support Beta or RC claims.

## Removed stale parallel campaign authority

The older release-hardening branch also introduced:

- `public/data/campaign-one-content.json`;
- `public/data/relationships/campaign-one.json`;
- a second whole-game content-integrity / completion test path;
- a second `campaignCompletion` persistence authority in Meta state;
- a `CAMPAIGN_COMPLETE` dialogue effect.

Those pieces were not production-wired on merged `main`:

- the new dialogue bundle was not loaded by `initializeNPCsThunk`;
- the new relationship bundle was not registered in `relationships/index.json`;
- the `CAMPAIGN_COMPLETE` effect was typed but not handled by the runtime interaction thunk.

More importantly, GC-06 through GC-10 already own the real Campaign One continuation and finale through canonical Relationship, Knowledge, Faction, World State, Quest, and Memory authorities.

Keeping both implementations would create two competing campaign/completion models.

## Canonical completion authority after reconciliation

Campaign completion remains derived from the already-integrated GC-10 authority:

```text
GC-09 committed counterphase plan
-> GC-10 legal finale Quest
-> route-specific Relationship consequence
-> state-responsive aftermath dialogue
-> World State campaignStatus = complete
-> telluricEchoOutcome
-> Lyra fact_gc10_campaign_complete
-> route-specific Memory / epilogue projection
```

That state already survives canonical save/load without adding a campaign-owned root or duplicate completion flag.

## Content Alpha closure

GC-12 then qualifies the actual production corpus rather than the stale parallel layer:

- complete dialogue / Quest / Experience / Memory copy;
- no required placeholder/debug/milestone prose;
- all six anchor long-horizon callback contracts;
- all four GC-10 finale/aftermath variants;
- route traces for all four aftermath targets;
- chapter-definition integrity.

## Evidence ceiling

This reconciliation does not claim Beta or Release Candidate status.

Issue #109 remains the human product-evidence gate for Beta. Existing `docs/release/` records remain preparation/reference until GC-13/GC-14 entry conditions and exact-candidate evidence are satisfied.
