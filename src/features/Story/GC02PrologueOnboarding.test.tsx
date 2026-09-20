import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer, replaceState } from '../../app/store';
import { setHasSeenIntro } from '../Meta/state/MetaSlice';
import { setLocation } from '../Player/state/PlayerSlice';
import { recordRelationshipExperience } from '../Relationships/state/RelationshipSlice';
import { createSave, loadSavedGameWithMigration } from '../../shared/utils/saveUtils';
import {
  CITY_CENTER_LOCATION_ID,
  WHISPERING_WOODS_LOCATION_ID,
} from '../Exploration/LocationDefinitions';
import {
  GC02_FIRST_LESSON_EXPERIENCE_ID,
  PrologueObjectivePanel,
  derivePrologueStage,
} from './components/PrologueObjectivePanel';

const WILLOW_ID = 'npc_elder_willow';

const makeStore = () => configureStore({ reducer: rootReducer });

const firstLessonExperience = {
  id: GC02_FIRST_LESSON_EXPERIENCE_ID,
  uniqueKey: 'willow:we02:first-lesson',
  title: 'The First Lesson',
  primaryTargetId: WILLOW_ID,
  participantIds: ['player', WILLOW_ID],
  sourceType: 'dialogue',
  significance: 'meaningful',
  relationshipEffects: { trust: 2, understanding: 6, sharedMeaning: 3 },
  connectionProgressDelta: 8,
  resonanceTags: ['Wisdom', 'PatternRecognition'],
  memoryCandidate: false,
  timestamp: 90000,
} as any;

const unrelatedExperience = {
  ...firstLessonExperience,
  id: 'unrelated_relationship_evidence',
  uniqueKey: 'unrelated:experience',
  title: 'Unrelated evidence',
} as any;

const renderPanel = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <PrologueObjectivePanel />
      </MemoryRouter>
    </Provider>
  );

afterEach(() => {
  cleanup();
  localStorage.clear();
  jest.restoreAllMocks();
});

describe('GC-02 Prologue / onboarding vertical path', () => {
  test('rejects intro completion, location arrival, and unrelated relationship evidence as prologue completion', () => {
    expect(derivePrologueStage({
      hasSeenIntro: false,
      playerLocation: CITY_CENTER_LOCATION_ID,
      hasFirstLesson: false,
    })).toBe('INTRO');

    expect(derivePrologueStage({
      hasSeenIntro: true,
      playerLocation: CITY_CENTER_LOCATION_ID,
      hasFirstLesson: false,
    })).toBe('FIND_WILLOW');

    expect(derivePrologueStage({
      hasSeenIntro: true,
      playerLocation: WHISPERING_WOODS_LOCATION_ID,
      hasFirstLesson: false,
    })).toBe('SPEAK_WITH_WILLOW');

    const store = makeStore();
    store.dispatch(setHasSeenIntro(true));
    store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
    store.dispatch(recordRelationshipExperience(unrelatedExperience));
    renderPanel(store);

    expect(screen.getByText('Prologue — Speak with Elder Willow')).toBeInTheDocument();
    expect(screen.queryByText('Prologue complete')).not.toBeInTheDocument();
  });

  test('projects one clear ordinary-UI objective from fresh play through Willow relationship evidence to Chapter 1', () => {
    const store = makeStore();
    store.dispatch(setHasSeenIntro(true));

    renderPanel(store);
    expect(screen.getByText('Prologue — Find Elder Willow')).toBeInTheDocument();
    expect(screen.getByText(/City Center → City Gate → Whispering Woods/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open travel controls' })).toHaveAttribute(
      'href',
      '/game/dashboard'
    );

    cleanup();
    store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
    renderPanel(store);
    expect(screen.getByText('Prologue — Speak with Elder Willow')).toBeInTheDocument();
    expect(screen.getByText(/Dialogue.*First Lesson/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open Elder Willow' })).toHaveAttribute(
      'href',
      '/game/npcs/npc_elder_willow'
    );

    cleanup();
    store.dispatch(recordRelationshipExperience(firstLessonExperience));
    renderPanel(store);
    expect(screen.getByText('Prologue complete')).toBeInTheDocument();
    expect(screen.getByText(/The First Lesson is remembered in your Relationship history/)).toBeInTheDocument();
    expect(screen.getByText(/Next: Merchant District Crisis/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue toward Merchant District' })).toHaveAttribute(
      'href',
      '/game/dashboard'
    );
  });

  test('persistent first-lesson evidence survives save/load and preserves the Chapter 1 handoff', async () => {
    const store = makeStore();
    store.dispatch(setHasSeenIntro(true));
    store.dispatch(setLocation(WHISPERING_WOODS_LOCATION_ID));
    store.dispatch(recordRelationshipExperience(firstLessonExperience));

    jest.spyOn(Date, 'now').mockReturnValue(91000);
    const saveId = createSave(store.getState(), 'GC-02 prologue save');
    expect(saveId).toBe('save_91000');

    const loaded = await loadSavedGameWithMigration(saveId!);
    expect(loaded).not.toBeNull();

    const resumedStore = makeStore();
    resumedStore.dispatch(replaceState(loaded!.state));
    expect(
      resumedStore.getState().relationships.experiencesById[GC02_FIRST_LESSON_EXPERIENCE_ID]
    ).toBeDefined();

    renderPanel(resumedStore);
    expect(screen.getByText('Prologue complete')).toBeInTheDocument();
    expect(screen.getByText(/Next: Merchant District Crisis/)).toBeInTheDocument();
  });

  test('production wiring keeps the prologue in ordinary UI and preserves the Willow-only New Game seed', () => {
    const gameLayoutSource = fs.readFileSync(
      path.join(process.cwd(), 'src/layout/components/GameLayout.tsx'),
      'utf8'
    );
    expect(gameLayoutSource).toContain('PrologueObjectivePanel');
    expect(gameLayoutSource.indexOf('<PrologueObjectivePanel')).toBeLessThan(
      gameLayoutSource.indexOf('<Outlet />')
    );

    const newGameSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/MainMenu/hooks/useGameActions.ts'),
      'utf8'
    );
    expect(newGameSource).toContain('newGameSeedNPCsThunk');
    expect(newGameSource).toContain("navigate('/game/npcs')");
    expect(newGameSource).not.toContain("navigate('/game/debug')");

    const appSource = fs.readFileSync(path.join(process.cwd(), 'src/App.tsx'), 'utf8');
    expect(appSource).toContain('dispatch(initializeNPCsThunk())');

    const npcListSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/NPCs/components/containers/NPCListView.tsx'),
      'utf8'
    );
    expect(npcListSource).not.toContain('initializeNPCsThunk');
  });
});
