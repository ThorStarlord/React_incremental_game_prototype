import { rootReducer } from '../../app/store';
import {
  createPersistedGameState,
  isPersistedGameState,
  rehydratePersistedGameState,
} from './PersistedGameState';

const makeState = () => rootReducer(undefined, { type: '@@INIT', payload: undefined });

describe('PersistedGameState', () => {
  test('requires every canonical domain projection', () => {
    const persisted = createPersistedGameState(makeState());

    expect(isPersistedGameState(persisted)).toBe(true);
    expect(persisted).not.toHaveProperty('notifications');

    const incomplete = { ...persisted } as Record<string, unknown>;
    delete incomplete.quest;
    expect(isPersistedGameState(incomplete)).toBe(false);
  });

  test('rehydrates persisted domains into a complete runtime state', () => {
    const state = makeState();
    const persisted = createPersistedGameState(state);
    const rehydrated = rehydratePersistedGameState(persisted, state);

    expect(rehydrated.quest).toEqual(state.quest);
    expect(rehydrated.inventory).toEqual(state.inventory);
    expect(rehydrated.notifications).toEqual({ items: [] });
  });

  test('requires an explicit runtime baseline for rehydration', () => {
    const state = makeState();
    const persisted = createPersistedGameState(state);

    expect(() => rehydratePersistedGameState(persisted, undefined as never)).toThrow(
      'Runtime baseline is required to rehydrate persisted state.'
    );
  });

  test('rejects malformed persisted domains instead of trusting a partial root state', () => {
    const state = makeState();
    const persisted = createPersistedGameState(state);
    const malformed = { ...persisted, player: null };

    expect(isPersistedGameState(malformed)).toBe(false);
  });
});
