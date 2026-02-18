# OpenClaw MCP Tools

This repository contains MCP utilities for OpenClaw.

## Included tool

### `security-auditor`
Location: `src/security-auditor/`

Features:
- Recursive scan for risky patterns in `.ts` / `.js` files
- Rule-based detection (hardcoded secrets, unsafe eval, cleartext passwords, unsafe shell interpolation)
- Test fixtures and runner

## Quick start

```bash
cd src/security-auditor
npm install
npm test
npm run build
```

## Repository policy

Operational notes and sensitive artifacts (e.g. `COMPETITORS.md`, `IDEAS.md`, `memory/*`, env/auth files) are intentionally excluded from version control.

## Guardrails (pre-commit + CI)

This repository enforces a small allowlist and blocked-path policy to prevent accidental leaks.

- Local guardrail script: `scripts/check-allowed-paths.js`
- Hook installer (PowerShell): `scripts/install-hooks.ps1`
- CI workflow: `.github/workflows/security-guardrails.yml`

### Enable local hook

```powershell
powershell -ExecutionPolicy Bypass -File scripts/install-hooks.ps1
```

The pre-commit hook runs:
1) allowlist/blocked-path check
2) `npm test` in `src/security-auditor`
