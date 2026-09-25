import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { setResonanceLevel } from '../../Player/state/PlayerSlice';
import { loadTraits } from './TraitsSlice';
import { acquireTraitWithEssenceThunk } from './TraitThunks';
import { evaluateTraitResonanceReadiness } from './TraitResonanceReadiness';
import { classifyTraitEffectAuthority, summarizeTraitAuthority } from './TraitEffectAuthority';
import type { Trait } from './TraitsTypes';

const makeStore = () => configureStore({ reducer: rootReducer });

const SIMPLE_TRAIT: Trait = {
  id: 'DepthRepairProbe',
  name: 'Depth Repair Probe',
  description: 'Hermetic trait used to qualify resonance authority.',
  category: 'Knowledge',
  rarity: 'Common',
  effects: { attack: 1 },
  essenceCost: 40,
};

describe('Trait system depth repair', () => {
  test('catalogue promises match their qualified Campaign One runtime authority', () => {
    const traits = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public/data/traits.json'), 'utf8')
    );

    expect(traits.EssenceFlow.effects.essenceGenerationMultiplier).toBe(0.15);
    expect(traits.EssenceFlow.description).toContain('shared with or inherited by a Copy');
    expect(traits.WillowsWisdom.description).toContain('slow-pattern cognition');
    expect(traits.WillowsWisdom.description).not.toContain('15%');

    const deferredOnly = Object.values(traits)
      .filter((trait): trait is Trait => !!trait && typeof trait === 'object')
      .filter(trait => summarizeTraitAuthority(trait).isDeferredOnly);

    expect(deferredOnly.length).toBeGreaterThan(0);
    deferredOnly.forEach(trait => {
      expect(trait.description).toContain('not active in Campaign One');
    });

    expect(traits.TomeOfForbiddenKnowledge.description).toContain(
      'Historical Intelligence metadata is not active in Campaign One'
    );
    expect(traits.MentalFocus.description).toContain(
      'Historical Intelligence metadata is not active in Campaign One'
    );
  });

  test('effect metadata has explicit execution authority instead of implying every key is live', () => {
    expect(classifyTraitEffectAuthority('attack')).toBe('direct_player_stat');
    expect(classifyTraitEffectAuthority('essenceGenerationMultiplier')).toBe('named_runtime');
    expect(classifyTraitEffectAuthority('constraintAnalysis')).toBe('semantic_capability');
    expect(classifyTraitEffectAuthority('craftingQualityBonus')).toBe('deferred_legacy');
  });

  test('permanent Resonance requires durable Player authority and spends nothing when authority is absent', async () => {
    const deferredOnly: Trait = {
      ...SIMPLE_TRAIT,
      id: 'DeferredOnly',
      name: 'Deferred Only',
      effects: { craftingQualityBonus: 0.15 },
    };
    const sharedRuntimeOnly: Trait = {
      ...SIMPLE_TRAIT,
      id: 'SharedRuntimeOnly',
      name: 'Shared Runtime Only',
      effects: { essenceGenerationMultiplier: 0.15 },
    };

    expect(summarizeTraitAuthority(SIMPLE_TRAIT).hasPermanentPlayerAuthority).toBe(true);
    expect(summarizeTraitAuthority(deferredOnly).isDeferredOnly).toBe(true);
    expect(summarizeTraitAuthority(sharedRuntimeOnly)).toMatchObject({
      hasNamedRuntimeAuthority: true,
      hasPermanentPlayerAuthority: false,
    });

    const store = makeStore();
    store.dispatch(loadTraits({
      [deferredOnly.id]: deferredOnly,
      [sharedRuntimeOnly.id]: sharedRuntimeOnly,
    }));
    store.dispatch(gainEssence({ amount: 100, source: 'test' }));

    expect(evaluateTraitResonanceReadiness(store.getState(), deferredOnly.id)).toMatchObject({
      ready: false,
      blockers: expect.arrayContaining([
        'This legacy Trait has no qualified Campaign One runtime effect and is not available for permanent Resonance.',
      ]),
    });
    expect(evaluateTraitResonanceReadiness(store.getState(), sharedRuntimeOnly.id)).toMatchObject({
      ready: false,
      blockers: expect.arrayContaining([
        'This Trait has a live shared/runtime use but no permanent Player effect in Campaign One; keep it temporary/shareable instead of Resonating it.',
      ]),
    });

    const essenceBefore = store.getState().essence.currentEssence;
    const deferredAttempt = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: deferredOnly.id })
    );
    const sharedRuntimeAttempt = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: sharedRuntimeOnly.id })
    );

    expect(acquireTraitWithEssenceThunk.rejected.match(deferredAttempt)).toBe(true);
    expect(acquireTraitWithEssenceThunk.rejected.match(sharedRuntimeAttempt)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(essenceBefore);
    expect(store.getState().player.permanentTraits).not.toEqual(
      expect.arrayContaining([deferredOnly.id, sharedRuntimeOnly.id])
    );
  });

  test('Resonance Level automatically unlocks the player Trait slots it promises', () => {
    const store = makeStore();

    expect(store.getState().player.traitSlots.map(slot => slot.isLocked)).toEqual([
      false, true, true, true, true,
    ]);

    store.dispatch(setResonanceLevel(3));

    expect(store.getState().player.resonanceLevel).toBe(3);
    expect(store.getState().player.traitSlots.map(slot => slot.isLocked)).toEqual([
      false, false, false, true, true,
    ]);
  });

  test('shared readiness explains insufficient Essence and becomes ready when the catalog cost is met', () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [SIMPLE_TRAIT.id]: SIMPLE_TRAIT }));

    let readiness = evaluateTraitResonanceReadiness(store.getState(), SIMPLE_TRAIT.id);
    expect(readiness.ready).toBe(false);
    expect(readiness.blockers).toContain('Essence 0 / 40.');

    store.dispatch(gainEssence({ amount: 40, source: 'test' }));
    readiness = evaluateTraitResonanceReadiness(store.getState(), SIMPLE_TRAIT.id);

    expect(readiness.ready).toBe(true);
    expect(readiness.blockers).toEqual([]);
  });

  test('callers cannot override the authoritative catalog Resonance cost', async () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [SIMPLE_TRAIT.id]: SIMPLE_TRAIT }));
    store.dispatch(gainEssence({ amount: 10, source: 'test' }));

    const rejected = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: SIMPLE_TRAIT.id, essenceCost: 0 })
    );

    expect(acquireTraitWithEssenceThunk.rejected.match(rejected)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(10);
    expect(store.getState().player.permanentTraits).not.toContain(SIMPLE_TRAIT.id);

    store.dispatch(gainEssence({ amount: 30, source: 'test' }));
    const fulfilled = await store.dispatch(
      acquireTraitWithEssenceThunk({ traitId: SIMPLE_TRAIT.id, essenceCost: 0 })
    );

    expect(acquireTraitWithEssenceThunk.fulfilled.match(fulfilled)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(0);
    expect(store.getState().player.permanentTraits).toContain(SIMPLE_TRAIT.id);
  });
});
