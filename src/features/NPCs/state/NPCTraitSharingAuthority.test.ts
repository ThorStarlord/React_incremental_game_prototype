import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import { addPermanentTrait, equipTrait } from '../../Player/state/PlayerSlice';
import { loadTraits } from '../../Traits/state/TraitsSlice';
import type { Trait } from '../../Traits/state/TraitsTypes';
import { setNPCs } from './NPCSlice';
import { shareTraitWithNPCThunk } from './NPCThunks';

const TEST_TRAIT: Trait = {
  id: 'ShareProbe',
  name: 'Share Probe',
  description: 'Hermetic Trait used to qualify NPC sharing authority.',
  category: 'Mental',
  rarity: 'Common',
  effects: { attack: 1 },
  essenceCost: 10,
};

const makeStore = () => configureStore({ reducer: rootReducer });

const seed = (store: ReturnType<typeof makeStore>) => {
  store.dispatch(loadTraits({ [TEST_TRAIT.id]: TEST_TRAIT }));
  store.dispatch(setNPCs({
    npc_share_probe: {
      id: 'npc_share_probe',
      name: 'Share Probe NPC',
      affinity: 0,
      connectionDepth: 0,
      loyalty: 0,
      availableTraits: [],
      sharedTraitSlots: [
        {
          id: 'share_probe_slot',
          index: 0,
          traitId: null,
          isUnlocked: true,
        },
      ],
    } as any,
  }));
};

describe('NPC Trait sharing authority', () => {
  test('permanent-only Traits cannot bypass the equipped non-permanent sharing contract', async () => {
    const store = makeStore();
    seed(store);
    store.dispatch(addPermanentTrait(TEST_TRAIT.id));

    await store.dispatch(shareTraitWithNPCThunk({
      npcId: 'npc_share_probe',
      traitId: TEST_TRAIT.id,
      slotIndex: 0,
    }));

    expect(store.getState().npcs.npcs.npc_share_probe.sharedTraitSlots?.[0].traitId)
      .toBeNull();
    expect(store.getState().notifications.items.some(notification =>
      notification.message.includes('Only equipped, non-permanent Traits')
    )).toBe(true);
  });

  test('an equipped non-permanent Trait remains shareable', async () => {
    const store = makeStore();
    seed(store);
    store.dispatch(equipTrait({ traitId: TEST_TRAIT.id, slotIndex: 0 }));

    await store.dispatch(shareTraitWithNPCThunk({
      npcId: 'npc_share_probe',
      traitId: TEST_TRAIT.id,
      slotIndex: 0,
    }));

    expect(store.getState().npcs.npcs.npc_share_probe.sharedTraitSlots?.[0].traitId)
      .toBe(TEST_TRAIT.id);
  });
});
