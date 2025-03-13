export interface StatisticsState {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalExperienceGained: number;
  timePlayed: number;
  monstersDefeated: number;
  bossesDefeated: number;
  questsCompleted: number;
  itemsFound: number;
  goldEarned: number;
  skillsLearned: number;
  totalDamageDealt: number;
  highestDamageDealt: number;
  totalDeaths: number;
}

export const initialStatisticsState: StatisticsState = {
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  totalExperienceGained: 0,
  timePlayed: 0,
  monstersDefeated: 0,
  bossesDefeated: 0,
  questsCompleted: 0,
  itemsFound: 0,
  goldEarned: 0,
  skillsLearned: 0,
  totalDamageDealt: 0,
  highestDamageDealt: 0,
  totalDeaths: 0,
};

export type StatisticsAction =
  | { type: 'GAIN_EXPERIENCE'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'INCREMENT_TIME_PLAYED'; payload: number }
  | { type: 'MONSTER_DEFEATED' }
  | { type: 'BOSS_DEFEATED' }
  | { type: 'COMPLETE_QUEST' }
  | { type: 'FIND_ITEM' }
  | { type: 'EARN_GOLD'; payload: number }
  | { type: 'LEARN_SKILL' }
  | { type: 'DEAL_DAMAGE'; payload: number }
  | { type: 'PLAYER_DIED' }
  | { type: 'RESET_STATISTICS' };

export const statisticsReducer = (
  state: StatisticsState = initialStatisticsState,
  action: StatisticsAction
): StatisticsState => {
  switch (action.type) {
    case 'GAIN_EXPERIENCE':
      const newExperience = state.experience + action.payload;
      const totalExperienceGained = state.totalExperienceGained + action.payload;
      
      return {
        ...state,
        experience: newExperience,
        totalExperienceGained
      };

    case 'LEVEL_UP':
      return {
        ...state,
        level: state.level + 1,
        experience: state.experience - state.experienceToNextLevel,
        experienceToNextLevel: Math.floor(state.experienceToNextLevel * 1.5)
      };

    case 'INCREMENT_TIME_PLAYED':
      return {
        ...state,
        timePlayed: state.timePlayed + action.payload
      };

    case 'MONSTER_DEFEATED':
      return {
        ...state,
        monstersDefeated: state.monstersDefeated + 1
      };

    case 'BOSS_DEFEATED':
      return {
        ...state,
        bossesDefeated: state.bossesDefeated + 1
      };

    case 'COMPLETE_QUEST':
      return {
        ...state,
        questsCompleted: state.questsCompleted + 1
      };

    case 'FIND_ITEM':
      return {
        ...state,
        itemsFound: state.itemsFound + 1
      };

    case 'EARN_GOLD':
      return {
        ...state,
        goldEarned: state.goldEarned + action.payload
      };

    case 'LEARN_SKILL':
      return {
        ...state,
        skillsLearned: state.skillsLearned + 1
      };

    case 'DEAL_DAMAGE':
      const highestDamage = Math.max(state.highestDamageDealt, action.payload);
      
      return {
        ...state,
        totalDamageDealt: state.totalDamageDealt + action.payload,
        highestDamageDealt: highestDamage
      };

    case 'PLAYER_DIED':
      return {
        ...state,
        totalDeaths: state.totalDeaths + 1
      };

    case 'RESET_STATISTICS':
      return initialStatisticsState;

    default:
      return state;
  }
};
