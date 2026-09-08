import fs from 'fs';
import path from 'path';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { rootReducer, replaceState } from '../../app/store';
import { setWorldStateCondition } from './state/WorldStateSlice';
import {
  selectTradeFlow,
  selectWatchPresence,
} from './state/WorldStateSelectors';
import { adjustFactionReputation } from '../Factions/state/FactionSlice';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';
import { setNPCs, setDialogueNodes } from '../NPCs/state/NPCSlice';
import {
  initializeNPCsThunk,
  processNPCInteractionThunk,
} from '../NPCs/state/NPCThunks';
import NPCDialogueTab from '../NPCs/components/ui/tabs/NPCDialogueTab';
import {
  initializeRelationshipRuntimeThunk,
  recordAuthoredRelationshipExperienceThunk,
} from '../Relationships/state/RelationshipThunks';
import { resetPlayerState } from '../Player/state/PlayerSlice';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import { MERCHANT_DISTRICT_LOCATION_ID } from '../Exploration/LocationDefinitions';

const CITY_WATCH = 'City Watch';
const MERCHANTS_GUILD = 'Merchants Guild';
const VALERIUS_ID = 'npc_captain_valerius';
const GRONK_ID = 'npc_blacksmith_gronk';
const SILAS_ID = 'npc_rogue_silas';

const PATROL_MUTATION_ID = 'valerius_m24_redeploy_patrols';
const PATROL_CONSUMER_ID = 'silas_m24_patrol_pressure';
const FREIGHT_MUTATION_ID = 'gronk_m24_release_verified_freight';
const FREIGHT_CONSUMER_ID = 'valerius_m24_freight_corridor';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const manifest = readJson('public/data/relationships/index.json');
const baseNpcs = readJson('public/data/npcs.json');
const baseDialogues = readJson('public/data/dialogues.json');
const m24Content = readJson('public/data/m24-world-state-content.json');
const bundleByUrl: Record<string, any> = Object.fromEntries(
  manifest.bundles.map((url: string) => [url, readJson(`public${url}`)])
);

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const buildM24ProductionContent = () => {
  const npcs = clone(baseNpcs);
  for (const [npcId, dialogueIds] of Object.entries(m24Content.npcDialogueIds) as Array<[
    string,
    string[]
  ]>) {
    npcs[npcId].availableDialogues = Array.from(new Set([
      ...(npcs[npcId].availableDialogues ?? []),
      ...dialogueIds,
    ]));
  }

  return {
    npcs,
    dialogues: {
      ...clone(baseDialogues),
      ...clone(m24Content.dialogues),
    },
  };
};

const productionContent = buildM24ProductionContent();

const makeStore = () => configureStore({ reducer: rootReducer });
type TestStore = ReturnType<typeof makeStore>;

