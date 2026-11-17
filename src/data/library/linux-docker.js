import healthReport from "@/scripts/bash/ubuntu/ubuntu-health-report.sh?raw";
import diskUsage from "@/scripts/bash/ubuntu/disk-usage-report.sh?raw";
import memoryCpu from "@/scripts/bash/ubuntu/memory-cpu-report.sh?raw";
import failedServices from "@/scripts/bash/ubuntu/failed-services-check.sh?raw";
import listeningPorts from "@/scripts/bash/ubuntu/listening-ports-check.sh?raw";
import dockerStatus from "@/scripts/bash/docker/docker-container-status.sh?raw";

const BASH_DOCS = "https://www.gnu.org/software/bash/manual/bash.html";
const UBUNTU_DOCS = "https://ubuntu.com/server/docs";

const bashDefaults = {
  language: "bash",
  platform: "Ubuntu Server 20.04 / 22.04 / 24.04",
  version: "Bash 4.4 or later",
  modules: ["coreutils", "procps (ps, free)", "iproute2 (ss)"],
  access: "read-only",
  added: "2026-11-17",
  docs: [
    { label: "Ubuntu Server documentation", url: UBUNTU_DOCS },
    { label: "Bash reference manual", url: BASH_DOCS },
  ],
};

export default [
  {
    ...bashDefaults,
    slug: "ubuntu-server-health-report",
    title: "Ubuntu Server Health Report",
    description:
      "One-command health summary for an Ubuntu Server host: identity and kernel, uptime, load, memory, filesystem usage, failed systemd units, logged-in users and pending update count.",
    category: "linux-bash",
    subcategory: "Host health",
    permissions: "Normal user. The pending-update count needs root because apt metadata is not world-readable on every system.",
    install: "No installation. Copy the file to the server and make it executable: chmod +x ubuntu-health-report.sh",
    usage: "sudo ./ubuntu-health-report.sh --output /var/tmp/health.txt",
    example: "./ubuntu-health-report.sh",
    exampleOutput:
      "=== Host ===\nHostname : web01\nKernel   : Linux 6.8.0-45-generic x86_64\nOS       : Ubuntu 24.04\nUptime   : up 12 days, 4 hours\n\n=== Failed systemd units ===\nFailed units: 0",
    errorHandling:
      "Runs with set -euo pipefail so an unexpected command failure stops the report instead of producing misleading output. Optional features are guarded with command -v and a root check.",
    security: [
      "Read-only: no package is installed and no service is restarted.",
      "Uses sudo only to read apt metadata for the update count — revoke it afterwards if not needed.",
      "The report contains hostnames and usernames; treat the output file as internal.",
    ],
    keywords: ["linux", "ubuntu", "health", "uptime", "systemd", "report", "bash", "audit"],
    fileName: "ubuntu-health-report.sh",
    source: healthReport,
    featured: true,
  },
  {
    ...bashDefaults,
    slug: "linux-disk-usage-monitoring-report",
    title: "Disk Usage Monitoring Report",
    description:
      "Reports every mounted filesystem with a usage percentage and an ALERT marker above a threshold, then lists the largest directories and files under a chosen path.",
    category: "linux-bash",
    subcategory: "Capacity",
    permissions: "Read access to the scanned path. Use sudo to scan directories that are not world-readable.",
    install: "No installation. chmod +x disk-usage-report.sh",
    usage: "sudo ./disk-usage-report.sh --threshold 80 --path /var",
    example: "./disk-usage-report.sh --threshold 90 --top 20 --path /home",
    exampleOutput:
      "MOUNT                    SIZE   USED  AVAIL  USE% STATUS\n/                        98G    71G    22G   77% ok\n/var                     40G    38G   0.8G   98% ALERT",
    errorHandling:
      "Validates --threshold (1-100) and that --path is a real directory before doing any work, then exits with code 2 on invalid input so cron jobs can detect misuse.",
    security: [
      "Read-only. The script never deletes data.",
      "Only reports what the calling user is allowed to read.",
    ],
    keywords: ["linux", "disk", "storage", "df", "du", "capacity", "alert", "monitoring"],
    fileName: "disk-usage-report.sh",
    source: diskUsage,
    featured: true,
  },
  {
    ...bashDefaults,
    slug: "linux-memory-and-cpu-usage-report",
    title: "Memory and CPU Usage Report",
    description:
      "Shows load average, core count, memory and swap usage, then the busiest processes by CPU and by memory, with guidance on taking a live sample.",
    category: "linux-bash",
    subcategory: "Performance",
    permissions: "Normal user.",
    install: "No installation. chmod +x memory-cpu-report.sh",
    usage: "./memory-cpu-report.sh --interval 5 --top 15",
    example: "./memory-cpu-report.sh",
    exampleOutput:
      "Load average : 0.42 0.38 0.31 (1, 5, 15 min)\nCPU cores    : 4\n\n               total        used        free      shared  buff/cache   available\nMem:           7.8Gi       2.1Gi       4.9Gi        17Mi       1.1Gi       5.4Gi",
    errorHandling:
      "Falls back to reading /proc/meminfo when free(1) is unavailable, and rejects a non-numeric --interval with exit code 2.",
    security: [
      "Read-only performance sampling.",
      "Process command names are visible; full command lines of other users require root.",
    ],
    keywords: ["linux", "memory", "cpu", "load", "performance", "ps", "swap"],
    fileName: "memory-cpu-report.sh",
    source: memoryCpu,
  },
  {
    ...bashDefaults,
    slug: "check-failed-systemd-services",
    title: "Check Failed systemd Services",
    description:
      "Lists units in a failed state with their exit result and the last journal lines for each one, so the cause is visible without opening a pager on a busy host.",
    category: "linux-bash",
    subcategory: "Service health",
    modules: ["systemd", "journalctl (systemd-journal group or root for logs)"],
    permissions: "Normal user for the unit list; journal access may require the systemd-journal group or root.",
    install: "No installation. chmod +x failed-services-check.sh",
    usage: "sudo ./failed-services-check.sh --logs 30 --since \"1 hour ago\"",
    example: "./failed-services-check.sh",
    exampleOutput:
      "2 failed unit(s) found:\n\nUNIT                                     LOAD       STATE\nnginx.service                            loaded     failed\n\n--- nginx.service ---\nResult=exit-code ExecMainStatus=1",
    errorHandling:
      "Exits 0 with a clear message when nothing has failed, which makes the script safe to run from cron or a monitoring check. Journal reads that lack permission are reported per unit.",
    security: [
      "Read-only. Units are never restarted, masked or enabled.",
      "Restarting a failed unit is a separate, deliberate action after reviewing the logs.",
    ],
    keywords: ["linux", "systemd", "failed", "service", "journalctl", "monitoring"],
    fileName: "failed-services-check.sh",
    source: failedServices,
  },
  {
    ...bashDefaults,
    slug: "check-listening-network-ports",
    title: "Check Listening Network Ports",
    description:
      "Lists listening TCP and UDP sockets with the owning process, and can show only sockets exposed beyond loopback — the fastest way to spot an unexpected service on a server.",
    category: "linux-bash",
    subcategory: "Network exposure",
    modules: ["iproute2 (ss)", "procps"],
    permissions: "Process names for other users require root. Addresses and ports are always visible.",
    install: "sudo apt install iproute2  # ss is usually preinstalled on Ubuntu",
    usage: "sudo ./listening-ports-check.sh --exposed",
    example: "./listening-ports-check.sh --tcp-only",
    exampleOutput:
      "PROTO  LOCAL ADDRESS              PROCESS                  PEERS\ntcp    0.0.0.0:22                 sshd                     *:*\ntcp    127.0.0.1:5432             postgres                 *:*",
    errorHandling:
      "Checks for ss(1) before running and exits 1 with an install hint when it is missing; unknown options print the usage block and exit 2.",
    security: [
      "Read-only socket inspection — no firewall rule is added or removed.",
      "Sockets bound to 0.0.0.0 or :: are reachable from the network; review them against your intended exposure.",
    ],
    keywords: ["linux", "ports", "ss", "listening", "firewall", "exposure", "network"],
    fileName: "listening-ports-check.sh",
    source: listeningPorts,
    featured: true,
  },
  {
    ...bashDefaults,
    slug: "docker-container-status-report",
    title: "Docker Container Status Report",
    description:
      "Summarises the Docker engine and every container with state, health check result, restart count and image, so unhealthy containers are visible in one table.",
    category: "docker",
    subcategory: "Containers",
    modules: ["Docker Engine and the docker CLI"],
    permissions:
      "Membership of the docker group, or sudo. Docker group access is effectively root on the host — grant it deliberately.",
    install: "No installation beyond Docker itself. chmod +x docker-container-status.sh",
    usage: "./docker-container-status.sh --running-only",
    example: "sudo ./docker-container-status.sh",
    exampleOutput:
      "Engine  : 27.3.1\nRunning : 6\nStopped : 1\n\nNAME           STATE      HEALTH / STATUS                  IMAGE\nnginx          running    healthy (restarts: 0)            nginx:1.27",
    errorHandling:
      "Fails fast with a clear message when the docker CLI is missing or the daemon is unreachable, instead of printing an empty table.",
    security: [
      "Read-only: containers are inspected, never started, stopped or removed.",
      "docker group membership is privileged access — treat it like local administrator rights.",
    ],
    docs: [
      { label: "docker inspect reference", url: "https://docs.docker.com/reference/cli/docker/inspect/" },
      { label: "Docker Engine documentation", url: "https://docs.docker.com/engine/" },
    ],
    keywords: ["docker", "containers", "health", "status", "restart", "monitoring", "bash"],
    fileName: "docker-container-status.sh",
    source: dockerStatus,
    featured: true,
  },
  {
    slug: "verify-backup-directory-contents",
    title: "Verify Backup Directory Contents",
    description:
      "Planned check that a backup directory contains files newer than a threshold, with size and count validation for cron monitoring.",
    category: "linux-bash",
    subcategory: "Backup verification",
    language: "bash",
    status: "coming-soon",
  },
  {
    slug: "docker-image-inventory",
    title: "Docker Image Inventory",
    description:
      "Planned inventory of local images with tags, size, creation date and dangling image detection.",
    category: "docker",
    subcategory: "Images",
    language: "bash",
    status: "coming-soon",
  },
  {
    slug: "docker-disk-usage-report",
    title: "Docker Disk Usage Report",
    description:
      "Planned breakdown of image, container, volume and build-cache consumption with reclaimable space.",
    category: "docker",
    subcategory: "Capacity",
    language: "bash",
    status: "coming-soon",
  },
  {
    slug: "docker-container-health-monitoring",
    title: "Docker Container Health Monitoring",
    description:
      "Planned exit-code based health check suitable for cron or a monitoring agent, with alert thresholds.",
    category: "docker",
    subcategory: "Monitoring",
    language: "bash",
    status: "coming-soon",
  },
];