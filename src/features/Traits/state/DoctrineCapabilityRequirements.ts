import type { DoctrineId } from './DoctrineDefinitions';

export const getMissingActiveDoctrineIds = (
  requiredActiveDoctrineIds: readonly DoctrineId[] | undefined,
  activeDoctrineIds: readonly DoctrineId[]
): DoctrineId[] => {
  if (!requiredActiveDoctrineIds || requiredActiveDoctrineIds.length === 0) {
    return [];
  }

  const active = new Set(activeDoctrineIds);
  return requiredActiveDoctrineIds.filter(doctrineId => !active.has(doctrineId));
};

export const hasRequiredActiveDoctrines = (
  requiredActiveDoctrineIds: readonly DoctrineId[] | undefined,
  activeDoctrineIds: readonly DoctrineId[]
): boolean =>
  getMissingActiveDoctrineIds(requiredActiveDoctrineIds, activeDoctrineIds).length === 0;
