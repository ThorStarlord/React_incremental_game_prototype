import { rootReducer } from '../../../app/store';
import { selectAvailableNPCDialogueChoices } from './NPCSelectors';

describe('NPC dialogue projection', () => {
  test('returns a stable player-facing projection for unchanged state', () => {
    const state = rootReducer(undefined, { type: '@@INIT', payload: undefined });
    const npcState = {
      ...state,
      npcs: {
        ...state.npcs,
        npcs: {
          willow: {
            id: 'willow',
            name: 'Willow',
            location: 'grove',
            affinity: 0,
            connectionDepth: 0,
            loyalty: 0,
            availableDialogues: ['hello'],
            completedDialogues: [],
            availableQuests: [],
            completedQuests: [],
            availableTraits: [],
            status: 'available',
            discoveredAt: 0,
          },
        },
        dialogueNodes: {
          hello: { id: 'hello', title: 'Hello', responses: { greet: 'Greet' } },
        },
      },
    } as typeof state;

    const first = selectAvailableNPCDialogueChoices(npcState, 'willow');
    const second = selectAvailableNPCDialogueChoices(npcState, 'willow');

    expect(first).toEqual([
      {
        id: 'hello',
        title: 'Hello',
        responses: [{ id: 'greet', label: 'Greet' }],
        availabilityReasons: [],
      },
    ]);
    expect(second).toBe(first);
  });
});
