import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { rootReducer } from '../../../app/store';
import NPCPanelContainer from '../../NPCs/components/containers/NPCPanelContainer';
import { initializeNPCsThunk } from '../../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../../NPCs/state/NPCSlice';
import { initializeQuestsThunk } from '../../Quest/state/QuestThunks';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipMemoriesByNpcId,
} from './RelationshipSelectors';

const SILAS_ID = 'npc_rogue_silas';
const SILAS_QUEST_ID = 'quest_silas_retrieve_item';
const SILAS_MEMORY_ID = 'silas_memory_secret_neither_sold';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const silasBundle = readJson('public/data/relationships/silas.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');

const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({ reducer: rootReducer });

const initializeProductionRuntime = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(initializeNPCsThunk()).unwrap();
  store.dispatch(setSelectedNPCId(SILAS_ID));
};

const renderSilasRoute = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/game/npcs/${SILAS_ID}`]}>
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

describe('M12 Silas instrumental relationship migration', () => {
  test('production authoring is internally wired without a Silas engine or quest-runtime exception', () => {
    expect(manifest.bundles).toContain('/data/relationships/silas.json');

    const progression = silasBundle.progression[SILAS_ID];
    expect(progression.connectionAuthority).toBe('relationships');
    expect(progression.essence.enabled).toBe(true);

    const silas = npcs[SILAS_ID];
    expect(silas).toBeDefined();
    for (const dialogueId of silas.availableDialogues) {
      expect(dialogues[dialogueId]).toBeDefined();
      expect(dialogues[dialogueId].npcId).toBe(SILAS_ID);
    }

    const quest = quests[SILAS_QUEST_ID];
    expect(quest).toBeDefined();
    expect(quest.giver).toBe(SILAS_ID);
    expect(quest.resolutionRequired).toBe(true);
    expect(quest.resolutionOptions).toHaveLength(1);
    expect(quest.resolutionOptions[0].relationshipExperienceId).toBe(
      'silas_exp_package_unopened'
    );
    expect(
      silasBundle.experiences[quest.resolutionOptions[0].relationshipExperienceId]
    ).toBeDefined();

    expect(silasBundle.experiences.silas_exp_price_of_truth.sourceId).toBe('silas_approach');
    expect(silasBundle.experiences.silas_exp_package_unopened.sourceId).toBe(SILAS_QUEST_ID);
    expect(silasBundle.experiences.silas_exp_leverage_named.sourceId).toBe('silas_trait_hint');
    expect(silasBundle.experiences.silas_exp_secret_neither_sold.sourceId).toBe(
      'silas_secret_neither_sold'
    );
    expect(silasBundle.memories[SILAS_MEMORY_ID].originExperienceId).toBe(
      'silas_exp_secret_neither_sold'
    );
    expect(silasBundle.memories[SILAS_MEMORY_ID].persistence).toBe('contested');

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/features/Essence/utils/essenceRate.ts',
      'src/features/Traits/state/TraitThunks.ts',
      'src/features/Quest/state/QuestThunks.ts',
      'src/shared/utils/saveSchema.ts',
      'src/features/NPCs/components/containers/NPCPanelContainer.tsx',
    ]) {
      expect(fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8')).not.toContain(
        SILAS_ID
      );
    }
  });

  test('normal Dialogue and Quest UI reaches dangerous-confidant Connection II without positive Affinity', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    renderSilasRoute(store);

    expect(screen.getByText('Rogue Silas')).toBeInTheDocument();
    clickTab('Dialogue');

    await clickButton('Give me the answer whose consequences make it expensive.');
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.silas_exp_price_of_truth
      ).toBeDefined();
    });

    await clickButton('Give me the package. If you wanted it opened, you would have said so.');
    await waitFor(() => {
      expect(store.getState().inventory.items.item_shady_package).toBe(1);
      expect(store.getState().npcs.npcs[SILAS_ID].availableQuests).toContain(SILAS_QUEST_ID);
    });

    clickTab('Quests');
    fireEvent.click(await screen.findByText('A Shady Delivery'));
    await clickButton('Accept Quest');

    await waitFor(() => {
      expect(store.getState().quest.quests[SILAS_QUEST_ID].status).toBe('READY_TO_COMPLETE');
    });

    await clickButton('Choose Return It Unopened');
    await waitFor(() => {
      expect(store.getState().quest.quests[SILAS_QUEST_ID].selectedResolutionId).toBe(
        'return_unopened'
      );
      expect(store.getState().inventory.items.item_shady_package).toBeUndefined();
      expect(
        store.getState().relationships.experiencesById.silas_exp_package_unopened
      ).toBeDefined();
    });

    const connectionI = selectBondProfileByNpcId(store.getState(), SILAS_ID);
    expect(connectionI.connectionLevel).toBe(1);
    expect(connectionI.connectionProgress).toBe(24);
    expect(connectionI.dimensions.affinity).toBe(-3);
    expect(connectionI.dimensions.trust).toBe(10);
    expect(connectionI.dimensions.understanding).toBe(12);
    expect(connectionI.dimensions.sharedMeaning).toBe(7);
    expect(connectionI.dimensions.reliance).toBe(7);
    expect(connectionI.dimensions.vulnerability).toBe(9);
    expect(connectionI.dimensions.reciprocity).toBe(4);

    await clickButton('Turn In Quest');
    await waitFor(() => {
      expect(store.getState().quest.quests[SILAS_QUEST_ID].status).toBe('COMPLETED');
    });

    clickTab('Dialogue');
    await clickButton('Good. Now neither of us can pretend the leverage only runs one way.');
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.silas_exp_leverage_named
      ).toBeDefined();
    });

    await clickButton(
      'We are still dangerous to each other. Apparently that is not the same thing as being for sale.'
    );
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.silas_exp_secret_neither_sold
      ).toBeDefined();
    });

    const profile = selectBondProfileByNpcId(store.getState(), SILAS_ID);
    expect(profile.connectionLevel).toBe(2);
    expect(profile.connectionProgress).toBe(58);
    expect(profile.dimensions.affinity).toBe(-4);
    expect(profile.dimensions.trust).toBe(20);
    expect(profile.dimensions.understanding).toBe(29);
    expect(profile.dimensions.sharedMeaning).toBe(20);
    expect(profile.dimensions.reliance).toBe(20);
    expect(profile.dimensions.vulnerability).toBe(27);
    expect(profile.dimensions.reciprocity).toBe(16);

    const memories = selectRelationshipMemoriesByNpcId(store.getState(), SILAS_ID);
    expect(memories).toHaveLength(1);
    expect(memories[0].id).toBe(SILAS_MEMORY_ID);
    expect(memories[0].originExperienceId).toBe('silas_exp_secret_neither_sold');

    const contribution = selectRelationshipEssenceContributionByNpcId(
      store.getState(),
      SILAS_ID
    );
    expect(contribution.enabled).toBe(true);
    expect(contribution.effectiveRate).toBeGreaterThan(0);

    clickTab('Relationship');
    expect(screen.getByText('Connection 2')).toBeInTheDocument();
    expect(screen.getAllByText('The Secret Neither Sold').length).toBeGreaterThan(0);
  });
});
