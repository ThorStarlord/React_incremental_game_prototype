import React from 'react';
import fs from 'fs';
import path from 'path';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { rootReducer } from '../app/store';
import { setSessionActive } from '../features/Meta/state/MetaSlice';
import { GameLayout } from './components/GameLayout';
import { GameSessionBar } from './components/GameSessionBar';
import {
  AUTOSAVE_NAME_PREFIX,
  createSave,
  getSavedGames,
  pruneAutosaves,
} from '../shared/utils/saveUtils';

/**
 * Release regression (SYNTHETIC_FINDING, 2026-10-20 RC qualification):
 * a reload dropped the player into the uninitialized startup world, autosave
 * persisted non-session state from the main menu, there was no in-game save
 * or way back to the main menu, and autosaves accumulated without bound.
 */

const makeStore = () => configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

const read = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe('game session lifecycle', () => {
  test('a fresh page has no active session', () => {
    expect(makeStore().getState().meta.sessionActive).toBe(false);
  });

  test('game routes without an active session return to the main menu', () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/game/npcs']}>
          <Routes>
            <Route path="/" element={<div>Main menu</div>} />
            <Route path="/game/*" element={<GameLayout />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Main menu')).toBeInTheDocument();
  });

  test('New Game and Load both establish the session', () => {
    const actions = read('src/pages/MainMenu/hooks/useGameActions.ts');
    const newGame = actions.slice(actions.indexOf('handleNewGame'), actions.indexOf('handleLoadGame'));
    const load = actions.slice(actions.indexOf('handleLoadGame'), actions.indexOf('handleContinue'));
    expect(newGame).toContain('dispatch(setSessionActive(true))');
    expect(load).toContain('dispatch(setSessionActive(true))');
  });

  test('autosave only runs during an active session and prunes its rolling set', () => {
    const autosave = read('src/gameLogic/systems/autosaveSystem.ts');
    expect(autosave).toContain('isAutosaveEnabled && sessionActive && autosaveIntervalMinutes > 0');
    expect(autosave).toContain('pruneAutosaves(AUTOSAVE_RETENTION - 1)');
  });
});

describe('in-game save actions', () => {
  test('Save Game writes a canonical save and reports it', async () => {
    const store = makeStore();
    store.dispatch(setSessionActive(true));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/game/dashboard']}>
          <GameSessionBar />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByRole('status')).toHaveTextContent('Not saved yet');
    fireEvent.click(screen.getByRole('button', { name: 'Save Game' }));
    await waitFor(() => expect(getSavedGames()).toHaveLength(1));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Last saved'));
  });

  test('Save & Main Menu saves and leaves the game routes', async () => {
    const store = makeStore();
    store.dispatch(setSessionActive(true));
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/game/dashboard']}>
          <Routes>
            <Route path="/" element={<div>Main menu</div>} />
            <Route path="/game/*" element={<GameSessionBar />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save & Main Menu' }));
    await waitFor(() => expect(screen.getByText('Main menu')).toBeInTheDocument());
    expect(getSavedGames()).toHaveLength(1);
  });

  test('leaving the page writes a rolling autosave', () => {
    const store = makeStore();
    store.dispatch(setSessionActive(true));
    render(
      <Provider store={store}>
        <MemoryRouter>
          <GameSessionBar />
        </MemoryRouter>
      </Provider>
    );

    window.dispatchEvent(new Event('pagehide'));
    const saves = getSavedGames();
    expect(saves).toHaveLength(1);
    expect(saves[0].name.startsWith(AUTOSAVE_NAME_PREFIX)).toBe(true);
  });
});

describe('autosave retention', () => {
  test('keeps only the newest autosaves and never prunes player saves', () => {
    const state = makeStore().getState();
    const nowSpy = jest.spyOn(Date, 'now');
    const ids: Record<string, string> = {};
    let clock = 1_000;
    for (const name of ['Manual early', 'Autosave_1', 'Autosave_2', 'Autosave_3', 'Autosave_4', 'Manual late']) {
      clock += 1_000;
      nowSpy.mockReturnValue(clock);
      ids[name] = createSave(state, name)!;
    }
    nowSpy.mockRestore();

    const removed = pruneAutosaves(2);

    expect(removed.sort()).toEqual([ids.Autosave_1, ids.Autosave_2].sort());
    expect(getSavedGames().map(save => save.name).sort()).toEqual(
      ['Autosave_3', 'Autosave_4', 'Manual early', 'Manual late']
    );
    expect(localStorage.getItem(`game_save_${ids.Autosave_1}`)).toBeNull();
  });
});
