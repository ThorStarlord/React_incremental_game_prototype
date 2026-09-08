import type { LocationDefinition } from './ExplorationTypes';

export const CITY_CENTER_LOCATION_ID = 'location_city_center';
export const CITY_GATE_LOCATION_ID = 'location_city_gate';
export const MERCHANT_DISTRICT_LOCATION_ID = 'location_merchant_district';
export const WHISPERING_WOODS_LOCATION_ID = 'location_whispering_woods';

export const EXPLORATION_LOCATIONS: readonly LocationDefinition[] = [
  {
    id: CITY_CENTER_LOCATION_ID,
    name: 'City Center',
    description: 'The civic heart of the city and the main junction for nearby districts.',
    connections: [MERCHANT_DISTRICT_LOCATION_ID, CITY_GATE_LOCATION_ID],
    legacyAliases: ['City Center'],
  },
  {
    id: MERCHANT_DISTRICT_LOCATION_ID,
    name: 'Merchant District',
    description: 'Crowded trade streets where Watch patrols, brokers, and caravans overlap.',
    connections: [CITY_CENTER_LOCATION_ID],
  },
  {
    id: CITY_GATE_LOCATION_ID,
    name: 'City Gate',
    description: 'The controlled passage between the city streets and the road to the woods.',
    connections: [CITY_CENTER_LOCATION_ID, WHISPERING_WOODS_LOCATION_ID],
  },
  {
    id: WHISPERING_WOODS_LOCATION_ID,
    name: 'Whispering Woods',
    description: 'An old-growth woodland where Willow studies slow changes in Essence and ecology.',
    connections: [CITY_GATE_LOCATION_ID],
  },
];

export const getLocationDefinition = (
  locationId: string
): LocationDefinition | undefined =>
  EXPLORATION_LOCATIONS.find(location => location.id === locationId);

export const resolveCanonicalLocationId = (
  locationValue: string
): string | undefined => {
  const direct = getLocationDefinition(locationValue);
  if (direct) return direct.id;

  return EXPLORATION_LOCATIONS.find(location =>
    location.legacyAliases?.includes(locationValue)
  )?.id;
};

export const getConnectedLocationDefinitions = (
  locationValue: string
): LocationDefinition[] => {
  const currentId = resolveCanonicalLocationId(locationValue);
  if (!currentId) return [];

  const current = getLocationDefinition(currentId);
  if (!current) return [];

  return current.connections
    .map(connectionId => getLocationDefinition(connectionId))
    .filter((location): location is LocationDefinition => Boolean(location));
};

export const areLocationsDirectlyConnected = (
  fromLocationValue: string,
  toLocationValue: string
): boolean => {
  const fromId = resolveCanonicalLocationId(fromLocationValue);
  const toId = resolveCanonicalLocationId(toLocationValue);
  if (!fromId || !toId || fromId === toId) return false;

  const from = getLocationDefinition(fromId);
  return Boolean(from?.connections.includes(toId));
};
