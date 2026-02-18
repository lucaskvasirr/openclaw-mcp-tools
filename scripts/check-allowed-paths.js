#!/usr/bin/env node
/*
 Guardrail script:
 - Blocks changed files outside an allowlist
 - Blocks known sensitive/operational paths
 - Blocks unexpectedly large files
*/

const { execSync } = require('node:child_process');
const { statSync } = require('node:fs');

const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1 MB

const ALLOWLIST_PREFIXES = [
  '.github/',
  'scripts/',
  'src/security-auditor/',
  '.gitignore',
  'README.md',
  '.gitleaks.toml'
];

const BLOCK_PATTERNS = [
  /^memory\//i,
  /^research\//i,
  /^tmp\//i,
  /^\.cache\//i,
  /^COMPETITORS\.md$/i,
  /^IDEAS\.md$/i,
  /^RESEARCH\.md$/i,
  /(^|\/)auth-profiles\.json$/i,
  /(^|\/)\.env(\.|$)/i
];

function getChangedFiles() {
  const staged = execSync('git diff --cached --name-only --diff-filter=ACMR', {
    encoding: 'utf8'
  }).trim();

  if (staged) return staged.split(/\r?\n/).filter(Boolean);

  // In CI, no staged changes exist. Validate tracked repository files instead.
  if (process.env.CI) {
    const tracked = execSync('git ls-files', { encoding: 'utf8' }).trim();
    if (!tracked) return [];
    return tracked.split(/\r?\n/).filter(Boolean);
  }

  return [];
}

function isAllowed(file) {
  return ALLOWLIST_PREFIXES.some((prefix) => file === prefix || file.startsWith(prefix));
}

function matchesBlocked(file) {
  return BLOCK_PATTERNS.some((re) => re.test(file));
}

function main() {
  const files = getChangedFiles();
  const violations = [];

  for (const file of files) {
    if (matchesBlocked(file)) {
      violations.push(`Blocked sensitive/operational path: ${file}`);
      continue;
    }

    if (!isAllowed(file)) {
      violations.push(`Not in allowlist: ${file}`);
      continue;
    }

    try {
      const size = statSync(file).size;
      if (size > MAX_FILE_SIZE_BYTES) {
        violations.push(`File too large (>1MB): ${file}`);
      }
    } catch {
      // ignore deleted/moved edge cases for this gate
    }
  }

  if (violations.length) {
    console.error('\n❌ Commit blocked by repository guardrails:\n');
    for (const v of violations) console.error(`- ${v}`);
    console.error('\nAllowed prefixes:', ALLOWLIST_PREFIXES.join(', '));
    process.exit(1);
  }

  console.log('✅ Guardrail check passed.');
}

main();
