import type { QuestResolutionOption } from './QuestTypes';
import {
  getMissingPermanentTraitIds,
  hasRequiredPermanentTraits,
} from '../../Traits/state/TraitCapabilityRequirements';
import {
  getMissingActiveDoctrineIds,
  hasRequiredActiveDoctrines,
} from '../../Traits/state/DoctrineCapabilityRequirements';
import type { DoctrineId } from '../../Traits/state/DoctrineDefinitions';

export const getMissingPermanentTraitIdsForResolution = (
  option: Pick<QuestResolutionOption, 'requiredPermanentTraitIds'>,
  permanentTraitIds: readonly string[]
): string[] => getMissingPermanentTraitIds(option.requiredPermanentTraitIds, permanentTraitIds);

export const getMissingActiveDoctrineIdsForResolution = (
  option: Pick<QuestResolutionOption, 'requiredActiveDoctrineIds'>,
  activeDoctrineIds: readonly DoctrineId[]
): DoctrineId[] =>
  getMissingActiveDoctrineIds(option.requiredActiveDoctrineIds, activeDoctrineIds);

export const canUseQuestResolution = (
  option: Pick<
    QuestResolutionOption,
    'requiredPermanentTraitIds' | 'requiredActiveDoctrineIds'
  >,
  permanentTraitIds: readonly string[],
  activeDoctrineIds: readonly DoctrineId[] = []
): boolean =>
  hasRequiredPermanentTraits(option.requiredPermanentTraitIds, permanentTraitIds) &&
  hasRequiredActiveDoctrines(option.requiredActiveDoctrineIds, activeDoctrineIds);
