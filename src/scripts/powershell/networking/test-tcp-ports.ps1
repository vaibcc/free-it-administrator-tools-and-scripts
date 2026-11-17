#Requires -Version 5.1
<#
.SYNOPSIS
    Tests TCP connectivity to one or more host and port combinations.

.DESCRIPTION
    Read-only port checker built on System.Net.Sockets.TcpClient with an explicit timeout.
    Useful for firewall change validation where ICMP is blocked and Test-NetConnection's
    default timeout is too slow.

.PARAMETER Target
    Entries in host:port form, for example 'dc01.contoso.com:389'.

.PARAMETER TimeoutMs
    Connection timeout per entry in milliseconds. Default 2000.

.PARAMETER OutputPath
    Optional folder that receives a CSV copy of the results.

.EXAMPLE
    .\Test-TcpPorts.ps1 -Target 'dc01:389','dc01:636','mail:25'

.NOTES
    Module      : None (.NET TcpClient)
    Permissions : Standard user.
    Impact      : READ-ONLY. Performs outbound connection attempts only.
    Warning     : Scanning hosts you do not own or administer may violate policy or law.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidateNotNullOrEmpty()]
    [string[]]$Target,

    [ValidateRange(100, 60000)]
    [int]$TimeoutMs = 2000,

    [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Test-TcpPort {
    param([string]$Computer, [int]$Port, [int]$Timeout)

    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $async = $client.BeginConnect($Computer, $Port, $null, $null)
        if (-not $async.AsyncWaitHandle.WaitOne($Timeout, $false)) {
            return [pscustomobject]@{ Result = 'TIMEOUT'; Detail = "No response in ${Timeout} ms" }
        }
        $client.EndConnect($async)
        return [pscustomobject]@{ Result = 'OPEN'; Detail = 'Connection established' }
    }
    catch {
        return [pscustomobject]@{ Result = 'CLOSED'; Detail = $_.Exception.InnerException.Message }
    }
    finally {
        $client.Close()
    }
}

try {
    $rows = New-Object System.Collections.Generic.List[object]

    foreach ($entry in $Target) {
        $parts = $entry.Split(':')
        if ($parts.Count -ne 2 -or -not ($parts[1] -as [int])) {
            Write-Warning "Skipping '$entry' — expected host:port"
            continue
        }

        $computer = $parts[0]
        $port     = [int]$parts[1]

        $probe = Test-TcpPort -Computer $computer -Port $port -Timeout $TimeoutMs

        $resolved = $null
        try { $resolved = (Resolve-DnsName -Name $computer -Type A -ErrorAction Stop | Select-Object -First 1).IPAddress } catch { }

        $rows.Add([pscustomobject]@{
            Host     = $computer
            Port     = $port
            Result   = $probe.Result
            Resolved = $resolved
            Detail   = $probe.Detail
        })
    }

    $rows | Format-Table -AutoSize

    $open = @($rows | Where-Object { $_.Result -eq 'OPEN' }).Count
    Write-Host ("{0} of {1} port(s) open." -f $open, $rows.Count) -ForegroundColor Cyan

    if ($OutputPath) {
        if (-not (Test-Path -LiteralPath $OutputPath)) {
            New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
        }
        $file = Join-Path $OutputPath ("TCP-PortTest-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
        $rows | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8
        Write-Host "CSV written to $file" -ForegroundColor Green
    }
}
catch {
    Write-Error "Port test failed: $($_.Exception.Message)"
    exit 1
}