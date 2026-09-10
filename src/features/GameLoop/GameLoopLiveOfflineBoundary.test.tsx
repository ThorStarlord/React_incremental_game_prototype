import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { processPassiveGenerationThunk, processResonanceLevelThunk } from '../Essence/state/EssenceThunks';
import { updateGenerationRate } from '../Essence/state/EssenceSlice';
import {
  processCopyGrowthThunk,
  processCopyLoyaltyDecayThunk,
  processCopyTasksThunk,
  startCopyProductionTaskThunk,
} from '../Copy/state/CopyThunks';
import { updateCopy } from '../Copy/state/CopySlice';
import { CITY_CENTER_LOCATION_ID } from '../Exploration/LocationDefinitions';
import {
  processStatusEffectsThunk,
  recalculateStatsThunk,
  regenerateVitalsThunk,
} from '../Player/state/PlayerThunks';
import {
  markRoutineFamiliarity,
  updateHealth,
  updateMana,
} from '../Player/state/PlayerSlice';
import { processQuestTimersThunk } from '../Quest/state/QuestThunks';
import { addQuest } from '../Quest/state/QuestSlice';
import type { Quest } from '../Quest/state/QuestTypes';
import { useGameLoop } from './hooks/useGameLoop';
import {
  pauseGame,
  setTickRate,
  stopGame,
} from './state/GameLoopSlice';
import type { TickData } from './state/GameLoopTypes';
import { settleOfflineProgressThunk } from './state/OfflineProgress';

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

class RafHarness {
  private now: number;
  private nextId = 1;
  private callbacks = new Map<number, FrameRequestCallback>();
  private originalRequestAnimationFrame = globalThis.requestAnimationFrame;
  private originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
  private performanceNowSpy: jest.SpyInstance | null = null;

  constructor(initialNow: number) {
    this.now = initialNow;
  }

  install() {
    this.performanceNowSpy = jest
      .spyOn(globalThis.performance, 'now')
      .mockImplementation(() => this.now);

    globalThis.requestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
      const id = this.nextId++;
      this.callbacks.set(id, callback);
      return id;
    });

    globalThis.cancelAnimationFrame = jest.fn((id: number) => {
      this.callbacks.delete(id);
    });
  }

  frame(timestamp: number) {
    this.now = timestamp;
    const next = Array.from(this.callbacks.entries()).sort(([a], [b]) => a - b)[0];
    if (!next) {
      throw new Error(`No requestAnimationFrame callback scheduled at t=${timestamp}`);
    }

    const [id, callback] = next;
    this.callbacks.delete(id);
    callback(timestamp);
  }

  restore() {
    this.performanceNowSpy?.mockRestore();
    globalThis.requestAnimationFrame = this.originalRequestAnimationFrame;
    globalThis.cancelAnimationFrame = this.originalCancelAnimationFrame;
    this.callbacks.clear();
  }
}

const BOUNDARY_QUEST_ID = 'package3_live_offline_boundary_probe';

const seedBoundaryState = async (store: TestStore) => {
  store.dispatch(setTickRate(10));
  store.dispatch(updateGenerationRate(2));
  store.dispatch(updateHealth(50));
  store.dispatch(updateMana(10));
  store.dispatch(markRoutineFamiliarity({
    routineId: 'forge_assistance',
    source: 'city_center_forge_assistance',
    learnedAt: 1,
  }));
  store.dispatch(updateCopy({
    copyId: 'copy-001',
    updates: {
      role: 'agent',
      maturity: 90,
      loyalty: 90,
      location: CITY_CENTER_LOCATION_ID,
      activeTask: null,
    },
  }));

  await store.dispatch(
    startCopyProductionTaskThunk({ copyId: 'copy-001', taskId: 'forge_assistance' })
  ).unwrap();

  const timedQuest: Quest = {
    id: BOUNDARY_QUEST_ID,
    title: 'Package 3 live/offline boundary probe',
    description: 'Hermetic persistence-boundary timer probe only.',
    giver: 'npc-package3-probe',
    type: 'SIDE',
    objectives: [],
    prerequisites: [],
    rewards: [],
    status: 'IN_PROGRESS',
    isAutoComplete: false,
    timeLimitSeconds: 1_000_000,
    elapsedSeconds: 0,
    startedAt: 1,
  };
  store.dispatch(addQuest(timedQuest));
};

const runOnlineProgressionTick = async (store: TestStore, tickData: TickData) => {
  await store.dispatch(processPassiveGenerationThunk(tickData.deltaTime));
  await store.dispatch(processCopyGrowthThunk(tickData.deltaTime));
  await store.dispatch(processCopyLoyaltyDecayThunk(tickData.deltaTime));
  await store.dispatch(processCopyTasksThunk(tickData.deltaTime));
  store.dispatch(processResonanceLevelThunk());
  await store.dispatch(processStatusEffectsThunk());
  await store.dispatch(regenerateVitalsThunk(tickData.deltaTime));
  store.dispatch(recalculateStatsThunk());
  await store.dispatch(processQuestTimersThunk(tickData.deltaTime));
};

