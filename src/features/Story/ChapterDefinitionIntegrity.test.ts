import fs from 'fs';
import path from 'path';
import { CHAPTER_DEFINITIONS } from './ChapterDefinitions';

type IntegrityRoute = {
  id: string;
  requiredExperienceIds?: readonly string[];
  requiredCompletedDialogueIds?: readonly string[];
};

type IntegrityChapter = {
  id: string;
  routes: readonly IntegrityRoute[];
};

type IntegrityIssueCode =
  | 'DUPLICATE_CHAPTER_ID'
  | 'DUPLICATE_ROUTE_ID'
  | 'EMPTY_ROUTE_REQUIREMENTS'
  | 'DUPLICATE_ROUTE_REQUIREMENT'
  | 'DANGLING_EXPERIENCE'
  | 'DANGLING_COMPLETED_DIALOGUE';

type IntegrityIssue = {
  code: IntegrityIssueCode;
  chapterId: string;
  routeId?: string;
  reference?: string;
};

type ReferenceCatalog = {
  experienceIds: ReadonlySet<string>;
  completedDialogueIds: ReadonlySet<string>;
};

const DIALOGUE_CATALOG_PATHS = [
  'public/data/dialogues.json',
  'public/data/m24-world-state-content.json',
  'public/data/m25-chapter-content.json',
] as const;

const readJson = (relativePath: string): any =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));

const dialogueNodesFromBundle = (bundle: any): Record<string, unknown> => {
  if (bundle?.dialogues && typeof bundle.dialogues === 'object') {
    return bundle.dialogues as Record<string, unknown>;
  }
  return bundle && typeof bundle === 'object'
    ? bundle as Record<string, unknown>
    : {};
};

const loadReferenceCatalog = (): ReferenceCatalog => {
  const relationshipDirectory = path.join(process.cwd(), 'public/data/relationships');
  const experienceIds = new Set<string>();

  for (const fileName of fs.readdirSync(relationshipDirectory).filter(name => name.endsWith('.json'))) {
    const bundle = readJson(path.join('public/data/relationships', fileName));
    for (const experienceId of Object.keys(bundle.experiences ?? {})) {
      experienceIds.add(experienceId);
    }
  }

  const completedDialogueIds = new Set<string>();
  for (const cataloguePath of DIALOGUE_CATALOG_PATHS) {
    const dialogueNodes = dialogueNodesFromBundle(readJson(cataloguePath));
    for (const dialogueId of Object.keys(dialogueNodes)) {
      completedDialogueIds.add(dialogueId);
    }
  }

  return { experienceIds, completedDialogueIds };
};

const collectChapterDefinitionIntegrityIssues = (
  definitions: readonly IntegrityChapter[],
  catalog: ReferenceCatalog
): IntegrityIssue[] => {
  const issues: IntegrityIssue[] = [];
  const chapterIds = new Set<string>();

  for (const chapter of definitions) {
    if (chapterIds.has(chapter.id)) {
      issues.push({ code: 'DUPLICATE_CHAPTER_ID', chapterId: chapter.id });
    }
    chapterIds.add(chapter.id);

    const routeIds = new Set<string>();
    for (const route of chapter.routes) {
      if (routeIds.has(route.id)) {
        issues.push({
          code: 'DUPLICATE_ROUTE_ID',
          chapterId: chapter.id,
          routeId: route.id,
        });
      }
      routeIds.add(route.id);

      const requirements = [
        ...(route.requiredExperienceIds ?? []).map(id => ({
          key: `experience:${id}`,
          kind: 'experience' as const,
          id,
        })),
        ...(route.requiredCompletedDialogueIds ?? []).map(id => ({
          key: `completed_dialogue:${id}`,
          kind: 'completed_dialogue' as const,
          id,
        })),
      ];

      if (requirements.length === 0) {
        issues.push({
          code: 'EMPTY_ROUTE_REQUIREMENTS',
          chapterId: chapter.id,
          routeId: route.id,
        });
      }

      const requirementKeys = new Set<string>();
      for (const requirement of requirements) {
        if (requirementKeys.has(requirement.key)) {
          issues.push({
            code: 'DUPLICATE_ROUTE_REQUIREMENT',
            chapterId: chapter.id,
            routeId: route.id,
            reference: requirement.key,
          });
        }
        requirementKeys.add(requirement.key);

        if (
          requirement.kind === 'experience' &&
          !catalog.experienceIds.has(requirement.id)
        ) {
          issues.push({
            code: 'DANGLING_EXPERIENCE',
            chapterId: chapter.id,
            routeId: route.id,
            reference: requirement.id,
          });
        }

        if (
          requirement.kind === 'completed_dialogue' &&
          !catalog.completedDialogueIds.has(requirement.id)
        ) {
          issues.push({
            code: 'DANGLING_COMPLETED_DIALOGUE',
            chapterId: chapter.id,
            routeId: route.id,
            reference: requirement.id,
          });
        }
      }
    }
  }

  return issues;
};

