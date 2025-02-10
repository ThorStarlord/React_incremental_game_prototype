export const calculateDamage = (attack, defense) => {
    return Math.max(0, attack - defense);
};