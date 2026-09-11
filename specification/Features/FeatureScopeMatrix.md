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

## Scope lock

There are **no `UNDECIDED` critical-path items** in this provisional matrix.

| System / surface | 1.0 class | Current posture | 1.0 requirement / decision |
| --- | --- | --- | --- |
| GameLoop / deterministic time | CORE_1_0 | implemented / qualified | Preserve current fixed-step, backpressure, lifecycle and precision contracts. |
| Player state / vitals / attributes | CORE_1_0 | implemented | Keep only progression needed by campaign play; no universal new progression currency. |
| Relationship Experience / Memory / Bond / Connection | CORE_1_0 | implemented / qualified | Central source of durable social history and learning provenance. |
| Traits / permanent capabilities | CORE_1_0 | implemented / qualified | Own durable learned capability identity; expand only to bounded 1.0 build floor. |
| Essence / Resonance | CORE_1_0 | implemented / qualified | Supports relationship-mediated capability progression. |
| NPC interaction | CORE_1_0 | implemented | Required for anchor cast and campaign decisions. |
| Dialogue | CORE_1_0 | implemented / content-driven | Primary authored decision/consequence surface; preserve spoiler-safe prerequisite behavior. |
| Quest | CORE_1_0 | implemented / qualified | Active objective structure for campaign problems. |
| Exploration / authored travel | CORE_1_0 | implemented / qualified | Location remains objective player state; only campaign-needed locations required. |
| Combat | CORE_1_0 | bounded MVP implemented | Required where campaign conflict needs active tactical resolution; do not expand into a separate combat game by inertia. |
| Knowledge | CORE_1_0 | implemented / qualified | Owns who knows objective facts. |
| Faction Reputation | CORE_1_0 | implemented / qualified | Owns institutional standing independent from personal relationships. |
| World State | CORE_1_0 | implemented / qualified | Owns persistent objective regional conditions. |
| Copy system | CORE_1_0 | implemented / qualified | Bounded execution of understood repeatable work. |
| Routine familiarity / earned delegation | CORE_1_0 | implemented, limited breadth | Reach minimum 1.0 breadth without automatic chaining or hidden mastery. |
| Persistence / save / load | CORE_1_0 | implemented | Must survive whole-campaign progression. |
| Save import / export | CORE_1_0 | implemented through main menu | Preserve as recovery/portability path. |
| Autosave | SUPPORTING_1_0 | implemented | Must not corrupt or overwrite progression unexpectedly. |
| Bounded offline progression | CORE_1_0 | implemented / qualified | Safe already-running work only; no narrative auto-resolution. |
| Chapter-scale composition | CORE_1_0 | three heterogeneous projections qualified | Continue as composition over canonical authorities; no chapter-local shadow state. |
| Content intelligence / reachability / chapter validation | SUPPORTING_1_0 | implemented | Required developer-side authoring protection as campaign content grows. |
| Player Insight / causal journal / build provenance | SUPPORTING_1_0 | implemented / M26 deepens | Make consequence and capability provenance understandable without spoilers. |
| Contextual `Available because` explanation | SUPPORTING_1_0 | implemented | Keep explanations causal and player-facing, not debug output. |
| Notifications / return summary | SUPPORTING_1_0 | implemented | Ensure meaningful changes and offline progress are visible. |
| Main menu | CORE_1_0 | implemented | New Game, Continue, Load, Import, Export must remain usable. |
| Navigation / dashboard | SUPPORTING_1_0 | implemented | Must expose only real 1.0 surfaces; remove misleading placeholders. |
| Settings | MINIMAL_1_0 | implemented | Only settings required for basic play/release usability. |
| Dedicated in-game Save Management page | CUT as separate system | placeholder | Existing main-menu save authority is canonical. Remove/redirect placeholder rather than duplicate persistence semantics. |
| Separate Skills / skill-tree system | CUT | placeholder | Traits already own capability progression. Remove the player-facing placeholder from 1.0 navigation. |
| General Inventory system | DEFER_POST_1_0 | placeholder / reference spec | Current 1.0 campaign does not require a general item-storage economy. Remove placeholder from primary navigation; reconsider only if campaign content proves need. |
| General Equipment system | DEFER_POST_1_0 | partial/reference language | Do not make equipment a 1.0 pillar unless a concrete campaign/combat requirement cannot be expressed through current authorities. |
| General Crafting system | CUT for Campaign One | placeholder / reference ideas | Gronk/forge content may remain authored interaction/routine content without a generic crafting economy. Remove placeholder from primary navigation. |
| Generic ChapterEngine | CUT | intentionally absent | Continue bounded chapter projections. Reconsider only after repeated concrete content friction. |
| Generic narrative condition DSL | CUT | intentionally absent | Existing canonical domain prerequisites remain authoritative. |
| Dynamic chapter/plugin registry | DEFER_POST_1_0 | absent | Not required for bounded Campaign One. |
| Generic capability graph | DEFER_POST_1_0 | absent | Use explicit Trait/domain applications while 1.0 scope is bounded. |
| Large Trait catalog | DEFER_POST_1_0 | not needed | Meet the completion-definition build floor only. |
| Automatic Copy task chaining | CUT | intentionally prohibited | Player retains task/start authority. |
| Autonomous Copy planning | CUT | intentionally prohibited | No irreversible or strategic decision delegation. |
| Offline narrative/social/quest/world progression | CUT | intentionally prohibited | Offline settlement remains bounded to approved routine/passive authority. |
| Open-world NPC schedules | DEFER_POST_1_0 | absent | Campaign-authored presence is sufficient. |
| General rumor/belief simulation | DEFER_POST_1_0 | absent | Per-NPC Knowledge plus authored transfer remains sufficient. |
| General economy simulation | DEFER_POST_1_0 | absent | Use bounded rewards/costs necessary for progression only. |
| Procedural campaign generation | CUT | absent | Campaign One is authored. |
| New Game+ | DEFER_POST_1_0 | absent | Not required for 1.0 completion. |
| Endless/endgame progression | DEFER_POST_1_0 | absent | Campaign completion is the 1.0 end condition. |
| Interplanetary campaign / AI-war continuation | DEFER_POST_1_0 | narrative seed | Post-1.0 campaign/expansion material. |
| Audio / music | SUPPORTING_1_0 | not completion-critical yet | Basic release presentation required before RC; no large audio pipeline needed for Alpha. |
| Final visual/art pass | SUPPORTING_1_0 | pre-alpha presentation | Beta work after content scope stabilizes. |
| Onboarding / first-session guidance | CORE_1_0 | incomplete / human-unvalidated | Alpha must provide a normal-UI path into the first meaningful loop; Beta must validate comprehension with humans. |
| Accessibility baseline | SUPPORTING_1_0 | incomplete | Keyboard/focus/readability issues become Beta/RC blockers according to completion contracts. |
| Desktop browser support | CORE_1_0 release | web app exists | Chromium-class + Firefox desktop are primary 1.0 targets. |
| Full mobile product support | DEFER_POST_1_0 | responsive code exists | Avoid regressions, but mobile is not a primary 1.0 release target. |
| Analytics / telemetry | DEFER_POST_1_0 | absent | Not required to ship a bounded standalone web game. |
| Live-service backend | CUT | absent | 1.0 remains a client-side bounded game unless a later explicit product decision changes this. |

