import type { TraitSlot } from './TraitsTypes';

export interface DoctrineExpressionPreview {
  /** Current patterns occupying any unlocked expression slot. */
  before: string[];
  /** Patterns that will be expressed after atomic Doctrine adoption. */
  after: string[];
  /** Patterns no longer expressed, but not deleted from ownership. */
  suppressed: string[];
  /** Patterns not previously expressed which become expressed. */
  newlyExpressed: string[];
  /** The resulting occupied slot configuration, for accurate before/after checks. */
  slots: Array<{ slotIndex: number; traitId: string | null }>;
}

/**
 * Mirrors activateDoctrineThunk's first-unlocked-slot and equipTrait policy,
 * without dispatching actions. This is an explanation projection, not authority.
 * A null return means there are insufficient unlocked slots.
 */
export const previewDoctrineExpression = (
  traitSlots: readonly TraitSlot[],
  requiredTraitIds: readonly string[]
): DoctrineExpressionPreview | null => {
  const slots = traitSlots.map(slot => ({ slotIndex: slot.slotIndex, traitId: slot.traitId, isLocked: slot.isLocked }));
  const targets = slots.filter(slot => !slot.isLocked);
  if (requiredTraitIds.length > targets.length) return null;

  const before = slots.filter(slot => !slot.isLocked && slot.traitId).map(slot => slot.traitId!);
  requiredTraitIds.forEach((traitId, index) => {
    const targetSlotIndex = targets[index].slotIndex;
    slots.forEach(slot => {
      if (slot.slotIndex !== targetSlotIndex && slot.traitId === traitId) slot.traitId = null;
    });
    const target = slots.find(slot => slot.slotIndex === targetSlotIndex);
    if (target) target.traitId = traitId;
  });
  const after = slots.filter(slot => !slot.isLocked && slot.traitId).map(slot => slot.traitId!);
  return {
    before,
    after,
    suppressed: before.filter(id => !after.includes(id)),
    newlyExpressed: after.filter(id => !before.includes(id)),
    slots: slots.map(slot => ({ slotIndex: slot.slotIndex, traitId: slot.traitId })),
  };
};
