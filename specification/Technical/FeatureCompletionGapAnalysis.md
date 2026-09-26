# Feature Completion Gap Analysis — Campaign One / 1.0

**Status:** CURRENT STRATEGIC ANALYSIS — FEATURE_COMPLETION / PRODUCT_DEPTH  
**Prepared:** 2026-09-24  
**Parent authorities:** ../GameCompletionDefinition.md, ../Features/FeatureScopeMatrix.md  
**Historical evidence preserved:** GC-00 through GC-14 qualification records remain valid for the contracts they actually proved.

## Purpose

This analysis answers the corrected strategic question:

> Which existing Campaign One systems are merely scaffolded, vertically proven, or integrated, but still lack enough player-facing depth to perform their intended finished-game role?

The repository previously used bounded integration floors as if they were completion ceilings. That was useful for proving architecture and campaign composition, but it created premature pressure toward Beta/release hardening.

This document does **not** reopen the outer 1.0 scope. It does not authorize Chapters 8+, interplanetary continuation, generic Skills/Crafting, generalized simulation, a generic ChapterEngine, autonomous irreversible Copy planning, or other post-1.0 expansion.

It performs the required breadth pass before deeper feature work.

## Method

Use the current maturity ladder:

| Level | Meaning |
| --- | --- |
| L0 — Scaffold | State/UI/contract exists without a production gameplay proof. |
| L1 — Vertical Slice | One production path proves the concept end to end. |
| L2 — Integrated Feature | The feature composes legally with Campaign One and relevant canonical authorities. |
| L3 — Developed Feature | Breadth, variation, progression, and cross-system use sustain the intended player-facing role. |
| L4 — Feature Complete | Intended Campaign One gameplay is present; remaining work is mainly tuning, defects, accessibility, presentation, and polish. |
| L5 — Hardened | Reliability/UX/recovery/performance and edge cases have materially converged. |
| L6 — Release Qualified | One immutable release candidate has passed release qualification. |

Maturity is relative to the feature's **intended Campaign One role**, not to how large the system could theoretically become.

The breadth pass considers:

~~~
intended player role
current implementation
current maturity
gameplay breadth
gameplay depth
campaign progression
cross-system interactions
finished-feature gap
strategic importance
~~~

## Breadth scan

