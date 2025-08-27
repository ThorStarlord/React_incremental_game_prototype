// Phase 2: Depth taxonomy & affinity band helpers.
// Provides centralized mapping utilities for narrative + UI styling.

export interface AffinityBand {
  key: string;
  min: number;
  max: number;
  label: string;
  tone: string; // short descriptor for future voice modulation
  styleToken: string; // maps to theme or css module token
}

export const affinityBands: AffinityBand[] = [
  { key: 'A0', min: -Infinity, max: -1, label: 'Strained', tone: 'cautious', styleToken: 'affinityStrained' },
  { key: 'A1', min: 0, max: 19, label: 'Tentative', tone: 'polite', styleToken: 'affinityTentative' },
  { key: 'A2', min: 20, max: 39, label: 'Warming', tone: 'hopeful', styleToken: 'affinityWarming' },
  { key: 'A3', min: 40, max: 59, label: 'Familiar', tone: 'casual', styleToken: 'affinityFamiliar' },
  { key: 'A4', min: 60, max: 79, label: 'Close', tone: 'invested', styleToken: 'affinityClose' },
  { key: 'A5', min: 80, max: 94, label: 'Bonded', tone: 'intimate', styleToken: 'affinityBonded' },
  { key: 'A6', min: 95, max: 100, label: 'Resonant', tone: 'synergistic', styleToken: 'affinityResonant' }
];

export const getAffinityBand = (value: number): AffinityBand => {
  for (const band of affinityBands) {
    if (value >= band.min && value <= band.max) return band;
  }
  // Fallback: clamp & return last / first
  return value > 100 ? affinityBands[affinityBands.length - 1] : affinityBands[0];
};

export interface DepthLevel {
  depth: number;
  label: string;
  copySnippet: string;
}

export const depthLevels: DepthLevel[] = [
  { depth: 1, label: 'Spark', copySnippet: 'A faint awareness forms.' },
  { depth: 2, label: 'Thread', copySnippet: 'A thread of intent connects you.' },
  { depth: 3, label: 'Current', copySnippet: 'The current between you steadies.' },
  { depth: 4, label: 'Grove', copySnippet: 'Roots begin to intertwine.' },
  { depth: 5, label: 'Anchor', copySnippet: 'The bond roots deeper.' },
  { depth: 6, label: 'Chorus', copySnippet: 'Your intents begin to harmonize.' },
  { depth: 7, label: 'Vein', copySnippet: 'Essence courses freely now.' },
  { depth: 8, label: 'Loom', copySnippet: 'Patterns coalesce between you.' },
  { depth: 9, label: 'Nexus', copySnippet: 'A nexus of possibility forms.' },
  { depth: 10, label: 'Convergence', copySnippet: 'Everything hums in alignment.' }
];

export const getDepthLevel = (depth: number): DepthLevel | undefined => depthLevels.find(l => l.depth === depth);
