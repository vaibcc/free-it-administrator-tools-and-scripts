import { Layers } from "lucide-react";
import { EXPERTISE_AREAS } from "@/data/creator";
import { useI18n } from "@/i18n/LanguageContext";

const FR_GROUPS = {
  Identity: "Identité",
  Endpoint: "Postes",
  Security: "Sécurité",
  Governance: "Gouvernance",
  Automation: "Automatisation",
  Infrastructure: "Infrastructure",
  AI: "IA",
};

export default function ExpertiseGrid() {
  const { t, lang } = useI18n();
  const areas = t("creator.expertise") ?? [];

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 border-b border-hairline/70 pb-3">
        <Layers className="h-4 w-4 text-mint" />
        <h2 className="text-[15px] font-semibold uppercase tracking-wider">{t("creator.technical")}</h2>
      </div>
      <p className="mt-4 max-w-3xl text-[13.5px] leading-relaxed text-muted-foreground">
        {t("creator.technicalIntro")}
      </p>
      <div className="mt-5 grid gap-px border border-hairline/70 bg-hairline/60 sm:grid-cols-2 lg:grid-cols-3">
        {EXPERTISE_AREAS.map((area, index) => (
          <div key={area.name} className="bg-card/70 px-4 py-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13.5px] leading-snug text-foreground">{areas[index] ?? area.name}</p>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground/50">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <p className="mt-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-mint/80">
              {lang === "fr" ? FR_GROUPS[area.group] ?? area.group : area.group}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/70">{t("creator.technicalNote")}</p>
    </section>
  );
}