import type { TraitSlot } from './TraitsTypes';
import { previewDoctrineExpression } from './DoctrineExpressionPreview';

const slots = (names: Array<string | null>, unlocked = names.length): TraitSlot[] =>
  names.map((traitId, index) => ({ id: String(index), slotIndex: index, traitId, isLocked: index >= unlocked }));

test('preview simulates the exact first-unlocked two-pattern replacement without mutating slots', () => {
  const original = slots(['WillowsWisdom', 'ConstraintSense', null]);
  const copy = JSON.stringify(original);
  const next = previewDoctrineExpression(original, ['ScholarlyInsight', 'AdversarialCalibration']);
  expect(next).not.toBeNull();
  expect(next!.before).toEqual(['WillowsWisdom', 'ConstraintSense']);
  expect(next!.after).toEqual(['ScholarlyInsight', 'AdversarialCalibration']);
  expect(next!.suppressed).toEqual(['WillowsWisdom', 'ConstraintSense']);
  expect(next!.newlyExpressed).toEqual(['ScholarlyInsight', 'AdversarialCalibration']);
  expect(JSON.stringify(original)).toBe(copy);
});

test('moving an already expressed pattern does not claim it was lost', () => {
  const next = previewDoctrineExpression(slots(['B', 'A', 'X']), ['A', 'B']);
  expect(next!.after).toEqual(['A', 'B', 'X']);
  expect(next!.suppressed).toEqual([]);
  expect(next!.newlyExpressed).toEqual([]);
});

test('insufficient unlocked slots reject preview without inventing eligibility', () => {
  expect(previewDoctrineExpression(slots(['A', null], 1), ['A', 'B'])).toBeNull();
});
