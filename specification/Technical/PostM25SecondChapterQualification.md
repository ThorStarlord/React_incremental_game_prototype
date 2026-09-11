# Post-M25 Second Heterogeneous Chapter Qualification

**Status:** `REPOSITORY_ONLY / HERMETIC_VALIDATION`  
**Owner direction:** continue post-M25 repository development without waiting for Human Integrated Playability Review  
**Human product-quality evidence:** still `UNPROVEN`  
**Runtime ChapterEngine introduced:** No

## Purpose

The post-M25 direction proposed a second structurally different chapter before introducing generalized chapter infrastructure. This package qualifies that second chapter-scale composition using the already-authored Scholar Elara inquiry arc rather than adding a parallel chapter state machine.

The chapter is named **Archive Inquiry** and has a deliberately different center of gravity from M25 Merchant District:

```text
Merchant District Crisis
-> institutions
-> trade
-> public order
-> social coordination

Archive Inquiry
-> contradictory evidence
-> model revision
-> reciprocal correction
-> independent verification
-> relationship-derived capability
```

## Authority model

`src/features/Story/ChapterDefinitions.ts` is a presentation/qualification projection only.

It does not own gameplay state. Completion is derived from canonical existing authorities:

```text
Relationship Experiences
+ NPC completed dialogue state where applicable
-> derived chapter/route presentation
```

No new save root, reducer, chapter flag, condition DSL, or generalized ChapterEngine is introduced.

## Archive Inquiry routes

### Route A — Evidence Over Ownership

```text
A Useful Objection
-> The Contradictory Footnote
-> A Model Put at Risk
-> Evidence Over Ownership
-> Revision Is Mutual
-> A Theory Neither Owned
-> The Result Held Without Her
```

The route preserves the costly-correction memory `elara_memory_footnote_won`.

### Route B — Cautious Consensus, Later Reopened

```text
A Useful Objection
-> The Contradictory Footnote
-> A Model Put at Risk
-> Consensus Preserved
-> Revision Is Mutual
-> A Theory Neither Owned
-> The Result Held Without Her
```

This route deliberately does not fabricate `elara_memory_footnote_won`. It can still reach reciprocal inquiry and independent verification later.

## Shared capability outcome without shared history

Both routes may eventually satisfy the existing requirements for permanent `ScholarlyInsight`.

That composition demonstrates:

```text
different relationship history
+ different memory history
-> can converge on one earned cognitive capability
without erasing the route-specific past
```

This is useful evidence for the proposed relationship-derived build direction: a Trait is durable capability authority, while Relationship remains the authority for how that capability was learned.

## Qualification

`src/features/Story/PostM25SecondChapterQualification.test.ts` verifies:

1. Merchant District and Archive Inquiry exist as two distinct presentation definitions;
2. no new chapter/story reducer or save authority is introduced;
3. both Archive Inquiry routes derive from existing Relationship evidence;
4. the two routes preserve different experience and Memory histories;
5. both can converge on permanent `ScholarlyInsight` through the already-qualified Trait acquisition path;
6. partial evidence derives `in_progress` rather than fabricating completion.

## Evidence ceiling

This repository qualification does not establish that a human perceives Archive Inquiry as a satisfying chapter, understands the route distinction, values Scholarly Insight, enjoys the pacing, or wants further content.

Those remain human/product questions. This package only establishes that a second heterogeneous chapter-scale composition can be represented and qualified without a ChapterEngine or duplicate canonical state.
