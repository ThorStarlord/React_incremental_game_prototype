import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TraitSlotsUI, type TraitSlotsUIProps } from './TraitSlotsUI';
import type { Trait, TraitSlot } from '../../state/TraitsTypes';

const PROCEDURAL: Trait = {
  id: 'ProceduralPractice',
  name: 'Procedural Practice',
  description: 'A permanently assimilated movement pattern.',
  category: 'Combat',
  rarity: 'Common',
  effects: { attack: 5 },
  identity: { nature: 'procedural', sourceProvenance: 'practice' },
};

const makeProps = (): TraitSlotsUIProps => ({
  traitSlots: [
    { id: 'slot-0', slotIndex: 0, traitId: PROCEDURAL.id, isLocked: false },
    { id: 'slot-1', slotIndex: 1, traitId: null, isLocked: false },
  ] satisfies TraitSlot[],
  equippedTraits: [PROCEDURAL],
  availableTraits: [PROCEDURAL],
  isLoading: false,
  error: null,
  isTraitSelectionModalOpen: false,
  selectedSlotIndexForModal: null,
  selectedTraitIdInModal: null,
  onOpenTraitSelectionModal: jest.fn(),
  onCloseTraitSelectionModal: jest.fn(),
  onSelectTraitInModal: jest.fn(),
  onConfirmEquip: jest.fn(),
  unequipDialogState: { open: false },
  onOpenUnequipDialog: jest.fn(),
  onConfirmUnequip: jest.fn(),
  onCloseUnequipDialog: jest.fn(),
  onSlotClick: jest.fn(),
});

afterEach(cleanup);

describe('1.1 Trait expression keyboard and accessible operation', () => {
  test('expressed and empty slots are keyboard operable without proximity, and suppress click does not bubble', () => {
    const props = makeProps();
    render(<TraitSlotsUI {...props} />);

    expect(screen.getByText('Trait Expression')).toBeTruthy();
    const expressed = screen.getByRole('button', {
      name: 'Manage Procedural Practice in trait slot 1',
    });
    fireEvent.keyDown(expressed, { key: 'Enter' });
    expect(props.onSlotClick).toHaveBeenCalledTimes(1);
    expect(props.onSlotClick).toHaveBeenLastCalledWith(props.traitSlots[0]);

    fireEvent.click(screen.getByRole('button', {
      name: 'Suppress Procedural Practice',
    }));
    // Suppression icon and its parent card must not both trigger one action.
    expect(props.onSlotClick).toHaveBeenCalledTimes(2);

    const empty = screen.getByRole('button', { name: 'Express a Trait in slot 2' });
    fireEvent.keyDown(empty, { key: ' ' });
    expect(props.onSlotClick).toHaveBeenCalledTimes(3);
    expect(props.onSlotClick).toHaveBeenLastCalledWith(props.traitSlots[1]);
    expect(screen.queryByText(/close proximity to an NPC/i)).toBeNull();
  });

  test('expression and suppression dialogs present named confirm actions', () => {
    const props = makeProps();
    const { rerender } = render(
      <TraitSlotsUI
        {...props}
        isTraitSelectionModalOpen
        selectedSlotIndexForModal={1}
        selectedTraitIdInModal={PROCEDURAL.id}
      />
    );

    expect(screen.getByRole('dialog', { name: 'Select a Trait to Express in Slot 2' }))
      .toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Express' }));
    expect(props.onConfirmEquip).toHaveBeenCalledTimes(1);

    rerender(
      <TraitSlotsUI
        {...props}
        unequipDialogState={{
          open: true,
          trait: PROCEDURAL,
          slotIndex: 0,
        }}
      />
    );

    expect(screen.getByRole('dialog', { name: 'Suppress Trait' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Suppress' }));
    expect(props.onConfirmUnequip).toHaveBeenCalledTimes(1);
  });
});
