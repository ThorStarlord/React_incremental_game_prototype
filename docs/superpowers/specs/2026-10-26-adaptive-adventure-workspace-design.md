# Adaptive Adventure Workspace — owner-selected UI direction

**Status:** OWNER-SELECTED DESIGN DIRECTION / DOCUMENTATION ONLY / NOT IMPLEMENTED BY THIS RECORD / HUMAN-UNVALIDATED  
**Decision date:** 2026-10-26  
**Repository baseline inspected:** `main` at `ab3d478a1e8f127e7dc4514827dd402901b6e5a5` (2026-10-26)  
**Scope:** post-UI4 interface evolution of the existing Campaign One RPG/incremental game  
**Evidence class:** source-grounded design synthesis and owner selection; NOT a completed UI implementation, browser result, synthetic participant result, human study, release qualification, or acceptance of a new mechanics scope.

## Decision and rationale

**Select an Adaptive Adventure Workspace:** a **world-first RPG interface** that progressively reveals **relationship-derived character transformation, recorded causal consequences, and earned incremental delegation**. The world is the *entrance to play*; learned capabilities are the *primary progression reward*; causal explanation supports informed agency; bounded Copy operations convert understood repetition into delegated work.

This selection is the owner-approved answer to the earlier UI-specific divergent exploration and autonomous design questions. It is a design compass, not permission to implement all divergent candidates as a backlog or replace the current qualified UI4 foundation wholesale. Subsequent code work requires a bounded slice with source/authority mapping and explicit scope. No automatic UI5, M27, GC-15, new chapter, generic engine, or 1.1 release is created by this document.

**Primary player hypothesis:** someone who enjoys consequential narrative RPG experiences and character growth, and who increasingly appreciates incremental mastery. This is a working target, not a proven audience preference.

**Why this synthesis:** the repo already has a truthful Current Moment, authored travel, NPC/dialogue and Relationship history, Player Insight, universal Trait assimilation/expression source, and bounded Copy workflows. Re-presenting canonical state through coherent player journeys is a smaller, more distinctive experiment than adding new mechanics or an entirely new UI framework.

**References and precedence:**

- Repository behavior, scope, and current state: `AGENTS.md`, `STATUS.md`, `docs/CURRENT.md`, `HANDOFF.md`, `specification/Features/FeatureScopeMatrix.md`.
- Existing UI/interaction behavior: `specification/UI_UX/PlayerExperienceContract.md`, `specification/UI_UX/LayoutDesign.md`, `docs/ui/Phase4PlayerClarity.md`.
- Progression and campaign meaning: `specification/Technical/PostM25ProvisionalProductDirectionDecision.md`, `specification/Progression/GameProgressionArc.md`, `specification/Narrative/CampaignArchitecture.md`, `specification/Narrative/Synopsis.md`, `specification/Narrative/WorldLore.md`.
- Game possibility space (separate from this UI exploration): `specification/Technical/PostUI4DivergentExploration.md`, `specification/Technical/PostUI4ScenarioStressTest.md`.
- Trait semantics: `specification/Technical/Version11ScopeContract.md`, `specification/UI_UX/TraitExpressionUI11.md`.
- Simulated and human evidence boundaries: `specification/Technical/UI4CodingAgentSimulationCampaign.md`, issue #188; `docs/ui/Phase2HumanEvaluation.md`, issue #109.

The design is subordinate to existing gameplay authority and does not override source or contractual constraints. Earlier prospective references to PR #178 as unmerged are historical: PR #178 was later **source-only merged**, with 1.1 qualification and human usability still absent. The original tagged `v1.0.0` personal release is unchanged.

## The experiential answer: what a good 20-minute play session means

**Target feeling:** *I entered a world worth exploring; encountered someone worth caring about; made a meaningful decision; understood a genuine consequence; and can anticipate how experience will change my future choices.*

The design rewards are:

