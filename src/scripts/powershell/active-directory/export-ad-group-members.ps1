#Requires -Version 5.1
<#
.SYNOPSIS
    Exports Active Directory group memberships to a CSV file.

.DESCRIPTION
    Read-only report that walks every group and resolves its members. Large domains can
    produce tens of thousands of rows, so progress is reported per group and the run can
    be limited with -GroupName (wildcards supported).

.PARAMETER GroupName
    Wildcard filter for group names. Default '*' (all groups).

.PARAMETER OutputPath
    Folder that receives the CSV file.

.EXAMPLE
    .\Export-ADGroupMembers.ps1 -OutputPath C:\Reports

.EXAMPLE
    .\Export-ADGroupMembers.ps1 -GroupName "GG-*"

.NOTES
    Module      : ActiveDirectory
    Permissions : Authenticated domain user.
    Impact      : READ-ONLY. Can be slow in very large directories.
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$GroupName = '*',

    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    Import-Module ActiveDirectory -ErrorAction Stop

    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    $groups = @(Get-ADGroup -Filter 'Name -like $GroupName' -Properties GroupCategory, GroupScope, Description)
    Write-Host ("Processing {0} group(s)..." -f $groups.Count) -ForegroundColor Cyan

    $rows  = New-Object System.Collections.Generic.List[object]
    $index = 0

    foreach ($group in $groups) {
        $index++
        Write-Progress -Activity 'Exporting group membership' -Status $group.Name `
            -PercentComplete (($index / [Math]::Max($groups.Count, 1)) * 100)

        try {
            $members = @(Get-ADGroupMember -Identity $group.DistinguishedName -ErrorAction Stop)
        }
        catch {
            Write-Warning "Could not read members of '$($group.Name)': $($_.Exception.Message)"
            continue
        }

        foreach ($member in $members) {
            $rows.Add([pscustomobject]@{
                GroupName        = $group.Name
                GroupCategory    = $group.GroupCategory
                GroupScope       = $group.GroupScope
                MemberName       = $member.Name
                MemberSamAccount = $member.SamAccountName
                MemberClass      = $member.objectClass
                MemberDN         = $member.distinguishedName
            })
        }
    }
    Write-Progress -Activity 'Exporting group membership' -Completed

    $file = Join-Path $OutputPath ("AD-GroupMembers-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $rows | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8

    Write-Host ("Wrote {0} membership row(s) for {1} group(s) to {2}" -f $rows.Count, $groups.Count, $file) -ForegroundColor Green
}
catch {
    Write-Error "Group membership export failed: $($_.Exception.Message)"
    exit 1
}