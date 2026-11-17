#Requires -Version 5.1
<#
.SYNOPSIS
    Exports every Microsoft Intune managed device to a CSV file.

.DESCRIPTION
    Read-only endpoint inventory from Microsoft Graph. Reports ownership, compliance state,
    operating system and version, last check-in and encryption status so device health can
    be reviewed without opening the portal.

.PARAMETER OutputPath
    Folder that receives the CSV file.

.PARAMETER OperatingSystem
    Optional filter: Windows, iOS, Android, macOS, Linux.

.EXAMPLE
    .\Export-IntuneManagedDevices.ps1 -OutputPath C:\Reports

.EXAMPLE
    .\Export-IntuneManagedDevices.ps1 -OperatingSystem Windows

.NOTES
    Module      : Microsoft.Graph.Authentication, Microsoft.Graph.DeviceManagement
    Permissions : DeviceManagementManagedDevices.Read.All
    Impact      : READ-ONLY.
    Note        : Requires at least one Intune licence in the tenant. Tenants without Intune
                  return an empty result rather than an error.
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents'),

    [ValidateSet('All', 'Windows', 'iOS', 'Android', 'macOS', 'Linux')]
    [string]$OperatingSystem = 'All'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    if (-not (Get-MgContext)) {
        Connect-MgGraph -Scopes 'DeviceManagementManagedDevices.Read.All' -NoWelcome
    }

    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    $devices = @(Get-MgDeviceManagementManagedDevice -All)
    if ($OperatingSystem -ne 'All') {
        $devices = @($devices | Where-Object { $_.OperatingSystem -eq $OperatingSystem })
    }

    $rows = @($devices | Select-Object DeviceName, UserPrincipalName, OperatingSystem,
            OsVersion, ComplianceState, ManagedDeviceOwnerType, IsEncrypted, Manufacturer,
            Model, SerialNumber, LastSyncDateTime, EnrolledDateTime, ManagementAgent,
            @{ Name = 'Id'; Expression = { $_.Id } } | Sort-Object DeviceName)

    $file = Join-Path $OutputPath ("Intune-Devices-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $rows | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8

    Write-Host ("Exported {0} managed device(s) to {1}" -f $rows.Count, $file) -ForegroundColor Green
}
catch {
    Write-Error "Intune device export failed: $($_.Exception.Message)"
    exit 1
}