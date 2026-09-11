import fs from 'fs';
import path from 'path';
import { rootReducer, type RootState } from '../../app/store';
import {
  selectCausalJournalEntries,
  selectOpportunityMap,
  selectRelationshipBuildCapabilities,
} from './PlayerInsightSelectors';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const traits = readJson('public/data/traits.json');
const ELARA_ID = 'npc_scholar_elara';
const INSIGHT_ID = 'ScholarlyInsight';

/**
 * Redux Toolkit freezes reducer output in the test/development build. These
 * selector tests intentionally construct synthetic canonical snapshots, so use
 * a JSON round-trip to obtain a mutable serializable fixture rather than
 * mutating the reducer-owned frozen object.
 */
const makeState = (): RootState => JSON.parse(JSON.stringify(
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any)
));

const addExperienceIds = (state: RootState, ids: string[]) => {
  const relationships = state.relationships as any;
  for (const id of ids) {
    relationships.experiencesById[id] = {
      id,
      title: id,
      timestamp: 1,
      primaryTargetId: ELARA_ID,
      participantIds: ['player', ELARA_ID],
      sourceType: 'dialogue',
      significance: 'meaningful',
      relationshipEffects: {},
      resonanceTags: [],
      memoryCandidate: false,
    };
  }
};

describe('post-M25 player insight projection qualification', () => {
  test('causal journal projects only player-visible recorded Memories in newest-first order', () => {
    const state = makeState();
    (state.npcs.npcs as any)[ELARA_ID] = { id: ELARA_ID, name: 'Scholar Elara' };
    (state.relationships.experiencesById as any).cause_old = {
      id: 'cause_old',
      title: 'Earlier correction',
    };
    (state.relationships.experiencesById as any).cause_new = {
      id: 'cause_new',
      title: 'Independent verification',
    };
    (state.relationships.memoriesById as any) = {
      visible_old: {
        id: 'visible_old',
        originExperienceId: 'cause_old',
        title: 'Earlier Memory',
        timestamp: 10,
        primaryTargetId: ELARA_ID,
        playerVisible: true,
        summary: 'An earlier lesson.',
        resonanceTags: ['Evidence'],
      },
      hidden_newest: {
        id: 'hidden_newest',
        originExperienceId: 'cause_new',
        title: 'Hidden authoring detail',
        timestamp: 30,
        primaryTargetId: ELARA_ID,
        playerVisible: false,
        summary: 'Must not appear.',
        resonanceTags: ['Spoiler'],
      },
      visible_new: {
        id: 'visible_new',
        originExperienceId: 'cause_new',
        title: 'Verified Memory',
        timestamp: 20,
        primaryTargetId: ELARA_ID,
        playerVisible: true,
        summary: 'The method held independently.',
        resonanceTags: ['IndependentVerification'],
      },
    };

    const journal = selectCausalJournalEntries(state);
    expect(journal.map(entry => entry.id)).toEqual(['visible_new', 'visible_old']);
    expect(journal[0].causeLabel).toBe('Independent verification');
    expect(journal[0].npcName).toBe('Scholar Elara');
    expect(journal.some(entry => entry.id === 'hidden_newest')).toBe(false);
  });

  test('opportunity map reveals chapter progress before it reveals a future branch label', () => {
    const state = makeState();
    addExperienceIds(state, [
      'elara_exp_model_challenged',
      'elara_exp_contradictory_footnote',
      'elara_exp_tome_committed',
    ]);

    let archive = selectOpportunityMap(state).find(chapter => chapter.id === 'archive_inquiry');
    expect(archive?.status).toBe('in_progress');
    expect(archive?.routes).toEqual([]);

    addExperienceIds(state, ['elara_exp_follow_evidence']);
    archive = selectOpportunityMap(state).find(chapter => chapter.id === 'archive_inquiry');
    expect(archive?.routes.map(route => route.routeId)).toEqual(['evidence_over_ownership']);
    expect(archive?.routes.some(route => route.routeId === 'cautious_then_reopened')).toBe(false);
  });

  test('relationship build hides undiscovered authored Traits and derives developing, ready, and permanent states', () => {
    const state = makeState();
    (state.npcs.npcs as any)[ELARA_ID] = { id: ELARA_ID, name: 'Scholar Elara' };
    (state.traits.traits as any)[INSIGHT_ID] = traits[INSIGHT_ID];

    expect(selectRelationshipBuildCapabilities(state)).toEqual([]);

    state.traits.discoveredTraits.push(INSIGHT_ID);
    let capability = selectRelationshipBuildCapabilities(state)[0];
    expect(capability.status).toBe('developing');
    expect(capability.missingMemoryTags).toContain('IndependentVerification');

    (state.relationships.bondProfilesByNpc as any)[ELARA_ID] = { connectionLevel: 2 };
    (state.relationships.traitAssimilationByKey as any)[`${ELARA_ID}::${INSIGHT_ID}`] = {
      traitId: INSIGHT_ID,
      sourceNpcId: ELARA_ID,
      progress: 100,
      compatibility: 25,
      lastUpdatedAt: 1,
      qualifyingMemoryIds: ['verified'],
    };
    (state.relationships.memoriesById as any).verified = {
      id: 'verified',
      originExperienceId: 'elara_exp_independent_verification',
      title: 'The Result Held Without Her',
      timestamp: 1,
      primaryTargetId: ELARA_ID,
      playerVisible: true,
      summary: 'Independent evidence.',
      resonanceTags: ['IndependentVerification'],
    };

    capability = selectRelationshipBuildCapabilities(state)[0];
    expect(capability.status).toBe('resonance_ready');
    expect(capability.missingMemoryTags).toEqual([]);

    state.player.permanentTraits.push(INSIGHT_ID);
    capability = selectRelationshipBuildCapabilities(state)[0];
    expect(capability.status).toBe('permanent');
  });

  test('player insight implementation remains a read-only projection and is surfaced on the Dashboard', () => {
    const selectorSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/PlayerInsightSelectors.ts'),
      'utf8'
    );
    const panelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/Story/components/PlayerInsightPanel.tsx'),
      'utf8'
    );
    const dashboardSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/DashboardPage.tsx'),
      'utf8'
    );

    expect(selectorSource).not.toContain('createSlice');
    expect(panelSource).not.toContain('useAppDispatch');
    expect(panelSource).not.toContain('dispatch(');
    expect(dashboardSource).toContain('<PlayerInsightPanel />');
  });
});