import fs from 'fs';
import path from 'path';

const readSource = (relativePath: string) =>
  fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

describe('Beta accessibility baseline', () => {
  test('critical Trait slot actions expose accessible names and keyboard operation', () => {
    const traitSlotItem = readSource(
      'src/features/Traits/components/ui/TraitSlotItem.tsx'
    );
    const traitSlots = readSource(
      'src/features/Traits/components/ui/TraitSlotsUI.tsx'
    );

    expect(traitSlotItem).toContain(
      'aria-label={`Show ${trait.name} details`}'
    );
    expect(traitSlotItem).toContain(
      'aria-label={`Remove ${trait.name} from trait slot`}'
    );

    expect(traitSlots).toContain(
      'aria-label={`Manage ${trait.name} in trait slot ${slot.slotIndex + 1}`}'
    );
    expect(traitSlots).toContain(
      'aria-label={`Equip a trait in slot ${slot.slotIndex + 1}`}'
    );
    expect(traitSlots).toContain(
      'aria-label={`Unequip ${trait.name}`}'
    );
    expect(traitSlots).toContain('aria-label="Trait slot help"');
    expect(traitSlots).toContain('role="button"');
    expect(traitSlots).toContain("event.key === 'Enter' || event.key === ' '");
  });

  test('normal NPC and Trait Codex icon controls expose accessible names', () => {
    const npcPanel = readSource(
      'src/features/NPCs/components/ui/NPCPanelUI.tsx'
    );
    const traitCodex = readSource(
      'src/features/Traits/components/containers/TraitCodexDrawer.tsx'
    );

    expect(npcPanel).toContain('aria-label="Close NPC panel"');

    expect(traitCodex).toContain(
      'aria-label={`Make ${trait.name} permanent`}'
    );
    expect(traitCodex).toContain('aria-label="Close Trait Codex"');
    expect(traitCodex).toContain(
      "aria-label={filterState.showFilters ? 'Hide Trait Codex filters' : 'Show Trait Codex filters'}"
    );
    expect(traitCodex).toContain(
      "inputProps={{ 'aria-label': 'Search traits' }}"
    );
    expect(traitCodex).toContain(
      'aria-label="Trait Essence cost range"'
    );
  });
});
