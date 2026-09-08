import {
  CITY_CENTER_LOCATION_ID,
  WHISPERING_WOODS_LOCATION_ID,
  resolveCanonicalLocationId,
} from '../../Exploration/LocationDefinitions';

/**
 * Bounded authored canonical world anchors for NPCs whose objective spatial
 * presence is qualified by M19. Human-readable NPC.location remains separate.
 *
 * This is definition data, not NPC-specific branching control flow. Future
 * moving/scheduled NPCs may replace this static authority with live world state.
 */
export const NPC_WORLD_LOCATION_IDS: Readonly<Record<string, string>> = {
  npc_elder_willow: WHISPERING_WOODS_LOCATION_ID,
  npc_blacksmith_gronk: CITY_CENTER_LOCATION_ID,
};

export const getNpcWorldLocationId = (npcId: string): string | undefined =>
  NPC_WORLD_LOCATION_IDS[npcId];

/**
 * Returns whether a canonically anchored NPC is physically present with the
 * player. `undefined` means this bounded model has no canonical anchor for the
 * NPC and callers should preserve legacy behavior rather than guessing.
 */
export const isAnchoredNpcPhysicallyPresent = (
  npcId: string,
  playerLocationValue: string
): boolean | undefined => {
  const npcLocationId = getNpcWorldLocationId(npcId);
  if (!npcLocationId) return undefined;

  const canonicalNpcLocationId = resolveCanonicalLocationId(npcLocationId);
  const canonicalPlayerLocationId = resolveCanonicalLocationId(playerLocationValue);
  if (!canonicalNpcLocationId || !canonicalPlayerLocationId) return false;

  return canonicalNpcLocationId === canonicalPlayerLocationId;
};
