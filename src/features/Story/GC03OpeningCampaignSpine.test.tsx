import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer, replaceState, type RootState } from '../../app/store';
import { npcListeners } from '../NPCs/state/NPCListeners';
import { markDialogueCompleted, setNPCs } from '../NPCs/state/NPCSlice';
import { recordRelationshipExperience } from '../Relationships/state/RelationshipSlice';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import {
  GC02_FIRST_LESSON_EXPERIENCE_ID,
  selectOpeningCampaignStage,
} from './CampaignSpine';
import { CampaignSpinePanel } from './components/CampaignSpinePanel';

const CHAPTER_ONE_CONCLUSION = 'valerius_m25_public_order_conclusion';

const ARCHIVE_ROUTE = [
  'elara_exp_model_challenged',
  'elara_exp_contradictory_footnote',
  'elara_exp_tome_committed',
  'elara_exp_follow_evidence',
  'elara_exp_revision_mutual',
  'elara_exp_theory_neither_owned',
  'elara_exp_independent_verification',
];

const LYRA_ARC = [
  'lyra_exp_strategic_defeat',
  'lyra_exp_coercion_reflected',
  'lyra_exp_reluctant_cotraining',
  'lyra_exp_ideological_friction',
  'lyra_exp_mutual_calibration',
  'lyra_exp_proto_bond',
];

const experience = (id: string) => ({
  id,
  uniqueKey: `test:${id}`,
  title: id,
  timestamp: 1,
  primaryTargetId: 'test-npc',
  participantIds: ['player', 'test-npc'],
  sourceType: 'dialogue',
  significance: 'meaningful',
  relationshipEffects: {},
  resonanceTags: [],
  memoryCandidate: false,
} as any);

const npc = (id: string, completedDialogues: string[] = []) => ({
  id,
  name: id,
  description: '',
  location: 'city_center',
  affinity: id === 'npc_elder_willow' ? 17 : 0,
  connectionDepth: 0,
  loyalty: 0,
  isDiscovered: true,
  isAvailable: true,
  discoveredAt: 1,
  lastInteraction: 0,
  availableQuests: [],
  completedQuests: [],
  availableDialogues: [],
  completedDialogues,
  sharedTraitSlots: [],
  services: [],
  inventory: { items: [] },
} as any);

const initialState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);

const stateWithProgress = ({
  firstLesson = false,
  chapterOne = false,
  chapterTwo = false,
  chapterThree = false,
}: {
  firstLesson?: boolean;
  chapterOne?: boolean;
  chapterTwo?: boolean;
  chapterThree?: boolean;
}): RootState => {
  const base = initialState();
  const ids = [
    ...(firstLesson ? [GC02_FIRST_LESSON_EXPERIENCE_ID] : []),
    ...(chapterTwo ? ARCHIVE_ROUTE : []),
    ...(chapterThree ? LYRA_ARC : []),
  ];

  return {
    ...base,
    relationships: {
      ...base.relationships,
      experiencesById: Object.fromEntries(ids.map(id => [id, experience(id)])),
    },
    npcs: {
      ...base.npcs,
      npcs: {
        npc_captain_valerius: npc(
          'npc_captain_valerius',
          chapterOne ? [CHAPTER_ONE_CONCLUSION] : []
        ),
      },
      discoveredNPCs: ['npc_captain_valerius'],
    },
  };
};

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(npcListeners.middleware),
  });

