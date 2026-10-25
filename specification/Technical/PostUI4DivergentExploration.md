# Post-UI4 divergent exploration: documented possibility space

**Status:** DIVERGENT EXPLORATION / PROVISIONAL / HUMAN-UNVALIDATED.
**Based on:** main d3b397f9d2fbe1757e8e9eb96eb7080a4cad2f7d after UI4 PRs #185/#186.
**Not:** a feature commitment, an authorization to merge 1.1, a generic system roadmap, or a validation of human preferences.

## Why this exploration is warranted

The September PostM25ProductDirection.md records many ideas, but it predates the bounded M26, Campaign One GC and UI4 completions. Its historical "NEXT" and "M26 not authorized" statements do not supersede current STATUS, docs/CURRENT, AGENTS or the released 1.0 authority.

The goal is to identify **which additional gameplay meaning would make the strongest existing product loop more valuable**, rather than mechanically listing absent systems. A complete RPG/incremental blend can still have a large and promising 1.1+ possibility space.

## Crosswalk: idea, implemented substrate, divergent future

| Documentary idea | Demonstrated current substrate | Remaining possibility, risk |
| --- | --- | --- |
| H1 Causal RPG / causal legibility | Contextual Available Because, Causal Journal and Player Insight; UI4 links recorded consequences | Put causes in memorable interactions rather than a debug-like history reader; risk spoilers/redundancy |
| H2 Heterogeneous chapter composition | Merchant District Crisis, Archive Inquiry, Enemies in Phase and authored full Campaign One | Different kinds of decisions, characters and places rather than a generic ChapterEngine |
| H3 Content-authoring intelligence | ID integrity, reachability, route trace and three-chapter friction repairs already integrated | Improve tools only from repeated current authoring mistakes, not from abstract plugin ambitions |
| H4 Relationship-derived Traits | Existing four-capability / two-doctrine Campaign One, proven causal provenance and cross-domain use | Universal assimilation and selective expression, semantic cognitive/noncognitive builds; draft #178 and stacked #180/#182 require reconciliation, not automatic promotion |
| Knowledge / information control | Per-NPC awareness, authored evidence transfer and differentiated objective facts | Tell / Withhold / Verify choices with consequences, not generalized rumor/belief simulation |
| Faction / institutional strategy | Independent faction standing and late-game route consumers | Access, leverage, trust, protection or services shaped by political standing, not another XP ladder |
| Objective World State | Recorded region conditions and divergent conclusions | Tangible return-visit affordances when cities and districts change; no generic economy/ecology simulator |
| Copy Network | Personally mastered routines, priority, standing orders, exception escalation and player judgment | High-value specialized-role/priority dilemmas, not autonomous Copy goal setting or narrative decisions |
| Combat variety | Authored tactical and Trait-sensitive encounters | A few distinct tactical applications of learned capabilities rather than loot/skill-tree scope inflation |
| Time and presence | Canonical location and bounded timing | Rare meaningful commitments, deadlines or absence consequences, not autonomous NPC schedules |
| Art, sound and place identity | UI4 known-place vignette and Willow motif; presentational hooks | More powerful character/place identity and selective return-visit atmosphere; avoid art pipeline expansion with no gameplay connection |
| Modernization | Robust React/Redux, Playwright and production build with current CI | CRA/TypeScript/test modernization only where measurable maintenance friction justifies it |
| Inventory, crafting, generic Skills, NG+, infinite endgame, procedural or interplanetary expansion | Deliberately CUT or DEFER_POST_1_0 | Separate future decisions; absent implementation does not imply a missing 1.0 requirement |

**Current scope authority:** specification/Features/FeatureScopeMatrix.md and AGENTS.md. The source-backed post-M25 comparison is specification/Technical/PostM25ProductDirection.md and PostM25ProductDirectionDecisionReadiness.md. Any 1.1 Trait scope must be read on its draft branch: the claimed Version11ScopeContract.md is not part of current main.

## Six contrasting product futures

### A. Relationship-based capability builds

Players seek experiences with particular characters because these leave distinct capabilities and ways of solving future problems. Traits should expand solution space, not merely buff a stat. **Value:** strong character-build identity rooted in personal history. **Cheapest discriminating test:** two current builds with differing relationship histories, player-facing before/after consequences, and a coding-agent simulation of whether the source of their capabilities is legible. **Risk:** unqualified 1.1 schema v3 and expression rules, high authoring cost for distinct uses.

### B. Information-control RPG

