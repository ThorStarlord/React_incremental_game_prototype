export interface ChapterRouteDefinition {
  id: string;
  label: string;
  summary: string;
  requiredExperienceIds?: readonly string[];
  requiredCompletedDialogueIds?: readonly string[];
}

interface ChapterDefinitionShape {
  id: string;
  title: string;
  centerOfGravity: string;
  description: string;
  routes: readonly ChapterRouteDefinition[];
}

const ARCHIVE_INQUIRY_SHARED_OPENING = [
  'elara_exp_model_challenged',
  'elara_exp_contradictory_footnote',
  'elara_exp_tome_committed',
] as const;

const LYRA_ADVERSARIAL_CALIBRATION_ARC = [
  'lyra_exp_strategic_defeat',
  'lyra_exp_coercion_reflected',
  'lyra_exp_reluctant_cotraining',
  'lyra_exp_ideological_friction',
  'lyra_exp_mutual_calibration',
  'lyra_exp_proto_bond',
] as const;

/**
 * Presentation-only chapter definitions.
 *
 * These definitions project existing domain authority into a chapter-scale view.
 * They are not a chapter state machine, reducer, condition DSL, or save-schema root.
 */
export const CHAPTER_DEFINITIONS = [
  {
    id: 'merchant_district',
    title: 'Merchant District Crisis',
    centerOfGravity: 'institutions, trade, public order, and social coordination',
    description:
      'The M25 chapter composes Relationship, Knowledge, Faction, World State, combat, travel, delegation, persistence, and bounded offline progression.',
    routes: [
      {
        id: 'public_order',
        label: 'Public Order / Institutional Friction',
        summary: 'Control is restored at an explicit legitimacy cost.',
        requiredCompletedDialogueIds: ['valerius_m25_public_order_conclusion'],
      },
      {
        id: 'quiet_network',
        label: 'Quiet Network / Trade Recovery',
        summary: 'Trade recovers through a quieter network of proven routes and institutional permission.',
        requiredCompletedDialogueIds: ['gronk_m25_quiet_network_conclusion'],
      },
    ],
  },
  {
    id: 'archive_inquiry',
    title: 'Archive Inquiry',
    centerOfGravity: 'evidence interpretation, reciprocal revision, and independent verification',
    description:
      'A heterogeneous second chapter-scale composition derived from the existing Elara inquiry arc. Both routes can mature into Scholarly Insight while preserving different relationship history.',
    routes: [
      {
        id: 'evidence_over_ownership',
        label: 'Evidence Over Ownership',
        summary: 'Accept the costly correction early, then continue through reciprocal revision and independent verification.',
        requiredExperienceIds: [
          ...ARCHIVE_INQUIRY_SHARED_OPENING,
          'elara_exp_follow_evidence',
          'elara_exp_revision_mutual',
          'elara_exp_theory_neither_owned',
          'elara_exp_independent_verification',
        ],
      },
      {
        id: 'cautious_then_reopened',
        label: 'Cautious Consensus, Later Reopened',
        summary: 'Protect the initial consensus, then earn the same method through later reciprocal revision and independent verification.',
        requiredExperienceIds: [
          ...ARCHIVE_INQUIRY_SHARED_OPENING,
          'elara_exp_protect_consensus',
          'elara_exp_revision_mutual',
          'elara_exp_theory_neither_owned',
          'elara_exp_independent_verification',
        ],
      },
    ],
  },
  {
    id: 'adversarial_calibration',
    title: 'Enemies in Phase',
    centerOfGravity: 'adversarial learning, calibrated opposition, and necessary cooperation',
    description:
      'A third chapter-scale composition derived from Lyra\'s existing arc. Progress comes from learning an opponent accurately enough to cooperate without requiring ideological convergence or affection.',
    routes: [
      {
        id: 'calibrated_opposition',
        label: 'Calibrated Opposition',
        summary: 'Move from strategic defeat through reflected coercion and reluctant co-training into mutual calibration without dissolving the underlying disagreement.',
        requiredExperienceIds: [...LYRA_ADVERSARIAL_CALIBRATION_ARC],
      },
    ],
  },
] as const satisfies readonly ChapterDefinitionShape[];

/**
 * Chapter identity is derived from the canonical definition list so adding or
 * removing a definition cannot drift from a separately maintained union.
 */
export type ChapterId = (typeof CHAPTER_DEFINITIONS)[number]['id'];

export type ChapterDefinition = Omit<ChapterDefinitionShape, 'id'> & {
  id: ChapterId;
};

export const getChapterDefinition = (chapterId: ChapterId): ChapterDefinition => {
  const chapter = CHAPTER_DEFINITIONS.find(candidate => candidate.id === chapterId);
  if (!chapter) throw new Error(`Unknown chapter definition: ${chapterId}`);
  return chapter;
};
