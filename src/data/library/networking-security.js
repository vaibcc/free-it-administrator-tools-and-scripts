import connectivity from "@/scripts/powershell/networking/test-network-connectivity.ps1?raw";
import dnsReport from "@/scripts/powershell/networking/get-dns-diagnostic-report.ps1?raw";
import tcpPorts from "@/scripts/powershell/networking/test-tcp-ports.ps1?raw";
import sslExpiry from "@/scripts/powershell/security/test-ssl-certificate-expiry.ps1?raw";
import localAdmins from "@/scripts/powershell/security/get-local-administrators.ps1?raw";
import defenderStatus from "@/scripts/powershell/security/get-defender-status.ps1?raw";

const WIN_DOCS = "https://learn.microsoft.com/en-us/powershell/";

const winDefaults = {
  language: "powershell",
  platform: "Windows 10/11, Windows Server 2016+",
  version: "PowerShell 5.1 or later",
  modules: ["None — built-in cmdlets and .NET classes"],
  added: "2026-11-17",
};

export default [
  {
    ...winDefaults,
    slug: "network-connectivity-diagnostic",
    title: "Network Connectivity Diagnostic",
    description:
      "Checks gateway reachability, DNS resolution and TCP reachability to a list of endpoints, then prints a pass/fail matrix so the failing layer is obvious.",
    category: "networking",
    subcategory: "Troubleshooting",
    access: "read-only",
    permissions: "Standard user. The gateway check only reads the local route table.",
    install: "No installation — uses Test-Connection, Resolve-DnsName and Test-NetConnection.",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Test-NetworkConnectivity.ps1",
    example: ".\\Test-NetworkConnectivity.ps1 -Targets 'outlook.office365.com:443','fileserver01:445'",
    exampleOutput:
      "Layer   Target                      Port Result Detail\n-----   ------                      ---- ------ ------\nGateway 192.168.1.1                      OK     ICMP to default gateway\nDNS     login.microsoftonline.com            OK     20.190.151.7\nTCP     outlook.office365.com        443  OK     Latency: 18 ms",
    errorHandling:
      "Each layer is evaluated independently, so a failed ping does not hide a working TCP path. ICMP being blocked by policy is documented as an expected, non-fatal condition.",
    security: [
      "Read-only diagnostics — no configuration is changed.",
      "Only tests the hosts you pass in; run it against your own infrastructure.",
    ],
    docs: [
      { label: "Test-NetConnection", url: "https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection" },
      { label: "Resolve-DnsName", url: "https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname" },
    ],
    keywords: ["network", "connectivity", "ping", "tcp", "diagnostic", "gateway", "troubleshooting"],
    fileName: "Test-NetworkConnectivity.ps1",
    source: connectivity,
    featured: true,
  },
  {
    ...winDefaults,
    slug: "dns-lookup-and-diagnostic-report",
    title: "DNS Lookup and Diagnostic Report",
    description:
      "Queries A, AAAA, CNAME, MX and TXT records for one or more names, shows the resolver configuration in use and reports which server answered.",
    category: "networking",
    subcategory: "DNS",
    access: "read-only",
    permissions: "Standard user.",
    install: "No installation — DnsClient module is part of Windows.",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Get-DnsDiagnosticReport.ps1 -Name contoso.com",
    example: ".\\Get-DnsDiagnosticReport.ps1 -Name contoso.com,mail.contoso.com -Server 1.1.1.1",
    exampleOutput:
      "=== contoso.com ===\n  A      : 203.0.113.10  (TTL 3600)\n  MX     : contoso-com.mail.protection.outlook.com  (TTL 3600)",
    errorHandling:
      "Record lookups use SilentlyContinue so a missing record type is reported as '(no record)' rather than terminating the report.",
    security: [
      "Read-only DNS queries.",
      "Querying a public resolver can disclose which names you are investigating — use your own resolver when that matters.",
    ],
    docs: [
      { label: "Resolve-DnsName", url: "https://learn.microsoft.com/en-us/powershell/module/dnsclient/resolve-dnsname" },
      { label: "Get-DnsClientServerAddress", url: "https://learn.microsoft.com/en-us/powershell/module/dnsclient/get-dnsclientserveraddress" },
    ],
    keywords: ["dns", "records", "mx", "txt", "lookup", "resolver", "diagnostic"],
    fileName: "Get-DnsDiagnosticReport.ps1",
    source: dnsReport,
  },
  {
    ...winDefaults,
    slug: "tcp-port-connectivity-testing",
    title: "TCP Port Connectivity Testing",
    description:
      "Tests TCP connectivity to host and port pairs with an explicit millisecond timeout, using .NET sockets so firewall changes can be validated quickly even when ICMP is blocked.",
    category: "networking",
    subcategory: "Firewall validation",
    access: "read-only",
    permissions: "Standard user with outbound access to the tested ports.",
    install: "No installation — uses System.Net.Sockets.TcpClient.",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Test-TcpPorts.ps1 -Target 'dc01:389','dc01:636'",
    example: ".\\Test-TcpPorts.ps1 -Target 'mail:25','mail:587' -TimeoutMs 3000 -OutputPath C:\\Reports",
    exampleOutput:
      "Host  Port Result  Resolved     Detail\n----  ---- ------  --------     ------\ndc01   389  OPEN    10.0.0.11    Connection established\nmail    25  TIMEOUT (none)         No response in 3000 ms",
    errorHandling:
      "Malformed host:port entries are skipped with a warning instead of crashing the run; the socket is always closed in a finally block.",
    security: [
      "Read-only connection attempts. No packet crafting or exploitation.",
      "Port scanning hosts you do not own or administer may violate policy or law — only test your own infrastructure.",
    ],
    docs: [
      { label: "TcpClient class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.net.sockets.tcpclient" },
      { label: "Test-NetConnection", url: "https://learn.microsoft.com/en-us/powershell/module/nettcpip/test-netconnection" },
    ],
    keywords: ["tcp", "port", "firewall", "connectivity", "socket", "timeout", "test"],
    fileName: "Test-TcpPorts.ps1",
    source: tcpPorts,
  },
  {
    ...winDefaults,
    slug: "ssl-certificate-expiration-checker",
    title: "SSL Certificate Expiration Checker",
    description:
      "Connects over TLS to one or more host and port combinations, reads the presented certificate and reports subject, issuer, expiry date and remaining days, flagging anything inside the warning window.",
    category: "networking",
    subcategory: "Certificates",
    access: "read-only",
    permissions: "Standard user with outbound TCP access to the target port.",
    install: "No installation — uses System.Net.Security.SslStream.",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Test-SslCertificateExpiry.ps1 -Target portal.contoso.com",
    example: ".\\Test-SslCertificateExpiry.ps1 -Target 'portal.contoso.com','mail.contoso.com:443' -WarningDays 45",
    exampleOutput:
      "Target                   Status    Expires     DaysLeft\n------                   ------    -------     --------\nportal.contoso.com:443   OK        2027-03-14       117\nmail.contoso.com:443     EXPIRING  2026-12-01        14",
    errorHandling:
      "Each target is evaluated in isolation and a connection failure is reported as an ERROR row rather than stopping the run.",
    security: [
      "Read-only TLS handshake.",
      "The script checks expiry only — it does not perform full chain or revocation validation. Use your monitoring platform for that.",
    ],
    docs: [
      { label: "SslStream class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.net.security.sslstream" },
      { label: "X509Certificate2 class", url: "https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography.x509certificates.x509certificate2" },
    ],
    keywords: ["ssl", "tls", "certificate", "expiry", "expiration", "monitoring", "https"],
    fileName: "Test-SslCertificateExpiry.ps1",
    source: sslExpiry,
    featured: true,
  },
  {
    ...winDefaults,
    slug: "identify-local-administrators",
    title: "Identify Local Administrators",
    description:
      "Lists every member of the local Administrators group on one or more Windows hosts, using the well-known SID so it works on localised systems, and reports each member's source.",
    category: "security-tools",
    subcategory: "Privileged access",
    access: "read-only",
    permissions: "Local administrator on each target host; WinRM enabled for remote queries.",
    install: "No installation. Remote queries need WinRM (Enable-PSRemoting) on the targets.",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Get-LocalAdministrators.ps1",
    example: ".\\Get-LocalAdministrators.ps1 -ComputerName srv01,srv02 -Credential (Get-Credential)",
    exampleOutput:
      "Computer Name              Class  Source\n-------- ----              -----  ------\nsrv01    CONTOSO\\Domain Admins Group  ActiveDirectory\nsrv01    CONTOSO\\svc-backup    User   ActiveDirectory",
    errorHandling:
      "A host that cannot be reached is reported with a warning and the loop continues, so one offline server does not hide the other results.",
    security: [
      "Read-only group membership query.",
      "Nested domain groups are reported as groups and not expanded — resolve them with an AD group export.",
      "Every member of Administrators has full local control; remove anything not required.",
    ],
    docs: [
      { label: "Get-LocalGroupMember", url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.localaccounts/get-localgroupmember" },
      { label: "Well-known SIDs", url: "https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/manage/understand-security-identifiers" },
    ],
    keywords: ["security", "local administrators", "privileged", "audit", "windows", "sid"],
    fileName: "Get-LocalAdministrators.ps1",
    source: localAdmins,
    featured: true,
  },
  {
    ...winDefaults,
    slug: "check-windows-defender-status",
    title: "Check Windows Defender Status",
    description:
      "Reports Defender Antivirus engine state, signature age, real-time protection, cloud protection and attack surface reduction rule count, then summarises anything that weakens protection.",
    category: "security-tools",
    subcategory: "Endpoint protection",
    modules: ["Defender (Get-MpComputerStatus, Get-MpPreference)"],
    access: "read-only",
    permissions: "Local administrator on each target host.",
    install: "No installation. Remote queries use WinRM and require the Defender module on the target.",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Get-DefenderStatus.ps1",
    example: ".\\Get-DefenderStatus.ps1 -ComputerName ws01,ws02",
    exampleOutput:
      "AMServiceEnabled          : True\nRealTimeProtectionEnabled : False\nAntivirusSignatureAge     : 1\nAsrRulesConfigured        : 0\n\nItems to review:\n  - Real-time protection is disabled\n  - No attack surface reduction rules configured",
    errorHandling:
      "Hosts that cannot be queried produce a warning and the run continues. Missing Defender state never aborts the audit.",
    security: [
      "Read-only state check — protection settings are never changed.",
      "On managed endpoints these values are usually enforced by policy, so a disabled value may be intentional central configuration.",
    ],
    docs: [
      { label: "Get-MpComputerStatus", url: "https://learn.microsoft.com/en-us/powershell/module/defender/get-mpcomputerstatus" },
      { label: "Get-MpPreference", url: "https://learn.microsoft.com/en-us/powershell/module/defender/get-mppreference" },
    ],
    keywords: ["defender", "antivirus", "security", "status", "asr", "signature", "endpoint"],
    fileName: "Get-DefenderStatus.ps1",
    source: defenderStatus,
  },
  {
    slug: "local-network-device-discovery",
    title: "Local Network Device Discovery",
    description:
      "Planned subnet discovery helper combining ARP cache inspection and a bounded ping sweep, with a clear scope warning.",
    category: "networking",
    subcategory: "Discovery",
    language: "powershell",
    access: "read-only",
    status: "coming-soon",
  },
  {
    slug: "windows-firewall-configuration-audit",
    title: "Windows Firewall Configuration Audit",
    description:
      "Planned audit of enabled profiles, inbound allow rules and rule scope, focused on rules open to any remote address.",
    category: "security-tools",
    subcategory: "Firewall",
    language: "powershell",
    access: "read-only",
    status: "coming-soon",
  },
  {
    slug: "windows-event-log-security-report",
    title: "Windows Event Log Security Report",
    description:
      "Planned extraction of key security event IDs (logon failures, privilege use, service installs) for a review window.",
    category: "security-tools",
    subcategory: "Event logs",
    language: "powershell",
    access: "read-only",
    status: "coming-soon",
  },
  {
    slug: "windows-system-security-overview",
    title: "Generate a Windows System Security Overview",
    description:
      "Planned combined baseline report covering firewall, Defender, local administrators and update state in one document.",
    category: "security-tools",
    subcategory: "Security reporting",
    language: "powershell",
    status: "coming-soon",
  },
];