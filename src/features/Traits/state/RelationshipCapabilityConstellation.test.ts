import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import {
  addPermanentTrait,
  setDoctrineFocus,
} from '../../Player/state/PlayerSlice';
import { addQuest } from '../../Quest/state/QuestSlice';
import { resolveQuestOutcomeThunk } from '../../Quest/state/QuestThunks';
import type { Quest } from '../../Quest/state/QuestTypes';
import {
  canUseQuestResolution,
} from '../../Quest/state/QuestResolutionAvailability';
import { setDialogueNodes, setNPCs } from '../../NPCs/state/NPCSlice';
import { processNPCInteractionThunk } from '../../NPCs/state/NPCThunks';
import {
  activateDoctrineThunk,
  setDoctrineFocusThunk,
} from './DoctrineThunks';
import {
  selectActiveDoctrineIds,
  selectIsDoctrineActive,
} from './DoctrineSelectors';

const makeStore = () => configureStore({ reducer: rootReducer });

const STRUCTURAL_TRAITS = ['WillowsWisdom', 'ConstraintSense'] as const;
const COUNTERMODELER_TRAITS = [
  'ScholarlyInsight',
  'AdversarialCalibration',
] as const;

const learn = (
  store: ReturnType<typeof makeStore>,
  traitIds: readonly string[]
) => {
  traitIds.forEach(traitId => store.dispatch(addPermanentTrait(traitId)));
};

