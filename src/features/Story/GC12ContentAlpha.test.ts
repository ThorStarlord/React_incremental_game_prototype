import fs from 'fs';
import path from 'path';

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const dialogueCatalogPaths = [
  'public/data/dialogues.json',
  'public/data/m24-world-state-content.json',
  'public/data/m25-chapter-content.json',
  'public/data/gc06-lattice-content.json',
  'public/data/gc07-chrono-crypt-content.json',
  'public/data/gc08-network-content.json',
  'public/data/gc09-counterphase-content.json',
  'public/data/gc10-finale-content.json',
] as const;

const terminalNarrationIds = new Set([
  'elder_willow_wisdom',
  'elder_willow_lore',
  'gronk_smile',
]);

const playerVisibleTextFields = new Set([
  'title',
  'text',
  'description',
  'summary',
  'interpretation',
  'protagonistView',
  'targetView',
  'logMessage',
  'label',
]);

const prohibitedMarkers = [
  /\bTODO\b/i,
  /\bTBD\b/i,
  /\bplaceholder\b/i,
  /\bprototype\b/i,
  /\btest copy\b/i,
  /\bdebug\b/i,
  /\bdiagnostic prose\b/i,
  /\btemporary copy\b/i,
  /\blorem\b/i,
  /\bGC-\d+\b/i,
  /\bM\d{1,2}\b/i,
];

const assertIntentionalText = (value: unknown, label: string) => {
  expect(typeof value).toBe('string');
  expect(String(value).trim().length).toBeGreaterThan(0);
  for (const marker of prohibitedMarkers) {
    expect(String(value)).not.toMatch(marker);
  }
};

const scanVisibleStrings = (value: unknown, pathLabel: string): void => {
  if (Array.isArray(value)) {
    value.forEach((entry, index) =>
      scanVisibleStrings(entry, `${pathLabel}[${index}]`)
    );
    return;
  }
  if (!value || typeof value !== 'object') return;

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const childPath = pathLabel ? `${pathLabel}.${key}` : key;
    if (typeof child === 'string' && playerVisibleTextFields.has(key)) {
      assertIntentionalText(child, childPath);
    }
    if (key === 'responses' && child && typeof child === 'object') {
      for (const [responseId, responseLabel] of Object.entries(
        child as Record<string, unknown>
      )) {
        assertIntentionalText(responseLabel, `${childPath}.${responseId}`);
      }
    }
    if (child && typeof child === 'object') {
      scanVisibleStrings(child, childPath);
    }
  }
};

const dialogueCatalog = Object.assign(
  {},
  ...dialogueCatalogPaths.map(relativePath => {
    const data = readJson(relativePath);
    return relativePath.endsWith('/dialogues.json')
      ? data
      : (data.dialogues ?? {});
  })
);

const quests = readJson('public/data/quests.json');
const relationshipManifest = readJson('public/data/relationships/index.json');
const relationshipBundles = relationshipManifest.bundles.map((url: string) =>
  readJson(`public${url}`)
);
const experiences = Object.assign(
  {},
  ...relationshipBundles.map((bundle: any) => bundle.experiences ?? {})
);
const memories = Object.assign(
  {},
  ...relationshipBundles.map((bundle: any) => bundle.memories ?? {})
);

