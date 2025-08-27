# Copy Bridge – Relationship → Essence → Resonance (Phase 6)

Short, system-situated lines that reinforce conceptual links exactly when player needs them.

## Bridge Moments
| Moment | Trigger | Copy | Delivery Channel |
|--------|---------|------|------------------|
| Bond Action Used First Time | updateNPCRelationshipThunk(change>0 first) | "Affection shifts. Potential stirs." | Subtle HUD toast (low priority) |
| Essence Rate > 0 (post first interaction) | essenceRate just transitioned from 0 | "A trickle of essence responds to newfound rapport." | Toast |
| Trait Affordable | essence >= cheapestTraitCost | "Shaping yourself is now within reach." | Traits tab pulse + tooltip |
| First Trait Purchased | trait purchase success | See firstResonanceCopy | Modal (blocking) |
| Post First Resonance (next tick) | after resonance:first event + 5s | "Further resonance awaits deeper bonds or broader connections." | Toast |

## Tone Guidelines
- Avoid overt tutorial voice; imply discovery.
- Verbs: stir, align, weave, hum, crystallize.
- Keep lines < 70 chars for HUD readability.

## Implementation Notes
Centralize triggers in a `useNarrativeBridge()` hook watching selectors to avoid scattering ephemeral state watchers across components.
