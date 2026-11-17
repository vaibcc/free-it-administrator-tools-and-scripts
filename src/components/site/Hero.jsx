const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, FileCode2, ShieldCheck, Terminal } from "lucide-react";
import CodeBlock from "@/components/site/CodeBlock";
import { useI18n } from "@/i18n/LanguageContext";

const SNIPPET = `#Requires -Version 5.1
<#
.SYNOPSIS
    Exports every Active Directory user to a timestamped CSV file.
.DESCRIPTION
    Read-only report using the ActiveDirectory module (RSAT).
.PARAMETER OutputPath
    Folder that receives the CSV export.
#>
[CmdletBinding()]
param(
    [ValidateNotNullOrEmpty()]
    [string]$OutputPath = (Join-Path $env:USERPROFILE "Documents")
)

Import-Module ActiveDirectory -ErrorAction Stop

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$file  = Join-Path $OutputPath "AD-Users-$stamp.csv"

Get-ADUser -Filter * -Properties * |
    Select-Object SamAccountName, Name, Enabled, LastLogonDate |
    Export-Csv -Path $file -NoTypeInformation -Encoding UTF8`;

export default function Hero() {
  const { t, m } = useI18n();
  const pillars = m("hero.pillars") ?? [];

  return (
    <section className="relative overflow-hidden border-b border-hairline/80">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "url(https://media.db.com/images/public/6afc2ca5aba548a0ce0eea9c/0425ce418_generated_a92111c1.png)",
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/70" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24 lg:px-8">
        <div className="animate-in-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/80 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("hero.badge")}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
            {t("hero.titleA")}
            <br />
            <span className="text-mint">{t("hero.titleB")}</span>
          </h1>

          <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">{t("hero.text")}</p>

          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <Link
              to="/category/$slug"
              params={{ slug: "powershell" }}
              className="group inline-flex items-center gap-2 rounded-sm bg-mint px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("hero.ctaPowerShell")}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/category/$slug"
              params={{ slug: "microsoft-365" }}
              className="inline-flex items-center gap-2 rounded-sm border border-hairline bg-surface/70 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-prompt/60 hover:text-prompt"
            >
              {t("hero.ctaM365")}
            </Link>
            <Link
              to="/library"
              className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:text-mint"
            >
              <BookOpen className="h-4 w-4" />
              {t("hero.ctaAll")}
            </Link>
          </div>

          <p className="mt-7 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
            {t("hero.note")}
            <br />
            {t("hero.note2")}
          </p>
        </div>

        <div className="relative animate-in-up">
          <div className="absolute -inset-4 rounded-sm bg-mint/[0.04] blur-2xl" />
          <div className="relative">
            <CodeBlock
              code={SNIPPET}
              filename="export-ad-users.ps1"
              copyLabel={t("common.copy")}
              maxHeight="26rem"
              className="shadow-[0_24px_80px_-32px_rgba(16,185,129,0.35)]"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge label="PowerShell 5.1+" tone="prompt" />
              <Badge label={t("common.readOnly")} tone="mint" />
              <Badge label="ActiveDirectory" tone="muted" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-px border-t border-hairline/80 bg-hairline/60 px-0 sm:grid-cols-3">
        {pillars.map((p, index) => {
          const Icon = [FileCode2, ShieldCheck, Terminal][index] ?? FileCode2;
          return (
          <div key={p.title} className="bg-background/80 px-5 py-6 sm:px-6">
            <Icon className="h-4 w-4 text-mint" />
            <p className="mt-3 text-sm font-medium text-foreground">{p.title}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{p.body}</p>
          </div>
          );
        })}
      </div>
    </section>
  );
}

function Badge({ label, tone }) {
  const tones = {
    prompt: "border-prompt/40 text-prompt",
    mint: "border-mint/40 text-mint",
    muted: "border-hairline text-muted-foreground",
  };
  return (
    <span className={`rounded-xs border px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${tones[tone]}`}>
      {label}
    </span>
  );
}