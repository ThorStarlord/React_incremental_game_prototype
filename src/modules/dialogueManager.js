const dialogueOptions = {
  Sage: {
    options: [
      { id: 'learn', text: 'Seek Knowledge', action: 'LEARN' },
      { id: 'inquire', text: 'Ask About Ancient Wisdom', action: 'INQUIRE' },
      { id: 'meditate', text: 'Meditate Together', action: 'MEDITATE' }
    ],
    responses: {
      LEARN: "Let me share with you the wisdom of ages...",
      INQUIRE: "Ah, you seek the deeper mysteries...",
      MEDITATE: "Find your center, and let wisdom flow..."
    }
  },
  Merchant: {
    options: [
      { id: 'browse', text: 'Browse Wares', action: 'BROWSE' },
      { id: 'haggle', text: 'Haggle Prices', action: 'HAGGLE' },
      { id: 'trade_routes', text: 'Ask About Trade Routes', action: 'ROUTES' }
    ],
    responses: {
      BROWSE: "Take a look at my finest goods...",
      HAGGLE: "Everything's negotiable, for the right price...",
      ROUTES: "The caravans bring exotic goods from far lands..."
    }
  },
  Trainer: {
    options: [
      { id: 'train', text: 'Train Skills', action: 'TRAIN' },
      { id: 'spar', text: 'Request Sparring', action: 'SPAR' },
      { id: 'technique', text: 'Discuss Techniques', action: 'TECHNIQUE' }
    ],
    responses: {
      TRAIN: "Let's hone your abilities...",
      SPAR: "Show me what you've learned...",
      TECHNIQUE: "Here's an advanced technique I've mastered..."
    }
  }
};

export const getDialogueOptions = (npcType) => {
  return dialogueOptions[npcType] || {
    options: [
      { id: 'talk', text: 'Talk', action: 'TALK' }
    ],
    responses: {
      TALK: "Hello there!"
    }
  };
};

export const getRandomGreeting = (npcType) => {
  const greetings = {
    Sage: [
      "Seek you wisdom, young one?",
      "The path to knowledge awaits.",
      "What mysteries do you pursue?"
    ],
    Merchant: [
      "Welcome to my humble shop!",
      "Got wares and coin to trade.",
      "The finest goods at fair prices!"
    ],
    Trainer: [
      "Ready for today's lesson?",
      "Your skills can always improve.",
      "Let's make you stronger."
    ]
  };

  const typeGreetings = greetings[npcType] || ["Greetings, traveler."];
  return typeGreetings[Math.floor(Math.random() * typeGreetings.length)];
};