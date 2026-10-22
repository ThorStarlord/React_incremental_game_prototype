# Campaign One — Player Experience and UI Contract

**Status:** Implementation candidate (2026-10-21); exact-head Build Validation and human evidence pending. This is not a v1.0.0 release amendment.

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
