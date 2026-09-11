import type { RootState } from '../../app/store';
import type { ChapterRouteDefinition } from './ChapterDefinitions';

/**
 * A deliberately small normalization layer for the two requirement kinds that
 * are already repeated across Merchant District and Archive Inquiry chapter
 * projections. This is not a narrative DSL and owns no gameplay state.
 */
export type ChapterRequirement =
  | { kind: 'experience'; id: string }
  | { kind: 'completed_dialogue'; id: string };

export const listChapterRouteRequirements = (
  route: ChapterRouteDefinition
): ChapterRequirement[] => [
  ...(route.requiredExperienceIds ?? []).map(id => ({
    kind: 'experience' as const,
    id,
  })),
  ...(route.requiredCompletedDialogueIds ?? []).map(id => ({
    kind: 'completed_dialogue' as const,
    id,
  })),
];

export const chapterRequirementKey = (requirement: ChapterRequirement): string =>
  `${requirement.kind}:${requirement.id}`;

export const isChapterRequirementSatisfied = (
  state: RootState,
  requirement: ChapterRequirement
): boolean => {
  switch (requirement.kind) {
    case 'experience':
      return Boolean(state.relationships.experiencesById[requirement.id]);
    case 'completed_dialogue':
      return Object.values(state.npcs.npcs).some(npc =>
        (npc.completedDialogues ?? []).includes(requirement.id)
      );
  }
};
