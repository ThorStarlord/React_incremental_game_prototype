# Post-M25 Provisional Governance Decision

**Status:** CURRENT AUTHORITY — PROVISIONAL / HUMAN-UNVALIDATED  
**Decision date:** 2026-09-11  
**Baseline:** `868a24e6bd415693c313e8ee6a767451b2c64e80`  
**Human Integrated Playability / Product Review:** OPEN / UNPROVEN  
**Final Product Direction:** NOT YET VALIDATED  
**Governance issue:** #111

## Decision

Human Product Review is not available in the current repository-execution environment. The repository will therefore no longer treat absence of human evidence as a total freeze on all product-directed implementation.

Instead, development may continue under an explicitly **PROVISIONAL / HUMAN-UNVALIDATED** Product Direction when all of the following are true:

1. the direction is grounded in existing repository evidence;
2. every human-quality claim remains explicitly unproven;
3. the implementation package is bounded and reversible;
4. existing canonical domain authorities remain authoritative;
5. deterministic qualification proves implementation correctness only;
6. the package does not create irreversible architecture merely to maintain momentum;
7. new human evidence may later revise or reverse the provisional direction.

This is a conscious governance-boundary revision, not a substitute for human Product Review.

## Revised authority boundary

```text
Repository composition evidence
        |
        v
Provisional Product Direction may be selected
        |
        v
Bounded reversible milestone may be authorized
        |
        v
Deterministic implementation qualification

Human Product Review remains open in parallel
        |
        v
Final Product Direction validation/revision later
```

The distinction is:

```text
implementation correctness != human product quality
repository evidence         != player preference
provisional direction       != validated final direction
```

## What may now be authorized

A provisional milestone may:

- deepen an already-demonstrated player-facing loop;
- improve causal or provenance legibility using already-earned evidence;
- expose existing mastery/delegation state more coherently;
- add bounded semantic applications of existing capabilities when independently justified;
- add tests, diagnostics, and read-only projections;
- remain compatible with current save/state authority unless a separately justified migration is approved.

## What remains prohibited without stronger evidence

This decision does **not** authorize:

- claiming fresh-player comprehension, discoverability, fun, pacing quality, fairness, retention, emotional impact, or preference;
- closing issue #109 as a human PASS without genuine human observation;
- generalized `ChapterEngine` or narrative DSL work;
- autonomous Copy planning or automatic irreversible decisions;
- offline narrative/social/world decision execution;
- open-world, economy, rumor, belief, or NPC-schedule simulation by inertia;
- broad content-volume expansion merely because architecture can support it;
- large irreversible migrations whose value depends on the provisional product hypothesis being correct.

## Reversibility requirement

Work authorized by this decision should prefer:

```text
read-only projection
pure selector/helper
small authored metadata
bounded UI surface
focused qualification
```

over:

```text
new canonical state
new persistence root
new generalized engine
new autonomous authority
large schema migration
```

A later Product Direction revision must be able to retire the provisional surface without corrupting canonical gameplay state.

## Human evidence remains valuable

Issue #109 remains open as the human Product Review evidence backlog. It is no longer a hard blocker to **all** development under this provisional exception, but it remains the authority for claims that require fresh human observation.

When genuine evidence becomes available, it should be used to:

- validate or reject the provisional primary promise;
- identify comprehension or pacing failures;
- decide which system deserves disproportionate depth;
- determine whether M26 assumptions should continue into later milestones.

## Exit / supersession

This provisional governance decision ends when either:

1. sufficient human evidence supports a final Product Direction Decision; or
2. a later explicit governance decision replaces this exception.

Until then every product-direction and milestone record created under this authority must carry **PROVISIONAL / HUMAN-UNVALIDATED** prominently.