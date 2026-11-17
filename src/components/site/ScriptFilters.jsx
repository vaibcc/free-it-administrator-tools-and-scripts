import { Link } from "@tanstack/react-router";
import { SCRIPTS } from "@/data/library";
import { SCRIPT_CATEGORIES } from "@/data/categories";
import { useI18n } from "@/i18n/LanguageContext";
import { localizeCategories } from "@/i18n/categories.fr";

function Group({ title, options, value, onChange }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <div className="mt-2 flex flex-col gap-0.5">
        {options.map((option) => {
          const active = (value ?? "") === option.value;
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`rounded-sm px-2 py-1.5 text-left text-[13px] transition-colors ${
                active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ScriptFilters({ filters, onChange, counts }) {
  const { t, lang } = useI18n();
  const categories = localizeCategories(SCRIPT_CATEGORIES, lang);

  const LANGUAGES = [
    { value: "", label: t("filters.allLanguages") },
    { value: "powershell", label: "PowerShell" },
    { value: "bash", label: "Bash" },
  ];

  const ACCESS = [
    { value: "", label: t("filters.allAccess") },
    { value: "read-only", label: t("access.readOnly") },
    { value: "modifies", label: t("access.modifies") },
  ];

  const STATUS = [
    { value: "", label: t("filters.allStatus") },
    { value: "available", label: t("status.available") },
    { value: "coming-soon", label: t("status.comingSoon") },
  ];

  const SORTS = [
    { value: "az", label: t("sort.az") },
    { value: "za", label: t("sort.za") },
    { value: "recent", label: t("sort.newest") },
  ];

  const categoryOptions = [
    { value: "", label: `${t("filters.allCategories")} (${counts.all})` },
    ...categories.map((c) => ({
      value: c.slug,
      label: `${c.short} (${counts.byCategory[c.slug] ?? 0})`,
    })),
  ];

  return (
    <aside className="space-y-6 border border-hairline/70 bg-card/50 p-4 lg:sticky lg:top-20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{t("filters.heading")}</p>
        <button
          type="button"
          onClick={() => onChange({ category: "", language: "", access: "", status: "", sort: "az" })}
          className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-mint"
        >
          {t("filters.reset")}
        </button>
      </div>

      <Group title={t("filters.category")} options={categoryOptions} value={filters.category} onChange={(v) => onChange({ ...filters, category: v })} />
      <Group title={t("filters.language")} options={LANGUAGES} value={filters.language} onChange={(v) => onChange({ ...filters, language: v })} />
      <Group title={t("filters.access")} options={ACCESS} value={filters.access} onChange={(v) => onChange({ ...filters, access: v })} />
      <Group title={t("filters.status")} options={STATUS} value={filters.status} onChange={(v) => onChange({ ...filters, status: v })} />
      <Group title={t("filters.sort")} options={SORTS} value={filters.sort || "az"} onChange={(v) => onChange({ ...filters, sort: v })} />

      <div className="border-t border-hairline/70 pt-4">
        <p className="eyebrow">{t("status.available")}</p>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          {SCRIPTS.filter((s) => s.status === "available").length} {t("filters.showing").toLowerCase()} · {t("common.withSource")}
        </p>
        <Link
          to="/documentation"
          className="mt-2 inline-block font-mono text-[10.5px] uppercase tracking-wider text-prompt hover:opacity-80"
        >
          {t("filters.guide")}
        </Link>
      </div>
    </aside>
  );
}