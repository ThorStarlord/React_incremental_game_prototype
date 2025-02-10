const clonePlayerStats = (stats) => {
  // Create a new object that preserves property descriptors including functions.
  return Object.create(
    Object.getPrototypeOf(stats),
    Object.getOwnPropertyDescriptors(stats)
  );
};

const createPlayerStats = () => {
  const stats = {
    // --- Stats ---
    attack: 1,
    defense: 1,
    hp: 10,

    // --- Potential Stats ---
    attackPotential: 0,
    defensePotential: 0,
    hpPotential: 0,

    // --- Resource ---
    statPoints: 0,
  };

  // --- Upgrade Functions ---
  stats.upgradeAttack = () => {
    if (stats.statPoints >= 1) {
      stats.statPoints -= 1;
      stats.attack += 1 + stats.attackPotential;
      return { success: true, updatedStats: clonePlayerStats(stats) };
    } else {
      return { success: false, message: "Not enough Stat Points!" };
    }
  };

  stats.upgradeDefense = () => {
    if (stats.statPoints >= 1) {
      stats.statPoints -= 1;
      stats.defense += 1 + stats.defensePotential;
      return { success: true, updatedStats: clonePlayerStats(stats) };
    } else {
      return { success: false, message: "Not enough Stat Points!" };
    }
  };

  stats.upgradeHp = () => {
    if (stats.statPoints >= 1) {
      stats.statPoints -= 1;
      stats.hp += 1 + stats.hpPotential;
      return { success: true, updatedStats: clonePlayerStats(stats) };
    } else {
      return { success: false, message: "Not enough Stat Points!" };
    }
  };

  stats.upgradeAttackPotential = () => {
    if (stats.statPoints >= 1) {
      stats.statPoints -= 1;
      stats.attackPotential += 1;
      return { success: true, updatedStats: clonePlayerStats(stats) };
    } else {
      return { success: false, message: "Not enough Stat Points!" };
    }
  };

  stats.upgradeDefensePotential = () => {
    if (stats.statPoints >= 1) {
      stats.statPoints -= 1;
      stats.defensePotential += 1;
      return { success: true, updatedStats: clonePlayerStats(stats) };
    } else {
      return { success: false, message: "Not enough Stat Points!" };
    }
  };

  stats.upgradeHpPotential = () => {
    if (stats.statPoints >= 1) {
      stats.statPoints -= 1;
      stats.hpPotential += 1;
      return { success: true, updatedStats: clonePlayerStats(stats) };
    } else {
      return { success: false, message: "Not enough Stat Points!" };
    }
  };

  // --- Method to add Stat Points ---
  stats.addStatPoints = (amount) => {
    stats.statPoints += amount;
    return clonePlayerStats(stats);
  };

  // --- Helper function to get current stats ---
  stats.getCurrentStats = () => {
    return clonePlayerStats(stats);
  };

  return stats;
};

export default createPlayerStats;