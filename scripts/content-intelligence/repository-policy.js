function applyRepositoryPolicy(model) {
  const advisoryTargets = new Set(model.knownContracts.advisoryDanglingTargets || []);
  const advisorySources = new Set(model.knownContracts.advisoryProvenanceSources || []);
  const blockingIssues = [];
  const advisoryIssues = [];

  for (const issue of model.issues) {
    const legacyDangling = issue.code === 'DANGLING_REFERENCE' && advisoryTargets.has(issue.target);
    const provenanceOnly = issue.code === 'MISSING_SOURCE_ENTITY' && advisorySources.has(issue.entity);

    if (legacyDangling || provenanceOnly) {
      advisoryIssues.push({
        ...issue,
        severity: 'warning',
        code: legacyDangling ? 'KNOWN_LEGACY_DANGLING_REFERENCE' : 'PROVENANCE_LABEL_NOT_RUNTIME_ENTITY',
      });
    } else {
      blockingIssues.push(issue);
    }
  }

  return {
    ...model,
    issues: blockingIssues,
    warnings: [...model.warnings, ...advisoryIssues],
    policy: {
      advisoryIssueCount: advisoryIssues.length,
      blockingIssueCount: blockingIssues.length,
    },
  };
}

module.exports = { applyRepositoryPolicy };
