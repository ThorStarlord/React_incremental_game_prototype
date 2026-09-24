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
| Traits / permanent capabilities | L2/L3 candidate | Primary relationship-derived capability buildcraft | Candidate A now curates the 1.0 catalogue, centralizes Resonance/effect authority, and makes doctrine matter in GC06-GC08 while preserving independent component uses; human comprehension/balance and final depth sufficiency remain unproven | **Depth candidate A — bounded package implemented** |
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

The repository already proves:

- relationships can create authored Experiences and Memories;
- qualified history can discover and permanently teach Traits;
- permanent Traits can alter legal Quest/Combat choices;
- two established two-Trait doctrines can be deliberately foregrounded;
- GC06 consumes active doctrine with distinct legal synthesis options;
- capability provenance is visible through Player Insight / Traits surfaces.

### Gap

The architecture now supports a real build system, but Campaign One does not yet make specialization matter often enough to sustain the **primary product promise**.

The first bounded Candidate A package now establishes:

- the two-doctrine scope remains intentionally bounded;
- active doctrine is consumed across GC06, GC07, and GC08 posture-setting decisions;
- GC09-GC10 preserve durable pair culmination instead of forcing repetitive menu switching;
- all four component relationship-derived Traits have independent authored applications;
- the historical catalogue is curated so unsupported generic perks are no longer ordinary 1.0 discoveries;
- Resonance readiness and effect execution have explicit shared authority.

Remaining uncertainty is now less architectural and more product-facing: switching cadence, relative route value, readability, balance, and whether this depth is sufficient for the primary product promise remain human-unvalidated. Temporary/equipped Trait semantics beyond qualified effects also remain intentionally unresolved.

### Depth-search target

Investigate the smallest content/system changes that would make the two existing doctrine identities and their source Traits create **repeated, causally legible, non-dominant strategic differences** across later Campaign One.

Prefer:

~~~
existing Traits
+ existing doctrines
+ multiple authored consumers
+ cross-domain consequences
~~~

over:

~~~
large new Trait catalog
+ generic capability graph
+ arbitrary combination engine
~~~

### Provisional L3 exit shape

A plausible L3 target is:

- each established doctrine has multiple meaningful consumers across more than one later chapter/context;
- at least some source Traits matter independently as learned capabilities outside the doctrine gate;
- doctrine choice changes legal approaches/consequences without becoming a universally superior answer;
- switching is meaningful enough to justify the focus mechanic but not required as repetitive menu tax;
- the player can explain, from visible provenance, why the build option exists.

This is a depth-search hypothesis, not yet an implementation contract.

## Candidate B — Mastery Compression / Copy organization

### Current proof

The repository already proves:

- personal action can establish routine familiarity;
- Copy readiness remains separate from personal mastery;
- three authored production routine identities exist;
- Copies can execute understood repeatable work;
- one Archive Verification Standing Order can maintain a typed backlog;
- an out-of-envelope source contradiction creates a durable exception and returns judgment to the player;
- safe already-running tasks can continue offline without autonomous task selection.

### Gap

This is the largest mismatch between **conceptual importance** and **campaign breadth**.

The product promise says the player should increasingly focus on novel strategic/relational decisions because understood repetition becomes delegated. Yet full standing responsibility currently exists for only one routine and one exception class.

The system therefore proves the model but does not yet create a campaign-wide transformation of player attention.

### Depth-search target

Investigate how the existing three routine identities, Copy roles, routine priority, Standing Orders, and typed exceptions can form a **small policy-driven operating network** without becoming autonomous strategy.

Questions to resolve in depth:

- Which additional mastered procedures deserve standing responsibility rather than one-shot assignment?
- What conditions should those responsibilities maintain?
- What distinct exception classes force player judgment instead of being silently auto-resolved?
- How should several Copies divide recurring responsibility without a generic planner?
- What late-game UI makes normality disappear while exceptional states surface?
- Which campaign chapters create enough recurring work for delegation to feel earned rather than cosmetic?
- How does delegation reduce attention cost rather than merely increase passive income?

Prefer typed authored policies over a generic condition DSL or arbitrary queue.

### Provisional L3 exit shape

A plausible L3 target is:

- standing responsibility exists across more than one gameplay context/routine;
- distinct safe work patterns demonstrate that Copies maintain known procedures rather than merely repeat one task;
- at least two exception families return qualitatively different judgment to the player;
- Copy role/readiness meaningfully affects organizational assignment;
- later Campaign One has a perceptible before/after transition from personal repetition to policy-level supervision;
- normal delegated work is quiet while exceptions are legible and durable.

## Candidate C — Strategic consequence composition

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

## Selected depth order

Proceed without waiting for a new milestone number:

~~~
1. Candidate B — Mastery Compression / Copy organization
2. Candidate A — Relationship-derived capability buildcraft
3. Candidate C — Strategic consequence composition
~~~

Rationale:

- **B** has the largest gap between the game's incremental identity and its current single standing-order slice, and it can transform the player's level of attention without requiring new campaign acts.
- **A** is the primary product promise and already has a strong architecture; its next value comes from broader meaningful consumption rather than a new capability framework.
- **C** becomes most valuable once A/B provide richer strategic inputs to compose; it should deepen the consequences of those systems rather than grow as an isolated simulation.

This ordering is for **depth investigation**, not an irreversible implementation sequence. If the B depth search demonstrates that meaningful standing responsibility cannot be expanded without low-value repetition, move A ahead rather than forcing the architecture.

## Immediate next work

The next package is a **depth specification for Candidate B**.

It should produce:

1. a concrete finished-game role for Copies in late Campaign One;
2. the exact additional standing-responsibility patterns justified by existing mastered routines/content;
3. typed condition and exception semantics;
4. deterministic GameLoop ordering and offline boundaries;
5. player-facing management/Insight behavior;
6. one end-to-end campaign trace from personal mastery -> standing responsibility -> quiet autonomous execution -> exception -> player judgment;
7. a minimal implementation plan with explicit non-goals;
8. evidence that the result increases attention compression rather than passive-income automation.

After Candidate B reaches a bounded implementation decision, repeat the same depth process for A, then C.

## Stop rule

Feature-completion work stops when:

- required core systems perform their intended Campaign One roles at sufficient L4 depth;
- further depth has low expected player value relative to Beta convergence;
- the next improvement would require unauthorized outer-scope expansion;
- a genuine owner/external boundary is reached.

Only then should repository-wide optimization shift to dedicated Beta/human validation, tuning, accessibility, presentation, reliability, and release hardening.

## Governing interpretation

> A milestone PASS proves the contract it named. It does not silently prove a larger product claim.

> A vertical slice proves that a feature can work. Feature completion proves that the feature does enough work for the finished game.

> The repository should deepen the systems that define the player experience, not harden shallow systems merely because their first proofs are green.
