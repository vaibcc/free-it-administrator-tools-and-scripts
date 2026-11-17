#Requires -Version 5.1
<#
.SYNOPSIS
    Exports the Microsoft Defender for Endpoint device inventory.

.DESCRIPTION
    Read-only inventory from the Microsoft Defender for Endpoint (MDE) public API. Reports
    machine name, OS platform, risk level, exposure level, onboarded state and last seen
    time. Uses an app registration with the Machine.Read.All application permission granted
    in the Defender portal, authenticated with the client-credentials flow.

.PARAMETER TenantId
    Microsoft Entra tenant ID (GUID or domain).

.PARAMETER ClientId
    Application (client) ID of the app registration.

.PARAMETER ClientSecret
    Client secret value. Prompted for as a secure string when omitted.

.PARAMETER OutputPath
    Folder that receives the CSV file.

.EXAMPLE
    .\Export-DefenderDeviceInventory.ps1 -TenantId contoso.onmicrosoft.com -ClientId 00000000-0000-0000-0000-000000000000

.NOTES
    Permissions : Machine.Read.All (application) granted in Microsoft Defender portal >
                  Settings > Endpoints > API permissions.
    Impact      : READ-ONLY.
    Security    : The secret is never written to disk or logged. Store it in a secret
                  manager for scheduled runs instead of passing it on the command line.
    Note        : Requires the Defender for Endpoint licence and API access enabled for the
                  tenant; tenants without it receive HTTP 403 from the API.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$TenantId,

    [Parameter(Mandatory)]
    [string]$ClientId,

    [string]$ClientSecret,

    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not $ClientSecret) {
    $secure = Read-Host -AsSecureString -Prompt 'Client secret'
    $ClientSecret = [System.Net.NetworkCredential]::new('', $secure).Password
}

try {
    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    Write-Verbose 'Requesting an access token for the Defender for Endpoint API...'
    $tokenBody = @{
        client_id     = $ClientId
        client_secret = $ClientSecret
        scope         = 'https://api.security.microsoft.com/.default'
        grant_type    = 'client_credentials'
    }
    $token = Invoke-RestMethod -Method Post -ContentType 'application/x-www-form-urlencoded' `
        -Uri "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token" -Body $tokenBody

    $headers = @{ Authorization = "Bearer $($token.access_token)" }
    $uri     = 'https://api.security.microsoft.com/api/machines?$top=1000'

    $machines = New-Object System.Collections.Generic.List[object]
    while ($uri) {
        $response = Invoke-RestMethod -Method Get -Headers $headers -Uri $uri
        foreach ($machine in $response.value) { $machines.Add($machine) }
        $uri = $response.'@odata.nextLink'
    }

    $rows = @($machines | Select-Object id, computerDnsName, osPlatform, osVersion, osProcessor,
            version, lastSeen, firstSeen, riskScore, exposureLevel, rbacGroupName,
            healthStatus, onboardingStatus, isAadJoined, lastIpAddress |
        Sort-Object computerDnsName)

    $file = Join-Path $OutputPath ("Defender-DeviceInventory-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $rows | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8

    Write-Host ("Exported {0} device(s) from Microsoft Defender for Endpoint to {1}" -f $rows.Count, $file) -ForegroundColor Green
}
catch {
    Write-Error "Defender device inventory export failed: $($_.Exception.Message)"
    exit 1
}