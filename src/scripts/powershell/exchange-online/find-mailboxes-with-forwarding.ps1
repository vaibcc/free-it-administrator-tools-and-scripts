#Requires -Version 5.1
<#
.SYNOPSIS
    Identifies Exchange Online mailboxes that forward mail to another address.

.DESCRIPTION
    Read-only security review. Detects both internal forwarding (ForwardingAddress) and
    external forwarding (ForwardingSmtpAddress), and reports inbox rules that redirect or
    forward messages, which is a common sign of a compromised mailbox.

.PARAMETER OutputPath
    Folder that receives the CSV file.

.PARAMETER IncludeInboxRules
    Inspect inbox rules per mailbox (slower, requires Mailbox folder permissions).

.EXAMPLE
    .\Find-MailboxesWithForwarding.ps1 -OutputPath C:\Reports -IncludeInboxRules

.NOTES
    Module      : ExchangeOnlineManagement
    Permissions : Exchange Administrator, Global Reader, or Security Reader.
    Impact      : READ-ONLY.
    Note        : Auto-forwarding to external domains may also be blocked tenant-wide by an
                  outbound spam policy; this report shows mailbox configuration only.
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE 'Documents'),

    [switch]$IncludeInboxRules
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

try {
    Import-Module ExchangeOnlineManagement -ErrorAction Stop
    if (-not (Get-ConnectionInformation -ErrorAction SilentlyContinue)) {
        Connect-ExchangeOnline -ShowBanner:$false
    }

    if (-not (Test-Path -LiteralPath $OutputPath)) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }

    $mailboxes = @(Get-EXOMailbox -ResultSize Unlimited -PropertySets Delivery, Minimum |
        Where-Object { $_.ForwardingAddress -or $_.ForwardingSmtpAddress })

    $rows = New-Object System.Collections.Generic.List[object]
    foreach ($mailbox in $mailboxes) {
        $target = if ($mailbox.ForwardingSmtpAddress) { $mailbox.ForwardingSmtpAddress } else { "$($mailbox.ForwardingAddress)" }
        $scope  = if ($mailbox.ForwardingSmtpAddress) { 'External or SMTP' } else { 'Internal' }

        $rows.Add([pscustomobject]@{
            DisplayName       = $mailbox.DisplayName
            PrimarySmtpAddress = $mailbox.PrimarySmtpAddress
            ForwardingTarget  = $target
            ForwardingScope   = $scope
            Source            = 'Mailbox setting'
        })
    }

    if ($IncludeInboxRules) {
        Write-Host 'Inspecting inbox rules...' -ForegroundColor Cyan
        $all = @(Get-EXOMailbox -ResultSize Unlimited -PropertySets Minimum)
        foreach ($mailbox in $all) {
            try {
                $rules = @(Get-InboxRule -Mailbox $mailbox.PrimarySmtpAddress -ErrorAction Stop |
                    Where-Object { $_.RedirectTo -or $_.ForwardTo -or $_.ForwardAsAttachmentTo })
            }
            catch {
                Write-Verbose "No rule access for $($mailbox.PrimarySmtpAddress)"
                continue
            }
            foreach ($rule in $rules) {
                $rows.Add([pscustomobject]@{
                    DisplayName       = $mailbox.DisplayName
                    PrimarySmtpAddress = $mailbox.PrimarySmtpAddress
                    ForwardingTarget  = (@($rule.RedirectTo, $rule.ForwardTo, $rule.ForwardAsAttachmentTo) | Where-Object { $_ } | ForEach-Object { "$_" }) -join ';'
                    ForwardingScope   = 'Inbox rule'
                    Source            = "Rule: $($rule.Name)"
                })
            }
        }
    }

    $file = Join-Path $OutputPath ("EXO-Forwarding-{0}.csv" -f (Get-Date -Format 'yyyyMMdd-HHmmss'))
    $rows | Export-Csv -Path $file -NoTypeInformation -Encoding UTF8

    Write-Host ("{0} forwarding configuration(s) found." -f $rows.Count) -ForegroundColor Yellow
    if ($rows.Count -eq 0) {
        Write-Host 'No forwarding found in the tenant.' -ForegroundColor Green
    }
    Write-Host "CSV written to $file" -ForegroundColor Green
}
catch {
    Write-Error "Forwarding audit failed: $($_.Exception.Message)"
    exit 1
}