import type { RootState } from '../../../app/store';
import { TRAIT_RESONANCE } from '../../../constants/gameConstants';
import {
  selectBondProfileByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
  selectUsesRelationshipConnectionAuthority,
} from '../../Relationships/state/RelationshipSelectors';

export interface TraitResonanceReadiness {
  traitId: string;
  ready: boolean;
  blockers: string[];
  cost: number;
  currentEssence: number;
  discovered: boolean;
  permanent: boolean;
}

export const evaluateTraitResonanceReadiness = (
  state: RootState,
  traitId: string
): TraitResonanceReadiness => {
  const trait = state.traits.traits[traitId];
  const blockers: string[] = [];
  const discovered = state.traits.discoveredTraits.includes(traitId);
  const permanent = state.player.permanentTraits.includes(traitId);
  const currentEssence = state.essence.currentEssence;
  const cost = trait?.essenceCost ?? 0;

  if (!trait) {
    return {
      traitId,
      ready: false,
      blockers: ['Trait definition unavailable.'],
      cost: 0,
      currentEssence,
      discovered: false,
      permanent: false,
    };
  }

  if (!discovered) blockers.push(`Discover ${trait.name} before Resonance.`);
  if (permanent) blockers.push('Trait is already permanent.');

  const sourceNpcId = trait.sourceNpc || trait.source;
  if (sourceNpcId) {
    if (selectUsesRelationshipConnectionAuthority(state, sourceNpcId)) {
      const profile = selectBondProfileByNpcId(state, sourceNpcId);
      const requiredLevel =
        trait.minimumConnectionLevel ?? TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
      if (profile.connectionLevel < requiredLevel) {
        blockers.push(`Connection ${profile.connectionLevel} / ${requiredLevel}.`);
      }

      const assimilation = selectTraitAssimilationState(state, sourceNpcId, traitId);
      const assimilationThreshold = trait.assimilationThreshold ?? 100;
      if (assimilation.progress < assimilationThreshold) {
        blockers.push(
          `Assimilation ${Math.floor(assimilation.progress)}% / ${assimilationThreshold}%.`
        );
      }

      const minimumCompatibility = trait.minimumCompatibility ?? 0;
      if (assimilation.compatibility < minimumCompatibility) {
        blockers.push(
          `Compatibility ${Math.floor(assimilation.compatibility)} / ${minimumCompatibility}.`
        );
      }

      const memories = selectRelationshipMemoriesByNpcId(state, sourceNpcId);
      for (const requiredTag of trait.requiredMemoryTags ?? []) {
        if (!memories.some(memory => memory.resonanceTags.includes(requiredTag))) {
          blockers.push(`Missing Memory evidence: ${requiredTag}.`);
        }
      }
    } else {
      const npc = state.npcs.npcs[sourceNpcId];
      const requiredDepth = TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
      if (!npc || (npc.connectionDepth ?? 0) < requiredDepth) {
        blockers.push(`Connection depth ${npc?.connectionDepth ?? 0} / ${requiredDepth}.`);
      }
    }
  }

  const prerequisiteTraits = Array.isArray(trait.requirements?.prerequisiteTraits)
    ? (trait.requirements?.prerequisiteTraits as string[])
    : [];
  for (const prerequisite of prerequisiteTraits) {
    if (!state.player.permanentTraits.includes(prerequisite)) {
      blockers.push(`Missing prerequisite Trait: ${prerequisite}.`);
    }
  }

  if (currentEssence < cost) {
    blockers.push(`Essence ${currentEssence} / ${cost}.`);
  }

  return {
    traitId,
    ready: blockers.length === 0,
    blockers,
    cost,
    currentEssence,
    discovered,
    permanent,
  };
};
