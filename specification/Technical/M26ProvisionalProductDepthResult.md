# M26 Provisional Product-Depth Result

**Status:** CANDIDATE — PROVISIONAL / HUMAN-UNVALIDATED  
**Milestone:** M26  
**Governance:** `PostM25ProvisionalGovernanceDecision.md` / issue #111  
**Direction:** `PostM25ProvisionalProductDirectionDecision.md`  
**Roadmap:** `M26ProvisionalProductDepthRoadmap.md`  
**Human Product Review:** issue #109 OPEN / UNPROVEN

## Candidate outcome

M26 implements the bounded learn-to-delegate provenance slice without introducing new canonical gameplay authority.

### M26.1 — Relationship Capability Provenance

`selectRelationshipBuildCapabilities` now projects the player-visible Memories that canonical Trait assimilation already recorded in `traitAssimilationByKey.qualifyingMemoryIds`.

The projection:

- resolves only existing qualifying Memory IDs;
- rejects Memories that are not `playerVisible`;
- rejects qualifying IDs from a different source NPC;
- uses current Memory interpretation when available;
- resolves the origin Experience title as the causal label;
- sorts visible evidence newest-first;
- leaves Trait discovery, assimilation, resonance, permanence, and save state unchanged.

Player Insight renders those Memories as **Learned through remembered experience**. Developing capabilities no longer need to expose raw required-memory tags in player-facing UI.

### M26.2 — Mastered Routine / Delegation Provenance

`selectMasteredRoutines` projects only routines with an existing `PlayerState.routineFamiliarity` record. It translates the two current canonical sources without changing stored values:

```text
city_center_forge_assistance -> practiced Forge Assistance personally in the City Center
trait_resonance              -> completed Trait resonance personally
```

Player Insight now includes **Mastered Routines** so personal mastery is visible independently from Copy-specific readiness.

`presentCopyProductionTaskReadiness` is a pure presentation helper over the existing M20 `evaluateCopyProductionTaskEligibility` result. It distinguishes:

```text
unmastered   -> player has not yet learned the routine
copy_blocked -> player mastered it, but this Copy still fails M20 requirements
ready        -> player mastered it and M20 says this Copy is eligible
```

`CopyDetailPanel` uses that projection while preserving the existing Assign / Prioritize / Start Preferred actions and one-active-task authority. No automatic chaining or autonomous choice is added.

### M26.3 — Integrated qualification

Candidate qualification adds:

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

Build Validation now runs the focused M26 gate before TypeScript.

## Authority preservation

M26 creates no new:

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

## Qualification state

This result remains **CANDIDATE** until the exact implementation head receives full Build Validation and is merged. Record the exact candidate SHA, Build Validation run, and merge commit here during the final handoff.

## Evidence ceiling

Even after a technical PASS, M26 cannot establish that players understand or value the provenance language, that relationship-derived buildcraft is compelling, that delegation feels rewarding, or that pacing/fun/retention are good.

Those claims remain under issue #109. The Product Direction remains provisional until genuine human evidence or a later explicit governance revision changes that status.

## Stop condition

If exact-head qualification passes, merge this bounded M26 implementation and reconcile repository authority. Do not infer or authorize M27 from a green M26 alone.