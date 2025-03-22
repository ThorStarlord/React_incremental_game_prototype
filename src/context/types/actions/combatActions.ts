/**
 * Combat-related action types
 */

export const COMBAT_ACTIONS = {
  START_COMBAT: 'combat/start' as const,
  END_COMBAT: 'combat/end' as const,
  ATTACK_ACTION: 'combat/attack' as const,
  USE_COMBAT_SKILL: 'combat/useSkill' as const,
  FLEE_COMBAT: 'combat/flee' as const,
  COLLECT_LOOT: 'combat/collectLoot' as const,
  END_TURN: 'combat/endTurn' as const,
  PLAYER_ATTACK: 'combat/playerAttack' as const,
  ENEMY_ATTACK: 'combat/enemyAttack' as const
};
