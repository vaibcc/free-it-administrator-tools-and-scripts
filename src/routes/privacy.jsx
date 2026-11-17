import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/LanguageContext";
import useDocumentTitle from "@/i18n/useDocumentTitle";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — VAIB Technical Tools" },
      {
        name: "description",
        content:
          "What VAIB Technical Tools does and does not collect: no accounts, no newsletters, no script telemetry, and how external links are handled.",
      },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS_EN = [
  {
    title: "No accounts and no forms",
    body: "The site has no sign-up, no login and no contact form. You can read and download every script without providing a name, email address or any other personal detail.",
  },
  {
    title: "No newsletter and no advertising",
    body: "There is no mailing list, no advertising network and no third-party marketing script embedded in these pages.",
  },
  {
    title: "Scripts do not report back",
    body: "The scripts run on your own machines. They do not contact this site, do not send telemetry and do not upload their output anywhere. Output stays wherever you write it.",
  },
  {
    title: "Hosting logs",
    body: "The app is served by a hosting platform. Like any web server, that platform may record standard technical request data (such as the requested page, timestamp and IP address) for security and reliability purposes. That processing is carried out by the hosting provider, not by this project.",
  },
  {
    title: "External links",
    body: "Links to Microsoft, GitHub, Docker, Nmap and other vendors take you to their sites, which apply their own privacy policies. No tracking parameters are added to outbound links.",
  },
  {
    title: "Exports created by the scripts",
    body: "Several scripts write CSV files containing user names, mail addresses, device names or configuration details. Those files are created on your system, under your control. Store them in a protected location and delete them when the review is finished.",
  },
];

function PrivacyPage() {
  const { t, m, lang } = useI18n();
  useDocumentTitle(lang === "fr" ? "Confidentialité — VAIB Technical Tools" : undefined, undefined);
  const sections = lang === "fr" ? (m("privacy.sections") ?? []) : SECTIONS_EN.map((s) => [s.title, s.body]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">VAIB_TOOLS: /privacy</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("privacy.title")}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("privacy.intro")}</p>

      <div className="mt-8 divide-y divide-hairline/60 border border-hairline/70">
        {sections.map(([title, body]) => (
          <section key={title} className="p-5">
            <h2 className="text-[14px] font-medium text-foreground">{title}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}