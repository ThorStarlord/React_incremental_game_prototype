# M26 Provisional Product-Depth Result

**Status:** COMPLETE / INTEGRATED — PROVISIONAL / HUMAN-UNVALIDATED  
**Milestone:** M26  
**Governance:** `PostM25ProvisionalGovernanceDecision.md` / issue #111  
**Direction:** `PostM25ProvisionalProductDirectionDecision.md`  
**Roadmap:** `M26ProvisionalProductDepthRoadmap.md`  
**Human Product Review:** issue #109 OPEN / UNPROVEN  
**Qualified candidate:** `9b9b0380f0a2bb23d89036a8b0b133a7ffe133cf`  
**Build Validation:** #340 / run `34624393744` — PASS  
**PR:** #114  
**Merge commit:** `7f306f3b6a69a27c250c1986df976cc518119821`

## Outcome

M26 completed the bounded learn-to-delegate provenance slice without introducing new canonical gameplay authority.

### M26.1 — Relationship Capability Provenance

`selectRelationshipBuildCapabilities` projects the player-visible Memories that canonical Trait assimilation already recorded in `traitAssimilationByKey.qualifyingMemoryIds`.

The projection:

- resolves only existing qualifying Memory IDs;
- rejects Memories that are not `playerVisible`;
- rejects qualifying IDs from a different source NPC;
- uses current Memory interpretation when available;
- resolves the origin Experience title as the causal label;
- sorts visible evidence newest-first;
- leaves Trait discovery, assimilation, resonance, permanence, and save state unchanged.

Player Insight renders those Memories as **Learned through remembered experience**. Developing capabilities no longer expose raw required-memory tags as player-facing explanation.

### M26.2 — Mastered Routine / Delegation Provenance

`selectMasteredRoutines` projects only routines with an existing `PlayerState.routineFamiliarity` record. It translates the current canonical sources without changing stored values:

```text
city_center_forge_assistance -> practiced Forge Assistance personally in the City Center
trait_resonance              -> completed Trait resonance personally
```

Player Insight includes **Mastered Routines**, making personal mastery visible independently from Copy-specific readiness.

`presentCopyProductionTaskReadiness` remains a pure presentation helper over the existing M20 `evaluateCopyProductionTaskEligibility` result:

```text
unmastered   -> player has not yet learned the routine
copy_blocked -> player mastered it, but this Copy still fails M20 requirements
ready        -> player mastered it and M20 says this Copy is eligible
```

`CopyDetailPanel` preserves the existing Assign / Prioritize / Start Preferred actions and one-active-task authority. No automatic chaining or autonomous choice was added.

### M26.3 — Integrated qualification

M26 added:

```bash
npm run m26:validate
```

The focused suite covers:

- undiscovered Traits remain absent;
- hidden qualifying Memories remain absent;
- visible qualifying Memories appear with causal provenance;
- permanent Trait state remains capability authority;
- only recorded routine familiarity appears as mastery;
- mastery source is translated without stored-state mutation;
- Copy readiness remains the existing M20 eligibility result;
- Player Insight remains read-only;
- Copy task start/priority remains explicit player action.

Build Validation runs the focused M26 gate before TypeScript.

## Qualification history

### First candidate — failed for historical wording drift

```text
candidate: 2dcb1e68619b76dc1a8fe7a5e5df2e963b4df1ea
Build Validation #339: FAILURE
```

The M26-specific gate, TypeScript, UI smoke, timing/progression gates, and the later milestone gates reached before the failure were green. The failure occurred in `CheckpointCIncrementalIntegrationRepair.test.tsx`: an old assertion still expected the pre-M26 Copy-detail wording (`Routine understood.` / `Locked: ...`) verbatim.

This was **test-contract drift**, not a gameplay-authority regression. M26 intentionally replaced that wording with the clearer distinction between personal mastery and Copy-specific readiness.

### Repair

Only the stale player-facing wording expectations were updated. The historical test still proves:

- Forge delegation remains rejected before familiarity;
- direct City Center practice teaches Forge familiarity exactly once;
- failed Trait resonance does not teach calibration;
- successful Trait resonance does;
- familiar eligible work can be assigned;
- unfamiliar work remains disabled;
- familiarity persists through save/load;
- offline settlement remains bounded/idempotent;
- no hidden automatic reassignment or autonomous decision was introduced.

### Exact qualified candidate

```text
candidate: 9b9b0380f0a2bb23d89036a8b0b133a7ffe133cf
Build Validation #340
run: 34624393744
result: PASS
```

The exact candidate passed:

- documentation authority;
- content intelligence + chapter integrity;
- heterogeneous chapter qualification;
- Player Insight and product-depth gates;
- synthetic review contracts and live UI smoke;
- M26 qualification;
- TypeScript;
- complete timing/backpressure/lifecycle/drift stack;
- timed-Quest and live/offline boundaries;
- M20–M25;
- repaired Checkpoint C;
- active-loop and modified historical regressions;
- accumulated M4–M19 baseline;
- production build.

PR #114 then merged as `7f306f3b6a69a27c250c1986df976cc518119821`.

## Authority preservation

M26 created no new:

- Redux slice;
- persistence root;
- Trait discovery/permanence rule;
- Relationship assimilation rule;
- routine-familiarity ID;
- Copy task definition;
- Copy scheduling/autonomy rule;
- offline progression authority;
- chapter engine or narrative condition language.

The authoritative chain remains:

```text
Relationship / Memory          -> learning provenance
Trait permanent state          -> durable capability authority
Player routine familiarity     -> personal routine mastery
M20 Copy eligibility evaluator -> Copy-specific delegation readiness
Player explicit action         -> task choice / start
```

## Evidence ceiling

M26 proves implementation fidelity only. It does **not** establish that players understand or value the provenance language, that relationship-derived buildcraft is compelling, that delegation feels rewarding, or that pacing/fun/retention are good.

Those human-quality claims remain under issue #109 and the later Beta completion gate.

## Program transition

M26 is the final numbered milestone in the previous product-depth sequence. A green M26 does **not** imply M27.

Further work is governed by:

```text
GameCompletionDefinition.md
-> FeatureScopeMatrix.md
-> GameProgressionArc.md / CampaignArchitecture.md
-> GameCompletionRoadmap.md
-> Alpha / Beta / Release completion contracts
```

The next question is no longer “what milestone comes after M26?” It is “which unsatisfied 1.0 completion requirement is the current bottleneck?”
