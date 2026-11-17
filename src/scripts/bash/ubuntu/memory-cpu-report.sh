#!/usr/bin/env bash
#
# Memory and CPU usage report.
#
# Samples CPU, memory, swap and the busiest processes over a short interval so a
# spike is visible instead of a single instant reading.
#
# Requirements : Ubuntu Server / any Linux with procps
# Permissions  : Normal user. Values for other users' processes are still visible.
# Impact       : READ-ONLY.
#
# Usage        : ./memory-cpu-report.sh
#                ./memory-cpu-report.sh --interval 5 --top 15
#
set -euo pipefail

INTERVAL=2
TOP=10

usage() {
  cat <<'EOF'
Usage: memory-cpu-report.sh [--interval SECONDS] [--top N] [--help]

  --interval SECONDS  Sampling window for process CPU usage (default 2)
  --top N             Number of processes to list (default 10)
  --help              Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --interval) INTERVAL="${2:?missing value}"; shift 2 ;;
    --top)      TOP="${2:?missing value}"; shift 2 ;;
    --help|-h)  usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if ! [[ "$INTERVAL" =~ ^[0-9]+$ ]] || (( INTERVAL < 1 )); then
  echo "Error: --interval must be a positive integer" >&2
  exit 2
fi

printf 'Memory and CPU report — %s\n\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

printf 'Load average : %s (1, 5, 15 min)\n' "$(cut -d' ' -f1-3 /proc/loadavg)"
printf 'CPU cores    : %s\n\n' "$(nproc)"

if command -v free >/dev/null 2>&1; then
  free -h
else
  awk '/MemTotal|MemFree|MemAvailable|SwapTotal|SwapFree/ { printf "%-14s %10.1f MB\n", $1, $2/1024 }' /proc/meminfo
fi

printf '\nTop %s processes by CPU (sampled over %ss)\n' "$TOP" "$INTERVAL"
ps -eo pid,ppid,user,pcpu,pmem,rss,comm --sort=-pcpu 2>/dev/null | head -n "$((TOP + 1))"

printf '\nTop %s processes by memory\n' "$TOP"
ps -eo pid,user,pcpu,pmem,rss,comm --sort=-pmem 2>/dev/null | head -n "$((TOP + 1))"

printf '\nNote: %%CPU comes from ps and reflects process lifetime, not the sample window.\n'
printf 'For live sampling use: pidstat -u -p ALL %s 1\n' "$INTERVAL"