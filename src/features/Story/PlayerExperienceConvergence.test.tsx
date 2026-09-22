import fs from 'fs';
import path from 'path';
import { rootReducer, type RootState } from '../../app/store';
import { selectCampaignEpilogueProjection } from './CampaignEpilogueSelectors';
import { selectCausalJournalEntries } from './PlayerInsightSelectors';

const makeState = (): RootState => JSON.parse(JSON.stringify(
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any)
));

describe('player-experience convergence hardening', () => {
  test('completed-campaign epilogue translates canonical enum state into player-facing language', () => {
    const state = makeState();

    (state.relationships.memoriesById as any).lyra_memory_gc10_distributed_aftermath = {
      id: 'lyra_memory_gc10_distributed_aftermath',
      originExperienceId: 'lyra_gc10_exp_epilogue_distributed',
      title: 'After the Distributed Dissipation',
      primaryTargetId: 'npc_lyra',
      participantIds: ['player', 'npc_lyra'],
      memoryType: 'shared',
      significance: 'defining',
      playerVisible: true,
      summary: 'The Telluric Echo is dispersed through the prepared network.',
      resonanceTags: ['TelluricEcho', 'CampaignOneComplete'],
      persistence: 'stable',
      timestamp: 1,
    };

    (state.worldState.regions as any).location_merchant_district = {
      latticeIntegrity: 'stabilized',
      networkPosture: 'distributed',
      counterphasePlan: 'distributed',
    };
    (state.worldState.regions as any).location_whispering_woods = {
      campaignStatus: 'complete',
      telluricEchoOutcome: 'distributed_dissipation',
    };

    const epilogue = selectCampaignEpilogueProjection(state);

    expect(epilogue).not.toBeNull();
    expect(epilogue?.world).toContain('Lattice integrity: Stabilized.');
    expect(epilogue?.world).toContain('Network posture: Distributed.');
    expect(epilogue?.world).toContain('Counterphase plan: Distributed Dissipation.');
    expect(epilogue?.world).toContain('Telluric Echo outcome: Distributed Dissipation.');
    expect(epilogue?.world).not.toMatch(/distributed_dissipation|counterphase plan is distributed|network posture is distributed/i);
  });

  test('causal-journal chips present authored resonance tags as readable player language', () => {
    const state = makeState();

    (state.npcs.npcs as any).npc_scholar_elara = {
      id: 'npc_scholar_elara',
      name: 'Scholar Elara',
    };
    (state.relationships.experiencesById as any).elara_exp_independent_verification = {
      id: 'elara_exp_independent_verification',
      title: 'Independent verification',
    };
    (state.relationships.memoriesById as any).verified = {
      id: 'verified',
      originExperienceId: 'elara_exp_independent_verification',
      title: 'The Result Held Without Her',
      timestamp: 10,
      primaryTargetId: 'npc_scholar_elara',
      playerVisible: true,
      summary: 'Independent evidence held.',
      resonanceTags: [
        'IndependentVerification',
        'CampaignOneComplete',
        'counterphase_plan',
      ],
    };

    const [entry] = selectCausalJournalEntries(state);

    expect(entry.tags).toEqual([
      'Independent Verification',
      'Campaign One Complete',
      'Counterphase Plan',
    ]);
  });

  test('supported-browser qualification checks the first actionable Campaign One objective after intro', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'scripts/release-browser-qualification.js'),
      'utf8'
    );

    expect(source).toContain('first-actionable-prologue-objective-visible');
    expect(source).toContain('Prologue — Find Elder Willow');
    expect(source).toContain('Open travel controls');
  });
});
