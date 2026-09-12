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
    title: 'The Lattice Under Strain',
    centerOfGravity: 'public pressure, institutional visibility, and the cost of coordination',
    description:
      'The first Campaign One chapter converts the Merchant District consequences into an explicit choice about whether pressure should be named or redirected.',
    routes: [
      {
        id: 'public_pressure',
        label: 'Public Pressure',
        summary: 'Name the pressure and make institutions carry it in public.',
        requiredExperienceIds: ['valerius_exp_lattice_public'],
      },
      {
        id: 'quiet_pressure',
        label: 'Quiet Pressure',
        summary: 'Redirect pressure through a stable private route.',
        requiredExperienceIds: ['valerius_exp_lattice_quiet'],
      },
    ],
  },
  {
    id: 'chrono_crypt',
    title: 'The Chrono-Crypt',
    centerOfGravity: 'contradictory evidence, access, and the right to inspect a dangerous record',
    description:
      'Elara and Lyra expose the counterphase map, requiring the protagonist to turn evidence into access without pretending the contradiction is solved.',
    routes: [
      {
        id: 'verified_entry',
        label: 'Verified Entry',
        summary: 'Verify the model, coordinate access, and open the crypt.',
        requiredExperienceIds: ['elara_exp_chrono_verified', 'lyra_exp_chrono_opened'],
      },
      {
        id: 'operational_entry',
        label: 'Operational Entry',
        summary: 'Use a workable approximation, then challenge the entry conditions directly.',
        requiredExperienceIds: ['elara_exp_chrono_operational', 'lyra_exp_chrono_contested'],
      },
    ],
  },
  {
    id: 'network_under_pressure',
    title: 'Network Under Pressure',
    centerOfGravity: 'load paths, delegated competence, and the ethics of routing leverage',
    description:
      'The network chapter tests whether the protagonist can audit a delegated operation before choosing how much leverage to reveal or seal.',
    routes: [
      {
        id: 'trusted_route',
        label: 'Trusted Route',
        summary: 'Audit the load path, then route leverage through a trusted channel.',
        requiredExperienceIds: ['gronk_exp_network_load', 'silas_exp_network_route'],
      },
      {
        id: 'sealed_route',
        label: 'Sealed Route',
        summary: 'Accept operational risk and keep the most dangerous leverage sealed.',
        requiredExperienceIds: ['gronk_exp_network_risk', 'silas_exp_network_sealed'],
      },
    ],
  },
  {
    id: 'counterphase_commitment',
    title: 'Counterphase Commitment',
    centerOfGravity: 'visible control, adaptive networks, and institutional commitment',
    description:
      'Valerius forces the campaign to choose whether stability belongs to a visible institution or to a network that can adapt beyond it.',
    routes: [
      {
        id: 'institutional_commitment',
        label: 'Institutional Commitment',
        summary: 'Commit the Watch to the visible line and accept the cost of public control.',
        requiredExperienceIds: ['valerius_exp_counterphase_commitment'],
      },
      {
        id: 'network_commitment',
        label: 'Network Commitment',
        summary: 'Commit to the adaptive network and accept the uncertainty of indirect control.',
        requiredExperienceIds: ['valerius_exp_counterphase_network'],
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
