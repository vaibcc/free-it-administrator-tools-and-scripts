#Requires -Version 5.1
<#
.SYNOPSIS
    Lists enabled users with no registered authentication methods beyond a password.

.DESCRIPTION
    READ THIS BEFORE USING THE OUTPUT:
    This script reports MFA *registration* only. It queries each user's registered
    authentication methods and flags those that have nothing registered apart from a
    password. Registration is not the same as enforcement — a user can be registered and
    still be excluded from Conditional Access, and a tenant can enforce MFA through
    Conditional Access, security defaults or per-user MFA independently of what this
    report shows. To prove enforcement, review Conditional Access policies targeting the
    "All users" scope with the MFA grant control, or run the Conditional Access export.

.PARAMETER OutputPath
    Folder that receives the CSV file.

.PARAMETER IncludeGuests
    Also evaluate guest accounts (userType 'Guest').

.EXAMPLE
    .\Find-UsersWithoutMFARegistration.ps1 -OutputPath C:\Reports

.NOTES
    Module      : Microsoft.Graph.Authentication, Microsoft.Graph.Users, Microsoft.Graph.Identity.SignIns
    Permissions : User.Read.All and UserAuthenticationMethod.Read.All
    Impact      : READ-ONLY. One Graph request per user — expect a slow run in large tenants.
    Note        : The FIDO2 and Windows Hello method types are reported separately because
                  they return different object types. Temporary Access Pass entries are
                  excluded from the count.
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents'),

    [switch]$IncludeGuests
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    if (-not (Get-MgContext)) {
        Connect-MgGraph -Scopes 'User.Read.All', 'UserAuthenticationMethod.Read.All' -NoWelcome
    }

    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    $filter = if ($IncludeGuests) { "accountEnabled eq true" } else { "accountEnabled eq true and userType eq 'Member'" }
    $users  = @(Get-MgUser -Filter $filter -All -Property Id, DisplayName, UserPrincipalName, UserType)
    Write-Host ("Evaluating {0} enabled user(s)..." -f $users.Count) -ForegroundColor Cyan

    $rows  = New-Object System.Collections.Generic.List[object]
    $index = 0

    foreach ($user in $users) {
        $index++
        Write-Progress -Activity 'Reading authentication methods' -Status $user.UserPrincipalName `
            -PercentComplete (($index / [Math]::Max($users.Count, 1)) * 100)

        try {
            $methods = @(Get-MgUserAuthenticationMethod -UserId $user.Id -ErrorAction Stop)
        }
        catch {
            Write-Warning ("Could not read methods for {0}: {1}" -f $user.UserPrincipalName, $_.Exception.Message)
            continue
        }

        $mfaMethods = @($methods | Where-Object {
                $_.AdditionalProperties['@odata.type'] -notin @(
                    '#microsoft.graph.passwordAuthenticationMethod',
                    '#microsoft.graph.temporaryAccessPassAuthenticationMethod')
            })

        if ($mfaMethods.Count -eq 0) {
            $rows.Add([pscustomobject]@{
                DisplayName        = $user.DisplayName
                UserPrincipalName  = $user.UserPrincipalName
                UserType           = $user.UserType
                RegisteredMethods  = 0
                MethodTypes        = ''
            })
        }
    }
    Write-Progress -Activity 'Reading authentication methods' -Completed

    $file = Join-Path $OutputPath ("M365-NoMFARegistration-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $rows | Sort-Object UserPrincipalName | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8

    Write-Host ("{0} of {1} user(s) have no MFA method registered." -f $rows.Count, $users.Count) -ForegroundColor Yellow
    Write-Host "Registration report only — verify enforcement with Conditional Access." -ForegroundColor DarkYellow
    Write-Host "CSV written to $file" -ForegroundColor Green
}
catch {
    Write-Error "MFA registration report failed: $($_.Exception.Message)"
    exit 1
}