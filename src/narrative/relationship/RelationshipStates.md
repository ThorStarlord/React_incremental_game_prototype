# Relationship States & Depth Taxonomy (Phase 2)

Defines semantic layers for affinity / connectionDepth thresholds to unify copy tone and mechanical unlock hints.

## Affinity Bands (Player -> NPC)
| Band | Range | Label | Tone Anchor | UI Hint |
|------|-------|-------|-------------|---------|
| A0 | < 0 | Strained | Cautious / guarded | Red tint, lock icons |
| A1 | 0–19 | Tentative | Polite distance | Neutral styling |
| A2 | 20–39 | Warming | Emerging trust | Soft highlight |
| A3 | 40–59 | Familiar | Casual rapport | Unlock slot 1 tooltips |
| A4 | 60–79 | Close | Shared context | Unlock slot 2 tooltips |
| A5 | 80–94 | Bonded | Invested partnership | Pre-resonance flourish |
| A6 | 95–100 | Resonant | Synergistic flow | Pulsing essence accent |

## Connection Depth Levels
`connectionDepth` is a coarse progression gate—used sparingly to avoid redundancy with affinity.

| Depth | Narrative Label | Core Meaning | Recommended Trigger Copy Snippet |
|-------|-----------------|--------------|----------------------------------|
| 1 | Spark | Initial awareness | "A faint awareness forms." |
| 2 | Thread | Minimal rapport | "A thread of intent connects you." |
| 3 | Current | Reliable interaction | "The current between you steadies." |
| 4 | Grove | Shared outlook | "Roots begin to intertwine." |
| 5 | Anchor | Stable bond | "The bond roots deeper." |
| 6 | Chorus | Mutually amplifying | "Your intents begin to harmonize." |
| 7 | Vein | Potent shared channel | "Essence courses freely now." |
| 8 | Loom | Co-creative potential | "Patterns coalesce between you." |
| 9 | Nexus | Strategic synergy | "A nexus of possibility forms." |
| 10 | Convergence | Peak resonance precursor | "Everything hums in alignment." |

## Mapping Strategy
- Use Affinity for granular pacing and everyday feedback.
- Use Depth for milestone notifications (toast) & unlocking broader systems (e.g., multi-NPC resonance, advanced services).

## Copy Integration
A small selector can map an affinity number -> band label & style token. Depth label used in depth level-up notifications.

See `depthMap.ts` for exported mapping objects.
