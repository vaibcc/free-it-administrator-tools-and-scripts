import { ExternalLink } from "lucide-react";
import { TOOLS } from "@/data/tools";
import { useI18n } from "@/i18n/LanguageContext";
import { localizeTools } from "@/i18n/tools.fr";

export default function TrustedToolsStrip({ limit = 6 }) {
  const { t, lang } = useI18n();
  const tools = localizeTools(TOOLS, lang).slice(0, limit);

  return (
    <div className="grid gap-px border border-hairline/80 bg-hairline/60 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <div key={tool.name} className="flex flex-col justify-between gap-3 bg-card/70 p-5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-foreground">{tool.name}</p>
              <span className="shrink-0 rounded-xs border border-hairline px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                {tool.category}
              </span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{tool.purpose}</p>
          </div>
          <a
            href={tool.site}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-mint transition-opacity hover:opacity-80"
          >
            {t("toolsPage.official")}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      ))}
    </div>
  );
}