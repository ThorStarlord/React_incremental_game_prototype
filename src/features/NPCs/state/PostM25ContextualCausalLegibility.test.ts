import fs from 'fs';
import path from 'path';
import type { DialogueNode } from './NPCTypes';
import { evaluateDialogueAvailabilityPresentation } from './DialogueAvailabilityPresentation';

const baseContext = {
  completedDialogueIds: [] as string[],
  recordedExperiences: {} as Record<string, { title?: string }>,
  routineFamiliarity: {} as Record<string, unknown>,
  knownFactIds: [] as string[],
  factionReputationByFactionId: {} as Record<string, number>,
  worldStateRegions: {},
  activeDoctrineIds: [] as const,
};

describe('post-M25 contextual causal legibility', () => {
  test('an available topic explains itself from already-recorded player evidence', () => {
    const node: DialogueNode = {
      id: 'explainable_topic',
      title: 'Revisit the Evidence',
      requiredExperienceIds: ['elara_exp_independent_verification'],
    };

    const result = evaluateDialogueAvailabilityPresentation(node, {
      ...baseContext,
      recordedExperiences: {
        elara_exp_independent_verification: {
          title: 'The Result Held Without Her',
        },
      },
    });

    expect(result).toEqual({
      available: true,
      availabilityReasons: ['The Result Held Without Her'],
    });
  });

  test('a locked topic returns no causal details and therefore cannot become a spoiler list', () => {
    const node: DialogueNode = {
      id: 'future_branch',
      title: 'Future Branch',
      requiredExperienceIds: ['hidden_future_experience'],
      requiredKnowledgeFactIds: ['hidden_future_fact'],
    };

    expect(evaluateDialogueAvailabilityPresentation(node, baseContext)).toEqual({
      available: false,
      availabilityReasons: [],
    });
  });

  test('active doctrine requirements stay spoiler-safe while explaining available specialization', () => {
    const node: DialogueNode = {
      id: 'structural_topic',
      title: 'Read the Load Paths',
      requiredActiveDoctrineIds: ['structural_steward'],
    };

    expect(evaluateDialogueAvailabilityPresentation(node, baseContext)).toEqual({
      available: false,
      availabilityReasons: [],
    });

    expect(evaluateDialogueAvailabilityPresentation(node, {
      ...baseContext,
      activeDoctrineIds: ['structural_steward'],
    })).toEqual({
      available: true,
      availabilityReasons: ['Active doctrine: Structural Steward'],
    });
  });

  test('negative prerequisites constrain availability without being narrated as hints', () => {
    const node: DialogueNode = {
      id: 'knowledge_sensitive_topic',
      forbiddenKnowledgeFactIds: ['already_disclosed_secret'],
    };

    const result = evaluateDialogueAvailabilityPresentation(node, {
      ...baseContext,
      knownFactIds: ['already_disclosed_secret'],
    });

    expect(result.available).toBe(false);
    expect(result.availabilityReasons).toEqual([]);
  });

  test('the dialogue surface renders explanation only on choices that survived availability filtering', () => {
    const source = fs.readFileSync(
      path.join(
        process.cwd(),
        'src/features/NPCs/components/ui/tabs/NPCDialogueTab.tsx'
      ),
      'utf8'
    );

    expect(source).toContain('selectAvailableNPCDialogueChoices');
    expect(source).not.toContain('evaluateDialogueAvailabilityPresentation');
    expect(source).toContain('Available because:');
    expect(source).not.toContain('Locked because:');
  });
});
