import { rootReducer, type RootState } from '../../app/store';
import { selectCampaignSpineProgress } from './CampaignSpine';

const initialState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);

describe('Campaign One opening spine', () => {
  it('requires the first Willow relationship evidence before Chapter 1 unlocks', () => {
    const state = initialState();
    const progress = selectCampaignSpineProgress(state);

    expect(progress.prologue.status).toBe('not_started');
    expect(progress.merchant_district.unlocked).toBe(false);
  });

  it('unlocks Chapter 1 from canonical relationship evidence and chains later chapters', () => {
    const state = initialState();
    const progressed: RootState = {
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          willow_exp_first_lesson: { id: 'willow_exp_first_lesson' } as any,
        },
      },
    };

    const progress = selectCampaignSpineProgress(progressed);

    expect(progress.prologue.status).toBe('complete');
    expect(progress.merchant_district.unlocked).toBe(true);
    expect(progress.archive_inquiry.unlocked).toBe(false);
  });

  it('requires a completed Chapter 1 route before Chapter 2 unlocks', () => {
    const state = initialState();
    const progressed: RootState = {
      ...state,
      relationships: {
        ...state.relationships,
        experiencesById: {
          ...state.relationships.experiencesById,
          willow_exp_first_lesson: { id: 'willow_exp_first_lesson' } as any,
        },
      },
      npcs: {
        ...state.npcs,
        npcs: {
          ...state.npcs.npcs,
          npc_captain_valerius: {
            ...(state.npcs.npcs.npc_captain_valerius ?? {}),
            completedDialogues: ['valerius_m25_public_order_conclusion'],
          } as any,
        },
      },
    };

    const progress = selectCampaignSpineProgress(progressed);

    expect(progress.merchant_district.status).toBe('complete');
    expect(progress.archive_inquiry.unlocked).toBe(true);
    expect(progress.adversarial_calibration.unlocked).toBe(false);
  });
});
