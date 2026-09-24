# Mastery Compression Procedure Families + Organizational Ceiling

**Status:** REPOSITORY-IMPLEMENTED BOUNDED FEATURE AUTHORITY / HUMAN-UNVALIDATED  
**Evidence class:** DETERMINISTIC_FINDING + bounded product-direction implementation  
**Scope:** Campaign One earned delegation / mastery compression  
**Original implementation baseline:** `d2bc00e6a91d94f9363fd7582064849e49fc0607`  
**Reconciled feature-completion baseline:** `b493ef13a71df0cc08881f6f8117a8df127984e3`  

## Purpose

Extend the already-authorized standing-order slice without creating another
progression root, a generalized Copy planner, or a managers-of-managers layer.

The implementation makes the campaign-wide abstraction ladder visible:

```text
specific personally mastered routine
-> evidence-qualified procedure family
-> known-state operational readiness
-> authored standing responsibility
-> exception escalation
-> player judgment
```

This is a read-only interpretation of canonical state. It does not grant mastery,
start tasks, resolve exceptions, or create a new save authority.

## 1. State authority

No new Redux slice or persisted field is introduced.

The projection reads only:

```text
player.routineFamiliarity
copy.copies[*].standingOrders
copy.copies[*].role / identity
copy.exceptionsById
```

Runtime task selection remains owned by the PR #146 standing-order path and the
existing M20 production-task executor.

## 2. Procedure-family generalization

Campaign One now recognizes one deliberately narrow family:

```text
Resonance Calibration
+
Archive Verification
-> Network Assurance
```

The family is derived only when both existing personal-mastery records exist.

Its semantic commonality is bounded:

> preserve a known-good state, test that state against established evidence, and
> return anomalies rather than inventing a novel interpretation.

Forge Assistance does not silently generalize into this family. It remains an
independent mastered routine and supplies additional evidence for the higher
operational-domain projection.

## 3. Known-State Stewardship

The first operational-domain projection is:

```text
Network Assurance mastered
+
Forge Assistance mastered
-> Known-State Stewardship READY

READY
+
authored Archive Verification standing responsibility active
-> OPERATING

OPERATING
+
unresolved Copy exception
-> ATTENTION REQUIRED
```

This status is explanatory only. It does not allow a Copy to execute any task
that the existing task catalog / eligibility / standing-order authorities would
otherwise reject.

## 4. Escalation boundary

The player-facing model names five reasons that future bounded automation must
treat as owner boundaries:

1. unknown or conflicting evidence;
2. conflicting authorized policies;
3. irreversible consequence;
4. novel social judgment;
5. repeated procedure failure.

Only the already-implemented Archive source contradiction is generated at
runtime in this package. It maps to **unknown or conflicting evidence**.

The other boundary names are semantic policy, not new runtime exception
generators.

## 5. Campaign One organizational ceiling

Campaign One is explicitly capped at:

```text
PLAYER
  -> SPECIALIZED COPIES
       -> PLAYER-AUTHORED ROUTINE PRIORITIES
       -> AUTHORED STANDING RESPONSIBILITIES
       -> EXCEPTION ESCALATION BACK TO PLAYER
```

Allowed:

- specialized Copy roles;
- player-authored routine priorities;
- authored standing condition maintenance for personally mastered work;
- durable exception escalation.

Outside Campaign One:

- Copy-managed subordinate Copies;
- generic queues / behavior planners;
- autonomous strategic goal selection;
- irreversible narrative, social, faction, or world decisions;
- offline standing-order selection / chaining.

This is intentionally enough organizational depth to prove that personal
understanding can become durable operating structure without turning Campaign
One into an empire-management simulation.

## 6. Player-facing projection

Player Insight now shows:

- whether the Network Assurance procedure family is still developing or
  generalized;
- whether Known-State Stewardship is developing, ready, operating, or blocked
  on player attention;
- which standing responsibilities currently run under which Copies;
- the Campaign One organizational ceiling;
- the explicit escalation-boundary explanation on durable Copy exceptions.

Player Insight remains read-only.

## 7. Epilogue payoff

The state-responsive Campaign One epilogue now projects Mastery Compression.

When a standing responsibility is active, the ending can state that known work
continues without direct scheduling while anomalies still return to the player.

When routines are mastered but no standing responsibility is active, the ending
states that the knowledge remains durable but still requires direct scheduling.

This does not alter finale legality or permit delegated finale resolution.

## 8. Qualification

Focused command:

```bash
npm run copy-standing-orders:validate
```

The command now includes `MasteryCompression.test.ts` alongside the existing
standing-order and Copy-strategy qualification.

Required deterministic assertions include:

- one routine alone does not generalize Network Assurance;
- both required routines do;
- all three campaign routines create Known-State Stewardship readiness;
- an active authored standing responsibility changes readiness to operating;
- an unresolved Copy exception changes operating to attention-required;
- source contradiction maps to the explicit player-owned escalation boundary;
- epilogue projection reports standing responsibility without claiming
  autonomous strategic authority.

Implementation head `d52dce5f41e5fb940106d6183f4b97746d5e4624` passed Build Validation #452 end-to-end, including the focused Mastery Compression/standing-order gate, Player Insight projection, whole-game Alpha, deterministic Beta readiness, TypeScript, Chromium/Firefox qualification, live UI smoke, GameLoop timing suites, offline/delegation boundaries, historical regressions, and production build.

## 9. Evidence ceiling

This implementation does not establish that players understand, prefer, or enjoy
procedure-family language, standing responsibilities, exception frequency, or
the epilogue payoff. Those remain HUMAN_FINDING questions under the current Beta
contract.

It also does not authorize additional routine IDs, additional standing-order
evaluators, generalized procedure discovery, managers-of-managers, or autonomous
strategy.


## 10. Relationship to Candidate B feature completion

Current main now owns
`CandidateBMasteryCompressionDepthSpecification.md`, which selects a second
**Forge Assistance** standing responsibility as the next runtime depth package.

This package does **not** supersede or satisfy that depth specification. It adds
the organizational-legibility foundation around the already-qualified Archive
standing responsibility:

```text
personal routine mastery
-> bounded procedure-family understanding
-> operational-domain readiness
-> authored standing responsibility
-> exception escalation
-> player judgment
```

That projection gives the later Archive + Forge responsibility network a player-
facing vocabulary without pre-authorizing Forge runtime behavior, a generic
planner, or managers-of-managers.

## 11. Qualification provenance

Before reconciliation onto the feature-completion baseline:

- Build Validation #450 exposed one TypeScript exhaustiveness defect;
- the defect was repaired;
- Build Validation #451 passed end-to-end;
- selector memoization removed the React-Redux unstable-selector warning;
- Build Validation #452 passed end-to-end on implementation head
  `d52dce5f41e5fb940106d6183f4b97746d5e4624`;
- documentation closeout head `bd7520747340ee8ee54cd0d06d126cc87287acef`
  passed Build Validation #455.

The reconciled branch must still pass the repository's exact-head Build
Validation before integration. The PR check run is the final integration
evidence; this record intentionally does not require another post-pass mutation.

Human comprehension, preference, pacing, and enjoyment remain outside
deterministic qualification.
