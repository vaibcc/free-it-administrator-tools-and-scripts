import exportUsers from "@/scripts/powershell/active-directory/export-ad-users.ps1?raw";
import findDisabled from "@/scripts/powershell/active-directory/find-ad-disabled-accounts.ps1?raw";
import findInactive from "@/scripts/powershell/active-directory/find-ad-inactive-users.ps1?raw";
import exportGroups from "@/scripts/powershell/active-directory/export-ad-group-members.ps1?raw";
import passwordExpiring from "@/scripts/powershell/active-directory/find-ad-password-expiring.ps1?raw";
import lockedAccounts from "@/scripts/powershell/active-directory/find-ad-locked-accounts.ps1?raw";

const AD_DOCS = "https://learn.microsoft.com/en-us/powershell/module/activedirectory/";
const RSAT_DOCS = "https://learn.microsoft.com/en-us/windows-server/remote/remote-server-administration-tools";

const adDefaults = {
  language: "powershell",
  platform: "Windows 10/11, Windows Server 2016+",
  version: "PowerShell 5.1 or later",
  modules: ["ActiveDirectory (RSAT-AD-PowerShell)"],
  added: "2026-11-17",
  docs: [
    { label: "ActiveDirectory module reference", url: AD_DOCS },
    { label: "Install RSAT tools", url: RSAT_DOCS },
  ],
};