describe('Relationship Capability Constellation', () => {
  test('learned Traits remain durable knowledge while doctrine focus controls active synergy', async () => {
    const store = makeStore();
    learn(store, [...STRUCTURAL_TRAITS, ...COUNTERMODELER_TRAITS]);

    expect(selectActiveDoctrineIds(store.getState())).toEqual([]);
    expect(selectIsDoctrineActive(store.getState(), 'structural_steward')).toBe(false);

    await store.dispatch(activateDoctrineThunk('structural_steward')).unwrap();

    expect(store.getState().player.permanentTraits).toEqual(
      expect.arrayContaining([...STRUCTURAL_TRAITS, ...COUNTERMODELER_TRAITS])
    );
    expect(store.getState().player.doctrineFocus.foregroundedPermanentTraitIds).toEqual(
      STRUCTURAL_TRAITS
    );
    expect(selectActiveDoctrineIds(store.getState())).toEqual(['structural_steward']);

    await store.dispatch(activateDoctrineThunk('countermodeler')).unwrap();

    expect(store.getState().player.permanentTraits).toEqual(
      expect.arrayContaining([...STRUCTURAL_TRAITS, ...COUNTERMODELER_TRAITS])
    );
    expect(store.getState().player.doctrineFocus.foregroundedPermanentTraitIds).toEqual(
      COUNTERMODELER_TRAITS
    );
    expect(selectIsDoctrineActive(store.getState(), 'structural_steward')).toBe(false);
    expect(selectIsDoctrineActive(store.getState(), 'countermodeler')).toBe(true);
  });

  test('focus rejects unlearned Traits and selectors fail closed on corrupt focus', async () => {
    const store = makeStore();
    store.dispatch(addPermanentTrait('WillowsWisdom'));

    const rejected = await store.dispatch(
      setDoctrineFocusThunk(['WillowsWisdom', 'ConstraintSense'])
    );

    expect(setDoctrineFocusThunk.rejected.match(rejected)).toBe(true);
    expect(store.getState().player.doctrineFocus.foregroundedPermanentTraitIds).toEqual([]);

    // Raw reducer dispatch represents a corrupt/untrusted state probe. Derived
    // doctrine authority must still require permanent ownership.
    store.dispatch(setDoctrineFocus(['WillowsWisdom', 'ConstraintSense']));

    expect(selectIsDoctrineActive(store.getState(), 'structural_steward')).toBe(false);
    expect(selectActiveDoctrineIds(store.getState())).toEqual([]);
  });

  test('quest availability and authoritative resolution both require active doctrine', async () => {
    const store = makeStore();
    learn(store, STRUCTURAL_TRAITS);

    const quest: Quest = {
      id: 'quest_doctrine_probe',
      title: 'Doctrine Probe',
      description: 'Hermetic doctrine-gating qualification.',
      giver: 'npc_doctrine_probe',
      type: 'SIDE',
      objectives: [],
      prerequisites: [],
      rewards: [],
      status: 'READY_TO_COMPLETE',
      isAutoComplete: false,
      resolutionRequired: true,
      resolutionOptions: [
        {
          id: 'structural_resolution',
          label: 'Use Structural Stewardship',
          description: 'Requires the learned pair to be actively foregrounded.',
          requiredPermanentTraitIds: [...STRUCTURAL_TRAITS],
          requiredActiveDoctrineIds: ['structural_steward'],
        },
      ],
    };

    store.dispatch(addQuest(quest));
    const option = quest.resolutionOptions![0];

    expect(
      canUseQuestResolution(
        option,
        store.getState().player.permanentTraits,
        selectActiveDoctrineIds(store.getState())
      )
    ).toBe(false);

    const bypassAttempt = await store.dispatch(
      resolveQuestOutcomeThunk({
        questId: quest.id,
        resolutionId: option.id,
      })
    );

    expect(resolveQuestOutcomeThunk.rejected.match(bypassAttempt)).toBe(true);
    expect(store.getState().quest.quests[quest.id].selectedResolutionId).toBeUndefined();

    await store.dispatch(activateDoctrineThunk('structural_steward')).unwrap();

    expect(
      canUseQuestResolution(
        option,
        store.getState().player.permanentTraits,
        selectActiveDoctrineIds(store.getState())
      )
    ).toBe(true);

    await store.dispatch(
      resolveQuestOutcomeThunk({
        questId: quest.id,
        resolutionId: option.id,
      })
    ).unwrap();

    expect(store.getState().quest.quests[quest.id].selectedResolutionId).toBe(
      option.id
    );
  });

  test('dialogue thunk rejects direct bypass until the required doctrine is active', async () => {
    const store = makeStore();
    learn(store, STRUCTURAL_TRAITS);

    store.dispatch(setNPCs({
      npc_doctrine_probe: {
        id: 'npc_doctrine_probe',
        name: 'Doctrine Probe',
        location: 'location_city_center',
        affinity: 0,
        connectionDepth: 0,
        loyalty: 0,
        availableDialogues: ['dialogue_structural_probe'],
        completedDialogues: [],
        availableQuests: [],
        completedQuests: [],
        availableTraits: [],
        status: 'available',
        discoveredAt: 1,
      } as any,
    }));

    store.dispatch(setDialogueNodes({
      dialogue_structural_probe: {
        id: 'dialogue_structural_probe',
        npcId: 'npc_doctrine_probe',
        title: 'Read the Load Paths',
        text: 'A structural interpretation is possible.',
        repeatable: false,
        requiredActiveDoctrineIds: ['structural_steward'],
        responses: {
          read: 'Read the system through its load-bearing structure.',
        },
      },
    }));

    const payload = {
      npcId: 'npc_doctrine_probe',
      interactionType: 'dialogue',
      context: {
        choiceId: 'dialogue_structural_probe',
        selectedResponse: 'read',
      },
    };

    const blocked = await store.dispatch(processNPCInteractionThunk(payload)).unwrap();
    expect(blocked.success).toBe(false);
    expect(blocked.message).toBe(
      'Required doctrine not active: structural_steward'
    );
    expect(
      store.getState().npcs.npcs.npc_doctrine_probe.completedDialogues
    ).toEqual([]);

    await store.dispatch(activateDoctrineThunk('structural_steward')).unwrap();

    const allowed = await store.dispatch(processNPCInteractionThunk(payload)).unwrap();
    expect(allowed.success).toBe(true);
    expect(
      store.getState().npcs.npcs.npc_doctrine_probe.completedDialogues
    ).toContain('dialogue_structural_probe');
  });
});
