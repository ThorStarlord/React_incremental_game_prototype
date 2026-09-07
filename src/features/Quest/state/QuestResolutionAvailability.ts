import type { QuestResolutionOption } from './QuestTypes';
import {
  getMissingPermanentTraitIds,
  hasRequiredPermanentTraits,
} from '../../Traits/state/TraitCapabilityRequirements';

export const getMissingPermanentTraitIdsForResolution = (
  option: Pick<QuestResolutionOption, 'requiredPermanentTraitIds'>,
  permanentTraitIds: readonly string[]
): string[] => getMissingPermanentTraitIds(option.requiredPermanentTraitIds, permanentTraitIds);

export const canUseQuestResolution = (
  option: Pick<QuestResolutionOption, 'requiredPermanentTraitIds'>,
  permanentTraitIds: readonly string[]
): boolean => hasRequiredPermanentTraits(option.requiredPermanentTraitIds, permanentTraitIds);
