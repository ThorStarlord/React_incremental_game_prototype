import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../../app/store';
import { gainEssence } from '../../Essence/state/EssenceSlice';
import {
  addAssimilatedTrait,
  expressTrait,
  setResonanceLevel,
  suppressTrait,
} from '../../Player/state/PlayerSlice';
import { recalculateStatsThunk } from '../../Player/state/PlayerThunks';
import { loadTraits } from './TraitsSlice';
import type { Trait } from './TraitsTypes';
import {
  evaluateTraitStabilizationReadiness,
} from './TraitResonanceReadiness';
import {
  stabilizeTraitWithEssenceThunk,
} from './TraitThunks';
import { summarizeTraitAuthority } from './TraitEffectAuthority';

const makeStore = () => configureStore({ reducer: rootReducer });

const ATTACK_TRAIT: Trait = {
  id: 'UniversalAttackPattern',
  name: 'Universal Attack Pattern',
  description: 'A procedural test pattern.',
  category: 'Combat',
  rarity: 'Common',
  effects: { attack: 5 },
  essenceCost: 10,
  identity: {
    nature: 'procedural',
    sourceProvenance: 'practice',
  },
};

describe('Universal Trait ontology', () => {
  test('the live catalogue proves multiple Trait natures without a closed runtime taxonomy', () => {
    const traits = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'public/data/traits.json'), 'utf8')
    );

    expect(traits.WillowsWisdom.identity).toMatchObject({ nature: 'cognitive' });
    expect(traits.ResilientConstitution.identity).toMatchObject({ nature: 'physiological' });
    expect(traits.BattleHardened.identity).toMatchObject({ nature: 'procedural' });
    expect(traits.TomeOfForbiddenKnowledge.identity).toMatchObject({
      nature: 'semantic_knowledge',
    });
    expect(traits.EssenceFlow.identity).toMatchObject({ nature: 'metaphysical' });
  });

  test('assimilation means permanent availability while expression owns active stat effects', async () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [ATTACK_TRAIT.id]: ATTACK_TRAIT }));

    store.dispatch(addAssimilatedTrait(ATTACK_TRAIT.id));
    expect(store.getState().player.permanentTraits).toContain(ATTACK_TRAIT.id);
    expect(store.getState().player.traitSlots[0].traitId).toBe(ATTACK_TRAIT.id);

    await store.dispatch(recalculateStatsThunk());
    expect(store.getState().player.stats.attack).toBe(15);

    store.dispatch(suppressTrait({ slotIndex: 0 }));
    await store.dispatch(recalculateStatsThunk());

    expect(store.getState().player.permanentTraits).toContain(ATTACK_TRAIT.id);
    expect(store.getState().player.traitSlots[0].traitId).toBeNull();
    expect(store.getState().player.stats.attack).toBe(10);

    store.dispatch(expressTrait({ traitId: ATTACK_TRAIT.id, slotIndex: 0 }));
    await store.dispatch(recalculateStatsThunk());
    expect(store.getState().player.stats.attack).toBe(15);
  });

  test('an assimilated pattern remains owned even when expression capacity is full', () => {
    const store = makeStore();
    const second: Trait = {
      ...ATTACK_TRAIT,
      id: 'SecondUniversalPattern',
      name: 'Second Universal Pattern',
      effects: { defense: 2 },
    };
    const third: Trait = {
      ...ATTACK_TRAIT,
      id: 'ThirdUniversalPattern',
      name: 'Third Universal Pattern',
      effects: { speed: 1 },
    };
    store.dispatch(loadTraits({
      [ATTACK_TRAIT.id]: ATTACK_TRAIT,
      [second.id]: second,
      [third.id]: third,
    }));

    // New Game begins with two unlocked expression slots.
    store.dispatch(addAssimilatedTrait(ATTACK_TRAIT.id));
    store.dispatch(addAssimilatedTrait(second.id));
    store.dispatch(addAssimilatedTrait(third.id));

    expect(store.getState().player.permanentTraits).toEqual(
      expect.arrayContaining([ATTACK_TRAIT.id, second.id, third.id])
    );
    expect(
      store.getState().player.traitSlots.filter(slot => slot.traitId === third.id)
    ).toHaveLength(0);
  });

  test('moving one pattern between expression slots cannot duplicate its active expression', () => {
    const store = makeStore();
    store.dispatch(setResonanceLevel(2));
    store.dispatch(expressTrait({ traitId: ATTACK_TRAIT.id, slotIndex: 0 }));
    store.dispatch(expressTrait({ traitId: ATTACK_TRAIT.id, slotIndex: 1 }));

    expect(store.getState().player.traitSlots[0].traitId).toBeNull();
    expect(store.getState().player.traitSlots[1].traitId).toBe(ATTACK_TRAIT.id);
  });

  test('universal non-NPC provenance does not accidentally require Relationship authority', () => {
    const store = makeStore();
    const relicTrait: Trait = {
      ...ATTACK_TRAIT,
      id: 'RelicPattern',
      name: 'Relic Pattern',
      source: 'relic_void_shard',
    };
    store.dispatch(loadTraits({ [relicTrait.id]: relicTrait }));
    store.dispatch(gainEssence({ amount: 10, source: 'test' }));

    expect(evaluateTraitStabilizationReadiness(store.getState(), relicTrait.id)).toMatchObject({
      ready: true,
      blockers: [],
    });
  });

  test('a live named-runtime pattern is stabilizable even without a direct Player stat', () => {
    const copyPattern: Trait = {
      ...ATTACK_TRAIT,
      id: 'CopyFlowPattern',
      name: 'Copy Flow Pattern',
      effects: { essenceGenerationMultiplier: 0.15 },
    };

    expect(summarizeTraitAuthority(copyPattern)).toMatchObject({
      hasNamedRuntimeAuthority: true,
      hasStabilizableAuthority: true,
      isDeferredOnly: false,
    });
  });

  test('Stabilization spends Essence once, preserves expression, and records assimilated ownership', async () => {
    const store = makeStore();
    store.dispatch(loadTraits({ [ATTACK_TRAIT.id]: ATTACK_TRAIT }));
    store.dispatch(gainEssence({ amount: 10, source: 'test' }));
    store.dispatch(expressTrait({ traitId: ATTACK_TRAIT.id, slotIndex: 0 }));

    const result = await store.dispatch(
      stabilizeTraitWithEssenceThunk({ traitId: ATTACK_TRAIT.id })
    );

    expect(stabilizeTraitWithEssenceThunk.fulfilled.match(result)).toBe(true);
    expect(store.getState().essence.currentEssence).toBe(0);
    expect(store.getState().player.permanentTraits).toContain(ATTACK_TRAIT.id);
    expect(store.getState().player.traitSlots[0].traitId).toBe(ATTACK_TRAIT.id);
  });
});
