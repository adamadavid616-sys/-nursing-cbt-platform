param(
  [int]$Port = 8000
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if (Test-Path $bundledNode) {
  & $bundledNode (Join-Path $root "server.js") $Port
  exit $LASTEXITCODE
}

if (Get-Command node -ErrorAction SilentlyContinue) {
  & node (Join-Path $root "server.js") $Port
  exit $LASTEXITCODE
}

Write-Error "Node.js was not found. Install Node.js or run this from Codex with the bundled runtime available."
exit 1
