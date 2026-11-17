// French documentation for Exchange Online and SharePoint entries. Executable code is never stored here.
export default {
  "export-exchange-online-mailboxes": {
    title: "Exporter les boîtes aux lettres Exchange Online",
    description:
      "Exporte chaque boîte aux lettres du locataire avec son type, son adresse SMTP principale, sa date de création et son masquage dans les listes d'adresses, via les cmdlets Get-EXOMailbox basées sur REST, plus rapides.",
    subcategory: "Inventaire des boîtes",
    permissions:
      "Administrateur Exchange, ou groupe de rôles Lecteur global / Destinataires en lecture seule. L'Administrateur global n'est pas nécessaire.",
    errorHandling:
      "Se connecte uniquement lorsqu'aucune session Exchange Online n'existe, afin de réutiliser la session entre les exécutions. Les échecs d'export déclenchent une erreur bloquante et un code de sortie 1.",
    security: [
      "Inventaire de boîtes aux lettres en lecture seule.",
      "Utilise les cmdlets basées sur REST — pas de session PowerShell distante à large usurpation d'identité.",
    ],
  },
  "find-mailboxes-with-forwarding-enabled": {
    title: "Identifier les boîtes aux lettres avec transfert activé",
    description:
      "Détecte les transferts internes et externes configurés sur les boîtes aux lettres, et en option les règles de boîte de réception qui redirigent ou transfèrent les messages — un indicateur fréquent de compte compromis.",
    subcategory: "Revue de sécurité",
    permissions:
      "Administrateur Exchange, Lecteur global ou Lecteur sécurité avec Destinataires en lecture seule.",
    errorHandling:
      "La lecture des règles est isolée par boîte aux lettres : une boîte dont les règles sont inaccessibles est ignorée avec un message détaillé plutôt que d'interrompre l'audit.",
    security: [
      "Lecture seule. Le transfert est signalé, jamais supprimé.",
      "La stratégie anti-spam sortante du locataire peut aussi bloquer le transfert automatique externe — ce rapport ne montre que la configuration des boîtes.",
      "Toute destination de transfert externe inattendue doit être traitée comme une compromission potentielle jusqu'à vérification.",
    ],
  },
  "export-sharepoint-sites": {
    title: "Exporter les sites SharePoint",
    description:
      "Exporte les collections de sites SharePoint Online avec modèle, propriétaire, capacité de partage, quota de stockage et état de verrouillage, avec la possibilité d'exclure les sites OneDrive.",
    subcategory: "Inventaire des sites",
    permissions: "Administrateur SharePoint, ou Lecteur global avec accès au centre d'administration SharePoint.",
    errorHandling:
      "L'URL du locataire est validée par un modèle avant la connexion : une URL mal saisie échoue immédiatement avec un message clair plutôt qu'avec une erreur d'authentification déroutante.",
    security: [
      "Inventaire de sites en lecture seule.",
      "Selon la stratégie du locataire, PnP PowerShell peut nécessiter une inscription d'application pour la connexion interactive.",
    ],
  },
  "report-sharepoint-site-storage-usage": {
    title: "Signaler l'utilisation du stockage des sites SharePoint",
    description:
      "Calcule l'espace utilisé, le quota et le pourcentage utilisé par collection de sites, et signale les sites dépassant un seuil d'alerte configurable, les plus volumineux en premier.",
    subcategory: "Capacité",
    permissions: "Administrateur SharePoint ou Lecteur global avec accès au centre d'administration SharePoint.",
    errorHandling:
      "Les sites sans quota explicite sont signalés comme « sans limite » plutôt que de provoquer une division par zéro. La validation maintient -WarningPercent entre 1 et 100.",
    security: [
      "Rapport de capacité en lecture seule.",
      "Les valeurs de stockage proviennent du centre d'administration et reflètent ce que Microsoft rapporte pour chaque collection de sites.",
    ],
  },
  "export-mailbox-permissions": {
    title: "Exporter les autorisations de boîtes aux lettres",
    description:
      "Export prévu des autorisations FullAccess, SendAs et SendOnBehalf par boîte aux lettres, y compris les paramètres d'automappage non standard.",
    subcategory: "Autorisations",
  },
  "export-distribution-groups": {
    title: "Exporter les groupes de distribution",
    description:
      "Inventaire prévu des groupes de distribution et des groupes de sécurité à extension messagerie avec propriétaires et nombre de membres.",
    subcategory: "Groupes",
  },
  "report-mailbox-sizes": {
    title: "Signaler la taille des boîtes aux lettres",
    description:
      "Rapport prévu des quotas et de l'utilisation par boîte aux lettres, mettant en évidence celles qui approchent de leur limite.",
    subcategory: "Capacité",
  },
  "export-shared-mailboxes": {
    title: "Exporter les boîtes aux lettres partagées",
    description:
      "Rapport prévu des boîtes partagées avec délégations, état de l'automappage et besoins de licence.",
    subcategory: "Inventaire des boîtes",
  },
  "export-sharepoint-permissions": {
    title: "Exporter les autorisations SharePoint",
    description:
      "Rapport d'autorisations prévu par site, listant les autorisations uniques, les administrateurs de collection de sites et les utilisateurs externes.",
    subcategory: "Autorisations",
  },
  "identify-external-sharepoint-sharing": {
    title: "Identifier les configurations de partage externe SharePoint",
    description:
      "Revue prévue, au niveau du locataire et des sites, des capacités de partage et des paramètres de liens anonymes.",
    subcategory: "Revue de sécurité",
  },
};