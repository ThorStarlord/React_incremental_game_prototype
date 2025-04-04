/**
 * Collection of NPC definitions with their base properties and dialogues
 */

/**
 * Interface representing an NPC dialogue option
 */
interface DialogueOption {
  /** Text shown to the player */
  text: string;
  /** Change in relationship this option causes */
  relationshipChange?: number;
  /** ID of the next dialogue to display */
  nextDialogue?: string;
  /** Special action for this option (copyTrait, giveItem, etc.) */
  action?: string;
  /** ID of the trait for trait-related actions */
  traitId?: string;
  /** Cost in essence for trait acquisition */
  essenceCost?: number;
  /** Minimum relationship level required */
  relationshipRequirement?: number;
}

/**
 * Interface representing an NPC dialogue entry
 */
interface Dialogue {
  /** Unique identifier for this dialogue */
  id?: string;
  /** Text content of this dialogue */
  text: string;
  /** Available response options */
  options: DialogueOption[];
}

/**
 * Interface for the NPC dialogue collection
 */
interface NPCDialogue {
  /** First meeting dialogue */
  firstMeeting?: Dialogue;
  /** Standard greeting dialogue */
  initial: Dialogue;
  /** Other dialogues keyed by ID */
  [key: string]: Dialogue | undefined;
}

/**
 * Interface representing a complete NPC definition
 */
interface NPCDefinition {
  /** Unique identifier for this NPC */
  id: string;
  /** Display name of the NPC */
  name: string;
  /** Type/role of the NPC */
  type: string;
  /** Location where this NPC can be found */
  location: string;
  /** Starting relationship value with player (0-100) */
  relationship: number;
  /** Short description of the NPC */
  description: string;
  /** Collection of dialogues for this NPC */
  dialogue: NPCDialogue;
}

/**
 * Collection of all NPC definitions in the game
 */
export const npcs: NPCDefinition[] = [
  {
    id: 'npc1',
    name: 'Elder Elara',
    type: 'Mentor',
    location: 'oakhaven',
    relationship: 20,
    description: "A wise elder with deep knowledge of essence manipulation",
    dialogue: {
      // Special first meeting dialogue
      firstMeeting: {
        id: 'firstMeeting',
        text: "Ah, a new face in Oakhaven. I am Elder Elara, guardian of ancient knowledge. I sense potential in you that few possess. Come, let us talk.",
        options: [
          {
            text: "I'm honored to meet you, Elder.",
            relationshipChange: 10,
            nextDialogue: "firstMeetingResponse"
          },
          {
            text: "What kind of potential do you sense?",
            nextDialogue: "firstMeetingPotential"
          },
          {
            text: "I'm just passing through.",
            relationshipChange: -5,
            nextDialogue: "firstMeetingDismissive"
          }
        ]
      },
      firstMeetingResponse: {
        id: 'firstMeetingResponse',
        text: "The honor is mine. It has been some time since I've met someone with your affinity for essence manipulation. I believe our paths crossing is no mere coincidence.",
        options: [
          {
            text: "I'd like to learn more from you.",
            nextDialogue: "aboutTraits",
            relationshipChange: 5
          },
          {
            text: "What can you tell me about Oakhaven?",
            nextDialogue: "aboutOakhaven"
          }
        ]
      },
      firstMeetingPotential: {
        id: 'firstMeetingPotential',
        text: "The essence flows differently around you. Most can barely perceive it, but you... you could learn to shape it, given proper guidance.",
        options: [
          {
            text: "Could you teach me?",
            nextDialogue: "aboutTraits",
            relationshipChange: 5
          },
          {
            text: "That sounds like mystical nonsense.",
            relationshipChange: -10,
            nextDialogue: "firstMeetingDismissive"
          }
        ]
      },
      firstMeetingDismissive: {
        id: 'firstMeetingDismissive',
        text: "As you wish. The path of knowledge remains open should you change your mind. Many dismiss what they don't understand, only to seek it later.",
        options: [
          {
            text: "Maybe I was hasty. Tell me more.",
            nextDialogue: "initial",
            relationshipChange: 5
          },
          {
            text: "I'll be on my way then.",
            nextDialogue: "initial"
          }
        ]
      },
      initial: {
        text: "Welcome, seeker. I sense potential in you.",
        options: [
          {
            text: "I'd like to learn from you.",
            nextDialogue: "aboutTraits",
            relationshipChange: 5
          },
          {
            text: "Who are you?",
            nextDialogue: "aboutSelf"
          }
        ]
      },
      aboutTraits: {
        text: "I can teach you Mentor's Insight - a technique to enhance your essence gathering.",
        options: [
          {
            text: "Teach me (50 Essence)",
            action: "copyTrait",
            traitId: "MentorsInsight",
            essenceCost: 50,
            relationshipRequirement: 20,
            nextDialogue: "traitLearned"
          }
        ]
      },
      traitLearned: {
        text: "You have learned well. This insight will serve you on your journey.",
        options: [
          {
            text: "Thank you for your wisdom.",
            nextDialogue: "initial",
            relationshipChange: 5
          }
        ]
      },
      aboutSelf: {
        text: "I am Elder Elara, guardian of ancient knowledge. I've studied essence manipulation for longer than most can remember.",
        options: [
          {
            text: "Can you teach me?",
            nextDialogue: "aboutTraits",
            relationshipChange: 5
          }
        ]
      },
      aboutOakhaven: {
        id: 'aboutOakhaven',
        text: "Oakhaven has stood for centuries as a sanctuary for those who study essence manipulation. The great oak at its center has roots that reach into the deepest wells of power.",
        options: [
          {
            text: "Tell me about essence manipulation.",
            nextDialogue: "aboutEssence"
          },
          {
            text: "I'd like to learn from you.",
            nextDialogue: "aboutTraits",
            relationshipChange: 5
          }
        ]
      },
      aboutEssence: {
        id: 'aboutEssence',
        text: "Essence is the fundamental energy that flows through all things. Most can't perceive it, let alone manipulate it. But with training, one can learn to gather and shape it, enhancing natural abilities or creating entirely new ones.",
        options: [
          {
            text: "That sounds powerful.",
            nextDialogue: "aboutTraits"
          }
        ]
      }
    }
  },
  // Add more NPCs...
]
