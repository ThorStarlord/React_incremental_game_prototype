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

    expect(routerSource).toContain(
      '<Route path="*" element={<Navigate to="dashboard" replace />} />'
    );
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
