import React from 'react';
import fs from 'fs';
import path from 'path';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { GameplaySettingsPanel } from '../Settings/components/ui/GameplaySettingsPanel';
import { NPCListCard } from '../NPCs/components/ui/NPCListCard';
import type { NPC } from '../NPCs/state/NPCTypes';

afterEach(cleanup);

const read = (file: string) => fs.readFileSync(path.join(process.cwd(), file), 'utf8');

test('desktop flex sidebar does not double-indent routed gameplay and mobile actions use natural height', () => {
  const layout = read('src/layout/components/GameLayout.tsx');
  const moment = read('src/features/Story/components/CurrentMomentPanel.tsx');
  expect(layout).not.toContain('getMainContentMargin');
  expect(layout).not.toContain('marginLeft: isMobile');
  expect(moment).toContain("xs: '1 1 auto'");
});

test('dark landing menu keeps its title readable rather than reusing low-contrast muted theme color', () => {
  const title = read('src/pages/MainMenu/components/MainMenuTitle.tsx');
  expect(title).toContain("#f0f7f3");
  expect(title).not.toContain('color="primary.main"');
});

test('Settings only advertises consumed gameplay preferences', () => {
  const update = jest.fn();
  render(<GameplaySettingsPanel
    settings={{ autosaveEnabled: true, autosaveInterval: 5 }}
    onUpdate={update}
  />);
  expect(screen.getByRole('switch', { name: 'Enable autosave' })).toBeChecked();
  expect(screen.getByRole('slider')).toBeInTheDocument();
  expect(screen.queryByRole('combobox', { name: 'Difficulty' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('switch', { name: 'Enable autosave' }));
  expect(update).toHaveBeenCalledWith({ autosaveEnabled: false });
});

test('migrated character cards show canonical bond identity rather than legacy Affinity tier', () => {
  render(<NPCListCard
    npc={{ id: 'npc_elder_willow', name: 'Elder Willow', affinity: -100, connectionDepth: 0 } as NPC}
    bondLabel="Meaningful Connection"
    connectionLevel={3}
    isSelected={false}
    onSelectNPC={jest.fn()}
  />);
  expect(screen.getByText('Meaningful Connection')).toBeInTheDocument();
  expect(screen.queryByText('Hostile')).not.toBeInTheDocument();
});

test('1.0 trait management does not claim a proximity requirement the reducer does not enforce', () => {
  const container = read('src/features/Traits/components/containers/TraitSlotsContainer.tsx');
  const surface = read('src/features/Traits/components/ui/TraitSlotsUI.tsx');
  expect(container).toContain('const canManageSlots = !isLoading');
  expect(container).not.toContain('selectIsInProximityToNPC');
  expect(surface).not.toContain('You must be in close proximity');
  expect(surface).toContain('Slot preview (before → after)');
});
