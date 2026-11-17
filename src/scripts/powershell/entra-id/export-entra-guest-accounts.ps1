#Requires -Version 5.1
<#
.SYNOPSIS
    Exports Microsoft Entra ID guest accounts with invitation and sign-in context.

.DESCRIPTION
    Read-only report on external identities. Lists guest users with the invited domain,
    creation date and last sign-in so stale B2B collaborations can be reviewed for removal.

.PARAMETER OutputPath
    Folder that receives the CSV file.

.PARAMETER InactiveDays
    When set, add an Inactive flag for guests whose last sign-in is older than this value.

.EXAMPLE
    .\Export-EntraGuestAccounts.ps1 -OutputPath C:\Reports -InactiveDays 90

.NOTES
    Module      : Microsoft.Graph.Authentication, Microsoft.Graph.Users
    Permissions : User.Read.All and AuditLog.Read.All (for sign-in activity)
    Impact      : READ-ONLY.
    Note        : SignInActivity requires Entra ID P1 or P2. On tenants without that
                  licence the field is empty — this is a licensing difference, not an error.
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents'),

    [int]$InactiveDays
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    if (-not (Get-MgContext)) {
        Connect-MgGraph -Scopes 'User.Read.All', 'AuditLog.Read.All' -NoWelcome
    }

    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    $guests = @(Get-MgUser -Filter "userType eq 'Guest'" -All -Property Id, DisplayName, UserPrincipalName,
            Mail, CreatedDateTime, ExternalUserState, SignInActivity, CompanyName)

    $cutoff = if ($InactiveDays -gt 0) { (Get-Date).AddDays(-$InactiveDays) } else { $null }

    $rows = @(foreach ($guest in $guests) {
        $lastSignIn = $guest.SignInActivity.LastSignInDateTime
        $domain = if ($guest.Mail) { ($guest.Mail -split '@')[-1] } else { ($guest.UserPrincipalName -split '@')[-1] }

        $inactive = $null
        if ($cutoff) {
            $inactive = (-not $lastSignIn) -or ($lastSignIn -lt $cutoff)
        }

        [pscustomobject]@{
            DisplayName       = $guest.DisplayName
            UserPrincipalName = $guest.UserPrincipalName
            Mail              = $guest.Mail
            Domain            = $domain
            ExternalState     = $guest.ExternalUserState
            CreatedDateTime   = $guest.CreatedDateTime
            LastSignIn        = $lastSignIn
            Inactive          = $inactive
        }
    } | Sort-Object Domain, DisplayName)

    $file = Join-Path $OutputPath ("Entra-GuestAccounts-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    @($rows) | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8

    Write-Host ("Exported {0} guest account(s) to {1}" -f @($rows).Count, $file) -ForegroundColor Green
}
catch {
    Write-Error "Guest account export failed: $($_.Exception.Message)"
    exit 1
}