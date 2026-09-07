import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { rootReducer, replaceState } from '../../../app/store';
import { gameEventListeners } from '../../../app/listeners/GameEventListeners';
import NPCPanelContainer from '../../NPCs/components/containers/NPCPanelContainer';
import { initializeNPCsThunk } from '../../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../../NPCs/state/NPCSlice';
import { initializeQuestsThunk } from '../../Quest/state/QuestThunks';
import { setLocation } from '../../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from './RelationshipThunks';
import { selectBondProfileByNpcId } from './RelationshipSelectors';
import { createSave, loadSavedGameWithMigration } from '../../../shared/utils/saveUtils';

const GRONK_ID = 'npc_blacksmith_gronk';
const SILAS_ID = 'npc_rogue_silas';
const VALERIUS_ID = 'npc_captain_valerius';
const COUNCIL_ID = 'valerius_m14_aftermath_council';
const REPAIR_ID = 'gronk_m14_repair_ledger';
const REROUTE_QUEST_ID = 'quest_m14_quiet_reroute';

const GRONK_HISTORY = [
  'gronk_exp_steel_not_flattery',
  'gronk_exp_measure_twice',
  'gronk_exp_quality_over_finish',
  'gronk_exp_blade_that_held',
];

const SILAS_HISTORY = [
  'silas_exp_price_of_truth',
  'silas_exp_package_unopened',
  'silas_exp_leverage_named',
  'silas_exp_secret_neither_sold',
  'silas_exp_watch_leak_shared',
  'silas_exp_watch_leak_traced',
];

const VALERIUS_HISTORY = [
  'valerius_exp_objective_before_obedience',
  'valerius_exp_report_without_theatre',
  'valerius_exp_order_questioned',
  'valerius_exp_merchant_leak_delegated',
  'valerius_exp_merchant_leak_broken',
];

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const gronkBundle = readJson('public/data/relationships/gronk.json');
const silasBundle = readJson('public/data/relationships/silas.json');
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
};

const seedKnownHistory = async (
  store: ReturnType<typeof makeStore>,
  experienceIds: string[]
) => {
  // M12 and M13 independently qualify these histories through player-facing
  // routes. M14 seeds them only as historical prerequisites so every new M14
  // consequence remains exercised through ordinary production surfaces.
  for (const experienceId of experienceIds) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
};

const seedM14Prerequisites = async (store: ReturnType<typeof makeStore>) => {
  await seedKnownHistory(store, GRONK_HISTORY);
  await seedKnownHistory(store, SILAS_HISTORY);
  await seedKnownHistory(store, VALERIUS_HISTORY);
};

