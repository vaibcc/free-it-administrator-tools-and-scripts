// French summaries for the administration domain cards on the homepage.
export const FR_DOMAINS = {
  "Windows & Active Directory": {
    name: "Windows et Active Directory",
    summary: "Rapports sur les utilisateurs, groupes et comptes du domaine avec le module ActiveDirectory.",
  },
  "Microsoft 365 & Entra ID": {
    name: "Microsoft 365 et Entra ID",
    summary: "Inventaire du locataire, posture d'authentification, rôles et accès conditionnel.",
  },
  "Exchange & SharePoint": {
    name: "Exchange et SharePoint",
    summary: "Inventaire des boîtes aux lettres, revue des transferts, stockage des sites et configuration du partage.",
  },
  "Intune & Defender": {
    name: "Intune et Defender",
    summary: "Inventaire des appareils gérés, état de conformité et posture des postes de travail.",
  },
  "Linux & Docker": {
    name: "Linux et Docker",
    summary: "Santé, capacité, services et état des conteneurs d'un serveur Ubuntu.",
  },
  "Networking & Security": {
    name: "Réseau et sécurité",
    summary: "Connectivité, DNS, ports, certificats, administrateurs locaux et état de Defender.",
  },
};

export function localizeDomain(domain, lang) {
  if (!domain || lang !== "fr") return domain;
  const translation = FR_DOMAINS[domain.name];
  return translation ? { ...domain, ...translation } : domain;
}