import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { replaceState, rootReducer } from '../../../app/store';
import NPCPanelContainer from '../../NPCs/components/containers/NPCPanelContainer';
import { initializeNPCsThunk } from '../../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../../NPCs/state/NPCSlice';
import { initializeRelationshipRuntimeThunk } from './RelationshipThunks';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipMemoriesByNpcId,
} from './RelationshipSelectors';
import { createSave, loadSavedGameWithMigration } from '../../../shared/utils/saveUtils';

const GRONK_ID = 'npc_blacksmith_gronk';
const GRONK_MEMORY_ID = 'gronk_memory_blade_that_held';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const willowBundle = readJson('public/data/relationships/elder-willow.json');
const lyraBundle = readJson('public/data/relationships/lyra.json');
const elaraBundle = readJson('public/data/relationships/elara.json');
const gronkBundle = readJson('public/data/relationships/gronk.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');

const bundleByUrl: Record<string, any> = {
  '/data/relationships/elder-willow.json': willowBundle,
  '/data/relationships/lyra.json': lyraBundle,
  '/data/relationships/elara.json': elaraBundle,
  '/data/relationships/gronk.json': gronkBundle,
};

const makeStore = () => configureStore({ reducer: rootReducer });

const initializeProductionRuntime = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(initializeNPCsThunk()).unwrap();
  store.dispatch(setSelectedNPCId(GRONK_ID));
};

const renderGronkRoute = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/game/npcs/${GRONK_ID}`]}>
        <Routes>
          <Route path="/game/npcs/:npcId" element={<NPCPanelContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

const clickTab = (name: string) => {
  fireEvent.click(screen.getByRole('tab', { name }));
};

const clickResponse = (label: string) => {
  fireEvent.click(screen.getByRole('button', { name: label }));
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

describe('M12 Gronk professional relationship baseline migration', () => {
  test('production authoring uses the manifest and existing generic runtime without a Gronk branch', () => {
    expect(manifest.bundles).toContain('/data/relationships/gronk.json');

    const gronk = npcs[GRONK_ID];
    expect(gronk).toBeDefined();
    for (const dialogueId of gronk.availableDialogues) {
      expect(dialogues[dialogueId]).toBeDefined();
      expect(dialogues[dialogueId].npcId).toBe(GRONK_ID);
    }

    const progression = gronkBundle.progression[GRONK_ID];
    expect(progression.connectionAuthority).toBe('relationships');
    expect(progression.essence.enabled).toBe(true);
    expect(gronkBundle.experiences.gronk_exp_blade_that_held.memoryDefinitionId).toBe(
      GRONK_MEMORY_ID
    );
    expect(gronkBundle.memories[GRONK_MEMORY_ID].originExperienceId).toBe(
      'gronk_exp_blade_that_held'
    );

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/features/Essence/utils/essenceRate.ts',
      'src/features/Traits/state/TraitThunks.ts',
      'src/shared/utils/saveSchema.ts',
      'src/features/NPCs/components/containers/NPCPanelContainer.tsx',
    ]) {
      expect(fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8')).not.toContain(
        GRONK_ID
      );
    }
  });

  test('normal Dialogue reaches professional Connection II and survives a Connection-I save boundary', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    renderGronkRoute(store);

    expect(screen.getByText('Blacksmith Gronk')).toBeInTheDocument();
    clickTab('Dialogue');

    clickResponse(
      "The edge is clean, but the forward balance says you built this for a committed cut, not a duelist's recovery."
    );
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.gronk_exp_steel_not_flattery
      ).toBeDefined();
    });

    clickResponse(
      'The shock is twisting the bracket at the mount. Reinforce the load path, not the whole plate.'
    );
    await waitFor(() => {
      const profile = selectBondProfileByNpcId(store.getState(), GRONK_ID);
      expect(profile.connectionLevel).toBe(1);
      expect(profile.connectionProgress).toBe(22);
      expect(profile.dimensions.trust).toBe(14);
      expect(profile.dimensions.understanding).toBe(13);
    });

    const checkpointId = createSave(store.getState(), 'Gronk Connection I');
    expect(checkpointId).toBeTruthy();
    const checkpoint = await loadSavedGameWithMigration(checkpointId!);
    expect(checkpoint).not.toBeNull();
    expect(checkpoint!.state.relationships.bondProfilesByNpc[GRONK_ID].connectionLevel).toBe(1);

    store.dispatch(replaceState(checkpoint!.state));
    await store
      .dispatch(initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true }))
      .unwrap();
    store.dispatch(setSelectedNPCId(GRONK_ID));

    clickResponse(
      'Then lose the sale. If the constraint matters, the finish serves it—not the other way around.'
    );
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.gronk_exp_quality_over_finish
      ).toBeDefined();
    });

    clickResponse(
      'Your steel held. Our constraint was right. Keep refusing me when I ask for the wrong thing.'
    );
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.gronk_exp_blade_that_held
      ).toBeDefined();
    });

    const profile = selectBondProfileByNpcId(store.getState(), GRONK_ID);
    expect(profile.connectionLevel).toBe(2);
    expect(profile.connectionProgress).toBe(56);
    expect(profile.dimensions.affinity).toBe(4);
    expect(profile.dimensions.trust).toBe(33);
    expect(profile.dimensions.understanding).toBe(26);
    expect(profile.dimensions.sharedMeaning).toBe(25);
    expect(profile.dimensions.reliance).toBe(19);
    expect(profile.dimensions.reciprocity).toBe(14);
    expect(profile.stability).toBe('stable');

    const memories = selectRelationshipMemoriesByNpcId(store.getState(), GRONK_ID);
    expect(memories).toHaveLength(1);
    expect(memories[0].id).toBe(GRONK_MEMORY_ID);
    expect(memories[0].originExperienceId).toBe('gronk_exp_blade_that_held');

    const contribution = selectRelationshipEssenceContributionByNpcId(
      store.getState(),
      GRONK_ID
    );
    expect(contribution.enabled).toBe(true);
    expect(contribution.effectiveRate).toBeGreaterThan(0);
    expect(store.getState().essence.currentEssence).toBe(0);

    clickTab('Relationship');
    expect(screen.getByText('Connection 2')).toBeInTheDocument();
    expect(screen.getAllByText('The Blade That Held').length).toBeGreaterThan(0);
  });
});
