/**
 * Quest-related action types
 */

export const QUEST_ACTIONS = {
  DISCOVER_QUEST: 'quest/discover' as const,
  START_QUEST: 'quest/start' as const,
  UPDATE_QUEST_PROGRESS: 'quest/updateProgress' as const,
  UPDATE_QUEST_OBJECTIVE: 'quest/updateObjective' as const,
  COMPLETE_QUEST: 'quest/complete' as const,
  ABANDON_QUEST: 'quest/abandon' as const,
  FAIL_QUEST: 'quest/fail' as const
};
