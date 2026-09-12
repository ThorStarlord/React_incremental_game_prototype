import { rootReducer } from '../../../app/store';
import {
  selectBondProfileByNpcId,
  selectRelationshipEssenceContributionByNpcId,
  selectRelationshipExperiencesByNpcId,
  selectRelationshipMemoriesByNpcId,
  selectRelationshipState,
} from './RelationshipSelectors';

const WILLOW_ID = 'npc_elder_willow';

describe('relationship selector interface stability', () => {
  it('returns stable references when the underlying relationship state is unchanged', () => {
    const state = rootReducer(undefined, {
      type: 'relationship-selector-test/init',
      payload: undefined,
    });

    expect(selectRelationshipState(state)).toBe(selectRelationshipState(state));
    expect(selectBondProfileByNpcId(state, WILLOW_ID)).toBe(
      selectBondProfileByNpcId(state, WILLOW_ID)
    );
    expect(selectRelationshipExperiencesByNpcId(state, WILLOW_ID)).toBe(
      selectRelationshipExperiencesByNpcId(state, WILLOW_ID)
    );
    expect(selectRelationshipMemoriesByNpcId(state, WILLOW_ID)).toBe(
      selectRelationshipMemoriesByNpcId(state, WILLOW_ID)
    );
    expect(selectRelationshipEssenceContributionByNpcId(state, WILLOW_ID)).toBe(
      selectRelationshipEssenceContributionByNpcId(state, WILLOW_ID)
    );
  });
});
