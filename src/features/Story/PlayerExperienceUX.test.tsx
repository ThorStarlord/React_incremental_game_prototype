import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer } from '../../app/store';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';
import { setLocation } from '../Player/state/PlayerSlice';
import { setNPCs } from '../NPCs/state/NPCSlice';
import { addQuest } from '../Quest/state/QuestSlice';
import { CITY_CENTER_LOCATION_ID, WHISPERING_WOODS_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { selectCurrentMoment } from './CurrentMomentSelectors';
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
  expect(moment.actions[0].to).toBe('/game/dashboard#travel-controls');
  expect(moment.consequences).toHaveLength(0);
  expect(moment.actions.some(action => /Lyra|Elara/.test(action.label))).toBe(false);
});

test('an authored known contact at the current location offers a direct dialogue link', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
  store.dispatch(setNPCs({
    npc_elder_willow: { id: 'npc_elder_willow', name: 'Elder Willow', availableDialogues: [], completedDialogues: [] } as any,
  }));
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CurrentMomentPanel />
      </MemoryRouter>
    </Provider>
  );
  expect(screen.getByText('Current Moment')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Talk with Elder Willow' })).toHaveAttribute(
    'href',
    '/game/npcs/npc_elder_willow?view=dialogue'
  );
  expect(screen.queryByText(/Lyra/)).not.toBeInTheDocument();
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