| Reward | Player-facing interpretation | UI implication |
| --- | --- | --- |
| Wonder | "I want to understand this place." | Place identity, restrained environmental presentation, discoverable legal journeys |
| Attachment | "These characters and shared experiences matter." | Recognizable character identity, visible earned history, contextual relationship access |
| Agency | "My decisions change what is possible." | Relevant known conditions before action; recorded effects after action |
| Transformation | "What I lived through changes what I can do." | Trait source, assimilation, expression and applications shown coherently |
| Mastery | "Work I have learned no longer consumes all my attention." | Personally learned routine -> Copy eligibility -> bounded execution -> exceptional player judgment |

**Illustrative opening rhythm, not implemented timing or a content promise:** 0–3 minutes orientation in City Center; 3–7 minutes legal travel via City Gate toward Whispering Woods; 7–13 minutes the authored Elder Willow encounter; 13–16 minutes inspection of whatever consequence/Experience/Memory was actually recorded; 16–20 minutes anticipation of a real next opportunity. Do not adjust quest timing, force an early Trait/Copy, mint a Memory, or manufacture rewards merely to hit these numbers. A twenty-minute session need only complete **one satisfying unit of progress**, not the game's entire long-term loop.

The deeper player transformation remains `personal action -> relationship-shaped specialization -> networked mastery -> strategic synthesis`. Early play emphasizes direct action and relationships; later play exposes expression strategy, evidence management and authorized delegation when their concepts actually become relevant.

## Divergent options considered, not an implementation backlog

Four competing interface identities were considered:

| Future | Central experience | Strength | Failure mode | Decision |
| --- | --- | --- | --- | --- |
| A — Adventurer's Chronicle | Inhabitable places, people, travel, personal history | Immersion and attachment | Incremental systems disappear into secondary menus | Use as the primary *presentation* |
| B — Causal Observatory | Visible evidence, decisions and history | Understandable consequences and information strategy | Feels like a developer debugger or spoiler map | Use as contextual *explanation* |
| C — Capability Workshop | Earned Traits, expression, Doctrine and growth | Distinctive relationship-derived buildcraft | Relationships become mere resource generators | Use as *progression* |
| D — Adaptive Adventure Workspace | World-first action plus contextual explanation, buildcraft, delegation | Preserves the distinctive RPG/incremental synthesis | Clutter and contextual overreach | **Selected overarching direction** |

The incremental command-center future remains an important *supporting mastery layer*, especially for Copy responsibilities, not the sole primary screen.

Fifteen candidate UI opportunities remain available for selective experiments:

| Group | Candidate | Boundaries / deciding observation |
| --- | --- | --- |
| World | 1. Scene-first adventure | Present already-authored place, situation and action; do not invent physical activity |
| World | 2. Explorer's Atlas | Depict only actual connected roads; story contacts of unknown location remain distinct |
| World | 3. Reactive environmental presentation | Express recorded World State; a background change alone is not proof of agency |
| Relationships | 4. Relationship Constellation | Show only known characters and recorded links; no fabricated relationship edges |
| Buildcraft | 5. Trait Loom / Capability Constellation | Render real assimilation/expression/doctrine facts; not a separate generic skill tree |
| History | 6. Chronicle of Consequences | Keep dialogue, Memory, Knowledge, Faction and World State distinct |
| Knowledge | 7. Knowledge Ledger | Show who actually knows what; distinguish known, unknown and unverified |
| Decisions | 8. Decision Theater | Display already-known eligibility, actual costs and uncertainty; no future spoilers |
| Delegation | 9. Copy Operations Board | Expose player authorization, standing vs one-shot duties, active work, exceptions |
| Delegation | 10. Mastery-to-Delegation Journey | Practice -> understood routine -> specific Copy eligibility -> delegated execution |
| Re-entry | 11. Return-to-Game Chronicle | Summarize only records genuinely available since previous play |
| Complexity | 12. Progressive Interface Complexity | Progressive disclosure, never silently erase existing functionality |
| Navigation | 13. Multiple UI Lenses | Possible future experiment; do not ship duplicate navigational authorities now |
| Presentation | 14. Atmosphere and Motion Language | Semantic, offline-safe and reduced-motion respecting; not spectacle for its own sake |
| Integration | 15. Contextual Interaction Workspace | Bring relevant known facts close to action without a second decision authority |