| System / feature | Current maturity | Intended Campaign One role | Highest-value remaining gap | Current action |
| --- | --- | --- | --- | --- |
| GameLoop / deterministic time | L5 | Reliable temporal substrate | No material product-depth gap identified | Preserve; no expansion |
| Player state / vitals / attributes | L2/L3 | Hold player progression facts consumed elsewhere | Depth should come through consuming systems, not a new universal progression layer | Preserve foundation |
| Relationship Experience / Memory / Connection | L3 | Make relationships consequential history and learning provenance | More later-game consequences should visibly consume accumulated relationship history | Deepen through buildcraft/strategic consumers |
| Traits / permanent capabilities | L2 | Primary relationship-derived capability buildcraft | Two bounded doctrine profiles and sparse downstream specialization consumption do not yet sustain a full buildcraft identity | **Depth candidate A** |
| Essence / Resonance | L2/L3 | Resource expression of relationship-mediated progression | Final balance and progression pressure are unproven; avoid expanding the economy before capability/delegation loops clarify demand | Tune later; support A/B |
| NPC interaction | L2 | Human-facing access to relationships, dialogue, services, and decisions | Breadth is mostly authored-content dependent | Deepen only through selected feature packages |
| Dialogue | L3 | Primary authored decision/consequence surface | Needs richer consumption of mature build/delegation/strategic state rather than a new dialogue engine | Use as integration surface |
| Quest | L2/L3 | Active problem/decision structure | Current contracts support richer feature use; missing depth is mostly in what quests consume | Use as integration surface |
| Exploration / authored travel | L1/L2 | Make place matter to choices, encounters, and relationship intensity | Small topology and limited gameplay consequence; unclear whether larger exploration depth is central to product promise | Secondary candidate; do not expand by inertia |
| Combat | L1 | Bounded tactical conflict where campaign needs active confrontation | One qualified encounter proves possibility but not a developed combat pillar; unclear whether more combat is necessary for product identity | Secondary candidate; require explicit depth case |
| Knowledge | L1/L2 | Track who knows objective facts independently from relationships and institutions | Very narrow fact breadth and limited strategic use | **Depth candidate C as part of composition** |
| Faction Reputation | L1/L2 | Track institutional standing independently from personal relationships | Bounded examples exist, but institutional standing rarely drives sustained strategy | **Depth candidate C as part of composition** |
| World State | L1/L2 | Persist objective regional consequences independently from beliefs/relationships | Bounded conditions exist but are not yet a strong strategic planning surface | **Depth candidate C as part of composition** |
| Copy system | L2 | Turn learned procedures into delegated execution while preserving player judgment | Copies execute tasks, but their campaign-wide organizational/policy role remains shallow | **Depth candidate B** |
| Routine familiarity / earned delegation | L2 | Make personal mastery unlock attention compression | Three routines exist; Standing Orders/Exceptions are only one Archive Verification vertical slice | **Depth candidate B — highest gap** |
| Persistence / save / load | L5 | Preserve the whole campaign and progression model safely | No product-depth expansion needed | Preserve/harden only on concrete defects |
| Save import / export | L4/L5 | Recovery/portability | Already sufficient for intended role | Preserve |
| Autosave | L4/L5 | Safe ordinary continuity | Already sufficient for intended role | Preserve |
| Bounded offline progression | L5 | Advance only safe approved repetition while absent | Contract is intentionally bounded and mature | Preserve boundary |
| Chapter-scale composition | L3/L4 | Compose heterogeneous domain authorities without shadow chapter state | Main need is richer feature consumption, not a chapter engine | Preserve architecture; feed A/B/C through it |
| Content intelligence / validation | L5 | Protect authored content and reachability | No product-depth gap | Preserve |
| Player Insight / causal provenance | L2/L3 | Make history, capability provenance, routines, and exceptions understandable | Must grow with A/B/C so increased systemic depth remains legible | Supporting depth candidate |
| Notifications / return summary | L3 | Surface meaningful change and exceptional attention | Adequate; exceptions should remain durable elsewhere | Preserve |
| Main menu / navigation | L3/L4 | Reach real player surfaces without placeholders | No strategic feature-depth gap | Preserve |
| Settings | L2 | Minimal release usability | Intentionally small | Preserve |
| Onboarding | L2 / human-unvalidated | Teach the actual game model through play | Should be revisited after the feature model stabilizes; polishing it now risks teaching a moving target | Defer dedicated hardening |
| Accessibility baseline | L1/L2 | Make intended controls/readability usable | Important, but repository-wide accessibility hardening should follow stabilization of actively changing gameplay surfaces; fix blockers opportunistically | Deferred convergence + local blockers |
| Desktop browser support | L5 technical | Supported delivery environment | Exact RC evidence is downstream | Preserve |

## Breadth-pass conclusion

The feature-completion problem is **concentrated**, not uniform.

Three clusters dominate expected player value:

1. **A — Relationship-derived capability buildcraft**
2. **B — Mastery Compression / Copy standing responsibility and exception escalation**
3. **C — Strategic consequence composition across Relationship / Knowledge / Faction / World State**

These three directly correspond to the provisional product hierarchy:

~~~
Primary promise      -> A: relationship-derived capability buildcraft
Incremental identity -> B: earned delegation / mastery compression
Supporting identity  -> C + Player Insight: causal legibility and strategic consequence
~~~

GameLoop, persistence, offline settlement, content validation, save/import-export, and browser infrastructure should not absorb the active development budget unless a concrete defect blocks A/B/C.

Combat and Exploration remain legitimate supporting systems, but the breadth pass does not yet justify expanding them into major pillars. Their next development should be pulled by concrete needs from A/B/C or campaign problems rather than by subsystem symmetry.

## Candidate A — Relationship-derived capability buildcraft

### Current proof

