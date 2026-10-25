import fs from 'fs';
import path from 'path';
import { rootReducer, type RootState } from '../../app/store';
import { CITY_CENTER_LOCATION_ID } from '../Exploration/LocationDefinitions';
import {
  getCopyProductionTaskDefinition,
} from '../Copy/CopyTaskDefinitions';
import {
  presentCopyProductionTaskReadiness,
} from '../Copy/CopyRoutineStrategy';
import type { Copy } from '../Copy/state/CopyTypes';
import {
  selectMasteredRoutines,
  selectRelationshipBuildCapabilities,
} from './PlayerInsightSelectors';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const traits = readJson('public/data/traits.json');
const ELARA_ID = 'npc_scholar_elara';
const INSIGHT_ID = 'ScholarlyInsight';

const makeState = (): RootState => JSON.parse(JSON.stringify(
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any)
));

const makeCopy = (state: RootState, overrides: Partial<Copy> = {}): Copy => ({
  id: 'copy-m26',
  name: 'M26 Copy',
  createdAt: 1,
  parentNPCId: 'npc_m26_source',
  growthType: 'normal',
  maturity: 50,
  loyalty: 60,
  stats: { ...state.player.stats },
  inheritedTraits: [],
  role: 'agent',
  activeTask: null,
  routinePriority: [],
  location: CITY_CENTER_LOCATION_ID,
  ...overrides,
});