**First investigation priority:** Relationship Constellation (bounded earned links), Trait Loom (accurate expression lifecycle), and Chronicle of Consequences (understandable provenance). These address the design hypothesis: *Can players perceive how their history has changed who they are and what they can do?* The Adventure surface is the first actual vertical-slice delivery because it provides the context in which those insights will matter. All 15 candidates remain optional.

## Selected information architecture

The interface operates at three depths:

1. **Glance — what is happening?** Current known location, authored situation, legal next meaningful action and urgent timer/Copy exception.
2. **Decide — what can I do and why?** Actually available options, already-known reasons, applicable currently expressed Traits, relevant character/evidence and uncertainty; confirm consequences or costs only when supported by the underlying action contract.
3. **Inspect — how did I arrive here?** Recorded personal history, actual Memories and dialogues, observed Knowledge, current Faction/World status, Trait provenance and Copy mastery/readiness.

**Primary screen:** develop `DashboardPage` / `CurrentMomentPanel` as an Adventure view, with the current React Router destinations remaining accessible for deep inspection and management. Do not restore deprecated multi-column page ownership or introduce a second stateful tab router.

**Hierarchy:** meaningful scene and one clear primary action -> other legal actions -> immediately relevant history/capability context -> optional advanced chapter/statistical and operational views. On narrow/mobile layouts, preserve readable actions before secondary panels, visible urgent attention, keyboard/focus navigation, accessible naming and scrolling. No invented map route, unearned character proximity or premature content visibility is allowed.

**Visual identity:** an *illuminated science-fantasy field journal*, combining warm authored places and personal Memory surfaces with restrained luminous Resonance/Traits and ordered metaphysical/technical Copy visual language. Preserve the actual isolated-planet setting, dark elf protagonist, Dragon God heritage, and mixture of magic and advanced constructs. Inspiration images are **not** new canon. Prefer existing theme tokens, MUI, offline-safe bounded SVG/illustrations; no giant image library or art pipeline by default. Keep typography and interactions coherent across domains; honor contrast, keyboard access and reduced-motion preferences. Motion/animation never substitutes for action/status text.

## Proposed component/authority crosswalk

| UI responsibility | Existing primary source/surface | Allowed presentation change | Prohibited assumption |
| --- | --- | --- | --- |
| Adventure/situation | `src/pages/DashboardPage.tsx`, `src/features/Story/components/CurrentMomentPanel.tsx`, `CurrentMomentSelectors.ts` | Compose known place, situation and actionable links | New story or chapter authority |
| Travel/atlas | `src/features/Exploration/LocationDefinitions.ts`, `TravelPanel.tsx` | Present real legal adjacency and known locations | New routes, fast travel, implied NPC presence |
| Known characters | `src/pages/NPCsPage.tsx`, NPC/Relationship selectors and recorded experiences | Contextual character detail and recorded links | Arbitrary NPC positions, automatic Memories |
| Causal Chronicle | `PlayerInsightSelectors.ts`, `PlayerInsightPanel.tsx`, `DistrictAftercareProjection.ts` | Read-only grouping by character, choice, domain and provenance | Conflate a request with a completed institutional action; invent timestamps |
| Trait Loom | Trait state/selectors, `DoctrineFocusPanel.tsx`, `TraitExpressionUI11.md` | Visualize discovery, assimilation, current expression, suppression and exact before/after Doctrine preview | Freeform combination/skill tree; source-only 1.1 correctness or save migration PASS |
| Knowledge/standing | Canonical Knowledge/Factions/World State selectors | Show already-earned evidence and actual current/historical effects separately | Expose unknown facts or equate personal trust with Faction standing |
| Copy operations | `src/pages/CopiesPage.tsx`, `CopyDetailPanel.tsx`, Copy selectors/thunks | Show mastered routines, authorized priorities, standing orders and exception handback | Autonomous goal creation; acknowledgement as resolution |
| Shell/navigation | `AppRouter.tsx`, `GameLayout.tsx`, `MainContentArea.tsx`, `SessionStatusStrip.tsx` | Adjust hierarchy/responsive presentation and truthful links | Duplicate routing authority, missed deadlines, hidden unresolved exceptions |
| Persistence | Existing main-menu save/load/import/export + canonical schema | Contextual navigation and truthful feedback only | Second save root or automatic state migration by a visual component |

