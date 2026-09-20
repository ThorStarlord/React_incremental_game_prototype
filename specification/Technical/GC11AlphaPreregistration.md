# GC-11 Whole-Game Alpha Qualification Preregistration

**Status:** QUALIFICATION PREREGISTRATION  
**Program:** Campaign One / 1.0 Game Completion  
**Prepared:** 2026-09-20

## Goal

Qualify the repository as a whole playable **Alpha** without adding a new gameplay system.

Alpha means a normal production-equivalent action path can start from fresh New Game and legally reach the state-responsive Campaign One epilogue, while the repository also proves the required capability, delegation, persistence, and authority boundaries.

Alpha remains **HUMAN-UNVALIDATED**. It does not claim comprehension, pacing, balance, enjoyment, or presentation quality.

## Proof structure

Do not make one giant test responsible for every contract. Use one whole-campaign reachability spine plus focused supporting proofs.

### A. Fresh-save happy path

Start from the same fresh-reset/New Game thunks used by production UI.

The path must use production-equivalent actions:

- player-facing travel thunk or the same canonical location action consumed by ordinary travel where a chapter's existing UI invokes it;
- NPC interaction thunk for authored dialogue;
- Quest start/resolution/turn-in thunks;
- active relationship/Trait resonance thunks where capability acquisition is required;
- explicit Copy task assignment only after personal mastery;
- save/load helpers used by production persistence.

Direct `replaceState`, debug grants, hand-authored Experience insertion, direct Knowledge injection, and direct World State mutation are forbidden in the whole-campaign happy path.

### B. Representative divergent history

Run at least one materially different legal late-game route:

- one baseline-capable route and one specialized build route;
- preserve a different Chapter 1/6/7 history where practical;
- reach a different legal Telluric Echo outcome and epilogue.

This is not exhaustive combinatorial testing.

### C. Capability/build floor

Reuse/extend qualified evidence that proves:

- four durable relationship-derived capability identities;
- at least three source anchors;
- at least two cross-domain capabilities;
- two viable late-game build profiles.

The Alpha gate may invoke existing focused tests; it must not duplicate their internal logic unnecessarily.

### D. Delegation floor

Reuse/extend qualified evidence that proves:

- three personally mastered routines across at least two contexts;
- explicit player-authored Copy task choice;
- Copy readiness remains separate from player mastery;
- allowed routine work can advance offline;
- no narrative/social/Faction/World State/Quest-resolution/travel/combat decision advances offline.

### E. Persistence boundaries

Qualify canonical save/load at:

1. early campaign;
2. mid campaign;
3. immediately before finale;
4. campaign complete.

Also qualify import/export on a representative whole-campaign state if existing persistence authority exposes a production-equivalent import/export path.

### F. Critical-path surface

Prove:

- ordinary primary navigation contains no required CUT/deferred placeholder dependency;
- required campaign progression never requires DebugPage;
- every campaign chapter projection references authored canonical evidence;
- the full production content graph has no blocking reachability/integrity issue on the Campaign One spine.

## Expected files

Prefer a bounded qualification package:

- `src/features/Story/GC11AlphaWholeGame.test.tsx` — fresh-save reachability + representative divergence;
- focused persistence extension only if current save tests do not expose required boundaries;
- `npm run alpha:validate`;
- permanent Build Validation Alpha step;
- `GC11AlphaResult.md` only after one exact candidate head passes.

## Rejection rules

Alpha fails rather than inventing architecture when it finds:

- `MISSING_CAMPAIGN_UNIT`;
- `UNREACHABLE_CONTENT`;
- `BROKEN_STATE_TRANSITION`;
- `SAVE_INCOMPATIBILITY`;
- `PROHIBITED_AUTOMATION`;
- `PLACEHOLDER_DEPENDENCY`;
- `SCOPE_DRIFT`;
- `QUALIFICATION_GAP`.

Fix the smallest demonstrated layer.

## Human evidence ceiling

A green Alpha is reported as:

```text
ALPHA_PASS
HUMAN_UNVALIDATED
```

until real Beta evidence exists. Issue #109 remains the human-review backlog unless superseded by a later explicit record.
