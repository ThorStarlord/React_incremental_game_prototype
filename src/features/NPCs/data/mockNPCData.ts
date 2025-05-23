/**
 * @file mockNPCData.ts
 * @description Mock NPC data for development and testing
 */

import { NPC, DialogueNode } from '../state/NPCTypes';

// Mock dialogue trees
export const mockDialogues: Record<string, DialogueNode[]> = {
  elena_introduction: [
    {
      id: 'elena_intro_1',
      text: "Oh, hello there! I don't think we've met before. I'm Elena.",
      speaker: 'npc',
      options: [
        {
          id: 'player_introduce',
          text: "Hi Elena, I'm new here. Nice to meet you!",
          nextNodeId: 'elena_intro_2',
        },
        {
          id: 'player_curious',
          text: "What do you do around here?",
          nextNodeId: 'elena_intro_3',
        },
      ],
    },
    {
      id: 'elena_intro_2',
      text: "Welcome! It's always nice to see new faces. I run the local library and help people with research.",
      speaker: 'npc',
      options: [
        {
          id: 'player_library',
          text: "A library? That sounds fascinating!",
          nextNodeId: 'elena_intro_4',
          effects: [{ type: 'relationship', target: 'elena', operation: 'add', value: 2, message: 'Elena appreciates your interest' }],
        },
      ],
    },
    {
      id: 'elena_intro_3',
      text: "I'm the local librarian and researcher. I help people find information and develop their knowledge.",
      speaker: 'npc',
      options: [
        {
          id: 'player_research',
          text: "That's really useful! I might need help sometime.",
          nextNodeId: 'elena_intro_4',
          effects: [{ type: 'relationship', target: 'elena', operation: 'add', value: 1, message: 'Elena is happy to help' }],
        },
      ],
    },
    {
      id: 'elena_intro_4',
      text: "Feel free to visit anytime! I'm always happy to help fellow seekers of knowledge.",
      speaker: 'npc',
      options: [],
    },
  ],
  marcus_greeting: [
    {
      id: 'marcus_greeting_1',
      text: "Ah, another traveler. I am Marcus, keeper of ancient wisdom.",
      speaker: 'npc',
      options: [
        {
          id: 'player_respectful',
          text: "It's an honor to meet you, Marcus.",
          nextNodeId: 'marcus_greeting_2',
          effects: [{ type: 'relationship', target: 'marcus', operation: 'add', value: 3, message: 'Marcus appreciates your respect' }],
        },
        {
          id: 'player_casual',
          text: "Nice to meet you! What kind of wisdom?",
          nextNodeId: 'marcus_greeting_3',
        },
      ],
    },
    {
      id: 'marcus_greeting_2',
      text: "Respect... a rare quality in these times. Perhaps you are worth teaching.",
      speaker: 'npc',
      options: [
        {
          id: 'player_eager',
          text: "I would be honored to learn from you.",
          nextNodeId: 'marcus_greeting_4',
          effects: [{ type: 'relationship', target: 'marcus', operation: 'add', value: 2 }],
        },
      ],
    },
    {
      id: 'marcus_greeting_3',
      text: "The wisdom of ages, the secrets of the mind, the power within oneself.",
      speaker: 'npc',
      options: [
        {
          id: 'player_interested',
          text: "That sounds incredible! Can you teach me?",
          nextNodeId: 'marcus_greeting_4',
          effects: [{ type: 'relationship', target: 'marcus', operation: 'add', value: 1 }],
        },
      ],
    },
    {
      id: 'marcus_greeting_4',
      text: "In time, perhaps. First, you must prove yourself worthy of such knowledge.",
      speaker: 'npc',
      options: [],
    },
  ],
};

