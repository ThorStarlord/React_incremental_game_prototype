import fs from 'fs';
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { knowledgeListeners } from './state/KnowledgeListeners';
import { learnNpcFact } from './state/KnowledgeSlice';
import { selectNpcKnownFactIds, selectNpcKnowsFact } from './state/KnowledgeSelectors';
import { FORGE_ASSISTANCE_PRACTICED_FACT_ID } from './KnowledgeDefinitions';
import { setNPCs, setDialogueNodes } from '../NPCs/state/NPCSlice';
import { processNPCInteractionThunk } from '../NPCs/state/NPCThunks';
import NPCDialogueTab from '../NPCs/components/ui/tabs/NPCDialogueTab';
import { setLocation, resetPlayerState } from '../Player/state/PlayerSlice';
import {
  CITY_CENTER_LOCATION_ID,
  CITY_GATE_LOCATION_ID,
} from '../Exploration/LocationDefinitions';
import { practiceForgeAssistanceThunk } from '../Exploration/TravelThunks';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { settleOfflineProgressThunk } from '../GameLoop/state/OfflineProgress';

const GRONK_ID = 'npc_blacksmith_gronk';
const VALERIUS_ID = 'npc_captain_valerius';
const REPORT_ID = 'valerius_m22_forge_report';
const CONSUMER_ID = 'valerius_m22_forge_logistics';

const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(knowledgeListeners.middleware),
});

type TestStore = ReturnType<typeof makeStore>;

const readJson = (fileName: string) => JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'public/data', fileName), 'utf8')
);

