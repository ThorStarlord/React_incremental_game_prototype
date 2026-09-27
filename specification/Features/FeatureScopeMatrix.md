# 1.0 Feature Scope Matrix

**Status:** CURRENT AUTHORITY — PROVISIONAL / HUMAN-UNVALIDATED  
**Applies to:** Campaign One / 1.0  
**Parent authority:** `../GameCompletionDefinition.md`  
**Prepared:** 2026-09-11

## Purpose

This matrix prevents old placeholders, historical design ideas, and technically possible systems from silently becoming 1.0 requirements.

Every major capability belongs to one scope class:

- `CORE_1_0` — required for the game to be itself and on the critical path.
- `SUPPORTING_1_0` — required to make core play legible/usable/releasable, but not a separate progression pillar.
- `MINIMAL_1_0` — only the smallest presentation/behavior needed by current core systems.
- `DEFER_POST_1_0` — explicitly outside Campaign One critical path.
- `CUT` — do not implement for 1.0; remove misleading player-facing placeholders where applicable.
- `UNDECIDED` — permitted only temporarily; an unresolved critical-path item blocks scope lock.

## Scope boundary and maturity

There are **no `UNDECIDED` critical-path scope-class items** in this provisional matrix. That locks the **outer Campaign One boundary**, not the depth of every system already inside it.

Use the maturity ladder from `../GameCompletionDefinition.md`:

```text
L0 Scaffold
L1 Vertical Slice
L2 Integrated Feature
L3 Developed Feature
L4 Feature Complete
L5 Hardened
L6 Release Qualified
```

A system can be `CORE_1_0`, fully integrated, and still remain below L4. Historical “implemented / qualified” wording records successful proof at the stated contract; it must not be interpreted as a blanket prohibition on further player-facing feature development.

### 2026-09-26 post-depth maturity reconciliation

`FeatureCompleteResult.md` records `FEATURE_COMPLETE / HUMAN-UNVALIDATED`. The L4 labels below are relative to each system's **bounded Campaign One role**. They do not promote CUT/DEFER scope or claim that a subsystem is generally broad, polished, balanced, accessible, or human-validated.

