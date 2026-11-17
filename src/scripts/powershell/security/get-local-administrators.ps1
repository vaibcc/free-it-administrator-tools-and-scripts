#Requires -Version 5.1
<#
.SYNOPSIS
    Lists the members of the local Administrators group on one or more Windows hosts.

.DESCRIPTION
    Read-only privilege audit. Uses the well-known SID S-1-5-32-544 so it works on
    localised Windows versions. Reports each member's name, object class, SID and source
    (local or domain) so unexpected domain accounts and groups are easy to spot.

.PARAMETER ComputerName
    Target computers. Defaults to the local machine.

.PARAMETER Credential
    Optional credentials for remote WMI/CIM access.

.EXAMPLE
    .\Get-LocalAdministrators.ps1

.EXAMPLE
    .\Get-LocalAdministrators.ps1 -ComputerName srv01,srv02 -Credential (Get-Credential)

.NOTES
    Module      : Microsoft.PowerShell.LocalAccounts (local), CimCmdlets (remote)
    Permissions : Administrator on each target host; WinRM enabled for remote queries.
    Impact      : READ-ONLY.
    Note        : Domain groups nested inside Administrators are reported as the group, not
                  expanded. Use an AD group membership export to resolve those.
#>
[CmdletBinding()]
param(
    [string[]]$ComputerName = @($env:COMPUTERNAME),

    [System.Management.Automation.PSCredential]$Credential
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$adminSid = 'S-1-5-32-544'
$rows = New-Object System.Collections.Generic.List[object]

foreach ($computer in $ComputerName) {
    Write-Verbose "Querying $computer"

    try {
        if ($computer -in @($env:COMPUTERNAME, 'localhost', '127.0.0.1')) {
            $members = @(Get-LocalGroupMember -SID $adminSid -ErrorAction Stop)
            foreach ($member in $members) {
                $rows.Add([pscustomobject]@{
                        Computer = $computer
                        Name     = $member.Name
                        Class    = $member.ObjectClass
                        SID      = $member.SID.Value
                        Source   = $member.PrincipalSource
                    })
            }
            continue
        }

        $invokeParams = @{
            ComputerName = $computer
            ScriptBlock  = {
                $sid = 'S-1-5-32-544'
                Get-LocalGroupMember -SID $sid | Select-Object Name, ObjectClass, @{n = 'Sid'; e = { $_.SID.Value } }, PrincipalSource
            }
            ErrorAction  = 'Stop'
        }
        if ($Credential) { $invokeParams['Credential'] = $Credential }

        $remote = @(Invoke-Command @invokeParams)
        foreach ($member in $remote) {
            $rows.Add([pscustomobject]@{
                    Computer = $computer
                    Name     = $member.Name
                    Class    = $member.ObjectClass
                    SID      = $member.Sid
                    Source   = $member.PrincipalSource
                })
        }
    }
    catch {
        Write-Warning ("Could not query {0}: {1}" -f $computer, $_.Exception.Message)
    }
}

$rows | Sort-Object Computer, Name | Format-Table -AutoSize
Write-Host ("{0} administrator membership(s) across {1} host(s)." -f $rows.Count, $ComputerName.Count) -ForegroundColor Cyan
Write-Host 'Remove anything that is not required — every member has full local control.' -ForegroundColor DarkYellow