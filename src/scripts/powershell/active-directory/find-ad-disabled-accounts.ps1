#Requires -Version 5.1
<#
.SYNOPSIS
    Finds every disabled Active Directory user account.

.DESCRIPTION
    Read-only audit that lists disabled accounts with their last logon date and the
    date the object was last modified, which helps identify stale accounts that can
    be reviewed for deletion.

.PARAMETER OutputPath
    Optional folder for a CSV copy of the report. Prints to the console when omitted.

.EXAMPLE
    .\Find-DisabledAccounts.ps1

.EXAMPLE
    .\Find-DisabledAccounts.ps1 -OutputPath C:\Reports

.NOTES
    Module      : ActiveDirectory
    Permissions : Authenticated domain user (read access to user objects).
    Impact      : READ-ONLY. No directory objects are modified.
    Author      : VAIB Technical Tools
#>
[CmdletBinding()]
param(
    [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    Import-Module ActiveDirectory -ErrorAction Stop

    $disabled = @(Get-ADUser -Filter 'Enabled -eq $false' -Properties LastLogonDate, Description, whenChanged |
        Select-Object SamAccountName, Name, Enabled,
            @{ Name = 'LastLogonDate'; Expression = { $_.LastLogonDate } },
            @{ Name = 'ChangedOn';     Expression = { $_.whenChanged } },
            Description, DistinguishedName |
        Sort-Object LastLogonDate)

    if ($disabled.Count -eq 0) {
        Write-Host 'No disabled user accounts found.' -ForegroundColor Green
        return
    }

    Write-Host ("Found {0} disabled account(s)." -f $disabled.Count) -ForegroundColor Yellow
    $disabled | Format-Table -AutoSize

    if ($OutputPath) {
        if (-not (Test-Path -LiteralPath $OutputPath)) {
            New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
        }
        $file = Join-Path $OutputPath ("AD-DisabledAccounts-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
        $disabled | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8
        Write-Host "CSV written to $file" -ForegroundColor Green
    }
}
catch {
    Write-Error "Disabled account search failed: $($_.Exception.Message)"
    exit 1
}