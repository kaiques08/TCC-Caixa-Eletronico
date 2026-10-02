#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

vinext="${SITES_PROJECT_ROOT}/node_modules/.bin/vinext"
if [[ ! -x "${vinext}" ]]; then
  echo "vinext is unavailable. Run npm run install:ci and wait for it to finish before building." >&2
  exit 69
fi

esbuild="${SITES_PROJECT_ROOT}/node_modules/.bin/esbuild"
if [[ ! -x "${esbuild}" ]]; then
  echo "esbuild is unavailable. Run npm run install:ci and wait for it to finish before building." >&2
  exit 69
fi

run_with_timeout() {
  if command -v timeout >/dev/null 2>&1; then
    timeout \
      --signal=TERM \
      --kill-after="${SITES_BUILD_KILL_AFTER:-10s}" \
      "${SITES_BUILD_TIMEOUT:-3m}" \
      "$@"
    return
  fi

  python3 - "$@" <<'PY'
import os
import subprocess
import sys

def parse_timeout(value: str) -> float:
    value = value.strip().lower()
    if not value:
        return 180.0
    if value.endswith("ms"):
        return float(value[:-2]) / 1000.0
    if value.endswith("s"):
        return float(value[:-1])
    if value.endswith("m"):
        return float(value[:-1]) * 60.0
    if value.endswith("h"):
        return float(value[:-1]) * 3600.0
    return float(value)

cmd = sys.argv[1:]
if not cmd:
    raise SystemExit(64)

timeout_value = os.environ.get("SITES_BUILD_TIMEOUT", "3m")
kill_after = os.environ.get("SITES_BUILD_KILL_AFTER", "10s")
kill_seconds = parse_timeout(kill_after)

process = subprocess.Popen(cmd)
try:
    process.wait(timeout=parse_timeout(timeout_value))
except subprocess.TimeoutExpired:
    process.terminate()
    try:
        process.wait(timeout=max(kill_seconds, 1))
    except subprocess.TimeoutExpired:
        process.kill()
        process.wait()
    print(f"Command timed out after {timeout_value}.", file=sys.stderr)
    raise SystemExit(124)

raise SystemExit(process.returncode)
PY
}

echo "Building lightweight browser bundle..."
"${esbuild}" \
  "${SITES_PROJECT_ROOT}/public/assets/js/script.js" \
  --outfile="${SITES_PROJECT_ROOT}/public/assets/js/app.min.js" \
  --target=chrome51 \
  --charset=utf8 \
  --legal-comments=none \
  --minify

echo "Running bounded vinext build..."
run_with_timeout "${vinext}" build
