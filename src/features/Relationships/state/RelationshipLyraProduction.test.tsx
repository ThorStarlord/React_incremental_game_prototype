import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { replaceState, rootReducer, type RootState } from '../../../app/store';
import NPCPanelContainer from '../../NPCs/components/containers/NPCPanelContainer';
import {
  initializeNPCsThunk,
  processNPCInteractionThunk,
} from '../../NPCs/state/NPCThunks';
import {
  setDialogueNodes,
  setNPCs,
  setSelectedNPCId,
} from '../../NPCs/state/NPCSlice';
import { initializeQuestsThunk } from '../../Quest/state/QuestThunks';
import { initializeRelationshipRuntimeThunk } from './RelationshipThunks';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
} from './RelationshipSelectors';
import {
  createSave,
  createSaveFromPayload,
  decodeSavePayloadFromBase64,
  encodeSavePayloadToBase64,
  loadSavedGameWithMigration,
} from '../../../shared/utils/saveUtils';
import { migrateSavePayload } from '../../../shared/utils/saveSchema';

const LYRA_ID = 'npc_lyra';
const LYRA_QUEST_ID = 'quest_lyra_chrono_crypt_calibration';
const LYRA_MEMORY_ID = 'lyra_memory_enemies_in_phase';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const lyraBundle = readJson('public/data/relationships/lyra.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');

const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({ reducer: rootReducer });

const initializeProductionRuntime = async (store: ReturnType<typeof makeStore>) => {
  await store.dispatch(initializeNPCsThunk()).unwrap();
  await store.dispatch(initializeQuestsThunk()).unwrap();
  store.dispatch(setSelectedNPCId(LYRA_ID));
};

