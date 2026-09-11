# Game Completion Definition — Campaign One / 1.0

**Status:** CURRENT AUTHORITY — PROVISIONAL / HUMAN-UNVALIDATED  
**Program stage:** PLAYABLE PRE-ALPHA  
**Prepared:** 2026-09-11  
**Product direction:** `Technical/PostM25ProvisionalProductDirectionDecision.md`  
**Human Product Review:** issue #109 remains OPEN / UNPROVEN

## Purpose

This document defines what counts as a **complete 1.0 game**. It is the product-level stop condition that future implementation work must serve.

The repository is no longer governed by an open-ended rule of “build the next technically plausible subsystem.” Future work must answer:

> Which unsatisfied 1.0 requirement does this change close, or which repeated concrete blocker prevents that requirement from being closed?

If no such requirement exists, the change is outside the 1.0 critical path unless this document is explicitly revised.

## 1. Product identity

The smallest complete game this repository is now targeting is:

> **A narrative incremental RPG in which consequential relationships teach the protagonist durable capabilities, remembered history explains why later options exist, and personally understood repetitive work can be deliberately delegated so the player increasingly focuses on novel strategic and relational decisions.**

Provisional hierarchy:

1. **Primary promise:** relationship-derived capability buildcraft.
2. **Supporting identity:** causal legibility.
3. **Incremental identity:** earned delegation / mastery compression.
4. **Enabling architecture:** heterogeneous authored composition over existing domain authorities.

This hierarchy is provisional because human product evidence remains absent. It is nevertheless sufficient to bound reversible development.

## 2. What 1.0 is

**1.0 is Campaign One on the isolated planet.**

It begins with a constrained protagonist who must act personally and form consequential local relationships. It ends after the Telluric Echo campaign climax and a state-responsive aftermath/epilogue. Interplanetary expansion, the emergent-AI macro-conflict, Dragon God relay-network campaigns, and post-campaign rebuilding are sequel/post-1.0 material unless this authority is explicitly revised.

The broad narrative reference remains `Narrative/Synopsis.md`, but this completion definition owns **scope**, not every historical synopsis detail.

## 3. Core player fantasy

The protagonist should evolve from:

```text
isolated operator
-> consequential participant
-> relationship-shaped specialist
-> networked strategist
```

The player's late-game power fantasy is not merely larger numbers. It is the ability to understand and orchestrate a network of:

- meaningful relationships and Memories;
- learned durable Traits/capabilities;
- selective information/Knowledge;
- institutional standing;
- objective world consequences;
- mastered repeatable routines;
- bounded delegated Copies.

The player still owns novel, meaningful, or irreversible decisions.

## 4. Starting condition

A normal New Game must begin with:

- limited permanent capability breadth;
- no assumption of a mature relationship network;
- little or no routine delegation authority;
- ordinary active actions sufficient to progress;
- a clear first actionable problem and first meaningful relationship interaction;
- no debug injection or developer knowledge required.

Early play should teach the product promise through action before exposing a large management surface.

## 5. End-state fantasy

Before the finale, a normal successful run must be capable of producing a player who has:

- a meaningful history with the bounded 1.0 anchor cast;
- several permanent relationship-derived capabilities;
- at least one consequential build choice where learned capabilities materially change legal solution space;
- persistent differences across Relationship, Knowledge, Faction Reputation, and World State;
- personally mastered repeatable work;
- a useful Copy network handling approved repetition while consequential judgment remains player-owned;
- visible long-horizon callbacks to earlier choices.

The finale must consume meaningful prior state rather than ignore the player's accumulated network.

## 6. Bounded 1.0 cast

The existing Relationship-authority NPCs form the default 1.0 anchor cast:

- Elder Willow;
- Lyra;
- Elara;
- Gronk;
- Silas;
- Valerius.

1.0 does **not** require every supporting NPC to become a new Relationship-authority root. Additional characters may be authored where needed by campaign content, but new deep relationship authorities require a demonstrated campaign need.

For 1.0, each anchor character must have at least one meaningful long-horizon consequence or callback. Not every anchor character must teach a permanent Trait.

## 7. Campaign size cap

The target completion spine is intentionally bounded:

```text
Prologue
+ Chapters 1–7
+ Finale
+ Epilogue
```

The three already integrated chapter-scale projections occupy Chapters 1–3:

1. Merchant District Crisis
2. Archive Inquiry
3. Enemies in Phase

The remaining 1.0 campaign budget is therefore four new substantive chapters, one finale, and one epilogue, plus the opening/prologue integration.

Adding Chapters 8+ is **not** on the 1.0 critical path unless playability or narrative dependency evidence proves the bounded spine cannot deliver the product promise.

## 8. Capability breadth requirement

1.0 must provide enough build expression to make relationship-derived capability buildcraft real rather than decorative.

Minimum target:

- at least **4 distinct durable relationship-derived capability identities** across at least **3 anchor relationships**;
- at least **2** of those capabilities must have meaningful application in more than one gameplay context/domain;
- baseline progression must remain viable without one universal mandatory Trait unless an authored branch explicitly establishes a different local contract;
- capability origin/provenance must remain legible without exposing hidden future content.

These numbers are a scope floor, not a mandate to create a large Trait catalog.

## 9. Delegation breadth requirement

1.0 incremental progression must establish a meaningful transition from direct action to earned delegation.

Minimum target:

- at least **3 personally learnable repeatable routine identities** across at least **2 gameplay contexts**;
- routine familiarity is earned through player action, not granted by elapsed time alone;
- Copy-specific readiness remains separate from personal mastery;
- the player explicitly chooses task assignment/priority;
- offline progression remains bounded to already-authorized safe work;
- no offline narrative, social, faction, world, quest-resolution, or irreversible decision authority is implied.

