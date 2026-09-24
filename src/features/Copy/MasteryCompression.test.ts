import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../app/store';
import { markRoutineFamiliarity } from '../Player/state/PlayerSlice';
import {
  recordCopyException,
  updateCopy,
} from './state/CopySlice';
import {
  deriveMasteryCompressionOverview,
  formatMasteryCompressionEpilogue,
  getCopyExceptionBoundaryDefinition,
} from './MasteryCompression';

const makeStore = () => configureStore({ reducer: rootReducer });

describe('Mastery Compression derived progression', () => {
  test('separate mastered routines generalize into Network Assurance only when both evidence sources exist', () => {
    const store = makeStore();

    store.dispatch(markRoutineFamiliarity({
      routineId: 'archive_verification',
      source: 'elara_independent_verification',
      learnedAt: 100,
    }));

    let overview = deriveMasteryCompressionOverview(store.getState());
    expect(overview.procedureFamilies[0]).toMatchObject({
      id: 'network_assurance',
      status: 'developing',
      masteredRoutineIds: ['archive_verification'],
      missingRoutineIds: ['resonance_calibration'],
    });
    expect(overview.operationalDomain.status).toBe('developing');

    store.dispatch(markRoutineFamiliarity({
      routineId: 'resonance_calibration',
      source: 'trait_resonance',
      learnedAt: 200,
    }));

    overview = deriveMasteryCompressionOverview(store.getState());
    expect(overview.procedureFamilies[0].status).toBe('mastered');
    expect(overview.operationalDomain.status).toBe('developing');

    store.dispatch(markRoutineFamiliarity({
      routineId: 'forge_assistance',
      source: 'city_center_forge_assistance',
      learnedAt: 300,
    }));

    overview = deriveMasteryCompressionOverview(store.getState());
    expect(overview.operationalDomain.status).toBe('ready');
    expect(overview.operationalDomain.reasons).toContain(
      'The player has enough personal mastery for known-state stewardship, but no authored Archive standing responsibility is active.'
    );
  });

  test('an authored standing responsibility raises the organization to operating without creating a new authority slice', () => {
    const store = makeStore();
    for (const familiarity of [
      {
        routineId: 'archive_verification' as const,
        source: 'elara_independent_verification' as const,
        learnedAt: 100,
      },
      {
        routineId: 'resonance_calibration' as const,
        source: 'trait_resonance' as const,
        learnedAt: 200,
      },
      {
        routineId: 'forge_assistance' as const,
        source: 'city_center_forge_assistance' as const,
        learnedAt: 300,
      },
    ]) {
      store.dispatch(markRoutineFamiliarity(familiarity));
    }

    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: {
        standingOrders: {
          archive_verification: {
            enabled: true,
            condition: {
              type: 'archive_verification_backlog',
              targetPending: 0,
            },
            enabledAtTick: 10,
          },
        },
      },
    }));

    const overview = deriveMasteryCompressionOverview(store.getState());
    expect(overview.operationalDomain.status).toBe('operating');
    expect(overview.standingResponsibilities).toEqual([
      expect.objectContaining({
        copyId: 'copy-001',
        routineId: 'archive_verification',
        routineName: 'Archive Verification',
      }),
    ]);
    expect(overview.organizationalCeiling.summary).toContain(
      'player -> specialized Copies -> authored standing responsibilities -> exception escalation'
    );
    expect(formatMasteryCompressionEpilogue(overview)).toContain(
      'known work can proceed without direct scheduling'
    );
  });

  test('outside-procedure evidence changes operating stewardship into attention-required rather than auto-resolution', () => {
    const store = makeStore();
    for (const familiarity of [
      {
        routineId: 'archive_verification' as const,
        source: 'elara_independent_verification' as const,
        learnedAt: 100,
      },
      {
        routineId: 'resonance_calibration' as const,
        source: 'trait_resonance' as const,
        learnedAt: 200,
      },
      {
        routineId: 'forge_assistance' as const,
        source: 'city_center_forge_assistance' as const,
        learnedAt: 300,
      },
    ]) {
      store.dispatch(markRoutineFamiliarity(familiarity));
    }

    store.dispatch(updateCopy({
      copyId: 'copy-001',
      updates: {
        standingOrders: {
          archive_verification: {
            enabled: true,
            condition: {
              type: 'archive_verification_backlog',
              targetPending: 0,
            },
            enabledAtTick: 10,
          },
        },
      },
    }));

    const context = {
      code: 'archive_source_contradiction' as const,
      archiveCaseId: 'archive_case_conflict',
      conflictingSourceIds: ['source_a', 'source_b'],
    };

    store.dispatch(recordCopyException({
      id: 'copy_exception_conflict',
      copyId: 'copy-001',
      routineId: 'archive_verification',
      severity: 'blocking',
      status: 'open',
      detectedAtTick: 12,
      detectedAtGameTimeMs: 1200,
      context,
    }));

    const overview = deriveMasteryCompressionOverview(store.getState());
    expect(overview.operationalDomain.status).toBe('attention_required');
    expect(overview.unresolvedExceptionCount).toBe(1);
    expect(getCopyExceptionBoundaryDefinition(context)).toMatchObject({
      id: 'unknown_or_conflicting_evidence',
      label: 'Unknown or conflicting evidence',
    });
    expect(formatMasteryCompressionEpilogue(overview)).toContain(
      '1 exception still returns to your judgment'
    );
  });
});