The strategic problem becomes **who knows what, whom to tell, whether to verify, and when disclosure helps or harms**. **Value:** a distinctive strategic layer without adding more currency. **Cheapest test:** one written, two-branch dilemma that only uses the existing Knowledge and Relationship authorities; simulate a skeptical player explaining what was learned. **Risk:** hidden cause-and-effect and an unnecessary generalized rumor system.

### C. Reactive inhabitable city

Regional World State, Faction Reputation and Relationship history generate visibly different access, local descriptions or services when the player returns. **Value:** places feel alive, decisions seem consequential and worthwhile. **Cheapest test:** design a single canonical before/after return visit and check whether a player can infer the source of the difference without developer hints. **Risk:** a city simulation, authoring explosion, or scenery that doesn't alter decisions.

### D. Earned delegation as an organization fantasy

Automation relieves learned, repeatable work and escalates exceptional judgment to the player. **Value:** preserves an original RPG/incremental synthesis. **Cheapest test:** incremental-oriented simulation from first personal mastery to a Copy exception; record mistaken assumptions about automation authority. **Risk:** priority menus, waiting and chores dominate meaningful play.

### E. Trait-sensitive tactical drama

A small set of conflicts can have qualitatively different approaches based on relationship-learned understanding. **Value:** build identity is expressed in action. **Cheapest test:** one side-by-side encounter decision sketch with ordinary solutions retained. **Risk:** becoming a conventional combat/loot RPG.

### F. Narrative and environmental attachment

More distinctive places, characters and emotional continuity can make the world the player wants to protect. **Value:** gives causal consequences lived significance. **Cheapest test:** one authored location and recurring character moment, compared against UI4's restrained vignette in a non-leading narrative-first synthetic evaluation. **Risk:** aesthetic polish without meaningful agency.

These directions can reinforce each other, but **a possibility space is not an implementation backlog**.

## Owner-facing comparison and preliminary selection

**Strongest default synthesis to test:** A (relationship-derived capability identity) + B (knowledge and trust choices) + C (world/institutional response). D (Copy mastery) remains a distinctive *supporting* loop. F (experiential place/character identity) makes the consequences matter, while E (combat) is selective rather than the next major pillar.

**Why this combination:** Each has an existing canonical authority and can be expressed through a few authored, observable decisions instead of a new generalized engine. It also tests whether learned character capabilities and information choices create consequential, remembered differences in places.

**Most important rival:** D as the primary incremental strategy; this could be better if the simulated review finds that players understand and prioritize delegation more than relationships. That would suggest a different 1.1 product identity, not an automatic Copy planner.

**Existing 1.1 Trait work:** Draft PR #178 has owner-directed scope, but is unqualified against current main; PRs #180 and #182 are stacked and likewise not ready. The proper next investigation is to reconcile exact draft branches, assess the design contract and test two differentiated builds—not blindly merge old code.

**Less warranted now:** a generic economy, ChapterEngine, skill tree, open-world NPC schedule, general rumor simulator, autonomous Copy planner or procedural campaign. These add architecture and maintenance before a need has been shown.

## Execution sequence and decision criteria

1. **Run the current-game six-profile agent simulation** described in UI4CodingAgentSimulationCampaign.md. The coding agent must actually use independent participant contexts and real observation/action artifacts; scripted release routes cannot substitute.
2. **Design-stress three futures on paper first**: A (Trait builds), B (Knowledge decisions), C (responsive world). For each, specify one dramatic choice, two plausible paths, exact existing authority owners, player-visible consequences, plausible misunderstanding, and what would make the choice boring or unfair.
3. **Compare failure patterns** from actual synthetic sessions with those situations. Repeated misunderstanding may justify a bounded UI/wording fix. Repeated lack of consequential choices may justify a small retained 1.1 authored scenario. No result justifies broad scope expansion by default.
4. **Qualify one selected 1.1 experiment**, if warranted, independently from the original v1.0.0. Revisit current 1.1 Trait draft state before selecting something that duplicates it.
5. **Reconcile** the evidence into current product-direction documents without rewriting historical closed M25/M26 records or claiming human Beta PASS.

## Claim/authority boundary

Simulated reasoning is useful for discoverability and causal-model risk; it is **not** an independent human's fun, attachment, satisfaction or commercial preference. The original 1.0.0 tag is immutable. Issue #109 remains OPEN / UNPROVEN, human first sessions 0/5, full campaigns 0/3, BETA_PASS=NO. This exploration neither opens an automatic UI5 nor grants authority to a new ChapterEngine, Copy strategy engine or any 1.1 release.

**Decision trace:** merely repeating the already-passing deterministic campaign would add little insight; directly building all prospective systems would add too much cost and uncertainty. A fresh agent-simulated diagnostic plus comparison of A/B/C yields the next useful information while keeping options open.
