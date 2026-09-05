import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { rootReducer } from '../../../app/store';
import NPCPanelContainer from '../../NPCs/components/containers/NPCPanelContainer';
import {
  newGameSeedNPCsThunk,
} from '../../NPCs/state/NPCThunks';
import { setDialogueNodes, setSelectedNPCId } from '../../NPCs/state/NPCSlice';
import { addQuest } from '../../Quest/state/QuestSlice';
import { loadTraits } from '../../Traits/state/TraitsSlice';
import { processPassiveGenerationThunk } from '../../Essence/state/EssenceThunks';
import {
  selectBondProfileByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectTraitAssimilationState,
} from './RelationshipSelectors';
import type { RelationshipDefinitionBundle } from './RelationshipTypes';

const WILLOW_ID = 'npc_elder_willow';
const WISDOM_ID = 'WillowsWisdom';
const QUEST_ID = 'quest_willow_ancient_seed';

const willowNpc = {
  id: WILLOW_ID,
  name: 'Elder Willow',
  description: 'An ancient keeper of old lore.',
  category: 'Wisdom',
  location: 'Whispering Woods - Elder Tree',
  avatar: '',
  spritePath: '',
  faction: 'Neutral',
  interactionPrompt: 'Speak with Elder Willow',
  affinity: 20,
  connectionDepth: 5,
  loyalty: 15,
  availableDialogues: [
    'elder_willow_greeting',
    'elder_willow_offer_seed',
    'willow_disagreement',
    'willow_three_nights_teaching',
    'willow_independent_application_report',
  ],
  completedDialogues: [],
  availableQuests: [QUEST_ID],
  completedQuests: [],
  traits: {},
  availableTraits: [WISDOM_ID],
  sharedTraitSlots: [],
  innateTraits: [WISDOM_ID],
  inventory: { items: [], currency: 100 },
  services: [],
  status: 'available',
  lastInteraction: 0,
  isDiscovered: true,
  isAvailable: true,
  discoveredAt: 1,
} as any;

const willowWisdom = {
  id: WISDOM_ID,
  name: "Willow's Wisdom",
  category: 'Knowledge',
  description: "Elder Willow's slow-pattern cognition.",
  rarity: 'Uncommon',
  effects: { learningSpeed: 0.15 },
  essenceCost: 40,
  sourceNpc: WILLOW_ID,
  discoveryMode: 'authored' as const,
  minimumConnectionLevel: 2,
  requiredMemoryTags: ['Application'],
  assimilationThreshold: 100,
  minimumCompatibility: 20,
  resonanceExperienceId: 'willow_exp_resonance_wisdom',
};

const ancientSeedQuest = {
  id: QUEST_ID,
  title: 'The Ancient Seed',
  description: 'Decide whether to commit a scarce Sunstone to a delayed-value seed.',
  giver: WILLOW_ID,
  type: 'SIDE',
  objectives: [
    {
      objectiveId: '1',
      description: 'Find a Sunstone',
      type: 'GATHER',
      target: 'item_sunstone',
      requiredCount: 1,
      currentCount: 0,
      isHidden: false,
      isComplete: false,
    },
  ],
  prerequisites: [],
  rewards: [],
  resolutionRequired: true,
  resolutionOptions: [
    {
      id: 'preserve_seed',
      label: 'Awaken the Seed',
      description: 'Commit the Sunstone to uncertain long-horizon value.',
      relationshipExperienceId: 'willow_exp_sunstone_decision_preserve',
      consumeItems: [{ itemId: 'item_sunstone', quantity: 1 }],
      rewards: [],
    },
    {
      id: 'consume_sunstone',
      label: 'Extract the Sunstone',
      description: 'Consume its independent charge for immediate Essence.',
      relationshipExperienceId: 'willow_exp_sunstone_decision_consume',
      consumeItems: [{ itemId: 'item_sunstone', quantity: 1 }],
      rewards: [{ type: 'ESSENCE', value: 50 }],
    },
  ],
  status: 'NOT_STARTED',
  isAutoComplete: false,
} as any;

