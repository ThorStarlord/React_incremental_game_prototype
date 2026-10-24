import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer } from '../../app/store';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';
import { setLocation } from '../Player/state/PlayerSlice';
import { setNPCs, setDialogueNodes } from '../NPCs/state/NPCSlice';
import { addQuest } from '../Quest/state/QuestSlice';
import { recordRelationshipExperience } from '../Relationships/state/RelationshipSlice';
import { CITY_CENTER_LOCATION_ID, CITY_GATE_LOCATION_ID, WHISPERING_WOODS_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { selectCurrentMoment } from './CurrentMomentSelectors';
import { selectOpenCopyExceptions } from './PlayerInsightSelectors';
import { CurrentMomentPanel } from './components/CurrentMomentPanel';
import { SessionStatusStrip } from '../../layout/components/SessionStatusStrip';
import NPCDialogueTab from '../NPCs/components/ui/tabs/NPCDialogueTab';

const makeStore = () => configureStore({ reducer: rootReducer });
afterEach(cleanup);

test('initial situation does not invent contacts or expose future narrative route decisions', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
  const moment = selectCurrentMoment(store.getState());
  expect(moment.locationName).toBe('City Center');
  expect(moment.actions[0].label).toBe('Find Elder Willow');
  expect(moment.actions[0].description).toMatch(/City Gate/);
  expect(moment.actions[0].to).toBe('/game/dashboard#travel-controls');
  expect(moment.consequences).toHaveLength(0);
  expect(moment.actions.some(action => /Lyra|Elara/.test(action.label))).toBe(false);
});

test('the Willow route hint follows the legal next step without granting travel or revealing another contact', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(CITY_GATE_LOCATION_ID));
  const moment = selectCurrentMoment(store.getState());
  expect(moment.actions[0].description).toMatch(/Whispering Woods/);
  expect(moment.actions[0].to).toBe('/game/dashboard#travel-controls');
  expect(moment.storyContacts).toEqual([]);
});

test('a known nearby contact without an available topic is inspectable but not falsely advertised as a conversation', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
  store.dispatch(setNPCs({
    npc_elder_willow: { id: 'npc_elder_willow', name: 'Elder Willow', isDiscovered: true, availableDialogues: [], completedDialogues: [] } as any,
  }));
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CurrentMomentPanel />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText('Current Moment')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Review Elder Willow' })).toHaveAttribute(
    'href',
    '/game/npcs/npc_elder_willow'
  );
  expect(screen.queryByRole('link', { name: 'Talk with Elder Willow' })).not.toBeInTheDocument();
  expect(screen.queryByText(/Lyra/)).not.toBeInTheDocument();
});


test('an authored, currently available nearby conversation offers a direct dialogue link', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
  store.dispatch(setNPCs({
    npc_elder_willow: {
      id: 'npc_elder_willow', name: 'Elder Willow', isDiscovered: true,
      availableDialogues: ['test_willow_intro'], completedDialogues: [],
    } as any,
  }));
  store.dispatch(setDialogueNodes({
    test_willow_intro: { id: 'test_willow_intro', title: 'The First Greeting', text: 'Welcome.', repeatable: true, responses: {} },
  }));
  const moment = selectCurrentMoment(store.getState());
  expect(moment.actions.find(action => action.id === 'prologue-willow')).toEqual(expect.objectContaining({
    label: 'Talk with Elder Willow', to: '/game/npcs/npc_elder_willow?view=dialogue',
  }));
});


test('Current Moment cannot disclose an undiscovered canonical NPC even when their authored location is here', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
  store.dispatch(setNPCs({
    npc_elder_willow: { id: 'npc_elder_willow', name: 'Elder Willow', availableDialogues: [], completedDialogues: [] } as any,
  }));
  const state = store.getState();
  const unrevealed = {
    ...state,
    npcs: {
      ...state.npcs,
      npcs: {
        ...state.npcs.npcs,
        // Gronk has a real City Center world anchor, but is not discovered.
        npc_blacksmith_gronk: {
          id: 'npc_blacksmith_gronk', name: 'Gronk the Blacksmith',
          availableDialogues: [], completedDialogues: [],
        } as any,
      },
      discoveredNPCs: ['npc_elder_willow'],
    },
  };
  const moment = selectCurrentMoment(unrevealed);
  expect(moment.actions.some(action => action.label.includes('Gronk'))).toBe(false);
});

test('global session status points to active timed quests rather than silently ticking off-screen', () => {
  const store = makeStore();
  store.dispatch(addQuest({
    id: 'known_timed_quest', title: 'The Watch Deadline', status: 'IN_PROGRESS',
    timeLimitSeconds: 60, elapsedSeconds: 15,
    objectives: [], rewards: [], prerequisites: [],
  } as any));
  render(
    <Provider store={store}>
      <MemoryRouter><SessionStatusStrip /></MemoryRouter>
    </Provider>
  );
  expect(screen.getByRole('link', { name: /The Watch Deadline: 45s left/ })).toHaveAttribute(
    'href',
    '/game/quests?quest=known_timed_quest'
  );
});

test('authored NPC dialogue does not advertise a free-text conversation engine', () => {
  const store = makeStore();
  store.dispatch(setNPCs({
    npc_elder_willow: { id: 'npc_elder_willow', name: 'Elder Willow', availableDialogues: [], completedDialogues: [] } as any,
  }));
  render(
    <Provider store={store}>
      <NPCDialogueTab npcId="npc_elder_willow" />
    </Provider>
  );
  expect(screen.queryByPlaceholderText(/Type a message/i)).not.toBeInTheDocument();
  expect(screen.getByText(/No authored conversation topics are available/)).toBeInTheDocument();
});


test('the first authored conversation appears as recorded history without inventing a Memory', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setNPCs({
    npc_elder_willow: { id: 'npc_elder_willow', name: 'Elder Willow', availableDialogues: [], completedDialogues: [] } as any,
  }));
  store.dispatch(recordRelationshipExperience({
    id: 'first_lesson_experience_test',
    uniqueKey: 'willow:ux:first-lesson',
    title: 'The First Lesson',
    primaryTargetId: 'npc_elder_willow',
    participantIds: ['player', 'npc_elder_willow'],
    sourceType: 'dialogue',
    significance: 'meaningful',
    relationshipEffects: { trust: 2, understanding: 6, sharedMeaning: 3 },
    connectionProgressDelta: 8,
    resonanceTags: ['Wisdom'],
    memoryCandidate: false,
    timestamp: 90000,
  } as any));
  const moment = selectCurrentMoment(store.getState());
  expect(moment.consequences.some(change => change.title === 'The First Lesson')).toBe(true);
  expect(Object.values(store.getState().relationships.memoriesById)).toHaveLength(0);
});

test('Current Moment does not churn its view model when only a raw GameLoop tick changes', () => {
  const store = makeStore();
  const first = selectCurrentMoment(store.getState());
  const snapshot = store.getState();
  const afterUnrelatedTick = {
    ...snapshot,
    gameLoop: { ...snapshot.gameLoop, currentTick: snapshot.gameLoop.currentTick + 1 },
  };
  expect(selectCurrentMoment(afterUnrelatedTick)).toBe(first);
});

test('read-only Copy exception projection keeps its identity across unrelated simulation ticks', () => {
  const store = makeStore();
  const root = store.getState();
  const before = selectOpenCopyExceptions(root);
  const after = selectOpenCopyExceptions({
    ...root,
    gameLoop: { ...root.gameLoop, currentTick: root.gameLoop.currentTick + 1 },
  });
  expect(after).toBe(before);
});
