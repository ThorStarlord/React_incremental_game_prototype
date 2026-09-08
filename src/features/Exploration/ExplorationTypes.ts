export interface LocationDefinition {
  id: string;
  name: string;
  description: string;
  connections: readonly string[];
  legacyAliases?: readonly string[];
}

export interface TravelResult {
  fromLocationId: string;
  toLocationId: string;
}
