import React, { createContext, useReducer } from 'react';

const applyTraitEffects = (player) => {
  let modifiedPlayer = { ...player };
  
  player.acquiredTraits.forEach(traitId => {
    switch(traitId) {
      case 'BargainingMaster':
        // Applied when calculating shop prices
        modifiedPlayer.shopDiscount = 0.05;
        break;
      case 'QuickLearner':
        // Applied when gaining XP
        modifiedPlayer.xpMultiplier = 1.1;
        break;
      case 'MentorsInsight':
        // Applied when gaining stat points
        modifiedPlayer.statPointBonus = 1;
        break;
      default:
        break;
    }
  });

  return modifiedPlayer;
};

const initialState = {
  player: {
    name: "Hero",
    hp: 100,
    attack: 10,
    defense: 5,
    statPoints: 0,
    essence: 0,
    gold: 0,
    acquiredTraits: [],
    learnedSkills: []
  },
  
  npcs: [
    {
      id: 1,
      name: "Elder Willow",
      type: "Sage",
      rarity: "Rare",
      portrait: "elder_willow_portrait",
      greeting: "Welcome, seeker of knowledge.",
      copyableTraits: ["MentorsInsight", "QuickLearner"],
      purchasableSkills: ["FocusMind", "AnalyzeWeakness"],
      opinionLevel: "Neutral"
    },
    {
      id: 2,
      name: "Grimbold the Trader",
      type: "Merchant",
      rarity: "Common",
      portrait: "grimbold_portrait",
      greeting: "Got wares if you've got coin!",
      copyableTraits: ["BargainingMaster"],
      purchasableSkills: [],
      opinionLevel: "Neutral"
    },
    {
      id: 3,
      name: "Scholar Elara",
      type: "Trainer",
      rarity: "Uncommon",
      portrait: "elara_portrait",
      greeting: "Knowledge is power, young one.",
      copyableTraits: ["QuickLearner"],
      purchasableSkills: ["AnalyzeWeakness"],
      opinionLevel: "Neutral"
    }
  ],

  traits: {
    copyableTraits: {
      BargainingMaster: {
        name: "Bargaining Master",
        description: "Reduces shop prices by 5%",
        essenceCost: 50,
        type: "Social"
      },
      QuickLearner: {
        name: "Quick Learner",
        description: "Increases XP gain by 10%",
        essenceCost: 75,
        type: "Knowledge"
      },
      MentorsInsight: {
        name: "Mentor's Insight",
        description: "Increases Stat Points gained by 1",
        essenceCost: 60,
        type: "Knowledge"
      }
    },
    monsterTraits: {
      GoblinNimbleness: {
        name: "Goblin Nimbleness",
        description: "Slightly increased evasion"
      },
      StoneSkin: {
        name: "Stone Skin",
        description: "Slightly increased defense"
      }
    }
  },

  skills: {
    physical: {
      PowerStrike: {
        name: "Power Strike",
        description: "Deals extra damage in one attack",
        goldCost: 100
      },
      DefensiveStance: {
        name: "Defensive Stance",
        description: "Temporarily increase defense",
        goldCost: 80
      }
    },
    mental: {
      AnalyzeWeakness: {
        name: "Analyze Weakness",
        description: "Reduces enemy defense for a short time",
        goldCost: 120
      },
      FocusMind: {
        name: "Focus Mind",
        description: "Temporarily increase mental stats",
        goldCost: 90
      }
    }
  },

  inventory: [],
  quests: [],
  enemies: [
    {
      id: 1,
      name: "Forest Goblin",
      hp: 30,
      attack: 4,
      defense: 2,
      essenceDrop: 5,
      goldDrop: 10,
      portrait: "goblin_portrait",
      traits: ["GoblinNimbleness"]
    },
    {
      id: 2,
      name: "Cave Rat",
      hp: 20,
      attack: 3,
      defense: 1,
      essenceDrop: 3,
      goldDrop: 5,
      portrait: "rat_portrait",
      traits: []
    },
    {
      id: 3,
      name: "Stone Golem",
      hp: 80,
      attack: 6,
      defense: 8,
      essenceDrop: 15,
      goldDrop: 25,
      portrait: "golem_portrait",
      traits: ["StoneSkin"]
    }
  ]
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PLAYER':
      const updatedPlayer = applyTraitEffects(action.payload);
      return { ...state, player: updatedPlayer };
      
    case 'COPY_TRAIT': {
      const { traitId, essenceCost } = action.payload;
      const trait = state.traits.copyableTraits[traitId];
      
      if (!trait || state.player.essence < essenceCost || 
          state.player.acquiredTraits.includes(traitId)) {
        return state;
      }

      const updatedPlayer = {
        ...state.player,
        essence: state.player.essence - essenceCost,
        acquiredTraits: [...state.player.acquiredTraits, traitId]
      };

      return {
        ...state,
        player: applyTraitEffects(updatedPlayer)
      };
    }

    case 'UPDATE_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'UPDATE_QUESTS':
      return { ...state, quests: action.payload };
    case 'UPDATE_ENEMIES':
      return { ...state, enemies: action.payload };
    case 'UPDATE_NPC_OPINION':
      return {
        ...state,
        npcs: state.npcs.map(npc =>
          npc.id === action.payload.npcId
            ? { ...npc, opinionLevel: action.payload.opinion }
            : npc
        )
      };
    default:
      return state;
  }
};

export const GameStateContext = createContext();
export const GameDispatchContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};