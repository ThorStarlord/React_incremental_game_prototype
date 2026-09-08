import type { RootState } from '../../../app/store';
import type { KnowledgeState } from './KnowledgeTypes';

const readKnowledgeState = (state: RootState): KnowledgeState | undefined =>
  (state as RootState & { knowledge?: KnowledgeState }).knowledge;

export const selectNpcKnownFactIds = (
  state: RootState,
  npcId: string
): string[] => readKnowledgeState(state)?.factIdsByNpcId?.[npcId] ?? [];

export const selectNpcKnowsFact = (
  state: RootState,
  npcId: string,
  factId: string
): boolean => selectNpcKnownFactIds(state, npcId).includes(factId);
