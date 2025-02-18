import { createAffinityAction } from '../context/GameStateContext';
import quests from './data/quests';

export const startQuest = (questId, dispatch) => {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return;

  dispatch({
    type: 'UPDATE_QUESTS',
    payload: quest
  });

  // If quest has immediate affinity reward, grant it
  if (quest.rewards?.affinity) {
    dispatch(createAffinityAction.update(
      quest.rewards.affinity.npc,
      quest.rewards.affinity.amount
    ));
  }
};

export const completeQuest = (questId, dispatch) => {
  const quest = quests.find(q => q.id === questId);
  if (!quest) return;

  // Grant quest rewards
  if (quest.rewards) {
    if (quest.rewards.essence) {
      dispatch({
        type: 'GAIN_ESSENCE',
        payload: quest.rewards.essence
      });
    }

    if (quest.rewards.affinity) {
      dispatch(createAffinityAction.update(
        quest.rewards.affinity.npc,
        quest.rewards.affinity.amount
      ));
    }

    if (quest.rewards.skill) {
      dispatch({
        type: 'LEARN_SKILL',
        payload: {
          skillId: quest.rewards.skill
        }
      });
    }
  }

  // Update quest status
  dispatch({
    type: 'UPDATE_QUESTS',
    payload: { ...quest, completed: true }
  });
};