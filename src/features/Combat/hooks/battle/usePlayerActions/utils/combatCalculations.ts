/**
 * Calculate damage with critical hit chance
 */
export const calculateDamage = (
  attackValue: number,
  critChance: number,
  defenseValue: number
) => {
  // Determine if it's a critical hit
  const isCritical = Math.random() < critChance;
  
  // Calculate base damage
  let baseDamage = Math.max(1, attackValue - Math.floor(defenseValue / 2));
  
  // Apply critical multiplier if necessary
  const finalDamage = isCritical
    ? Math.floor(baseDamage * 1.5)
    : baseDamage;
    
  return {
    finalDamage,
    isCritical,
    baseDamage
  };
};

/**
 * Calculate healing amount
 */
export const calculateHealing = (
  healingPower: number,
  bonusHealPercent: number = 0
) => {
  const baseHealing = healingPower;
  const bonusHealing = Math.floor(baseHealing * bonusHealPercent);
  
  return baseHealing + bonusHealing;
};

/**
 * Calculate if an attack hits or misses based on dodge chance
 */
export const calculateHitSuccess = (
  dodgeChance: number
) => {
  return Math.random() >= dodgeChance;
};
