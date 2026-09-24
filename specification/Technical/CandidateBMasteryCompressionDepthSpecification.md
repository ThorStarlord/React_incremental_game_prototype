# Candidate B Depth Specification — Mastery Compression / Copy Organization

**Status:** CURRENT DEPTH SPECIFICATION — FEATURE COMPLETION CANDIDATE B  
**Prepared:** 2026-09-24  
**Parent analysis:** FeatureCompletionGapAnalysis.md  
**Runtime authority:** CopyStandingOrdersAndExceptionEscalationResult.md + ../Features/CopySystem.md

## Decision

Deepen Mastery Compression with exactly one second standing responsibility: the already-mastered **Forge Assistance** routine.

Do not add Standing Orders to every routine by symmetry. Resonance Calibration remains one-shot delegation until a real maintenance condition exists beyond passive Essence generation.

Forge is the strongest second proof because it differs materially from Archive Verification:

~~~
Archive Verification -> researcher/agent -> epistemic work -> contradiction exception
Forge Assistance     -> guardian/agent   -> City Center physical upkeep -> structural exception
~~~

This creates organizational differentiation between Copies while reusing existing mastery, role, location, task, GameLoop, persistence, and exception authorities.

## Finished-game role

Late Campaign One should move the player from repeated procedure to policy and exception judgment:

~~~
personal practice
-> one-shot delegation
-> standing responsibility
-> normal known work becomes quiet
-> anomaly exits the known envelope
-> player attention returns
~~~

Copies become a small player-authored operating network. They do not invent goals, move themselves, choose story outcomes, or make irreversible decisions.

## State changes

Keep the existing Copy root and authorities. Add only:

- a Forge Standing Order condition: forge_maintenance_backlog with targetPending = 0;
- an optional CopiesState.forgeMaintenanceCasesById map;
- a ForgeMaintenanceCase with status pending / in_progress / maintained / escalated;
- classifications routine_upkeep / structural_deviation;
- one new CopyException context code: forge_structural_deviation.

A Forge case is Copy-domain procedural work. It is not Inventory, Crafting, World State, Quest state, or a generic job queue.

## Safe operating envelope

A Forge Standing Order may start one case only when:

1. the player personally mastered forge_assistance;
2. the player explicitly enabled that Standing Order;
3. forge_assistance is in the Copy's normalized routinePriority;
4. the Copy is idle;
5. existing Forge eligibility passes: maturity 50+, guardian or agent role, and canonical City Center presence;
6. no unresolved Forge exception blocks that Copy;
7. at least one pending Forge case exists.

Selection remains deterministic: oldest createdAtTick, then stable id. At most one standing task starts per Copy per admitted live tick.

## Structural-deviation exception

A structural_deviation case means the Copy encountered a load or safety condition outside the mastered Forge Assistance procedure.

On completion:

~~~
standing Forge task completes
-> no normal reward
-> no role completion bonus
-> case becomes escalated
-> exactly one durable forge_structural_deviation exception is recorded
-> active task clears
-> that Copy's Forge responsibility pauses
-> Archive responsibility remains independent
~~~

Acknowledge is not resolution.

Resolution must be an explicit player action at the City Center using existing authored interaction/NPC infrastructure. Prefer a small Gronk/Forge interaction such as Inspect and Reframe rather than a new Crafting system or generic exception engine.

## Campaign work feed

Standing work must be finite and authored. It must never generate its own infinite backlog.

The first work feed should use existing GC09 structural/logistics preparation:

- Structural Counterphase already sends the player to City Center to finalize load-path deployment.
- Fortified Counterphase already represents bounded logistics preparation.
- At least one of these paths should create a routine Forge case.
- At least one authored late-game Forge case should be structural_deviation so the second exception family is exercised in real campaign play.

Distributed and Diagnostic routes must remain legal without Forge mastery. Standing responsibility is earned leverage, not a universal progression tax.

## Runtime refactor boundary

CopyStandingOrderEngine should gain only two typed branches: Archive and Forge. Do not add callbacks, a registry, a behavior tree, or a condition DSL.

processCopyStandingOrdersThunk currently assumes every standing subject is an Archive case. Replace that with one small typed switch that assigns either an ArchiveVerificationCase or ForgeMaintenanceCase.

processCopyTasksThunk currently contains Archive-specific standing completion. Extract only the smallest typed helper needed to resolve Archive vs Forge completion while leaving ordinary task rewards and existing production-task authority intact.

Preserve all current timing rules:

- stable Copy ordering;
- routinePriority arbitration;
- one active task per Copy;
- no leftover-delta chaining;
- no offline Standing Order selection;
- already-running safe task may still complete offline;
- the first live tick after return may evaluate policy.

## Player-facing behavior

Copy Detail should show, for Forge:

- Standing Order switch;
- City Center requirement and current eligibility reasons;
- pending maintenance count;
- status: clear / maintaining / blocked by readiness or location / needs your judgment;
- structural-deviation exception summary;
- Acknowledge separately from Resolve.

The surface should make division of responsibility legible, for example:

~~~
Guardian Copy — City Center — Forge Assistance: Standing
Researcher Copy — Archive Verification: Standing
~~~

Normal standing starts/completions stay quiet. Exceptions create the interruption. Player Insight remains read-only and adds Forge structural deviations to Needs your judgment.

## Explicit non-goals

This package does not authorize Resonance Calibration Standing Orders, new routine IDs, generic work schemas, arbitrary task queues, autonomous travel, auto-role assignment, autonomous strategy, automatic Quest/counterphase choices, Crafting/Inventory expansion, offline chaining, or infinite passive Forge case generation.

## End-to-end target trace

~~~
player practices Forge Assistance personally
-> player develops an eligible Guardian/Agent Copy in City Center
-> player enables Forge Standing Order
-> GC09 creates finite maintenance work
-> Copy handles routine case quietly
-> later structural-deviation case exceeds procedure
-> durable exception opens and Forge responsibility pauses
-> player returns to City Center and resolves it explicitly
-> Forge responsibility may resume
-> another Copy's Archive responsibility was never blocked
~~~

The experiential proof is that routine normality disappears from player attention while unfamiliar operational uncertainty returns to it.

## Qualification

Add focused deterministic coverage proving:

1. personal-mastery gate;
2. existing maturity/role/location eligibility;
3. no auto-move or auto-role;
4. deterministic oldest-case assignment;
5. silent normal standing completion;
6. no same-delta chaining;
7. two Copies cannot claim the same case;
8. Archive and Forge responsibilities remain independent;
9. structural deviation creates exactly one durable blocking exception;
10. no ordinary reward/role bonus on exception;
11. acknowledge does not resolve;
12. explicit City Center player resolution closes the exception;
13. later Forge work can resume;
14. case/exception state survives save/load;
15. offline settlement never selects the next standing case;
16. existing Archive, M20, M21, GameLoop, GC09, and whole-campaign regressions remain green.

## Candidate B exit test

After this slice, reassess before adding more automation. Candidate B moves toward L3 only if Archive + Forge together demonstrate:

- more than one operational context;
- meaningful role/location differentiation;
- more than one exception family;
- multiple Copies can form a legible responsibility network;
- attention compression is structurally real rather than passive-income multiplication.

If that is true, do not automatically add Resonance Calibration. Add another standing responsibility only if it creates a materially different player role.

## Governing conclusion

> The next Copy feature is not more automation for its own sake. It is the second proof that mastered work can become quiet standing responsibility while unfamiliar conditions still return to the player.

> Mastery Compression is complete only when player attention moves upward from repeated procedure to policy and exception judgment.