describe('M26 provisional product-depth qualification', () => {
  test('capability provenance exposes only player-visible qualifying Memories recorded by assimilation', () => {
    const state = makeState();
    (state.npcs.npcs as any)[ELARA_ID] = { id: ELARA_ID, name: 'Scholar Elara' };
    (state.traits.traits as any)[INSIGHT_ID] = traits[INSIGHT_ID];

    expect(selectRelationshipBuildCapabilities(state)).toEqual([]);

    state.traits.discoveredTraits.push(INSIGHT_ID);
    (state.relationships.bondProfilesByNpc as any)[ELARA_ID] = { connectionLevel: 2 };
    (state.relationships.traitAssimilationByKey as any)[`${ELARA_ID}::${INSIGHT_ID}`] = {
      traitId: INSIGHT_ID,
      sourceNpcId: ELARA_ID,
      progress: 100,
      compatibility: 25,
      lastUpdatedAt: 3,
      qualifyingMemoryIds: ['visible_new', 'hidden', 'visible_old', 'other_npc'],
    };
    (state.relationships.experiencesById as any).cause_new = {
      id: 'cause_new',
      title: 'Independent verification',
    };
    (state.relationships.experiencesById as any).cause_old = {
      id: 'cause_old',
      title: 'Earlier correction',
    };
    (state.relationships.memoriesById as any).visible_new = {
      id: 'visible_new',
      originExperienceId: 'cause_new',
      title: 'The Result Held Without Her',
      timestamp: 30,
      primaryTargetId: ELARA_ID,
      playerVisible: true,
      summary: 'Independent evidence supported the revised model.',
      currentInterpretation: 'You learned to prefer verification over defending the first answer.',
      resonanceTags: ['IndependentVerification'],
    };
    (state.relationships.memoriesById as any).visible_old = {
      id: 'visible_old',
      originExperienceId: 'cause_old',
      title: 'The Footnote Won',
      timestamp: 10,
      primaryTargetId: ELARA_ID,
      playerVisible: true,
      summary: 'Contradictory evidence forced a correction.',
      resonanceTags: ['Revision'],
    };
    (state.relationships.memoriesById as any).hidden = {
      id: 'hidden',
      originExperienceId: 'cause_new',
      title: 'Hidden authoring evidence',
      timestamp: 40,
      primaryTargetId: ELARA_ID,
      playerVisible: false,
      summary: 'Must not be projected.',
      resonanceTags: ['IndependentVerification'],
    };
    (state.relationships.memoriesById as any).other_npc = {
      id: 'other_npc',
      originExperienceId: 'cause_new',
      title: 'Different relationship',
      timestamp: 50,
      primaryTargetId: 'npc_other',
      playerVisible: true,
      summary: 'Must not be attributed to Elara.',
      resonanceTags: ['IndependentVerification'],
    };

    let capability = selectRelationshipBuildCapabilities(state)[0];
    expect(capability.status).toBe('resonance_ready');
    expect(capability.evidence.map(item => item.memoryId)).toEqual([
      'visible_new',
      'visible_old',
    ]);
    expect(capability.evidence[0]).toMatchObject({
      title: 'The Result Held Without Her',
      causeLabel: 'Independent verification',
      summary: 'You learned to prefer verification over defending the first answer.',
    });
    expect(capability.evidence.some(item => item.memoryId === 'hidden')).toBe(false);
    expect(capability.evidence.some(item => item.memoryId === 'other_npc')).toBe(false);

    state.player.permanentTraits.push(INSIGHT_ID);
    capability = selectRelationshipBuildCapabilities(state)[0];
    expect(capability.status).toBe('permanent');
    expect(capability.evidence.map(item => item.memoryId)).toEqual([
      'visible_new',
      'visible_old',
    ]);
  });

  test('routine mastery projects only recorded familiarity and translates source without mutating it', () => {
    const state = makeState();
    expect(selectMasteredRoutines(state)).toEqual([]);

    state.player.routineFamiliarity = {
      forge_assistance: {
        source: 'city_center_forge_assistance',
        learnedAt: 123,
      },
    };

    let mastered = selectMasteredRoutines(state);
    expect(mastered).toHaveLength(1);
    expect(mastered[0]).toMatchObject({
      taskId: 'forge_assistance',
      name: 'Forge Assistance',
      source: 'city_center_forge_assistance',
      sourceLabel: 'Practiced Forge Assistance yourself in the City Center.',
      learnedAt: 123,
    });
    expect(state.player.routineFamiliarity.forge_assistance?.source)
      .toBe('city_center_forge_assistance');

    state.player.routineFamiliarity.resonance_calibration = {
      source: 'trait_resonance',
      learnedAt: 456,
    };
    mastered = selectMasteredRoutines(state);
    expect(mastered.map(item => item.taskId)).toEqual([
      'forge_assistance',
      'resonance_calibration',
    ]);
    expect(mastered[1].sourceLabel).toBe('Completed Trait resonance yourself.');
  });

  test('delegation readiness remains a presentation over existing M20 eligibility', () => {
    const state = makeState();
    const forge = getCopyProductionTaskDefinition('forge_assistance');
    expect(forge).toBeDefined();

    const readyCopy = makeCopy(state);
    const unmastered = presentCopyProductionTaskReadiness(readyCopy, forge!, false);
    expect(unmastered.status).toBe('unmastered');
    expect(unmastered.eligibility.eligible).toBe(false);
    expect(unmastered.label).toContain('Not mastered yet');

    const immatureCopy = makeCopy(state, { maturity: 10 });
    const blocked = presentCopyProductionTaskReadiness(immatureCopy, forge!, true);
    expect(blocked.status).toBe('copy_blocked');
    expect(blocked.eligibility.eligible).toBe(false);
    expect(blocked.reasons).toContain('Requires maturity 50+.');

    const ready = presentCopyProductionTaskReadiness(readyCopy, forge!, true);
    expect(ready.status).toBe('ready');
    expect(ready.eligibility).toEqual({ eligible: true, reasons: [] });
    expect(ready.label).toContain('Ready to delegate');
  });

  test('M26 adds only read-only projections and preserves explicit player delegation', () => {
    const selectorSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/PlayerInsightSelectors.ts'),
      'utf8'
    );
    const panelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/components/PlayerInsightPanel.tsx'),
      'utf8'
    );
    const routineStrategySource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Copy/CopyRoutineStrategy.ts'),
      'utf8'
    );
    const copyPanelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Copy/components/ui/CopyDetailPanel.tsx'),
      'utf8'
    );

    expect(selectorSource).not.toContain('createSlice');
    expect(panelSource).not.toContain('useAppDispatch');
    expect(panelSource).not.toContain('dispatch(');
    expect(panelSource).not.toContain('missing evidence:');
    expect(routineStrategySource).not.toContain('createAsyncThunk');
    expect(routineStrategySource).not.toContain('dispatch(');
    expect(copyPanelSource).toContain('presentCopyProductionTaskReadiness');
    expect(copyPanelSource).toContain('Start Preferred');
    expect(copyPanelSource).toContain('This Copy still needs');
  });
});