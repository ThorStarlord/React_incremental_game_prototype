import {
  CITY_CENTER_LOCATION_ID,
  getLocationDefinition,
  resolveCanonicalLocationId,
} from '../Exploration/LocationDefinitions';
import type { Copy, CopyProductionTaskId, CopyRole } from './state/CopyTypes';

export interface CopyProductionTaskReward {
  gold?: number;
  essence?: number;
}

export interface CopyProductionTaskDefinition {
  id: CopyProductionTaskId;
  name: string;
  description: string;
  familiarityHint: string;
  baseDurationSeconds: number;
  minimumMaturity?: number;
  minimumLoyalty?: number;
  allowedRoles?: readonly CopyRole[];
  requiredLocationId?: string;
  reward: CopyProductionTaskReward;
}

export interface CopyProductionTaskEligibility {
  eligible: boolean;
  reasons: string[];
}

export const COPY_PRODUCTION_TASKS: readonly CopyProductionTaskDefinition[] = [
  {
    id: 'forge_assistance',
    name: 'Forge Assistance',
    description:
      'Handle repeatable workshop support and equipment upkeep in the City Center.',
    familiarityHint: 'Practice Forge Assistance yourself in the City Center first.',
    baseDurationSeconds: 60,
    minimumMaturity: 50,
    allowedRoles: ['guardian', 'agent'],
    requiredLocationId: CITY_CENTER_LOCATION_ID,
    reward: { gold: 15 },
  },
  {
    id: 'resonance_calibration',
    name: 'Resonance Calibration',
    description:
      'Run a controlled repeatable Essence calibration routine and return the stabilized yield.',
    familiarityHint: 'Successfully Resonate a Trait yourself before delegating calibration.',
    baseDurationSeconds: 90,
    minimumMaturity: 75,
    minimumLoyalty: 55,
    allowedRoles: ['researcher', 'agent'],
    reward: { essence: 8 },
  },
] as const;

export const getCopyProductionTaskDefinition = (
  taskId: string
): CopyProductionTaskDefinition | undefined =>
  COPY_PRODUCTION_TASKS.find(task => task.id === taskId);

export const evaluateCopyProductionTaskEligibility = (
  copy: Copy,
  task: CopyProductionTaskDefinition,
  isFamiliar: boolean
): CopyProductionTaskEligibility => {
  const reasons: string[] = [];

  if (!isFamiliar) {
    reasons.push(task.familiarityHint);
  }

  if (
    task.minimumMaturity !== undefined &&
    copy.maturity < task.minimumMaturity
  ) {
    reasons.push(`Requires maturity ${task.minimumMaturity}+.`);
  }

  if (
    task.minimumLoyalty !== undefined &&
    copy.loyalty < task.minimumLoyalty
  ) {
    reasons.push(`Requires loyalty ${task.minimumLoyalty}+.`);
  }

  if (
    task.allowedRoles &&
    !task.allowedRoles.includes(copy.role ?? 'none')
  ) {
    reasons.push(`Requires role: ${task.allowedRoles.join(' or ')}.`);
  }

  if (task.requiredLocationId) {
    const canonicalCopyLocation = resolveCanonicalLocationId(copy.location);
    if (canonicalCopyLocation !== task.requiredLocationId) {
      const locationName =
        getLocationDefinition(task.requiredLocationId)?.name ?? task.requiredLocationId;
      reasons.push(`Requires Copy presence at ${locationName}.`);
    }
  }

  return { eligible: reasons.length === 0, reasons };
};

/**
 * Canonical role-adjusted duration used by both single-Copy and portfolio
 * assignment paths. Keeping this calculation here prevents two assignment
 * surfaces from drifting on the same authored task contract.
 */
export const getCopyProductionTaskDurationSeconds = (
  copy: Copy,
  task: CopyProductionTaskDefinition
): number => {
  let multiplier = 1;
  switch (copy.role ?? 'none') {
    case 'infiltrator':
      multiplier = 0.9;
      break;
    case 'researcher':
      multiplier = 0.95;
      break;
    case 'guardian':
      multiplier = 1.05;
      break;
    case 'agent':
    case 'none':
    default:
      multiplier = 1;
      break;
  }
  return Math.max(1, Math.round(task.baseDurationSeconds * multiplier));
};