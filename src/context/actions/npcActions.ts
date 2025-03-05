import { ACTION_TYPES } from './actionTypes';

export interface UpdateNpcRelationshipPayload {
  npcId: string | 'all';
  changeAmount: number;
  source?: string;
}

/**
 * Update relationship with an NPC
 * 
 * @param payload Relationship change details
 */
export const updateNpcRelationship = (payload: UpdateNpcRelationshipPayload) => ({
  type: ACTION_TYPES.UPDATE_NPC_RELATIONSHIP,
  payload
});

/**
 * Apply natural decay to all NPC relationships
 */
export const decayRelationships = () => ({
  type: ACTION_TYPES.DECAY_RELATIONSHIPS
});