## 10. Required 1.0 systems

The 1.0 game requires the existing composed authority chain, bounded to demonstrated needs:

```text
GameLoop / time
Player state and vitals
Relationship Experience / Memory / Connection
Traits and Essence
NPC / Dialogue
Quest
Exploration / authored travel
Combat
Knowledge
Faction Reputation
World State
Copy delegation
persistence / save / load / import-export
bounded offline progress
chapter-scale read-only composition
player-facing causal/provenance legibility
settings / navigation / feedback
```

The detailed classification belongs in `Features/FeatureScopeMatrix.md`.

## 11. Explicitly excluded from the 1.0 critical path

Unless this authority is revised after concrete campaign evidence, 1.0 does **not** require:

- a separate generic Skills/skill-tree system in parallel with Traits;
- a generalized crafting economy;
- a generalized player inventory/equipment economy;
- a generalized `ChapterEngine` or narrative condition DSL;
- autonomous Copy planning or automatic irreversible decisions;
- offline narrative/social/world progression;
- open-world NPC scheduling;
- generalized rumor/belief simulation;
- generalized economy simulation;
- interplanetary campaign content;
- New Game+;
- infinite/endless endgame;
- live-service infrastructure;
- mobile as a primary release target.

Deferred concepts may remain documented as reference or post-1.0 ideas, but they must not silently re-enter the 1.0 queue.

## 12. Save-management decision

Persistence itself is **CORE_1_0**. A second independent save system is not.

The existing main-menu save/load/import/export authority should remain canonical. A dedicated in-game Save Management route is optional presentation over that authority; if it cannot justify itself, remove the placeholder rather than build duplicate persistence semantics.

## 13. Ending / completion condition

A normal run is considered campaign-complete when the player, through ordinary UI:

1. reaches the Telluric Echo finale through legal campaign progression;
2. resolves the campaign climax using a legal state-dependent route/strategy;
3. receives an epilogue that reflects selected prior Relationship / capability / Knowledge / Faction / World-State consequences;
4. reaches a clear campaign-complete state or final screen;
5. can persist that completed state without corrupting prior save authority.

One core campaign climax is sufficient for 1.0. Multiple fully separate endings are **not required**. State-responsive epilogue variation is required so prior history is not erased at the finish line.

## 14. Replayability

Required for 1.0:

- meaningful route divergence;
- different relationship histories;
- different capability/build expression;
- visible state-responsive consequences.

Not required for 1.0:

- New Game+;
- procedural campaign generation;
- endless progression;
- meta-progression between completed campaigns.

## 15. Release platform boundary

1.0 is a **desktop-web** release target.

Primary qualification targets:

- current stable Chromium-class desktop browser (Chrome/Edge);
- current stable Firefox desktop;
- minimum supported viewport: 1280×720;
- reference viewport: 1920×1080.

Mobile/responsive behavior should not be deliberately broken, but full mobile product qualification is not a 1.0 release blocker unless separately promoted.

## 16. Maturity definitions

### Playable Pre-Alpha — current

The repository has a real runnable game shell, integrated systems, persistence, and qualified chapter-scale play, but the 1.0 campaign and player-facing product quality are incomplete.

### Alpha

All required 1.0 systems exist at required scope and the entire Campaign One skeleton can be played from New Game to campaign completion through normal UI without debug-only progression.

### Content Alpha

The complete Campaign One is fully authored from beginning to ending; no required narrative/content unit is a placeholder.

### Beta

Content scope is locked. Development focuses on comprehension, UX, pacing, balance, bugs, performance, accessibility, presentation, and save/release robustness.

### Release Candidate

A specific production build satisfies the release qualification contract. No feature development occurs except release-blocking fixes.

### 1.0

The exact release candidate satisfies all completion authorities and has no unresolved release-blocking defect.

## 17. Human evidence boundary

Automated qualification can prove implementation correctness, persistence behavior, deterministic composition, and bounded rejection paths.

It cannot prove:

- fresh-player comprehension;
- discoverability;
- pacing quality;
- fairness/final balance;
- enjoyment;
- emotional impact;
- retention/desire to continue;
- market preference.

Issue #109 remains the human product-evidence authority. Human evidence may revise this provisional 1.0 scope, but absence of human evidence does not convert automation into a human PASS.

## 18. Change-control rule

A proposed 1.0 change must satisfy at least one:

1. directly closes an unsatisfied requirement in this document or a referenced completion contract;
2. repairs a demonstrated blocker to such a requirement;
3. resolves repeated content-authoring friction that materially obstructs campaign completion;
4. is a release-quality fix required by Beta/RC criteria.

Otherwise classify it as `DEFER_POST_1_0`, `CUT`, or a separate future decision.

## 19. 1.0 stop condition

Stop adding 1.0 scope when all are true:

```text
GameCompletionDefinition satisfied
AND FeatureScopeMatrix has no unresolved critical-path decisions
AND Campaign One is playable New Game -> epilogue through normal UI
AND AlphaCompletionContract satisfied
AND Content Alpha achieved
AND BetaCompletionContract satisfied
AND ReleaseQualificationContract satisfied on an exact candidate
AND no unresolved release-blocking defects remain
```

At that point, further ideas belong to `1.1`, an expansion, or a later campaign — not to an endlessly expanding 1.0 queue.

## 20. Governing principle

> **Finish the smallest game that fully delivers the relationship → capability → consequence → mastery → delegation promise before expanding the architecture.**
