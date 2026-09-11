import type { RootState } from '../../app/store';
import { COPY_PRODUCTION_TASKS } from '../Copy/CopyTaskDefinitions';
import type {
  RoutineFamiliarityId,
  RoutineFamiliaritySource,
} from '../Player/state/PlayerTypes';
import { CHAPTER_DEFINITIONS } from './ChapterDefinitions';
import { selectAllChapterProgress } from './ChapterSelectors';
import {
  chapterRequirementKey,
  isChapterRequirementSatisfied,
  listChapterRouteRequirements,
} from './ChapterRequirements';

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

export interface RelationshipCapabilityEvidence {
  memoryId: string;
  title: string;
  summary: string;
  causeLabel: string;
  timestamp: number;
}

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
  evidence: RelationshipCapabilityEvidence[];
}

export interface MasteredRoutineView {
  taskId: RoutineFamiliarityId;
  name: string;
  description: string;
  source: RoutineFamiliaritySource;
  sourceLabel: string;
  learnedAt: number;
}

const npcName = (state: RootState, npcId: string): string =>
  state.npcs.npcs[npcId]?.name ?? npcId;

const routineSourceLabel = (
  source: RoutineFamiliaritySource
): string => {
  switch (source) {
    case 'city_center_forge_assistance':
      return 'Practiced Forge Assistance yourself in the City Center.';
    case 'trait_resonance':
      return 'Completed Trait resonance yourself.';
  }
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
    const routeRequirements = chapter.routes.map(route =>
      listChapterRouteRequirements(route)
    );
    const routeKeySets = routeRequirements.map(requirements =>
      new Set(requirements.map(chapterRequirementKey))
    );
    const sharedKeys = routeKeySets.length === 0
      ? new Set<string>()
      : new Set(
          Array.from(routeKeySets[0]).filter(key => routeKeySets.every(keys => keys.has(key)))
        );

    const visibleRoutes = progress.status === 'not_started'
      ? []
      : progress.routes.filter((routeProgress, index) => {
          if (routeProgress.satisfied) return true;
          const requirements = routeRequirements[index] ?? [];
          return requirements.some(requirement =>
            !sharedKeys.has(chapterRequirementKey(requirement)) &&
            isChapterRequirementSatisfied(state, requirement)
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
 * Provenance is restricted to already-player-visible Memories that the
 * canonical assimilation state recorded as qualifying evidence.
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
      const evidence = (assimilation?.qualifyingMemoryIds ?? [])
        .flatMap(memoryId => {
          const memory = state.relationships.memoriesById[memoryId];
          if (
            !memory ||
            !memory.playerVisible ||
            memory.primaryTargetId !== sourceNpcId
          ) {
            return [];
          }
          const origin = state.relationships.experiencesById[memory.originExperienceId];
          return [{
            memoryId: memory.id,
            title: memory.title,
            summary: memory.currentInterpretation ?? memory.summary,
            causeLabel: origin?.title ?? 'Recorded experience',
            timestamp: memory.timestamp,
          }];
        })
        .sort((a, b) => b.timestamp - a.timestamp);
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
        evidence,
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

/**
 * Player-owned mastery projection. This does not create familiarity or decide
 * whether any Copy may execute a routine; it only translates existing recorded
 * familiarity into a player-facing explanation.
 */
export const selectMasteredRoutines = (state: RootState): MasteredRoutineView[] => {
  const familiarity = state.player.routineFamiliarity ?? {};

  return COPY_PRODUCTION_TASKS.flatMap(task => {
    const record = familiarity[task.id];
    if (!record) return [];
    return [{
      taskId: task.id,
      name: task.name,
      description: task.description,
      source: record.source,
      sourceLabel: routineSourceLabel(record.source),
      learnedAt: record.learnedAt,
    }];
  });
};
