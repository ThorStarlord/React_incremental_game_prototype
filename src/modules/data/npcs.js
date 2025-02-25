export const npcs = [
  {
    id: 'npc1',
    name: 'Elder Willow',
    type: 'Mentor',
    location: 'woodhaven',
    relationship: 20, // Starting as slightly warm
    description: "A wise elder with deep knowledge of essence manipulation",
    dialogue: {
      initial: {
        text: "Welcome, seeker of knowledge. What guidance do you seek today?",
        options: [
          {
            text: "Tell me about essence manipulation.",
            relationshipChange: 5,
            nextDialogue: {
              text: "Essence is the fundamental force that binds all things. Through meditation and practice, one can learn to harness it.",
              options: [
                {
                  text: "Can you teach me more about meditation?",
                  relationshipChange: 10,
                  stateChanges: { learnedMeditation: true },
                  nextDialogue: {
                    text: "Close your eyes and focus on your breath. Feel the essence flowing around you...",
                    options: [
                      {
                        text: "Thank you for the lesson.",
                        relationshipChange: 5,
                        nextDialogue: { text: "Return when you wish to learn more.", options: [] }
                      }
                    ]
                  }
                },
                {
                  text: "I prefer more direct methods of power.",
                  relationshipChange: -5,
                  nextDialogue: {
                    text: "Power without wisdom leads to destruction. But you must walk your own path.",
                    options: []
                  }
                }
              ]
            }
          },
          {
            text: "I seek to join the Mystic Order.",
            requiresRelationship: 30,
            relationshipChange: 15,
            nextDialogue: {
              text: "Your dedication shows promise. The path of the Mystic Order is not easy, but it leads to great wisdom.",
              options: []
            }
          }
        ]
      }
    }
  },
  {
    id: 'merchant',
    name: 'Town Merchant',
    type: 'Trader',
    location: 'woodhaven',
    relationship: 0, // Starting neutral
    description: "A shrewd but fair merchant who deals in various goods",
    dialogue: {
      initial: {
        text: "Welcome to my shop! What catches your eye today?",
        options: [
          {
            text: "Let's talk about prices.",
            relationshipChange: -2,
            nextDialogue: {
              text: "My prices are fair for the quality I offer.",
              options: [
                {
                  text: "You're right, the quality seems good.",
                  relationshipChange: 5,
                  nextDialogue: {
                    text: "I'm glad you understand. Perhaps I can offer you a small discount on your next purchase.",
                    options: []
                  }
                }
              ]
            }
          },
          {
            text: "I'm interested in your rare items.",
            requiresRelationship: 20,
            nextDialogue: {
              text: "Ah, a discerning customer! I might have some special items in the back...",
              options: []
            }
          }
        ]
      }
    }
  },
  {
    id: 'blacksmith',
    name: 'Master Smith',
    type: 'Craftsman',
    location: 'frostkeep',
    relationship: 0,
    description: "A skilled blacksmith who can forge powerful equipment",
    dialogue: {
      initial: {
        text: "Need something forged? Or are you just here to chat about metalwork?",
        options: [
          {
            text: "Tell me about your craft.",
            relationshipChange: 10,
            nextDialogue: {
              text: "Each piece of metal has its own song. The key is learning to listen...",
              options: [
                {
                  text: "That's fascinating! Can you teach me more?",
                  relationshipChange: 15,
                  stateChanges: { learnedSmithing: true },
                  nextDialogue: {
                    text: "You show real interest! Here's what you need to know about tempering...",
                    options: []
                  }
                }
              ]
            }
          },
          {
            text: "Just show me your weapons.",
            relationshipChange: -5,
            nextDialogue: {
              text: "Very well. Though there's more to smithing than just weapons...",
              options: []
            }
          }
        ]
      }
    }
  },
  {
    id: 'elder',
    name: 'Town Elder',
    type: 'Quest Giver',
    location: 'sandstone',
    relationship: 10,
    description: "A respected leader who guides the town through troubled times",
    dialogue: {
      initial: {
        text: "These are difficult times for our town. We need help from capable adventurers.",
        options: [
          {
            text: "Tell me about the town's troubles.",
            relationshipChange: 5,
            nextDialogue: {
              text: "Bandits have been raiding our caravans, and strange creatures emerge from the desert at night.",
              options: [
                {
                  text: "I'll help deal with the bandits.",
                  relationshipChange: 15,
                  stateChanges: { acceptedBanditQuest: true },
                  nextDialogue: {
                    text: "Thank you! Their camp is somewhere in the eastern desert. Be careful out there.",
                    options: []
                  }
                },
                {
                  text: "What do you know about the creatures?",
                  relationshipChange: 5,
                  stateChanges: { investigatingCreatures: true },
                  nextDialogue: {
                    text: "They seem drawn to ancient ruins in the desert. Perhaps there's a connection...",
                    options: []
                  }
                }
              ]
            }
          },
          {
            text: "I'm too busy for town problems.",
            relationshipChange: -10,
            nextDialogue: {
              text: "I see. Perhaps another adventurer will show more concern for our plight.",
              options: []
            }
          }
        ]
      }
    }
  }
];