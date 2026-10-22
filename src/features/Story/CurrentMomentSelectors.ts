import type { RootState } from '../../app/store';
import { getConnectedLocationDefinitions, getLocationDefinition, resolveCanonicalLocationId } from '../Exploration/LocationDefinitions';
import { isPlayerAtNpcWorldLocation } from '../NPCs/state/NPCWorldLocationDefinitions';
import { selectAllChapterProgress } from './ChapterSelectors';
import { selectOpeningCampaignStage } from './CampaignSpine';
import { selectCausalJournalEntries, selectOpenCopyExceptions, selectRecentRecordedDialogueExperiences } from './PlayerInsightSelectors';

export interface CurrentMomentAction {
  id: string;
  label: string;
  description: string;
  to: string;
}

export interface CurrentMomentView {
  locationName: string;
  locationDescription: string;
  situation: string;
  actions: CurrentMomentAction[];
  consequences: Array<{ id: string; title: string; explanation: string }>;
  attention: Array<{ id: string; label: string; to: string }>;
}

/**
 * Projection only: derives a player's immediate choices from currently known
 * NPCs, valid world locations, active quests and visible memories.
 * Never read future dialogue definitions to manufacture available actions.
 */
export const selectCurrentMoment = (state: RootState): CurrentMomentView => {
  const locationId = resolveCanonicalLocationId(state.player.location);
  const location = locationId ? getLocationDefinition(locationId) : undefined;
  const stage = selectOpeningCampaignStage(state);
  const currentChapter = stage !== 'PROLOGUE'
    ? selectAllChapterProgress(state).find(chapter => chapter.status !== 'complete')
    : undefined;
  const knownContactsHere = Object.values(state.npcs.npcs)
    .filter(npc => isPlayerAtNpcWorldLocation(npc.id, state.player.location) === true)
    .slice(0, 3);
  const activeQuests = state.quest.activeQuestIds
    .map(id => state.quest.quests[id])
    .filter(quest => quest && (quest.status === 'IN_PROGRESS' || quest.status === 'READY_TO_COMPLETE'));
  const connections = getConnectedLocationDefinitions(state.player.location);
  const actions: CurrentMomentAction[] = [];

  if (stage === 'PROLOGUE' && state.meta.hasSeenIntro) {
    const willowHere = knownContactsHere.some(npc => npc.id === 'npc_elder_willow');
    if (willowHere) {
      actions.push({
        id: 'prologue-willow',
        label: 'Talk with Elder Willow',
        description: 'Your known contact is here. Choose an authored conversation topic.',
        to: '/game/npcs/npc_elder_willow?view=dialogue',
      });
    } else {
      actions.push({
        id: 'prologue-travel',
        label: 'Find Elder Willow',
        description: 'Use the travel controls to reach the Whispering Woods.',
        to: '/game/dashboard#travel-controls',
      });
    }
  }

  knownContactsHere.forEach(npc => {
    if (stage === 'PROLOGUE' && npc.id === 'npc_elder_willow') return;
    actions.push({
      id: `npc-${npc.id}`,
      label: `Visit ${npc.name}`,
      description: 'A currently known person at this world location.',
      to: `/game/npcs/${encodeURIComponent(npc.id)}?view=dialogue`,
    });
  });

  activeQuests.slice(0, 2).forEach(quest => {
    actions.push({
      id: `quest-${quest.id}`,
      label: `Review ${quest.title}`,
      description: quest.status === 'READY_TO_COMPLETE'
        ? 'Objectives are ready; review the authored resolution.'
        : 'Review the current objectives and what remains to do.',
      to: `/game/quests?quest=${encodeURIComponent(quest.id)}`,
    });
  });
  if (connections.length > 0 && !actions.some(action => action.id === 'prologue-travel')) {
    actions.push({
      id: 'travel',
      label: 'Explore connected locations',
      description: 'Choose a legal authored route using the travel controls.',
      to: '/game/dashboard#travel-controls',
    });
  }
  if (actions.length === 0) {
    actions.push({
      id: 'relationships',
      label: 'Review known contacts',
      description: 'Inspect the people already encountered, without revealing unknown characters.',
      to: '/game/npcs',
    });
  }

  const exceptions = selectOpenCopyExceptions(state);
  const attention = exceptions.slice(0, 3).map(exception => ({
    id: exception.exceptionId,
    label: `${exception.copyName}: ${exception.title} needs your judgment`,
    to: `/game/copies?copy=${encodeURIComponent(exception.copyId)}`,
  }));
  activeQuests.filter(quest => typeof quest.timeLimitSeconds === 'number').forEach(quest => {
    const remaining = Math.max(0, (quest.timeLimitSeconds ?? 0) - (quest.elapsedSeconds ?? 0));
    attention.push({
      id: `timed-${quest.id}`,
      label: `${quest.title}: ${Math.ceil(remaining)}s remaining`,
      to: `/game/quests?quest=${encodeURIComponent(quest.id)}`,
    });
  });

  const situation = stage === 'PROLOGUE'
    ? 'Your first task is to find Elder Willow and listen to her First Lesson.'
    : currentChapter?.title ?? 'Campaign One: your choices and remembered history now determine what follows.';

  return {
    locationName: location?.name ?? state.player.location,
    locationDescription: location?.description ?? 'A location without an authored travel description.',
    situation,
    actions: actions.slice(0, 5),
    consequences: [
      ...selectCausalJournalEntries(state, 2).map(entry => ({
        id: entry.id,
        title: entry.title,
        explanation: `${entry.causeLabel}: ${entry.summary}`,
        timestamp: entry.timestamp,
      })),
      ...selectRecentRecordedDialogueExperiences(state, 2).map(entry => ({
        id: `experience-${entry.id}`,
        title: entry.title,
        explanation: `This dialogue experience with ${entry.npcName} is now part of your recorded history.`,
        timestamp: entry.timestamp,
      })),
    ].sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(({ id, title, explanation }) => ({ id, title, explanation })),
    attention,
  };
};
