import { Trait, TraitFilters } from '../state/TraitsTypes'; // Assuming TraitDefinition is now Trait, and TraitFilters is moved

/**
 * Filters traits based on specified criteria
 *
 * @param traits - Object containing all traits
 * @param filters - Filtering criteria (type, maxCost, searchTerm)
 * @returns Filtered traits object
 */
export const filterTraits = (
  traits: { [id: string]: Trait },
  filters: TraitFilters = {}
): { [id: string]: Trait } => {
  const { type, maxCost, searchTerm } = filters;

  return Object.entries(traits).reduce((filtered, [id, trait]) => {
    let include = true;

    // Filter by category (assuming 'type' filter means category)
    if (type && trait.category !== type) {
      include = false;
    }

    // Filter by max essence cost
    if (maxCost !== undefined && (trait.essenceCost ?? 0) > maxCost) {
      include = false;
    }

    // Filter by search term (name or description)
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      if (!trait.name.toLowerCase().includes(lowerSearchTerm) &&
          !trait.description.toLowerCase().includes(lowerSearchTerm)) {
        include = false;
      }
    }

    if (include) {
      filtered[id] = trait;
    }

    return filtered;
  }, {} as { [id: string]: Trait });
};

/**
 * Sorts traits by a specified property
 *
 * @param traits - Object containing traits
 * @param sortBy - Property to sort by (e.g., 'essenceCost', 'name')
 * @param ascending - Whether to sort in ascending order
 * @returns Array of trait entries [id, trait] sorted as specified
 */
export const sortTraits = (
  traits: { [id: string]: Trait },
  sortBy: keyof Trait = 'name',
  ascending: boolean = true
): [string, Trait][] => {
  return Object.entries(traits).sort(([idA, traitA], [idB, traitB]) => {
    const valueA = traitA[sortBy];
    const valueB = traitB[sortBy];

    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Handle number comparison (treat undefined/null as 0 for sorting)
    if (typeof valueA === 'number' || valueA === undefined || valueA === null ||
        typeof valueB === 'number' || valueB === undefined || valueB === null) {
      const numA = typeof valueA === 'number' ? valueA : 0;
      const numB = typeof valueB === 'number' ? valueB : 0;
      return ascending
        ? numA - numB
        : numB - numA;
    }

    // Default case (e.g., objects, arrays) - no change in order
    return 0;
  });
};