export default [
  {
    ...adDefaults,
    slug: "export-active-directory-users-to-csv",
    title: "Export All Active Directory Users to CSV",
    description:
      "Exports every user object in the domain to a timestamped CSV with identity, status, contact and logon fields. A read-only inventory that can be limited to a single OU subtree.",
    category: "active-directory",
    subcategory: "User reporting",
    access: "read-only",
    permissions:
      "Any authenticated domain user can read these attributes. The operator needs the ActiveDirectory module installed (RSAT).",
    install:
      "Install-Module ActiveDirectory is not required on a domain-joined Windows host — add the RSAT-AD-PowerShell feature instead: Add-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Export-ADUsers.ps1 -OutputPath C:\\Reports",
    example:
      ".\\Export-ADUsers.ps1 -OutputPath C:\\Reports -SearchBase \"OU=Staff,DC=contoso,DC=com\"",
    exampleOutput:
      "Exported 1284 user objects to C:\\Reports\\AD-Users-20261117-093012.csv\n\nFullName                                  Length LastWriteTime\n---------                                 ------ -------------\nC:\\Reports\\AD-Users-20261117-093012.csv    412883 17/11/2026 09:30:12",
    errorHandling:
      "Uses $ErrorActionPreference = 'Stop' with a terminating try/catch, so a missing module or an unavailable domain controller stops the run with a clear message and exit code 1 instead of an empty file.",
    security: [
      "Read-only: no directory object is created, changed or removed.",
      "The CSV contains user names and mail addresses — store it in a protected share and delete it when the report is no longer needed.",
      "No credentials are stored by the script; it runs in the security context of the signed-in operator.",
    ],
    keywords: ["ad", "users", "csv", "export", "inventory", "audit", "rsat", "domain"],
    fileName: "Export-ADUsers.ps1",
    source: exportUsers,
    featured: true,
  },
  {
    ...adDefaults,
    slug: "find-disabled-active-directory-accounts",
    title: "Find Disabled Active Directory Accounts",
    description:
      "Lists every disabled user account with the last logon date and the date the object was last modified, so stale accounts can be reviewed for cleanup.",
    category: "active-directory",
    subcategory: "Account hygiene",
    access: "read-only",
    permissions: "Authenticated domain user with read access to user objects.",
    install: "Requires the ActiveDirectory module (RSAT-AD-PowerShell) on the machine that runs the script.",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Find-DisabledAccounts.ps1",
    example: ".\\Find-DisabledAccounts.ps1 -OutputPath C:\\Reports",
    exampleOutput:
      "Found 12 disabled account(s).\n\nSamAccountName Name          Enabled LastLogonDate        ChangedOn\n-------------- ----          ------- -------------        ---------\njsmith         J. Smith        False 09/03/2025 11:04:00 12/06/2025 08:11:22",
    errorHandling:
      "Wraps the query in try/catch and exits with code 1 on failure. A directory with no disabled accounts reports success instead of writing an empty file.",
    security: [
      "Read-only inventory — accounts are never modified or deleted.",
      "Deleting accounts is a separate, deliberate action: confirm with the data owner first.",
    ],
    keywords: ["ad", "disabled", "accounts", "cleanup", "audit", "stale"],
    fileName: "Find-DisabledAccounts.ps1",
    source: findDisabled,
  },
  {
    ...adDefaults,
    slug: "find-inactive-active-directory-users",
    title: "Find Inactive Active Directory Users",
    description:
      "Finds accounts that have not logged on for a configurable number of days, using the replicated LastLogonDate attribute and reporting how long each account has been idle.",
    category: "active-directory",
    subcategory: "Account hygiene",
    access: "read-only",
    permissions: "Authenticated domain user with read access to user objects.",
    install: "Requires the ActiveDirectory module (RSAT-AD-PowerShell).",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Find-InactiveUsers.ps1 -Days 90",
    example: ".\\Find-InactiveUsers.ps1 -Days 120 -IncludeDisabled -OutputPath C:\\Reports",
    exampleOutput:
      "37 account(s) inactive for more than 120 days.\n\nSamAccountName Name        DaysInactive LastLogonDate\n-------------- ----        ------------ -------------\ncontractor1    C. Rivera   214          17/04/2026 10:02:11",
    errorHandling:
      "Parameter validation limits -Days to 1-3650. Query failures are caught and reported; accounts that have never logged on are listed with a 'never' value instead of being skipped.",
    security: [
      "Read-only. No account is disabled by this script.",
      "LastLogonDate is replicated and therefore approximate — treat results as a review list, not proof of inactivity.",
    ],
    keywords: ["ad", "inactive", "stale", "lastlogon", "cleanup", "hygiene"],
    fileName: "Find-InactiveUsers.ps1",
    source: findInactive,
    featured: true,
  },
  {
    ...adDefaults,
    slug: "export-active-directory-group-memberships",
    title: "Export Active Directory Group Memberships",
    description:
      "Walks every group (or a wildcard subset) and writes one row per group-member pair, including group scope and member class — the input most access reviews start from.",
    category: "active-directory",
    subcategory: "Group reporting",
    access: "read-only",
    permissions: "Authenticated domain user with read access to groups and members.",
    install: "Requires the ActiveDirectory module (RSAT-AD-PowerShell).",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Export-ADGroupMembers.ps1 -OutputPath C:\\Reports",
    example: ".\\Export-ADGroupMembers.ps1 -GroupName \"GG-*\" -OutputPath C:\\Reports",
    exampleOutput:
      "Processing 84 group(s)...\nWrote 1932 membership row(s) for 84 group(s) to C:\\Reports\\AD-GroupMembers-20261117-101455.csv",
    errorHandling:
      "Each group is read inside its own try/catch with Write-Warning, so one unreadable group does not abort the export. Progress is reported with Write-Progress.",
    security: [
      "Read-only. Nested groups are reported as their own row and are not expanded recursively.",
      "Group membership is sensitive: the export reveals who can access what.",
    ],
    keywords: ["ad", "groups", "membership", "access review", "export", "csv"],
    fileName: "Export-ADGroupMembers.ps1",
    source: exportGroups,
  },
  {
    ...adDefaults,
    slug: "find-accounts-with-passwords-approaching-expiration",
    title: "Find Accounts With Passwords Approaching Expiration",
    description:
      "Reports enabled accounts whose password expires within a configurable window, calculated from the domain's own policy through msDS-UserPasswordExpiryTimeComputed.",
    category: "active-directory",
    subcategory: "Password policy",
    access: "read-only",
    permissions: "Authenticated domain user with read access to user objects.",
    install: "Requires the ActiveDirectory module (RSAT-AD-PowerShell).",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Find-PasswordExpiring.ps1 -Days 14",
    example: ".\\Find-PasswordExpiring.ps1 -Days 7 -OutputPath C:\\Reports",
    exampleOutput:
      "4 account(s) expire within 7 day(s).\n\nSamAccountName Name        PasswordLastSet      ExpiryDate           DaysLeft\n-------------- ----        ---------------      ----------           --------\nkpeters        K. Peters   03/08/2026 09:12:00  20/11/2026 09:12:00         3",
    errorHandling:
      "Only accounts with a real computed expiry are evaluated; accounts set to never expire are excluded rather than shown as expired. Failures exit with code 1.",
    security: [
      "Read-only. The script never resets or reveals a password.",
      "Communicating expiry dates to users is a helpdesk action, not something this report performs.",
    ],
    keywords: ["ad", "password", "expiry", "expiration", "policy", "report"],
    fileName: "Find-PasswordExpiring.ps1",
    source: passwordExpiring,
  },
  {
    ...adDefaults,
    slug: "identify-locked-out-active-directory-accounts",
    title: "Identify Locked-Out Accounts",
    description:
      "Lists currently locked accounts for helpdesk triage. Reporting is the default; unlocking is an explicit, confirmed switch that modifies directory state.",
    category: "active-directory",
    subcategory: "Helpdesk",
    access: "modifies",
    permissions:
      "Read for reporting. Account Operators, Domain Admin or delegated unlock rights to use -Unlock.",
    install: "Requires the ActiveDirectory module (RSAT-AD-PowerShell).",
    usage: "powershell.exe -ExecutionPolicy Bypass -File .\\Find-LockedAccounts.ps1",
    example: ".\\Find-LockedAccounts.ps1 -Unlock",
    exampleOutput:
      "2 locked account(s) found.\n\nSamAccountName Name          LastLogonDate\n-------------- ----          -------------\najones         A. Jones      17/11/2026 08:44:10\n2 of 2 account(s) unlocked.",
    errorHandling:
      "Unlocking requires typing YES unless -Force is supplied, and each unlock is individually wrapped so one failure does not stop the rest.",
    security: [
      "Default behaviour is read-only.",
      "With -Unlock the script MODIFIES directory state — locked accounts may be locked for a reason (password spray), so check the source before unlocking.",
      "Unlocking does not change the password; a compromised account stays compromised.",
    ],
    keywords: ["ad", "locked", "lockout", "helpdesk", "unlock", "account"],
    fileName: "Find-LockedAccounts.ps1",
    source: lockedAccounts,
  },
  {
    slug: "find-accounts-with-passwords-that-never-expire",
    title: "Find Accounts With Passwords That Never Expire",
    description:
      "Planned audit of accounts where PasswordNeverExpires is set, grouped by OU so exceptions can be reviewed against policy.",
    category: "active-directory",
    subcategory: "Password policy",
    language: "powershell",
    status: "coming-soon",
  },
  {
    slug: "export-active-directory-computers",
    title: "Export Active Directory Computers",
    description:
      "Planned inventory of computer objects with operating system, version, last logon and enabled state.",
    category: "active-directory",
    subcategory: "Device reporting",
    language: "powershell",
    status: "coming-soon",
  },
  {
    slug: "bulk-create-active-directory-users-from-csv",
    title: "Bulk Create Active Directory Users From CSV",
    description:
      "Planned bulk provisioning script with a validation pass, -WhatIf support and per-row error logging. Modifies directory state.",
    category: "active-directory",
    subcategory: "Provisioning",
    language: "powershell",
    access: "modifies",
    status: "coming-soon",
  },
  {
    slug: "export-active-directory-health-summary",
    title: "Export Active Directory Health and User Summary",
    description:
      "Planned single-page summary combining replication health checks, account counts and domain controller state.",
    category: "active-directory",
    subcategory: "Health reporting",
    language: "powershell",
    status: "coming-soon",
  },
];