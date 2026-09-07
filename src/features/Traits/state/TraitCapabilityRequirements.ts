export const getMissingPermanentTraitIds = (
  requiredPermanentTraitIds: readonly string[] | undefined,
  permanentTraitIds: readonly string[]
): string[] => {
  if (!requiredPermanentTraitIds || requiredPermanentTraitIds.length === 0) {
    return [];
  }

  const owned = new Set(permanentTraitIds);
  return requiredPermanentTraitIds.filter(traitId => !owned.has(traitId));
};

export const hasRequiredPermanentTraits = (
  requiredPermanentTraitIds: readonly string[] | undefined,
  permanentTraitIds: readonly string[]
): boolean => getMissingPermanentTraitIds(requiredPermanentTraitIds, permanentTraitIds).length === 0;
