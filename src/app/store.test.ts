import { replaceState, rootReducer } from './store';

describe('root state replacement seam', () => {
  test('rejects incomplete replacement payloads and preserves the current state', () => {
    const current = rootReducer(undefined, { type: '@@INIT', payload: undefined });
    const incomplete = { ...current } as Record<string, unknown>;
    delete incomplete.quest;

    expect(rootReducer(current, replaceState(incomplete as never))).toBe(current);
  });

  test('accepts only complete runtime state replacements', () => {
    const current = rootReducer(undefined, { type: '@@INIT', payload: undefined });
    const replacement = {
      ...current,
      meta: { ...current.meta, gameVersion: 'test' },
    };

    expect(rootReducer(current, replaceState(replacement))).toBe(replacement);
  });
});
