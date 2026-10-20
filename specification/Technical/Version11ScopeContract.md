# Campaign One 1.1 — Universal Trait Expression Contract

**Status:** OWNER-DIRECTED 1.1 CONSTRUCTION SCOPE (2026-10-20); implementation and qualification OPEN
**Release boundary:** Campaign One `v1.0.0` remains the released and qualified personal build.
**Basis:** owner instruction to implement the agreed P0–P6 plan with full repository delegation, without waiting between repository-answerable tasks.
**Reference:** draft PR #165 and its `UniversalTraitOntologyReconciliation.md` are implementation evidence, not merge/qualification authority.
**Human evidence ceiling:** `HUMAN-UNVALIDATED`; no `BETA_PASS` may be inferred.

## Intent and product identity

Campaign One 1.1 revises the Trait model from permanently active capability unlocks into a selective expression system for assimilated patterns of being. Gameplay should express four complementary roles:

1. **Accumulation:** permanent ownership of learned Traits.
2. **Transformation:** experiences and learning make new patterns available to the protagonist.
3. **Expression:** limited slots determine which owned or qualified temporary patterns are currently manifested.
4. **Strategic consequences and mastery:** currently expressed patterns affect authored choices, combat, doctrines, sharing, and eventually bounded delegation.

Relationship Experiences and Memories remain central to the authored campaign but do not define the only possible Trait provenance. Domain ownership remains separate for Relationships, Memories, Knowledge, Faction, World State, and personally demonstrated Copy routine familiarity.

## Owner choices for 1.1

- Use the universal Trait ontology and compatibility-preserving identifiers proposed in PR #165; do not merge its stale release/status authority into the modern 1.0 baseline.
- Assimilated ownership persists independently of equipped expression.
- Start with two expression slots so an early two-Trait Doctrine remains legal. Use existing level-based slot unlocking thereafter.
- Swapping is player-directed, free, and does not require physical NPC proximity; investigate swapping friction in the UI before inventing a currency, cooldown, or proximity loop.
- A Doctrine requires its pair to be assimilated, expressed, and deliberately foregrounded. Adoption may atomically configure the required expression pair.
- Authored `requiredPermanentTraitIds` remains a compatibility key and means currently **expressed** Traits at runtime where the content intends an active capability.
- Sharing follows expressed Trait availability, not merely permanent ownership.
- Stabilization spends Essence once, preserves an already expressed Trait, and never discards permanent ownership.
- Existing source-NPC conditions apply to actual NPC provenance only.
- Save schema v2 → v3 migration must preserve released 1.0 ownership, focus and unrelated state, deterministically fill legal expression slots, and never invent ownership.
- Show clear player-facing Discovered / Assimilating / Assimilated / Expressed / Suppressed distinctions.
- Prove a cognitive/relationship Trait, a non-cognitive Trait, and a composed Doctrine/Copy case in real bounded gameplay. Prefer existing authored consumers and catalogue entries over broad new content.

## Non-goals

No Chapter 8+, interplanetary expansion, New Game+, generic Skill/Crafting/Inventory systems, generalized proximity simulation, automatic irreversible Copy planning, generic memory/knowledge simulation, large Trait catalogue expansion, arbitrary Trait extraction, or build-tool modernization unless a demonstrated blocker requires it.

## P0–P6 construction and evidence

| Package | Responsibility | Exit evidence |
| --- | --- | --- |
| P0 | Preserve 1.0 and define bounded 1.1 authority | This scope contract; 1.0 evidence remains untouched |
| P1 | Reconcile PR #165 with post-1.0 `main` | File-level integration decisions; conflicts fixed; current-main baseline retained |
| P2 | Implement ownership/expression, sources, consumers, Doctrine, sharing, save v3 | Focused positive/rejection tests, migration fixtures, real runtime semantics |
| P3 | Teach lifecycle and make expression manageable | Ordinary UI progression without debug or developer intervention |
| P4 | Demonstrate concrete build and source differentiation | Two meaningful approaches and non-cognitive payoff; Copy/Doctrine constraints qualify |
| P5 | Integrate and harden | Full Campaign One UI paths, save/export/import, Chromium/Firefox, accessibility, offline/timing, TypeScript, production build |
| P6 | Qualify exact candidate | Exact SHA + complete Build Validation + no release-blocking defect + versioned release evidence; explicit human evidence ceiling |

## Mandatory regression boundaries

1. Assimilated ownership survives suppress/re-express and saving.
2. Active effects and authored gates depend on expression; no duplicate slot expression.
3. Non-NPC provenance does not require NPC Connection.
4. Named live runtime authority is eligible for Stabilization; deferred-only metadata is not.
5. Stabilization does not double spend Essence, does not unshare an expressed Trait, and does not lose it.
6. Sharing requires expression and never grants recipient permanent ownership.
7. Doctrine adoption/switch respects assimilated + expressed + foregrounded and slot capacity.
8. v2→v3 save migration preserves ownership, existing legal loadout, doctrine focus, and unrelated state; failure on corrupt imports is safe.
9. Existing full normal-UI Campaign One tests still pass along representative divergent histories.
10. Browser, accessibility, content reachability, timing/offline and production build qualification remain intact.

An exact-head **failure is a blocker**, not a reason to remove assertions or downgrade coverage. Correct an obsolete historical assertion only when the underlying revised contract and preserved behavior are explicitly demonstrated.

## Release decision and stop condition

1.0 is already released and must not be rewritten. Branches/PRs for 1.1 may be constructed and qualified. A feature is not complete merely because the old PR contained it. A 1.1 release requires version metadata, an immutable candidate, current full CI and UI checks, and a documented release decision. Do not label synthetic tests as human sessions. Real first-session or external playthroughs remain optional for a personal release, but human-experience claims remain unproven without them.

P0–P5 may be performed autonomously under the user's broad delegation. Maintain accurate per-package completion evidence. If the environment lacks sufficient integration/test/merge/release capability, retain a truthful draft PR and explicit blocker; never publish an unqualified build.
