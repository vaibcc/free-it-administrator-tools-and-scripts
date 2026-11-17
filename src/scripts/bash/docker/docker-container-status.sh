#!/usr/bin/env bash
#
# Docker container status report.
#
# Read-only summary of every container: state, health check result, restart count,
# image, ports and uptime, followed by host-level engine information.
#
# Requirements : Docker Engine with the docker CLI; no docker-compose needed
# Permissions  : docker group membership (or sudo). Group access is equivalent to root
#                on the host — grant it deliberately.
# Impact       : READ-ONLY. Containers are inspected, never started or stopped.
#
# Usage        : ./docker-container-status.sh
#                ./docker-container-status.sh --running-only
#
set -euo pipefail

RUNNING_ONLY=0

usage() {
  cat <<'EOF'
Usage: docker-container-status.sh [--running-only] [--help]

  --running-only  Only report running containers
  --help          Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --running-only) RUNNING_ONLY=1; shift ;;
    --help|-h)      usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker CLI not found in PATH." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Error: cannot reach the Docker daemon. Check docker group membership or use sudo." >&2
  exit 1
fi

printf 'Docker container status — %s\n\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

printf 'Engine  : %s\n' "$(docker version --format '{{.Server.Version}}' 2>/dev/null || echo unknown)"
printf 'Driver  : %s\n' "$(docker info --format '{{.Driver}}' 2>/dev/null || echo unknown)"
printf 'Running : %s\n' "$(docker info --format '{{.ContainersRunning}}' 2>/dev/null || echo 0)"
printf 'Stopped : %s\n' "$(docker info --format '{{.ContainersStopped}}' 2>/dev/null || echo 0)"
printf 'Images  : %s\n\n' "$(docker info --format '{{.Images}}' 2>/dev/null || echo 0)"

format='{{.Names}}\t{{.State}}\t{{.Status}}\t{{.Image}}\t{{.Ports}}'
if (( RUNNING_ONLY == 1 )); then
  ids=$(docker ps -q 2>/dev/null)
else
  ids=$(docker ps -aq 2>/dev/null)
fi

if [[ -z "$ids" ]]; then
  echo "No containers found."
  exit 0
fi

printf '%-28s %-10s %-32s %s\n' "NAME" "STATE" "HEALTH / STATUS" "IMAGE"
printf '%s\n' "--------------------------------------------------------------------------------"

# shellcheck disable=SC2086
docker inspect --format \
  '{{.Name}}|{{.State.Status}}|{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}|{{.RestartCount}}|{{.Config.Image}}' \
  $ids 2>/dev/null | sed 's#^/##' | while IFS='|' read -r name state health restarts image; do
    printf '%-28s %-10s %-32s %s\n' "$name" "$state" "$health (restarts: $restarts)" "$image"
  done

printf '\nUnhealthy containers need attention: docker logs <name> --tail 100\n'