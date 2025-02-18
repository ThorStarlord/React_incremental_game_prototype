import { useCallback } from 'react';
import elaraDialogues from '../data/dialogues/elara.json';
import borinDialogues from '../data/dialogues/borin.json';
import willaDialogues from '../data/dialogues/willa.json';
import { startQuest } from './questManager';

const dialogueData = {
  elara: elaraDialogues.elara,
  borin: borinDialogues.borin,
  willa: willaDialogues.willa
};

export const useDialogue = (npcId) => {
  const getDialogue = useCallback((dialogueId) => {
    const npcDialogues = dialogueData[npcId]?.dialogues;
    return npcDialogues?.find(d => d.id === dialogueId);
  }, [npcId]);

  const handleDialogueAction = useCallback((dialogue, dispatch) => {
    if (dialogue.action === 'start_quest') {
      startQuest(dialogue.questId, dispatch);
    }
  }, []);

  return {
    getDialogue,
    handleDialogueAction
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