import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import CreatorIdentity from "@/components/site/creator/CreatorIdentity";
import CreatorBiography from "@/components/site/creator/CreatorBiography";
import ExpertiseGrid from "@/components/site/creator/ExpertiseGrid";
import ProjectInterests from "@/components/site/creator/ProjectInterests";
import ConnectSection from "@/components/site/creator/ConnectSection";
import { useI18n } from "@/i18n/LanguageContext";
import useDocumentTitle from "@/i18n/useDocumentTitle";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "About Vaibhav Kamra — VAIB Technical Tools" },
      {
        name: "description",
        content:
          "Vaibhav Kamra is an IT professional focused on enterprise IT administration, Microsoft technologies, cybersecurity, identity and access management, and cloud governance. Creator of VAIB Technical Tools.",
      },
      { property: "og:title", content: "About Vaibhav Kamra — VAIB Technical Tools" },
      {
        property: "og:description",
        content:
          "Enterprise IT administration, Microsoft 365, Entra ID, security, automation and local AI infrastructure. Personal website: vaib.cc",
      },
    ],
  }),
  component: CreatorPage,
});

function CreatorPage() {
  const { t, lang } = useI18n();
  useDocumentTitle(
    lang === "fr" ? "À propos de Vaibhav Kamra — VAIB Technical Tools" : undefined,
    lang === "fr"
      ? "Vaibhav Kamra est un professionnel de l'informatique spécialisé dans l'administration d'entreprise, les technologies Microsoft, la cybersécurité, la gestion des identités et la gouvernance du cloud."
      : undefined,
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
          VAIB_TOOLS: /creator
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-mint"
        >
          <ArrowLeft className="h-3 w-3" />
          {t("creator.aboutProject")}
        </Link>
      </div>

      <div className="mt-4">
        <CreatorIdentity />
      </div>

      <CreatorBiography />
      <ExpertiseGrid />
      <ProjectInterests />
      <ConnectSection />
    </div>
  );
}