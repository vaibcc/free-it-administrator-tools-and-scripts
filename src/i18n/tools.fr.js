// French descriptions for the external tools catalogue, keyed by tool name.
export const FR_TOOL_TEXT = {
  "Microsoft Sysinternals": {
    category: "Administration Windows",
    purpose: "Utilitaires de dépannage pour processus, registre, fichiers et réseau.",
    description:
      "La suite officielle d'utilitaires système avancés de Microsoft : Process Explorer, Autoruns, PsExec, TCPView et bien d'autres, publiée sur la documentation Sysinternals.",
  },
  "Microsoft Graph PowerShell SDK": {
    category: "Automatisation Microsoft 365",
    purpose: "Accès scripté à Microsoft Graph pour M365, Entra ID et Intune.",
    description:
      "Le SDK PowerShell officiel de Microsoft Graph, utilisé par la plupart des scripts d'identité et de locataire de cette bibliothèque.",
  },
  "PnP PowerShell": {
    category: "Automatisation SharePoint",
    purpose: "Administration de sites SharePoint Online et Microsoft 365 depuis PowerShell.",
    description:
      "Des cmdlets maintenues par la communauté et soutenues par Microsoft pour le provisionnement et l'administration de sites SharePoint Online.",
  },
  PowerShell: {
    category: "Environnement d'automatisation",
    purpose: "Le shell et langage de script multiplateforme utilisé par nos scripts .ps1.",
    description:
      "PowerShell 7 issu du projet officiel : paquets Windows, Linux et macOS, ainsi que les notes de version.",
  },
  "Windows Terminal": {
    category: "Console",
    purpose: "Terminal à onglets pour PowerShell, CMD, WSL et SSH.",
    description:
      "L'application de terminal moderne de Microsoft, avec profils, volets, rendu accéléré par GPU et palette de commandes.",
  },
  "Windows Admin Center": {
    category: "Gestion de serveurs",
    purpose: "Administration de serveurs et clusters Windows depuis un navigateur.",
    description:
      "La passerelle d'administration locale gratuite de Microsoft pour les serveurs, clusters et clients Windows.",
  },
  "Ubuntu Server": {
    category: "Plateforme Linux",
    purpose: "La distribution serveur LTS ciblée par nos scripts Bash.",
    description:
      "Ubuntu Server de Canonical, avec les notes de version LTS et la documentation d'installation.",
  },
  Docker: {
    category: "Conteneurs",
    purpose: "Moteur de conteneurs et CLI utilisés par nos scripts de conteneurs.",
    description:
      "Les distributions Docker Engine et Docker Desktop, avec l'installation officielle et la référence de la CLI.",
  },
  Portainer: {
    category: "Conteneurs",
    purpose: "Interface web pour gérer les hôtes Docker, les piles et les conteneurs.",
    description:
      "Une interface de gestion de conteneurs proposant une édition Community gratuite pour les particuliers et les petites équipes.",
  },
  Wireshark: {
    category: "Analyse réseau",
    purpose: "Capture de paquets et analyse de protocoles.",
    description:
      "L'analyseur de protocoles réseau open source de référence, avec tshark pour la capture en ligne de commande.",
  },
  Nmap: {
    category: "Découverte réseau",
    purpose: "Découverte d'hôtes, balayage de ports et détection de services.",
    description:
      "Le projet Nmap Security Scanner, avec son guide de référence officiel et l'interface Zenmap.",
  },
  Ventoy: {
    category: "Déploiement",
    purpose: "Création de clés USB multi-amorçage à partir de fichiers ISO.",
    description:
      "Une solution open source de support amorçable qui exécute directement les fichiers ISO sans réécrire la clé.",
  },
  Rufus: {
    category: "Déploiement",
    purpose: "Création de supports USB amorçables pour les installeurs Windows et Linux.",
    description:
      "Un utilitaire Windows léger pour formater et créer des supports d'installation USB amorçables.",
  },
  "Visual Studio Code": {
    category: "Édition",
    purpose: "Éditeur pour PowerShell, Bash, JSON et YAML avec l'extension PowerShell.",
    description:
      "L'éditeur de code gratuit de Microsoft, largement utilisé avec les extensions officielles PowerShell et Docker.",
    label: "VS Code",
  },
};

export function localizeTool(tool, lang) {
  if (!tool || lang !== "fr") return tool;
  const translation = FR_TOOL_TEXT[tool.name];
  return translation ? { ...tool, ...translation, name: tool.name } : tool;
}

export function localizeTools(tools, lang) {
  if (lang !== "fr") return tools;
  return tools.map((tool) => localizeTool(tool, lang));
}