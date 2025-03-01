import { ACTION_TYPES } from '../actions/actionTypes';
import { addNotification } from '../utils/notificationUtils';

/**
 * Skills Reducer
 * 
 * Purpose: Manages the player's individual skills and their progression in the game
 * - Tracks skill experience, levels, and unlock status
 * - Applies XP gains and triggers level-up logic
 * - Handles skill-specific effects, cooldowns, or synergy
 * - Manages skill usage and availability
 * - Controls skill reset mechanics and prestige options
 * 
 * Skills provide specialized abilities or bonuses, unlocked by usage or progression.
 * They form a key progression path, allowing the player to customize their approach
 * to gameplay challenges through specialized abilities and passive benefits.
 * 
 * Actions:
 * - GAIN_SKILL_XP: Adds experience to a skill, checks for level ups
 * - UNLOCK_SKILL: Unlocks a new skill in the player's skill set
 * - USE_SKILL: Activates a skill ability and applies cooldown if applicable
 * - RESET_SKILL: Resets a skill's progress (potentially for prestige bonuses)
 * - UPDATE_SKILL_MASTERY: Changes the mastery level or specialization of a skill
 * - DISCOVER_SKILL: Makes player aware of a skill's existence without unlocking
 */
export const skillsReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.GAIN_SKILL_XP: {
      const { skillId, amount, source } = action.payload;
      // Find the skill in player's skill list
      const skillIndex = state.player.skills?.findIndex(s => s.id === skillId);
      if (skillIndex === -1) return state;

      const skill = state.player.skills[skillIndex];
      
      // Apply trait bonuses to XP gain if applicable
      let xpMultiplier = 1;
      if (state.player.equippedTraits?.includes('QuickLearner')) {
        xpMultiplier *= 1.15; // 15% XP bonus
      }
      
      // If skill has a specialty that matches the source, additional bonus
      if (skill.specialty === source) {
        xpMultiplier *= 1.25; // 25% bonus for matching specialty
      }
      
      const modifiedAmount = Math.round(amount * xpMultiplier);
      const newXP = skill.experience + modifiedAmount;
      
      // Level-up calculations - uses a formula that increases XP needed per level
      let updatedSkill = { ...skill, experience: newXP };
      let levelUps = 0;
      let currentLevel = skill.level;
      
      // XP needed per level increases with level (100 XP at level 1, 210 at level 2, etc)
      const calculateXpNeeded = (level) => 100 * level + 10 * Math.pow(level, 1.5);
      
      // Check for potential level ups
      while (true) {
        const xpNeeded = calculateXpNeeded(currentLevel);
        if (updatedSkill.experience >= xpNeeded) {
          // Level up!
          currentLevel++;
          updatedSkill.experience -= xpNeeded;
          levelUps++;
        } else {
          break;
        }
      }
      
      // Apply level up if needed
      if (levelUps > 0) {
        updatedSkill.level = skill.level + levelUps;
        
        // Unlock perks at certain level thresholds
        if (updatedSkill.level >= 5 && skill.level < 5) {
          updatedSkill.perks = [...(updatedSkill.perks || []), 'tier1'];
        }
        if (updatedSkill.level >= 15 && skill.level < 15) {
          updatedSkill.perks = [...(updatedSkill.perks || []), 'tier2'];
        }
        if (updatedSkill.level >= 30 && skill.level < 30) {
          updatedSkill.perks = [...(updatedSkill.perks || []), 'tier3'];
        }
        
        // Record level up history
        updatedSkill.levelHistory = [
          ...(updatedSkill.levelHistory || []),
          {
            level: updatedSkill.level,
            timestamp: Date.now()
          }
        ];
      }
      
      // Update the state with new skill data
      let newState = {
        ...state,
        player: {
          ...state.player,
          skills: state.player.skills.map((s, idx) =>
            idx === skillIndex ? updatedSkill : s
          )
        }
      };
      
      // Add notification for level up
      if (levelUps > 0) {
        newState = addNotification(newState, {
          message: `${skill.name} skill leveled up to ${updatedSkill.level}!`,
          type: 'achievement',
          duration: 5000
        });
      }
      
      return newState;
    }
    
    case ACTION_TYPES.UNLOCK_SKILL: {
      const { skill, source } = action.payload;
      
      // Check if player already has this skill
      if (state.player.skills?.some(s => s.id === skill.id)) {
        return state;
      }
      
      // Create new skill object with default values
      const newSkill = {
        id: skill.id,
        name: skill.name,
        description: skill.description,
        level: 1,
        experience: 0,
        unlockedAt: Date.now(),
        unlockedFrom: source || 'unknown',
        perks: [],
        usageCount: 0
      };
      
      // Add the skill to player's skill list
      const newState = {
        ...state,
        player: {
          ...state.player,
          skills: [...(state.player.skills || []), newSkill]
        }
      };
      
      // Add notification about new skill
      return addNotification(newState, {
        message: `New skill unlocked: ${skill.name}`,
        type: 'discovery',
        duration: 6000
      });
    }
    
    case ACTION_TYPES.USE_SKILL: {
      const { skillId, target } = action.payload;
      
      // Find the skill
      const skillIndex = state.player.skills?.findIndex(s => s.id === skillId);
      if (skillIndex === -1) return state;
      
      const skill = state.player.skills[skillIndex];
      
      // Check if skill is on cooldown
      const now = Date.now();
      if (skill.cooldownUntil && skill.cooldownUntil > now) {
        return addNotification(state, {
          message: `${skill.name} is still on cooldown!`,
          type: 'warning'
        });
      }
      
      // Check if player has enough energy/mana to use skill
      const energyCost = skill.energyCost || 0;
      if (state.player.energy < energyCost) {
        return addNotification(state, {
          message: `Not enough energy to use ${skill.name}!`,
          type: 'warning'
        });
      }
      
      // Calculate cooldown based on skill level (decreasing as level increases)
      const baseCooldown = skill.baseCooldown || 30000; // 30 seconds default
      const cooldownReduction = Math.min(0.5, skill.level * 0.01); // Max 50% reduction
      const cooldownTime = Math.round(baseCooldown * (1 - cooldownReduction));
      
      // Update skill with cooldown and usage count
      const updatedSkill = {
        ...skill,
        cooldownUntil: now + cooldownTime,
        usageCount: (skill.usageCount || 0) + 1,
        lastUsed: now,
        lastTarget: target
      };
      
      // Apply skill usage effects
      return {
        ...state,
        player: {
          ...state.player,
          energy: state.player.energy - energyCost,
          skills: state.player.skills.map((s, idx) =>
            idx === skillIndex ? updatedSkill : s
          )
        }
      };
    }
    
    case ACTION_TYPES.RESET_SKILL: {
      const { skillId, prestige = false } = action.payload;
      
      // Find the skill
      const skillIndex = state.player.skills?.findIndex(s => s.id === skillId);
      if (skillIndex === -1) return state;
      
      const skill = state.player.skills[skillIndex];
      
      // If prestige is true, add prestige level and benefits
      let updatedSkill = {
        ...skill,
        level: 1,
        experience: 0
      };
      
      if (prestige) {
        // Increment prestige level
        updatedSkill.prestigeLevel = (skill.prestigeLevel || 0) + 1;
        
        // Record prestige history
        updatedSkill.prestigeHistory = [
          ...(updatedSkill.prestigeHistory || []),
          {
            previousLevel: skill.level,
            timestamp: Date.now()
          }
        ];
      }
      
      // Update state
      const newState = {
        ...state,
        player: {
          ...state.player,
          skills: state.player.skills.map((s, idx) =>
            idx === skillIndex ? updatedSkill : s
          )
        }
      };
      
      // Add notification about skill reset
      return addNotification(newState, {
        message: prestige
          ? `${skill.name} skill has been prestiged to level ${updatedSkill.prestigeLevel}!`
          : `${skill.name} skill has been reset.`,
        type: prestige ? 'achievement' : 'info'
      });
    }
    
    case ACTION_TYPES.UPDATE_SKILL_MASTERY: {
      const { skillId, mastery, specialty } = action.payload;
      
      // Find the skill
      const skillIndex = state.player.skills?.findIndex(s => s.id === skillId);
      if (skillIndex === -1) return state;
      
      // Update mastery and specialty if provided
      const updatedSkill = {
        ...state.player.skills[skillIndex],
        ...(mastery !== undefined ? { mastery } : {}),
        ...(specialty !== undefined ? { specialty } : {})
      };
      
      // Update state
      return {
        ...state,
        player: {
          ...state.player,
          skills: state.player.skills.map((s, idx) =>
            idx === skillIndex ? updatedSkill : s
          )
        }
      };
    }
    
    case ACTION_TYPES.DISCOVER_SKILL: {
      const { skillId, skillInfo } = action.payload;
      
      // Check if already discovered
      if (state.player.discoveredSkills?.some(s => s.id === skillId)) {
        return state;
      }
      
      // Add to discovered skills
      return addNotification({
        ...state,
        player: {
          ...state.player,
          discoveredSkills: [
            ...(state.player.discoveredSkills || []),
            {
              id: skillId,
              name: skillInfo.name,
              description: skillInfo.description,
              discoveredAt: Date.now()
            }
          ]
        }
      }, {
        message: `You've discovered knowledge of the ${skillInfo.name} skill!`,
        type: 'discovery'
      });
    }
    
    default:
      return state;
  }
};
