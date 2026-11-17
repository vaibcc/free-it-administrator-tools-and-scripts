import { UserRound } from "lucide-react";
import { useI18n } from "@/i18n/LanguageContext";

export default function CreatorBiography() {
  const { t } = useI18n();
  const paragraphs = t("creator.bio") ?? [];

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 border-b border-hairline/70 pb-3">
        <UserRound className="h-4 w-4 text-mint" />
        <h2 className="text-[15px] font-semibold uppercase tracking-wider">{t("creator.profile")}</h2>
      </div>
      <div className="mt-5 max-w-3xl space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={paragraph.slice(0, 32)}
            className={
              index === 0
                ? "text-[15.5px] leading-relaxed text-foreground/90"
                : "text-[14px] leading-relaxed text-muted-foreground"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}