// Mock NPC data
export const mockNPCs: Record<string, NPC> = {
  elena: {
    id: 'elena',
    name: 'Elena',
    description: 'A kind librarian who loves sharing knowledge and helping others learn.',
    location: 'Central Library',
    avatar: undefined,
    faction: 'Scholars Guild',
    
    relationshipValue: 15,
    connectionDepth: 2,
    loyaltyLevel: 1,
    
    availableDialogues: ['elena_introduction', 'daily_chat'],
    completedDialogues: [],
    availableQuests: ['daily_chat'],
    completedQuests: [],
    
    traits: {},
    teachableTraits: ['speed_reading', 'memory_enhancement', 'research_skills'],
    sharedTraitSlots: 3,
    
    inventory: {
      items: [
        { id: 'book_basic_knowledge', quantity: 5, price: 25, relationshipDiscount: 10 },
        { id: 'scroll_wisdom', quantity: 3, price: 50, relationshipDiscount: 15 },
        { id: 'tome_advanced_studies', quantity: 1, price: 100, relationshipDiscount: 20 },
      ],
      currency: 500,
      restockInterval: 24,
      lastRestock: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    },
    
    services: [
      {
        id: 'research_assistance',
        name: 'Research Assistance',
        description: 'Help with finding information on any topic',
        cost: 20,
        relationshipRequirement: 10,
        type: 'information',
      },
      {
        id: 'speed_reading_training',
        name: 'Speed Reading Training',
        description: 'Learn to read faster and retain more information',
        cost: 100,
        relationshipRequirement: 30,
        type: 'skill_training',
      },
    ],
    
    personality: {
      traits: ['intelligent', 'helpful', 'patient', 'curious'],
      likes: ['books', 'learning', 'teaching', 'quiet conversations'],
      dislikes: ['loud noises', 'ignorance', 'damaged books'],
      conversationStyle: 'friendly',
    },
    
    schedule: {
      morning: {
        location: 'Central Library',
        availability: true,
        activities: ['organizing books', 'helping visitors'],
      },
      afternoon: {
        location: 'Central Library',
        availability: true,
        activities: ['research', 'reading'],
      },
      evening: {
        location: 'Library Cafe',
        availability: true,
        activities: ['relaxing', 'light reading'],
      },
      night: {
        location: 'Home',
        availability: false,
        activities: ['sleeping'],
      },
    },
    
    lastInteraction: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isDiscovered: true,
    isAvailable: true,
  },
  
  marcus: {
    id: 'marcus',
    name: 'Marcus the Wise',
    description: 'An ancient sage who has mastered the arts of the mind. He speaks in riddles and values wisdom above all.',
    location: 'Mountain Temple',
    avatar: undefined,
    faction: 'Order of the Mind',
    
    relationshipValue: 5,
    connectionDepth: 1,
    loyaltyLevel: 0,
    
    availableDialogues: ['marcus_greeting'],
    completedDialogues: [],
    availableQuests: [],
    completedQuests: [],
    
    traits: {},
    teachableTraits: ['meditation', 'mental_fortitude', 'wisdom', 'analytical_thinking'],
    sharedTraitSlots: 5,
    
    inventory: {
      items: [
        { id: 'crystal_focus', quantity: 2, price: 200, relationshipDiscount: 5 },
        { id: 'ancient_scroll', quantity: 1, price: 500, relationshipDiscount: 10 },
      ],
      currency: 1000,
      restockInterval: 72, // 3 days
      lastRestock: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    
    services: [
      {
        id: 'meditation_training',
        name: 'Meditation Training',
        description: 'Learn to focus your mind and find inner peace',
        cost: 150,
        relationshipRequirement: 20,
        type: 'skill_training',
      },
      {
        id: 'wisdom_consultation',
        name: 'Wisdom Consultation',
        description: 'Seek guidance on important life decisions',
        cost: 300,
        relationshipRequirement: 50,
        type: 'information',
      },
    ],
    
    personality: {
      traits: ['wise', 'mysterious', 'patient', 'demanding'],
      likes: ['silence', 'wisdom', 'worthy students', 'ancient knowledge'],
      dislikes: ['impatience', 'disrespect', 'shallow thinking'],
      conversationStyle: 'mysterious',
    },
    
    schedule: {
      morning: {
        location: 'Mountain Temple',
        availability: true,
        activities: ['meditation', 'reading ancient texts'],
      },
      afternoon: {
        location: 'Temple Garden',
        availability: true,
        activities: ['contemplation', 'teaching'],
      },
      evening: {
        location: 'Mountain Temple',
        availability: true,
        activities: ['evening meditation', 'stargazing'],
      },
      night: {
        location: 'Mountain Temple',
        availability: false,
        activities: ['deep meditation', 'sleep'],
      },
    },
    
    lastInteraction: undefined,
    isDiscovered: true,
    isAvailable: true,
  },
  
  aria: {
    id: 'aria',
    name: 'Aria',
    description: 'A cheerful merchant who travels between towns, always looking for interesting trades and new friendships.',
    location: 'Market Square',
    avatar: undefined,
    faction: 'Merchants Guild',
    
    relationshipValue: 25,
    connectionDepth: 3,
    loyaltyLevel: 2,
    
    availableDialogues: ['aria_trade_talk', 'aria_travel_stories'],
    completedDialogues: ['aria_introduction'],
    availableQuests: ['merchant_favor', 'trade_route_help'],
    completedQuests: [],
    
    traits: {
      'networking': {
        id: 'networking',
        name: 'Networking',
        relationshipRequirement: 20,
        essenceCost: 75,
      },
    },
    teachableTraits: ['networking', 'persuasion', 'trade_sense', 'travel_wisdom'],
    sharedTraitSlots: 4,
    
    inventory: {
      items: [
        { id: 'healing_potion', quantity: 10, price: 15, relationshipDiscount: 20 },
        { id: 'energy_crystal', quantity: 5, price: 40, relationshipDiscount: 15 },
        { id: 'rare_gem', quantity: 2, price: 150, relationshipDiscount: 25 },
        { id: 'travel_gear', quantity: 3, price: 80, relationshipDiscount: 10 },
      ],
      currency: 750,
      restockInterval: 48, // 2 days
      lastRestock: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    },
    
    services: [
      {
        id: 'trade_consultation',
        name: 'Trade Consultation',
        description: 'Get advice on the best trades and market opportunities',
        cost: 50,
        relationshipRequirement: 15,
        type: 'information',
      },
      {
        id: 'networking_training',
        name: 'Networking Training',
        description: 'Learn how to build beneficial relationships',
        cost: 200,
        relationshipRequirement: 35,
        type: 'skill_training',
      },
    ],
    
    personality: {
      traits: ['cheerful', 'talkative', 'ambitious', 'friendly'],
      likes: ['good deals', 'interesting stories', 'new places', 'friendly people'],
      dislikes: ['dishonesty', 'stinginess', 'boring conversations'],
      conversationStyle: 'casual',
    },
    
    schedule: {
      morning: {
        location: 'Market Square',
        availability: true,
        activities: ['setting up shop', 'early trading'],
      },
      afternoon: {
        location: 'Market Square',
        availability: true,
        activities: ['active trading', 'meeting customers'],
      },
      evening: {
        location: 'Tavern',
        availability: true,
        activities: ['socializing', 'sharing stories'],
      },
      night: {
        location: 'Inn',
        availability: false,
        activities: ['planning routes', 'sleeping'],
      },
    },
    
    lastInteraction: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    isDiscovered: true,
    isAvailable: true,
  },
};

// Initial state helper
export const getInitialNPCState = () => ({
  npcs: mockNPCs,
  discoveredNPCs: Object.keys(mockNPCs),
  currentInteraction: null,
  dialogueHistory: {
    aria: ['aria_introduction'],
  },
  relationshipChanges: [],
  loading: false,
  error: null,
});
