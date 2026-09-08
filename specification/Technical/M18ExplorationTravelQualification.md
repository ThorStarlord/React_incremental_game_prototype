# M18 — Narrow Exploration / Travel Vertical Slice Qualification

**Status:** Preregistered before behavioral implementation  
**Baseline:** `main` = `4a82438214aebf165da0bcc519dfe127ef7871c9`  
**Baseline tree:** `51fac9c34006a966d2347bdedecf9e93b8a5139f`  
**Branch:** `feature/m18-exploration-travel-vertical-slice`

## 1. Scientific question

> Can the player intentionally traverse a small authored world graph through a player-facing travel interface, with canonical player location producing ordinary gameplay consequences, without duplicate location flags or a generalized world simulation?

## 2. Existing substrate to preserve

- `Player` state already owns canonical player `location` through `setLocation`.
- Existing listener middleware already consumes `setLocation` for `REACH_LOCATION` Quest objectives.
- Existing milestone tests simulate travel by dispatching `setLocation` directly.
- Existing save/load already persists Player state and therefore the canonical player location unless reconnaissance proves otherwise.

M18 should make those existing contracts player-facing rather than replacing them.

## 3. Authority boundaries

```text
World / exploration content
-> owns authored spatial topology

Player
-> owns canonical player location

NPC
-> owns canonical NPC location where applicable

Quest / Story
-> reacts to location facts

Relationship
-> does not own objective location
```

M18 must not introduce shadow booleans such as `playerAtGrove`, `willowNearby`, or `silasInMarket` as substitute spatial authority.

## 4. Production slice

Target a deliberately tiny authored graph using existing production location IDs where possible. Initial candidate topology:

```text
Merchant District
      |
  City Center
      |
   City Gate
      |
Whispering Woods
```

Reconnaissance may adjust names/edges to match the repository's actual production location identifiers, but the experiment remains a small bounded graph rather than an open-world system.

## 5. Minimal capability under test

The smallest acceptable implementation should provide:

1. authored location definitions;
2. authored direct connections / adjacency;
3. a pure authoritative route-availability check;
4. a runtime travel action/thunk that rejects illegal travel before mutation;
5. a player-facing travel surface that only offers legal neighboring destinations;
6. reuse of canonical `Player.location` rather than a second current-location store;
7. reuse of existing `setLocation` consequences so ordinary `REACH_LOCATION` Quest objectives advance without a new Travel-to-Quest bridge.

No travel duration is required for M18 unless reconnaissance shows a safe existing clock contract that makes it genuinely simpler.

## 6. Required controls

### Control A — legal adjacent travel

A player at one authored location may travel to a directly connected destination. The canonical `Player.location` changes exactly once.

### Control B — illegal jump

A player may not jump directly between two locations without an authored direct connection. UI omission is not sufficient: a direct runtime invocation must reject before changing Player state or Quest progress.

### Control C — ordinary Quest consequence

A production `REACH_LOCATION` objective must be completable by using the player-facing travel surface / authoritative travel action. M18 must reuse the existing `setLocation` listener rather than introducing a second exploration-specific Quest bridge.

### Control D — persistence

After legal travel, save/load must preserve canonical player location. The player must then be able to continue legal travel from the restored location.

### Control E — no duplicate spatial authority

No second reducer field may become authoritative for current player location. Any exploration/world definition layer may describe topology but not mirror the player's live current location.

## 7. Falsification / stop conditions

Stop and record the result instead of forcing M18 through if:

1. current Player location cannot safely remain canonical without a prerequisite migration;
2. existing `setLocation` Quest integration is defective or replay-unsafe in a way that blocks the production proof;
3. legal routing can only be enforced in UI and cannot be enforced below UI without a disproportionate architecture change;
4. a four-location graph requires a generalized pathfinding/open-world framework;
5. travel requires a new duplicated current-location state;
6. the smallest implementation would force premature clock/offline/travel-timer architecture;
7. production location identifiers are too inconsistent to author a coherent bounded graph without first repairing location authority.

If a prerequisite defect is found, isolate and qualify that repair separately before restarting M18.

## 8. Explicit non-goals

M18 does not attempt to qualify:

- an open world;
- free-form coordinates;
- pathfinding beyond authored direct adjacency;
- travel-time economy;
- mid-travel state;
- random encounters in transit;
- exploration resources;
- procedural maps;
- NPC schedule simulation;
- world-derived Relationship Tether (reserved for M19);
- Copy travel;
- offline travel;
- generalized world-state simulation.

## 9. Acceptance criteria

PASS only if all of the following hold on one exact candidate head:

1. the baseline SHA/tree and preregistration precede behavioral implementation;
2. one bounded authored production location graph exists;
3. a player-facing travel UI exposes legal neighboring destinations;
4. legal travel changes canonical `Player.location`;
5. illegal direct travel is rejected below UI before state mutation;
6. at least one ordinary production `REACH_LOCATION` Quest objective advances through the existing `setLocation` listener after player-facing travel;
7. no new Travel-to-Quest bridge is introduced;
8. save/load preserves the canonical traveled location and legal travel can continue afterward;
9. no duplicate player-location authority or shadow location flags are introduced;
10. no generalized pathfinding/world/condition DSL is introduced;
11. accumulated M4-M17 qualification remains green;
12. dedicated M18 qualification passes;
13. TypeScript passes;
14. production build passes;
15. the documentation-complete final head is exactly qualified before merge.

## 10. Evidence ceiling

A PASS would justify only:

> One bounded authored world graph supports legal player-facing movement, authoritative route validation, persistence, and ordinary location-sensitive Quest consequences through the existing location event bridge.

A PASS would not prove open-world exploration, good map design, meaningful travel-time economy, procedural exploration, random encounters, broad world simulation, world-derived Tether, campaign-scale navigation, or human enjoyment/pacing.

## 11. Merge authority

Exact-head Build Validation is merge authority. Gemini review is not merge authority. Merge only the exact qualified head, using an expected-head guard where available, verify the integrated tree, inspect actual post-merge workflow reality, and stop before M19.
