# GC-03 Opening Campaign Spine Result

**Status:** COMPLETE / INTEGRATED  
**Program:** Campaign One / 1.0 Game Completion  
**Integrated:** 2026-09-20  
**Implementation PR:** #121  
**Qualified head:** `dc0fd39420a618ff9ab74cf90e031bb849bac404`  
**Build Validation:** #353 / run `35523216769` / PASS  
**Merge commit:** `a8f313125b67f5c368033129344092e2e25dd63f`

## Requirement closed

GC-03 closes the opening campaign-spine integration requirement:

```text
New Game
-> Prologue / Elder Willow / First Lesson
-> Merchant District Crisis
-> Archive Inquiry
-> Enemies in Phase
```

The sequence is now projected from canonical Relationship and completed-dialogue evidence instead of isolated chapter projections.

## Implementation

The package adds:

- a sequential opening Campaign One selector derived from existing chapter requirements;
- one ordinary-UI campaign objective surface;
- bounded post-Prologue Campaign One NPC-cast expansion;
- preservation of already-progressed NPC state when later anchors become reachable;
- Chapter 1 route-agnostic transition to Archive Inquiry;
- Archive Inquiry transition to Lyra / Enemies in Phase;
- canonical save/load survival of derived opening-spine completion;
- `npm run gc03:validate` and permanent Build Validation coverage.

## Canonical transition evidence

```text
willow_exp_first_lesson
-> Chapter 1 cast becomes reachable

valerius_m25_public_order_conclusion
OR gronk_m25_quiet_network_conclusion
-> Scholar Elara becomes reachable

elara_exp_independent_verification
-> Lyra becomes reachable

existing chapter route evidence
-> opening-spine stage projection
```

The unlock listeners expose existing authored content. They do not create chapter completion state.

## Rejection boundaries

The focused qualification proves:

- later chapter evidence cannot skip an unfinished Prologue or earlier chapter;
- NPC expansion does not overwrite Elder Willow progress;
- raw chapter requirement IDs are not exposed as the ordinary player objective;
- GC-03 completion remains derived after canonical save/load;
- no `chapter` or `story` Redux/save root exists;
- no ChapterEngine, narrative DSL, or generalized campaign state machine is introduced.

## Exact-head qualification

Build Validation #353 passed the exact GC-03 head, including:

- documentation authority;
- GC-01, GC-02 and GC-03 focused gates;
- content intelligence and chapter integrity;
- product-depth and player-insight suites;
- TypeScript;
- live UI smoke;
- GameLoop timing/backpressure/lifecycle/drift;
- Quest precision;
- offline boundary;
- M20-M25 and accumulated historical regressions;
- production build.

## Product evidence boundary

GC-03 proves implementation reachability and deterministic composition. It does **not** prove fresh-player comprehension, pacing, fun, balance, retention, or preference. Issue #109 remains the human-product evidence authority for Beta.

## Next responsibility

Do not create GC-04/GC-05 feature work by package-number inertia.

First reconcile actual integrated campaign evidence against the 1.0 floors:

- four durable relationship-derived capability identities across at least three anchors;
- two meaningful cross-domain capabilities;
- two viable late-game build profiles;
- three personally mastered routines across at least two learning contexts.

Only the missing floor should create implementation work. Chapter packages may satisfy those gaps naturally.

## Governing conclusion

> GC-03 turns the already-qualified Prologue and Chapters 1–3 from separate evidence islands into one sequential production opening without creating a second narrative-state authority.
