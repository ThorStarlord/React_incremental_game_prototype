# Campaign One — Player Experience and UI Contract

## 2026-10-25 — UI4 experience hardening, qualified on main

[PR #185](https://github.com/ThorStarlord/React_incremental_game_prototype/pull/185) merged at `528d014d` after exact head `cfad4349` passed [Build Validation #40158794677](https://github.com/ThorStarlord/React_incremental_game_prototype/actions/runs/40158794677). The nested NPC detail → NPC-list return was repaired and covered by `UI4NavigationReturn.test.tsx`. The UI4 implementation record `docs/ui/Phase4PlayerClarity.md` is now qualified evidence rather than an unmerged candidate. Human comprehension, delight, and preference remain unvalidated.

Within the already authored Campaign One, the presentation must communicate immediate situation and legal next action in natural player language, show player-visible recorded consequences without inventing Memories, and keep deeper Copy management progressive. A reversible decorative explorer-journal vignette may depict only known canonical location names and may not assert additional NPC presence, new roads or new story authority. The first Willow journey stays manually adjacent. One React Router page authority supplies the normal UI; MainContentArea must not maintain a second page-selection table or independent active tab. Consent-based human player evidence is still required for claims of intuitive navigation, felt world identity, or enjoyment. The implementation/evidence record is docs/ui/Phase4PlayerClarity.md; all 1.1 Trait migration and release actions remain separate.

## 2026-10-24 — Bounded UI3 experience-truth refinement
Owner approved the fresh UI review's concrete repair response, within the existing 1.0 authored Campaign One. GameLayout must not add a margin for a sidebar already occupying flex width; mobile Current Moment action cards use content-sized heights; entry-menu text must contrast with its dark background. Gameplay Settings must not expose difficulty or tutorial switches with no live effects. Mature Relationship cards and sort/filter use canonical Affinity/Connection projections for migrated NPCs. Spatial truth has **three distinct meanings**: canonical confirmed present, canonical confirmed elsewhere, and unanchored *story contact* (unknown world location, legacy authored story interaction retained). Unanchored must never be narrated as physically present. Current Moment must disclose only player-known contacts and currently available authored dialogue; conceptual chapter `centerOfGravity` is not an in-world situation. 1.0 Trait slot equipment is not spatially gated by the gameplay reducer, and its UI must not claim a fictional proximity lock. All of this is read-only presentation or previously-authorized actions; no new location graph, dialogue DSL, Chapter engine, or 1.1 Trait semantics.


## 2026-10-23 — UI2 owner-approved supplement

The 2026-10-21 UI program was qualified and merged via PR #179; its earlier candidate-only status label below is historical. Owner additionally approved bounded UI2: only actual dialogue availability creates primary encounter actions; current legal travel and authored encounters sit by Current Moment; chapter walkthroughs and advanced statistics can be expanded; settings controls must have real effects; NPC links use canonical relationship authority and keyboard access; puzzle error/Force It, Copy exceptions, and 1.0 Traits stay truthful. The follow-on source passed exact-head Build Validation #40090580707 and merged through PR #181. This is a post-release main update, not an amendment of the original v1.0.0 tag. See `docs/ui/Phase2Implementation.md`. PR #178/#180 universal expression work remains separate; no new gameplay state or human claims.


**Status:** UI2/UI3 implementation on `main` (merged PR #181, Build Validation #40090580707 PASS); independent human comprehension evidence remains pending. This is not a v1.0.0 tag amendment.

## Product identity

Campaign One's central promise is relationship-derived capability buildcraft, causal legibility, and earned delegation of bounded mastered work. Its authored RPG systems remain canonical. The interface must help a player answer:

1. What situation am I facing, and where am I?
2. What meaningful action is currently available?
3. Which known evidence matters to the decision?
4. What actually changed?
5. What mastered work can I deliberately delegate?

## Interaction laws

- A control's label must describe its real effect. Authored dialogue is not free-form conversation; a Copy note does not execute a task; stopping simulation is not ending a session.
- Situation-first presentation supplements advanced feature navigation; it does not replace detailed system pages.
- All projections come from canonical Redux state and already-revealed authored world information. UI selectors cannot grant ownership, reveal undiscovered characters, invent memories, initiate procedures, or resolve narrative decisions.
- Default narrative prompts preserve discovery; detailed traversal instructions belong in expandable recovery guidance.
- At the moment of an authored decision, show already-known eligibility/cause; afterward, show recorded and player-visible consequences. Never promise arbitrary future outcomes.
- An assigned, one-shot mastered Copy routine is not a standing order. A standing order cannot resolve exceptions or choose irreversible narrative outcomes.
- Bulk actions must name their exact filtered scope, costs, and actual resulting successes/failures. Success feedback is conditional on effects, not simply on resolved dispatch promises.
- Critical timers and unresolved Copy exceptions remain discoverable from the global game layout. Keyboard and screen-reader interaction must remain supported.
- Avoid additional gameplay state, save schemas, new chapters, generalized automation, or architecture rewrites.

## Change boundaries

**UX-A/UX-B/UX-C:** truthful authored dialogue, Copy note naming, quest puzzle lifecycle/Undo/Clear, scoped bulk operations and notifications, active semantic main landmark.

**UX-E:** read-only Current Moment on Dashboard. Known location, actual eligible contacts, active quests, visible memories and exceptions come from existing selectors. Does not make new gameplay authority.

**UX-F:** optional route guidance; contextual links can select known NPC Dialogue, known Quest, and existing Copy management.

**UX-G:** Copy cards show actual active production status and unresolved exception escalation to their real management dialog.

**UX-H:** global simulation status, active timed quest, Copy judgment attention. The simulation controls are distinct from Save & Main Menu.

**UX-D / 1.1:** permanently assimilated ownership and currently expressed traits are separate; Doctrine adoption may atomically configure expression slots. Any Trait UX adaptation belongs on a branch based on PR #178's 1.1 implementation, not the released v1.0.0.

## Qualifying evidence

1. Tests for fresh puzzle attempts, truthful dialogue affordance and state-driven Current Moment/critical timers.
2. Existing Chapter 1 through Epilogue tests, Copy strategy/exception tests, accessibility, TypeScript, static production build, release-browser and full campaign UI tests.
3. Explicit exact-head Build Validation, with failures fixed on their real cause.
4. Human comprehension, delight, pacing, and user preference remain **HUMAN-UNVALIDATED**. Issue #109 remains optional authentic review evidence under the v1.0 owner release waiver.

## Non-goals

No new chapter or authored scope; no AI chat, automatic irreversible Copy strategy, gameplay planner, speculative hidden story reveals, new progression system, new save root, or generic world simulation.

## Stopping condition

The revised normal-UI journeys must remain coherent and technically qualified. Treat the Current Moment as a reversible interaction layer; do not grow it into a replacement dashboard without actual decision-changing evidence.
