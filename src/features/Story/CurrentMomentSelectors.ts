import type { RootState } from '../../app/store';
import { CITY_CENTER_LOCATION_ID, CITY_GATE_LOCATION_ID, MERCHANT_DISTRICT_LOCATION_ID, getConnectedLocationDefinitions, getLocationDefinition, resolveCanonicalLocationId } from '../Exploration/LocationDefinitions';
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
  /** Authored story interaction with unanchored characters, not physical co-presence. */
  storyContacts: CurrentMomentAction[];
  consequences: Array<{ id: string; title: string; explanation: string; to?: string }>;
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
  // Only describe conditions actually recorded in the current district.
  // World State remains the authority: this is read-only journal prose,
  // not a shop, patrol encounter, NPC location, or new travel affordance.
  const district = locationId === MERCHANT_DISTRICT_LOCATION_ID
    ? state.worldState.regions[MERCHANT_DISTRICT_LOCATION_ID]
    : undefined;
  const valeriusFollowUpFacts = district
    ? state.knowledge.factIdsByNpcId['npc_captain_valerius'] ?? []
    : [];
  const gronkFollowUpFacts = district
    ? state.knowledge.factIdsByNpcId['npc_blacksmith_gronk'] ?? []
    : [];
  const recordedPlaceConditions = [
    district?.watchPresence === 'heavy'
      ? 'Watch patrols are a much more visible presence in these streets.'
      : district?.watchPresence === 'normal'
        ? 'Watch patrols follow their customary routes through the district.'
        : null,
    district?.tradeFlow === 'strong'
      ? 'Trade is lively, with carts and stalls busy through the streets.'
      : district?.tradeFlow === 'normal'
        ? 'Trade moves at its usual pace through the market.'
        : null,
    valeriusFollowUpFacts.includes('fact_m25_valerius_audit_request')
      ? 'You asked Valerius to open the patrol ledger for a merchant audit.'
      : valeriusFollowUpFacts.includes('fact_m25_valerius_internal_review_request')
        ? 'You asked Valerius to keep the patrol review inside Watch command.'
        : null,
    gronkFollowUpFacts.includes('fact_m25_gronk_watch_manifest_request')
      ? 'You asked Gronk to prepare the verified freight manifest for Watch review.'
      : gronkFollowUpFacts.includes('fact_m25_gronk_guild_manifest_request')
        ? 'You asked Gronk to retain the verified freight manifest in the Guild ledger.'
        : null,
  ].filter((line): line is string => line !== null);
  const locationDescription = [
    location?.description ?? 'A location without an authored travel description.',
    ...recordedPlaceConditions,
  ].join(' ');
  const stage = selectOpeningCampaignStage(state);
  const currentChapter = stage !== 'PROLOGUE'
    ? selectAllChapterProgress(state).find(chapter => chapter.status !== 'complete')
    : undefined;
  const discoveredNpcIds = new Set(state.npcs.discoveredNPCs);
  const knownNPCs = Object.values(state.npcs.npcs).filter(npc => discoveredNpcIds.has(npc.id));
  const knownContactsHere = knownNPCs
    .filter(npc => isPlayerAtNpcWorldLocation(npc.id, state.player.location) === true)
    .slice(0, 3);
  // The older authored chapters use named story settings that were never
  // integrated into M18's five-node travel graph. Exposing those contacts is
  // valid under their existing dialogue contracts, but not proof they are here.
  const ledgerFollowUpHere = stage !== 'PROLOGUE' &&
    locationId === MERCHANT_DISTRICT_LOCATION_ID && district?.watchPresence === 'heavy';
  const hasReadyLedgerFollowUp = (npcId: string, topics: readonly { id: string }[]): boolean =>
    ledgerFollowUpHere && npcId === 'npc_captain_valerius' &&
    topics.some(topic => topic.id === 'valerius_m25_ledger_aftercare');
  const storyContacts: CurrentMomentAction[] = (stage === 'PROLOGUE' ? [] : knownNPCs
    .filter(npc => isPlayerAtNpcWorldLocation(npc.id, state.player.location) === undefined)
    .map(npc => ({ npc, topics: selectAvailableNPCDialogueChoices(state, npc.id) }))
    .filter(candidate => candidate.topics.length > 0)
    .sort((left, right) =>
      Number(hasReadyLedgerFollowUp(right.npc.id, right.topics)) -
      Number(hasReadyLedgerFollowUp(left.npc.id, left.topics)) ||
      right.topics.length - left.topics.length
    )
    .slice(0, 3)
    .map(({ npc, topics }) => ({
      id: `story-contact-${npc.id}`,
      label: `Continue with ${npc.name}`,
      description: hasReadyLedgerFollowUp(npc.id, topics)
        ? 'A decision about the recorded patrol ledger is ready. Their presence here is not established.'
        : `${topics.length} conversation topic${topics.length === 1 ? '' : 's'} ready. Their presence here is not established.`,
      to: `/game/npcs/${encodeURIComponent(npc.id)}?view=dialogue`,
      kind: 'reference' as const,
    })));
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
        description: 'She is here, but has nothing new to discuss right now.',
        to: '/game/npcs/npc_elder_willow',
        kind: 'reference',
      });
    } else {
      actions.push({
        id: 'prologue-travel',
        label: 'Find Elder Willow',
        description: locationId === CITY_CENTER_LOCATION_ID
          ? 'The road to Willow begins at City Gate. Choose Travel to City Gate below.'
          : locationId === CITY_GATE_LOCATION_ID
            ? 'Continue from City Gate to Whispering Woods using Travel below.'
            : 'Follow the known roads toward Whispering Woods. If you have arrived, look for a chance to speak.',
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
      description: `${available.length} conversation topic${available.length === 1 ? '' : 's'} ready now.`,
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

  // Gronk is anchored to City Center, not the Merchant District. A live
  // post-crisis decision may invite travel, but must never imply he is here.
  if (
    stage !== 'PROLOGUE' &&
    locationId === MERCHANT_DISTRICT_LOCATION_ID &&
    district?.tradeFlow === 'strong' &&
    discoveredNpcIds.has('npc_blacksmith_gronk') &&
    selectAvailableNPCDialogueChoices(state, 'npc_blacksmith_gronk')
      .some(topic => topic.id === 'gronk_m25_manifest_aftercare')
  ) {
    actions.push({
      id: 'district-manifest-followup',
      label: 'Follow up on the trade recovery',
      description: 'Gronk has an available manifest decision in City Center. Take the connected road there; he is not in this district.',
      to: '/game/dashboard#travel-controls',
      kind: 'travel',
    });
  }

  activeQuests.slice(0, 2).forEach(quest => {
    actions.push({
      id: `quest-${quest.id}`,
      label: `Review ${quest.title}`,
      description: quest.status === 'READY_TO_COMPLETE'
        ? 'Your objectives are complete. Review what happens next.'
        : 'Review the current objectives and what remains to do.',
      to: `/game/quests?quest=${encodeURIComponent(quest.id)}`,
      kind: 'quest',
    });
  });
  if (connections.length > 0 && !actions.some(action => action.id === 'prologue-travel')) {
    actions.push({
      id: 'travel',
      label: 'Explore connected locations',
      description: 'Choose an available road below. You will travel one stop at a time.',
      to: '/game/dashboard#travel-controls',
      kind: 'travel',
    });
  }
  if (actions.length === 0) {
    actions.push({
      id: 'relationships',
      label: 'Review known contacts',
      description: 'Return to people you have met and discover what has changed.',
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
  // Prefer the actual next player-known lead over an ontology-oriented
  // centerOfGravity string (which belongs in the design documentation).
  const availableHere = knownContactsHere.find(npc => selectAvailableNPCDialogueChoices(state, npc.id).length > 0);
  const currentChapterTitle = currentChapter?.title ?? chapterIdentity?.title ?? 'Your campaign';
  const chapterSituation = chapterIdentity?.playerSituation ?? `${currentChapterTitle} is underway.`;
  const situation = stage === 'PROLOGUE'
    ? knownContactsHere.some(npc => npc.id === 'npc_elder_willow')
      ? 'Elder Willow is in the woods. Review her conversation when it becomes available, or continue exploring the known routes.'
      : 'The road to the Whispering Woods leads toward Elder Willow and her first lesson.'
    : availableHere
      ? `${chapterSituation} ${availableHere.name} is here with an available conversation.`
      : storyContacts.length > 0
        ? `${chapterSituation} Someone you know has something new to discuss, though their location is not shown on this map.`
        : activeQuests.length > 0
          ? `${chapterSituation} ${activeQuests[0].title} is an unresolved quest in your journal.`
          : `${chapterSituation} Revisit known contacts and recorded decisions for your next lead.`;

  return {
    locationName: location?.name ?? state.player.location,
    locationDescription,
    situation,
    actions: actions.slice(0, 5),
    storyContacts,
    consequences: [
      ...selectCausalJournalEntries(state, 2).map(entry => ({
        id: entry.id,
        title: entry.title,
        explanation: `${entry.causeLabel}: ${entry.summary}`,
        to: `/game/npcs/${encodeURIComponent(entry.npcId)}`,
        timestamp: entry.timestamp,
      })),
      ...selectRecentRecordedDialogueExperiences(state, 2).map(entry => ({
        id: `experience-${entry.id}`,
        title: entry.title,
        explanation: `Your conversation with ${entry.npcName} is now part of your story.`,
        to: `/game/npcs/${encodeURIComponent(entry.npcId)}`,
        timestamp: entry.timestamp,
      })),
    ].sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3)
      .map(({ id, title, explanation, to }) => ({ id, title, explanation, to })),
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
