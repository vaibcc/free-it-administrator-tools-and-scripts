# VAIB Technical Tools

### Practical IT Tools. Real Scripts. Smarter Administration.

[![Website](https://img.shields.io/badge/Website-vaib.cc-2563EB?style=for-the-badge)](https://vaib.cc)
[![Language](https://img.shields.io/badge/Languages-English%20%7C%20French-blue?style=for-the-badge)](#-language-support)
[![Scripts](https://img.shields.io/badge/Scripts-PowerShell%20%7C%20Bash-5391FE?style=for-the-badge)](#-script-library)
[![Platform](https://img.shields.io/badge/Platform-GitHub%20Pages-181717?style=for-the-badge)](https://pages.github.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**VAIB Technical Tools** is an independent technical resource platform created by **Vaibhav Kamra**, dedicated to providing practical IT administration scripts, automation resources, technical documentation and useful tools for IT professionals.

The project focuses on real-world IT administration, Microsoft technologies, identity and access management, cybersecurity, endpoint management, Linux infrastructure, networking and automation.

The objective is simple: make useful IT administration resources accessible, understandable and practical for everyone.

**Website:** [https://vaib.cc](https://vaib.cc)

---

## About the Project

Modern IT environments require administrators to manage increasingly complex infrastructures, cloud platforms, identities, endpoints, security configurations and services.

VAIB Technical Tools aims to simplify these responsibilities through a collection of practical scripts, technical resources and automation solutions.

Whether you are an IT technician managing Windows systems, a Microsoft 365 administrator maintaining an enterprise tenant, a system administrator working with Linux servers or a security professional improving infrastructure visibility, this platform is designed to provide useful resources for everyday technical work.

The project prioritises:

- Practical administration over theoretical examples.
- Reusable and understandable scripts.
- Security-conscious automation.
- Clear documentation.
- Open technical resources.
- Free and accessible tools.
- Real-world administrative scenarios.

## Main Categories

### 1. PowerShell & Active Directory

A collection of PowerShell resources for Windows and Active Directory administration.

Planned resources include:

- Active Directory user inventory.
- Disabled and inactive account reporting.
- Password expiration monitoring.
- Group membership exports.
- Computer inventory.
- Account lockout investigation.
- Bulk user administration.
- Active Directory reporting.

### 2. Microsoft 365 & Microsoft Entra ID

Resources for Microsoft cloud administration, identity management and tenant visibility.

Planned resources include:

- Microsoft 365 user inventory.
- Licence assignment reporting.
- MFA registration reporting.
- Entra ID group exports.
- Guest account reporting.
- Inactive user identification.
- Privileged role reporting.
- Application registration inventory.
- Conditional Access policy exports.
- Authentication method reporting.
- Microsoft 365 security overview.

Microsoft Graph PowerShell SDK is used where appropriate.

### 3. Exchange Online & SharePoint

Practical tools for collaboration and messaging administration.

Planned resources include:

- Mailbox inventory.
- Mailbox permissions reporting.
- Mail forwarding audits.
- Distribution group exports.
- Shared mailbox reporting.
- Mailbox storage analysis.
- SharePoint site inventory.
- SharePoint storage reporting.
- SharePoint permissions auditing.
- External sharing reviews.

### 4. Microsoft Intune & Defender

Endpoint administration, device visibility and security reporting.

Planned resources include:

- Managed device inventory.
- Device compliance reporting.
- Device check-in monitoring.
- Windows version reporting.
- Configuration profile inventory.
- Compliance policy exports.
- Microsoft Defender device inventory.
- Endpoint security reporting.

### 5. Linux & Ubuntu Administration

Bash scripts and utilities for Linux server administration.

Planned resources include:

- Ubuntu server health reports.
- Disk usage monitoring.
- CPU and memory reporting.
- Failed systemd service checks.
- Network port monitoring.
- Backup verification.
- Linux infrastructure diagnostics.

### 6. Docker & Containers

Tools for managing containerised infrastructure.

Planned resources include:

- Docker container inventory.
- Container health monitoring.
- Docker image reporting.
- Docker storage analysis.
- Container status monitoring.
- Infrastructure diagnostics.

### 7. Networking & Security

Practical diagnostic and security auditing resources.

Planned resources include:

- Network connectivity testing.
- DNS diagnostics.
- TCP port testing.
- Network discovery.
- SSL certificate expiration monitoring.
- Windows Firewall auditing.
- Windows security event reporting.
- Local administrator auditing.
- Microsoft Defender status checks.

**Note:** The categories above represent the project roadmap. Resources are published as functional downloads when their source files and documentation are available. Planned resources are not represented as completed scripts.

---

## Script Library

Every published script is intended to provide a practical and documented solution.

Each script page should include:

| Feature | Description |
|---|---|
| Source code | Complete executable script |
| Copy script | Copy the original source code |
| Download | Download the actual `.ps1` or `.sh` file |
| Requirements | Required software and modules |
| Permissions | Required administrative permissions |
| Installation | Setup instructions |
| Usage | Execution examples |
| Documentation | Technical explanations |
| Security | Risks and operational considerations |

### Script language policy

**All executable scripts are maintained in English.**

This applies to:

- PowerShell scripts.
- Bash scripts.
- Python scripts, if introduced.
- Variable and function names.
- Parameters.
- Comments.
- Error messages.
- Logging messages.
- Generated output and CSV headers.

The website may be displayed in English or French, but executable source code is never translated.

This ensures consistency, maintainability and compatibility with standard IT administration practices.

---

## Language Support

VAIB Technical Tools supports two website languages:

- English (EN).
- French (FR).

Visitors can switch languages using the language selector in the website navigation.

The bilingual experience covers:

- Website navigation.
- Homepage content.
- Script descriptions.
- Technical explanations.
- Installation instructions.
- Requirements.
- Security documentation.
- About the Creator.
- Website information and disclaimers.

**Important:** Changing the website language never modifies the underlying executable scripts. Both language versions use the same original English source files.

---

## Security & Development Principles

Security and reliability are important considerations throughout this project.

Scripts are developed with the following principles in mind:

- Prefer read-only operations wherever possible.
- Avoid hardcoded credentials and secrets.
- Use least-privilege permissions.
- Include error handling.
- Validate user input.
- Provide clear execution instructions.
- Include appropriate logging.
- Identify potentially disruptive operations.
- Require confirmation before destructive actions.
- Encourage testing in non-production environments.

Microsoft 365 and Entra ID scripts must clearly identify the permissions and Microsoft Graph scopes required for their operations.

Scripts should not request Global Administrator permissions unless genuinely necessary.

No script should be described as tested unless it has actually been executed in an appropriate environment.

---

## External IT Tools & Resources

The platform also highlights useful free, open-source and official IT resources.

Examples include:

| Resource | Description | Official link |
|---|---|---|
| Microsoft Sysinternals | Windows troubleshooting and administration utilities | [Visit](https://learn.microsoft.com/en-us/sysinternals/) |
| Microsoft Graph PowerShell | Microsoft Graph administration SDK | [GitHub](https://github.com/microsoftgraph/msgraph-sdk-powershell) |
| PnP PowerShell | SharePoint administration automation | [GitHub](https://github.com/pnp/powershell) |
| PowerShell | Cross-platform automation framework | [GitHub](https://github.com/PowerShell/PowerShell) |
| Windows Terminal | Modern command-line application | [GitHub](https://github.com/microsoft/terminal) |
| Ubuntu | Linux operating system | [Official website](https://ubuntu.com/) |
| Docker | Container platform | [Official website](https://www.docker.com/) |
| Portainer | Container management platform | [Official website](https://www.portainer.io/) |
| Wireshark | Network protocol analyser | [Official website](https://www.wireshark.org/) |
| Nmap | Network discovery and security auditing | [Official website](https://nmap.org/) |
| Ventoy | Bootable USB creation utility | [Official website](https://www.ventoy.net/) |
| Rufus | Bootable USB creation utility | [Official website](https://rufus.ie/) |
| Visual Studio Code | Code editor | [Official website](https://code.visualstudio.com/) |

External tools remain the property of their respective authors and organisations. Their licensing and usage conditions apply.

---

## Technology Stack

The project is designed around lightweight, accessible technologies.

| Technology | Purpose |
|---|---|
| PowerShell | Windows and Microsoft administration |
| Microsoft Graph | Microsoft cloud automation |
| Bash | Linux administration |
| Python | Potential future automation utilities |
| React | Website interface |
| Vite | Frontend build system |
| GitHub | Source code and script repository |
| GitHub Pages | Static website hosting |
| HTML / CSS / JavaScript | Website foundation |

The project aims to avoid mandatory paid services and unnecessary backend dependencies.

---

## Repository Structure

The intended repository structure is:

```text
vaib-technical-tools/
│
├── public/
│   ├── assets/
│   └── favicon.ico
│
├── scripts/
│   ├── powershell/
│   │   ├── active-directory/
│   │   ├── entra-id/
│   │   ├── microsoft-365/
│   │   ├── exchange-online/
│   │   ├── sharepoint/
│   │   ├── intune/
│   │   └── defender/
│   │
│   ├── bash/
│   │   ├── ubuntu/
│   │   └── docker/
│   │
│   └── networking/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── translations/
│   └── data/
│
├── documentation/
│
├── README.md
├── LICENSE
└── package.json
```

---

## Who Is Behind VAIB Technical Tools?

**Vaibhav Kamra** is an IT professional with a strong focus on enterprise IT administration, Microsoft technologies, cybersecurity, identity and access management, and cloud governance.

His technical experience and interests cover Microsoft 365, Microsoft Entra ID, Microsoft Intune, Exchange Online, SharePoint, Microsoft Defender, Microsoft Purview, Windows administration, Linux infrastructure, Docker and automation.

He is particularly interested in making IT administration more efficient through practical scripting, automation, security improvements and accessible technical resources.

VAIB Technical Tools brings these interests together in a dedicated platform for sharing practical IT resources with the wider technology community.

### Explore my personal website

Discover more about my professional background, projects and technical interests.

**[Visit VAIB – https://vaib.cc](https://vaib.cc)**

---

## Disclaimer

All scripts and tools are provided for educational, informational and administrative purposes.

Users must:

- Review source code before execution.
- Understand the operations performed by each script.
- Validate required permissions.
- Test in a non-production environment.
- Maintain appropriate backups.
- Follow their organisation's security and change-management policies.

VAIB Technical Tools is an independent project and is not affiliated with, endorsed by or officially associated with Microsoft, Canonical, Docker or any other third-party vendor.

Use of third-party tools and software is subject to their respective licences and terms.

The author accepts no responsibility for damage, data loss, service interruption or security incidents resulting from the use or modification of provided resources.

---

## Contributing

Suggestions, corrections and improvements are welcome.

If you identify an issue or have an idea for a useful IT administration resource:

1. Open a GitHub issue.
2. Describe the problem or proposed improvement.
3. Include relevant technical details.
4. Provide reproducible examples where possible.

Contributions should prioritise security, reliability, readability and technical accuracy.

---

## Project Vision

The goal of VAIB Technical Tools is to build a growing collection of practical, accessible and well-documented IT administration resources.

From PowerShell automation and Microsoft 365 administration to Linux infrastructure, Docker and cybersecurity, the project aims to help IT professionals work smarter, troubleshoot faster and manage their environments more effectively.

**Practical IT Tools. Real Scripts. Smarter Administration.**

**Created by Vaibhav Kamra**

[Personal Website](https://vaib.cc) | [VAIB Technical Tools](https://vaib.cc)
