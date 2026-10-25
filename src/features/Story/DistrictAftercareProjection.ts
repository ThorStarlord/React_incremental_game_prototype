import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { MERCHANT_DISTRICT_LOCATION_ID, resolveCanonicalLocationId } from '../Exploration/LocationDefinitions';
import { isPlayerAtNpcWorldLocation } from '../NPCs/state/NPCWorldLocationDefinitions';
import { selectAvailableNPCDialogueChoices } from '../NPCs/state/NPCSelectors';
import { selectFactionReputation } from '../Factions/state/FactionSelectors';

/** The canonical records remain NPC conversation, per-NPC Knowledge, World State
 * and Faction standing. This is a current-location journal projection only. */
export interface DistrictAftercareView {
  id: string;
  title: string;
  status: 'available' | 'recorded';
  explanation: string;
  recordedChoice?: string;
  recordedStandingChanges: string[];
  currentStanding: string;
  action: { label: string; to: string; description: string };
}

/** A player-owned record of what one identified NPC heard; not a Memory,
 * a completed institutional review, or a claim about other NPCs' knowledge. */
export interface RecordedDistrictRequestView {
  id: string;
  npcId: string;
  npcName: string;
  title: string;
  recordedChoice?: string;
  authoredStandingChanges: string[];
}

const DISTRICT_FOLLOW_UPS = [
  {
    id: 'watch-ledger',
    npcId: 'npc_captain_valerius',
    conclusionId: 'valerius_m25_public_order_conclusion',
    topicId: 'valerius_m25_ledger_aftercare',
    pendingExplanation: 'The patrol-ledger conclusion is on record. You can ask who should review the Watch\'s account of the district.',
    completedExplanation: 'Valerius has recorded your request. It does not establish that any outside merchant has inspected the ledger.',
    actionLabel: 'Discuss the patrol ledger with Valerius',
  },
  {
    id: 'trade-manifest',
    npcId: 'npc_blacksmith_gronk',
    conclusionId: 'gronk_m25_quiet_network_conclusion',
    topicId: 'gronk_m25_manifest_aftercare',
    pendingExplanation: 'The restored trade route has a verified freight manifest. You can decide which institutional review Gronk should prepare.',
    completedExplanation: 'Gronk has recorded your instruction. It does not mean he has automatically delivered the manifest to the Watch.',
    actionLabel: 'Discuss the freight manifest with Gronk',
  },
] as const;

/**
 * A global, spoiler-safe projection of AFTERCARE DECISIONS ALREADY MADE.
 * Reuses the owning NPC's completed-dialogue history and per-NPC Knowledge.
 * Incomplete/undiscovered choices are absent; authored effects alone do not
 * prove a historical choice or grant facts to another character.
 */
export const selectRecordedDistrictRequests = createSelector(
  [
    (state: RootState) => state.npcs.npcs,
    (state: RootState) => state.npcs.discoveredNPCs,
    (state: RootState) => state.npcs.dialogueNodes,
    (state: RootState) => state.knowledge.factIdsByNpcId,
  ],
  (npcs, discoveredNpcIds, dialogueNodes, factsByNpcId): RecordedDistrictRequestView[] => {
    const discovered = new Set(discoveredNpcIds);
    return DISTRICT_FOLLOW_UPS.flatMap(route => {
      const npc = npcs[route.npcId];
      const node = dialogueNodes?.[route.topicId];
      if (
        !npc || !discovered.has(route.npcId) ||
        !npc.completedDialogues?.includes(route.conclusionId) ||
        !npc.completedDialogues.includes(route.topicId) ||
        !node || node.npcId !== route.npcId
      ) {
        return [];
      }

      const knownFacts = factsByNpcId[route.npcId] ?? [];
      const heardChoice = node.effects?.find(effect =>
        effect.type === 'KNOWLEDGE_FACT' &&
        Boolean(effect.responseId) &&
        knownFacts.includes(effect.factId)
      );
      const chosenResponseId = heardChoice?.responseId;
      const recordedChoice = chosenResponseId
        ? node.responses?.[chosenResponseId]
        : undefined;
      const authoredStandingChanges = chosenResponseId
        ? (node.effects ?? []).flatMap(effect =>
            effect.type === 'FACTION_REPUTATION' && effect.responseId === chosenResponseId
              ? [`${effect.factionId} ${effect.value >= 0 ? '+' : ''}${effect.value}`]
              : []
          )
        : [];

      return [{
        id: route.id,
        npcId: route.npcId,
        npcName: npc.name,
        title: node.title ?? 'District follow-up',
        recordedChoice,
        authoredStandingChanges,
      }];
    });
  }
);

/**
 * A return visit surfaces only a completed Chapter 1 route with an actually
 * available follow-up topic, or a follow-up already completed on this save.
 * Neither a World State condition by itself nor unread dialogue definitions
 * can reveal the other route's choice.
 */
export const selectDistrictAftercare = (state: RootState): DistrictAftercareView | null => {
  if (resolveCanonicalLocationId(state.player.location) !== MERCHANT_DISTRICT_LOCATION_ID) {
    return null;
  }

  for (const route of DISTRICT_FOLLOW_UPS) {
    const npc = state.npcs.npcs[route.npcId];
    if (!npc || !state.npcs.discoveredNPCs.includes(route.npcId)) continue;
    if (!npc.completedDialogues?.includes(route.conclusionId)) continue;

    const node = state.npcs.dialogueNodes?.[route.topicId];
    if (!node || node.npcId !== route.npcId) continue;

    const recorded = npc.completedDialogues.includes(route.topicId);
    const available = !recorded && selectAvailableNPCDialogueChoices(state, route.npcId)
      .some(choice => choice.id === route.topicId);
    if (!recorded && !available) continue;

    // Reuse the same NPC-attributed, completed-only record that the global
    // Player Insight panel displays. No duplicate story or knowledge authority.
    const recordedRequest = recorded
      ? selectRecordedDistrictRequests(state).find(item => item.id === route.id)
      : undefined;
    const currentStanding = ['City Watch', 'Merchants Guild']
      .map(id => `${id}: ${selectFactionReputation(state, id)}`)
      .join(' · ');

    const confirmedElsewhere = isPlayerAtNpcWorldLocation(route.npcId, state.player.location) === false;
    const readyAction = confirmedElsewhere
      ? {
          label: `Travel toward ${npc.name}`,
          to: '/game/dashboard#travel-controls',
          description: 'This person is anchored to another known location. Travel by the connected roads; this button does not teleport you.',
        }
      : {
          label: route.actionLabel,
          to: `/game/npcs/${encodeURIComponent(route.npcId)}?view=dialogue`,
          description: 'This is an authored story contact. An unanchored character is not confirmed to be physically here.',
        };

    return {
      id: route.id,
      title: node.title ?? 'A district follow-up',
      status: recorded ? 'recorded' : 'available',
      explanation: recorded ? route.completedExplanation : route.pendingExplanation,
      recordedChoice: recorded
        ? recordedRequest?.recordedChoice ?? 'The conversation was completed, but its specific request is not in the available Knowledge record.'
        : undefined,
      recordedStandingChanges: recordedRequest?.authoredStandingChanges ?? [],
      currentStanding,
      action: recorded
        ? {
            label: `Review the conversation with ${npc.name}`,
            to: `/game/npcs/${encodeURIComponent(route.npcId)}?view=dialogue`,
            description: 'Review recorded history. This does not offer the one-time choice again.',
          }
        : readyAction,
    };
  }

  return null;
};
