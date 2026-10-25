import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import { initializeQuestsThunk, startQuestThunk } from '../Quest/state/QuestThunks';
import { initializeNPCsThunk } from '../NPCs/state/NPCThunks';
import { addPermanentTrait, setLocation } from '../Player/state/PlayerSlice';
import { recordAuthoredRelationshipExperienceThunk } from '../Relationships/state/RelationshipThunks';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { WHISPERING_WOODS_LOCATION_ID } from '../Exploration/LocationDefinitions';
import ActiveQuestCombatPanel from './components/ActiveQuestCombatPanel';
import CombatEncounterPanel from './components/CombatEncounterPanel';
import {
  createCombatEncounterState,
  getCombatActionPresentations,
  performCombatAction,
} from './CombatEngine';
import { TELLURIC_ECHO_ENCOUNTER } from './CombatEncounterDefinitions';
import type { CombatActionId, CombatEncounterState } from './CombatTypes';

const WILLOW_ID = 'npc_elder_willow';
const WISDOM_ID = 'WillowsWisdom';
const M17_QUEST_ID = 'quest_m17_telluric_echo';
const M17_TARGET_ID = 'enemy_m17_telluric_echo_fragment';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
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

const startM17Quest = async (store: ReturnType<typeof makeStore>) => {
  store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
  await store.dispatch(startQuestThunk(M17_QUEST_ID)).unwrap();
  expect(store.getState().quest.quests[M17_QUEST_ID].status).toBe('IN_PROGRESS');
};

const renderActiveCombat = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <ActiveQuestCombatPanel />
    </Provider>
  );

const runEngineActions = (
  actionIds: CombatActionId[],
  permanentTraitIds: readonly string[]
): CombatEncounterState => {
  let state = createCombatEncounterState(TELLURIC_ECHO_ENCOUNTER);
  for (const actionId of actionIds) {
    const result = performCombatAction(
      TELLURIC_ECHO_ENCOUNTER,
      state,
      actionId,
      permanentTraitIds
    );
    expect(result.ok).toBe(true);
    state = result.state;
  }
  return state;
};

const seedStrongWillowHistory = async (store: ReturnType<typeof makeStore>) => {
  for (const experienceId of [
    'willow_exp_first_question_admit',
    'willow_exp_first_lesson',
    'willow_exp_seed_offered',
    'willow_exp_sunstone_decision_preserve',
    'willow_exp_willow_disagrees',
    'willow_exp_three_nights_teaching',
    'willow_exp_independent_application',
  ]) {
    await store.dispatch(
      recordAuthoredRelationshipExperienceThunk({ experienceId })
    ).unwrap();
  }
};

