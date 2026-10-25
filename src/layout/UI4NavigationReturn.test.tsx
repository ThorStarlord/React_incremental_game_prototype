import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useLayoutState } from './hooks/useLayoutState';

afterEach(cleanup);

const NavigationHarness: React.FC = () => {
  const { activeTab, setActiveTab } = useLayoutState({
    defaultTab: 'dashboard', persistSidebar: false, syncWithRouter: true,
  });
  const { pathname } = useLocation();
  return (
    <div>
      <output data-test-id="current-path">{pathname}</output>
      <output data-test-id="current-tab">{activeTab}</output>
      <button type="button" onClick={() => setActiveTab('npcs')}>NPCs</button>
      <button type="button" onClick={() => setActiveTab('quests')}>Quests</button>
    </div>
  );
};

test('clicking NPCs from its nested NPC detail route navigates to the NPC list', () => {
  render(
    <MemoryRouter initialEntries={['/game/npcs/npc_blacksmith_gronk']}>
      <NavigationHarness />
    </MemoryRouter>
  );
  expect(screen.getByTestId('current-path')).toHaveTextContent('/game/npcs/npc_blacksmith_gronk');
  expect(screen.getByTestId('current-tab')).toHaveTextContent('npcs');
  fireEvent.click(screen.getByRole('button', { name: 'NPCs' }));
  expect(screen.getByTestId('current-path')).toHaveTextContent(/^\/game\/npcs$/);
  expect(screen.getByTestId('current-tab')).toHaveTextContent('npcs');
});

test('navigation keeps the URL authoritative across different tabs', () => {
  render(
    <MemoryRouter initialEntries={['/game/npcs/npc_blacksmith_gronk']}>
      <NavigationHarness />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Quests' }));
  expect(screen.getByTestId('current-path')).toHaveTextContent('/game/quests');
  expect(screen.getByTestId('current-tab')).toHaveTextContent('quests');
  fireEvent.click(screen.getByRole('button', { name: 'NPCs' }));
  expect(screen.getByTestId('current-path')).toHaveTextContent(/^\/game\/npcs$/);
  expect(screen.getByTestId('current-tab')).toHaveTextContent('npcs');
});
