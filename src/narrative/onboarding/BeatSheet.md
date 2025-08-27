# Opening Beat Sheet – "The Crash" (Phase 1)

| Beat | Trigger Condition | One-Line Copy (Player-Facing) | System Action | Notes |
|------|-------------------|-------------------------------|---------------|-------|
| 1 | New game start (hasSeenIntro === false) | A thunderous crack. The world shudders… then stillness. | Pause passive tick (optional future) | Presently handled by Intro overlay component. |
| 2 | Player clicks Continue (intro line advance 1) | You awaken beneath tangled boughs—memory fractured. | None | Keep text short; reinforce mystery. |
| 3 | Intro completes (final line) | A gentle voice: "Breathe. The Grove holds you." | Dispatch setHasSeenIntro(true) | Un-gates NPC tab glow. |
| 4 | First view of NPC list with only Elder Willow seeded | The presence of an ancient tree-being resonates nearby. | Highlight Elder Willow card | Glow already implemented. Copy pending tooltip variant. |
| 5 | Player clicks Elder Willow | "Roots remember what minds forget." | None | Could surface as dialogue stub later. |
| 6 | Player uses Interact (affinity +10) first time | You feel a faint current of essence form between you. | If first interaction: log narrative event relationship:first_interaction | Sets stage for essence explanation. |
| 7 | Affinity reaches 30 (after two interactions + bond etc.) | The current steadies—connection deepens. | Potential future: show small toast referencing depth threshold | Depth formula documented in depthMap.ts. |
| 8 | Player opens Essence panel / hovers essence HUD first time | Essence: emotional potential crystallized. | Mark essencePrimerShown flag (future) | Tied to EssencePrimer.md copy. |
| 9 | Player earns enough essence to afford first trait (cost <= essence) | The bond hums—something latent seeks form. | Trigger resonance hint UI highlight | Precedes firstResonanceCopy. |
| 10 | Player completes first trait resonance (equips/purchases) | A surge of insight threads through the bond. | Log narrative event resonance:first | Show modal or toast from firstResonanceCopy.ts. |

## Design Goals
- Provide *succinct* sensory & thematic hooks without blocking the incremental flow.
- Map every narrative beat to a concrete game state or player action for future instrumentation.
- Keep early beats non-branching; complexity deferred until multiple NPCs/unlocks.

## Implementation Notes
- All triggers should be centrally enumerable for analytics (see docs/NarrativeEvents.md).
- Copy strings here are **draft**; adjust tone consistency pass after broader narrative voice established.
