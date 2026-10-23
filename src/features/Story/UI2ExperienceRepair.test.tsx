import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import { rootReducer } from '../../app/store';
import { updateCategorySettings } from '../Settings/state/SettingsSlice';
import { ThemeProviderWrapper } from '../../theme/provider';
import NPCListCard from '../NPCs/components/ui/NPCListCard';
import type { NPC } from '../NPCs/state/NPCTypes';
import QuestPuzzleModal from '../Quest/components/ui/QuestPuzzleModal';
import type { QuestObjective } from '../Quest/state/QuestTypes';

afterEach(cleanup);

test('the grid card is a native keyboard-operable button, not a click-only pseudo-button', () => {
  const choose = jest.fn();
  render(
    <NPCListCard
      npc={{ id: 'npc_elder_willow', name: 'Elder Willow', location: 'Whispering Woods', affinity: 0, connectionDepth: 1 } as NPC}
      onSelectNPC={choose}
      isSelected={false}
      connectionLevel={3}
    />
  );
  const button = screen.getByRole('button', { name: 'Open Elder Willow' });
  expect(button.tagName).toBe('BUTTON');
  expect(screen.getByTitle('Connection Level: 3')).toBeInTheDocument();
  fireEvent.click(button);
  expect(choose).toHaveBeenCalledWith('npc_elder_willow');
  expect(screen.queryByRole('img', { name: 'Elder Willow' })).not.toBeInTheDocument();
});

test('the sole runtime theme consumes stored Redux dark mode and font size', () => {
  const store = configureStore({ reducer: rootReducer });
  const Probe = () => {
    const theme = useTheme();
    return <output data-testid="effective-theme">{theme.palette.mode}:{theme.typography.fontSize}</output>;
  };
  render(
    <Provider store={store}>
      <ThemeProviderWrapper><Probe /></ThemeProviderWrapper>
    </Provider>
  );
  expect(screen.getByTestId('effective-theme').textContent).toBe('light:14');
  act(() => {
    store.dispatch(updateCategorySettings({ category: 'graphics', settings: { darkMode: true } }));
    store.dispatch(updateCategorySettings({ category: 'ui', settings: { fontSize: 'large' } }));
  });
  expect(screen.getByTestId('effective-theme').textContent).toBe('dark:16.8');
});

test('Force It presents authored effects before any submission and requires confirmation', async () => {
  const solve = jest.fn(async () => true);
  const objective = {
    objectiveId: 'chest', type: 'INTERACT_PUZZLE',
    puzzleData: { prompt: 'Open the chest', options: ['Sun'] },
    outcomes: [
      { solution: 'Sun', rewards: [], effects: [], logMessage: 'Safe.' },
      { solution: 'force', rewards: [{ type: 'GOLD', value: 50 }], effects: [{ type: 'STATUS_EFFECT', value: 'cursed_hands_debuff' }], logMessage: 'Cursed!' },
    ],
  } as QuestObjective;
  render(<QuestPuzzleModal open objective={objective} onClose={jest.fn()} onSolve={solve} />);
  fireEvent.click(screen.getByRole('button', { name: 'Force It' }));
  expect(solve).not.toHaveBeenCalled();
  expect(screen.getByText(/cursed hands debuff/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Confirm Force It' }));
  await waitFor(() => expect(solve).toHaveBeenCalledWith('force'));
});

test('invalid puzzle submission retains the dialog and error for revision', async () => {
  const solve = jest.fn(async () => false);
  const objective = { objectiveId: 'route', puzzleData: { prompt: 'Pick route', options: ['North', 'South'] } } as QuestObjective;
  const view = render(<QuestPuzzleModal open objective={objective} onClose={jest.fn()} onSolve={solve} />);
  fireEvent.click(screen.getByRole('button', { name: 'North' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() => expect(solve).toHaveBeenCalledWith('North'));
  view.rerender(<QuestPuzzleModal open objective={objective} onClose={jest.fn()} onSolve={solve} error="Incorrect solution" />);
  expect(screen.getByRole('alert')).toHaveTextContent('Incorrect solution');
  expect(screen.getByText(/Current Sequence: North/)).toBeInTheDocument();
});
