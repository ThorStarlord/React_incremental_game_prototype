
/**
 * Authored content still carries the historical requiredPermanentTraitIds key
 * for save/content compatibility. Under the universal Trait ontology that key
 * is consumed against the Player's currently expressed Trait set.
 */
export const getMissingExpressedTraitIds = (
  requiredTraitIds: readonly string[] | undefined,
  expressedTraitIds: readonly string[]
): string[] => {
  if (!requiredTraitIds || requiredTraitIds.length === 0) {
    return [];
  }

  const expressed = new Set(expressedTraitIds);
  return requiredTraitIds.filter(traitId => !expressed.has(traitId));
};

export const hasRequiredExpressedTraits = (
  requiredTraitIds: readonly string[] | undefined,
  expressedTraitIds: readonly string[]
): boolean => getMissingExpressedTraitIds(requiredTraitIds, expressedTraitIds).length === 0;

/** @deprecated Compatibility names; arguments now represent expressed Traits. */
export const getMissingPermanentTraitIds = getMissingExpressedTraitIds;
/** @deprecated Compatibility names; arguments now represent expressed Traits. */
export const hasRequiredPermanentTraits = hasRequiredExpressedTraits;