const dialogueNodes = {
  elder_willow_greeting: {
    id: 'elder_willow_greeting',
    npcId: WILLOW_ID,
    title: 'She Saw Through the Question',
    text: 'You ask which part of knowing can be used.',
    responses: {
      respect: 'Knowledge that cannot alter action is decoration.',
      casual: 'You assume too much from one question.',
      inquire_lore: 'Then tell me what I failed to ask.',
    },
    effects: [
      {
        type: 'RELATIONSHIP_EXPERIENCE',
        experienceIdByResponse: {
          respect: 'willow_exp_first_question_admit',
        },
      },
    ],
    next: { respect: 'elder_willow_wisdom' },
  },
  elder_willow_wisdom: {
    id: 'elder_willow_wisdom',
    npcId: WILLOW_ID,
    title: 'The First Lesson',
    text: 'Immediate appearances are poor evidence for slow systems.',
    effects: [
      { type: 'RELATIONSHIP_EXPERIENCE', experienceId: 'willow_exp_first_lesson' },
    ],
  },
  elder_willow_offer_seed: {
    id: 'elder_willow_offer_seed',
    npcId: WILLOW_ID,
    title: 'A Seed of Potential',
    text: 'The same Sunstone can wake a seed or be consumed for immediate power.',
    requiredExperienceIds: ['willow_exp_first_lesson'],
    responses: {
      accept: 'Show me the Sunstone. I will decide what its value is.',
      decline: 'I am not ready to spend it yet.',
    },
    effects: [
      { type: 'UNLOCK_QUEST', questId: QUEST_ID, responseId: 'accept' },
      { type: 'GIVE_ITEM', itemId: 'item_sunstone', amount: 1, responseId: 'accept' },
      { type: 'RELATIONSHIP_EXPERIENCE', experienceId: 'willow_exp_seed_offered', responseId: 'accept' },
    ],
    next: { accept: null, decline: null },
  },
  willow_disagreement: {
    id: 'willow_disagreement',
    npcId: WILLOW_ID,
    title: 'Willow Disagrees',
    text: 'Long horizons sometimes demand destruction.',
    anyOfExperienceIds: ['willow_exp_sunstone_decision_preserve'],
    responses: {
      challenge: 'Then preservation was never the rule. Pattern-sensitive judgment was.',
    },
    effects: [
      { type: 'RELATIONSHIP_EXPERIENCE', experienceId: 'willow_exp_willow_disagrees' },
    ],
    next: { challenge: null },
  },
  willow_three_nights_teaching: {
    id: 'willow_three_nights_teaching',
    npcId: WILLOW_ID,
    title: 'Three Nights of Teaching',
    text: 'Willow asks you to predict slow systems until the pattern becomes usable.',
    requiredExperienceIds: ['willow_exp_willow_disagrees'],
    responses: {
      begin: 'Begin. I want the pattern, not the slogan.',
    },
    effects: [
      { type: 'RELATIONSHIP_EXPERIENCE', experienceId: 'willow_exp_three_nights_teaching', responseId: 'begin' },
    ],
    next: { begin: null },
  },
  willow_independent_application_report: {
    id: 'willow_independent_application_report',
    npcId: WILLOW_ID,
    title: 'The Lesson Made Yours',
    text: 'You applied the deeper pattern while Willow was absent.',
    requiredExperienceIds: ['willow_exp_three_nights_teaching'],
    responses: {
      explain: 'The visible break was downstream of the real failure.',
    },
    effects: [
      { type: 'RELATIONSHIP_EXPERIENCE', experienceId: 'willow_exp_independent_application', responseId: 'explain' },
    ],
    next: { explain: null },
  },
};

