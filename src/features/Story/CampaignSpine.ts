import type { RootState } from '../../app/store';
import { selectChapterProgress } from './ChapterSelectors';
import { CHAPTER_DEFINITIONS, type ChapterId } from './ChapterDefinitions';

export type CampaignUnitId = 'prologue' | ChapterId;
export type CampaignUnitStatus = 'locked' | 'not_started' | 'in_progress' | 'complete';

export interface CampaignUnitProgress {
  id: CampaignUnitId;
  title: string;
  unlocked: boolean;
  status: CampaignUnitStatus;
  blockingUnitId?: CampaignUnitId;
}

export type CampaignSpineProgress = Record<CampaignUnitId, CampaignUnitProgress>;

const PROLOGUE_EXPERIENCE_ID = 'willow_exp_first_lesson';

const unit = (
  id: CampaignUnitId,
  title: string,
  unlocked: boolean,
  status: CampaignUnitStatus,
  blockingUnitId?: CampaignUnitId
): CampaignUnitProgress => ({
  id,
  title,
  unlocked,
  status,
  ...(blockingUnitId ? { blockingUnitId } : {}),
});

export const selectCampaignSpineProgress = (state: RootState): CampaignSpineProgress => {
  const prologueComplete = Boolean(
    state.relationships.experiencesById[PROLOGUE_EXPERIENCE_ID]
  );
  const prologueStatus: CampaignUnitStatus = prologueComplete ? 'complete' : 'not_started';

  const progress: Partial<CampaignSpineProgress> = {
    prologue: unit('prologue', 'Prologue', true, prologueStatus),
  };
  let previousId: CampaignUnitId = 'prologue';
  let previousComplete = prologueComplete;

  for (const definition of CHAPTER_DEFINITIONS) {
    const chapter = selectChapterProgress(state, definition.id);
    const unlocked = previousComplete;
    progress[definition.id] = unit(
      definition.id,
      definition.title,
      unlocked,
      unlocked ? chapter.status : 'locked',
      unlocked ? undefined : previousId
    );
    previousId = definition.id;
    previousComplete = chapter.status === 'complete';
  }

  return progress as CampaignSpineProgress;
};