All UI changes should derive from existing canonical selectors and dispatch existing legal actions, not write to parallel journal, travel, relationship, copy or trait state. A design proposal may specify missing *read-only selectors* where required, but must identify their canonical source and reject fabricated derivation.

## Concrete target compositions

### 1. Adventure / Elder Willow opening

- Start on the existing playable session, showing known City Center situation and a single high-priority Willow lead.
- Explain the next *legal* City Gate connection; keep travel one road at a time and retain optional Forge practice.
- At Whispering Woods, show the existing Willow conversation action only if the actual dialogue is available and she is canonically here.
- After the authored choice, expose actual recorded dialogue and any earned Experience/Memory with accurate labels; never imply all dialogue creates a Memory.
- Provide link to relevant known NPC/relationship history and a valid next pursuit.
- Mobile, desktop and keyboard paths must present identical gameplay authority even if visually arranged differently.

### 2. Relationship Constellation

Bounded known-NPC view: recognizable node/card -> actually recorded shared experiences -> actual Memory/provenance -> existing detail route. Render uncertainty/absence explicitly. Do not infer a generic social graph or connect characters by attractive but unsupported edges.

### 3. Trait Loom

Use the 1.1 `Discovered / Assimilating / Assimilated / Expressed / Suppressed` distinctions. Two initial expression slots are the baseline of the source-only 1.1 contract, not a hardcoded universal cap. Assimilated ownership persists even when suppressed. Doctrine adoption/switch uses canonical preview and confirmation for suppressed effects; any display of active effects must reflect current expression, not mere ownership. No new cost, cooldown or proximity restriction.

### 4. Chronicle of Consequences

Group records by provenance: genuine Memories, ordinary recorded dialogue, per-NPC Knowledge, Faction standing effects and objective World State. Distinguish historical effects from current state. Chronology requires actual ordered evidence; otherwise prefer chapter/domain/person grouping. Merchant District aftercare should show only the NPC who actually heard the request; neither an imagined delivered report nor auto-broadcast Knowledge is allowed.

### 5. Copy Operations

Make the conceptual progression legible: personally `Learn -> Master -> Delegate -> Judge`. Surface real Copy readiness and authorized task envelope, show one-shot vs standing responsibility distinctly, and prioritize unresolved exceptions. Acknowledging an interruption is not completion, and the player retains irreversible judgment.

### 6. Reactive Merchant District

When the player revisits, show already-recorded patrol/trade conditions and applicable authored aftercare. Distinguish public/objective World State, institutional standing and individual hearing/response. Environmental art is decorative until a real authored interaction affords a distinct action; do not imply an economy, NPC scheduler or new travel topology.

## Vertical-slice sequence (planning direction, NOT completed implementation)

| Phase | Bounded deliverable | Evidence needed / stopping criterion |
| --- | --- | --- |
| P0 — Baseline and contracts | Source/selector map for current `main`; distinguish qualified UI4 from unqualified subsequent merges | Exact SHA and current authority confirmed; no obsolete PR state reused |
| P1 — Adventure-first Willow slice | Situation-first composition; legal travel/action hierarchy; truthful dialogue and consequence bridge | One complete normal-UI first-session path without invented state, control effects or hidden next action |
| P2 — Relationships/Chronicle | Known-person history and provenance bridge; bounded read-only constellation candidate | Player-known links only; Memory != ordinary dialogue; history remains understandable |
| P3 — Trait Loom | Assimilation/expression/Doctrine visual differentiation and preview | Canonical 1.1 semantics intact; unknown/migrated state handled explicitly |
| P4 — Mastery/Copy Operations | Practice -> mastery -> eligible delegation -> exception handback | No authorization leak, false "resolved" state or automatic strategic decision |
| P5 — World response | Reversible Merchant District recorded-condition/aftercare presentation | World/Knowledge/Faction/Relationship truth separate; no fictional location/route |
| P6 — Integrated coherence | Consistent typography, layout, navigation, responsive/accessibility and state-reentry | No competing page authority or systemic regressions; UI is coherent rather than unrelated redesigns |

