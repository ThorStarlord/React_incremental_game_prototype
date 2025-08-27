# Second NPC Unlock – Scholar Elara (Phase 5)

## Purpose
Introduce the first *expansion* of social space after the player internalizes the core loop with Elder Willow. Reinforces that forging a stable bond unlocks new relationship vectors (knowledge economy, trait diversity).

## Unlock Condition (Proposed)
- Elder Willow affinity >= 35 (within Band A2 Warming) AND
- Player has resonated at least 1 trait (tracked via event `resonance:first`)

## Trigger Implementation Sketch
Selector checks conditions; when met and `meta.flags.secondNpcUnlocked !== true` dispatch an unlock action:
```
if (canUnlockSecondNpc && !flags.secondNpcUnlocked) {
  dispatch(setFlag({ key: 'secondNpcUnlocked', value: true }));
  dispatch(discoverNPCThunk('npc_scholar_elara'));
  dispatch(addNotification({ type: 'info', message: 'A new scholarly presence becomes available in the Grand Library.' }));
}
```

## Intro Copy (Toast + Optional Modal)
> A ripple of inquiry permeates the bond. Scholar Elara has taken interest in your emerging potential.

Modal (optional) body:
> New NPC: Scholar Elara – Offers knowledge-focused traits and research tasks that accelerate essence learning pathways.

CTA: "Visit the Grand Library"

## Mechanical Effects
- Adds additional trait sources (ScholarlyInsight, QuickLearner)
- Broadens potential synergy: stacking essence multipliers.

## Future Extensions
- Mini quest chain that teaches multi-step relationship interactions (dialogue choices → quest → trait offering).

## Analytics
- `unlock_npc_second_triggered`
- `unlock_npc_second_modal_view`
- `unlock_npc_second_visit_first_time`
