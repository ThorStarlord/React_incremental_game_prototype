type LifecycleBoundary =
  | 'continuous'
  | 'pause-resume'
  | 'stop-start'
  | 'unmount-remount'
  | 'save-load';

type RemainderDisposition = 'preserve' | 'discard';

type LifecycleRemainderPolicy = {
  id: string;
  disposition: Record<LifecycleBoundary, RemainderDisposition>;
  persistsAccumulatorRemainder: boolean;
  requiresSaveSchemaChange: boolean;
  replaysPausedWallTime: boolean;
  replaysOfflineWallTime: boolean;
};

const FRESH_LOOP_RESET_V1: LifecycleRemainderPolicy = {
  id: 'FRESH_LOOP_RESET_V1',
  disposition: {
    continuous: 'preserve',
    'pause-resume': 'preserve',
    'stop-start': 'discard',
    'unmount-remount': 'discard',
    'save-load': 'discard',
  },
  persistsAccumulatorRemainder: false,
  requiresSaveSchemaChange: false,
  replaysPausedWallTime: false,
  replaysOfflineWallTime: false,
};

const DURABLE_REMAINDER_PRESERVATION_V1: LifecycleRemainderPolicy = {
  id: 'DURABLE_REMAINDER_PRESERVATION_V1',
  disposition: {
    continuous: 'preserve',
    'pause-resume': 'preserve',
    'stop-start': 'preserve',
    'unmount-remount': 'preserve',
    'save-load': 'preserve',
  },
  persistsAccumulatorRemainder: true,
  requiresSaveSchemaChange: true,
  replaysPausedWallTime: false,
  replaysOfflineWallTime: false,
};

type SegmentSimulation = {
  ticks: number;
  accumulatorMs: number;
  discardedRemainderMs: number;
};

const simulateSegments = (
  segmentDurationsMs: number[],
  fixedStepMs: number,
  resetAfterEachSegment: boolean
): SegmentSimulation => {
  let ticks = 0;
  let accumulatorMs = 0;
  let discardedRemainderMs = 0;

  for (const segmentMs of segmentDurationsMs) {
    if (!Number.isFinite(segmentMs) || segmentMs < 0) {
      throw new Error('segment durations must be finite and non-negative');
    }
    if (!Number.isFinite(fixedStepMs) || fixedStepMs <= 0) {
      throw new Error('fixed step must be finite and positive');
    }

    accumulatorMs += segmentMs;
    while (accumulatorMs >= fixedStepMs) {
      ticks += 1;
      accumulatorMs -= fixedStepMs;
    }

    if (resetAfterEachSegment) {
      discardedRemainderMs += accumulatorMs;
      accumulatorMs = 0;
    }
  }

  return { ticks, accumulatorMs, discardedRemainderMs };
};

const isPolicySelectableInsideThisPackage = (policy: LifecycleRemainderPolicy) =>
  !policy.requiresSaveSchemaChange &&
  !policy.persistsAccumulatorRemainder &&
  !policy.replaysPausedWallTime &&
  !policy.replaysOfflineWallTime;

describe('GameLoop lifecycle remainder policy contract', () => {
  test('selects fresh-loop reset while preserving pause/resume as the same scheduling epoch', () => {
    expect(FRESH_LOOP_RESET_V1.id).toBe('FRESH_LOOP_RESET_V1');
    expect(FRESH_LOOP_RESET_V1.disposition.continuous).toBe('preserve');
    expect(FRESH_LOOP_RESET_V1.disposition['pause-resume']).toBe('preserve');
    expect(FRESH_LOOP_RESET_V1.disposition['stop-start']).toBe('discard');
    expect(FRESH_LOOP_RESET_V1.disposition['unmount-remount']).toBe('discard');
    expect(FRESH_LOOP_RESET_V1.disposition['save-load']).toBe('discard');
    expect(isPolicySelectableInsideThisPackage(FRESH_LOOP_RESET_V1)).toBe(true);
  });

  test('rejects durable remainder preservation because it requires new persisted scheduler state and schema authority', () => {
    expect(DURABLE_REMAINDER_PRESERVATION_V1.persistsAccumulatorRemainder).toBe(true);
    expect(DURABLE_REMAINDER_PRESERVATION_V1.requiresSaveSchemaChange).toBe(true);
    expect(isPolicySelectableInsideThisPackage(DURABLE_REMAINDER_PRESERVATION_V1)).toBe(false);
  });

  test('quantifies the 10 Hz difference between fresh-loop reset and cross-epoch preservation', () => {
    const reset = simulateSegments([75, 75, 75, 75], 100, true);
    const preserved = simulateSegments([75, 75, 75, 75], 100, false);

    expect(reset).toEqual({
      ticks: 0,
      accumulatorMs: 0,
      discardedRemainderMs: 300,
    });
    expect(preserved).toEqual({
      ticks: 3,
      accumulatorMs: 0,
      discardedRemainderMs: 0,
    });
  });

  test('quantifies the same policy distinction at 20 Hz', () => {
    const reset = simulateSegments([25, 25, 25, 25], 50, true);
    const preserved = simulateSegments([25, 25, 25, 25], 50, false);

    expect(reset).toEqual({
      ticks: 0,
      accumulatorMs: 0,
      discardedRemainderMs: 100,
    });
    expect(preserved).toEqual({
      ticks: 2,
      accumulatorMs: 0,
      discardedRemainderMs: 0,
    });
  });

  test('bounds loss per fresh-loop boundary below one active fixed step', () => {
    const tenHz = simulateSegments([99.999], 100, true);
    const twentyHz = simulateSegments([49.999], 50, true);

    expect(tenHz.discardedRemainderMs).toBeGreaterThanOrEqual(0);
    expect(tenHz.discardedRemainderMs).toBeLessThan(100);
    expect(twentyHz.discardedRemainderMs).toBeGreaterThanOrEqual(0);
    expect(twentyHz.discardedRemainderMs).toBeLessThan(50);
  });

  test('rejects the false claim that cumulative restart loss is globally bounded by one fixed step', () => {
    const repeatedResets = simulateSegments([75, 75, 75, 75], 100, true);

    expect(repeatedResets.discardedRemainderMs).toBeGreaterThan(100);
    expect(repeatedResets.discardedRemainderMs).toBe(300);
  });

  test('rejects invalid elapsed-input models instead of normalizing them into hidden logical time', () => {
    expect(() => simulateSegments([Number.NaN], 100, false)).toThrow(
      'segment durations must be finite and non-negative'
    );
    expect(() => simulateSegments([-1], 100, false)).toThrow(
      'segment durations must be finite and non-negative'
    );
    expect(() => simulateSegments([25], 0, false)).toThrow(
      'fixed step must be finite and positive'
    );
  });

  test('does not authorize replay of paused or offline wall time', () => {
    expect(FRESH_LOOP_RESET_V1.replaysPausedWallTime).toBe(false);
    expect(FRESH_LOOP_RESET_V1.replaysOfflineWallTime).toBe(false);
  });
});
