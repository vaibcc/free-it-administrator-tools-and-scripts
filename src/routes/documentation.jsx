import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, FileCode2, ShieldCheck, SquareTerminal, Terminal } from "lucide-react";
import CodeBlock from "@/components/site/CodeBlock";
import { LIBRARY_STATS } from "@/data/library";
import { useI18n } from "@/i18n/LanguageContext";
import useDocumentTitle from "@/i18n/useDocumentTitle";

export const Route = createFileRoute("/documentation")({
  head: () => ({
    meta: [
      { title: "Documentation — VAIB Technical Tools" },
      {
        name: "description",
        content:
          "How to run the PowerShell and Bash scripts in this library: execution policy, module installation, permissions, safety review and troubleshooting.",
      },
    ],
  }),
  component: DocumentationPage,
});

// Commands stay in English in both languages.
const PS_EXAMPLE = `# 1. Review the script first — never run code you have not read
Get-Content .\\Export-ADUsers.ps1 | more

# 2. Run it for the current session only (no permanent policy change)
powershell.exe -ExecutionPolicy Bypass -File .\\Export-ADUsers.ps1 -OutputPath C:\\Reports

# 3. Optional: unblock a file downloaded from the internet
Unblock-File .\\Export-ADUsers.ps1`;

const BASH_EXAMPLE = `# 1. Make the script executable
chmod +x disk-usage-report.sh

# 2. Review it
less disk-usage-report.sh

# 3. Run it (sudo only when the script documents that it is required)
./disk-usage-report.sh --threshold 85`;

function DocumentationPage() {
  const { t, m, lang } = useI18n();
  useDocumentTitle(lang === "fr" ? "Documentation — VAIB Technical Tools" : undefined, undefined);

  const sections = m("docs.sections") ?? [];
  const metadata = m("docs.metadata") ?? [];
  const permissions = t("docs.permissions") ?? [];
  const safety = t("docs.safety") ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
        VAIB_TOOLS: /documentation
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[2.1rem]">{t("docs.title")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("docs.description")}</p>

      <nav className="mt-8 flex flex-wrap gap-2 border border-hairline/70 bg-card/50 p-4">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-sm border border-hairline px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        <section id="structure" className="scroll-mt-24">
          <Heading icon={FileCode2} title={t("docs.structureTitle")} />
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{t("docs.structureText")}</p>
          <pre className="mt-3 overflow-auto border border-hairline/70 bg-[#050b18] p-4 font-mono text-[12px] leading-relaxed text-muted-foreground">
            <code>{`/scripts
  /powershell
    /active-directory
    /entra-id
    /microsoft-365
    /exchange-online
    /sharepoint
    /intune
    /defender
    /networking
    /security
  /bash
    /ubuntu
    /docker`}</code>
          </pre>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            {t("docs.structureText2a")}{" "}
            <span className="font-mono text-foreground">{t("actions.download")}</span> {t("docs.structureText2b")}{" "}
            <span className="font-mono text-foreground">{t("actions.copyScript")}</span>{" "}
            {t("docs.structureText2c")}
          </p>
        </section>

        <section id="powershell" className="scroll-mt-24">
          <Heading icon={SquareTerminal} title={t("docs.psTitle")} />
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{t("docs.psText")}</p>
          <div className="mt-4">
            <CodeBlock code={PS_EXAMPLE} filename="run-powershell.sh" copyLabel={t("common.copy")} maxHeight="16rem" />
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            {t("docs.psText2a")}{" "}
            <span className="font-mono text-foreground">Install-Module -Scope CurrentUser</span>
            {t("docs.psText2b")}
          </p>
        </section>

        <section id="bash" className="scroll-mt-24">
          <Heading icon={Terminal} title={t("docs.bashTitle")} />
          <div className="mt-4">
            <CodeBlock code={BASH_EXAMPLE} filename="run-bash.sh" copyLabel={t("common.copy")} maxHeight="14rem" />
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            {t("docs.bashTextA")} <span className="font-mono text-foreground">set -euo pipefail</span>
            {t("docs.bashTextB")} <span className="font-mono text-foreground">--help</span> {t("docs.bashTextC")}
          </p>
        </section>

        <section id="metadata" className="scroll-mt-24">
          <Heading icon={ShieldCheck} title={t("docs.metadataTitle")} />
          <dl className="mt-4 grid gap-px border border-hairline/70 bg-hairline/60 sm:grid-cols-2">
            {metadata.map(([term, description]) => (
              <div key={term} className="bg-card/70 px-4 py-3">
                <dt className="text-[13px] font-medium text-foreground">{term}</dt>
                <dd className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{description}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="permissions" className="scroll-mt-24">
          <Heading icon={ShieldCheck} title={t("docs.permissionsTitle")} />
          <ul className="mt-3 space-y-2.5">
            {permissions.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="safety" className="scroll-mt-24">
          <Heading icon={AlertTriangle} title={t("docs.safetyTitle")} />
          <ol className="mt-3 space-y-2.5">
            {safety.map((item, index) => (
              <li key={item} className="flex gap-3 text-[13.5px] leading-relaxed text-muted-foreground">
                <span className="font-mono text-[11px] text-mint">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </section>

        <div className="border border-mint/30 bg-mint/[0.04] p-5">
          <p className="text-sm font-medium">{t("docs.englishRuleTitle")}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{t("docs.englishRuleText")}</p>
        </div>

        <div className="border border-hairline/70 bg-card/50 p-5">
          <p className="text-sm font-medium">{t("docs.noteTitle")}</p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {t("docs.noteA")} {LIBRARY_STATS.comingSoon} {t("docs.noteB")}
          </p>
          <Link to="/library" className="mt-3 inline-block text-sm text-mint link-underline">
            {t("docs.noteCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Heading({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 border-b border-hairline/70 pb-3">
      <Icon className="h-4 w-4 text-mint" />
      <h2 className="text-[15px] font-semibold uppercase tracking-wider">{title}</h2>
    </div>
  );
}