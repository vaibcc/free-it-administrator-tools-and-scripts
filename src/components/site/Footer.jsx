import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, SCRIPT_CATEGORIES } from "@/data/categories";
import { PERSONAL_SITE } from "@/data/creator";
import { useI18n } from "@/i18n/LanguageContext";
import { localizeCategories } from "@/i18n/categories.fr";

export default function Footer() {
  const { t, lang } = useI18n();
  const categories = localizeCategories(SCRIPT_CATEGORIES, lang);

  return (
    <footer className="mt-24 border-t border-hairline/80 bg-surface/60">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-mint/50 bg-mint/10 font-mono text-[11px] font-bold text-mint">
                {"</>"}
              </span>
              <span className="text-sm font-semibold tracking-tight">VAIB Technical Tools</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
            <a
              href={PERSONAL_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11.5px] text-mint transition-opacity hover:opacity-80"
            >
              {t("footer.personal")}
              <ArrowUpRight className="h-3 w-3" />
            </a>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/80">{t("footer.github")}</p>
          </div>

          <FooterColumn
            title={t("footer.library")}
            links={categories.slice(0, 6).map((c) => ({
              label: c.name,
              to: "/category/$slug",
              params: { slug: c.slug },
            }))}
          />
          <FooterColumn
            title={t("footer.moreCategories")}
            links={categories.slice(6).map((c) => ({
              label: c.name,
              to: "/category/$slug",
              params: { slug: c.slug },
            }))}
          />
          <div>
            <p className="eyebrow">{t("footer.resources")}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <FooterLink to="/library" label={t("footer.allScripts")} />
              <FooterLink to="/tools" label={t("footer.tools")} />
              <FooterLink to="/documentation" label={t("footer.docs")} />
              <FooterLink to="/about" label={t("footer.about")} />
              <FooterLink to="/creator" label={t("footer.aboutCreator")} />
              <FooterLink to="/privacy" label={t("footer.privacy")} />
              <FooterLink to="/disclaimer" label={t("footer.disclaimer")} />
            </ul>
            <p className="mt-6 font-mono text-[11px] text-muted-foreground/70">
              {CATEGORIES.length} {t("common.categories")}
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-sm border border-hairline/70 bg-background/40 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warn">{t("footer.disclaimerLabel")}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{t("footer.disclaimerText")}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-hairline/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} VAIB Technical Tools. {t("footer.rights")}</p>
          <p className="font-mono text-[11px]">{t("footer.independent")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              params={l.params}
              className="text-muted-foreground transition-colors hover:text-mint"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterLink({ to, label }) {
  return (
    <li>
      <Link to={to} className="text-muted-foreground transition-colors hover:text-mint">
        {label}
      </Link>
    </li>
  );
}