describe('GC-12 Content Alpha completion', () => {
  test('all authored campaign dialogue has intentional display copy and bounded terminal narration', () => {
    for (const [dialogueId, dialogue] of Object.entries<any>(dialogueCatalog)) {
      assertIntentionalText(dialogue.title, `dialogue:${dialogueId}.title`);
      assertIntentionalText(dialogue.text, `dialogue:${dialogueId}.text`);

      const responses = dialogue.responses ?? {};
      if (Object.keys(responses).length === 0) {
        expect(terminalNarrationIds.has(dialogueId)).toBe(true);
      } else {
        for (const [responseId, label] of Object.entries(responses)) {
          assertIntentionalText(
            label,
            `dialogue:${dialogueId}.responses.${responseId}`
          );
        }
      }
    }

    expect(
      Object.keys(dialogueCatalog).filter(
        id => Object.keys(dialogueCatalog[id].responses ?? {}).length === 0
      ).sort()
    ).toEqual(Array.from(terminalNarrationIds).sort());
  });

  test('all production Quests and resolutions have authored player-facing copy', () => {
    for (const [questId, quest] of Object.entries<any>(quests)) {
      assertIntentionalText(quest.title, `quest:${questId}.title`);
      assertIntentionalText(
        quest.description,
        `quest:${questId}.description`
      );

      for (const objective of quest.objectives ?? []) {
        assertIntentionalText(
          objective.description,
          `quest:${questId}.objective:${objective.objectiveId}`
        );
      }

      if (quest.resolutionRequired) {
        expect((quest.resolutionOptions ?? []).length).toBeGreaterThan(0);
      }
      for (const resolution of quest.resolutionOptions ?? []) {
        assertIntentionalText(
          resolution.label,
          `quest:${questId}.resolution:${resolution.id}.label`
        );
        assertIntentionalText(
          resolution.description,
          `quest:${questId}.resolution:${resolution.id}.description`
        );
        assertIntentionalText(
          resolution.logMessage,
          `quest:${questId}.resolution:${resolution.id}.logMessage`
        );
      }
    }
  });

  test('relationship consequences and player-visible Memories contain complete authored interpretation', () => {
    for (const [experienceId, experience] of Object.entries<any>(experiences)) {
      assertIntentionalText(
        experience.title,
        `experience:${experienceId}.title`
      );
      assertIntentionalText(
        experience.interpretation,
        `experience:${experienceId}.interpretation`
      );
    }

    for (const [memoryId, memory] of Object.entries<any>(memories)) {
      assertIntentionalText(memory.title, `memory:${memoryId}.title`);
      assertIntentionalText(memory.summary, `memory:${memoryId}.summary`);
      if (memory.playerVisible) {
        assertIntentionalText(
          memory.protagonistView,
          `memory:${memoryId}.protagonistView`
        );
        assertIntentionalText(
          memory.targetView,
          `memory:${memoryId}.targetView`
        );
      }
    }
  });

  test('no player-visible campaign field contains completion-program or placeholder copy', () => {
    dialogueCatalogPaths.forEach(relativePath =>
      scanVisibleStrings(readJson(relativePath), relativePath)
    );
    scanVisibleStrings(quests, 'public/data/quests.json');
    relationshipManifest.bundles.forEach((url: string) =>
      scanVisibleStrings(readJson(`public${url}`), url)
    );
  });

  test('all six anchor arcs have authored later callbacks rather than ending at their first interaction', () => {
    const requiredCallbacks = {
      npc_elder_willow: [
        'gronk_gc06_exp_structural_steward',
        'lyra_gc07_exp_structural_counterphase',
      ],
      npc_blacksmith_gronk: [
        'gronk_exp_aftermath_quiet_reroute',
        'gronk_gc08_exp_structural_preparation',
      ],
      npc_rogue_silas: [
        'silas_exp_old_silence_reinterpreted',
        'silas_exp_old_silence_repaid',
      ],
      npc_captain_valerius: [
        'valerius_exp_m23_public_override',
        'valerius_gc08_exp_watch_mobilized',
      ],
      npc_scholar_elara: [
        'elara_exp_independent_verification',
        'elara_gc08_exp_network_diagnosis',
      ],
      npc_lyra: [
        'lyra_gc07_exp_counterphase_derived',
        'lyra_gc10_exp_epilogue_distributed',
      ],
    } as const;

    for (const [anchorId, callbackIds] of Object.entries(requiredCallbacks)) {
      for (const callbackId of callbackIds) {
        expect(experiences[callbackId]).toBeDefined();
        expect(experiences[callbackId].participantIds).toContain(anchorId);
        assertIntentionalText(
          experiences[callbackId].interpretation,
          `${anchorId} callback ${callbackId}`
        );
      }
    }
  });

  test('all four finale and epilogue variants are fully authored', () => {
    const finaleContent = readJson('public/data/gc10-finale-content.json');
    const finaleBundle = readJson('public/data/relationships/gc10-finale.json');

    const variants = {
      distributed: 'distributed_dissipation',
      structural: 'structural_redirection',
      diagnostic: 'diagnostic_disruption',
      fortified: 'fortified_containment',
    } as const;

    for (const [route, outcome] of Object.entries(variants)) {
      const entryId = `lyra_gc10_enter_${route}_finale`;
      const aftermathId = `lyra_gc10_aftermath_${route}`;
      const questId = `quest_gc10_telluric_echo_${route}`;
      const finaleExperienceId = `lyra_gc10_exp_finale_${route}`;
      const epilogueExperienceId = `lyra_gc10_exp_epilogue_${route}`;
      const memoryId = `lyra_memory_gc10_${route}_aftermath`;

      expect(finaleContent.dialogues[entryId]).toBeDefined();
      expect(finaleContent.dialogues[aftermathId]).toBeDefined();
      expect(quests[questId]).toBeDefined();
      expect(finaleBundle.experiences[finaleExperienceId]).toBeDefined();
      expect(finaleBundle.experiences[epilogueExperienceId]).toBeDefined();
      expect(finaleBundle.memories[memoryId]).toEqual(
        expect.objectContaining({
          playerVisible: true,
          originExperienceId: epilogueExperienceId,
        })
      );

      const outcomeEffect = finaleContent.dialogues[aftermathId].effects.find(
        (effect: any) => effect.type === 'WORLD_STATE_SET' &&
          effect.field === 'telluricEchoOutcome'
      );
      expect(outcomeEffect?.value).toBe(outcome);

      scanVisibleStrings(
        finaleContent.dialogues[entryId],
        `finale.${entryId}`
      );
      scanVisibleStrings(
        finaleContent.dialogues[aftermathId],
        `finale.${aftermathId}`
      );
      scanVisibleStrings(quests[questId], `finale.${questId}`);
      scanVisibleStrings(
        finaleBundle.memories[memoryId],
        `finale.${memoryId}`
      );
    }
  });
});
