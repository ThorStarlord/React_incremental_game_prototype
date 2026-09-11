import { doesWorldStateRequirementPass } from '../../WorldState/state/WorldStateSelectors';
import type { DialogueNode } from './NPCTypes';

export interface DialogueAvailabilityPresentationContext {
  completedDialogueIds: readonly string[];
  recordedExperiences: Record<string, { title?: string } | undefined>;
  routineFamiliarity: Record<string, unknown>;
  knownFactIds: readonly string[];
  factionReputationByFactionId: Record<string, number | undefined>;
  worldStateRegions: unknown;
}

export interface DialogueAvailabilityPresentation {
  available: boolean;
  availabilityReasons: string[];
}

const humanizeId = (id: string): string =>
  id
    .replace(/^.*?:/, '')
    .split('_')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/**
 * Evaluates the same bounded prerequisites used by the dialogue-topic surface
 * and, only when every prerequisite passes, returns player-safe causal reasons.
 * Failed topics return no reasons so this helper cannot become a locked-content
 * spoiler surface accidentally.
 */
export const evaluateDialogueAvailabilityPresentation = (
  node: DialogueNode,
  context: DialogueAvailabilityPresentationContext
): DialogueAvailabilityPresentation => {
  if (
    node.repeatable === false &&
    context.completedDialogueIds.includes(node.id)
  ) {
    return { available: false, availabilityReasons: [] };
  }

  const requiredExperiences = node.requiredExperienceIds ?? [];
  if (requiredExperiences.some(id => !context.recordedExperiences[id])) {
    return { available: false, availabilityReasons: [] };
  }

  const anyOfExperiences = node.anyOfExperienceIds ?? [];
  const satisfiedAlternative = anyOfExperiences.find(
    id => Boolean(context.recordedExperiences[id])
  );
  if (anyOfExperiences.length > 0 && !satisfiedAlternative) {
    return { available: false, availabilityReasons: [] };
  }

  const requiredRoutines = node.requiredRoutineFamiliarityIds ?? [];
  if (requiredRoutines.some(id => !context.routineFamiliarity[id])) {
    return { available: false, availabilityReasons: [] };
  }

  const requiredKnowledge = node.requiredKnowledgeFactIds ?? [];
  if (requiredKnowledge.some(id => !context.knownFactIds.includes(id))) {
    return { available: false, availabilityReasons: [] };
  }

  const forbiddenKnowledge = node.forbiddenKnowledgeFactIds ?? [];
  if (forbiddenKnowledge.some(id => context.knownFactIds.includes(id))) {
    return { available: false, availabilityReasons: [] };
  }

  const requiredFactionReputation = node.requiredFactionReputation ?? [];
  if (requiredFactionReputation.some(requirement => {
    const value = context.factionReputationByFactionId[requirement.factionId] ?? 0;
    if (typeof requirement.min === 'number' && value < requirement.min) return true;
    if (typeof requirement.max === 'number' && value > requirement.max) return true;
    return false;
  })) {
    return { available: false, availabilityReasons: [] };
  }

  const requiredWorldState = node.requiredWorldState ?? [];
  if (requiredWorldState.some(requirement =>
    !doesWorldStateRequirementPass(context.worldStateRegions, requirement)
  )) {
    return { available: false, availabilityReasons: [] };
  }

  const availabilityReasons: string[] = [];

  requiredExperiences.forEach(id => {
    availabilityReasons.push(
      context.recordedExperiences[id]?.title || `Recorded experience: ${humanizeId(id)}`
    );
  });

  if (satisfiedAlternative) {
    availabilityReasons.push(
      context.recordedExperiences[satisfiedAlternative]?.title ||
        `Recorded experience: ${humanizeId(satisfiedAlternative)}`
    );
  }

  requiredRoutines.forEach(id => {
    availabilityReasons.push(`Mastered routine: ${humanizeId(id)}`);
  });

  if (requiredKnowledge.length > 0) {
    availabilityReasons.push('Shared knowledge is in place');
  }

  if (requiredFactionReputation.length > 0) {
    availabilityReasons.push('Institutional standing supports this option');
  }

  if (requiredWorldState.length > 0) {
    availabilityReasons.push('Current world conditions support this option');
  }

  return {
    available: true,
    availabilityReasons: Array.from(new Set(availabilityReasons)),
  };
};
