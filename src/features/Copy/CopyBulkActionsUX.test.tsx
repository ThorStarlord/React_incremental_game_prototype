import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { rootReducer } from '../../app/store';
import { CopiesPage } from '../../pages/CopiesPage';
import { updateCopy } from './state/CopySlice';
import { gainEssence } from '../Essence/state/EssenceSlice';

const makeStore = () => configureStore({ reducer: rootReducer });
const renderPage = (store: ReturnType<typeof makeStore>) =>
  render(<Provider store={store}><MemoryRouter><CopiesPage /></MemoryRouter></Provider>);

afterEach(cleanup);

test('bulk bolster acts only on Copies visible after tab and search filters', async () => {
  const store = makeStore();
  store.dispatch(updateCopy({ copyId: 'copy-001', updates: { loyalty: 40 } }));
  store.dispatch(updateCopy({ copyId: 'copy-002', updates: { loyalty: 40 } }));
  store.dispatch(gainEssence({ amount: 50, source: 'ux-test' }));
  renderPage(store);

  fireEvent.click(screen.getByRole('tab', { name: 'Low Loyalty (2)' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Search' }), { target: { value: 'Echo-1' } });
  expect(screen.getByRole('button', { name: 'Bolster Filtered (1)' })).toBeEnabled();
  expect(screen.getByText(/bulk actions target the 1 copies visible/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Bolster Filtered (1)' }));

  await waitFor(() => {
    expect(store.getState().copy.copies['copy-001'].loyalty).toBe(50);
    expect(store.getState().notifications.items.some(item => /Bolstered 1 of 1 filtered Copies/.test(item.message))).toBe(true);
  });
  expect(store.getState().copy.copies['copy-002'].loyalty).toBe(40);
  expect(store.getState().essence.currentEssence).toBe(25);
});

test('bulk bolster reports partial failure and never claims two successes for one paid operation', async () => {
  const store = makeStore();
  store.dispatch(updateCopy({ copyId: 'copy-001', updates: { loyalty: 40 } }));
  store.dispatch(updateCopy({ copyId: 'copy-002', updates: { loyalty: 40 } }));
  store.dispatch(gainEssence({ amount: 25, source: 'ux-test' }));
  renderPage(store);
  fireEvent.click(screen.getByRole('tab', { name: 'Low Loyalty (2)' }));
  fireEvent.click(screen.getByRole('button', { name: 'Bolster Filtered (2)' }));

  await waitFor(() => {
    expect(store.getState().notifications.items.some(item =>
      /Bolstered 1 of 2 filtered Copies/.test(item.message) &&
      /1 could not be bolstered/.test(item.message) &&
      item.type === 'warning'
    )).toBe(true);
  });
  // The displayed list sorts newest-first; success is intentionally not tied
  // to a particular fixture ID or to an undocumented iteration order.
  expect([
    store.getState().copy.copies['copy-001'].loyalty,
    store.getState().copy.copies['copy-002'].loyalty,
  ].sort((a, b) => a - b)).toEqual([40, 50]);
  expect(store.getState().essence.currentEssence).toBe(0);
});

test('no eligible share preferences produces neutral feedback, not fabricated success', async () => {
  const store = makeStore();
  store.dispatch(updateCopy({
    copyId: 'copy-001',
    updates: { loyalty: 40, sharePreferences: { unknown_trait: true } },
  }));
  renderPage(store);
  fireEvent.click(screen.getByRole('tab', { name: 'Low Loyalty (1)' }));
  fireEvent.click(screen.getByRole('button', { name: 'Apply Share Prefs (1)' }));
  await waitFor(() => {
    expect(store.getState().notifications.items.some(item =>
      /No eligible Trait share preferences were applied/.test(item.message) && item.type === 'info'
    )).toBe(true);
  });
});