| System / surface | 1.0 class | Current posture | 1.0 requirement / decision |
| --- | --- | --- | --- |
| GameLoop / deterministic time | CORE_1_0 | L5 — Hardened / qualified | Preserve current fixed-step, backpressure, lifecycle and precision contracts. |
| Player state / vitals / attributes | CORE_1_0 | L4 — Feature complete for bounded Campaign One support | Holds the progression facts Campaign One actually consumes; no universal new progression currency is required. |
| Relationship Experience / Memory / Bond / Connection | CORE_1_0 | L4 — Feature complete / HUMAN-UNVALIDATED | Six-anchor long-horizon history and capability provenance are present; remaining work is Beta comprehension/tuning, not more relationship authority. |
| Traits / permanent capabilities | CORE_1_0 | L4 — Feature complete bounded four-capability / two-doctrine build | Durable learned capability, selective doctrine focus, repeated independent use, causal provenance, and finale payoff are present without a generic skill tree. |
| Essence / Resonance | CORE_1_0 | L4 — Feature complete supporting progression / balance HUMAN-UNVALIDATED | Supports relationship-mediated capability progression; remaining uncertainty is tuning/pacing rather than missing feature identity. |
| NPC interaction | CORE_1_0 | L4 — Feature complete authored campaign surface | Provides anchor relationships, decisions, services, prerequisite-gated dialogue, and current campaign interactions. |
| Dialogue | CORE_1_0 | L4 — Feature complete authored decision/consequence surface | Preserve spoiler-safe prerequisite behavior and contextual causal explanation; remaining work is presentation/comprehension tuning. |
| Quest | CORE_1_0 | L4 — Feature complete bounded Campaign One objective structure | Campaign problems repeatedly consume capability, relationship, knowledge, faction, world, travel, combat, and finale state. |
| Exploration / authored travel | CORE_1_0 | L4 — Feature complete at bounded authored-travel scope | Location matters where Campaign One requires it; no open-world topology, schedules, coordinates, or pathfinding pillar is required for 1.0. |
| Combat | CORE_1_0 | L4 — Feature complete at bounded Campaign One tactical scope | The campaign includes the active tactical conflict it requires; a separate combat-progression game is outside the 1.0 product role. |
| Knowledge | CORE_1_0 | L4 — Feature complete bounded fact authority / HUMAN-UNVALIDATED | Owns who knows objective facts and participates independently in GC08-GC10 strategic composition. |
| Faction Reputation | CORE_1_0 | L4 — Feature complete bounded institutional-standing authority / HUMAN-UNVALIDATED | Institutional standing remains independent from personal relationships and changes authored late-campaign options. |
| World State | CORE_1_0 | L4 — Feature complete bounded objective-state authority / HUMAN-UNVALIDATED | Persistent regional conditions remain independent and materially constrain authored preparation/finale choices. |
| Copy system | CORE_1_0 | L4 — Feature complete bounded delegation / Mastery Compression | Archive + Forge standing responsibilities provide distinct role/location contexts and exception families while preserving player judgment. |
| Routine familiarity / earned delegation | CORE_1_0 | L4 — Feature complete bounded mastery-to-delegation progression | Three personally learned routines plus Archive + Forge standing responsibility establish attention compression without generic queues or autonomous planning. |
| Persistence / save / load | CORE_1_0 | L5 — Hardened core infrastructure | Must survive whole-campaign progression. |
| Save import / export | CORE_1_0 | L4/L5 — Feature complete support path; recovery hardening remains release work | Preserve as recovery/portability path. |
| Autosave | SUPPORTING_1_0 | L4/L5 — Feature complete support path; preserve reliability | Must not corrupt or overwrite progression unexpectedly. |
| Bounded offline progression | CORE_1_0 | L5 — Hardened bounded authority | Safe already-running work only; no narrative auto-resolution. |
| Chapter-scale composition | CORE_1_0 | L4 — Feature complete Campaign One composition | GC08-GC10 and the full spine compose canonical authorities without chapter-local shadow state or a generic ChapterEngine. |
| Content intelligence / reachability / chapter validation | SUPPORTING_1_0 | L5 — Hardened developer support authority | Required developer-side authoring protection as campaign content grows. |
| Player Insight / causal journal / build provenance | SUPPORTING_1_0 | L4 — Feature complete supporting legibility / HUMAN-UNVALIDATED | Existing projections explain relationship history, build provenance, mastery/exception state, and late-game capability consequences; human comprehension remains Beta evidence. |
| Contextual `Available because` explanation | SUPPORTING_1_0 | L4 — Feature complete supporting causal explanation / HUMAN-UNVALIDATED | Available choices explain qualifying evidence without revealing locked future prerequisites. |
| Notifications / return summary | SUPPORTING_1_0 | L4 — Feature complete supporting feedback | Meaningful ordinary change and durable exception attention have a player-facing feedback path. |
| Main menu | CORE_1_0 | L4 — Feature complete support surface | New Game, Continue, Load, Import, Export must remain usable. |
| Navigation / dashboard | SUPPORTING_1_0 | L4 — Feature complete support surface / HUMAN-UNVALIDATED | Real 1.0 surfaces are reachable and cut/deferred placeholders are removed; Beta may still tune comprehension/presentation. |
| Settings | MINIMAL_1_0 | L4 — Feature complete at minimal intended scope | Only settings required for basic play/release usability are in scope; remaining work is Beta/RC usability or accessibility repair. |
| Dedicated in-game Save Management page | CUT as separate system | removed from primary navigation / compatibility IDs retained | Existing main-menu save authority is canonical. Do not restore a duplicate persistence surface. |
| Separate Skills / skill-tree system | CUT | removed from primary navigation / compatibility IDs and legacy serialized field retained inertly | Traits already own capability progression. Compatibility state such as `availableSkillPoints` may remain for old-save stability, but Campaign One must not display, award, or consume it as player progression. |
| General Inventory system | DEFER_POST_1_0 | removed from primary navigation / reference spec retained | Current 1.0 campaign does not require a general item-storage economy. Reconsider only if accepted campaign evidence proves need. |
| General Equipment system | DEFER_POST_1_0 | deferred; current player-facing wording reconciled | Do not make equipment a 1.0 pillar unless a concrete campaign/combat requirement cannot be expressed through current authorities. |
| General Crafting system | CUT for Campaign One | removed from primary navigation / reference and compatibility fixture IDs retained inertly | Gronk/forge content may remain authored interaction/routine content without a generic crafting economy. Generic `crafter_*` service fixtures must not become executable Campaign One progression authority. |
| Generic ChapterEngine | CUT | intentionally absent | Continue bounded chapter projections. Reconsider only after repeated concrete content friction. |
| Generic narrative condition DSL | CUT | intentionally absent | Existing canonical domain prerequisites remain authoritative. |
| Dynamic chapter/plugin registry | DEFER_POST_1_0 | absent | Not required for bounded Campaign One. |
| Generic capability graph | DEFER_POST_1_0 | absent | Use explicit Trait/domain applications plus the bounded two-profile doctrine derivation. The Relationship Capability Constellation does not promote an arbitrary graph or combination engine into 1.0. |
| Large Trait catalog | DEFER_POST_1_0 | not needed | Meet the completion-definition build floor only. |
| Generic / unbounded Copy task chaining | CUT | intentionally prohibited | No arbitrary repeat queues, generic chaining, autonomous reprioritization, leftover-delta chaining, or offline standing selection. The bounded Archive standing-order contract is a CORE Copy extension, not a general planner. |
| Autonomous Copy planning | CUT | intentionally prohibited | Campaign One's organizational ceiling is player -> specialized Copies -> player-authored priorities -> authored standing responsibilities -> exception escalation. Copies may apply an explicitly player-authorized mastered procedure inside a typed safe envelope, but may not invent goals, priorities, strategies, manage subordinate Copies, or make irreversible decisions. Out-of-envelope states escalate to the player. |
| Offline narrative/social/quest/world progression | CUT | intentionally prohibited | Offline settlement remains bounded to approved routine/passive authority. |
| Open-world NPC schedules | DEFER_POST_1_0 | absent | Campaign-authored presence is sufficient. |
| General rumor/belief simulation | DEFER_POST_1_0 | absent | Per-NPC Knowledge plus authored transfer remains sufficient. |
| General economy simulation | DEFER_POST_1_0 | absent | Use bounded rewards/costs necessary for progression only. |
| Procedural campaign generation | CUT | absent | Campaign One is authored. |
| New Game+ | DEFER_POST_1_0 | absent | Not required for 1.0 completion. |
| Endless/endgame progression | DEFER_POST_1_0 | absent | Campaign completion is the 1.0 end condition. |
| Interplanetary campaign / AI-war continuation | DEFER_POST_1_0 | narrative seed | Post-1.0 campaign/expansion material. |
| Audio / music | SUPPORTING_1_0 | not completion-critical yet | Basic release presentation required before RC; no large audio pipeline needed for Alpha. |
| Final visual/art pass | SUPPORTING_1_0 | Beta presentation review / human evidence pending | Make bounded presentation repairs from heuristic, synthetic, accessibility, release-review, or human evidence; only human sessions establish actual player perception. Do not turn this into a speculative art-system expansion. |
| Onboarding / first-session guidance | CORE_1_0 | L4 — Feature complete path / HUMAN-UNVALIDATED | Normal UI teaches the first meaningful loop; human Beta must validate comprehension and may drive bounded tuning. |
| Accessibility baseline | SUPPORTING_1_0 | L1/L2 — Incomplete supporting feature | Keyboard/focus/readability issues become Beta/RC blockers according to completion contracts. |
| Desktop browser support | CORE_1_0 release | L5 technical evidence / L6 exact-RC pending | Chromium-class + Firefox desktop are primary 1.0 targets. |
| Full mobile product support | DEFER_POST_1_0 | responsive code exists | Avoid regressions, but mobile is not a primary 1.0 release target. |
| Analytics / telemetry | DEFER_POST_1_0 | absent | Not required to ship a bounded standalone web game. |
| Live-service backend | CUT | absent | 1.0 remains a client-side bounded game unless a later explicit product decision changes this. |

