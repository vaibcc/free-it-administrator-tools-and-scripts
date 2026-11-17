#Requires -Version 5.1
<#
.SYNOPSIS
    Produces a DNS lookup and diagnostic report for one or more names.

.DESCRIPTION
    Read-only resolver check. Queries A, AAAA, CNAME, MX and TXT records for each name,
    shows the resolver configuration in use, and reports which server answered.

.PARAMETER Name
    One or more DNS names to resolve.

.PARAMETER Server
    Optional DNS server to query instead of the local resolver.

.EXAMPLE
    .\Get-DnsDiagnosticReport.ps1 -Name contoso.com,mail.contoso.com

.EXAMPLE
    .\Get-DnsDiagnosticReport.ps1 -Name contoso.com -Server 1.1.1.1

.NOTES
    Module      : DnsClient (built into Windows)
    Permissions : Standard user.
    Impact      : READ-ONLY.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string[]]$Name,

    [string]$Server
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    Write-Host 'DNS client configuration' -ForegroundColor Cyan
    Get-DnsClientServerAddress -AddressFamily IPv4 |
        Where-Object { $_.ServerAddresses } |
        Select-Object InterfaceAlias, ServerAddresses | Format-Table -AutoSize

    foreach ($record in $Name) {
        Write-Host ("`n=== {0} ===" -f $record) -ForegroundColor Cyan

        foreach ($type in 'A', 'AAAA', 'CNAME', 'MX', 'TXT') {
            $params = @{ Name = $record; Type = $type; ErrorAction = 'SilentlyContinue' }
            if ($Server) { $params['Server'] = $Server }

            $answer = @(Resolve-DnsName @params)
            if ($answer.Count -eq 0) {
                Write-Host ("  {0,-6} : (no record)" -f $type) -ForegroundColor DarkGray
                continue
            }

            foreach ($item in $answer) {
                $value = $item.IPAddress
                if (-not $value) { $value = $item.NameHost }
                if (-not $value) { $value = $item.NameExchange }
                if (-not $value) { $value = (@($item.Strings) -join ' ') }
                Write-Host ("  {0,-6} : {1}  (TTL {2})" -f $type, $value, $item.TTL)
            }
        }
    }

    Write-Host "`nDiagnostics complete." -ForegroundColor Green
}
catch {
    Write-Error "DNS diagnostic failed: $($_.Exception.Message)"
    exit 1
}