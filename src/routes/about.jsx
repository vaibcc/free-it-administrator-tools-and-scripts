import { createFileRoute } from "@tanstack/react-router";
import { PERSONAL_SITE } from "@/data/creator";
import { CREATOR } from "@/data/creator";
import { BookOpen, CheckCircle2, ShieldCheck, Users, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/LanguageContext";
import useDocumentTitle from "@/i18n/useDocumentTitle";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — VAIB Technical Tools" },
      {
        name: "description",
        content:
          "VAIB Technical Tools is an independent technical resource project providing practical scripts, tools and documentation for IT administrators.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, m, lang } = useI18n();
  useDocumentTitle(lang === "fr" ? "À propos — VAIB Technical Tools" : undefined, undefined);
  const focus = m("about.focus") ?? [];
  const principles = t("about.principles") ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">VAIB_TOOLS: /about</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-[2.2rem]">{t("about.title")}</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{t("about.p1")}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t("about.p2")}</p>

      <section className="mt-10">
        <div className="flex items-center gap-2 border-b border-hairline/70 pb-3">
          <BookOpen className="h-4 w-4 text-mint" />
          <h2 className="text-[15px] font-semibold uppercase tracking-wider">{t("about.covers")}</h2>
        </div>
        <div className="mt-4 grid gap-px border border-hairline/70 bg-hairline/60 sm:grid-cols-2">
          {focus.map((item) => (
            <div key={item.title} className="bg-card/70 p-5">
              <p className="text-[14px] font-medium text-foreground">{item.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 border-b border-hairline/70 pb-3">
          <Users className="h-4 w-4 text-mint" />
          <h2 className="text-[15px] font-semibold uppercase tracking-wider">{t("about.principlesTitle")}</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {principles.map((item) => (
            <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mint" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 border-b border-hairline/70 pb-3">
          <ShieldCheck className="h-4 w-4 text-mint" />
          <h2 className="text-[15px] font-semibold uppercase tracking-wider">{t("about.independenceTitle")}</h2>
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-muted-foreground">{t("about.independence1")}</p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{t("about.independence2")}</p>
      </section>

      <section className="mt-10 border border-hairline/70 bg-card/60 p-6">
        <p className="eyebrow">{t("about.creator")}</p>
        <p className="mt-2 text-[15px] font-medium text-foreground">{CREATOR.name}</p>
        <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">{t("about.creatorBio")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <Link
            to="/creator"
            className="inline-flex items-center rounded-sm border border-hairline px-4 py-2.5 text-sm text-foreground transition-colors hover:border-mint/50 hover:text-mint"
          >
            {t("about.creatorLink")}
          </Link>
          <a
            href={PERSONAL_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-sm bg-mint px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("about.creatorSite")}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-2.5 border border-hairline/70 bg-card/60 p-6">
        <p className="w-full text-sm text-muted-foreground">{t("about.ctaText")}</p>
        <Link
          to="/library"
          className="inline-flex items-center rounded-sm bg-mint px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {t("about.cta1")}
        </Link>
        <Link
          to="/documentation"
          className="inline-flex items-center rounded-sm border border-hairline px-4 py-2.5 text-sm text-foreground transition-colors hover:border-mint/50 hover:text-mint"
        >
          {t("about.cta2")}
        </Link>
      </div>
    </div>
  );
}