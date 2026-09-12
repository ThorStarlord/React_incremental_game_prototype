import { rootReducer } from '../../../app/store';
import { selectNPCAvailableQuestsById } from './NPCSelectors';

describe('NPC selector interface stability', () => {
  it('returns a stable available-quest projection for unchanged state', () => {
    const state = rootReducer(undefined, {
      type: 'npc-selector-test/init',
      payload: undefined,
    });

    expect(selectNPCAvailableQuestsById(state, 'npc_elder_willow')).toBe(
      selectNPCAvailableQuestsById(state, 'npc_elder_willow')
    );
  });
});
