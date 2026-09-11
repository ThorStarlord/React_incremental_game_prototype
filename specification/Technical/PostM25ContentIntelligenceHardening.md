# Post-M25 Content Intelligence Hardening

**Status:** `REPOSITORY_ONLY / HERMETIC_VALIDATION`

## Purpose

Strengthen the integrated Content Intelligence layer now that the repository contains more than one chapter-scale composition. The analyzer remains developer-side static analysis over authored contracts; it is not runtime gameplay authority.

## New blocking structural checks

`structural-checks.js` adds deterministic rejection for:

- `CONTENT_PREREQUISITE_CYCLE` — a blocking prerequisite graph contains a cycle;
- `CONTENT_CONTRADICTORY_FACT_REQUIREMENT` — one source simultaneously requires and forbids the same Knowledge fact;
- `CONTENT_CONTRADICTORY_FACTION_REQUIREMENT` — combined faction bounds have `min > max`;
- `CONTENT_CONTRADICTORY_WORLD_STATE_REQUIREMENT` — one source requires multiple simultaneous equality values for the same region/field.

These checks are composed into `npm run content:audit`, and therefore into the existing `npm run content:intelligence:validate` CI authority.

## Negative qualification

`selftest.js` now proves the analyzer rejects synthetic fixtures for each new structural defect while preserving the existing clean positive fixture and dangling/duplicate-ID negative coverage.

## Boundary

The checker reasons only about contradictions expressible in current authored data. It does not claim to solve arbitrary narrative satisfiability, simulate player behavior, infer author intent, or establish that reachable content is understandable or enjoyable.