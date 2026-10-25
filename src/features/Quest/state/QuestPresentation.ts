import type { QuestStatus } from './QuestTypes';

/** Read-only vocabulary: persisted quest status values are not changed. */
const questStatusLabels: Record<QuestStatus, string> = {
  NOT_STARTED: 'Not started',
  IN_PROGRESS: 'In progress',
  READY_TO_COMPLETE: 'Objectives complete',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};

export const questStatusLabel = (status: QuestStatus): string => questStatusLabels[status];
