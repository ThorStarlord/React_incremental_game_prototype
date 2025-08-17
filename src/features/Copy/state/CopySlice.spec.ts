import copiesReducer, { addCopy, removeCopy, updateCopy } from './CopySlice';
import { CopiesState, Copy } from './CopyTypes';

describe('copies slice', () => {
  const initialState: CopiesState = {
    copies: {},
    isLoading: false,
    error: null,
  };

  const mockCopy: Copy = {
    id: 'copy-001',
    name: 'Test Copy',
    createdAt: Date.now(),
    parentNPCId: 'npc-001',
    growthType: 'normal',
    maturity: 0,
    loyalty: 50,
    stats: {
      health: 50, maxHealth: 50, mana: 25, maxMana: 25,
      attack: 5, defense: 5, speed: 10,
      healthRegen: 0.5, manaRegen: 0.5,
      criticalChance: 0.05, criticalDamage: 1.5,
    },
    inheritedTraits: [],
    location: 'Test Location',
  };

  it('should handle initial state', () => {
    expect(copiesReducer(undefined, { type: 'unknown' })).toEqual({
      copies: expect.any(Object), // The initial state has mock data
      isLoading: false,
      error: null,
    });
  });

  it('should handle addCopy', () => {
    const actual = copiesReducer(initialState, addCopy(mockCopy));
    expect(actual.copies['copy-001']).toEqual(mockCopy);
  });

  it('should handle removeCopy', () => {
    const stateWithCopy: CopiesState = {
      ...initialState,
      copies: { 'copy-001': mockCopy },
    };
    const actual = copiesReducer(stateWithCopy, removeCopy({ copyId: 'copy-001' }));
    expect(actual.copies['copy-001']).toBeUndefined();
  });

  it('should handle updateCopy', () => {
    const stateWithCopy: CopiesState = {
      ...initialState,
      copies: { 'copy-001': mockCopy },
    };
    const updates: Partial<Copy> = { loyalty: 60, maturity: 10 };
    const actual = copiesReducer(stateWithCopy, updateCopy({ copyId: 'copy-001', updates }));
    expect(actual.copies['copy-001'].loyalty).toBe(60);
    expect(actual.copies['copy-001'].maturity).toBe(10);
  });
});
