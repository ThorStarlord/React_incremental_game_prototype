export const regions = [
  {
    id: 'forest',
    name: 'Evergreen Forest',
    type: 'forest',
    description: 'A dense forest filled with ancient trees and mysterious creatures. The air is thick with magic and the scent of pine.',
    mapCoordinates: { x: 100, y: 100, width: 200, height: 150 }
  },
  {
    id: 'mountain',
    name: 'Frost Peaks',
    type: 'mountain',
    description: 'Towering mountains covered in eternal snow. Home to hardy folk and fearsome beasts.',
    mapCoordinates: { x: 400, y: 50, width: 250, height: 200 }
  },
  {
    id: 'desert',
    name: 'Sun\'s Reach Desert',
    type: 'desert',
    description: 'A vast desert where ancient ruins lie buried beneath the shifting sands.',
    mapCoordinates: { x: 200, y: 300, width: 300, height: 200 }
  }
];

export const towns = [
  {
    id: 'woodhaven',
    name: 'Woodhaven',
    regionId: 'forest',
    description: 'A peaceful town nestled among the great trees.',
    mapCoordinates: { x: 150, y: 150 }
  },
  {
    id: 'frostkeep',
    name: 'Frostkeep',
    regionId: 'mountain',
    description: 'A fortress carved into the mountainside.',
    mapCoordinates: { x: 500, y: 100 }
  },
  {
    id: 'sandstone',
    name: 'Sandstone',
    regionId: 'desert',
    description: 'An oasis city known for its grand bazaar.',
    mapCoordinates: { x: 350, y: 400 }
  }
];