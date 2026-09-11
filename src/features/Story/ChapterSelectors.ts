import type { RootState } from '../../app/store';
import {
  CHAPTER_DEFINITIONS,
  type ChapterDefinition,
  type ChapterId,
  type ChapterRouteDefinition,
} from './ChapterDefinitions';
import {
  isChapterRequirementSatisfied,
  listChapterRouteRequirements,
} from './ChapterRequirements';

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

const evaluateRoute = (
  state: RootState,
  route: ChapterRouteDefinition
): ChapterRouteProgress => {
  const requirements = listChapterRouteRequirements(route);
  const satisfiedRequirements = requirements.filter(requirement =>
    isChapterRequirementSatisfied(state, requirement)
  ).length;
  return {
    id: route.id,
    label: route.label,
    summary: route.summary,
    satisfied: requirements.length > 0 && satisfiedRequirements === requirements.length,
    satisfiedRequirements,
    totalRequirements: requirements.length,
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
