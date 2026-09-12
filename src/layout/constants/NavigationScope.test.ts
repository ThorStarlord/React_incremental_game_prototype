import { getImplementedItems, NAVIGATION_SECTIONS } from './navigationConfig';

describe('1.0 player navigation scope', () => {
  const primaryIds = NAVIGATION_SECTIONS.flatMap(section =>
    section.items.map(item => item.id)
  );

  it('does not advertise cut or deferred systems as primary gameplay surfaces', () => {
    expect(primaryIds).not.toEqual(expect.arrayContaining(['skills', 'crafting', 'inventory', 'saves', 'save-load']));
    expect(getImplementedItems().map(item => item.id)).not.toEqual(
      expect.arrayContaining(['skills', 'crafting', 'inventory', 'saves', 'save-load'])
    );
  });

  it('keeps persistence exposed by the main menu rather than a duplicate game route', () => {
    expect(primaryIds).not.toContain('save-load');
  });
});