const renderLyraRoute = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/game/npcs/${LYRA_ID}`]}>
        <Routes>
          <Route path="/game/npcs/:npcId" element={<NPCPanelContainer />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

const clickTab = (name: string) => {
  fireEvent.click(screen.getByRole('tab', { name }));
};

const clickResponse = (label: string) => {
  fireEvent.click(screen.getByRole('button', { name: label }));
};

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
    if (url === '/data/npcs.json') {
      return { ok: true, json: async () => npcs } as any;
    }
    if (url === '/data/dialogues.json') {
      return { ok: true, json: async () => dialogues } as any;
    }
    if (url === '/data/quests.json') {
      return { ok: true, json: async () => quests } as any;
    }
    if (url === '/data/relationships/index.json') {
      return { ok: true, json: async () => manifest } as any;
    }
    if (bundleByUrl[url]) {
      return { ok: true, json: async () => bundleByUrl[url] } as any;
    }
    return { ok: false, statusText: `Unexpected test URL: ${url}` } as any;
  }) as unknown as typeof fetch;
});

afterEach(() => {
  cleanup();
});

afterAll(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

describe('M11 Lyra production adversarial vertical slice', () => {
  test('production content is fully wired without Lyra-specific generic mechanics', () => {
    expect(manifest.bundles).toContain('/data/relationships/lyra.json');

    const lyra = npcs[LYRA_ID];
    expect(lyra).toBeDefined();
    expect(lyra.isDiscovered).toBe(true);
    expect(lyra.connectionDepth).toBe(0);
    expect(lyra.affinity).toBe(0);
    expect(lyra.availableTraits).toEqual([]);
    expect(lyra.availableDialogues).toHaveLength(6);

    for (const dialogueId of lyra.availableDialogues) {
      expect(dialogues[dialogueId]).toBeDefined();
      expect(dialogues[dialogueId].npcId).toBe(LYRA_ID);
    }

    const offerEffects = dialogues.lyra_offer_cotraining.effects as any[];
    const questUnlock = offerEffects.find(effect => effect.type === 'UNLOCK_QUEST');
    const keyGrant = offerEffects.find(effect => effect.type === 'GIVE_ITEM');
    const quest = quests[LYRA_QUEST_ID];
    expect(questUnlock.questId).toBe(LYRA_QUEST_ID);
    expect(keyGrant.itemId).toBe(quest.objectives[0].target);
    expect(quest.giver).toBe(LYRA_ID);
    expect(quest.resolutionOptions).toHaveLength(1);
    expect(
      lyraBundle.experiences[quest.resolutionOptions[0].relationshipExperienceId]
    ).toBeDefined();

    const progression = lyraBundle.progression[LYRA_ID];
    expect(progression.connectionAuthority).toBe('relationships');
    expect(progression.essence.enabled).toBe(true);
    expect(progression.essence.startingTetherState).toBe('present');
    const connectionII = progression.qualificationRules.find(
      (rule: any) => rule.level === 2
    );
    expect(connectionII.requiredMemoryTags).toContain('AdversarialBond');
    expect(connectionII.requiredExperienceIds).toEqual(
      expect.arrayContaining([
        'lyra_exp_reluctant_cotraining',
        'lyra_exp_mutual_calibration',
        'lyra_exp_proto_bond',
      ])
    );
    expect(connectionII.minimumDimensions.reciprocity).toBeGreaterThanOrEqual(15);

    expect(lyraBundle.experiences.lyra_exp_strategic_defeat.sourceId).toBe(
      'lyra_strategic_defeat'
    );
    expect(lyraBundle.experiences.lyra_exp_reluctant_cotraining.sourceType).toBe('quest');
    expect(lyraBundle.experiences.lyra_exp_reluctant_cotraining.sourceId).toBe(
      LYRA_QUEST_ID
    );
    expect(lyraBundle.experiences.lyra_exp_proto_bond.memoryDefinitionId).toBe(
      LYRA_MEMORY_ID
    );
    expect(lyraBundle.memories[LYRA_MEMORY_ID].originExperienceId).toBe(
      'lyra_exp_proto_bond'
    );

    for (const sourceFile of [
      'src/features/Relationships/state/RelationshipSlice.ts',
      'src/features/Relationships/state/RelationshipSelectors.ts',
      'src/features/Relationships/state/RelationshipThunks.ts',
      'src/features/Essence/utils/essenceRate.ts',
      'src/features/Traits/state/TraitThunks.ts',
      'src/shared/utils/saveSchema.ts',
      'src/features/NPCs/components/containers/NPCPanelContainer.tsx',
    ]) {
      expect(fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8')).not.toContain(
        LYRA_ID
      );
    }
  });

  test('normal player UI reaches adversarial Connection II, survives save/import, and generates contested-bond Essence without scene loot', async () => {
    const store = makeStore();
    await initializeProductionRuntime(store);
    renderLyraRoute(store);

    expect(screen.getByText('Lyra')).toBeInTheDocument();
    clickTab('Dialogue');

    clickResponse('You won the position. You did not prove the principle behind it.');
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.lyra_exp_strategic_defeat
      ).toBeDefined();
    });

    clickResponse(
      'If your model of me were right, you would not need the pressure. Adjust the model.'
    );
    await waitFor(() => {
      const profile = selectBondProfileByNpcId(store.getState(), LYRA_ID);
      expect(profile.connectionLevel).toBe(1);
      expect(profile.dimensions.affinity).toBe(-30);
      expect(profile.dimensions.understanding).toBe(20);
    });

    const connectionIContribution = selectRelationshipEssenceContributionByNpcId(
      store.getState(),
      LYRA_ID
    );
    expect(connectionIContribution.enabled).toBe(true);
    expect(connectionIContribution.effectiveRate).toBeGreaterThan(0);
    expect(store.getState().essence.currentEssence).toBe(0);

    const checkpointId = createSave(store.getState(), 'Lyra Connection I');
    expect(checkpointId).toBeTruthy();
    const checkpoint = await loadSavedGameWithMigration(checkpointId!);
    expect(checkpoint).not.toBeNull();
    expect(
      checkpoint!.state.relationships.bondProfilesByNpc[LYRA_ID].connectionLevel
    ).toBe(1);
    expect(checkpoint!.state.essence.currentEssence).toBe(0);

    store.dispatch(replaceState(checkpoint!.state));
    await store
      .dispatch(initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true }))
      .unwrap();
    store.dispatch(setSelectedNPCId(LYRA_ID));

    clickResponse('Good. We coordinate exactly as long as the problem requires.');
    await waitFor(() => {
      expect(store.getState().npcs.npcs[LYRA_ID].availableQuests).toContain(
        LYRA_QUEST_ID
      );
      expect(store.getState().inventory.items.item_lyra_harmonic_key).toBe(1);
    });

    clickTab('Quests');
    fireEvent.click(screen.getByText('Reluctant Co-Training'));
    clickResponse('Accept Quest');

    await waitFor(() => {
      expect(store.getState().quest.quests[LYRA_QUEST_ID].status).toBe(
        'READY_TO_COMPLETE'
      );
    });

    clickResponse('Choose Coordinate Without Conceding');
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.lyra_exp_reluctant_cotraining
      ).toBeDefined();
      expect(store.getState().inventory.items.item_lyra_harmonic_key ?? 0).toBe(0);
    });

    clickResponse('Turn In Quest');
    await waitFor(() => {
      expect(store.getState().quest.quests[LYRA_QUEST_ID].status).toBe('COMPLETED');
    });

    clickTab('Dialogue');
    clickResponse(
      'I understand your principle better now. I still think it produces the wrong world.'
    );
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.lyra_exp_ideological_friction
      ).toBeDefined();
    });

    clickResponse('You changed because you knew what I would see. I did the same.');
    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.lyra_exp_mutual_calibration
      ).toBeDefined();
    });

    clickResponse(
      'We still disagree. But neither of us can pretend the other is simple anymore.'
    );
    await waitFor(() => {
      expect(store.getState().relationships.experiencesById.lyra_exp_proto_bond).toBeDefined();
    });

    const profile = selectBondProfileByNpcId(store.getState(), LYRA_ID);
    expect(profile.connectionLevel).toBe(2);
    expect(profile.connectionProgress).toBe(83);
    expect(profile.dimensions.affinity).toBe(-35);
    expect(profile.dimensions.trust).toBe(19);
    expect(profile.dimensions.understanding).toBe(64);
    expect(profile.dimensions.sharedMeaning).toBe(46);
    expect(profile.dimensions.reciprocity).toBe(18);
    expect(profile.stability).toBe('contested');
    expect(profile.connectionQualificationEvidence['2']).toEqual(
      expect.arrayContaining([
        'lyra_exp_reluctant_cotraining',
        'lyra_exp_mutual_calibration',
        'lyra_exp_proto_bond',
        LYRA_MEMORY_ID,
      ])
    );

    const memories = selectRelationshipMemoriesByNpcId(store.getState(), LYRA_ID);
    expect(memories).toHaveLength(1);
    expect(memories[0].id).toBe(LYRA_MEMORY_ID);
    expect(memories[0].originExperienceId).toBe('lyra_exp_proto_bond');
    expect(memories[0].persistence).toBe('contested');

    const contribution = selectRelationshipEssenceContributionByNpcId(
      store.getState(),
      LYRA_ID
    );
    expect(contribution.enabled).toBe(true);
    expect(contribution.qualityBand).toBe('Stable');
    expect(contribution.stabilityMultiplier).toBe(0.65);
    expect(contribution.effectiveRate).toBeCloseTo(0.065, 6);
    expect(store.getState().essence.currentEssence).toBe(0);

    clickTab('Relationship');
    expect(screen.getByText('Connection 2')).toBeInTheDocument();
    expect(screen.getByText('Stability: contested')).toBeInTheDocument();
    expect(screen.getByText('-35')).toBeInTheDocument();
    expect(screen.getByText('0.065/sec')).toBeInTheDocument();
    expect(screen.getAllByText('Enemies in Phase').length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Connection measures how much shared history has made you matter/i)
    ).toBeInTheDocument();

    const finalSaveId = createSave(store.getState(), 'Lyra Connection II');
    expect(finalSaveId).toBeTruthy();
    const persistedPayload = JSON.parse(
      localStorage.getItem(`game_save_${finalSaveId}`) as string
    );
    const saveCode = encodeSavePayloadToBase64(persistedPayload);
    const imported = createSaveFromPayload(
      decodeSavePayloadFromBase64(saveCode),
      'Imported Lyra Connection II'
    );
    expect(imported).not.toBeNull();

    const importedSave = await loadSavedGameWithMigration(imported!.saveId);
    expect(importedSave).not.toBeNull();
    const importedProfile = importedSave!.state.relationships.bondProfilesByNpc[LYRA_ID];
    expect(importedProfile.connectionLevel).toBe(2);
    expect(importedProfile.dimensions.affinity).toBe(-35);
    expect(importedProfile.stability).toBe('contested');
    expect(importedSave!.state.relationships.memoriesById[LYRA_MEMORY_ID]).toBeDefined();
    expect(importedSave!.state.relationships.experiencesById.lyra_exp_proto_bond).toBeDefined();
    expect(importedSave!.state.essence.currentEssence).toBe(0);
    expect(importedSave!.state.essence.generationRate).toBeGreaterThan(0);
  });

  test('a pre-Relationships Lyra save preserves legacy progress but gains modern history only from new real interactions', async () => {
    const store = makeStore();
    store.dispatch(setNPCs(npcs));

    const current = store.getState();
    const historicalState = {
      ...current,
      npcs: {
        ...current.npcs,
        npcs: {
          ...current.npcs.npcs,
          [LYRA_ID]: {
            ...current.npcs.npcs[LYRA_ID],
            affinity: -20,
            connectionDepth: 7,
          },
        },
      },
      relationships: undefined as any,
    } as RootState;

    const persistentMigration = migrateSavePayload(historicalState);
    expect(persistentMigration.sourceVersion).toBe(0);
    expect(persistentMigration.targetVersion).toBe(1);

    store.dispatch(replaceState(persistentMigration.envelope.state));
    const reconciliation = await store
      .dispatch(initializeRelationshipRuntimeThunk({ migrateLegacyProfiles: true }))
      .unwrap();
    expect(reconciliation.migratedNpcIds).toContain(LYRA_ID);

    const migrated = selectBondProfileByNpcId(store.getState(), LYRA_ID);
    expect(migrated.connectionLevel).toBe(2);
    expect(migrated.connectionProgress).toBe(0);
    expect(migrated.dimensions.affinity).toBe(-20);
    expect(migrated.dimensions.understanding).toBe(0);
    expect(migrated.dimensions.sharedMeaning).toBe(0);
    expect(migrated.dimensions.reciprocity).toBe(0);
    expect(migrated.connectionQualificationEvidence).toEqual({});
    expect(migrated.provenance).toEqual({
      legacyDerived: true,
      legacyConnectionDepth: 7,
    });
    expect(selectRelationshipExperiencesByNpcId(store.getState(), LYRA_ID)).toEqual([]);
    expect(selectRelationshipMemoriesByNpcId(store.getState(), LYRA_ID)).toEqual([]);

    store.dispatch(setDialogueNodes(dialogues));
    store.dispatch(setSelectedNPCId(LYRA_ID));
    const newInteraction = await store.dispatch(
      processNPCInteractionThunk({
        npcId: LYRA_ID,
        interactionType: 'dialogue',
        context: {
          choiceId: 'lyra_strategic_defeat',
          selectedResponse: 'hold_ground',
        },
      })
    );
    expect(processNPCInteractionThunk.fulfilled.match(newInteraction)).toBe(true);

    expect(selectRelationshipExperiencesByNpcId(store.getState(), LYRA_ID).map(exp => exp.id)).toEqual([
      'lyra_exp_strategic_defeat',
    ]);
    expect(selectRelationshipMemoriesByNpcId(store.getState(), LYRA_ID)).toEqual([]);
    expect(
      store.getState().relationships.experiencesById.lyra_exp_coercion_reflected
    ).toBeUndefined();
    expect(store.getState().relationships.experiencesById.lyra_exp_proto_bond).toBeUndefined();
    expect(selectBondProfileByNpcId(store.getState(), LYRA_ID).provenance.legacyDerived).toBe(true);
  });
});