## 1.0 content-system obligations

A `CORE_1_0` system is not complete merely because its reducer/component exists. It must participate where required by the campaign.

The completion floor is:

- all six anchor Relationship NPCs receive meaningful long-horizon use;
- at least four durable relationship-derived capability identities across at least three anchors;
- at least two capabilities have meaningful cross-domain application;
- at least three personally learned routine identities across at least two contexts;
- Relationship / Knowledge / Faction / World State remain visibly distinct where the campaign uses them;
- the finale consumes prior state;
- save/load and bounded offline behavior remain coherent across the full campaign.

## Placeholder policy

Player-facing placeholders are not harmless once the project is treated as a playable pre-alpha.

For 1.0 navigation:

```text
implemented required surface -> show it
required but not yet implemented -> show only when the active Alpha package needs player testing
cut/deferred surface -> remove from primary player navigation
```

Do not advertise `Skills`, `Inventory`, `Crafting`, or a duplicate `Saves` system as upcoming required game features merely because historical navigation scaffolding exists.

## Scope-change rule

To promote a `DEFER_POST_1_0` or `CUT` item into 1.0, record:

1. the exact unsatisfied completion requirement;
2. evidence that existing `CORE_1_0` authorities cannot satisfy it cleanly;
3. the smallest new scope required;
4. the 1.0 schedule/content cost;
5. what lower-value scope is removed or delayed if necessary;
6. updated completion and qualification criteria.

## Governing principle

> **A smaller complete game beats a larger collection of unfinished systems.**