const seedProductionRuntime = async (store: TestStore) => {
  store.dispatch(setNPCs(productionContent.npcs));
  store.dispatch(setDialogueNodes(productionContent.dialogues));
  await store.dispatch(
    initializeRelationshipRuntimeThunk({ seedProfiles: true })
  ).unwrap();
};

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
    if (url === '/data/npcs.json') {
      return { ok: true, json: async () => clone(baseNpcs) } as any;
    }
    if (url === '/data/dialogues.json') {
      return { ok: true, json: async () => clone(baseDialogues) } as any;
    }
    if (url === '/data/m24-world-state-content.json') {
      return { ok: true, json: async () => clone(m24Content) } as any;
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

describe('M24 objective world state qualification', () => {
  test('Rule-of-Two production probes mutate and consume two independent objective conditions below UI', async () => {
    const store = makeStore();
    await seedProductionRuntime(store);

    expect(selectWatchPresence(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
    expect(selectTradeFlow(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');

    const blockedPatrolConsumer = await store.dispatch(processNPCInteractionThunk({
      npcId: SILAS_ID,
      interactionType: 'dialogue',
      context: { choiceId: PATROL_CONSUMER_ID, selectedResponse: 'acknowledge' },
    })).unwrap();
    expect(blockedPatrolConsumer.success).toBe(false);
    expect(blockedPatrolConsumer.message).toContain('World state gate not met');

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={SILAS_ID} />
      </Provider>
    );
    expect(screen.queryByText('Too Many Uniforms for the Old Route')).not.toBeInTheDocument();
    cleanup();

    const prematurePatrolMutation = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: PATROL_MUTATION_ID, selectedResponse: 'redeploy' },
    })).unwrap();
    expect(prematurePatrolMutation.success).toBe(false);
    expect(prematurePatrolMutation.message).toContain('Missing relationship evidence');
    expect(selectWatchPresence(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');

    await store.dispatch(recordAuthoredRelationshipExperienceThunk({
      experienceId: 'valerius_exp_m23_public_override',
    })).unwrap();

    const relationshipsBeforePatrol = clone(store.getState().relationships);
    const factionsBeforePatrol = clone(store.getState().factions);
    const knowledgeBeforePatrol = clone(store.getState().knowledge);
    const questBeforePatrol = clone(store.getState().quest);
    const locationBeforePatrol = store.getState().player.location;

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={VALERIUS_ID} />
      </Provider>
    );
    expect(screen.getByText('Patrols Where the Threat Actually Is')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {
      name: /Redeploy the mobile teams through the Merchant District freight corridors/i,
    }));

    await waitFor(() => {
      expect(selectWatchPresence(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('heavy');
    });
    expect(selectTradeFlow(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
    expect(store.getState().relationships).toEqual(relationshipsBeforePatrol);
    expect(store.getState().factions).toEqual(factionsBeforePatrol);
    expect(store.getState().knowledge).toEqual(knowledgeBeforePatrol);
    expect(store.getState().quest).toEqual(questBeforePatrol);
    expect(store.getState().player.location).toBe(locationBeforePatrol);
    cleanup();

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={SILAS_ID} />
      </Provider>
    );
    expect(screen.getByText('Too Many Uniforms for the Old Route')).toBeInTheDocument();
    const allowedPatrolConsumer = await store.dispatch(processNPCInteractionThunk({
      npcId: SILAS_ID,
      interactionType: 'dialogue',
      context: { choiceId: PATROL_CONSUMER_ID, selectedResponse: 'acknowledge' },
    })).unwrap();
    expect(allowedPatrolConsumer.success).toBe(true);
    cleanup();

    const blockedFreightMutation = await store.dispatch(processNPCInteractionThunk({
      npcId: GRONK_ID,
      interactionType: 'dialogue',
      context: { choiceId: FREIGHT_MUTATION_ID, selectedResponse: 'release' },
    })).unwrap();
    expect(blockedFreightMutation.success).toBe(false);
    expect(blockedFreightMutation.message).toContain('Faction reputation gate not met');

    store.dispatch(adjustFactionReputation({ factionId: MERCHANTS_GUILD, amount: 12 }));
    expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD)).toBe(12);
    expect(selectTradeFlow(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');

    const blockedFreightConsumer = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: FREIGHT_CONSUMER_ID, selectedResponse: 'acknowledge' },
    })).unwrap();
    expect(blockedFreightConsumer.success).toBe(false);
    expect(blockedFreightConsumer.message).toContain('World state gate not met');

    const relationshipsBeforeFreight = clone(store.getState().relationships);
    const factionsBeforeFreight = clone(store.getState().factions);
    const knowledgeBeforeFreight = clone(store.getState().knowledge);
    const questBeforeFreight = clone(store.getState().quest);
    const locationBeforeFreight = store.getState().player.location;

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={GRONK_ID} />
      </Provider>
    );
    expect(screen.getByText('Move the Contracts, Not Just the Numbers')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {
      name: /Route the reconciled manifests to the gate clerks/i,
    }));

    await waitFor(() => {
      expect(selectTradeFlow(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('strong');
    });
    expect(selectWatchPresence(store.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('heavy');
    expect(store.getState().relationships).toEqual(relationshipsBeforeFreight);
    expect(store.getState().factions).toEqual(factionsBeforeFreight);
    expect(store.getState().knowledge).toEqual(knowledgeBeforeFreight);
    expect(store.getState().quest).toEqual(questBeforeFreight);
    expect(store.getState().player.location).toBe(locationBeforeFreight);
    expect(selectFactionReputation(store.getState(), MERCHANTS_GUILD)).toBe(12);
    cleanup();

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={VALERIUS_ID} />
      </Provider>
    );
    expect(screen.getByText('Supplies Are Moving Again')).toBeInTheDocument();
    const allowedFreightConsumer = await store.dispatch(processNPCInteractionThunk({
      npcId: VALERIUS_ID,
      interactionType: 'dialogue',
      context: { choiceId: FREIGHT_CONSUMER_ID, selectedResponse: 'acknowledge' },
    })).unwrap();
    expect(allowedFreightConsumer.success).toBe(true);
  });

  test('World State persists, missing legacy state is neutral, and new-game reset clears regional conditions', async () => {
    const store = makeStore();
    await seedProductionRuntime(store);

    store.dispatch(setWorldStateCondition({
      regionId: MERCHANT_DISTRICT_LOCATION_ID,
      field: 'watchPresence',
      value: 'heavy',
    }));
    store.dispatch(setWorldStateCondition({
      regionId: MERCHANT_DISTRICT_LOCATION_ID,
      field: 'tradeFlow',
      value: 'strong',
    }));

    const relationshipsBeforeSave = clone(store.getState().relationships);
    const factionsBeforeSave = clone(store.getState().factions);
    const knowledgeBeforeSave = clone(store.getState().knowledge);
    const saveId = createSave(store.getState(), 'm24 objective world state');
    expect(saveId).toBeTruthy();

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumed = makeStore();
    resumed.dispatch(replaceState(loaded!.state));
    expect(selectWatchPresence(resumed.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('heavy');
    expect(selectTradeFlow(resumed.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('strong');
    expect(resumed.getState().relationships).toEqual(relationshipsBeforeSave);
    expect(resumed.getState().factions).toEqual(factionsBeforeSave);
    expect(resumed.getState().knowledge).toEqual(knowledgeBeforeSave);

    const legacyLikeState: any = clone(resumed.getState());
    delete legacyLikeState.worldState;
    const legacyLikeStore = makeStore();
    legacyLikeStore.dispatch(replaceState(legacyLikeState));
    expect(selectWatchPresence(legacyLikeStore.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
    expect(selectTradeFlow(legacyLikeStore.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
    expect(legacyLikeStore.getState().relationships).toEqual(relationshipsBeforeSave);
    expect(legacyLikeStore.getState().factions).toEqual(factionsBeforeSave);
    expect(legacyLikeStore.getState().knowledge).toEqual(knowledgeBeforeSave);

    resumed.dispatch(resetPlayerState());
    expect(selectWatchPresence(resumed.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
    expect(selectTradeFlow(resumed.getState(), MERCHANT_DISTRICT_LOCATION_ID)).toBe('normal');
  });

  test('production initialization merges the bounded M24 content extension without NPC-specific runtime branches', async () => {
    const store = makeStore();
    await store.dispatch(initializeNPCsThunk()).unwrap();

    expect(store.getState().npcs.npcs[VALERIUS_ID].availableDialogues).toEqual(
      expect.arrayContaining([PATROL_MUTATION_ID, FREIGHT_CONSUMER_ID])
    );
    expect(store.getState().npcs.npcs[SILAS_ID].availableDialogues).toContain(PATROL_CONSUMER_ID);
    expect(store.getState().npcs.npcs[GRONK_ID].availableDialogues).toContain(FREIGHT_MUTATION_ID);
    expect(store.getState().npcs.dialogueNodes?.[PATROL_MUTATION_ID]).toBeDefined();
    expect(store.getState().npcs.dialogueNodes?.[PATROL_CONSUMER_ID]).toBeDefined();
    expect(store.getState().npcs.dialogueNodes?.[FREIGHT_MUTATION_ID]).toBeDefined();
    expect(store.getState().npcs.dialogueNodes?.[FREIGHT_CONSUMER_ID]).toBeDefined();

    const source = fs.readFileSync(
      path.join(process.cwd(), 'src/features/NPCs/state/NPCThunks.ts'),
      'utf8'
    );
    expect(source).not.toContain("if (npcId === 'npc_captain_valerius')");
    expect(source).not.toContain("if (npcId === 'npc_blacksmith_gronk')");
    expect(source).not.toContain("if (npcId === 'npc_rogue_silas')");
  });

  test('malformed World State requirements fail closed and direct World State changes do not mirror into social domains', async () => {
    const store = makeStore();
    await seedProductionRuntime(store);

    const malformedId = 'm24_malformed_world_gate_control';
    const malformedNpcs = clone(productionContent.npcs);
    malformedNpcs[SILAS_ID].availableDialogues.push(malformedId);
    store.dispatch(setNPCs(malformedNpcs));
    store.dispatch(setDialogueNodes({
      ...productionContent.dialogues,
      [malformedId]: {
        id: malformedId,
        npcId: SILAS_ID,
        title: 'Malformed world gate control',
        repeatable: false,
        requiredWorldState: [{
          regionId: MERCHANT_DISTRICT_LOCATION_ID,
          field: 'unknownField',
          equals: 'heavy',
        }],
        responses: { continue: 'Continue' },
        effects: [],
        next: { continue: null },
      },
    } as any));

    const malformedResult = await store.dispatch(processNPCInteractionThunk({
      npcId: SILAS_ID,
      interactionType: 'dialogue',
      context: { choiceId: malformedId, selectedResponse: 'continue' },
    })).unwrap();
    expect(malformedResult.success).toBe(false);
    expect(malformedResult.message).toContain('World state gate not met');

    render(
      <Provider store={store}>
        <NPCDialogueTab npcId={SILAS_ID} />
      </Provider>
    );
    expect(screen.queryByText('Malformed world gate control')).not.toBeInTheDocument();
    cleanup();

    const relationshipsBefore = clone(store.getState().relationships);
    const factionsBefore = clone(store.getState().factions);
    const knowledgeBefore = clone(store.getState().knowledge);
    const questBefore = clone(store.getState().quest);
    const locationBefore = store.getState().player.location;

    store.dispatch(setWorldStateCondition({
      regionId: MERCHANT_DISTRICT_LOCATION_ID,
      field: 'watchPresence',
      value: 'heavy',
    }));

    expect(store.getState().relationships).toEqual(relationshipsBefore);
    expect(store.getState().factions).toEqual(factionsBefore);
    expect(store.getState().knowledge).toEqual(knowledgeBefore);
    expect(store.getState().quest).toEqual(questBefore);
    expect(store.getState().player.location).toBe(locationBefore);
  });

  test('M24 content stays inside the frozen two-field/no-simulation evidence ceiling', () => {
    const dialogues = m24Content.dialogues;
    expect(Object.keys(dialogues).sort()).toEqual([
      FREIGHT_CONSUMER_ID,
      FREIGHT_MUTATION_ID,
      PATROL_CONSUMER_ID,
      PATROL_MUTATION_ID,
    ].sort());

    expect(dialogues[PATROL_MUTATION_ID].effects).toEqual([expect.objectContaining({
      type: 'WORLD_STATE_SET',
      regionId: MERCHANT_DISTRICT_LOCATION_ID,
      field: 'watchPresence',
      value: 'heavy',
    })]);
    expect(dialogues[FREIGHT_MUTATION_ID].effects).toEqual([expect.objectContaining({
      type: 'WORLD_STATE_SET',
      regionId: MERCHANT_DISTRICT_LOCATION_ID,
      field: 'tradeFlow',
      value: 'strong',
    })]);

    for (const mutationId of [PATROL_MUTATION_ID, FREIGHT_MUTATION_ID]) {
      const effectTypes = dialogues[mutationId].effects.map((effect: any) => effect.type);
      expect(effectTypes).not.toContain('RELATIONSHIP_EXPERIENCE');
      expect(effectTypes).not.toContain('FACTION_REPUTATION');
      expect(effectTypes).not.toContain('KNOWLEDGE_FACT');
      expect(effectTypes).not.toContain('AFFINITY_DELTA');
    }

    for (const sourceFile of [
      'src/features/WorldState/state/WorldStateSlice.ts',
      'src/features/WorldState/state/WorldStateSelectors.ts',
      'src/features/NPCs/state/NPCThunks.ts',
    ]) {
      const source = fs.readFileSync(path.join(process.cwd(), sourceFile), 'utf8');
      expect(source).not.toContain('calculateSpillover');
      expect(source).not.toContain('processOffline');
      expect(source).not.toContain('territoryControl');
      expect(source).not.toContain('population');
    }

    const store = makeStore();
    expect((store.getState() as any).worldSimulation).toBeUndefined();
    expect((store.getState() as any).territoryControl).toBeUndefined();
    expect((store.getState() as any).m25ChapterState).toBeUndefined();
    expect(selectFactionReputation(store.getState(), CITY_WATCH)).toBe(0);
  });
});
