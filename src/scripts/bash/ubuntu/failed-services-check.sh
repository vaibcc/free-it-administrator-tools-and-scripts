#!/usr/bin/env bash
#
# Check for failed systemd services and recent unit failures.
#
# Lists units in a failed state, their last exit status, and the last journal lines
# for each failure so the cause is visible without opening a pager.
#
# Requirements : systemd (Ubuntu Server 16.04+), journalctl for log excerpts
# Permissions  : Normal user for the unit list; journal access may be limited to
#                members of the systemd-journal group or root.
# Impact       : READ-ONLY. Never restarts or masks units.
#
# Usage        : ./failed-services-check.sh
#                ./failed-services-check.sh --logs 30 --since "1 hour ago"
#
set -euo pipefail

LOG_LINES=20
SINCE="24 hours ago"

usage() {
  cat <<'EOF'
Usage: failed-services-check.sh [--logs N] [--since TIME] [--help]

  --logs N     Journal lines per failed unit (default 20, 0 disables)
  --since TIME Journal window, e.g. "1 hour ago" (default "24 hours ago")
  --help       Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --logs)   LOG_LINES="${2:?missing value}"; shift 2 ;;
    --since)  SINCE="${2:?missing value}"; shift 2 ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if ! command -v systemctl >/dev/null 2>&1; then
  echo "Error: systemctl not found — this script targets systemd hosts." >&2
  exit 1
fi

if ! [[ "$LOG_LINES" =~ ^[0-9]+$ ]]; then
  echo "Error: --logs must be a non-negative integer" >&2
  exit 2
fi

printf 'Failed unit check — %s\n\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

mapfile -t FAILED < <(systemctl --failed --no-legend --plain --no-pager 2>/dev/null | awk '{print $1}')

if [[ "${#FAILED[@]}" -eq 0 ]]; then
  echo "No failed units. Nothing to do."
  exit 0
fi

printf '%s failed unit(s) found:\n\n' "${#FAILED[@]}"
printf '%-40s %-10s %s\n' "UNIT" "LOAD" "STATE"
printf '%s\n' "---------------------------------------------------------------------"
systemctl --failed --plain --no-pager 2>/dev/null | sed '1d'

for unit in "${FAILED[@]}"; do
  printf '\n--- %s ---\n' "$unit"
  systemctl show -p Result -p ExecMainStatus -p ActiveEnterTimestamp --no-pager "$unit" 2>/dev/null || true
  if (( LOG_LINES > 0 )) && command -v journalctl >/dev/null 2>&1; then
    journalctl -u "$unit" --since "$SINCE" -n "$LOG_LINES" --no-pager 2>/dev/null \
      || echo "(journal not readable for this unit — re-run with sudo)"
  fi
done

printf '\nReview each unit before running: sudo systemctl restart <unit>\n'