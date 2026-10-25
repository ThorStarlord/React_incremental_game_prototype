import { formatSaveName } from '../../shared/utils/formatUtils';
import { questStatusLabel } from '../Quest/state/QuestPresentation';
import { getConnectedLocationDefinitions, CITY_CENTER_LOCATION_ID, CITY_GATE_LOCATION_ID, WHISPERING_WOODS_LOCATION_ID } from '../Exploration/LocationDefinitions';
import fs from 'fs';
import path from 'path';

test('autosave presentation never rewrites stored names or IDs', () => {
  const name = 'Autosave_exit_1792842045257';
  expect(formatSaveName(name)).toBe('Exit autosave');
  expect(name).toBe('Autosave_exit_1792842045257');
  expect(formatSaveName('Autosave_1792842045257')).toBe('Autosave');
  expect(formatSaveName('Player - Save 10:30')).toBe('Player - Save 10:30');
});

test('player-facing quest statuses are exhaustive readable labels', () => {
  expect(questStatusLabel('READY_TO_COMPLETE')).toBe('Objectives complete');
  expect(questStatusLabel('IN_PROGRESS')).toBe('In progress');
});

test('the Willow hint respects real adjacent travel edges', () => {
  expect(getConnectedLocationDefinitions(CITY_CENTER_LOCATION_ID).map(l => l.id)).toContain(CITY_GATE_LOCATION_ID);
  expect(getConnectedLocationDefinitions(CITY_CENTER_LOCATION_ID).map(l => l.id)).not.toContain(WHISPERING_WOODS_LOCATION_ID);
  expect(getConnectedLocationDefinitions(CITY_GATE_LOCATION_ID).map(l => l.id)).toContain(WHISPERING_WOODS_LOCATION_ID);
});

test('NPC dialogue background and text use compatible theme tokens', () => {
  const source = fs.readFileSync(path.join(process.cwd(), 'src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx'), 'utf8');
  expect(source).toContain("msg.playerText ? 'primary.main' : 'background.default'");
  expect(source).not.toContain("'grey.100'");
});
