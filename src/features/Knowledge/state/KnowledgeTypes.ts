export type KnowledgeFactId = string;

export interface KnowledgeState {
  /** Per-NPC awareness only. Objective truth remains owned by its source domain. */
  factIdsByNpcId: Record<string, KnowledgeFactId[]>;
}
