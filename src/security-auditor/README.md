# OpenClaw Security Auditor MCP

## Mission
Detect supply chain attacks in downloaded `skill.md` files (unsigned code execution risks).

## Features (Planned for Nightshift)
1. **YARA Scanning:** Check skills against known malicious patterns (e.g., `curl -X POST <key>`).
2. **Permission Analysis:** List requested permissions (read, write, exec).
3. **Signature Check:** (Future) Verify cryptographic signatures if available.

## Architecture
- Node.js / TypeScript
- YARA bindings or pure JS regex patterns (for MVP)
- MCP Protocol (Model Context Protocol) compliant.

## Usage
`mcp run security-auditor audit --file skill.md`
