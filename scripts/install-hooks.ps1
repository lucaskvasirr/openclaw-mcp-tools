$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$hookDir = Join-Path $root '.git\hooks'
$hookFile = Join-Path $hookDir 'pre-commit'

if (-not (Test-Path $hookDir)) {
  New-Item -ItemType Directory -Path $hookDir | Out-Null
}

$hookContent = @'
#!/bin/sh
node scripts/check-allowed-paths.js
status=$?
if [ $status -ne 0 ]; then
  exit $status
fi

cd src/security-auditor || exit 1
npm test
'@

Set-Content -Path $hookFile -Value $hookContent -NoNewline
Write-Host "Installed pre-commit hook at $hookFile"
