import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import { TRAIT_RESONANCE } from '../../../constants/gameConstants';
import {
  selectBondProfileByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
  selectUsesRelationshipConnectionAuthority,
} from '../../Relationships/state/RelationshipSelectors';

export type TraitResonanceRequirementCode =
  | 'discovered'
  | 'connection'
  | 'assimilation'
  | 'compatibility'
  | 'memory'
  | 'prerequisite'
  | 'essence';

export interface TraitResonanceRequirement {
  code: TraitResonanceRequirementCode;
  label: string;
  met: boolean;
  current?: string | number;
  required?: string | number;
}

export interface TraitResonanceReadiness {
  traitId: string;
  exists: boolean;
  alreadyPermanent: boolean;
  ready: boolean;
  cost: number;
  requirements: TraitResonanceRequirement[];
  blockingMessage?: string;
}

const requirement = (
  code: TraitResonanceRequirementCode,
  label: string,
  met: boolean,
  current?: string | number,
  required?: string | number
): TraitResonanceRequirement => ({ code, label, met, current, required });

/**
 * Canonical pre-commit Resonance readiness projection.
 *
 * This helper is deliberately pure: player-facing surfaces and the acquisition
 * thunk consume the same gates. The authored final Resonance Experience remains
 * a transactional validation step in the thunk because it can fail only while
 * recording the authored event.
 */
export const evaluateTraitResonanceReadiness = (
  state: RootState,
  traitId: string
): TraitResonanceReadiness => {
  const trait = state.traits.traits[traitId];
  if (!trait) {
    return {
      traitId,
      exists: false,
      alreadyPermanent: false,
      ready: false,
      cost: 0,
      requirements: [],
      blockingMessage: `Trait with ID ${traitId} not found`,
    };
  }

  const alreadyPermanent = state.player.permanentTraits.includes(traitId);
  if (alreadyPermanent) {
    return {
      traitId,
      exists: true,
      alreadyPermanent: true,
      ready: false,
      cost: trait.essenceCost ?? 0,
      requirements: [],
      blockingMessage: 'Trait is already permanently acquired',
    };
  }

  const requirements: TraitResonanceRequirement[] = [];
  const discovered = state.traits.discoveredTraits.includes(traitId);
  requirements.push(requirement(
    'discovered',
    'Pattern discovered',
    discovered
  ));

  if (!discovered) {
    return {
      traitId,
      exists: true,
      alreadyPermanent: false,
      ready: false,
      cost: trait.essenceCost ?? 0,
      requirements,
      blockingMessage: `Discover ${trait.name} before attempting Resonance.`,
    };
  }

  const sourceNpcId = trait.sourceNpc || trait.source;
  if (sourceNpcId) {
    if (selectUsesRelationshipConnectionAuthority(state, sourceNpcId)) {
      const profile = selectBondProfileByNpcId(state, sourceNpcId);
      const requiredLevel =
        trait.minimumConnectionLevel ?? TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
      requirements.push(requirement(
        'connection',
        `Connection ${profile.connectionLevel} / ${requiredLevel}`,
        profile.connectionLevel >= requiredLevel,
        profile.connectionLevel,
        requiredLevel
      ));

      const assimilation = selectTraitAssimilationState(state, sourceNpcId, traitId);
      const assimilationThreshold = trait.assimilationThreshold ?? 100;
      requirements.push(requirement(
        'assimilation',
        `Assimilation ${Math.floor(assimilation.progress)}% / ${assimilationThreshold}%`,
        assimilation.progress >= assimilationThreshold,
        Math.floor(assimilation.progress),
        assimilationThreshold
      ));

      const minimumCompatibility = trait.minimumCompatibility ?? 0;
      requirements.push(requirement(
        'compatibility',
        `Compatibility ${Math.floor(assimilation.compatibility)} / ${minimumCompatibility}`,
        assimilation.compatibility >= minimumCompatibility,
        Math.floor(assimilation.compatibility),
        minimumCompatibility
      ));

      const memories = selectRelationshipMemoriesByNpcId(state, sourceNpcId);
      for (const requiredTag of trait.requiredMemoryTags ?? []) {
        const hasEvidence = memories.some(memory =>
          memory.resonanceTags.includes(requiredTag)
        );
        requirements.push(requirement(
          'memory',
          `Memory evidence: ${requiredTag}`,
          hasEvidence,
          hasEvidence ? 'present' : 'missing',
          'present'
        ));
      }
    } else {
      const npc = state.npcs.npcs[sourceNpcId];
      const requiredDepth = TRAIT_RESONANCE.MIN_CONNECTION_DEPTH;
      const currentDepth = npc?.connectionDepth ?? 0;
      requirements.push(requirement(
        'connection',
        `Connection depth ${currentDepth} / ${requiredDepth}`,
        Boolean(npc) && currentDepth >= requiredDepth,
        currentDepth,
        requiredDepth
      ));
    }
  }

  const prerequisiteTraits = Array.isArray(trait.requirements?.prerequisiteTraits)
    ? trait.requirements.prerequisiteTraits as string[]
    : [];
  for (const prerequisite of prerequisiteTraits) {
    requirements.push(requirement(
      'prerequisite',
      `Permanent prerequisite: ${prerequisite}`,
      state.player.permanentTraits.includes(prerequisite),
      state.player.permanentTraits.includes(prerequisite) ? 'learned' : 'missing',
      'learned'
    ));
  }

  const cost = trait.essenceCost ?? 0;
  requirements.push(requirement(
    'essence',
    `Essence ${Math.floor(state.essence.currentEssence)} / ${cost}`,
    state.essence.currentEssence >= cost,
    state.essence.currentEssence,
    cost
  ));

  const firstUnmet = requirements.find(item => !item.met);
  let blockingMessage: string | undefined;
  if (firstUnmet) {
    switch (firstUnmet.code) {
      case 'connection':
        blockingMessage = `Connection requirement not met: ${firstUnmet.label}.`;
        break;
      case 'assimilation':
        blockingMessage = `${firstUnmet.label}.`;
        break;
      case 'compatibility':
        blockingMessage = `Resonance ${firstUnmet.label.toLowerCase()}.`;
        break;
      case 'memory':
        blockingMessage = `Resonance requires ${firstUnmet.label}.`;
        break;
      case 'prerequisite':
        blockingMessage = `Missing ${firstUnmet.label}.`;
        break;
      case 'essence':
        blockingMessage = `Insufficient ${firstUnmet.label}.`;
        break;
      default:
        blockingMessage = `${trait.name} is not ready for Resonance.`;
    }
  }

  return {
    traitId,
    exists: true,
    alreadyPermanent: false,
    ready: !firstUnmet,
    cost,
    requirements,
    blockingMessage,
  };
};

export const selectTraitResonanceReadinessById = createSelector(
  [(state: RootState) => state],
  state => Object.fromEntries(
    Object.keys(state.traits.traits).map(traitId => [
      traitId,
      evaluateTraitResonanceReadiness(state, traitId),
    ])
  ) as Record<string, TraitResonanceReadiness>
);