Campaign One now proves a bounded relationship-derived buildcraft loop without a generic skill tree:

- authored Relationship Experiences and Memories qualify capability provenance;
- four canonical relationship-derived Traits can become permanent Player capability;
- Willow/Elara capabilities have independent Quest + Combat consumers;
- Gronk/Lyra capabilities now have independent Quest + Dialogue consumers;
- Structural Steward and Countermodeler remain the only two authorized doctrine profiles;
- active doctrine matters repeatedly at GC06, GC08 preparation, and GC10 finale;
- GC07 and GC09 remain permanent-capability pair gates so permanent learning matters without repetitive switching tax;
- permanent Resonance, temporary/share staging, and doctrine focus have distinct fail-closed authority;
- Traits / Player Insight expose capability and doctrine provenance.

### Repository-owned depth disposition

The provisional L3 exit shape is now satisfied:

- both established doctrines have repeated meaningful consumers across multiple later contexts;
- every canonical source Trait matters independently outside doctrine participation;
- doctrine choices change legal approaches without deleting baseline routes;
- specialization remains bounded to strategic moments rather than mandatory menu churn;
- permanent capability availability is causally legible from visible provenance;
- Gronk/Lyra no longer lag Willow/Elara in cross-domain application.

The new GC08 dialogue consumers deliberately reuse the existing `DialogueNode` prerequisite seam:

~~~
ConstraintSense
-> independent distributed-preparation Quest use
-> permanent-Trait-gated Gronk dialogue
-> authored Relationship Experience consequence

AdversarialCalibration
-> independent distributed-preparation Quest use
-> permanent-Trait-gated Lyra dialogue
-> authored Relationship Experience consequence
~~~

Presentation and direct thunk execution enforce the same durable Player Trait authority. Missing Traits hide the topic without spoilers and reject direct invocation before effects commit.

### Remaining uncertainty

No additional Candidate-A construction is currently warranted merely to increase consumer count. The remaining questions are predominantly human/product-value questions:

- whether temporary experimentation/sharing deserves prominent player attention;
- whether doctrine switching feels meaningful rather than cumbersome;
- whether players understand the provenance/capability/specialization distinction;
- whether either profile is disproportionately attractive in practice.

Those remain HUMAN-UNVALIDATED and belong to Beta convergence unless later repository evidence exposes a concrete missing capability.

## Candidate B — Mastery Compression / Copy organization

### Current proof

Candidate B now has the bounded second standing-responsibility proof selected by its depth specification:

- personal action establishes routine familiarity;
- Copy readiness remains separate from personal mastery;
- Archive Verification gives researcher/agent epistemic standing responsibility;
- Forge Assistance gives guardian/agent City Center physical-maintenance standing responsibility;
- routine Archive backlog and Forge upkeep can become quiet known work;
- source contradiction and structural deviation are distinct exception families;
- unresolved exceptions pause only the affected responsibility and return judgment to the player;
- Archive and Forge responsibilities can coexist across multiple Copies;
- acknowledge does not resolve; player action must explicitly close out-of-envelope work;
- safe offline continuation does not select new standing work.

PR #154 qualified exact head `70c24d5a11c4238c60e1fdee9f83eb9164dd35f0` with Build Validation #468 / run `36120244452` and merged as `fbc19da437c0cfc7b0cd6dd9078741bc8b19f9f3`.

### Repository-owned depth disposition

The Candidate B exit test is satisfied:

- standing responsibility exists in more than one operational context;
- Copy role/location eligibility changes what can be owned;
- at least two qualitatively different exception families return player judgment;
- multiple Copies form a legible small responsibility network;
- normality becomes quiet while unfamiliar uncertainty remains durable and visible.

Do **not** add Resonance Calibration or another standing responsibility by symmetry. Additional B construction now requires evidence of a materially different player role, not a desire for a third example.

Human comprehension, perceived attention compression, pacing, and enjoyment remain unproven.

## Candidate C — Strategic consequence composition

**Current status:** ACTIVE FEATURE-COMPLETION FRONTIER after bounded Candidate B and Candidate A depth exits.

