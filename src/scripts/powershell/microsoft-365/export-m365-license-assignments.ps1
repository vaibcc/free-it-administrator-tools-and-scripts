#Requires -Version 5.1
<#
.SYNOPSIS
    Exports Microsoft 365 licence assignments per user with friendly SKU names.

.DESCRIPTION
    Read-only report that joins each user's assignedLicenses with the tenant's subscribed
    SKUs so the CSV shows product names instead of raw GUIDs. Disabled service plans are
    reported separately, which makes over-licensed and partially-disabled users visible.

.PARAMETER OutputPath
    Folder that receives the CSV file.

.EXAMPLE
    .\Export-M365LicenseAssignments.ps1 -OutputPath C:\Reports

.NOTES
    Module      : Microsoft.Graph.Authentication, Microsoft.Graph.Users, Microsoft.Graph.Identity.DirectoryManagement
    Permissions : User.Read.All and Organization.Read.All
    Impact      : READ-ONLY.
    Note        : Licence names depend on tenant subscriptions; a missing subscription in
                  one tenant does not mean the script is broken.
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    if (-not (Get-MgContext)) {
        Connect-MgGraph -Scopes 'User.Read.All', 'Organization.Read.All' -NoWelcome
    }

    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    # SkuId -> SKU part number lookup for the tenant
    $skuMap = @{}
    foreach ($sku in Get-MgSubscribedSku -All) {
        $skuMap[$sku.SkuId] = $sku.SkuPartNumber
    }

    $users = @(Get-MgUser -All -Property Id, DisplayName, UserPrincipalName, AccountEnabled, AssignedLicenses)

    $rows = New-Object System.Collections.Generic.List[object]
    foreach ($user in $users) {
        $licences = @($user.AssignedLicenses)

        if ($licences.Count -eq 0) {
            $rows.Add([pscustomobject]@{
                DisplayName       = $user.DisplayName
                UserPrincipalName = $user.UserPrincipalName
                AccountEnabled    = $user.AccountEnabled
                Licence           = '(none)'
                SkuId             = ''
                DisabledPlans     = ''
            })
            continue
        }

        foreach ($licence in $licences) {
            $disabled = @($licence.DisabledPlans) -join ';'
            $rows.Add([pscustomobject]@{
                DisplayName       = $user.DisplayName
                UserPrincipalName = $user.UserPrincipalName
                AccountEnabled    = $user.AccountEnabled
                Licence           = $skuMap[$licence.SkuId] ?? $licence.SkuId
                SkuId             = $licence.SkuId
                DisabledPlans     = $disabled
            })
        }
    }

    $file = Join-Path $OutputPath ("M365-LicenseAssignments-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $rows | Sort-Object UserPrincipalName | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8

    Write-Host ("Wrote {0} licence row(s) for {1} user(s) to {2}" -f $rows.Count, $users.Count, $file) -ForegroundColor Green
}
catch {
    Write-Error "Licence assignment export failed: $($_.Exception.Message)"
    exit 1
}