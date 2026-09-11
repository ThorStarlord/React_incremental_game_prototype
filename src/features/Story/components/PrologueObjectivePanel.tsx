import React from 'react';

export const GC02_FIRST_LESSON_EXPERIENCE_ID = 'willow_exp_first_lesson';

export type PrologueStage =
  | 'INTRO'
  | 'FIND_WILLOW'
  | 'SPEAK_WITH_WILLOW'
  | 'CHAPTER_ONE_READY';

export interface PrologueStageInput {
  hasSeenIntro: boolean;
  playerLocation: string;
  hasFirstLesson: boolean;
}

export const derivePrologueStage = (_input: PrologueStageInput): PrologueStage => 'INTRO';

export const PrologueObjectivePanel: React.FC = () => null;

export default PrologueObjectivePanel;
