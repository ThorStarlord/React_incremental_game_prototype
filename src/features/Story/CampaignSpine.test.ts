import { rootReducer, type RootState } from '../../app/store';
import { selectOpeningCampaignStage } from './CampaignSpine';

const initialState = (): RootState =>
  rootReducer(undefined, { type: '@@INIT', payload: undefined } as any);

describe('Campaign One opening spine', () => {
  it('requires the first Willow relationship evidence before Chapter 1 unlocks', () => {
    const state = initialState();
    expect(selectOpeningCampaignStage(state)).toBe('PROLOGUE');
  });

  it('advances to Chapter 1 from canonical Willow relationship evidence', () => {
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

    expect(selectOpeningCampaignStage(progressed)).toBe('CHAPTER_1');
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

    expect(selectOpeningCampaignStage(progressed)).toBe('CHAPTER_2');
  });
});