**Delivery method:** integrated, reversible vertical slices on the current architecture, not a full UI rewrite and not isolated art-only cards. For every actual code slice, explicitly name the feature authority, player journey, positive/negative cases, save/recovery/browser implications, and stop condition. Avoid new UI frameworks, generalized visualization engines or new gameplay roots.

**Next concrete design artifact:** a Phase 1 Adventure Workspace specification with exact first-session structure, existing actions, read-only projections, responsive layout, accessibility behavior and rollback boundary. Do not silently promote any later phase from this roadmap into a committed implementation milestone.

## Acceptance and falsification

Evaluate proposals against observable questions rather than aesthetic enthusiasm:

- Can a fresh player identify where they are and a legal next action without being coached?
- Can the player distinguish a confirmed nearby NPC, a confirmed elsewhere NPC, and an unanchored story contact?
- Can a player identify what actually changed, as opposed to what they merely expect, including Memory vs dialogue and NPC awareness vs institutional effect?
- Can the player trace a learned capability back to actual earned evidence, and distinguish assimilated ownership from current expression?
- Can a player distinguish personally mastered routine, Copy-specific eligibility, active authorized task, and unresolved exception?
- Is important attention still discoverable across desktop/mobile and keyboard/screen-reader navigation?
- Does the interface give the game a coherent science-fantasy identity without sacrificing truthful action labels and accessibility?

**Reject or reduce** a design that adds impressive but unsupported characters/roads/knowledge, leaks locked future content, introduces a new gameplay state authority, increases navigation friction without benefit, buries decisions under exposition, or requires generalized engines to display one authored scene.

Comparison method: where feasible, hold the **same canonical game state and available actions** constant between UI variants; measure orientation, discoverability, causal understanding and task efficiency. Agent simulations can uncover possible misunderstandings but cannot establish emotional attachment, enjoyment, market appeal or retention. Qualitative appreciation and player preference require human participants.

## Claim ceiling, competing hypotheses, and future revision

- Qualified historical UI4: PR #185, Build Validation #40158794677. Later owner-directed PR #190 (district aftercare) and PR #178 (universal Traits) were **source-only merged, UNTESTED / UNQUALIFIED**; this UI document does not qualify them.
- Current six-profile UI4 blind simulated campaign: issue #188 / `UI4CodingAgentSimulationCampaign.md`, **NOT EXECUTED** in available prior evidence. Do not invent participant transcripts or mark the issue complete.
- Human Product Review: issue #109, **0/5 accepted first sessions, 0/3 external full campaigns, BETA_PASS=NO** as last recorded. The personal v1.0.0 release waiver was not a human Beta pass.
- Selected UI experience is **OWNER-SELECTED / HUMAN-UNVALIDATED**. Selection records intent and prioritization, not observed participant behavior or release status.
- Preserve rival hypotheses: a simpler Adventurer's Chronicle may outperform the integrated workspace if contextual density becomes overwhelming; a Copy-first UI may appeal more strongly to incremental-oriented players; a Causal Observatory may be better for complex knowledge decisions. Revisit on credible repeated evidence rather than defending the selected design by default.
- The owner has approved **this documented design direction**. The present request is to **record it in repository documentation**, not to claim gameplay code changed, that all phases were authorized for immediate implementation, that tests ran, or that a release occurred.

## Design decision in one sentence

**World-first presentation makes the game worth inhabiting; earned relationship history explains capability transformation; causal clarity protects consequential agency; deliberate Copy delegation frees attention for new decisions.**
