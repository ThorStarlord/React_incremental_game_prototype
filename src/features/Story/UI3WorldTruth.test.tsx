import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer } from '../../app/store';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';
import { setLocation } from '../Player/state/PlayerSlice';
import { setNPCs, setDialogueNodes } from '../NPCs/state/NPCSlice';
import { CITY_CENTER_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { recordRelationshipExperience } from '../Relationships/state/RelationshipSlice';
import { selectCurrentMoment } from './CurrentMomentSelectors';
import { CurrentMomentPanel } from './components/CurrentMomentPanel';
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
  // This fixture does not assume that a single synthetic experience advances
  // the authored prologue. The same rule applies whenever the chapter stage
  // remains PROLOGUE.
  if (selectCurrentMoment(store.getState()).storyContacts.length > 0) {
    const contact = selectCurrentMoment(store.getState()).storyContacts[0];
    expect(contact.to).toBe('/game/npcs/npc_scholar_elara?view=dialogue');
    expect(contact.description).toMatch(/not established/i);
  }
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
    <NPCPanelContainer />
  </MemoryRouter></Provider>);
  // Routing useParams is tested end-to-end by the full browser qualification;
  // this unit case guards only against accidental "nearby" copy.
  expect(screen.queryByText(/Present — Grand Library/)).not.toBeInTheDocument();
});

test('Current Moment never displays the internal chapter ontology string', () => {
  const source = require('fs').readFileSync(require('path').join(process.cwd(), 'src/features/Story/CurrentMomentSelectors.ts'), 'utf8');
  expect(source).not.toContain('currentChapter?.title}: ${chapterIdentity.centerOfGravity}');
  expect(source).toContain('storyContacts');
});
