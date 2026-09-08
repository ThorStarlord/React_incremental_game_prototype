import fs from 'fs';
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { adjustFactionReputation } from './state/FactionSlice';
import { selectFactionReputation } from './state/FactionSelectors';
import { setNPCs, setDialogueNodes, setSelectedNPCId } from '../NPCs/state/NPCSlice';
import { processNPCInteractionThunk } from '../NPCs/state/NPCThunks';
import NPCDialogueTab from '../NPCs/components/ui/tabs/NPCDialogueTab';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from '../Relationships/state/RelationshipThunks';
import { selectBondProfileByNpcId } from '../Relationships/state/RelationshipSelectors';
import { addQuest } from '../Quest/state/QuestSlice';
import { turnInQuestThunk } from '../Quest/state/QuestThunks';
import { resetPlayerState } from '../Player/state/PlayerSlice';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';

const CITY_WATCH = 'City Watch';
const MERCHANTS_GUILD = 'Merchants Guild';
const VALERIUS_ID = 'npc_captain_valerius';
const GRONK_ID = 'npc_blacksmith_gronk';
const PUBLIC_OVERRIDE_ID = 'valerius_m23_public_override';
const WATCH_CLEARANCE_ID = 'valerius_m23_watch_clearance';
const GUILD_AUDIT_ID = 'gronk_m23_guild_audit';
const GUILD_PRIORITY_ID = 'gronk_m23_guild_priority';
const PATROL_QUEST_ID = 'quest_valerius_patrol_duty';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const npcs = readJson('public/data/npcs.json');
const dialogues = readJson('public/data/dialogues.json');
const quests = readJson('public/data/quests.json');
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