const validCatalog: ReferenceCatalog = {
  experienceIds: new Set(['exp_ok']),
  completedDialogueIds: new Set(['dialogue_ok']),
};

const validChapter = (): IntegrityChapter => ({
  id: 'chapter_a',
  routes: [{ id: 'route_a', requiredExperienceIds: ['exp_ok'] }],
});

describe('chapter definition integrity', () => {
  test('loads the same bounded dialogue catalogues used by runtime initialization', () => {
    const catalog = loadReferenceCatalog();

    expect(catalog.completedDialogueIds).toEqual(
      expect.objectContaining({
        has: expect.any(Function),
      })
    );
    expect(catalog.completedDialogueIds.has('valerius_m25_public_order_conclusion')).toBe(true);
    expect(catalog.completedDialogueIds.has('gronk_m25_quiet_network_conclusion')).toBe(true);
  });

  test('all current chapter requirements resolve to canonical authored content', () => {
    expect(
      collectChapterDefinitionIntegrityIssues(
        CHAPTER_DEFINITIONS,
        loadReferenceCatalog()
      )
    ).toEqual([]);
  });

  test('rejects duplicate chapter and route identifiers', () => {
    const duplicateChapterIssues = collectChapterDefinitionIntegrityIssues(
      [validChapter(), validChapter()],
      validCatalog
    );
    expect(duplicateChapterIssues.map(issue => issue.code)).toContain(
      'DUPLICATE_CHAPTER_ID'
    );

    const duplicateRouteIssues = collectChapterDefinitionIntegrityIssues(
      [{
        id: 'chapter_a',
        routes: [
          { id: 'route_a', requiredExperienceIds: ['exp_ok'] },
          { id: 'route_a', requiredCompletedDialogueIds: ['dialogue_ok'] },
        ],
      }],
      validCatalog
    );
    expect(duplicateRouteIssues.map(issue => issue.code)).toContain(
      'DUPLICATE_ROUTE_ID'
    );
  });

  test('rejects empty routes and duplicate requirements', () => {
    const issues = collectChapterDefinitionIntegrityIssues(
      [{
        id: 'chapter_a',
        routes: [
          { id: 'empty' },
          { id: 'duplicate', requiredExperienceIds: ['exp_ok', 'exp_ok'] },
        ],
      }],
      validCatalog
    );

    expect(issues.map(issue => issue.code)).toEqual(
      expect.arrayContaining([
        'EMPTY_ROUTE_REQUIREMENTS',
        'DUPLICATE_ROUTE_REQUIREMENT',
      ])
    );
  });

  test('rejects dangling Experience and completed-dialogue references', () => {
    const issues = collectChapterDefinitionIntegrityIssues(
      [{
        id: 'chapter_a',
        routes: [{
          id: 'route_a',
          requiredExperienceIds: ['missing_exp'],
          requiredCompletedDialogueIds: ['missing_dialogue'],
        }],
      }],
      validCatalog
    );

    expect(issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'DANGLING_EXPERIENCE',
          reference: 'missing_exp',
        }),
        expect.objectContaining({
          code: 'DANGLING_COMPLETED_DIALOGUE',
          reference: 'missing_dialogue',
        }),
      ])
    );
  });
});
