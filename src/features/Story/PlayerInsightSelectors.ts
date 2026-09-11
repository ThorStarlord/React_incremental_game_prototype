import type { RootState } from '../../app/store';
import {
  CHAPTER_DEFINITIONS,
  type ChapterRouteDefinition,
} from './ChapterDefinitions';
import { selectAllChapterProgress } from './ChapterSelectors';

export interface CausalJournalEntry {
  id: string;
  title: string;
  summary: string;
  npcId: string;
  npcName: string;
  causeLabel: string;
  tags: string[];
  timestamp: number;
}

export type OpportunityStatus = 'in_progress' | 'complete';

export interface OpportunityRouteView {
  chapterId: string;
  chapterTitle: string;
  routeId: string;
  label: string;
  summary: string;
  status: OpportunityStatus;
  satisfiedRequirements: number;
  totalRequirements: number;
  missingRequirementCount: number;
}

export interface OpportunityChapterView {
  id: string;
  title: string;
  centerOfGravity: string;
  status: 'not_started' | 'in_progress' | 'complete';
  routes: OpportunityRouteView[];
}

export type RelationshipCapabilityStatus =
  | 'developing'
  | 'resonance_ready'
  | 'permanent';

export interface RelationshipBuildCapability {
  traitId: string;
  name: string;
  description: string;
  sourceNpcId: string;
  sourceNpcName: string;
  status: RelationshipCapabilityStatus;
  connectionLevel: number;
  requiredConnectionLevel: number;
  assimilationProgress: number;
  assimilationThreshold: number;
  compatibility: number;
  minimumCompatibility: number;
  missingMemoryTags: string[];
}

const npcName = (state: RootState, npcId: string): string =>
  state.npcs.npcs[npcId]?.name ?? npcId;

const routeRequirementKeys = (route: ChapterRouteDefinition): string[] => [
  ...(route.requiredExperienceIds ?? []).map(id => `experience:${id}`),
  ...(route.requiredCompletedDialogueIds ?? []).map(id => `dialogue:${id}`),
];

const requirementSatisfied = (state: RootState, key: string): boolean => {
  const separator = key.indexOf(':');
  const kind = key.slice(0, separator);
  const id = key.slice(separator + 1);
  if (kind === 'experience') {
    return Boolean(state.relationships.experiencesById[id]);
  }
  if (kind === 'dialogue') {
    return Object.values(state.npcs.npcs).some(npc =>
      (npc.completedDialogues ?? []).includes(id)
    );
  }
  return false;
};

/**
 * A player-facing causal journal derived only from Memories already marked
 * playerVisible. It deliberately does not inspect unrecorded authoring data.
 */
export const selectCausalJournalEntries = (
  state: RootState,
  limit = 8
): CausalJournalEntry[] =>
  Object.values(state.relationships.memoriesById)
    .filter(memory => memory.playerVisible)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, Math.max(0, limit))
    .map(memory => {
      const origin = state.relationships.experiencesById[memory.originExperienceId];
      return {
        id: memory.id,
        title: memory.title,
        summary: memory.currentInterpretation ?? memory.summary,
        npcId: memory.primaryTargetId,
        npcName: npcName(state, memory.primaryTargetId),
        causeLabel: origin?.title ?? 'Recorded experience',
        tags: [...memory.resonanceTags],
        timestamp: memory.timestamp,
      };
    });

/**
 * Chapter opportunity projection. Shared opening evidence can reveal that a
 * chapter is underway, but future branch labels remain hidden until the player
 * has recorded route-specific evidence. This is a projection, not an unlock
 * authority or narrative planner.
 */