const seedProductionRuntime = async (store: TestStore) => {
  store.dispatch(setNPCs(npcs));
  store.dispatch(setDialogueNodes(dialogues));
  await store.dispatch(
    initializeRelationshipRuntimeThunk({ seedProfiles: true })
  ).unwrap();
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async (input: unknown) => {
    const url = String(input);
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
  jest.restoreAllMocks();
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('M23 faction reputation qualification', () => {
  test('Rule-of-Two production probes separate personal Relationship from institutional standing below UI', async () => {
    const store = makeStore();
    await seedProductionRuntime(store);

    expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(0);
    expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD)).toBe(0);

    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId: 'valerius_exp_order_questioned',
    })).unwrap();

    const valeriusBefore = selectBondProfileByNpcId(store.getState(), VALERIUS_ID);
    const knowledgeBeforeOverride = clone(store.getState().knowledge);

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={VALERIUS_ID} />
      </Provider>
    );

    expect(screen.getByText('The Order You Broke in Public')).toBeInTheDocument();
    expect(screen.queryByText('Clearance the Captain Cannot Give Alone')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {
      name: /I broke the visible order because following it would have broken the mission/i,
    }));

    await waitFor(() => {
      expect(
        store.getState().relationships.experiencesById.valerius_exp_m23_public_override
      ).toBeDefined();
      expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(-10);
    });

    const valeriusAfter = selectBondProfileByNpcId(store.getState(), VALERIUS_ID);
    expect(valeriusAfter.dimensions.trust).toBeGreaterThan(valeriusBefore.dimensions.trust);
    expect(valeriusAfter.dimensions.understanding).toBeGreaterThan(
      valeriusBefore.dimensions.understanding
    );
    expect(valeriusAfter.dimensions.reliance).toBeGreaterThan(valeriusBefore.dimensions.reliance);
    expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD)).toBe(0);
    expect(store.getState().knowledge).toEqual(knowledgeBeforeOverride);

    await waitFor(() => {
      expect(screen.queryByText('The Order You Broke in Public')).not.toBeInTheDocument();
      expect(screen.queryByText('Clearance the Captain Cannot Give Alone')).not.toBeInTheDocument();
    });

    const blockedWatch = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: WATCH_CLEARANCE_ID, selectedResponse: 'accept_clearance' },
    })).unwrap();
    expect(blockedWatch.success).toBe(false);
    expect(blockedWatch.message).toContain('Faction reputation gate not met');

    const relationshipAtNegativeWatch = clone(store.getState().relationships);
    store.dispatch(adjustFactionReputation({ factionId: CITY_WATCH, amount: 10 }));
    expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(0);
    expect(store.getState().relationships).toEqual(relationshipAtNegativeWatch);

    await waitFor(() => {
      expect(screen.getByText('Clearance the Captain Cannot Give Alone')).toBeInTheDocument();
    });

    const allowedWatch = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: WATCH_CLEARANCE_ID, selectedResponse: 'accept_clearance' },
    })).unwrap();
    expect(allowedWatch.success).toBe(true);

    cleanup();
    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={GRONK_ID} />
      </Provider>
    );

    expect(screen.getByText('Weights That Match the Ledger')).toBeInTheDocument();
    expect(screen.queryByText('A Guild Queue, Not a Favor')).not.toBeInTheDocument();

    const blockedGuild = await store.dispatch(processNPCInteractionThunk({
      npcId: GRONK_ID,
      interactionType: 'dialogue',
      context: { choiceId: GUILD_PRIORITY_ID, selectedResponse: 'acknowledge' },
    })).unwrap();
    expect(blockedGuild.success).toBe(false);
    expect(blockedGuild.message).toContain('Faction reputation gate not met');

    const gronkRelationshipBeforeAudit = clone(store.getState().relationships);
    const knowledgeBeforeAudit = clone(store.getState().knowledge);
    fireEvent.click(screen.getByRole('button', {
      name: /I checked the weights against the receipts/i,
    }));

    await waitFor(() => {
      expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD)).toBe(12);
    });
    expect(store.getState().relationships).toEqual(gronkRelationshipBeforeAudit);
    expect(store.getState().knowledge).toEqual(knowledgeBeforeAudit);
    expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(0);

    await waitFor(() => {
      expect(screen.getByText('A Guild Queue, Not a Favor')).toBeInTheDocument();
    });

    const allowedGuild = await store.dispatch(processNPCInteractionThunk({
      npcId: GRONK_ID,
      interactionType: 'dialogue',
      context: { choiceId: GUILD_PRIORITY_ID, selectedResponse: 'acknowledge' },
    })).unwrap();
    expect(allowedGuild.success).toBe(true);

    const guildStandingBeforeRelationshipControl = selectFactionReputation(
      store.getState(),
      MERCHANTS_GUILD
    );
    const blockedInterpersonal = await store.dispatch(processNPCInteractionThunk({
      npcId: GRONK_ID,
      interactionType: 'dialogue',
      context: { choiceId: 'gronk_blade_held', selectedResponse: 'recognize' },
    })).unwrap();
    expect(blockedInterpersonal.success).toBe(false);
    expect(blockedInterpersonal.message).toContain('Missing relationship evidence');

    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId: 'gronk_exp_quality_over_finish',
    })).unwrap();
    expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD))
      .toBe(guildStandingBeforeRelationshipControl);

    const allowedInterpersonal = await store.dispatch(processNPCInteractionThunk({
      npcId: GRONK_ID,
      interactionType: 'dialogue',
      context: { choiceId: 'gronk_blade_held', selectedResponse: 'recognize' },
    })).unwrap();
    expect(allowedInterpersonal.success).toBe(true);
  });

  test('faction divergence persists, missing legacy faction state is neutral, and new-game reset clears it', async () => {
    const store = makeStore();
    await seedProductionRuntime(store);

    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId: 'valerius_exp_m23_public_override',
    })).unwrap();
    store.dispatch(adjustFactionReputation({ factionId: CITY_WATCH, amount: -10 }));
    store.dispatch(adjustFactionReputation({ factionId: MERCHANTS_GUILD, amount: 12 }));

    const valeriusBeforeSave = clone(selectBondProfileByNpcId(store.getState(), VALERIUS_ID));
    const saveId = createSave(store.getState(), 'm23 faction divergence');
    expect(saveId).toBeTruthy();

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));
    expect(selectFactionReputation(resumed.getState(), CITY_WATCH)).toBe(-10);
    expect(selectFactionReputation(resumed.getState(), MERCHANTS_GUILD)).toBe(12);
    expect(selectBondProfileByNpcId(resumed.getState(), VALERIUS_ID)).toEqual(valeriusBeforeSave);

    const legacyLikeState: any = clone(resumed.getState());
    delete legacyLikeState.factions;
    const legacyLikeStore = makeStore();
    legacyLikeStore.dispatch(replaceState(legacyLikeState));
    expect(selectFactionReputation(legacyLikeStore.getState(), CITY_WATCH)).toBe(0);
    expect(selectFactionReputation(legacyLikeStore.getState(), MERCHANTS_GUILD)).toBe(0);
    expect(
      legacyLikeStore.getState().relationships.experiencesById.valerius_exp_m23_public_override
    ).toBeDefined();

    resumed.dispatch(resetPlayerState());
    expect(selectFactionReputation(resumed.getState(), CITY_WATCH)).toBe(0);
    expect(selectFactionReputation(resumed.getState(), MERCHANTS_GUILD)).toBe(0);
  });

  test('existing faction-tagged City Watch quest reward no longer mutates giver personal state', async () => {
    const store = makeStore();
    await seedProductionRuntime(store);

    const patrolQuest = clone(quests[PATROL_QUEST_ID]);
    patrolQuest.status = 'READY_TO_COMPLETE';
    patrolQuest.selectedResolutionId = 'report_plainly';
    store.dispatch(addQuest(patrolQuest));
    store.dispatch(setSelectedNPCId(VALERIUS_ID));

    const affinityBefore = store.getState().npcs.npcs[VALERIUS_ID].affinity;
    const relationshipsBefore = clone(store.getState().relationships);
    const knowledgeBefore = clone(store.getState().knowledge);

    await store.dispatch(turnInQuestThunk(PATROL_QUEST_ID)).unwrap();

    expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(10);
    expect(store.getState().npcs.npcs[VALERIUS_ID].affinity).toBe(affinityBefore);
    expect(store.getState().relationships).toEqual(relationshipsBefore);
    expect(store.getState().knowledge).toEqual(knowledgeBefore);
    expect(store.getState().quest.quests[PATROL_QUEST_ID].status).toBe('COMPLETED');
  });

  test('M23 runtime does not activate dormant faction spillover or M24 world-state authority', () => {
    for (const sourceFile of [
      'src/features/Factions/state/FactionSlice.ts',
      'src/features/Factions/state/FactionSelectors.ts',
      'src/features/NPCs/state/NPCThunks.ts',
      'src/features/Quest/state/QuestThunks.ts',
    ]) {
      expect(fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8'))
        .not.toContain('calculateSpillover');
    }

    const store = makeStore();
    expect((store.getState() as any).worldState).toBeUndefined();
    expect((store.getState() as any).factionDiplomacy).toBeUndefined();
  });
});
