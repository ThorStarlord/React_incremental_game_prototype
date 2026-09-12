import { COPY_PRODUCTION_TASKS } from './CopyTaskDefinitions';

describe('Campaign One delegation breadth', () => {
  it('provides three authored routines across at least two contexts', () => {
    expect(COPY_PRODUCTION_TASKS.map(task => task.id)).toEqual(
      expect.arrayContaining(['forge_assistance', 'resonance_calibration', 'archive_fieldwork'])
    );
    expect(new Set(COPY_PRODUCTION_TASKS.map(task => task.requiredLocationId)).size).toBeGreaterThanOrEqual(2);
  });
});
