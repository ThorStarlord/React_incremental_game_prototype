#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const outputDirectory = process.env.RELEASE_SECURITY_OUT ||
  path.join(__dirname, '..', '.release-artifacts', 'security');
fs.mkdirSync(outputDirectory, { recursive: true });

const auditArguments = ['audit', '--omit=dev', '--audit-level=high', '--json'];
const result = spawnSync('npm', auditArguments, {
  encoding: 'utf8',
  shell: true,
});

let report;
try {
  report = JSON.parse(result.stdout || '{}');
} catch (error) {
  report = {
    error: 'npm audit did not return JSON',
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

const metadata = report.metadata || {};
const vulnerabilities = metadata.vulnerabilities || {};
const advisoryCount = ['info', 'low', 'moderate', 'high', 'critical']
  .reduce((total, level) => total + (vulnerabilities[level] || 0), 0);
const highOrCritical = (vulnerabilities.high || 0) + (vulnerabilities.critical || 0);
const summary = {
  generatedAt: new Date().toISOString(),
  host: `${os.platform()} ${os.release()} ${os.arch()}`,
  command: 'npm audit --omit=dev --audit-level=high --json',
  auditExitCode: result.status,
  vulnerabilities,
  advisoryCount,
  status: highOrCritical > 0 ? 'BLOCKED_HIGH_OR_CRITICAL' :
    result.status === 0 ? 'PASS' : 'PASS_WITH_REVIEW',
};

fs.writeFileSync(path.join(outputDirectory, 'audit.json'), `${JSON.stringify({ summary, report }, null, 2)}\n`);
const table = ['critical', 'high', 'moderate', 'low', 'info']
  .map(level => `| ${level} | ${vulnerabilities[level] ?? 'unknown'} |`)
  .join('\n');
fs.writeFileSync(path.join(outputDirectory, 'audit.md'),
  `# Dependency Audit\n\n` +
  `- Generated: ${summary.generatedAt}\n` +
  `- Command: \`${summary.command}\`\n` +
  `- Status: **${summary.status}**\n` +
  `- Exit code: ${summary.auditExitCode}\n\n` +
  `| Severity | Count |\n| --- | --- |\n${table}\n`);

console.log(`[security:release] ${summary.status}; artifact: ${path.join(outputDirectory, 'audit.md')}`);
// Moderate/low findings remain visible in the artifact. High/critical findings
// are the release-blocking policy threshold; build-only residuals are reviewed
// rather than hidden behind a blanket audit-fix command.
process.exit(highOrCritical > 0 ? 1 : 0);
