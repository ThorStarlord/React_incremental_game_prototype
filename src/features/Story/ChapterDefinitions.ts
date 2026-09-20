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
  {
    id: 'lattice_under_strain',
    title: 'Lattice Under Strain',
    centerOfGravity: 'network pressure, multi-anchor diagnosis, and capability-shaped stabilization',
    description:
      'The Telluric Echo becomes a present network problem. Baseline containment remains viable while two relationship-derived build profiles create distinct legal stabilization strategies.',
    routes: [
      {
        id: 'surface_containment',
        label: 'Surface Containment',
        summary: 'Stabilize the visible failures through ordinary local response capacity, then recognize that containment is not the final countermeasure.',
        requiredExperienceIds: [
          'valerius_gc06_exp_surface_containment',
          'lyra_gc06_exp_chrono_crypt_route',
        ],
      },
      {
        id: 'structural_steward',
        label: 'Structural Steward',
        summary: 'Combine Willow\'s slow-system cognition with Gronk\'s constraint sense to reroute lattice load around the actual failure pattern.',
        requiredExperienceIds: [
          'gronk_gc06_exp_structural_steward',
          'lyra_gc06_exp_chrono_crypt_route',
        ],
      },
      {
        id: 'countermodeler',
        label: 'Countermodeler',
        summary: 'Combine Elara\'s contradiction-first inquiry with Lyra\'s adversarial calibration to phase the local response against the Echo.',
        requiredExperienceIds: [
          'lyra_gc06_exp_countermodeler',
          'lyra_gc06_exp_chrono_crypt_route',
        ],
      },
    ],
  },
  {
    id: 'chrono_crypt',
    title: 'The Chrono-Crypt',
    centerOfGravity: 'counterphase derivation, authored travel, and capability-deepened problem solving',
    description:
      'A later return to the crypt turns old harmonic failures into a reusable counterphase principle. Baseline derivation remains viable while the two established build profiles create faster, more legible approaches.',
    routes: [
      {
        id: 'manual_triangulation',
        label: 'Manual Harmonic Triangulation',
        summary: 'Compare preserved failures directly and derive the stable inverse without optional capabilities.',
        requiredExperienceIds: [
          'lyra_gc07_exp_manual_triangulation',
          'lyra_gc07_exp_counterphase_derived',
        ],
      },
      {
        id: 'structural_counterphase',
        label: 'Structural Counterphase',
        summary: 'Use slow-system cognition and constraint sense to derive the inverse from the structures carrying the failure.',
        requiredExperienceIds: [
          'lyra_gc07_exp_structural_counterphase',
          'lyra_gc07_exp_counterphase_derived',
        ],
      },
      {
        id: 'adversarial_countermodel',
        label: 'Adversarial Countermodel',
        summary: 'Use contradiction-first inquiry and adversarial calibration to predict the repeating phase and solve for its inverse.',
        requiredExperienceIds: [
          'lyra_gc07_exp_adversarial_countermodel',
          'lyra_gc07_exp_counterphase_derived',
        ],
      },
    ],
  },
  {
    id: 'network_under_pressure',
    title: 'Network Under Pressure',
    centerOfGravity: 'information asymmetry, institutional access, delegated repetition, and manual network commitment',
    description:
      'The counterphase must be distributed through a network whose members know different things and answer to different institutions. Repetitive preparation may be delegated, but briefing and posture choices remain player-owned.',
    routes: [
      {
        id: 'distributed',
        label: 'Distributed Preparation',
        summary: 'Use Elara\'s verified baseline preparation and commit the network to broad distributed execution.',
        requiredExperienceIds: [
          'elara_gc08_exp_network_diagnosis',
          'elara_gc08_exp_distributed_preparation',
          'lyra_gc08_exp_commit_distributed',
        ],
      },
      {
        id: 'structural',
        label: 'Structural Preparation',
        summary: 'Brief Gronk, prepare the actual load paths, and commit the network to a structural posture.',
        requiredExperienceIds: [
          'elara_gc08_exp_network_diagnosis',
          'gronk_gc08_exp_counterphase_briefed',
          'gronk_gc08_exp_structural_preparation',
          'lyra_gc08_exp_commit_structural',
        ],
      },
      {
        id: 'diagnostic',
        label: 'Diagnostic Preparation',
        summary: 'Use Elara\'s diagnostic preparation and commit the network as an adversarial sensor for the Echo.',
        requiredExperienceIds: [
          'elara_gc08_exp_network_diagnosis',
          'elara_gc08_exp_diagnostic_preparation',
          'lyra_gc08_exp_commit_diagnostic',
        ],
      },
      {
        id: 'fortified',
        label: 'Fortified Institutional Preparation',
        summary: 'Combine the distributed baseline with legal Watch logistics, then commit the network to a fortified posture.',
        requiredExperienceIds: [
          'elara_gc08_exp_network_diagnosis',
          'elara_gc08_exp_distributed_preparation',
          'valerius_gc08_exp_watch_mobilized',
          'lyra_gc08_exp_commit_fortified',
        ],
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
