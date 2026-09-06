import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { rootReducer } from '../../../app/store';
import { gameEventListeners } from '../../../app/listeners/GameEventListeners';
import NPCPanelContainer from '../../NPCs/components/containers/NPCPanelContainer';
import { initializeNPCsThunk } from '../../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../../NPCs/state/NPCSlice';
import { initializeQuestsThunk } from '../../Quest/state/QuestThunks';
import { setLocation } from '../../Player/state/PlayerSlice';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipMemoriesByNpcId,
} from './RelationshipSelectors';

const VALERIUS_ID = 'npc_captain_valerius';
const VALERIUS_QUEST_ID = 'quest_valerius_patrol_duty';
const VALERIUS_MEMORY_ID = 'valerius_memory_order_questioned';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const valeriusBundle = readJson('public/data/relationships/valerius.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');

const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(gameEventListeners.middleware),
  });

const initializeProductionRuntime = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();
  store.dispatch(setSelectedNPCId(VALERIUS_ID));
};

const renderValeriusRoute = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/game/npcs/${VALERIUS_ID}`]}>
        <Routes>
          <Route path="/game/npcs/:npcId" element={<NPCPanelContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

const clickTab = (name: string) => {
  fireEvent.click(screen.getByRole('tab', { name }));
};

const clickButton = async (name: string) => {
  fireEvent.click(await screen.findByRole('button', { name }));
};

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') {
      return { ok: true, json: async () => npcs } as any;
    }
    if (url === '/data/dialogues.json') {
      return { ok: true, json: async () => dialogues } as any;
    }
    if (url === '/data/quests.json') {
      return { ok: true, json: async () => quests } as any;
    }
    if (url === '/data/relationships/index.json') {
      return { ok: true, json: async () => manifest } as any;
    }
    if (bundleByUrl[url]) {
      return { ok: true, json: async () => bundleByUrl[url] } as any;
    }
    return { ok: false, statusText: `Unexpected test URL: ${url}` } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('M12 Valerius institutional relationship confirmation', () => {
  test('production authoring reuses generic dialogue, quest, location, relationship, Essence, and save behavior', () => {
    expect(manifest.bundles).toContain('/data/relationships/valerius.json');

    const progression = valeriusBundle.progression[VALERIUS_ID];
    expect(progression.connectionAuthority).toBe('relationships');
    expect(progression.essence.enabled).toBe(true);

    const valerius = npcs[VALERIUS_ID];
    expect(valerius).toBeDefined();
    for (const dialogueId of valerius.availableDialogues) {
      expect(dialogues[dialogueId]).toBeDefined();
      expect(dialogues[dialogueId].npcId).toBe(VALERIUS_ID);
    }

    const quest = quests[VALERIUS_QUEST_ID];
    expect(quest).toBeDefined();
    expect(quest.giver).toBe(VALERIUS_ID);
    expect(quest.objectives[0].type).toBe('REACH_LOCATION');
    expect(quest.objectives[0].target).toBe('location_merchant_district');
    expect(quest.resolutionRequired).toBe(true);
    expect(quest.resolutionOptions).toHaveLength(1);
    expect(quest.resolutionOptions[0].relationshipExperienceId).toBe(
      'valerius_exp_report_without_theatre'
    );

    expect(
      valeriusBundle.experiences.valerius_exp_objective_before_obedience.sourceId
    ).toBe('valerius_report');
    expect(valeriusBundle.experiences.valerius_exp_report_without_theatre.sourceId).toBe(
      VALERIUS_QUEST_ID
    );
    expect(valeriusBundle.experiences.valerius_exp_order_questioned.sourceId).toBe(
      'valerius_city_issues'
    );
    expect(valeriusBundle.memories[VALERIUS_MEMORY_ID].originExperienceId).toBe(
      'valerius_exp_order_questioned'
    );
    expect(valeriusBundle.memories[VALERIUS_MEMORY_ID].persistence).toBe('stable');

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/features/Essence/utils/essenceRate.ts',
      'src/features/Traits/state/TraitThunks.ts',
      'src/features/Quest/state/QuestThunks.ts',
      'src/app/listeners/GameEventListeners.ts',
      'src/shared/utils/saveSchema.ts',
      'src/features/NPCs/components/containers/NPCPanelContainer.tsx',
    ]) {
      expect(fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8')).not.toContain(
        VALERIUS_ID
      );
    }
  });

  test('normal Dialogue, patrol movement, and Quest UI reaches institutional Connection II through disciplined dissent', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    renderValeriusRoute(store);

    expect(screen.getByText('Captain Valerius')).toBeInTheDocument();
    clickTab('Dialogue');

    await clickButton('Keep trade moving and civilians safe. The route is a constraint, not the objective.');
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.valerius_exp_objective_before_obedience
      ).toBeDefined();
    });

    await clickButton(
      "Give me the route. I'll report what the district actually needs, not what makes the Watch look clean."
    );

    clickTab('Quests');
    fireEvent.click(await screen.findByText('Patrol the City Streets'));
    await clickButton('Accept Quest');

    expect(store.getState().quest.quests[VALERIUS_QUEST_ID].status).toBe('IN_PROGRESS');
    store.dispatch(setLocation('location_merchant_district'));

    await waitFor(() => {
      expect(store.getState().quest.quests[VALERIUS_QUEST_ID].status).toBe('READY_TO_COMPLETE');
    });

    await clickButton('Choose Give the Plain Report');
    await waitFor(() => {
      expect(store.getState().quest.quests[VALERIUS_QUEST_ID].selectedResolutionId).toBe(
        'report_plainly'
      );
      expect(
        store.getState().relationships.experiencesById.valerius_exp_report_without_theatre
      ).toBeDefined();
    });

    const connectionI = selectBondProfileByNpcId(store.getState(), VALERIUS_ID);
    expect(connectionI.connectionLevel).toBe(1);
    expect(connectionI.connectionProgress).toBe(27);
    expect(connectionI.dimensions.affinity).toBe(2);
    expect(connectionI.dimensions.trust).toBe(14);
    expect(connectionI.dimensions.understanding).toBe(12);
    expect(connectionI.dimensions.sharedMeaning).toBe(10);
    expect(connectionI.dimensions.reliance).toBe(10);
    expect(connectionI.dimensions.vulnerability).toBe(1);
    expect(connectionI.dimensions.reciprocity).toBe(6);

    await clickButton('Turn In Quest');
    await waitFor(() => {
      expect(store.getState().quest.quests[VALERIUS_QUEST_ID].status).toBe('COMPLETED');
    });

    clickTab('Dialogue');
    await clickButton(
      'That order protects the appearance of control and abandons the objective. Keep the gate post, but free one patrol to cover the alley.'
    );
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.valerius_exp_order_questioned
      ).toBeDefined();
    });

    const profile = selectBondProfileByNpcId(store.getState(), VALERIUS_ID);
    expect(profile.connectionLevel).toBe(2);
    expect(profile.connectionProgress).toBe(55);
    expect(profile.dimensions.affinity).toBe(1);
    expect(profile.dimensions.trust).toBe(28);
    expect(profile.dimensions.understanding).toBe(24);
    expect(profile.dimensions.sharedMeaning).toBe(22);
    expect(profile.dimensions.reliance).toBe(22);
    expect(profile.dimensions.vulnerability).toBe(6);
    expect(profile.dimensions.reciprocity).toBe(15);

    const memories = selectRelationshipMemoriesByNpcId(store.getState(), VALERIUS_ID);
    expect(memories).toHaveLength(1);
    expect(memories[0].id).toBe(VALERIUS_MEMORY_ID);
    expect(memories[0].originExperienceId).toBe('valerius_exp_order_questioned');

    const contribution = selectRelationshipEssenceContributionByNpcId(
      store.getState(),
      VALERIUS_ID
    );
    expect(contribution.enabled).toBe(true);
    expect(contribution.effectiveRate).toBeGreaterThan(0);

    clickTab('Relationship');
    expect(screen.getByText('Connection 2')).toBeInTheDocument();
    expect(screen.getAllByText('The Order He Let You Question').length).toBeGreaterThan(0);
  });
});
