export const NPCData = [
  {
    id: 'npc2',
    name: 'Master Thorn',
    type: 'Combat Instructor',
    title: 'Blademaster',
    location: 'training_grounds',
    relationship: 0,
    description: "A stern veteran with countless scars and unmatched combat prowess.",
    portrait: '/assets/npcs/thorn.png',
    backgrounds: {
      default: "A former mercenary who found purpose in training the next generation of fighters.",
      ally: "After years of bloodshed, Thorn seeks to forge warriors who fight for purpose, not coin."
    },
    availability: {
      morning: 'training_grounds',
      afternoon: 'training_grounds',
      evening: 'tavern',
      night: null // unavailable
    },
    dialogue: {
      firstMeeting: { /* dialogue */ },
      initial: { /* dialogue */ },
      combatAdvice: { /* dialogue */ },
      aboutWeapons: { /* dialogue */ }
    },
    availableTraits: ['CombatReflexes', 'BattleHardened', 'WeaponMastery'],
    traitRequirements: {
      'CombatReflexes': { relationship: 20, prerequisiteTrait: null },
      'BattleHardened': { relationship: 40, prerequisiteTrait: 'CombatReflexes' },
      'WeaponMastery': {
        relationship: 70,
        prerequisiteTrait: 'BattleHardened'
      }
    },
    quests: [
      {
        id: 'basic_training',
        title: 'Basic Combat Training',
        description: 'Master Thorn wants you to defeat 5 training dummies.',
        relationshipRequirement: 0,
        objectives: [{ type: 'defeat', target: 'training_dummy', count: 5 }],
        reward: { essence: 20, relationship: 10 }
      },
      {
        id: 'advanced_training',
        title: 'Advanced Combat Techniques',
        description: 'Prove your worth by defeating a veteran fighter.',
        relationshipRequirement: 30,
        objectiveType: 'defeat_npc',
        objectives: [{ type: 'defeat', target: 'veteran_fighter', count: 1 }],
        reward: { essence: 50, relationship: 20, trait: 'BattleHardened' }
      }
    ]
  },
  {
    id: 'npc3',
    name: 'Herbalist Willow',
    // Rest of Willow's data
    // ...
  }
];