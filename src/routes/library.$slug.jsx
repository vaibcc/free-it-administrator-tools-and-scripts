import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, BookOpen, ExternalLink, ShieldCheck, Terminal } from "lucide-react";
import CodeBlock from "@/components/site/CodeBlock";
import ScriptActions from "@/components/site/ScriptActions";
import ScriptCard from "@/components/site/ScriptCard";
import { CATEGORY_MAP } from "@/data/categories";
import { SCRIPTS, getScript } from "@/data/library";
import { formatDate, languageExtension, languageLabel } from "@/lib/format";
import { useI18n } from "@/i18n/LanguageContext";
import { localizeCategory } from "@/i18n/categories.fr";
import { localizeScript, localizeScripts } from "@/i18n/scripts";
import useDocumentTitle from "@/i18n/useDocumentTitle";

export const Route = createFileRoute("/library/$slug")({
  head: (ctx) => {
    const script = getScript(ctx.params?.slug);
    return {
      meta: [
        { title: `${script ? script.title : "Script"} — VAIB Technical Tools` },
        { name: "description", content: script?.description ?? "IT administration script detail page." },
      ],
    };
  },
  component: ScriptDetailPage,
});

function ScriptDetailPage() {
  const { slug } = Route.useParams();
  const { t, lang } = useI18n();
  const original = getScript(slug);
  const script = localizeScript(original, lang);
  useDocumentTitle(
    script && lang === "fr" ? `${script.title} — VAIB Technical Tools` : undefined,
    script && lang === "fr" ? script.description : undefined,
  );

  if (!script) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="eyebrow">{t("script.notFoundEyebrow")}</p>
        <h1 className="mt-3 text-2xl font-semibold">{t("script.notFoundTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("script.notFoundText")}</p>
        <Link
          to="/library"
          className="mt-6 inline-flex items-center gap-2 rounded-sm bg-mint px-4 py-2.5 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> {t("script.back")}
        </Link>
      </div>
    );
  }

  const category = localizeCategory(CATEGORY_MAP[script.category], lang);
  const available = script.status === "available";
  const ext = languageExtension(script.language);
  const folder = script.language === "bash" ? "bash" : "powershell";
  const related = localizeScripts(
    SCRIPTS.filter((s) => s.category === script.category && s.slug !== script.slug && s.status === "available"),
    lang,
  ).slice(0, 3);

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="truncate font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
        VAIB_TOOLS: /scripts/{folder}/{script.category}/{script.fileName ?? script.slug + ext}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider">
        <span
          className={`rounded-xs border px-1.5 py-0.5 ${
            script.language === "bash" ? "border-mint/40 text-mint" : "border-prompt/40 text-prompt"
          }`}
        >
          {languageLabel(script.language)}
        </span>
        <Link
          to="/category/$slug"
          params={{ slug: script.category }}
          className="rounded-xs border border-hairline px-1.5 py-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          {category?.name ?? script.category}
        </Link>
        <span className="rounded-xs border border-hairline px-1.5 py-0.5 text-muted-foreground">
          {script.subcategory}
        </span>
        {available ? (
          script.access === "modifies" ? (
            <span className="rounded-xs border border-warn/40 px-1.5 py-0.5 text-warn">{t("common.modifies")}</span>
          ) : (
            <span className="rounded-xs border border-mint/40 px-1.5 py-0.5 text-mint">{t("common.readOnly")}</span>
          )
        ) : (
          <span className="rounded-xs border border-hairline px-1.5 py-0.5 text-muted-foreground">
            {t("common.comingSoon")}
          </span>
        )}
      </div>

      <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-[2.2rem]">
        {script.title}
      </h1>
      <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{script.description}</p>

      {available ? (
        <div className="mt-6">
          <ScriptActions source={original.source} fileName={original.fileName} />
        </div>
      ) : (
        <div className="mt-6 flex items-start gap-3 border border-hairline bg-surface/60 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" />
          <p className="text-[13px] leading-relaxed text-muted-foreground">{t("script.roadmapNote")}</p>
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-10">
          <Section id="source" title={available ? t("script.source") : t("script.sourceUnavailable")} icon={Terminal}>
            {available ? (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 border border-hairline/70 bg-surface/50 px-3 py-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-mint">
                    {t("script.codeLanguage")}
                  </span>
                  <span className="text-[11.5px] leading-relaxed text-muted-foreground">
                    {t("script.codeLanguageNote")}
                  </span>
                </div>
                <CodeBlock
                  code={original.source}
                  filename={original.fileName}
                  downloadName={original.fileName}
                  copyLabel={t("common.copy")}
                  lineNumbers
                  maxHeight="34rem"
                />
              </>
            ) : (
              <p className="border border-dashed border-hairline p-6 text-[13px] text-muted-foreground">
                {t("script.noSource")}
              </p>
            )}
          </Section>

          <Section title={t("script.requirements")} icon={ShieldCheck}>
            <dl className="grid gap-px border border-hairline/70 bg-hairline/60 sm:grid-cols-2">
              <Fact label={t("script.os")} value={script.platform} />
              <Fact label={t("script.runtime")} value={script.version} />
              <Fact label={t("script.category")} value={category?.name ?? script.category} />
              <Fact label={t("script.subcategory")} value={script.subcategory} />
              <Fact label={t("script.added")} value={formatDate(script.added)} />
              <Fact
                label={t("script.file")}
                value={script.fileName ?? `${t("script.notPublished")} (${ext})`}
              />
            </dl>
            <div className="mt-4">
              <p className="eyebrow">{t("script.modules")}</p>
              <ul className="mt-2 space-y-1.5">
                {(script.modules ?? [t("script.noModules")]).map((module) => (
                  <li key={module} className="font-mono text-[12px] text-muted-foreground">
                    → {module}
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {available && (
            <>
              <Section title={t("script.installation")} icon={BookOpen}>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">{script.install}</p>
                <pre className="mt-3 overflow-auto border border-hairline/70 bg-[#050b18] p-3 font-mono text-[12px] text-mint/90">
                  <code>{original.install.split("\n")[0]}</code>
                </pre>
              </Section>

              <Section title={t("script.usage")} icon={Terminal}>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">{script.usage}</p>
                <p className="mt-3 eyebrow">{t("script.exampleCommand")}</p>
                <pre className="mt-2 overflow-auto border border-hairline/70 bg-[#050b18] p-3 font-mono text-[12px] text-foreground/90">
                  <code>{script.example}</code>
                </pre>
                <p className="mt-4 eyebrow">{t("script.exampleOutput")}</p>
                <pre className="mt-2 overflow-auto border border-hairline/70 bg-[#050b18] p-3 font-mono text-[12px] leading-relaxed text-muted-foreground">
                  <code>{script.exampleOutput}</code>
                </pre>
              </Section>

              <Section title={t("script.permissions")} icon={ShieldCheck}>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">{script.permissions}</p>
              </Section>

              <Section title={t("script.errorHandling")} icon={AlertTriangle}>
                <p className="text-[13.5px] leading-relaxed text-muted-foreground">{script.errorHandling}</p>
              </Section>

              <Section title={t("script.security")} icon={ShieldCheck}>
                <ul className="space-y-2">
                  {(script.security ?? []).map((item) => (
                    <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>
            </>
          )}

          <Section title={t("script.docs")} icon={BookOpen}>
            <ul className="space-y-2">
              {(script.docs ?? []).map((doc) => (
                <li key={doc.url}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13.5px] text-prompt link-underline"
                  >
                    {doc.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
              {(!script.docs || script.docs.length === 0) && (
                <li className="text-[13.5px] text-muted-foreground">{t("script.docsLater")}</li>
              )}
            </ul>
          </Section>
        </div>

        <aside className="space-y-4">
          <div className="border border-hairline/70 bg-card/60 p-4">
            <p className="eyebrow">{t("script.impact")}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
              {available
                ? script.access === "modifies"
                  ? t("script.impactModifies")
                  : t("script.impactReadOnly")
                : t("script.impactPlanned")}
            </p>
            <div className="mt-4 space-y-2 border-t border-hairline/60 pt-3 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <p>
                {t("common.language")} · {languageLabel(script.language)}
              </p>
              <p>
                {t("common.ext")} · {ext}
              </p>
              <p>
                {t("common.status")} · {available ? t("common.available") : t("common.planned")}
              </p>
            </div>
          </div>

          <div className="border border-hairline/70 bg-card/60 p-4">
            <p className="eyebrow">{t("script.beforeRun")}</p>
            <ul className="mt-2 space-y-2 text-[12.5px] leading-relaxed text-muted-foreground">
              {(t("script.beforeRunItems") ?? []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              to="/documentation"
              className="mt-3 inline-block font-mono text-[10.5px] uppercase tracking-wider text-mint hover:opacity-80"
            >
              {t("script.guide")}
            </Link>
          </div>

          {related.length > 0 && (
            <div>
              <p className="eyebrow">
                {t("script.moreIn")} {category?.short}
              </p>
              <div className="mt-2 space-y-2">
                {related.map((item) => (
                  <ScriptCard key={item.slug} script={item} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}

function Section({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-2 border-b border-hairline/70 pb-3">
        {Icon && <Icon className="h-4 w-4 text-mint" />}
        <h2 className="text-[15px] font-semibold uppercase tracking-wider text-foreground">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Fact({ label, value }) {
  return (
    <div className="bg-card/70 px-4 py-3">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">{label}</dt>
      <dd className="mt-1 text-[13px] text-foreground/90">{value}</dd>
    </div>
  );
}