const runLiveWindow = async (
  store: TestStore,
  initialNow: number,
  frameTimestamps: number[],
  expectedTicks: number
) => {
  const raf = new RafHarness(initialNow);
  raf.install();
  let completedTicks = 0;

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  const { unmount } = renderHook(
    () => useGameLoop({
      onTick: async tickData => {
        await runOnlineProgressionTick(store, tickData);
        completedTicks += 1;
      },
    }),
    { wrapper }
  );

  try {
    act(() => {
      frameTimestamps.forEach(timestamp => raf.frame(timestamp));
    });
    await waitFor(() => expect(completedTicks).toBe(expectedTicks));
  } finally {
    unmount();
    raf.restore();
  }
};

const snapshotBoundary = (store: TestStore) => {
  const state = store.getState();
  const copy = state.copy.copies['copy-001'];
  const quest = state.quest.quests[BOUNDARY_QUEST_ID];

  return {
    isRunning: state.gameLoop.isRunning,
    isPaused: state.gameLoop.isPaused,
    currentTick: state.gameLoop.currentTick,
    totalGameTime: state.gameLoop.totalGameTime,
    lastOfflineSettlementSourceTimestamp: state.gameLoop.lastOfflineSettlementSourceTimestamp,
    essence: state.essence.currentEssence,
    totalEssenceCollected: state.essence.totalCollected,
    copyMaturity: copy.maturity,
    copyLoyalty: copy.loyalty,
    copyTaskProgressSeconds: copy.activeTask?.progressSeconds ?? null,
    playerHealth: state.player.stats.health,
    playerMana: state.player.stats.mana,
    healthRegen: state.player.stats.healthRegen,
    manaRegen: state.player.stats.manaRegen,
    questElapsedSeconds: quest.elapsedSeconds ?? 0,
    questStatus: quest.status,
    playerGold: state.player.gold,
  };
};

const saveAndLoad = async (store: TestStore, savedTimestamp: number) => {
  const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(savedTimestamp);
  const saveId = createSave(store.getState(), 'Package 3 boundary save');
  nowSpy.mockRestore();

  expect(saveId).toBe(`save_${savedTimestamp}`);
  const loaded = await loadSavedGameWithMigration(saveId!);
  expect(loaded).not.toBeNull();
  expect(loaded!.envelope.timestamp).toBe(savedTimestamp);

  const restoredStore = makeStore();
  restoredStore.dispatch(replaceState(loaded!.state));
  return restoredStore;
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});

