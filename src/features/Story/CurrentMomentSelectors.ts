import type { RootState } from '../../app/store';
import { getConnectedLocationDefinitions, getLocationDefinition, resolveCanonicalLocationId } from '../Exploration/LocationDefinitions';
import { isPlayerAtNpcWorldLocation } from '../NPCs/state/NPCWorldLocationDefinitions';
import { selectAvailableNPCDialogueChoices } from '../NPCs/state/NPCSelectors';
import { CHAPTER_DEFINITIONS } from './ChapterDefinitions';
import { selectAllChapterProgress } from './ChapterSelectors';
import { selectOpeningCampaignStage } from './CampaignSpine';
import { selectCausalJournalEntries, selectOpenCopyExceptions, selectRecentRecordedDialogueExperiences } from './PlayerInsightSelectors';

export interface CurrentMomentAction {
  id: string;
  label: string;
  description: string;
  to: string;
  kind?: 'encounter' | 'quest' | 'travel' | 'reference';
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
const deriveCurrentMoment = (state: RootState): CurrentMomentView => {
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
    const willowHasTopic = willowHere && selectAvailableNPCDialogueChoices(state, 'npc_elder_willow').length > 0;
    if (willowHasTopic) {
      actions.push({
        id: 'prologue-willow',
        label: 'Talk with Elder Willow',
        description: 'A first conversation is ready here.',
        to: '/game/npcs/npc_elder_willow?view=dialogue',
        kind: 'encounter',
      });
    } else if (willowHere) {
      actions.push({
        id: 'prologue-willow-inspect',
        label: 'Review Elder Willow',
        description: 'She is here, but no new authored conversation is currently available.',
        to: '/game/npcs/npc_elder_willow',
        kind: 'reference',
      });
    } else {
      actions.push({
        id: 'prologue-travel',
        label: 'Find Elder Willow',
        description: 'Use the travel controls to reach the Whispering Woods.',
        to: '/game/dashboard#travel-controls',
        kind: 'travel',
      });
    }
  }

  knownContactsHere.forEach(npc => {
    if (stage === 'PROLOGUE' && npc.id === 'npc_elder_willow') return;
    const available = selectAvailableNPCDialogueChoices(state, npc.id);
    actions.push(available.length > 0 ? {
      id: `npc-${npc.id}`,
      label: `Talk with ${npc.name}`,
      description: `${available.length} authored conversation topic${available.length === 1 ? '' : 's'} currently available.`,
      to: `/game/npcs/${encodeURIComponent(npc.id)}?view=dialogue`,
      kind: 'encounter',
    } : {
      id: `npc-${npc.id}`,
      label: `Review ${npc.name}`,
      description: 'This known person is present, but has no available conversation topic.',
      to: `/game/npcs/${encodeURIComponent(npc.id)}`,
      kind: 'reference',
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
      kind: 'quest',
    });
  });
  if (connections.length > 0 && !actions.some(action => action.id === 'prologue-travel')) {
    actions.push({
      id: 'travel',
      label: 'Explore connected locations',
      description: 'Choose a legal authored route using the travel controls.',
      to: '/game/dashboard#travel-controls',
      kind: 'travel',
    });
  }
  if (actions.length === 0) {
    actions.push({
      id: 'relationships',
      label: 'Review known contacts',
      description: 'Inspect the people already encountered, without revealing unknown characters.',
      to: '/game/npcs',
      kind: 'reference',
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

  const chapterIdentity = currentChapter
    ? CHAPTER_DEFINITIONS.find(definition => definition.id === currentChapter.id)
    : undefined;
  const situation = stage === 'PROLOGUE'
    ? 'Begin by finding Elder Willow. Your response to her First Lesson will become part of your shared history.'
    : chapterIdentity
      ? `${currentChapter?.title}: ${chapterIdentity.centerOfGravity}`
      : 'Campaign One: your choices and remembered history determine what follows.';

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

/**
 * The global GameLoop ticks much more frequently than the player makes authored
 * choices. Cache the projection while its actual source slices remain unchanged.
 * This selector is read-only and derives no display values from raw engine ticks.
 */
let cachedSources: readonly unknown[] | null = null;
let cachedMoment: CurrentMomentView | null = null;
export const selectCurrentMoment = (state: RootState): CurrentMomentView => {
  const sources: readonly unknown[] = [
    state.player,
    state.meta,
    state.quest,
    state.relationships,
    state.npcs,
    state.copy,
    state.traits,
    state.knowledge,
    state.factions,
    state.worldState,
    state.essence,
    state.inventory,
  ];
  if (
    cachedSources &&
    cachedMoment &&
    cachedSources.length === sources.length &&
    cachedSources.every((source, index) => source === sources[index])
  ) {
    return cachedMoment;
  }
  const next = deriveCurrentMoment(state);
  cachedSources = sources;
  cachedMoment = next;
  return next;
};
