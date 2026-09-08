import {
  CITY_CENTER_LOCATION_ID,
} from '../Exploration/LocationDefinitions';
import type { CopyProductionTaskId, CopyRole } from './state/CopyTypes';

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
