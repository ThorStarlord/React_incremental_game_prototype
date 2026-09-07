import type { QuestResolutionOption } from './QuestTypes';

export const getMissingPermanentTraitIdsForResolution = (
  option: Pick<QuestResolutionOption, 'requiredPermanentTraitIds'>,
  permanentTraitIds: readonly string[]
): string[] => {
  const owned = new Set(permanentTraitIds);
  return (option.requiredPermanentTraitIds ?? []).filter(traitId => !owned.has(traitId));
};

export const canUseQuestResolution = (
  option: Pick<QuestResolutionOption, 'requiredPermanentTraitIds'>,
  permanentTraitIds: readonly string[]
): boolean => getMissingPermanentTraitIdsForResolution(option, permanentTraitIds).length === 0;
