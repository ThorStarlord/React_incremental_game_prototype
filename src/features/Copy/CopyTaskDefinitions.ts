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
  task: CopyProductionTaskDefinition
): CopyProductionTaskEligibility => {
  const reasons: string[] = [];

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
