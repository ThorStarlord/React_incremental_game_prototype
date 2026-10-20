import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { replaceState, rootReducer, type RootState } from '../../app/store';
import { gameEventListeners } from '../../app/listeners/GameEventListeners';
import { knowledgeListeners } from '../Knowledge/state/KnowledgeListeners';
import { npcListeners } from '../NPCs/state/NPCListeners';
import { copyListeners } from '../Copy/state/CopyListeners';
import { initializeNPCsThunk, newGameSeedNPCsThunk } from '../NPCs/state/NPCThunks';
import { setSelectedNPCId } from '../NPCs/state/NPCSlice';
import { initializeQuestsThunk, startQuestThunk } from '../Quest/state/QuestThunks';
import { resetQuestState } from '../Quest/state/QuestSlice';
import { fetchTraitsThunk } from '../Traits/state/TraitThunks';
import { resetTraitsState } from '../Traits/state/TraitsSlice';
import { resetPlayerState } from '../Player/state/PlayerSlice';
import { resetEssence } from '../Essence/state/EssenceSlice';
import { resetInventory } from '../Inventory/state/InventorySlice';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';

/**
 * Release regression (SYNTHETIC_FINDING, 2026-10-20 RC qualification): the App
 * startup catalog loads run concurrently with the main menu. A New Game or Load
 * that lands before they finish must not be overwritten by their late results.
 */

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const publicJson: Record<string, any> = {};
const manifest = readJson('public/data/relationships/index.json');
for (const url of [
  '/data/npcs.json',
  '/data/dialogues.json',
  '/data/quests.json',
  '/data/traits.json',
  '/data/relationships/index.json',
  '/data/m24-world-state-content.json',
  '/data/m25-chapter-content.json',
  '/data/gc06-lattice-content.json',
  '/data/gc07-chrono-crypt-content.json',
  '/data/gc08-network-content.json',
  '/data/gc09-counterphase-content.json',
  '/data/gc10-finale-content.json',
  ...manifest.bundles,
]) {
  publicJson[url] = readJson(`public${url}`);
}

const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).prepend(
      knowledgeListeners.middleware,
      npcListeners.middleware,
      copyListeners.middleware,
      gameEventListeners.middleware
    ),
});
type TestStore = ReturnType<typeof makeStore>;

const originalFetch = global.fetch;
let holdFetches = false;
let releaseHeld: () => void = () => undefined;
let held: Promise<void> = Promise.resolve();

beforeEach(() => {
  localStorage.clear();
  holdFetches = false;
  held = new Promise<void>(resolve => { releaseHeld = resolve; });
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (holdFetches) await held;
    if (!publicJson[url]) {
      return { ok: false, statusText: `Unexpected URL ${url}`, json: async () => ({}) } as any;
    }
    return { ok: true, json: async () => JSON.parse(JSON.stringify(publicJson[url])) } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  global.fetch = originalFetch;
  localStorage.clear();
});

// Mirrors App.tsx startup dispatches.
const dispatchHeldStartup = (store: TestStore) => {
  holdFetches = true;
  const pending = Promise.all([
    store.dispatch(fetchTraitsThunk()),
    store.dispatch(initializeNPCsThunk()),
    store.dispatch(initializeQuestsThunk({ preserveExisting: true })),
  ]);
  holdFetches = false;
  return pending;
};

// Mirrors useGameActions.handleNewGame.
const productionNewGame = async (store: TestStore) => {
  store.dispatch(resetPlayerState());
  store.dispatch(resetEssence());
  store.dispatch(resetInventory());
  store.dispatch(resetQuestState());
  store.dispatch(resetTraitsState());
  store.dispatch(setSelectedNPCId(null));
  store.dispatch(setHasSeenIntro(false));
  await store.dispatch(initializeQuestsThunk()).unwrap();
  await store.dispatch(newGameSeedNPCsThunk()).unwrap();
};

describe('startup catalog load vs. New Game / Load race', () => {
  test('App startup uses the non-destructive quest load', () => {
    const app = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf8');
    expect(app).toContain('initializeQuestsThunk({ preserveExisting: true })');
  });

  test('a New Game started before startup loading finishes stays Willow-only', async () => {
    const store = makeStore();
    const startup = dispatchHeldStartup(store);

    await productionNewGame(store);
    expect(Object.keys(store.getState().npcs.npcs)).toEqual(['npc_elder_willow']);
    await store.dispatch(startQuestThunk('quest_silas_retrieve_item'));
    const startedStatus = store.getState().quest.quests.quest_silas_retrieve_item.status;
    expect(startedStatus).not.toBe('NOT_STARTED');

    releaseHeld();
    await startup;

    expect(Object.keys(store.getState().npcs.npcs)).toEqual(['npc_elder_willow']);
    expect(store.getState().quest.quests.quest_silas_retrieve_item.status).toBe(startedStatus);
    // Content that only the startup load provides still arrives.
    expect(Object.keys(store.getState().npcs.dialogueNodes ?? {}).length).toBeGreaterThan(0);
  });

  test('a save loaded before startup loading finishes keeps its NPC and quest progress', async () => {
    const source = makeStore();
    await productionNewGame(source);
    await source.dispatch(startQuestThunk('quest_silas_retrieve_item'));
    const snapshot: RootState = JSON.parse(JSON.stringify(source.getState()));
    const savedStatus = snapshot.quest.quests.quest_silas_retrieve_item.status;
    expect(savedStatus).not.toBe('NOT_STARTED');

    const store = makeStore();
    const startup = dispatchHeldStartup(store);
    store.dispatch(replaceState(snapshot));

    releaseHeld();
    await startup;

    expect(Object.keys(store.getState().npcs.npcs)).toEqual(Object.keys(snapshot.npcs.npcs));
    expect(store.getState().quest.quests.quest_silas_retrieve_item.status).toBe(savedStatus);
  });

  test('without a session, startup still populates the catalogs', async () => {
    const store = makeStore();
    await Promise.all([
      store.dispatch(initializeNPCsThunk()),
      store.dispatch(initializeQuestsThunk({ preserveExisting: true })),
    ]);
    expect(Object.keys(store.getState().npcs.npcs).length).toBeGreaterThan(1);
    expect(store.getState().quest.quests.quest_silas_retrieve_item.status).toBe('NOT_STARTED');
  });
});
