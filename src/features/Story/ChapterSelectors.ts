import type { RootState } from '../../app/store';
import {
  CHAPTER_DEFINITIONS,
  type ChapterDefinition,
  type ChapterId,
  type ChapterRouteDefinition,
} from './ChapterDefinitions';

export type ChapterProgressStatus = 'not_started' | 'in_progress' | 'complete';

export interface ChapterRouteProgress {
  id: string;
  label: string;
  summary: string;
  satisfied: boolean;
  satisfiedRequirements: number;
  totalRequirements: number;
}

export interface ChapterProgress {
  id: ChapterId;
  title: string;
  centerOfGravity: string;
  description: string;
  status: ChapterProgressStatus;
  completedRouteId: string | null;
  routes: ChapterRouteProgress[];
}

const hasExperience = (state: RootState, experienceId: string): boolean =>
  Boolean(state.relationships.experiencesById[experienceId]);

const hasCompletedDialogue = (state: RootState, dialogueId: string): boolean =>
  Object.values(state.npcs.npcs).some(npc =>
    (npc.completedDialogues ?? []).includes(dialogueId)
  );

const evaluateRoute = (
  state: RootState,
  route: ChapterRouteDefinition
): ChapterRouteProgress => {
  const checks = [
    ...(route.requiredExperienceIds ?? []).map(id => hasExperience(state, id)),
    ...(route.requiredCompletedDialogueIds ?? []).map(id => hasCompletedDialogue(state, id)),
  ];
  const satisfiedRequirements = checks.filter(Boolean).length;
  return {
    id: route.id,
    label: route.label,
    summary: route.summary,
    satisfied: checks.length > 0 && satisfiedRequirements === checks.length,
    satisfiedRequirements,
    totalRequirements: checks.length,
  };
};

const evaluateChapter = (
  state: RootState,
  chapter: ChapterDefinition
): ChapterProgress => {
  const routes = chapter.routes.map(route => evaluateRoute(state, route));
  const completedRoute = routes.find(route => route.satisfied) ?? null;
  const anyProgress = routes.some(route => route.satisfiedRequirements > 0);

  return {
    id: chapter.id,
    title: chapter.title,
    centerOfGravity: chapter.centerOfGravity,
    description: chapter.description,
    status: completedRoute ? 'complete' : anyProgress ? 'in_progress' : 'not_started',
    completedRouteId: completedRoute?.id ?? null,
    routes,
  };
};

export const selectChapterProgress = (
  state: RootState,
  chapterId: ChapterId
): ChapterProgress => {
  const chapter = CHAPTER_DEFINITIONS.find(candidate => candidate.id === chapterId);
  if (!chapter) throw new Error(`Unknown chapter definition: ${chapterId}`);
  return evaluateChapter(state, chapter);
};

export const selectAllChapterProgress = (state: RootState): ChapterProgress[] =>
  CHAPTER_DEFINITIONS.map(chapter => evaluateChapter(state, chapter));

export const selectArchiveInquiryChapterProgress = (state: RootState): ChapterProgress =>
  selectChapterProgress(state, 'archive_inquiry');
