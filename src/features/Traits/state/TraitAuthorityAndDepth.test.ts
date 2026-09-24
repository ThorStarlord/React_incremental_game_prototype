import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import playerReducer, { setResonanceLevel } from '../../Player/state/PlayerSlice';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import { getInitiallyDiscoveredTraitIds, loadTraits } from './TraitsSlice';
import {
  acquireTraitWithEssenceThunk,
  discoverTraitThunk,
} from './TraitThunks';
import {
  getTraitEffectContract,
  isKnownTraitEffect,
} from './TraitEffectContract';
import {
  evaluateTraitResonanceReadiness,
} from './TraitResonanceReadiness';
import type { Trait } from './TraitsTypes';

const productionTraits = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'public/data/traits.json'), 'utf8')
) as Record<string, Trait>;

const makeStore = () => configureStore({ reducer: rootReducer });

describe('Trait authority and Candidate A depth contracts', () => {
  test('Resonance level unlocks the Trait slots whose visible requirement has been reached', () => {
    let state = playerReducer(undefined, { type: '@@INIT' });

    expect(state.traitSlots.map(slot => slot.isLocked)).toEqual([
      false,
      true,
      true,
      true,
      true,
    ]);

    state = playerReducer(state, setResonanceLevel(3));

    expect(state.resonanceLevel).toBe(3);
    expect(state.traitSlots.map(slot => slot.isLocked)).toEqual([
      false,
      false,
      false,
      true,
      true,
    ]);

    state = playerReducer(state, setResonanceLevel(99));
    expect(state.traitSlots.every(slot => !slot.isLocked)).toBe(true);
  });

  test('Campaign One initial discovery exposes supported Traits but not deferred, rework, or removed catalogue residue', () => {
    const initial = getInitiallyDiscoveredTraitIds(productionTraits);

    expect(initial).toContain('BattleHardened');
    expect(initial).toContain('EssenceFlow');

    expect(initial).not.toContain('BargainingMaster');
    expect(initial).not.toContain('MentalFocus');
    expect(initial).not.toContain('QuickLearner');
    expect(initial).not.toContain('MasterCraftsman');

    // Relationship-derived capabilities remain authored even when disposition=keep.
    expect(initial).not.toContain('WillowsWisdom');
    expect(initial).not.toContain('ScholarlyInsight');
    expect(initial).not.toContain('ConstraintSense');
    expect(initial).not.toContain('AdversarialCalibration');
  });

  test('every production Trait effect has an explicit runtime-authority disposition', () => {
    for (const trait of Object.values(productionTraits)) {
      for (const effectName of Object.keys(trait.effects ?? {})) {
        expect({
          traitId: trait.id,
          effectName,
          contract: getTraitEffectContract(effectName),
        }).toEqual(expect.objectContaining({
          contract: expect.any(Object),
        }));
        expect(isKnownTraitEffect(effectName)).toBe(true);
      }
    }

    expect(getTraitEffectContract('skillXpMultiplier')?.authority).toBe('removed_1_0');
    expect(getTraitEffectContract('craftingQualityBonus')?.authority).toBe('removed_1_0');
    expect(getTraitEffectContract('constraintAnalysis')?.authority).toBe('semantic_capability');
    expect(getTraitEffectContract('adversarialCalibration')?.authority).toBe('semantic_capability');
    expect(productionTraits.EssenceFlow.effects).toEqual(
      expect.objectContaining({ essenceGenerationMultiplier: 0.15 })
    );
  });

  test('Resonance ignores caller-supplied price and spends the authoritative catalogue cost', async () => {
    const store = makeStore();
    const trait: Trait = {
      id: 'AuthoritativeCostProbe',
      name: 'Authoritative Cost Probe',
      description: 'Test-only simple Trait.',
      category: 'Combat',
      rarity: 'Common',
      effects: { attack: 1 },
      essenceCost: 50,
      campaignOneDisposition: 'keep',
    };

    store.dispatch(loadTraits({ [trait.id]: trait }));
    store.dispatch(gainEssence({ amount: 100, source: 'test' }));

    const readiness = evaluateTraitResonanceReadiness(store.getState(), trait.id);
    expect(readiness.ready).toBe(true);
    expect(readiness.cost).toBe(50);

    await store.dispatch(acquireTraitWithEssenceThunk({
      traitId: trait.id,
      // Compatibility probe: this value must never control runtime cost.
      essenceCost: 0,
    })).unwrap();

    expect(store.getState().essence.currentEssence).toBe(50);
    expect(store.getState().player.permanentTraits).toContain(trait.id);
  });

  test('generic discovery thunk cannot bypass an authored discovery contract', async () => {
    const store = makeStore();
    const trait: Trait = {
      id: 'AuthoredDiscoveryProbe',
      name: 'Authored Discovery Probe',
      description: 'Test-only authored Trait.',
      category: 'Knowledge',
      rarity: 'Rare',
      effects: {},
      discoveryMode: 'authored',
      campaignOneDisposition: 'keep',
    };

    store.dispatch(loadTraits({ [trait.id]: trait }));

    const result = await store.dispatch(discoverTraitThunk(trait.id));
    expect(discoverTraitThunk.rejected.match(result)).toBe(true);
    expect(store.getState().traits.discoveredTraits).not.toContain(trait.id);
  });
});
