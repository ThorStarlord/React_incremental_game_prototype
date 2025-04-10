import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  selectPlayerName,
  selectPlayerLevel,
  selectPlayerHealth,
  selectPlayerMaxHealth,
  selectPlayerMana,
  selectPlayerMaxMana,
  selectPlayerStats,
  selectPlayerAttributes,
  selectPlayerAttributePoints,
  selectPlayerSkills,
  selectPlayerSkillPoints,
  selectPlayerGold,
  selectPlayerExperience,
  selectPlayerLevelProgress,
  selectPlayerHealthPercentage,
  selectPlayerManaPercentage
} from '../state/PlayerSelectors';
import { PlayerStats, Attribute, Skill } from '../state/PlayerTypes';

/**
 * Interface for the return value of the usePlayerStats hook
 */
interface UsePlayerStatsReturn {
  name: string;
  level: number;
  experience: number;
  levelProgress: number;
  health: number;
  maxHealth: number;
  healthPercentage: number;
  mana: number;
  maxMana: number;
  manaPercentage: number;
  gold: number;
  stats: PlayerStats;
  attributes: Record<string, Attribute>;
  attributePoints: number;
  skills: Skill[];
  skillPoints: number;
}

/**
 * Custom hook to conveniently access various player statistics from the Redux store.
 *
 * @returns {UsePlayerStatsReturn} An object containing commonly used player stats.
 */
const usePlayerStats = (): UsePlayerStatsReturn => {
  const name = useSelector(selectPlayerName);
  const level = useSelector(selectPlayerLevel);
  const experience = useSelector(selectPlayerExperience);
  const levelProgress = useSelector(selectPlayerLevelProgress);
  const health = useSelector(selectPlayerHealth);
  const maxHealth = useSelector(selectPlayerMaxHealth);
  const healthPercentage = useSelector(selectPlayerHealthPercentage);
  const mana = useSelector(selectPlayerMana);
  const maxMana = useSelector(selectPlayerMaxMana);
  const manaPercentage = useSelector(selectPlayerManaPercentage);
  const gold = useSelector(selectPlayerGold);
  const stats = useSelector(selectPlayerStats);
  const attributes = useSelector(selectPlayerAttributes);
  const attributePoints = useSelector(selectPlayerAttributePoints);
  const skills = useSelector(selectPlayerSkills);
  const skillPoints = useSelector(selectPlayerSkillPoints);

  return {
    name,
    level,
    experience,
    levelProgress,
    health,
    maxHealth,
    healthPercentage,
    mana,
    maxMana,
    manaPercentage,
    gold,
    stats,
    attributes,
    attributePoints,
    skills,
    skillPoints,
  };
};

export default usePlayerStats;