describe('Package 3 live/persistence/offline progression boundary qualification', () => {
  test('live -> save -> offline settlement -> replay rejection -> resumed live preserves timing authorities', async () => {
    const store = makeStore();
    await seedBoundaryState(store);

    await runLiveWindow(
      store,
      0,
      [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
      10
    );

    const afterLive = snapshotBoundary(store);
    expect(afterLive.currentTick).toBe(10);
    expect(afterLive.totalGameTime).toBeCloseTo(1000, 8);
    expect(afterLive.essence).toBeCloseTo(2, 8);
    expect(afterLive.copyTaskProgressSeconds).toBeCloseTo(1, 8);

    const savedTimestamp = 100_000;
    const resumeTimestamp = 120_000;
    const restoredStore = await saveAndLoad(store, savedTimestamp);
    const restored = snapshotBoundary(restoredStore);

    expect(restored).toEqual(afterLive);

    const settlement = await restoredStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp, resumeTimestamp })
    ).unwrap();
    const afterOffline = snapshotBoundary(restoredStore);

    expect(settlement.skipReason).toBeUndefined();
    expect(settlement.elapsedMs).toBe(20_000);
    expect(settlement.essenceGenerated).toBeCloseTo(40, 8);
    expect(afterOffline.essence).toBeCloseTo(restored.essence + 40, 8);
    expect(afterOffline.totalEssenceCollected).toBeCloseTo(restored.totalEssenceCollected + 40, 8);
    expect(afterOffline.copyTaskProgressSeconds).toBeCloseTo(
      (restored.copyTaskProgressSeconds as number) + 20,
      8
    );
    expect(afterOffline.lastOfflineSettlementSourceTimestamp).toBe(savedTimestamp);

    // M21 absence is snapshot settlement, not ordinary live GameLoop replay.
    expect(afterOffline.currentTick).toBe(restored.currentTick);
    expect(afterOffline.totalGameTime).toBe(restored.totalGameTime);
    expect(afterOffline.copyMaturity).toBeCloseTo(restored.copyMaturity, 8);
    expect(afterOffline.copyLoyalty).toBeCloseTo(restored.copyLoyalty, 8);
    expect(afterOffline.playerHealth).toBeCloseTo(restored.playerHealth, 8);
    expect(afterOffline.playerMana).toBeCloseTo(restored.playerMana, 8);
    expect(afterOffline.questElapsedSeconds).toBeCloseTo(restored.questElapsedSeconds, 8);
    expect(afterOffline.questStatus).toBe(restored.questStatus);

    const replay = await restoredStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp, resumeTimestamp: 130_000 })
    ).unwrap();
    const afterReplay = snapshotBoundary(restoredStore);

    expect(replay.skipReason).toBe('already_settled');
    expect(replay.elapsedMs).toBe(0);
    expect(afterReplay).toEqual(afterOffline);

    // Mounting the live scheduler after a 20s wall-clock absence re-anchors to
    // performance.now(). The first frame is one 100ms step, not a 20s replay.
    await runLiveWindow(restoredStore, resumeTimestamp, [resumeTimestamp + 100], 1);
    const afterResume = snapshotBoundary(restoredStore);

    expect(afterResume.currentTick).toBe(afterOffline.currentTick + 1);
    expect(afterResume.totalGameTime).toBeCloseTo(afterOffline.totalGameTime + 100, 8);
    expect(afterResume.essence).toBeCloseTo(afterOffline.essence + 0.2, 8);
    expect(afterResume.copyTaskProgressSeconds).toBeCloseTo(
      (afterOffline.copyTaskProgressSeconds as number) + 0.1,
      8
    );
    expect(afterResume.playerHealth).toBeCloseTo(
      afterOffline.playerHealth + afterOffline.healthRegen * 0.1,
      8
    );
    expect(afterResume.playerMana).toBeCloseTo(
      afterOffline.playerMana + afterOffline.manaRegen * 0.1,
      8
    );
    expect(afterResume.questElapsedSeconds).toBeGreaterThan(afterOffline.questElapsedSeconds);
    expect(afterResume.questElapsedSeconds).toBeLessThan(afterOffline.questElapsedSeconds + 1000);
    expect(afterResume.lastOfflineSettlementSourceTimestamp).toBe(savedTimestamp);
  });

  test('offline Copy completion across canonical save/load pays its authored reward exactly once', async () => {
    const store = makeStore();
    await seedBoundaryState(store);

    store.dispatch(updateGenerationRate(0));
    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: {
        activeTask: {
          ...store.getState().copy.copies['copy-001'].activeTask!,
          progressSeconds: 55,
        },
      },
    }));

    const savedTimestamp = 300_000;
    const restoredStore = await saveAndLoad(store, savedTimestamp);
    const goldBefore = restoredStore.getState().player.gold;

    const settlement = await restoredStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp, resumeTimestamp: 310_000 })
    ).unwrap();

    expect(settlement.skipReason).toBeUndefined();
    expect(settlement.tasks).toEqual([
      expect.objectContaining({
        productionTaskId: 'forge_assistance',
        completed: true,
        progressPercent: 100,
      }),
    ]);
    expect(restoredStore.getState().player.gold).toBe(goldBefore + 15);
    expect(restoredStore.getState().copy.copies['copy-001'].activeTask).toBeNull();

    const replay = await restoredStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp, resumeTimestamp: 320_000 })
    ).unwrap();
    expect(replay.skipReason).toBe('already_settled');
    expect(restoredStore.getState().player.gold).toBe(goldBefore + 15);
    expect(restoredStore.getState().copy.copies['copy-001'].activeTask).toBeNull();
  });

  test.each([
    ['paused', (store: TestStore) => { store.dispatch(pauseGame()); }, 'game_paused'],
    ['stopped', (store: TestStore) => { store.dispatch(stopGame()); }, 'game_not_running'],
  ] as const)('canonical %s save rejects offline progression after restore', async (_label, changeLoopState, expectedReason) => {
    const store = makeStore();
    await seedBoundaryState(store);
    changeLoopState(store);

    const savedTimestamp = 400_000;
    const restoredStore = await saveAndLoad(store, savedTimestamp);
    const before = snapshotBoundary(restoredStore);

    const result = await restoredStore.dispatch(
      settleOfflineProgressThunk({ savedTimestamp, resumeTimestamp: 420_000 })
    ).unwrap();
    const after = snapshotBoundary(restoredStore);

    expect(result.skipReason).toBe(expectedReason);
    expect(result.elapsedMs).toBe(0);
    expect(after).toEqual(before);
    expect(after.lastOfflineSettlementSourceTimestamp).toBeNull();
  });
});
