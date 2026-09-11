import fs from 'fs';
import path from 'path';
import {
  createCombatEncounterState,
  getCombatActionPresentations,
  performCombatAction,
} from '../../Combat/CombatEngine';
import {
  CONTRADICTION_ECHO_ENCOUNTER,
  TELLURIC_ECHO_ENCOUNTER,
} from '../../Combat/CombatEncounterDefinitions';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const quests = readJson('public/data/quests.json');

describe('post-M25 cross-domain relationship-derived Trait buildcraft', () => {
  test('Scholarly Insight already changes quest solution space and now changes combat solution space', () => {
    const inventoryQuest = quests.quest_m16_impossible_inventory;
    const scholarlyResolution = inventoryQuest.resolutionOptions.find(
      (resolution: any) => resolution.id === 'reopen_inventory_model'
    );

    expect(scholarlyResolution.requiredPermanentTraitIds).toEqual(['ScholarlyInsight']);
    expect(CONTRADICTION_ECHO_ENCOUNTER.feedbackPattern?.requiredPermanentTraitIds).toEqual([
      'ScholarlyInsight',
    ]);
  });

  test('Scholarly Insight exposes a semantic tactical action without removing baseline viability', () => {
    const initial = createCombatEncounterState(CONTRADICTION_ECHO_ENCOUNTER);

    const withoutTrait = getCombatActionPresentations(
      CONTRADICTION_ECHO_ENCOUNTER,
      initial,
      []
    );
    expect(withoutTrait.map(action => action.id)).toEqual(['strike', 'guard']);

    const withTrait = getCombatActionPresentations(
      CONTRADICTION_ECHO_ENCOUNTER,
      initial,
      ['ScholarlyInsight']
    );
    expect(withTrait).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'trace_pattern',
          label: 'Challenge the Model',
          enabled: true,
        }),
      ])
    );

    const ordinary = performCombatAction(
      CONTRADICTION_ECHO_ENCOUNTER,
      initial,
      'strike',
      []
    );
    expect(ordinary.ok).toBe(true);

    const traced = performCombatAction(
      CONTRADICTION_ECHO_ENCOUNTER,
      initial,
      'trace_pattern',
      ['ScholarlyInsight']
    );
    expect(traced.ok).toBe(true);
    expect(traced.state.patternRead).toBe(true);
    expect(traced.state.enemyPhase).toBe('building');

    const disrupted = performCombatAction(
      CONTRADICTION_ECHO_ENCOUNTER,
      traced.state,
      'disrupt_feedback',
      ['ScholarlyInsight']
    );
    expect(disrupted.ok).toBe(true);
    expect(disrupted.state.feedbackDisrupted).toBe(true);
  });

  test('relationship depth alone cannot bypass permanent Trait authority', () => {
    const initial = createCombatEncounterState(CONTRADICTION_ECHO_ENCOUNTER);
    const rejected = performCombatAction(
      CONTRADICTION_ECHO_ENCOUNTER,
      initial,
      'trace_pattern',
      []
    );

    expect(rejected.ok).toBe(false);
    expect(rejected.message).toContain('ScholarlyInsight');
    expect(rejected.state).toEqual(initial);
  });

  test('the two learned capabilities retain different semantic identities in combat', () => {
    expect(TELLURIC_ECHO_ENCOUNTER.feedbackPattern?.traceLabel).toBe('Trace the Cycle');
    expect(TELLURIC_ECHO_ENCOUNTER.feedbackPattern?.disruptPhase).toBe('release');
    expect(CONTRADICTION_ECHO_ENCOUNTER.feedbackPattern?.traceLabel).toBe('Challenge the Model');
    expect(CONTRADICTION_ECHO_ENCOUNTER.feedbackPattern?.disruptPhase).toBe('building');
  });
});
