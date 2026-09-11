import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, type RootState } from '../../app/store';
import {
  evaluateCopyPortfolioPlan,
  startCopyPortfolioThunk,
} from './state/CopyPortfolioThunks';
import {
  selectCopyPortfolioRows,
  selectCopyPortfolioSummary,
} from './state/CopyPortfolioSelectors';

const makeEligibleState = (): RootState => {
  const state = rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);
  state.copy.copies['copy-001'].role = 'guardian';
  state.copy.copies['copy-001'].location = 'City Center';
  state.copy.copies['copy-001'].activeTask = null;
  state.copy.copies['copy-002'].role = 'researcher';
  state.copy.copies['copy-002'].activeTask = null;
  (state.player.routineFamiliarity as any) = {
    forge_assistance: { source: 'player_action', learnedAt: 1 },
    resonance_calibration: { source: 'trait_resonance', learnedAt: 2 },
  };
  return state;
};

const makeStore = (state = makeEligibleState()) => configureStore({
  reducer: rootReducer,
  preloadedState: state,
});

describe('post-M25 Copy portfolio strategy qualification', () => {
  test('whole-plan preflight rejects duplicate Copy allocation and unknown tasks', () => {
    const state = makeEligibleState();
    const result = evaluateCopyPortfolioPlan(state, [
      { copyId: 'copy-001', taskId: 'forge_assistance' },
      { copyId: 'copy-001', taskId: 'resonance_calibration' },
      { copyId: 'copy-002', taskId: 'not_authored' },
    ]);

    expect(result.eligible).toBe(false);
    expect(result.issues.map(issue => issue.reason)).toEqual(expect.arrayContaining([
      'A Copy can receive only one task in a portfolio plan.',
      'Unknown production task.',
    ]));
  });

  test('invalid portfolio produces no partial assignments', async () => {
    const state = makeEligibleState();
    state.copy.copies['copy-001'].activeTask = {
      id: 'already_running',
      type: 'timed',
      productionTaskId: 'forge_assistance',
      durationSeconds: 60,
      progressSeconds: 5,
      status: 'running',
    };
    const store = makeStore(state);

    const result = await store.dispatch(startCopyPortfolioThunk({ assignments: [
      { copyId: 'copy-001', taskId: 'forge_assistance' },
      { copyId: 'copy-002', taskId: 'resonance_calibration' },
    ] }));

    expect(startCopyPortfolioThunk.rejected.match(result)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask?.id).toBe('already_running');
    expect(store.getState().copy.copies['copy-002'].activeTask).toBeNull();
  });

  test('one player-authored portfolio starts two allowlisted tasks while preserving one task per Copy', async () => {
    const store = makeStore();

    const result = await store.dispatch(startCopyPortfolioThunk({ assignments: [
      { copyId: 'copy-001', taskId: 'forge_assistance' },
      { copyId: 'copy-002', taskId: 'resonance_calibration' },
    ] }));

    expect(startCopyPortfolioThunk.fulfilled.match(result)).toBe(true);
    const first = store.getState().copy.copies['copy-001'].activeTask;
    const second = store.getState().copy.copies['copy-002'].activeTask;
    expect(first?.status).toBe('running');
    expect(first?.productionTaskId).toBe('forge_assistance');
    expect(second?.status).toBe('running');
    expect(second?.productionTaskId).toBe('resonance_calibration');
    expect(first?.data?.portfolioAssignment).toBe(true);
    expect(second?.data?.portfolioAssignment).toBe(true);
    expect(first?.startedAt).toBe(second?.startedAt);
  });

  test('portfolio selectors expose capacity and eligibility without recommending a task', () => {
    const state = makeEligibleState();
    const summary = selectCopyPortfolioSummary(state);
    const rows = selectCopyPortfolioRows(state);

    expect(summary.totalCopies).toBe(2);
    expect(summary.runningCopies).toBe(0);
    expect(summary.availableCopies).toBe(2);
    expect(rows.find(row => row.copyId === 'copy-001')?.taskOptions)
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ taskId: 'forge_assistance', eligible: true }),
      ]));
    expect(rows.find(row => row.copyId === 'copy-002')?.taskOptions)
      .toEqual(expect.arrayContaining([
        expect.objectContaining({ taskId: 'resonance_calibration', eligible: true }),
      ]));
    expect(rows.every(row => !(row as any).recommendedTaskId)).toBe(true);
  });

  test('portfolio UI preserves explicit player choice and is mounted on Copy Management', () => {
    const panelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Copy/components/ui/CopyPortfolioPanel.tsx'),
      'utf8'
    );
    const pageSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/CopiesPage.tsx'),
      'utf8'
    );

    expect(panelSource).toContain('You choose every assignment');
    expect(panelSource).toContain('Start selected portfolio');
    expect(panelSource).not.toContain('recommendedTaskId');
    expect(pageSource).toContain('<CopyPortfolioPanel />');
  });
});