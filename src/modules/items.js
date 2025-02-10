const items = [
    { id: 1, name: 'Health Potion', effect: 'restore_health', value: 50 },
    { id: 2, name: 'Sword', effect: 'increase_attack', value: 10 }
];

export const getItems = () => {
    return items;
};

export const getItemById = (id) => {
    return items.find(item => item.id === id);
};