# Narrative Integration Guide (Phase 10)

## Overview
Narrative assets are modular data + minimal helper utilities. Systems subscribe to selectors & emit narrative events without hard-coding text into reducers.

## Directory Map
- onboarding/BeatSheet.md – Trigger table for initial beats
- onboarding/CopyBridge.md – Micro-copy transitions
- relationship/depthMap.ts – Affinity & depth taxonomy utilities
- relationship/RelationshipStates.md – Human-readable spec
- traits/TraitProvenance.json – Trait source flavor and thresholds
- resonance/FirstResonanceCopy.ts – Modal copy config
- essencePrimer.md – Resource conceptualization
- unlocks/SecondNPCUnlock.md – Expansion gating spec
- events/DynamicEvents.json – Declarative event copy
- interaction/InteractionLines.json – Pools for ambient interaction lines
- docs/NarrativeEvents.md – Instrumentation surface

## Integration Steps
1. Add a `NarrativeSlice` storing:
   - firedEventKeys: Set<string>
   - flags: Record<string, boolean>
2. Create `logNarrativeEvent` action with guard (skip if already fired).
3. Implement `useNarrativeBridge()` hook:
   - Watches affinity changes, essence thresholds, trait purchases via selectors.
   - Dispatches `logNarrativeEvent` & enqueues toasts / modal triggers referencing assets.
4. Wire first resonance modal:
   - On `resonance:first` event, show modal component fed by `firstResonanceCopy`.
5. Implement second NPC unlock watcher inside same hook (Phase 5 spec conditions).

## Style / Voice Guidelines
- Evocative but restrained; minimize lorem-like filler.
- Avoid direct exposition of mechanics; hint via metaphor.

## Testing
- Write unit tests for depthMap band resolution & event guard logic.
- Create a stub store in tests firing synthetic affinity deltas to assert event emission ordering.

## Future
- Localize by swapping JSON + config modules; keep string assembly minimal.
- Expand line pools keyed by affinity band & time-since-last-interaction.