const seedProductionNpcContent = (store: TestStore) => {
  store.dispatch(setNPCs(readJson('npcs.json')));
  store.dispatch(setDialogueNodes(readJson('dialogues.json')));
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('M22 social knowledge propagation qualification', () => {
  test('objective Forge practice creates Gronk witness knowledge while Valerius remains ignorant', async () => {
    const store = makeStore();
    seedProductionNpcContent(store);

    expect(store.getState().player.routineFamiliarity?.forge_assistance).toBeUndefined();
    expect(selectNpcKnowsFact(store.getState(), GRONK_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(false);
    expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(false);

    store.dispatch(setLocation(CITY_GATE_LOCATION_ID));
    const outside = await store.dispatch(practiceForgeAssistanceThunk());
    expect(practiceForgeAssistanceThunk.rejected.match(outside)).toBe(true);
    expect(selectNpcKnownFactIds(store.getState(), GRONK_ID)).toEqual([]);
    expect(selectNpcKnownFactIds(store.getState(), VALERIUS_ID)).toEqual([]);

    store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
    const relationshipsBefore = JSON.parse(JSON.stringify(store.getState().relationships));
    const worldStateBefore = JSON.parse(JSON.stringify(store.getState().worldState));
    const practiced = await store.dispatch(practiceForgeAssistanceThunk());
    expect(practiceForgeAssistanceThunk.fulfilled.match(practiced)).toBe(true);

    expect(store.getState().player.routineFamiliarity?.forge_assistance?.source)
      .toBe('city_center_forge_assistance');
    expect(selectNpcKnowsFact(store.getState(), GRONK_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
    expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(false);
    expect(store.getState().relationships).toEqual(relationshipsBefore);

    store.dispatch(learnNpcFact({ npcId: GRONK_ID, factId: FORGE_ASSISTANCE_PRACTICED_FACT_ID }));
    store.dispatch(learnNpcFact({ npcId: GRONK_ID, factId: FORGE_ASSISTANCE_PRACTICED_FACT_ID }));
    expect(selectNpcKnownFactIds(store.getState(), GRONK_ID))
      .toEqual([FORGE_ASSISTANCE_PRACTICED_FACT_ID]);

    expect((store.getState() as any).faction).toBeUndefined();
    expect(store.getState().worldState).toEqual(worldStateBefore);
  });

  test('knowledge divergence persists while legacy-like missing knowledge stays empty through offline time', async () => {
    const store = makeStore();
    seedProductionNpcContent(store);
    store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
    jest.spyOn(Date, 'now').mockReturnValue(100_000);
    await store.dispatch(practiceForgeAssistanceThunk()).unwrap();

    expect(selectNpcKnowsFact(store.getState(), GRONK_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
    expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(false);

    jest.spyOn(Date, 'now').mockReturnValue(200_000);
    const saveId = createSave(store.getState(), 'm22 knowledge divergence');
    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));
    expect(selectNpcKnowsFact(resumed.getState(), GRONK_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
    expect(selectNpcKnowsFact(resumed.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(false);

    const legacyLikeState: any = JSON.parse(JSON.stringify(makeStore().getState()));
    delete legacyLikeState.knowledge;
    const legacyLikeStore = makeStore();
    legacyLikeStore.dispatch(replaceState(legacyLikeState));
    expect(selectNpcKnownFactIds(legacyLikeStore.getState(), GRONK_ID)).toEqual([]);
    expect(selectNpcKnownFactIds(legacyLikeStore.getState(), VALERIUS_ID)).toEqual([]);

    const settlement = await legacyLikeStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp: 300_000, resumeTimestamp: 310_000 })
    ).unwrap();
    expect(settlement.skipReason).toBeUndefined();
    expect(selectNpcKnownFactIds(legacyLikeStore.getState(), GRONK_ID)).toEqual([]);
    expect(selectNpcKnownFactIds(legacyLikeStore.getState(), VALERIUS_ID)).toEqual([]);
  });

  test('Valerius report and downstream consumer enforce knowledge separately from Relationship below UI', async () => {
    const store = makeStore();
    seedProductionNpcContent(store);

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={VALERIUS_ID} />
      </Provider>
    );

    expect(screen.queryByText('A Workshop Fact, Not a Reputation Claim')).not.toBeInTheDocument();
    expect(screen.queryByText('What the Watch Can Now Ask')).not.toBeInTheDocument();

    const prematureReport = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: REPORT_ID, selectedResponse: 'report' },
    })).unwrap();
    expect(prematureReport.success).toBe(false);
    expect(prematureReport.message).toContain('Missing routine familiarity');
    expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(false);

    store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
    await store.dispatch(practiceForgeAssistanceThunk()).unwrap();

    await waitFor(() => {
      expect(screen.getByText('A Workshop Fact, Not a Reputation Claim')).toBeInTheDocument();
    });
    expect(screen.queryByText('What the Watch Can Now Ask')).not.toBeInTheDocument();

    const prematureConsumer = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: CONSUMER_ID, selectedResponse: 'answer' },
    })).unwrap();
    expect(prematureConsumer.success).toBe(false);
    expect(prematureConsumer.message).toContain('Missing NPC knowledge');

    const relationshipsBeforeReport = JSON.parse(JSON.stringify(store.getState().relationships));
    const report = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: REPORT_ID, selectedResponse: 'report' },
    })).unwrap();
    expect(report.success).toBe(true);
    expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
    expect(store.getState().relationships).toEqual(relationshipsBeforeReport);

    await waitFor(() => {
      expect(screen.queryByText('A Workshop Fact, Not a Reputation Claim')).not.toBeInTheDocument();
      expect(screen.getByText('What the Watch Can Now Ask')).toBeInTheDocument();
    });

    const factsAfterReport = selectNpcKnownFactIds(store.getState(), VALERIUS_ID);
    const duplicateReport = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: REPORT_ID, selectedResponse: 'report' },
    })).unwrap();
    expect(duplicateReport.success).toBe(false);
    expect(selectNpcKnownFactIds(store.getState(), VALERIUS_ID)).toEqual(factsAfterReport);

    const relationshipsBeforeConsumer = JSON.parse(JSON.stringify(store.getState().relationships));
    const consumer = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: CONSUMER_ID, selectedResponse: 'answer' },
    })).unwrap();
    expect(consumer.success).toBe(true);
    expect(store.getState().relationships).toEqual(relationshipsBeforeConsumer);

    expect(selectNpcKnowsFact(store.getState(), GRONK_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
    expect(selectNpcKnowsFact(store.getState(), VALERIUS_ID, FORGE_ASSISTANCE_PRACTICED_FACT_ID)).toBe(true);
  });

  test('new-game player reset clears accumulated NPC knowledge', async () => {
    const store = makeStore();
    seedProductionNpcContent(store);
    store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
    await store.dispatch(practiceForgeAssistanceThunk()).unwrap();
    store.dispatch(learnNpcFact({ npcId: VALERIUS_ID, factId: FORGE_ASSISTANCE_PRACTICED_FACT_ID }));

    expect(selectNpcKnownFactIds(store.getState(), GRONK_ID)).toHaveLength(1);
    expect(selectNpcKnownFactIds(store.getState(), VALERIUS_ID)).toHaveLength(1);

    store.dispatch(resetPlayerState());

    expect(store.getState().player.routineFamiliarity?.forge_assistance).toBeUndefined();
    expect(selectNpcKnownFactIds(store.getState(), GRONK_ID)).toEqual([]);
    expect(selectNpcKnownFactIds(store.getState(), VALERIUS_ID)).toEqual([]);
  });
});