const relationshipBundle: RelationshipDefinitionBundle = {
  experiences: {
    willow_exp_first_question_admit: {
      id: 'willow_exp_first_question_admit',
      uniqueKey: 'willow:we01:first-question',
      title: 'She Saw Through the Question',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: { affinity: 1, trust: 3, understanding: 4, sharedMeaning: 1 },
      connectionProgressDelta: 7,
      resonanceTags: ['Wisdom'],
      memoryCandidate: false,
    },
    willow_exp_first_lesson: {
      id: 'willow_exp_first_lesson',
      uniqueKey: 'willow:we02:first-lesson',
      title: 'The First Lesson',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: { trust: 2, understanding: 6, sharedMeaning: 3 },
      connectionProgressDelta: 8,
      resonanceTags: ['Wisdom', 'PatternRecognition'],
      traitEffects: [{ traitId: WISDOM_ID, discover: true, compatibilityDelta: 5, assimilationDelta: 10 }],
      memoryCandidate: false,
    },
    willow_exp_seed_offered: {
      id: 'willow_exp_seed_offered',
      uniqueKey: 'willow:we03:seed-offered',
      title: 'A Seed of Potential',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'quest',
      significance: 'meaningful',
      relationshipEffects: { understanding: 2, sharedMeaning: 1 },
      connectionProgressDelta: 4,
      resonanceTags: ['Choice'],
      memoryCandidate: false,
    },
    willow_exp_sunstone_decision_preserve: {
      id: 'willow_exp_sunstone_decision_preserve',
      uniqueKey: 'willow:we04:sunstone-decision',
      title: 'The Sunstone Decision',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'quest',
      significance: 'major',
      relationshipEffects: { affinity: 4, trust: 8, understanding: 10, sharedMeaning: 12, reciprocity: 3 },
      connectionProgressDelta: 22,
      resonanceTags: ['Application', 'Wisdom'],
      traitEffects: [{ traitId: WISDOM_ID, compatibilityDelta: 15 }],
      memoryCandidate: true,
      memoryDefinitionId: 'willow_memory_seed_preserved',
    },
    willow_exp_sunstone_decision_consume: {
      id: 'willow_exp_sunstone_decision_consume',
      uniqueKey: 'willow:we04:sunstone-decision',
      title: 'The Sunstone Decision',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'quest',
      significance: 'major',
      relationshipEffects: { affinity: -2, trust: 1, understanding: 4, sharedMeaning: 2 },
      connectionProgressDelta: 7,
      resonanceTags: ['Instrumentalism'],
      memoryCandidate: false,
    },
    willow_exp_willow_disagrees: {
      id: 'willow_exp_willow_disagrees',
      uniqueKey: 'willow:we05:disagreement',
      title: 'Willow Disagrees',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: { affinity: -3, trust: -1, understanding: 8, sharedMeaning: 5 },
      connectionProgressDelta: 10,
      resonanceTags: ['Contradiction'],
      memoryCandidate: false,
    },
    willow_exp_three_nights_teaching: {
      id: 'willow_exp_three_nights_teaching',
      uniqueKey: 'willow:we06:three-nights',
      title: 'Three Nights of Teaching',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'other',
      significance: 'meaningful',
      relationshipEffects: { trust: 3, understanding: 8, sharedMeaning: 5, reciprocity: 2 },
      connectionProgressDelta: 12,
      resonanceTags: ['Teaching', 'Practice'],
      traitEffects: [{ traitId: WISDOM_ID, assimilationDelta: 55 }],
      memoryCandidate: false,
    },
    willow_exp_independent_application: {
      id: 'willow_exp_independent_application',
      uniqueKey: 'willow:we07:independent-application',
      title: 'The Lesson Made Yours',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'quest',
      significance: 'defining',
      relationshipEffects: { affinity: 3, trust: 7, understanding: 12, sharedMeaning: 10, reciprocity: 4 },
      connectionProgressDelta: 20,
      resonanceTags: ['Application', 'Transformation'],
      traitEffects: [{ traitId: WISDOM_ID, compatibilityDelta: 20, assimilationDelta: 35 }],
      memoryCandidate: true,
      memoryDefinitionId: 'willow_memory_lesson_made_yours',
    },
    willow_exp_resonance_wisdom: {
      id: 'willow_exp_resonance_wisdom',
      uniqueKey: 'willow:we08:wisdom-resonance',
      title: "Resonance: Willow's Wisdom",
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      sourceType: 'system',
      significance: 'defining',
      relationshipEffects: { sharedMeaning: 4 },
      connectionProgressDelta: 0,
      resonanceTags: ['Resonance'],
      memoryCandidate: false,
    },
  },
  memories: {
    willow_memory_seed_preserved: {
      id: 'willow_memory_seed_preserved',
      originExperienceId: 'willow_exp_sunstone_decision_preserve',
      title: 'The Seed Preserved',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      memoryType: 'shared',
      significance: 'major',
      playerVisible: true,
      summary: 'You chose uncertain long-horizon value over immediate extraction.',
      resonanceTags: ['Application', 'Wisdom'],
      traitRelevance: [WISDOM_ID],
      persistence: 'stable',
    },
    willow_memory_lesson_made_yours: {
      id: 'willow_memory_lesson_made_yours',
      originExperienceId: 'willow_exp_independent_application',
      title: 'The Lesson Made Yours',
      primaryTargetId: WILLOW_ID,
      participantIds: ['player', WILLOW_ID],
      memoryType: 'shared',
      significance: 'defining',
      playerVisible: true,
      summary: "You applied Willow's pattern independently.",
      resonanceTags: ['Application', 'Transformation'],
      traitRelevance: [WISDOM_ID],
      persistence: 'stable',
    },
  },
  progression: {
    [WILLOW_ID]: {
      npcId: WILLOW_ID,
      connectionAuthority: 'relationships',
      startingProfile: {
        dimensions: { trust: 5 },
        connectionLevel: 0,
        connectionProgress: 0,
        tetherState: 'present',
      },
      qualificationRules: [
        {
          level: 1,
          minimumProgress: 10,
          minimumExperienceCount: 2,
          requiredExperienceIds: ['willow_exp_first_lesson'],
          anyOfExperienceIds: ['willow_exp_first_question_admit'],
          minimumDimensions: { understanding: 8 },
        },
        {
          level: 2,
          minimumProgress: 60,
          minimumExperienceCount: 6,
          requiredExperienceIds: ['willow_exp_three_nights_teaching', 'willow_exp_independent_application'],
          requiredMemoryTags: ['Application'],
          minimumDimensions: { understanding: 35, sharedMeaning: 20 },
        },
      ],
      essence: { enabled: true, startingTetherState: 'present' },
    },
  },
};

