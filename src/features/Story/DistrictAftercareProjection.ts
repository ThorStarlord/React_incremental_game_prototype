import type { RootState } from '../../app/store';
import { MERCHANT_DISTRICT_LOCATION_ID, resolveCanonicalLocationId } from '../Exploration/LocationDefinitions';
import { isPlayerAtNpcWorldLocation } from '../NPCs/state/NPCWorldLocationDefinitions';
import { selectAvailableNPCDialogueChoices } from '../NPCs/state/NPCSelectors';
import { selectNpcKnownFactIds } from '../Knowledge/state/KnowledgeSelectors';
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

    // Only the NPC that actually heard the request owns its recorded fact.
    const knownFacts = selectNpcKnownFactIds(state, route.npcId);
    const chosenFactEffect = recorded
      ? node.effects?.find(effect =>
          effect.type === 'KNOWLEDGE_FACT' &&
          Boolean(effect.responseId) &&
          knownFacts.includes(effect.factId)
        )
      : undefined;
    const chosenResponse = chosenFactEffect?.responseId;
    const recordedChoice = chosenResponse && node.responses
      ? node.responses[chosenResponse]
      : undefined;
    const recordedStandingChanges = chosenResponse
      ? (node.effects ?? []).flatMap(effect =>
          effect.type === 'FACTION_REPUTATION' && effect.responseId === chosenResponse
            ? [`${effect.factionId} ${effect.value >= 0 ? '+' : ''}${effect.value}`]
            : []
        )
      : [];
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
        ? recordedChoice ?? 'The conversation was completed, but its specific request is not in the available Knowledge record.'
        : undefined,
      recordedStandingChanges,
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