### Current proof

The repository deliberately separates:

~~~
Relationship  -> personal history/meaning
Knowledge     -> who knows objective facts
Faction       -> institutional standing
World State   -> objective regional conditions
~~~

Each authority has at least one bounded production proof, and chapter composition can consume them without shadow story state.

### Gap

The distinctions are architecturally clean but still thin from the player's perspective. Knowledge, Faction, and World State often function as isolated proofs rather than as a sustained strategic model the player reasons across.

The risk is that the repository contains several correct state authorities whose **meaning is clearer to the architecture than to the player**.

### Depth-search target

Investigate authored late-campaign problems where several authorities are simultaneously relevant but remain independently owned.

Example shape:

~~~
relationship history
+ who knows what
+ current institutional standing
+ objective regional condition
+ current doctrine / mastered delegation
-> several legal strategies with different persistent consequences
~~~

Do not create automatic derivation between the authorities. The value comes from **composition at authored decision points**, not from a generalized political/world simulator.

### Provisional L3 exit shape

A plausible L3 target is:

- multiple later Campaign One decisions require reasoning across at least two distinct consequence authorities;
- the player can see why the authorities differ;
- changing one axis while holding another fixed changes available strategy or outcome;
- at least one late-game synthesis consumes prior Relationship + institutional/world/knowledge history together;
- Player Insight or contextual explanation makes the causal chain legible without exposing hidden future checks.

## Secondary systems

### Combat

Combat is explicitly one bounded M17 encounter proof. Expand it only if Candidate A/C needs additional tactical contexts or Campaign One otherwise lacks enough active conflict variety.

The breadth pass does **not** justify building a standalone combat progression system.

### Exploration

Authored travel currently proves location can matter to Quest, encounters, and spatial Tether. Expand only when candidate depth requires richer place-dependent decisions. Do not introduce coordinates, pathfinding, schedules, or open-world simulation without repeated concrete need.

### Essence / economy

Use as supporting pressure for buildcraft/delegation. Do not redesign the economy before A/B clarify what resources and pacing the finished loops actually need.

## Depth progression state

The original selected order remains useful as historical rationale:

~~~
1. Candidate B — Mastery Compression / Copy organization       [bounded L3 exit satisfied]
2. Candidate A — Relationship-derived capability buildcraft   [bounded L3 exit satisfied]
3. Candidate C — Strategic consequence composition            [ACTIVE]
~~~

B and A should not receive another package merely to increase example count. Their next changes must be pulled by a concrete completion defect, Candidate C composition pressure, or later human evidence.

## Immediate next work

The next package is a **depth specification and bounded implementation for Candidate C**.

It should identify the smallest authored late-Campaign-One decision set that makes the already-separate authorities strategically legible together:

1. Relationship history remains personal-history authority;
2. Knowledge remains who-knows-what authority;
3. Faction Reputation remains institutional-standing authority;
4. World State remains objective regional-condition authority;
5. capability/doctrine and mastered delegation may be consumed as additional inputs without becoming shadow state;
6. changing one axis while holding another fixed must change an available strategy or persistent consequence;
7. Player Insight or the decision surface must explain the causal distinction;
8. no generalized political/world simulator or universal condition DSL is authorized.

## Stop rule

Feature-completion work stops when:

- required core systems perform their intended Campaign One roles at sufficient bounded depth;
- further depth has low expected player value relative to Beta convergence;
- the next improvement would require unauthorized outer-scope expansion;
- a genuine owner/external boundary is reached.

After Candidate C, explicitly run the **FEATURE_COMPLETE NOW?** check rather than discovering another construction frontier by inertia. Only then should repository-wide optimization shift to dedicated Beta/human validation, tuning, accessibility, presentation, reliability, and release hardening.

## Governing interpretation

> A milestone PASS proves the contract it named. It does not silently prove a larger product claim.

> A vertical slice proves that a feature can work. Feature completion proves that the feature does enough work for the finished game.

> The repository should deepen the systems that define the player experience, not harden shallow systems merely because their first proofs are green.
