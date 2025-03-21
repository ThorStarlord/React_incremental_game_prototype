/**
 * Calculate damage with critical hit possibilities
 */
export const calculateDamage = (
  baseAttack: number,
  critChance: number,
  targetDefense: number
): { finalDamage: number; isCritical: boolean } => {
  const isCritical = Math.random() < critChance;
  let damage = baseAttack;
  
  if (isCritical) {
    damage = Math.floor(baseAttack * 1.5);
  }
  
  // Apply defense reduction
  const finalDamage = Math.max(1, damage - Math.floor(targetDefense / 3));
  
  return { finalDamage, isCritical };
};