export const selectOpportunityMap = (state: RootState): OpportunityChapterView[] => {
  const progressById = new Map(
    selectAllChapterProgress(state).map(progress => [progress.id, progress])
  );

  return CHAPTER_DEFINITIONS.map(chapter => {
    const progress = progressById.get(chapter.id)!;
    const routeKeySets = chapter.routes.map(route => new Set(routeRequirementKeys(route)));
    const sharedKeys = routeKeySets.length === 0
      ? new Set<string>()
      : new Set(
          Array.from(routeKeySets[0]).filter(key => routeKeySets.every(keys => keys.has(key)))
        );

    const visibleRoutes = progress.status === 'not_started'
      ? []
      : progress.routes.filter((routeProgress, index) => {
          if (routeProgress.satisfied) return true;
          const routeKeys = routeKeySets[index] ?? new Set<string>();
          return Array.from(routeKeys).some(
            key => !sharedKeys.has(key) && requirementSatisfied(state, key)
          );
        });

    return {
      id: chapter.id,
      title: chapter.title,
      centerOfGravity: chapter.centerOfGravity,
      status: progress.status,
      routes: visibleRoutes.map(route => ({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        routeId: route.id,
        label: route.label,
        summary: route.summary,
        status: route.satisfied ? 'complete' : 'in_progress',
        satisfiedRequirements: route.satisfiedRequirements,
        totalRequirements: route.totalRequirements,
        missingRequirementCount: Math.max(
          0,
          route.totalRequirements - route.satisfiedRequirements
        ),
      })),
    };
  });
};

/**
 * Relationship-derived build projection. Authored Traits remain hidden until
 * discovery; this selector never makes a Trait discoverable or permanent.
 */
export const selectRelationshipBuildCapabilities = (
  state: RootState
): RelationshipBuildCapability[] => {
  const discovered = new Set(state.traits.discoveredTraits);
  const permanent = new Set(state.player.permanentTraits);

  return Object.values(state.traits.traits)
    .filter(trait => {
      const sourceNpcId = trait.sourceNpc ?? trait.source;
      if (!sourceNpcId) return false;
      return discovered.has(trait.id) || permanent.has(trait.id);
    })
    .map((trait): RelationshipBuildCapability => {
      const sourceNpcId = trait.sourceNpc ?? trait.source!;
      const profile = state.relationships.bondProfilesByNpc[sourceNpcId];
      const assimilation =
        state.relationships.traitAssimilationByKey[`${sourceNpcId}::${trait.id}`];
      const requiredConnectionLevel = trait.minimumConnectionLevel ?? 0;
      const assimilationThreshold = trait.assimilationThreshold ?? 0;
      const minimumCompatibility = trait.minimumCompatibility ?? 0;
      const memories = Object.values(state.relationships.memoriesById).filter(
        memory => memory.primaryTargetId === sourceNpcId && memory.playerVisible
      );
      const missingMemoryTags = (trait.requiredMemoryTags ?? []).filter(
        tag => !memories.some(memory => memory.resonanceTags.includes(tag))
      );
      const connectionLevel = profile?.connectionLevel ?? 0;
      const assimilationProgress = assimilation?.progress ?? 0;
      const compatibility = assimilation?.compatibility ?? 0;
      const resonanceReady =
        discovered.has(trait.id) &&
        connectionLevel >= requiredConnectionLevel &&
        assimilationProgress >= assimilationThreshold &&
        compatibility >= minimumCompatibility &&
        missingMemoryTags.length === 0;
      const status: RelationshipCapabilityStatus = permanent.has(trait.id)
        ? 'permanent'
        : resonanceReady
          ? 'resonance_ready'
          : 'developing';

      return {
        traitId: trait.id,
        name: trait.name,
        description: trait.description,
        sourceNpcId,
        sourceNpcName: npcName(state, sourceNpcId),
        status,
        connectionLevel,
        requiredConnectionLevel,
        assimilationProgress,
        assimilationThreshold,
        compatibility,
        minimumCompatibility,
        missingMemoryTags,
      };
    })
    .sort((a, b) => {
      const rank: Record<RelationshipCapabilityStatus, number> = {
        permanent: 0,
        resonance_ready: 1,
        developing: 2,
      };
      return rank[a.status] - rank[b.status] || a.name.localeCompare(b.name);
    });
};
