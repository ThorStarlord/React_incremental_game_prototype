import fs from 'fs';
import path from 'path';

type CampaignContent = {
  npcDialogueIds: Record<string, string[]>;
  dialogues: Record<string, {
    effects?: Array<{ type?: string; epilogueVariant?: string; experienceIdByResponse?: Record<string, string> }>;
  }>;
};

const content = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'public/data/campaign-one-content.json'), 'utf8')
) as CampaignContent;

describe('Campaign One authored content integrity', () => {
  test('all authored campaign units are attached to concrete NPC surfaces', () => {
    const attachedDialogueIds = new Set(Object.values(content.npcDialogueIds).flat());
    const expectedDialogueIds = [
      'valerius_lattice_under_strain',
      'elara_chrono_crypt_briefing',
      'lyra_chrono_crypt_entry',
      'gronk_network_load',
      'silas_network_pressure',
      'valerius_counterphase_commitment',
      'telluric_echo_confrontation',
    ];

    expect(Object.keys(content.dialogues)).toEqual(expect.arrayContaining(expectedDialogueIds));
    for (const dialogueId of expectedDialogueIds) {
      expect(attachedDialogueIds.has(dialogueId)).toBe(true);
    }
  });

  test('each campaign decision records branch-specific relationship evidence', () => {
    for (const dialogue of Object.values(content.dialogues)) {
      const relationshipEffects = (dialogue.effects ?? []).filter(
        effect => effect.type === 'RELATIONSHIP_EXPERIENCE'
      );
      expect(relationshipEffects.length).toBeGreaterThan(0);
      expect(relationshipEffects.some(effect => Object.keys(effect.experienceIdByResponse ?? {}).length > 0)).toBe(true);
    }
  });

  test('the finale owns both persisted epilogue variants and no earlier unit can complete the campaign', () => {
    const finale = content.dialogues.telluric_echo_confrontation;
    const completionEffects = (finale.effects ?? []).filter(
      effect => effect.type === 'CAMPAIGN_COMPLETE'
    );

    expect(completionEffects.map(effect => effect.epilogueVariant)).toEqual([
      'institutional_reckoning',
      'conditional_reprieve',
    ]);
    for (const [dialogueId, dialogue] of Object.entries(content.dialogues)) {
      if (dialogueId === 'telluric_echo_confrontation') continue;
      expect((dialogue.effects ?? []).some(effect => effect.type === 'CAMPAIGN_COMPLETE')).toBe(false);
    }
  });
});
