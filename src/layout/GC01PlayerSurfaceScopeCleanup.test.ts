import fs from 'fs';
import path from 'path';
import {
  DEFAULT_NAV_ITEMS,
  NAVIGATION_SECTIONS,
  getImplementedItems,
  isItemAvailable,
} from './constants/navigationConfig';
import type { TabId } from './types/NavigationTypes';

const EXCLUDED_1_0_SURFACES: TabId[] = [
  'skills',
  'inventory',
  'crafting',
  'saves',
  'save-load',
];

const REQUIRED_PLAYER_SURFACES: TabId[] = [
  'dashboard',
  'character',
  'traits',
  'essence',
  'npcs',
  'quests',
  'copies',
  'settings',
];

const DEVELOPMENT_ONLY_SURFACES: TabId[] = ['debug'];

describe('GC-01 Campaign One player-surface scope cleanup', () => {
  test('implemented/default player navigation excludes cut, deferred, and duplicate-save destinations', () => {
    const implementedIds = getImplementedItems().map(item => item.id);
    const defaultIds = DEFAULT_NAV_ITEMS.map(item => item.id);

    for (const id of EXCLUDED_1_0_SURFACES) {
      expect(implementedIds).not.toContain(id);
      expect(defaultIds).not.toContain(id);
      expect(isItemAvailable(id)).toBe(false);
    }

    for (const id of REQUIRED_PLAYER_SURFACES) {
      expect(implementedIds).toContain(id);
      expect(defaultIds).toContain(id);
      expect(isItemAvailable(id)).toBe(true);
    }

    for (const id of DEVELOPMENT_ONLY_SURFACES) {
      expect(implementedIds).not.toContain(id);
      expect(defaultIds).not.toContain(id);
      expect(isItemAvailable(id)).toBe(false);
    }
  });

  test('primary navigation sections do not advertise cut or deferred Campaign One systems', () => {
    const sectionIds = NAVIGATION_SECTIONS.flatMap(section =>
      section.items.map(item => item.id)
    );

    for (const id of EXCLUDED_1_0_SURFACES) {
      expect(sectionIds).not.toContain(id);
    }

    for (const id of REQUIRED_PLAYER_SURFACES) {
      expect(sectionIds).toContain(id);
    }
  });

  test('production router contains no placeholder routes and fails unknown legacy game URLs closed to dashboard', () => {
    const routerSource = fs.readFileSync(
      path.join(process.cwd(), 'src/routes/AppRouter.tsx'),
      'utf8'
    );

    expect(routerSource).not.toContain("PlaceholderPage");
    expect(routerSource).not.toContain('<Route path="skills"');
    expect(routerSource).not.toContain('<Route path="inventory"');
    expect(routerSource).not.toContain('<Route path="crafting"');
    expect(routerSource).not.toContain('<Route path="saves"');
    expect(routerSource).not.toContain('<Route path="save-load"');

    // Debug tooling may exist in development, but production/test builds must
    // not expose the state-mutating route by direct URL.
    expect(routerSource).toContain("process.env.NODE_ENV === 'development' && (");
    expect(routerSource).toContain('<Route path="debug" element={<DebugPage />} />');

    expect(routerSource).toContain(
      '<Route path="*" element={<Navigate to="dashboard" replace />} />'
    );
  });

  test('required player surfaces reject known prototype, debug, deferred, and dead-page residue', () => {
    const dashboardSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/DashboardPage.tsx'),
      'utf8'
    );
    const controlsSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/GameLoop/components/ui/GameControlPanel.tsx'),
      'utf8'
    );
    const characterSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/CharacterPage.tsx'),
      'utf8'
    );
    const essenceSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/EssencePage.tsx'),
      'utf8'
    );
    const relationshipSource = fs.readFileSync(
      path.join(process.cwd(), 'src/features/NPCs/components/ui/tabs/NPCRelationshipTab.tsx'),
      'utf8'
    );
    const settingsSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/SettingsPage.tsx'),
      'utf8'
    );
    const pagesBarrelSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/index.ts'),
      'utf8'
    );

    expect(dashboardSource).not.toContain('Stats & Equipment');
    expect(dashboardSource).not.toContain('Game Ticks Elapsed');
    expect(controlsSource).not.toContain('Tick: {gameLoop.currentTick}');
    expect(characterSource).not.toContain('skill progression');
    expect(characterSource).not.toContain('Trait System Integration');

    expect(essenceSource).not.toContain('ManualEssenceButton');
    expect(essenceSource).not.toContain('For testing and prototyping purposes');
    expect(essenceSource).not.toContain('Upcoming Features');

    expect(relationshipSource).not.toContain('Debug: +10 Affinity');
    expect(relationshipSource).not.toContain('Debug: Unlock All Trait Slots');

    expect(settingsSource).not.toContain('Import settings functionality coming soon');
    expect(settingsSource).not.toContain('Export settings:');

    expect(
      fs.existsSync(path.join(process.cwd(), 'src/pages/GamePage.tsx'))
    ).toBe(false);
    expect(pagesBarrelSource).not.toContain("from './GamePage'");
  });

  test('main menu remains the canonical persistence entry surface', () => {
    const menuSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/MainMenu/index.tsx'),
      'utf8'
    );

    expect(menuSource).toContain('handleNewGame');
    expect(menuSource).toContain('handleContinue');
    expect(menuSource).toContain('handleLoadGame');
    expect(menuSource).toContain('handleShowExport');
    expect(menuSource).toContain('handleImport');
  });
});
