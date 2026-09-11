import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../app/store';
import { markRoutineFamiliarity } from '../Player/state/PlayerSlice';
import { assignCopyRole } from './state/CopySlice';
import {
  getFirstEligiblePreferredProductionTask,
  normalizeCopyRoutinePriority,
} from './CopyRoutineStrategy';
import {
  setCopyRoutinePriorityThunk,
  startPreferredCopyProductionTaskThunk,
} from './state/CopyStrategyThunks';

const makeStore = () => configureStore({ reducer: rootReducer });

describe('post-M25 Copy routine strategy', () => {
  test('priority is a bounded ordered allowlist of authored production routines', () => {
    expect(normalizeCopyRoutinePriority([
      'unknown_runtime_task',
      'resonance_calibration',
      'forge_assistance',
      'resonance_calibration',
    ])).toEqual([
      'resonance_calibration',
      'forge_assistance',
    ]);
  });

  test('Start Preferred chooses the first currently eligible player-approved routine through M20 authority', async () => {
    const store = makeStore();
    store.dispatch(assignCopyRole({ copyId: 'copy-001', role: 'agent' }));
    store.dispatch(markRoutineFamiliarity({
      routineId: 'forge_assistance',
      source: 'city_center_forge_assistance',
      learnedAt: 1,
    }));
    store.dispatch(markRoutineFamiliarity({
      routineId: 'resonance_calibration',
      source: 'trait_resonance',
      learnedAt: 2,
    }));

    const updated = await store.dispatch(setCopyRoutinePriorityThunk({
      copyId: 'copy-001',
      taskIds: [
        'not_authored',
        'resonance_calibration',
        'forge_assistance',
        'resonance_calibration',
      ],
    }));
    expect(setCopyRoutinePriorityThunk.fulfilled.match(updated)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].routinePriority).toEqual([
      'resonance_calibration',
      'forge_assistance',
    ]);

    expect(getFirstEligiblePreferredProductionTask(
      store.getState().copy.copies['copy-001'],
      store.getState().player.routineFamiliarity ?? {}
    )).toBe('resonance_calibration');

    const started = await store.dispatch(startPreferredCopyProductionTaskThunk('copy-001'));
    expect(startPreferredCopyProductionTaskThunk.fulfilled.match(started)).toBe(true);
    expect(store.getState().copy.copies['copy-001'].activeTask).toMatchObject({
      productionTaskId: 'resonance_calibration',
      status: 'running',
    });
  });

  test('the one-active-task invariant still rejects another preferred start', async () => {
    const store = makeStore();
    store.dispatch(assignCopyRole({ copyId: 'copy-001', role: 'agent' }));
    store.dispatch(markRoutineFamiliarity({
      routineId: 'resonance_calibration',
      source: 'trait_resonance',
      learnedAt: 2,
    }));
    await store.dispatch(setCopyRoutinePriorityThunk({
      copyId: 'copy-001',
      taskIds: ['resonance_calibration'],
    }));

    const first = await store.dispatch(startPreferredCopyProductionTaskThunk('copy-001'));
    expect(startPreferredCopyProductionTaskThunk.fulfilled.match(first)).toBe(true);

    const second = await store.dispatch(startPreferredCopyProductionTaskThunk('copy-001'));
    expect(startPreferredCopyProductionTaskThunk.rejected.match(second)).toBe(true);
  });

  test('strategy code cannot invent tasks or automatically chain irreversible work', () => {
    const strategySource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Copy/CopyRoutineStrategy.ts'),
      'utf8'
    );
    const thunkSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Copy/state/CopyStrategyThunks.ts'),
      'utf8'
    );

    expect(strategySource).toContain('COPY_PRODUCTION_TASKS');
    expect(thunkSource).toContain('startCopyProductionTaskThunk');
    expect(thunkSource).not.toContain('processCopyTasksThunk');
    expect(thunkSource).not.toMatch(/dialogue|faction|world.?state|quest|combat/i);
  });
});
