import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QuestPuzzleModal from './components/ui/QuestPuzzleModal';
import type { QuestObjective } from './state/QuestTypes';

const puzzle = (id: string): QuestObjective => ({
  objectiveId: id,
  puzzleData: { prompt: 'Select a route', options: ['North', 'South'] },
} as QuestObjective);

afterEach(cleanup);

test('puzzle selection supports Undo and Clear without submitting empty input', () => {
  const solve = jest.fn();
  render(<QuestPuzzleModal open objective={puzzle('first')} onSolve={solve} onClose={jest.fn()} />);
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'North' }));
  fireEvent.click(screen.getByRole('button', { name: 'South' }));
  expect(screen.getByText(/Current Sequence: North, South/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
  expect(screen.getByText(/Current Sequence: North/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'South' }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  expect(solve).toHaveBeenCalledWith('South');
});

test('an objective change or reopened puzzle cannot retain the previous attempt', () => {
  const solve = jest.fn();
  const close = jest.fn();
  const view = render(<QuestPuzzleModal open objective={puzzle('first')} onSolve={solve} onClose={close} />);
  fireEvent.click(screen.getByRole('button', { name: 'North' }));
  view.rerender(<QuestPuzzleModal open={false} objective={null} onSolve={solve} onClose={close} />);
  view.rerender(<QuestPuzzleModal open objective={puzzle('second')} onSolve={solve} onClose={close} />);
  expect(screen.getByText(/Current Sequence: none selected/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'South' }));
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(close).toHaveBeenCalledTimes(1);
  view.rerender(<QuestPuzzleModal open={false} objective={null} onSolve={solve} onClose={close} />);
  view.rerender(<QuestPuzzleModal open objective={puzzle('second')} onSolve={solve} onClose={close} />);
  expect(screen.getByText(/Current Sequence: none selected/)).toBeInTheDocument();
});
