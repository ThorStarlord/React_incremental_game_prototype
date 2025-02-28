const quests = [
  {
    id: 'welcome_to_oakhaven',
    name: 'Welcome to Oakhaven',
    giver: 'elara',
    description: 'Talk to Elder Elara, learn about Oakhaven, and complete a simple task she requests.',
    steps: [
      {
        description: 'Talk to Elder Elara',
        action: 'talk',
        target: 'elara'
      },
      {
        description: 'Deliver the medicinal herb pouch to Borin at the lumber mill',
        action: 'deliver',
        target: 'borin',
        item: 'medicinal_herb_pouch'
      }
    ],
    rewards: {
      essence: 10,
      affinity: { npc: 'elara', amount: 1 }
    }
  },
  {
    id: 'lumber_mill_troubles',
    name: 'Lumber Mill Troubles',
    giver: 'borin',
    description: 'Help Borin at the lumber mill with a minor problem.',
    steps: [
      {
        description: 'Clear the debris in the lumber storage area',
        action: 'clear',
        target: 'lumber_storage_area'
      }
    ],
    rewards: {
      essence: 15,
      affinity: { npc: 'borin', amount: 1 },
      skill: 'miners_strength'
    }
  },
  {
    id: 'tavern_tales',
    name: 'Tavern Tales',
    giver: 'willa',
    description: 'Talk to Whispering Willa at the tavern and gather rumors about the surrounding region.',
    steps: [
      {
        description: 'Find a rare flower near the edge of the Whispering Woods',
        action: 'find',
        target: 'rare_flower'
      },
      {
        description: 'Bring the rare flower back to Willa',
        action: 'deliver',
        target: 'willa',
        item: 'rare_flower'
      }
    ],
    rewards: {
      essence: 10,
      affinity: { npc: 'willa', amount: 1 },
      skill: 'gossip_network'
    }
  }
];

export default quests;