## 1.0 content-system obligations

A `CORE_1_0` system is not complete merely because its reducer/component exists **or because one bounded campaign consumer passed qualification**. It must participate where required by the campaign and reach sufficient player-facing depth for its intended role.

The historical integration floor is:

- all six anchor Relationship NPCs receive meaningful long-horizon use;
- at least four durable relationship-derived capability identities across at least three anchors;
- at least two capabilities have meaningful cross-domain application;
- at least three personally learned routine identities across at least two contexts;
- Relationship / Knowledge / Faction / World State remain visibly distinct where the campaign uses them;
- the finale consumes prior state;
- save/load and bounded offline behavior remain coherent across the full campaign.

## Placeholder policy

Player-facing placeholders are not harmless now that the project is a playable Content Alpha.

For 1.0 navigation:

```text
implemented required surface -> show it
required but not yet implemented -> show only when the active Alpha package needs player testing
cut/deferred surface -> remove from primary player navigation
```

Do not advertise `Skills`, `Inventory`, `Crafting`, or a duplicate `Saves` system as upcoming required game features merely because historical navigation scaffolding exists. Compatibility fields or fixture IDs may remain when removal would create migration risk, but they must stay inert and non-player-authoritative unless this matrix is explicitly revised.

## Scope-change rule

To promote a `DEFER_POST_1_0` or `CUT` item into 1.0, record:

1. the exact unsatisfied completion requirement;
2. evidence that existing `CORE_1_0` authorities cannot satisfy it cleanly;
3. the smallest new scope required;
4. the 1.0 schedule/content cost;
5. what lower-value scope is removed or delayed if necessary;
6. updated completion and qualification criteria.

## Governing principle

> **A smaller complete game beats a larger collection of unfinished systems. A qualified vertical slice is proof that a feature can work, not proof that the feature is finished.**
