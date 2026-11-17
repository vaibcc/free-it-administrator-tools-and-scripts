// French documentation for Intune and Defender entries. Executable code is never stored here.
export default {
  "export-intune-managed-devices": {
    title: "Exporter tous les appareils gérés par Intune",
    description:
      "Exporte chaque appareil géré par Intune avec son type de propriété, son état de conformité, sa version du système, son chiffrement, son numéro de série et sa dernière synchronisation, avec un filtre de système d'exploitation en option.",
    subcategory: "Inventaire des appareils",
    permissions:
      "Microsoft Graph DeviceManagementManagedDevices.Read.All. Le rôle Administrateur du service Intune n'est pas nécessaire.",
    errorHandling:
      "Un locataire vide renvoie zéro ligne au lieu d'une erreur, car un locataire sans licence Intune n'a par définition aucun appareil géré. Les échecs Graph se terminent avec le code 1.",
    security: [
      "Inventaire d'appareils en lecture seule.",
      "Les numéros de série et noms principaux d'utilisateur sont des données personnelles — stockez les exports de façon appropriée.",
    ],
  },
  "report-intune-non-compliant-devices": {
    title: "Signaler les appareils Intune non conformes",
    description:
      "Liste les appareils dont l'état de conformité n'est pas « conforme » avec les stratégies qui leur sont appliquées, en conservant visibles les états d'erreur et de conflit plutôt qu'en les fusionnant.",
    subcategory: "Conformité",
    permissions: "DeviceManagementManagedDevices.Read.All.",
    errorHandling:
      "La lecture de l'état des stratégies est donnée au mieux — un appareil dont l'état est illisible conserve une colonne vide et le rapport continue. Un regroupement par état de conformité fournit un résumé rapide à la fin.",
    security: [
      "Rapport de conformité en lecture seule.",
      "Les appareils en « erreur » ou « conflit » indiquent généralement un problème d'attribution de stratégie, non un problème d'appareil.",
    ],
  },
  "export-intune-compliance-policies": {
    title: "Exporter les stratégies de conformité Intune",
    description:
      "Exporte chaque stratégie de conformité avec sa plateforme, sa version, sa date de dernière modification, son nombre d'attributions et les groupes ciblés — un référentiel de configuration pour la documentation des changements.",
    subcategory: "Configuration",
    permissions: "DeviceManagementConfiguration.Read.All.",
    errorHandling:
      "La lecture des attributions est protégée individuellement ; une stratégie dont les attributions sont illisibles est tout de même exportée avec un comptage à zéro.",
    security: [
      "Export de configuration en lecture seule.",
      "Les cibles d'attribution sont exportées sous forme d'identifiants de groupe — résolvez les noms dans Entra ID lors de la documentation.",
    ],
  },
  "export-defender-device-inventory": {
    title: "Signaler l'inventaire des appareils Microsoft Defender",
    description:
      "Exporte l'inventaire des machines Microsoft Defender for Endpoint — état d'intégration, niveaux de risque et d'exposition, plateforme et dernière activité — via l'API publique Defender avec une inscription d'application.",
    subcategory: "Inventaire des postes",
    permissions:
      "Autorisation applicative Machine.Read.All accordée dans le portail Microsoft Defender (Paramètres > Points de terminaison > Autorisations API). Une inscription d'application Entra ID avec secret client est nécessaire.",
    errorHandling:
      "Le secret client est demandé comme chaîne sécurisée s'il est omis et n'est jamais écrit sur le disque ni affiché. La pagination suit @odata.nextLink jusqu'à l'inventaire complet ; les erreurs HTTP remontent comme erreurs bloquantes.",
    security: [
      "Lecture seule. L'API Defender est uniquement interrogée, jamais modifiée.",
      "Moindre privilège : Machine.Read.All uniquement. Ne réutilisez pas une inscription d'application Administrateur global.",
      "Passer un secret en ligne de commande le laisse dans l'historique du shell — préférez l'invite ou un gestionnaire de secrets.",
      "Nécessite une licence Defender for Endpoint et l'accès API activé pour le locataire ; sinon l'API répond HTTP 403.",
    ],
  },
  "identify-devices-not-checked-in-recently": {
    title: "Identifier les appareils sans synchronisation récente",
    description:
      "Rapport Intune prévu listant les appareils dont la dernière synchronisation dépasse un seuil, utile pour repérer le matériel décommissionné.",
    subcategory: "Santé des appareils",
  },
  "export-windows-device-inventory": {
    title: "Exporter l'inventaire des appareils Windows",
    description:
      "Inventaire prévu limité à Windows, avec build du système, chiffrement du disque et détails de l'agent de gestion.",
    subcategory: "Inventaire des appareils",
  },
  "report-operating-system-versions": {
    title: "Signaler les versions des systèmes d'exploitation",
    description:
      "Rapport de répartition prévu des versions et builds des systèmes d'exploitation sur les appareils gérés, pour appuyer la planification des correctifs.",
    subcategory: "Rapports de correctifs",
  },
  "export-intune-configuration-profiles": {
    title: "Exporter les profils de configuration",
    description:
      "Export prévu des profils de configuration d'appareils avec plateforme, résumé des paramètres et attributions.",
    subcategory: "Configuration",
  },
  "export-defender-device-risk-information": {
    title: "Exporter les informations de risque des appareils",
    description:
      "Export prévu des scores de risque de Defender for Endpoint, avec une note claire sur les autorisations nécessaires pour chaque champ.",
    subcategory: "Rapports de risque",
  },
  "generate-endpoint-security-overview": {
    title: "Générer un rapport de synthèse de sécurité des postes",
    description:
      "Rapport combiné prévu de posture des postes, fusionnant l'état de conformité Intune et les signaux de risque Defender.",
    subcategory: "Rapports de sécurité",
  },
};