const catalog = {
  npc_elder_willow: npc('npc_elder_willow'),
  npc_blacksmith_gronk: npc('npc_blacksmith_gronk'),
  npc_rogue_silas: npc('npc_rogue_silas'),
  npc_captain_valerius: npc('npc_captain_valerius'),
  npc_scholar_elara: npc('npc_scholar_elara'),
  npc_rival_lyra: npc('npc_rival_lyra'),
};

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') {
      return { ok: true, json: async () => JSON.parse(JSON.stringify(catalog)) } as any;
    }
    if (url === '/data/dialogues.json') {
      return { ok: true, json: async () => ({}) } as any;
    }
    if (
      url === '/data/m24-world-state-content.json' ||
      url === '/data/m25-chapter-content.json'
    ) {
      return { ok: false, json: async () => ({}) } as any;
    }
    return { ok: false, statusText: `Unexpected URL: ${url}` } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('GC-03 opening Campaign One spine', () => {
  test('enforces Prologue -> Chapter 1 -> Chapter 2 -> Chapter 3 ordering from canonical evidence', () => {
    expect(selectOpeningCampaignStage(stateWithProgress({}))).toBe('PROLOGUE');

    expect(
      selectOpeningCampaignStage(
        stateWithProgress({ chapterOne: true, chapterTwo: true, chapterThree: true })
      )
    ).toBe('PROLOGUE');

    expect(
      selectOpeningCampaignStage(
        stateWithProgress({ firstLesson: true, chapterTwo: true, chapterThree: true })
      )
    ).toBe('CHAPTER_1');

    expect(
      selectOpeningCampaignStage(
        stateWithProgress({ firstLesson: true, chapterOne: true })
      )
    ).toBe('CHAPTER_2');

    expect(
      selectOpeningCampaignStage(
        stateWithProgress({ firstLesson: true, chapterOne: true, chapterTwo: true })
      )
    ).toBe('CHAPTER_3');

    expect(
      selectOpeningCampaignStage(
        stateWithProgress({
          firstLesson: true,
          chapterOne: true,
          chapterTwo: true,
          chapterThree: true,
        })
      )
    ).toBe('GC03_COMPLETE');
  });

  test('unlocks each next chapter cast from the prior unit evidence while preserving Willow progress', async () => {
    const store = makeStore();
    store.dispatch(setNPCs({ npc_elder_willow: npc('npc_elder_willow') }));
    expect(store.getState().npcs.npcs.npc_elder_willow.affinity).toBe(17);

    store.dispatch(recordRelationshipExperience(experience(GC02_FIRST_LESSON_EXPERIENCE_ID)));

    await waitFor(() => {
      expect(store.getState().npcs.npcs.npc_captain_valerius).toBeDefined();
      expect(store.getState().npcs.npcs.npc_blacksmith_gronk).toBeDefined();
      expect(store.getState().npcs.npcs.npc_rogue_silas).toBeDefined();
    });
    expect(store.getState().npcs.npcs.npc_elder_willow.affinity).toBe(17);
    expect(store.getState().npcs.npcs.npc_scholar_elara).toBeUndefined();

    store.dispatch(markDialogueCompleted({
      npcId: 'npc_captain_valerius',
      dialogueId: CHAPTER_ONE_CONCLUSION,
    }));
    await waitFor(() => {
      expect(store.getState().npcs.npcs.npc_scholar_elara).toBeDefined();
    });
    expect(store.getState().npcs.npcs.npc_rival_lyra).toBeUndefined();

    store.dispatch(
      recordRelationshipExperience(experience('elara_exp_independent_verification'))
    );
    await waitFor(() => {
      expect(store.getState().npcs.npcs.npc_rival_lyra).toBeDefined();
    });
  });

  test('projects the current chapter through ordinary UI without exposing route requirement IDs', () => {
    const store = makeStore();
    store.dispatch(replaceState(stateWithProgress({ firstLesson: true })));

    render(
      <Provider store={store}>
        <MemoryRouter>
          <CampaignSpinePanel />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Chapter 1 — Merchant District Crisis')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Valerius' })).toHaveAttribute(
      'href',
      '/game/npcs/npc_captain_valerius'
    );
    expect(screen.queryByText(CHAPTER_ONE_CONCLUSION)).not.toBeInTheDocument();
  });

  test('derived opening-spine completion survives canonical save/load with no new save root', async () => {
    const store = makeStore();
    store.dispatch(replaceState(stateWithProgress({
      firstLesson: true,
      chapterOne: true,
      chapterTwo: true,
      chapterThree: true,
    })));

    const saveId = createSave(store.getState(), 'GC-03 opening spine');
    expect(saveId).not.toBeNull();

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));
    expect(selectOpeningCampaignStage(resumed.getState())).toBe('GC03_COMPLETE');
    expect(Object.keys(resumed.getState())).not.toContain('chapter');
    expect(Object.keys(resumed.getState())).not.toContain('story');
  });
});
