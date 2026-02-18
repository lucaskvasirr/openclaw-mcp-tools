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

Operational notes and research files (e.g. `COMPETITORS.md`, `IDEAS.md`, `RESEARCH.md`, `memory/*`) are intentionally excluded from version control.
