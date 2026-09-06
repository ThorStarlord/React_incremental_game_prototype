import type { RootState } from '../../../app/store';
import { COPY_SYSTEM, ESSENCE_GENERATION } from '../../../constants/gameConstants';
import { selectAllCopies } from '../../Copy/state/CopySelectors';
import { calculateCopyEssenceGeneration } from '../../Copy/utils/copyUtils';
import {
  selectAllRelationshipEssenceContributions,
  type RelationshipEssenceContribution,
} from '../../Relationships/state/RelationshipSelectors';

export interface EssenceRateCalculation {
  newRate: number;
  relationshipRate: number;
  copyRate: number;
  relationshipContributions: RelationshipEssenceContribution[];
}

/**
 * Pure passive-Essence rate calculation shared by the Essence domain and
 * relationship orchestration. Keeping this free of thunk imports prevents a
 * Relationships <-> Essence runtime module cycle.
 */
export const calculateEssenceGenerationRate = (
  state: RootState
): EssenceRateCalculation => {
  const allTraits = state.traits.traits;
  const copies = selectAllCopies(state);

  let totalRate = ESSENCE_GENERATION.BASE_RATE_PER_SECOND;

  const relationshipContributions = selectAllRelationshipEssenceContributions(state);
  const relationshipRate = relationshipContributions.reduce(
    (total, contribution) => total + contribution.effectiveRate,
    0
  );
  totalRate += relationshipRate;

  let copyRate = 0;
  for (const copy of copies) {
    if (copy.maturity >= COPY_SYSTEM.MATURITY_THRESHOLD) {
      copyRate += calculateCopyEssenceGeneration(copy, allTraits);
    }
  }
  totalRate += copyRate;

  return {
    newRate: totalRate,
    relationshipRate,
    copyRate,
    relationshipContributions,
  };
};
