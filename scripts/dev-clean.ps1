$ErrorActionPreference = "SilentlyContinue"

# Stop running Next.js dev server for this workspace.
$nextLockPath = Join-Path $PSScriptRoot "..\.next\dev\lock"
if (Test-Path $nextLockPath) {
  $lock = Get-Content $nextLockPath -Raw | ConvertFrom-Json
  if ($lock.pid) {
    taskkill /PID $lock.pid /F | Out-Null
  }
}

# Fallback: kill any process listening on 3000.
$portOwners = netstat -ano | Select-String ":3000" | ForEach-Object {
  ($_ -split "\s+")[-1]
} | Where-Object { $_ -match "^\d+$" } | Select-Object -Unique

foreach ($listenPid in $portOwners) {
  taskkill /PID $listenPid /F | Out-Null
}

Write-Output "Starting Next.js dev server on port 3000..."
Set-Location (Join-Path $PSScriptRoot "..")
# npm 스크립트로 실행하면 npx 해석/임시 설치 오버헤드를 피할 수 있음
npm run dev -- -p 3000
