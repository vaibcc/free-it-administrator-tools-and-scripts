# VAIB Technical Tools

**Practical IT Tools. Real Scripts. Smarter Administration.**

VAIB Technical Tools is an independent IT administration resource website created and maintained by **Vaibhav Kamra**. It provides practical PowerShell and Bash scripts, Microsoft 365 administration resources, Linux utilities, security references and technical documentation.

- Website: https://vaibcc.github.io/free-it-administrator-tools-and-scripts/
- Creator: https://vaib.cc
- Repository: https://github.com/vaibcc/free-it-administrator-tools-and-scripts
- Languages: English and French

## Project independence

This repository contains the website source code and published script sources. The site is built with React and Vite and deployed as static files through GitHub Pages. It does not require Base44, a Base44 account, SDK, runtime, analytics or hosted backend.

## Features

- Searchable script library.
- English and French interface.
- Original English PowerShell and Bash source code.
- Copy and download actions.
- Requirements, platform, runtime and permission information.
- Links to official documentation.
- Curated external IT tools.
- Responsive layout for desktop and mobile.
- Static hosting without a paid backend.

## Technology

React, Vite, JavaScript, CSS, Lucide icons, GitHub Actions and GitHub Pages.

## Run locally

Requirements: Node.js 22 or later and npm.

```bash
npm install
npm run dev
```

Create a production build:

```bash
npm run build
npm run preview
```

## Deployment

The workflow at `.github/workflows/deploy.yml` builds the website and publishes the `dist/` directory to GitHub Pages when changes are pushed to `main`.

In repository settings, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.

The repository name is used as the GitHub Pages project path. If the repository is renamed or a custom domain is configured, update the Vite base path, canonical metadata, robots.txt, sitemap.xml and llms files accordingly.

## Script safety

- Review every script before running it.
- Prefer read-only operations.
- Use least-privilege permissions.
- Do not hardcode credentials, tokens or secrets.
- Verify Microsoft Graph scopes and module requirements.
- Protect exported CSV and report files.
- Test in a non-production environment before operational use.

The website language selector changes explanatory interface text only. Executable scripts remain in English in every language.

## Disclaimer

Scripts and documentation are provided as-is for educational and operational assistance. No guarantee is made that a script is suitable for every environment. Review and test code before use. You are responsible for validating its impact.

## Creator

Created and maintained by **Vaibhav Kamra**. Personal website: https://vaib.cc

## Contributing

Suggestions, corrections and improvements are welcome through GitHub issues and pull requests. Include the relevant environment, module versions, permissions and steps to reproduce any issue.