const renderNpcRoute = (store: ReturnType<typeof makeStore>, npcId: string) => {
  store.dispatch(setSelectedNPCId(npcId));
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/game/npcs/${npcId}`]}>
        <Routes>
          <Route path="/game/npcs/:npcId" element={<NPCPanelContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

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
  jest.restoreAllMocks();
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('M14 multi-NPC relationship consequence', () => {
  test('two independent shared scenes fan out through existing dialogue effects without a new generic bridge', () => {
    const council = dialogues[COUNCIL_ID];
    expect(npcs[VALERIUS_ID].availableDialogues).toContain(COUNCIL_ID);
    expect(council.requiredExperienceIds).toEqual([
      'valerius_exp_merchant_leak_broken',
      'silas_exp_watch_leak_traced',
      'gronk_exp_blade_that_held',
    ]);

    const councilRelationshipEffects = council.effects.filter(
      (effect: any) => effect.type === 'RELATIONSHIP_EXPERIENCE'
    );
    for (const responseId of ['public_crackdown', 'protect_source', 'quiet_reroute']) {
      const effects = councilRelationshipEffects.filter(
        (effect: any) => effect.responseId === responseId
      );
      expect(effects).toHaveLength(3);
      const targets = effects.map((effect: any) => {
        const id = effect.experienceId;
        return (
          gronkBundle.experiences[id]?.primaryTargetId ??
          silasBundle.experiences[id]?.primaryTargetId ??
          valeriusBundle.experiences[id]?.primaryTargetId
        );
      });
      expect(new Set(targets)).toEqual(new Set([GRONK_ID, SILAS_ID, VALERIUS_ID]));
    }

    const crackdownSilas = silasBundle.experiences.silas_exp_aftermath_public_crackdown;
    expect(crackdownSilas.relationshipEffects.understanding).toBeGreaterThan(0);
    expect(crackdownSilas.relationshipEffects.trust).toBeLessThan(0);
    expect(crackdownSilas.relationshipEffects.reliance).toBeLessThan(0);

    const rerouteUnlock = council.effects.find(
      (effect: any) =>
        effect.type === 'UNLOCK_QUEST' && effect.responseId === 'quiet_reroute'
    );
    expect(rerouteUnlock.questId).toBe(REROUTE_QUEST_ID);

    const rerouteQuest = quests[REROUTE_QUEST_ID];
    expect(rerouteQuest.giver).toBe(VALERIUS_ID);
    expect(rerouteQuest.objectives[0].type).toBe('REACH_LOCATION');
    expect(rerouteQuest.objectives[0].target).toBe('location_merchant_district');
    expect(rerouteQuest.resolutionOptions).toHaveLength(1);
    expect(rerouteQuest.resolutionOptions[0].relationshipExperienceId).toBe(
      'gronk_exp_quiet_reroute_proven'
    );

    const repair = dialogues[REPAIR_ID];
    expect(npcs[GRONK_ID].availableDialogues).toContain(REPAIR_ID);
    expect(repair.requiredExperienceIds).toEqual(['gronk_exp_quiet_reroute_proven']);
    for (const responseId of ['build_for_load', 'restore_visible_order']) {
      const effects = repair.effects.filter(
        (effect: any) =>
          effect.type === 'RELATIONSHIP_EXPERIENCE' && effect.responseId === responseId
      );
      expect(effects).toHaveLength(2);
      const targets = effects.map((effect: any) => {
        const id = effect.experienceId;
        return (
          gronkBundle.experiences[id]?.primaryTargetId ??
          valeriusBundle.experiences[id]?.primaryTargetId
        );
      });
      expect(new Set(targets)).toEqual(new Set([GRONK_ID, VALERIUS_ID]));
    }

    const questTypesSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Quest/state/QuestTypes.ts'),
      'utf8'
    );
    expect(questTypesSource).toContain('relationshipExperienceId?: string');
    expect(questTypesSource).not.toContain('relationshipExperienceIds');

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/features/NPCs/state/NPCThunks.ts',
      'src/features/Quest/state/QuestThunks.ts',
      'src/app/listeners/GameEventListeners.ts',
      'src/shared/utils/saveSchema.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain('m14');
      expect(source).not.toContain(COUNCIL_ID);
      expect(source).not.toContain(REPAIR_ID);
      expect(source).not.toContain(REROUTE_QUEST_ID);
    }
  });

  test('a public crackdown is one decision with three conflicting Relationship interpretations', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedM14Prerequisites(store);

    const beforeSilas = selectBondProfileByNpcId(store.getState(), SILAS_ID);
    const beforeValerius = selectBondProfileByNpcId(store.getState(), VALERIUS_ID);
    const beforeGronk = selectBondProfileByNpcId(store.getState(), GRONK_ID);

    renderNpcRoute(store, VALERIUS_ID);
    clickTab('Dialogue');

    await clickButton(
      'Close the compromised routes publicly. Arrest what we can see and accept the trade shock. The district needs visible control more than an elegant intelligence channel.'
    );

    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById
          .valerius_exp_aftermath_public_crackdown
      ).toBeDefined();
      expect(
        store.getState().relationships.experiencesById
          .silas_exp_aftermath_public_crackdown
      ).toBeDefined();
      expect(
        store.getState().relationships.experiencesById
          .gronk_exp_aftermath_public_crackdown
      ).toBeDefined();
    });

    const silas = selectBondProfileByNpcId(store.getState(), SILAS_ID);
    const valerius = selectBondProfileByNpcId(store.getState(), VALERIUS_ID);
    const gronk = selectBondProfileByNpcId(store.getState(), GRONK_ID);

    expect(silas.dimensions.trust).toBe(beforeSilas.dimensions.trust - 7);
    expect(silas.dimensions.understanding).toBe(beforeSilas.dimensions.understanding + 5);
    expect(silas.dimensions.reliance).toBe(beforeSilas.dimensions.reliance - 5);
    expect(valerius.dimensions.trust).toBe(beforeValerius.dimensions.trust + 6);
    expect(gronk.dimensions.trust).toBe(beforeGronk.dimensions.trust - 4);
    expect(gronk.dimensions.understanding).toBe(beforeGronk.dimensions.understanding + 4);

    expect(store.getState().npcs.npcs[VALERIUS_ID].availableQuests).not.toContain(
      REROUTE_QUEST_ID
    );
  });

  test('quiet reroute survives save/load, produces gameplay evidence, and a second shared scene fans out from Gronk', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedM14Prerequisites(store);

    renderNpcRoute(store, VALERIUS_ID);
    clickTab('Dialogue');

    await clickButton(
      'Do not burn the source or freeze the district. Reroute caravans and patrols until the leaked timing stops buying anyone an advantage.'
    );

    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById
          .valerius_exp_aftermath_quiet_reroute
      ).toBeDefined();
      expect(
        store.getState().relationships.experiencesById
          .silas_exp_aftermath_quiet_reroute
      ).toBeDefined();
      expect(
        store.getState().relationships.experiencesById
          .gronk_exp_aftermath_quiet_reroute
      ).toBeDefined();
      expect(store.getState().npcs.npcs[VALERIUS_ID].availableQuests).toContain(
        REROUTE_QUEST_ID
      );
    });

    const gronkAfterCouncil = selectBondProfileByNpcId(store.getState(), GRONK_ID);
    const valeriusAfterCouncil = selectBondProfileByNpcId(store.getState(), VALERIUS_ID);
    const silasAfterCouncil = selectBondProfileByNpcId(store.getState(), SILAS_ID);
    expect(gronkAfterCouncil.connectionProgress).toBe(66);
    expect(valeriusAfterCouncil.connectionProgress).toBe(83);
    expect(silasAfterCouncil.connectionProgress).toBe(83);

    jest.spyOn(Date, 'now').mockReturnValue(21000);
    const saveId = createSave(store.getState(), 'M14 After Shared Council');
    expect(saveId).toBe('save_21000');

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();
    for (const experienceId of [
      'valerius_exp_aftermath_quiet_reroute',
      'silas_exp_aftermath_quiet_reroute',
      'gronk_exp_aftermath_quiet_reroute',
    ]) {
      expect(loaded!.state.relationships.experiencesById[experienceId]).toBeDefined();
    }
    expect(loaded!.state.npcs.npcs[VALERIUS_ID].availableQuests).toContain(
      REROUTE_QUEST_ID
    );

    cleanup();
    const resumedStore = makeStore();
    resumedStore.dispatch(replaceState(loaded!.state));

    renderNpcRoute(resumedStore, VALERIUS_ID);
    clickTab('Quests');
    fireEvent.click(await screen.findByText('Reroute the Load'));
    await clickButton('Accept Quest');

    expect(resumedStore.getState().quest.quests[REROUTE_QUEST_ID].status).toBe(
      'IN_PROGRESS'
    );
    resumedStore.dispatch(setLocation('location_whispering_woods'));
    resumedStore.dispatch(setLocation('location_merchant_district'));

    await waitFor(() => {
      expect(resumedStore.getState().quest.quests[REROUTE_QUEST_ID].status).toBe(
        'READY_TO_COMPLETE'
      );
    });

    await clickButton('Choose Prove the Reroute Under Load');
    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById
          .gronk_exp_quiet_reroute_proven
      ).toBeDefined();
    });
    await clickButton('Turn In Quest');
    await waitFor(() => {
      expect(resumedStore.getState().quest.quests[REROUTE_QUEST_ID].status).toBe(
        'COMPLETED'
      );
    });

    const gronkAfterQuest = selectBondProfileByNpcId(resumedStore.getState(), GRONK_ID);
    expect(gronkAfterQuest.connectionProgress).toBe(73);
    expect(
      resumedStore.getState().relationships.experiencesById.gronk_exp_repair_for_load
    ).toBeUndefined();

    cleanup();
    renderNpcRoute(resumedStore, GRONK_ID);
    clickTab('Dialogue');

    await clickButton(
      'Repair the load path first. If reopening takes longer, the Watch can explain why. I will not turn a known structural failure into a public-relations schedule.'
    );

    await waitFor(() => {
      expect(
        resumedStore.getState().relationships.experiencesById.gronk_exp_repair_for_load
      ).toBeDefined();
      expect(
        resumedStore.getState().relationships.experiencesById
          .valerius_exp_repair_for_load
      ).toBeDefined();
    });

    const finalGronk = selectBondProfileByNpcId(resumedStore.getState(), GRONK_ID);
    const finalValerius = selectBondProfileByNpcId(resumedStore.getState(), VALERIUS_ID);
    expect(finalGronk.connectionLevel).toBe(2);
    expect(finalGronk.connectionProgress).toBe(81);
    expect(finalGronk.dimensions.trust).toBe(gronkAfterQuest.dimensions.trust + 5);
    expect(finalGronk.dimensions.sharedMeaning).toBe(
      gronkAfterQuest.dimensions.sharedMeaning + 5
    );
    expect(finalValerius.connectionLevel).toBe(2);
    expect(finalValerius.connectionProgress).toBe(89);
    expect(finalValerius.dimensions.affinity).toBe(
      valeriusAfterCouncil.dimensions.affinity - 1
    );
    expect(finalValerius.dimensions.understanding).toBe(
      valeriusAfterCouncil.dimensions.understanding + 4
    );
  });
});