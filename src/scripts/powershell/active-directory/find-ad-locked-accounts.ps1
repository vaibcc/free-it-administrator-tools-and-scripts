#Requires -Version 5.1
<#
.SYNOPSIS
    Identifies Active Directory accounts that are currently locked out.

.DESCRIPTION
    Read-only report listing locked accounts with their last bad password attempt.
    Useful for helpdesk triage before unlocking accounts.

.PARAMETER Unlock
    Switches the script from reporting to modification: unlocks each account found.
    Prompts for confirmation unless -Force is supplied.

.PARAMETER Force
    Skip the confirmation prompt when combined with -Unlock.

.EXAMPLE
    .\Find-LockedAccounts.ps1

.EXAMPLE
    .\Find-LockedAccounts.ps1 -Unlock

.NOTES
    Module      : ActiveDirectory
    Permissions : Read for reporting; Account Operators or Domain Admin for -Unlock.
    Impact      : READ-ONLY by default. With -Unlock the script MODIFIES directory state.
    Warning     : Unlocking an account removes the lockout but does not change the password.
#>
[CmdletBinding()]
param(
    [switch]$Unlock,
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    Import-Module ActiveDirectory -ErrorAction Stop

    $locked = @(Search-ADAccount -LockedOut -UsersOnly |
        Select-Object SamAccountName, Name, LastLogonDate, DistinguishedName)

    if ($locked.Count -eq 0) {
        Write-Host 'No locked-out accounts found.' -ForegroundColor Green
        return
    }

    Write-Host ("{0} locked account(s) found." -f $locked.Count) -ForegroundColor Yellow
    $locked | Select-Object SamAccountName, Name, LastLogonDate | Format-Table -AutoSize

    if (-not $Unlock) { return }

    if (-not $Force) {
        $answer = Read-Host "Unlock all $($locked.Count) account(s)? Type YES to continue"
        if ($answer -ne 'YES') {
            Write-Host 'Aborted. No accounts were modified.' -ForegroundColor DarkGray
            return
        }
    }

    $unlocked = 0
    foreach ($account in $locked) {
        try {
            Unlock-ADAccount -Identity $account.DistinguishedName -ErrorAction Stop
            Write-Host ("Unlocked {0}" -f $account.SamAccountName) -ForegroundColor Green
            $unlocked++
        }
        catch {
            Write-Warning ("Failed to unlock {0}: {1}" -f $account.SamAccountName, $_.Exception.Message)
        }
    }
    Write-Host ("{0} of {1} account(s) unlocked." -f $unlocked, $locked.Count) -ForegroundColor Cyan
}
catch {
    Write-Error "Locked account check failed: $($_.Exception.Message)"
    exit 1
}