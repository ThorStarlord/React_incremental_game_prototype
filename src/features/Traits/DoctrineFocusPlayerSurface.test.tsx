import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rootReducer } from '../../app/store';
import TraitsPage from '../../pages/TraitsPage';
import NPCQuestsTab from '../NPCs/components/ui/tabs/NPCQuestsTab';
import { PlayerInsightPanel } from '../Story/components/PlayerInsightPanel';
import { addPermanentTrait } from '../Player/state/PlayerSlice';
import { setNPCs } from '../NPCs/state/NPCSlice';
import { addQuest } from '../Quest/state/QuestSlice';
import { loadTraits } from './state/TraitsSlice';
import { selectActiveDoctrineIds } from './state/DoctrineSelectors';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const traits = readJson('public/data/traits.json');
const npcs = readJson('public/data/npcs.json');
const quests = readJson('public/data/quests.json');

const cloneJson = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

const STRUCTURAL_TRAITS = ['WillowsWisdom', 'ConstraintSense'] as const;
const COUNTERMODELER_TRAITS = [
  'ScholarlyInsight',
  'AdversarialCalibration',
] as const;
const GC06_QUEST_ID = 'quest_gc06_lattice_under_strain';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/traits.json') {
      return {
        ok: true,
        statusText: 'OK',
        json: async () => cloneJson(traits),
      } as any;
    }
    return {
      ok: false,
      statusText: `Unexpected test URL: ${url}`,
      json: async () => ({}),
    } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

const seedDefinitions = (store: TestStore) => {
  store.dispatch(loadTraits(cloneJson(traits)));
  store.dispatch(setNPCs(cloneJson(npcs)));
};

const learn = (store: TestStore, traitIds: readonly string[]) => {
  traitIds.forEach(traitId => store.dispatch(addPermanentTrait(traitId)));
};

const renderTraitsPage = (store: TestStore) =>
  render(
    <Provider store={store}>
      <TraitsPage />
    </Provider>
  );

const openDoctrineTab = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(await screen.findByRole('tab', { name: 'Doctrine' }));
  return screen.getByTestId('doctrine-focus-panel');
};

const seedReadyGc06Quest = (store: TestStore) => {
  const elara = cloneJson(npcs.npc_scholar_elara);
  elara.availableQuests = Array.from(
    new Set([...(elara.availableQuests ?? []), GC06_QUEST_ID])
  );
  store.dispatch(setNPCs({
    ...cloneJson(npcs),
    npc_scholar_elara: elara,
  }));

  store.dispatch(addQuest({
    ...cloneJson(quests[GC06_QUEST_ID]),
    status: 'READY_TO_COMPLETE',
  }));
};

describe('Doctrine Focus player surface', () => {
  test('hides future doctrines, then supports adopt/switch/clear with learned-Trait provenance', async () => {
    const store = makeStore();
    const user = userEvent.setup();
    seedDefinitions(store);
    renderTraitsPage(store);

    const panel = await openDoctrineTab(user);

    expect(within(panel).queryByText('Structural Steward')).not.toBeInTheDocument();
    expect(within(panel).queryByText('Countermodeler')).not.toBeInTheDocument();
    expect(within(panel).getByText(/No doctrine is available yet/i)).toBeInTheDocument();

    act(() => learn(store, STRUCTURAL_TRAITS));

    expect(await within(panel).findByText('Structural Steward')).toBeInTheDocument();
    expect(within(panel).queryByText('Countermodeler')).not.toBeInTheDocument();
    expect(
      within(panel).getByText(/Willow's Wisdom .* learned with Elder Willow/i)
    ).toBeInTheDocument();
    expect(
      within(panel).getByText(/Constraint Sense .* learned with .*Gronk/i)
    ).toBeInTheDocument();

    act(() => learn(store, COUNTERMODELER_TRAITS));
    expect(await within(panel).findByText('Countermodeler')).toBeInTheDocument();

    await user.click(
      within(panel).getByRole('button', { name: 'Adopt Structural Steward' })
    );
    await waitFor(() =>
      expect(selectActiveDoctrineIds(store.getState())).toEqual([
        'structural_steward',
      ])
    );
    expect(
      within(panel).getByTestId('active-doctrine-structural_steward')
    ).toBeInTheDocument();

    await user.click(
      within(panel).getByRole('button', { name: 'Switch to Countermodeler' })
    );
    await waitFor(() =>
      expect(selectActiveDoctrineIds(store.getState())).toEqual(['countermodeler'])
    );
    expect(
      within(panel).getByTestId('active-doctrine-countermodeler')
    ).toBeInTheDocument();

    await user.click(
      within(panel).getByRole('button', { name: 'Clear doctrine focus' })
    );
    await waitFor(() =>
      expect(selectActiveDoctrineIds(store.getState())).toEqual([])
    );
    expect(
      within(panel).getByText(/No active doctrine/i)
    ).toBeInTheDocument();
  });

  test('a normal Traits -> Player Insight -> GC06 flow makes specialization legible and changes the available synthesis', async () => {
    const store = makeStore();
    const user = userEvent.setup();
    seedDefinitions(store);
    learn(store, [...STRUCTURAL_TRAITS, ...COUNTERMODELER_TRAITS]);
    seedReadyGc06Quest(store);

    renderTraitsPage(store);
    let panel = await openDoctrineTab(user);
    await user.click(
      within(panel).getByRole('button', { name: 'Adopt Structural Steward' })
    );
    await waitFor(() =>
      expect(selectActiveDoctrineIds(store.getState())).toEqual([
        'structural_steward',
      ])
    );

    cleanup();
    render(
      <Provider store={store}>
        <PlayerInsightPanel />
      </Provider>
    );
    expect(
      within(screen.getByTestId('player-insight-active-doctrine'))
        .getByText('Structural Steward')
    ).toBeInTheDocument();

    cleanup();
    render(
      <Provider store={store}>
        <NPCQuestsTab npcId="npc_scholar_elara" />
      </Provider>
    );
    await user.click(screen.getByText('Lattice Under Strain'));
    expect(screen.getByText('Reroute the Lattice Load')).toBeInTheDocument();
    expect(screen.queryByText('Phase Against the Echo')).not.toBeInTheDocument();
    expect(
      screen.getByText('Active doctrine: Structural Steward')
    ).toBeInTheDocument();

    cleanup();
    renderTraitsPage(store);
    panel = await openDoctrineTab(user);
    await user.click(
      within(panel).getByRole('button', { name: 'Switch to Countermodeler' })
    );
    await waitFor(() =>
      expect(selectActiveDoctrineIds(store.getState())).toEqual(['countermodeler'])
    );

    cleanup();
    render(
      <Provider store={store}>
        <NPCQuestsTab npcId="npc_scholar_elara" />
      </Provider>
    );
    await user.click(screen.getByText('Lattice Under Strain'));
    expect(screen.queryByText('Reroute the Lattice Load')).not.toBeInTheDocument();
    expect(screen.getByText('Phase Against the Echo')).toBeInTheDocument();
    expect(
      screen.getByText('Active doctrine: Countermodeler')
    ).toBeInTheDocument();
  });
});
