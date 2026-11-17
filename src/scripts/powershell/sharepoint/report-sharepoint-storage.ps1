#Requires -Version 5.1
<#
.SYNOPSIS
    Reports SharePoint site collection storage usage and flags sites close to quota.

.DESCRIPTION
    Read-only capacity report. Calculates used storage, quota and the used percentage for
    every site collection (OneDrive sites included unless -ExcludeOneDrive is used) and
    highlights sites above -WarningPercent.

.PARAMETER TenantUrl
    SharePoint admin URL, for example https://contoso-admin.sharepoint.com

.PARAMETER WarningPercent
    Threshold in percent that marks a site as at risk. Default 85.

.PARAMETER OutputPath
    Folder that receives the CSV file.

.EXAMPLE
    .\Report-SharePointStorage.ps1 -TenantUrl https://contoso-admin.sharepoint.com

.NOTES
    Module      : PnP.PowerShell
    Permissions : SharePoint Administrator or Global Reader with admin-centre access.
    Impact      : READ-ONLY.
    Note        : Quota values of 0 indicate a site without an explicit quota limit.
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [ValidatePattern('^https://[A-Za-z0-9\-]+-admin\.sharepoint\.com/?$')]
    [string]$TenantUrl,

    [ValidateRange(1, 100)]
    [int]$WarningPercent = 85,

    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents'),

    [switch]$ExcludeOneDrive
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function ConvertTo-Gigabytes([long]$bytes) {
    if ($bytes -le 0) { return 0 }
    return [math]::Round($bytes / 1GB, 2)
}

try {
    Import-Module PnP.PowerShell -ErrorAction Stop
    if (-not $global:PnPConnection) { Connect-PnPOnline -Url $TenantUrl -Interactive }

    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    $sites = @(Get-PnPTenantSite -Detailed)
    if ($ExcludeOneDrive) {
        $sites = @($sites | Where-Object { $_.Template -notlike 'SPSPERS*' })
    }

    $rows = @(foreach ($site in $sites) {
        $usedMb  = [double]$site.StorageUsageCurrent       # reported in MB
        $quotaMb = [double]$site.StorageMaximumLevel       # reported in MB
        $percent = if ($quotaMb -gt 0) { [math]::Round(($usedMb / $quotaMb) * 100, 1) } else { $null }

        [pscustomobject]@{
            Url          = $site.Url
            Title        = $site.Title
            UsedGB       = [math]::Round($usedMb / 1024, 2)
            QuotaGB      = if ($quotaMb -gt 0) { [math]::Round($quotaMb / 1024, 2) } else { 'no limit' }
            UsedPercent  = $percent
            AboveWarning = ($null -ne $percent -and $percent -ge $WarningPercent)
            LastModified = $site.LastContentModifiedDate
        }
    } | Sort-Object { [double]($_.UsedGB) } -Descending)

    $rows | Select-Object Url, UsedGB, QuotaGB, UsedPercent, AboveWarning -First 20 | Format-Table -AutoSize

    $flagged = @($rows | Where-Object { $_.AboveWarning })
    Write-Host ("{0} site(s) above {1}% of quota." -f $flagged.Count, $WarningPercent) -ForegroundColor Yellow

    $file = Join-Path $OutputPath ("SPO-Storage-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $rows | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8
    Write-Host "CSV written to $file" -ForegroundColor Green
}
catch {
    Write-Error "SharePoint storage report failed: $($_.Exception.Message)"
    exit 1
}