const saveAndRestore = async (
  store: ReturnType<typeof makeStore>,
  now: number
): Promise<ReturnType<typeof makeStore>> => {
  jest.spyOn(Date, 'now').mockReturnValue(now);
  const saveId = createSave(store.getState(), 'M17 pre-encounter save');
  expect(saveId).toBe(`save_${now}`);
  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();

  const resumedStore = makeStore();
  resumedStore.dispatch(replaceState(loaded!.state));
  return resumedStore;
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

describe('M17 narrow Trait-sensitive combat vertical slice', () => {
  test('production wiring preserves domain boundaries and uses the existing KILL bridge', () => {
    const quest = quests[M17_QUEST_ID];
    expect(quest).toBeDefined();
    expect(quest.giver).toBe(WILLOW_ID);
    expect(quest.prerequisites).toEqual([
      { type: 'QUEST_COMPLETED', value: 'quest_m16_withering_grove' },
    ]);
    expect(quest.objectives).toEqual([
      expect.objectContaining({
        type: 'KILL',
        target: M17_TARGET_ID,
        requiredCount: 1,
      }),
    ]);

    expect(TELLURIC_ECHO_ENCOUNTER.targetId).toBe(M17_TARGET_ID);
    expect(TELLURIC_ECHO_ENCOUNTER.requiredLocationId).toBe(WHISPERING_WOODS_LOCATION_ID);
    expect(TELLURIC_ECHO_ENCOUNTER.feedbackPattern?.requiredPermanentTraitIds).toEqual([
      WISDOM_ID,
    ]);

    for (const sourceFile of [
      'src/features/Combat/CombatEngine.ts',
      'src/features/Combat/components/ActiveQuestCombatPanel.tsx',
      'src/features/GameLoop/components/ui/GameControlPanel.tsx',
      'src/features/Traits/state/TraitCapabilityRequirements.ts',
      'src/app/listeners/GameEventListeners.ts',
      'src/app/store.ts',
      'src/shared/utils/saveSchema.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain(M17_QUEST_ID);
      expect(source).not.toContain(M17_TARGET_ID);
      expect(source).not.toContain(WILLOW_ID);
      expect(source).not.toContain(WISDOM_ID);
    }

    const storeSource = fs.readFileSync(
      path.join(process.cwd(), 'src/app/store.ts'),
      'utf8'
    );
    expect(storeSource).not.toMatch(/combat\s*:\s*combatReducer/);

    const questAvailabilitySource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Quest/state/QuestResolutionAvailability.ts'),
      'utf8'
    );
    expect(questAvailabilitySource).toContain('TraitCapabilityRequirements');

    const engineSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Combat/CombatEngine.ts'),
      'utf8'
    );
    expect(engineSource).toContain('TraitCapabilityRequirements');
    expect(engineSource).not.toContain('connectionDepth');
    expect(engineSource).not.toContain('Affinity');
    expect(engineSource).not.toContain('Trust');
    expect(engineSource).not.toContain('conditionExpression');
    expect(engineSource).not.toContain('anyOfTraits');
    expect(engineSource).not.toContain('forbiddenTraits');
  });

  test('deterministic control and Wisdom routes are both viable and encode a real tradeoff', () => {
    const control = runEngineActions(
      ['strike', 'guard', 'strike', 'strike', 'guard', 'strike'],
      []
    );
    expect(control.status).toBe('victory');
    expect(control.round).toBe(6);
    expect(control.playerHealth).toBe(5);
    expect(control.feedbackDisrupted).toBe(false);

    const wisdom = runEngineActions(
      ['strike', 'trace_pattern', 'disrupt_feedback', 'strike', 'strike'],
      [WISDOM_ID]
    );
    expect(wisdom.status).toBe('victory');
    expect(wisdom.round).toBe(5);
    expect(wisdom.playerHealth).toBe(4);
    expect(wisdom.feedbackDisrupted).toBe(true);

    // Owning the capability never removes the ordinary strategy.
    const ordinaryWithWisdom = runEngineActions(
      ['strike', 'guard', 'strike', 'strike', 'guard', 'strike'],
      [WISDOM_ID]
    );
    expect(ordinaryWithWisdom).toEqual(control);
  });

  test('Trait and local tactical gates reject direct bypass before mutating encounter state', () => {
    const initial = createCombatEncounterState(TELLURIC_ECHO_ENCOUNTER);
    const missingTrait = performCombatAction(
      TELLURIC_ECHO_ENCOUNTER,
      initial,
      'trace_pattern',
      []
    );
    expect(missingTrait.ok).toBe(false);
    expect(missingTrait.state).toEqual(initial);
    expect(missingTrait.message).toContain(WISDOM_ID);

    const tracedFromStable = performCombatAction(
      TELLURIC_ECHO_ENCOUNTER,
      initial,
      'trace_pattern',
      [WISDOM_ID]
    );
    expect(tracedFromStable.ok).toBe(true);
    expect(tracedFromStable.state.patternRead).toBe(true);
    expect(tracedFromStable.state.enemyPhase).toBe('building');

    const wrongPhaseState = tracedFromStable.state;
    const wrongPhase = performCombatAction(
      TELLURIC_ECHO_ENCOUNTER,
      wrongPhaseState,
      'disrupt_feedback',
      [WISDOM_ID]
    );
    expect(wrongPhase.ok).toBe(false);
    expect(wrongPhase.state).toEqual(wrongPhaseState);
    expect(wrongPhase.message).toContain('release');
  });

  test('no-Trait production UI hides Wisdom actions and conventional victory advances the real Quest', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await startM17Quest(store);

    renderActiveCombat(store);
    fireEvent.click(await screen.findByRole('button', { name: 'Begin Encounter' }));

    expect(screen.getByRole('button', { name: 'Strike' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guard' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Trace the Cycle' })).not.toBeInTheDocument();

    for (const action of ['Strike', 'Guard', 'Strike', 'Strike', 'Guard', 'Strike']) {
      fireEvent.click(screen.getByRole('button', { name: action }));
    }

    await waitFor(() => {
      expect(store.getState().quest.quests[M17_QUEST_ID].status).toBe('READY_TO_COMPLETE');
    });
    expect(store.getState().quest.quests[M17_QUEST_ID].objectives[0].currentCount).toBe(1);
    expect(await screen.findByText('Combat Objective Complete')).toBeInTheDocument();
  });

  test('permanent Willow Wisdom survives save/load and exposes the tactical production route', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    store.dispatch(addPermanentTrait(WISDOM_ID));
    await startM17Quest(store);

    const resumedStore = await saveAndRestore(store, 61000);
    expect(resumedStore.getState().player.permanentTraits).toContain(WISDOM_ID);
    expect(resumedStore.getState().quest.quests[M17_QUEST_ID].status).toBe('IN_PROGRESS');
    expect(resumedStore.getState().player.location).toBe(WHISPERING_WOODS_LOCATION_ID);

    renderActiveCombat(resumedStore);
    fireEvent.click(await screen.findByRole('button', { name: 'Begin Encounter' }));

    expect(screen.getByRole('button', { name: 'Strike' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Guard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Trace the Cycle' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Strike' }));
    fireEvent.click(screen.getByRole('button', { name: 'Trace the Cycle' }));
    expect(screen.getByRole('button', { name: 'Disrupt the Feedback' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Disrupt the Feedback' }));
    expect(screen.getByText('The feedback loop is broken. The Echo can no longer regenerate.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Strike' }));
    fireEvent.click(screen.getByRole('button', { name: 'Strike' }));

    await waitFor(() => {
      expect(resumedStore.getState().quest.quests[M17_QUEST_ID].status).toBe(
        'READY_TO_COMPLETE'
      );
    });
    expect(resumedStore.getState().quest.quests[M17_QUEST_ID].objectives[0].currentCount).toBe(1);
  });

  test('strong Willow history without permanent Trait remains insufficient for combat capability', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await seedStrongWillowHistory(store);

    expect(
      store.getState().relationships.memoriesById.willow_memory_lesson_made_yours
    ).toBeDefined();
    expect(store.getState().player.permanentTraits).not.toContain(WISDOM_ID);

    await startM17Quest(store);
    renderActiveCombat(store);
    fireEvent.click(await screen.findByRole('button', { name: 'Begin Encounter' }));

    expect(screen.queryByRole('button', { name: 'Trace the Cycle' })).not.toBeInTheDocument();
    const presentations = getCombatActionPresentations(
      TELLURIC_ECHO_ENCOUNTER,
      createCombatEncounterState(TELLURIC_ECHO_ENCOUNTER),
      store.getState().player.permanentTraits
    );
    expect(presentations.some(action => action.id === 'trace_pattern')).toBe(false);
  });

  test('defeat emits no kill consequence and leaves the Quest in progress', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    await startM17Quest(store);

    renderActiveCombat(store);
    fireEvent.click(await screen.findByRole('button', { name: 'Begin Encounter' }));

    for (let index = 0; index < 35; index += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'Guard' }));
    }

    expect(await screen.findByRole('button', { name: 'Retry Encounter' })).toBeInTheDocument();
    expect(store.getState().quest.quests[M17_QUEST_ID].status).toBe('IN_PROGRESS');
    expect(store.getState().quest.quests[M17_QUEST_ID].objectives[0].currentCount).toBe(0);
  });

  test('victory is reported once and terminal encounter state rejects replay', () => {
    const onTargetKilled = jest.fn();
    render(
      <CombatEncounterPanel
        definition={TELLURIC_ECHO_ENCOUNTER}
        permanentTraitIds={[]}
        onTargetKilled={onTargetKilled}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Begin Encounter' }));
    for (const action of ['Strike', 'Guard', 'Strike', 'Strike', 'Guard', 'Strike']) {
      fireEvent.click(screen.getByRole('button', { name: action }));
    }
    expect(onTargetKilled).toHaveBeenCalledTimes(1);
    expect(onTargetKilled).toHaveBeenCalledWith(M17_TARGET_ID);

    const victory = runEngineActions(
      ['strike', 'guard', 'strike', 'strike', 'guard', 'strike'],
      []
    );
    const replay = performCombatAction(
      TELLURIC_ECHO_ENCOUNTER,
      victory,
      'strike',
      []
    );
    expect(replay.ok).toBe(false);
    expect(replay.state).toEqual(victory);
  });
});