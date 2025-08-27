# Narrative Events & Instrumentation (Phase 9)

Defines canonical event keys for narrative progression & analytics.

| Event Key | When Fired | Purpose | Analytics Key |
|-----------|------------|---------|---------------|
| relationship:first_interaction | First successful relationship change (affinity delta > 0) | Anchor bond formation | rel_first_interaction |
| resonance:first | After first trait resonance completes | Measure tutorial core loop success | res_first |
| unlock:npc_scholar_elara | Second NPC unlock condition met | Track world expansion pacing | unlock_second_npc |
| narrative_essence_hover_first | Player first hovers essence HUD | Engagement with resource explanation | narrative_essence_hover_first |
| narrative_essence_threshold_25 | Essence reaches 25 | Early resource accumulation milestone | narrative_essence_threshold_25 |
| narrative_trait_first_affordable | Essence >= cheapestTraitCost | Measures pacing to first affordance | narrative_trait_first_affordable |

## Emission Strategy
- Use a lightweight `dispatch(logNarrativeEvent({ key, at }))` action (to be added) storing a bounded ring buffer in Redux for dev inspection.
- Extension: forward to analytics adapter (no-op now) in a side-effect middleware.

## Guarding
- Each event key should only fire once per save slot unless explicitly marked multi-fire.

## Future Additions
- Multi-NPC resonance events
- Quest narrative beats (chain-based progression markers)
- Trait synergy discovery events
