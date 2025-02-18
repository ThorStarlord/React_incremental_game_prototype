// Updated utility function to reflect the Essence mechanic
export const calculateEssenceGeneration = (affinities) => {
  let total = 0;
  for (const level of Object.values(affinities)) {
    switch (level) {
      case 'Acquaintance':
        total += 1;
        break;
      case 'Friend':
        total += 2;
        break;
      case 'Ally':
        total += 3;
        break;
      case 'Soulbound':
        total += 5;
        break;
      default:
        break;
    }
  }
  return total;
};