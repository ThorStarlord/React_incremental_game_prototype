/**
 * NPC-related action types
 */

export const NPC_ACTIONS = {
  UPDATE_NPC_RELATIONSHIP: 'npc/updateRelationship' as const,
  COMPLETE_NPC_FAVOR: 'npc/completeFavor' as const,
  ADD_NPC_FAVOR: 'npc/addFavor' as const,
  DECLINE_NPC_FAVOR: 'npc/declineFavor' as const,
  ADD_NPC: 'npc/addNpc' as const,
  REMOVE_NPC: 'npc/removeNpc' as const,
  UPDATE_NPC: 'npc/updateNpc' as const,
  DECAY_RELATIONSHIPS: 'npc/decayRelationships' as const
};
