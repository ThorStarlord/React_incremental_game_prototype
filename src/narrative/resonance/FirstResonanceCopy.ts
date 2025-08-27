// Phase 4: Copy surfaced when player completes their first trait resonance.
// Intentionally lightweight & data-driven for optional future localization.

export interface ResonanceCopyConfig {
  id: string; // event key
  title: string;
  body: string;
  cta?: string;
  analyticsEvent?: string;
}

export const firstResonanceCopy: ResonanceCopyConfig = {
  id: 'resonance:first',
  title: 'First Resonance',
  body: 'A subtle chord vibrates through the bond. Insight settles — traits aren\'t just upgrades; they are how relationships reshape potential.',
  cta: 'Continue',
  analyticsEvent: 'narrative_resonance_first_shown'
};

export default firstResonanceCopy;