const makeResponse = (payload: unknown) => ({
  ok: true,
  json: async () => payload,
});

const clickButton = async (name: string) => {
  fireEvent.click(await screen.findByRole('button', { name }));
};

describe('M5 fresh Willow routed vertical slice', () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === '/data/npcs.json') return makeResponse({ [WILLOW_ID]: willowNpc });
      if (url === '/data/relationships/index.json') {
        return makeResponse({ bundles: ['/data/relationships/elder-willow.json'] });
      }
      if (url === '/data/relationships/elder-willow.json') return makeResponse(relationshipBundle);
      return { ok: false, json: async () => ({}) };
    }) as jest.Mock;
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test('fresh player can traverse the normal NPC UI from first dialogue to permanent Willow Wisdom', async () => {
    const store = configureStore({ reducer: rootReducer });
    store.dispatch(loadTraits({ [WISDOM_ID]: willowWisdom }));
    store.dispatch(addQuest(ancientSeedQuest));
    store.dispatch(setDialogueNodes(dialogueNodes));

    await store.dispatch(newGameSeedNPCsThunk()).unwrap();
    store.dispatch(setSelectedNPCId(WILLOW_ID));

    expect(Object.keys(store.getState().npcs.npcs)).toEqual([WILLOW_ID]);
    expect(store.getState().npcs.npcs[WILLOW_ID].affinity).toBe(0);
    expect(store.getState().npcs.npcs[WILLOW_ID].connectionDepth).toBe(0);
    expect(selectBondProfileByNpcId(store.getState(), WILLOW_ID).connectionLevel).toBe(0);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[`/game/npcs/${WILLOW_ID}`]}>
          <Routes>
            <Route path="/game/npcs/:npcId" element={<NPCPanelContainer />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // The normal routed screen must expose the causal surfaces at Connection 0.
    expect(await screen.findByRole('tab', { name: 'Dialogue' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Relationship' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Quests' })).toBeEnabled();
    expect(screen.getByRole('tab', { name: 'Traits' })).toBeEnabled();
    expect(Object.keys(store.getState().npcs.npcs)).toEqual([WILLOW_ID]);

    fireEvent.click(screen.getByRole('tab', { name: 'Dialogue' }));
    expect(await screen.findByText('She Saw Through the Question')).toBeInTheDocument();
    await clickButton('Knowledge that cannot alter action is decoration.');

    await waitFor(() => {
      expect(selectBondProfileByNpcId(store.getState(), WILLOW_ID).connectionLevel).toBe(1);
    });

    expect(await screen.findByText('A Seed of Potential')).toBeInTheDocument();
    await clickButton('Show me the Sunstone. I will decide what its value is.');

    await waitFor(() => {
      expect(store.getState().inventory.items.item_sunstone).toBe(1);
      expect(store.getState().npcs.npcs[WILLOW_ID].availableQuests).toContain(QUEST_ID);
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Quests' }));
    fireEvent.click(await screen.findByText('The Ancient Seed'));
    await clickButton('Accept Quest');

    await waitFor(() => {
      expect(store.getState().quest.quests[QUEST_ID].status).toBe('READY_TO_COMPLETE');
    });

    await clickButton('Choose Awaken the Seed');
    await waitFor(() => {
      expect(store.getState().quest.quests[QUEST_ID].selectedResolutionId).toBe('preserve_seed');
      expect(store.getState().inventory.items.item_sunstone).toBeUndefined();
      expect(selectRelationshipMemoriesByNpcId(store.getState(), WILLOW_ID).map(memory => memory.id))
        .toContain('willow_memory_seed_preserved');
    });

    await clickButton('Turn In Quest');
    await waitFor(() => {
      expect(store.getState().quest.quests[QUEST_ID].status).toBe('COMPLETED');
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Dialogue' }));
    expect(await screen.findByText('Willow Disagrees')).toBeInTheDocument();
    await clickButton('Then preservation was never the rule. Pattern-sensitive judgment was.');

    expect(await screen.findByText('Three Nights of Teaching')).toBeInTheDocument();
    await clickButton('Begin. I want the pattern, not the slogan.');

    expect(await screen.findByText('The Lesson Made Yours')).toBeInTheDocument();
    await clickButton('The visible break was downstream of the real failure.');

    await waitFor(() => {
      const profile = selectBondProfileByNpcId(store.getState(), WILLOW_ID);
      const assimilation = selectTraitAssimilationState(store.getState(), WILLOW_ID, WISDOM_ID);
      expect(profile.connectionLevel).toBe(2);
      expect(assimilation.progress).toBe(100);
      expect(assimilation.compatibility).toBeGreaterThanOrEqual(20);
    });

    fireEvent.click(screen.getByRole('tab', { name: 'Relationship' }));
    expect(await screen.findByText('Why this Connection level was earned')).toBeInTheDocument();
    expect(screen.getAllByText('The Lesson Made Yours').length).toBeGreaterThan(0);
    expect(screen.getByText('Passive Essence')).toBeInTheDocument();

    const balanceBeforePassiveTime = store.getState().essence.currentEssence;
    expect(balanceBeforePassiveTime).toBe(0);
    expect(store.getState().essence.generationRate).toBeGreaterThan(0.1);
    await store.dispatch(processPassiveGenerationThunk(300_000)).unwrap();
    expect(store.getState().essence.currentEssence).toBeGreaterThanOrEqual(40);

    fireEvent.click(screen.getByRole('tab', { name: 'Traits' }));
    expect(await screen.findByText("Willow's Wisdom")).toBeInTheDocument();
    await clickButton('Resonate');
    expect(await screen.findByText('Confirm Trait Resonance')).toBeInTheDocument();
    await clickButton('Confirm & Resonate');

    await waitFor(() => {
      expect(store.getState().player.permanentTraits).toContain(WISDOM_ID);
      expect(store.getState().relationships.experiencesById.willow_exp_resonance_wisdom).toBeDefined();
    });
    expect(store.getState().essence.currentEssence).toBeGreaterThanOrEqual(0);
  });
});
