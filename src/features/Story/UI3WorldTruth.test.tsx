import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { rootReducer } from '../../app/store';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';
import { setLocation } from '../Player/state/PlayerSlice';
import { setNPCs, setDialogueNodes } from '../NPCs/state/NPCSlice';
import { CITY_CENTER_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { recordRelationshipExperience } from '../Relationships/state/RelationshipSlice';
import { selectCurrentMoment } from './CurrentMomentSelectors';
import NPCPanelContainer from '../NPCs/components/containers/NPCPanelContainer';

afterEach(cleanup);
const makeStore = () => configureStore({ reducer: rootReducer });

test('unanchored story characters are not represented as physically present or leaked in Prologue', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
  store.dispatch(setNPCs({
    npc_scholar_elara: {
      id: 'npc_scholar_elara', name: 'Scholar Elara', location: 'Grand Library - Archives',
      isDiscovered: true, availableDialogues: ['elara_topic'], completedDialogues: [],
    } as any,
  }));
  store.dispatch(setDialogueNodes({
    elara_topic: { id: 'elara_topic', title: 'Archives', text: 'An open question.', repeatable: true, responses: {} },
  }));
  // Even a deliberately seeded future contact cannot bypass the prologue
  // visibility gate, although the legacy story route remains unchanged.
  expect(selectCurrentMoment(store.getState()).storyContacts).toEqual([]);
  store.dispatch(recordRelationshipExperience({
    id: 'willow_exp_first_lesson', uniqueKey: 'first_lesson', title: 'The First Lesson',
    primaryTargetId: 'npc_elder_willow', participantIds: ['player', 'npc_elder_willow'],
    sourceType: 'dialogue', significance: 'meaningful', relationshipEffects: {},
    resonanceTags: [], timestamp: Date.now(), memoryCandidate: false,
  } as any));
  const contacts = selectCurrentMoment(store.getState()).storyContacts;
  expect(contacts).toHaveLength(1);
  expect(contacts[0].to).toBe('/game/npcs/npc_scholar_elara?view=dialogue');
  expect(contacts[0].description).toMatch(/not established/i);
  expect(selectCurrentMoment(store.getState()).situation).toMatch(/Merchant District.*pressure/);
  expect(selectCurrentMoment(store.getState()).actions.some(action => action.label.includes('Scholar Elara'))).toBe(false);
});

test('unanchored NPC profile never claims verified physical presence', () => {
  const store = makeStore();
  store.dispatch(setNPCs({
    npc_scholar_elara: {
      id: 'npc_scholar_elara', name: 'Scholar Elara', location: 'Grand Library - Archives',
      isDiscovered: true, affinity: 0, connectionDepth: 0, availableDialogues: [],
      completedDialogues: [],
    } as any,
  }));
  render(<Provider store={store}><MemoryRouter initialEntries={['/game/npcs/npc_scholar_elara']}>
    <Routes><Route path="/game/npcs/:npcId" element={<NPCPanelContainer />} /></Routes>
  </MemoryRouter></Provider>);
  expect(screen.getByTestId('npc-unanchored-story-location')).toHaveTextContent('no confirmed position');
  expect(screen.getByText(/Story contact — Grand Library/)).toBeInTheDocument();
  expect(screen.queryByText(/Present — Grand Library/)).not.toBeInTheDocument();
});

test('Current Moment never displays the internal chapter ontology string', () => {
  const source = require('fs').readFileSync(require('path').join(process.cwd(), 'src/features/Story/CurrentMomentSelectors.ts'), 'utf8');
  expect(source).not.toContain('currentChapter?.title}: ${chapterIdentity.centerOfGravity}');
  expect(source).toContain('storyContacts');
  expect(source).toContain('chapterIdentity?.playerSituation');
});
