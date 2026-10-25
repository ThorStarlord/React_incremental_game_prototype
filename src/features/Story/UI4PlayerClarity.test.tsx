import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer } from '../../app/store';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';
import { setLocation } from '../Player/state/PlayerSlice';
import { CITY_CENTER_LOCATION_ID, CITY_GATE_LOCATION_ID, MERCHANT_DISTRICT_LOCATION_ID } from '../Exploration/LocationDefinitions';
import { resetWorldState, setWorldStateCondition } from '../WorldState/state/WorldStateSlice';
import { CurrentMomentPanel } from './components/CurrentMomentPanel';
import { selectCurrentMoment } from './CurrentMomentSelectors';
import fs from 'fs';
import path from 'path';

afterEach(cleanup);
const makeStore = () => configureStore({ reducer: rootReducer });

test('Willow guidance preserves legal manual travel and illustrates the known place', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
  const moment = selectCurrentMoment(store.getState());
  expect(moment.actions[0].label).toBe('Find Elder Willow');
  expect(moment.actions[0].to).toBe('/game/dashboard#travel-controls');
  render(<Provider store={store}><MemoryRouter><CurrentMomentPanel /></MemoryRouter></Provider>);
  expect(screen.getByTestId('location-vignette')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Find Elder Willow' })).toHaveAttribute('href', '/game/dashboard#travel-controls');
  expect(screen.getByText('What you can do next')).toBeInTheDocument();
  store.dispatch(setLocation(CITY_GATE_LOCATION_ID));
  expect(selectCurrentMoment(store.getState()).actions[0].description).toMatch(/Whispering Woods/);
});

test('UI prose does not expose historical internal implementation terminology', () => {
  const files = [
    'src/features/Story/components/CurrentMomentPanel.tsx',
    'src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx',
    'src/features/Story/components/PlayerInsightPanel.tsx',
  ];
  const text = files.map(file => fs.readFileSync(path.join(process.cwd(), file), 'utf8')).join('\n');
  expect(text).not.toMatch(/No authored conversation topics|No player-visible relationship history|Campaign One ceiling:/);
  expect(text).toContain('A shared experience or a change in circumstances');
});

test('decorative art does not imply an unknown NPC or an unsupported travel location', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'src/features/Story/components/LocationVignette.tsx'), 'utf8');
  expect(source).toContain("locationName === 'City Center'");
  expect(source).toContain("locationName === 'Whispering Woods'");
  expect(source).toContain('if (!scene) return null');
});

test('the Merchant District describes only recorded local conditions, without inventing new actions', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(MERCHANT_DISTRICT_LOCATION_ID));
  const before = selectCurrentMoment(store.getState());
  expect(before.locationDescription).toContain('Crowded trade streets');
  expect(before.locationDescription).not.toMatch(/Watch patrols are a much more visible presence|Trade is lively/);

  store.dispatch(setWorldStateCondition({
    regionId: MERCHANT_DISTRICT_LOCATION_ID, field: 'watchPresence', value: 'heavy',
  }));
  store.dispatch(setWorldStateCondition({
    regionId: MERCHANT_DISTRICT_LOCATION_ID, field: 'tradeFlow', value: 'strong',
  }));
  const after = selectCurrentMoment(store.getState());
  expect(after.locationDescription).toContain('Watch patrols are a much more visible presence');
  expect(after.locationDescription).toContain('Trade is lively, with carts and stalls busy');
  // Merely describing a known state must not create extra travel links or tasks.
  expect(after.actions).toEqual(before.actions);

  render(<Provider store={store}><MemoryRouter><CurrentMomentPanel /></MemoryRouter></Provider>);
  expect(screen.getByText(/Watch patrols are a much more visible presence/)).toBeInTheDocument();
});

test('Merchant District description is local and cleared by the existing World State reset', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setWorldStateCondition({
    regionId: MERCHANT_DISTRICT_LOCATION_ID, field: 'watchPresence', value: 'heavy',
  }));
  // Conditions in a different location must not leak into that place's description.
  store.dispatch(setLocation(CITY_CENTER_LOCATION_ID));
  expect(selectCurrentMoment(store.getState()).locationDescription).not.toMatch(/Watch patrols are a much more visible presence/);

  store.dispatch(setLocation(MERCHANT_DISTRICT_LOCATION_ID));
  expect(selectCurrentMoment(store.getState()).locationDescription).toMatch(/Watch patrols are a much more visible presence/);
  store.dispatch(resetWorldState());
  expect(selectCurrentMoment(store.getState()).locationDescription).not.toMatch(/Watch patrols are a much more visible presence/);
});

test('recorded normal conditions are described without implying a prior player choice', () => {
  const store = makeStore();
  store.dispatch(setHasSeenIntro(true));
  store.dispatch(setLocation(MERCHANT_DISTRICT_LOCATION_ID));
  store.dispatch(setWorldStateCondition({
    regionId: MERCHANT_DISTRICT_LOCATION_ID, field: 'watchPresence', value: 'normal',
  }));
  store.dispatch(setWorldStateCondition({
    regionId: MERCHANT_DISTRICT_LOCATION_ID, field: 'tradeFlow', value: 'normal',
  }));
  const description = selectCurrentMoment(store.getState()).locationDescription;
  expect(description).toContain('Watch patrols follow their customary routes');
  expect(description).toContain('Trade moves at its usual pace');
  expect(description).not.toMatch(/Watch patrols are a much more visible presence|Trade is lively/);
});
