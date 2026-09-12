import { rootReducer, type RootState } from '../../app/store';
import { markCampaignComplete, selectCampaignCompletion } from '../Meta/state/MetaSlice';

const initialState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);

describe('Campaign One completion state', () => {
  it('starts incomplete and persists a state-responsive epilogue variant', () => {
    const state = initialState();
    expect(selectCampaignCompletion(state)).toBeNull();

    const completed = rootReducer(
      state,
      markCampaignComplete({ epilogueVariant: 'institutional_reckoning', completedAt: 123 })
    );

    expect(selectCampaignCompletion(completed)).toEqual({
      epilogueVariant: 'institutional_reckoning',
      completedAt: 123,
    });
  });
});
