// French documentation for Microsoft 365 and Entra ID entries. Executable code is never stored here.
export default {
  "export-microsoft-365-users": {
    title: "Exporter tous les utilisateurs Microsoft 365",
    description:
      "Exporte chaque objet utilisateur du locataire via Microsoft Graph, avec l'état du compte, le pays d'utilisation des licences et la dernière connexion lorsque le locataire le permet.",
    subcategory: "Rapports de locataire",
    permissions:
      "Autorisation Microsoft Graph déléguée ou applicative User.Read.All. L'activité de connexion nécessite en plus AuditLog.Read.All et une licence Entra ID P1.",
    errorHandling:
      "Vérifie d'abord Get-MgContext et ne se connecte qu'en l'absence de session, puis intercepte chaque erreur Graph et se termine avec le code 1 afin qu'une tâche planifiée échoue visiblement.",
    security: [
      "Lecture seule : aucune boîte aux lettres, licence ou objet d'annuaire n'est modifié.",
      "Demande uniquement User.Read.All — jamais un rôle d'annuaire comme Administrateur global.",
      "Le consentement délégué se connecte en tant qu'opérateur ; pour des exécutions non assistées, utilisez une inscription d'application aux autorisations applicatives limitées à la même permission.",
    ],
  },
  "export-microsoft-365-licence-assignments": {
    title: "Exporter les attributions de licences Microsoft 365",
    description:
      "Associe les licences attribuées à chaque utilisateur aux SKU souscrits par le locataire afin d'afficher les noms de produits plutôt que des GUID, et liste les plans de service désactivés par licence.",
    subcategory: "Licences",
    permissions: "User.Read.All et Organization.Read.All.",
    errorHandling:
      "Les utilisateurs sans licence sont écrits avec « (none) » plutôt qu'omis, ce qui préserve l'exactitude des revues de couverture. Les échecs Graph terminent l'exécution avec le code 1.",
    security: [
      "Rapport de licences en lecture seule.",
      "S'appuie sur le catalogue de SKU du locataire : les noms de produits reflètent ce qui y est réellement souscrit.",
    ],
  },
  "find-users-without-mfa-registration": {
    title: "Trouver les utilisateurs sans enregistrement MFA",
    description:
      "Liste les utilisateurs actifs n'ayant enregistré aucune méthode d'authentification en dehors du mot de passe. Ce rapport porte sur l'enregistrement uniquement — il ne prouve pas que la MFA est appliquée, et le script l'indique dans sa propre sortie.",
    subcategory: "Authentification",
    permissions:
      "User.Read.All et UserAuthenticationMethod.Read.All. Un Lecteur global suffit ; l'Administrateur global n'est pas nécessaire.",
    errorHandling:
      "La lecture des méthodes est isolée par utilisateur : un utilisateur illisible est ignoré avec un avertissement au lieu d'interrompre une longue exécution. Une barre de progression indique l'avancement du rapport.",
    security: [
      "Lecture seule. Le script n'enregistre, ne réinitialise et ne supprime jamais de méthode d'authentification.",
      "Enregistrement ≠ application. Un utilisateur enregistré peut rester exclu de l'accès conditionnel ; utilisez l'export des stratégies d'accès conditionnel pour vérifier la règle qui impose la MFA.",
      "Les paramètres de sécurité par défaut, la MFA par utilisateur et l'accès conditionnel sont des mécanismes distincts — le rapport précise lequel n'est pas contrôlé.",
    ],
  },
  "export-entra-id-security-groups": {
    title: "Exporter les groupes de sécurité Entra ID",
    description:
      "Exporte les groupes avec appartenance attribuée ou dynamique, le nombre de membres et la date de création, avec en option un second CSV contenant une ligne par couple groupe-membre.",
    subcategory: "Groupes",
    permissions: "Group.Read.All, plus GroupMember.Read.All lorsque -IncludeMembers est utilisé.",
    errorHandling:
      "Les comptages de membres sont donnés au mieux : un groupe dont les membres ne peuvent être développés conserve un comptage vide et un message détaillé plutôt que de faire échouer l'export.",
    security: [
      "Inventaire de groupes en lecture seule.",
      "L'appartenance aux groupes révèle les chemins d'accès — traitez l'export comme sensible.",
    ],
  },
  "export-entra-id-guest-accounts": {
    title: "Exporter les comptes invités Entra ID",
    description:
      "Signale les identités externes avec le domaine invitant, l'état de l'invitation, la date de création et la dernière connexion, et peut signaler les invités inactifs au-delà d'un seuil.",
    subcategory: "Identités externes",
    permissions:
      "User.Read.All et AuditLog.Read.All. Les horodatages de connexion nécessitent en plus une licence Entra ID P1 ou P2.",
    errorHandling:
      "Sur les locataires sans P1/P2, le champ de connexion reste simplement vide — le script le documente comme une différence de licence plutôt que comme un échec.",
    security: [
      "Lecture seule. Les comptes invités ne sont jamais supprimés par ce script.",
      "La revue des invités relève de la gouvernance des accès : validez avec le propriétaire de la ressource avant toute suppression.",
    ],
  },
  "export-conditional-access-policies": {
    title: "Exporter les stratégies d'accès conditionnel",
    description:
      "Produit un CSV à plat de chaque stratégie d'accès conditionnel — état, portées, contrôles d'octroi — ainsi qu'une copie JSON des définitions complètes, utile pour comparer des versions ou documenter un incident.",
    subcategory: "Accès conditionnel",
    permissions: "Policy.Read.All. Un Lecteur global ou Lecteur sécurité suffit.",
    errorHandling:
      "L'export JSON utilise une conversion profonde afin de préserver les objets de condition imbriqués. Tout échec Graph arrête l'exécution avec une erreur claire plutôt que d'écrire un fichier partiel.",
    security: [
      "Lecture seule. Les stratégies ne sont jamais créées, modifiées ni supprimées.",
      "Le JSON est une copie de référence, pas un artefact de déploiement — ne le réimportez pas dans un autre locataire sans revue.",
      "Les stratégies en mode rapport seul sont exportées avec leur état réel, afin que le « configuré mais non appliqué » reste visible.",
    ],
  },
  "identify-inactive-entra-id-users": {
    title: "Identifier les utilisateurs Entra ID inactifs",
    description:
      "Rapport d'inactivité prévu, fondé sur les connexions des comptes membres, avec des seuils configurables et une gestion des données de connexion selon la licence.",
    subcategory: "Hygiène des comptes",
  },
  "export-user-sign-in-activity": {
    title: "Exporter l'activité de connexion des utilisateurs",
    description:
      "Export prévu des horodatages de dernière connexion interactive et non interactive par utilisateur.",
    subcategory: "Rapports de connexion",
  },
  "report-users-with-privileged-directory-roles": {
    title: "Signaler les utilisateurs détenteurs de rôles d'annuaire privilégiés",
    description:
      "Rapport prévu des attributions de rôles d'annuaire actives, y compris les attributions permanentes et celles éligibles via PIM.",
    subcategory: "Accès privilégié",
  },
  "export-application-registrations": {
    title: "Exporter les inscriptions d'applications",
    description:
      "Inventaire prévu des inscriptions d'applications avec propriétaires, informations d'identification et dates d'expiration des secrets clients et certificats.",
    subcategory: "Applications",
  },
  "identify-service-principals-with-excessive-permissions": {
    title: "Identifier les principaux de service aux autorisations excessives",
    description:
      "Revue prévue des autorisations d'API applicatives, mettant en évidence les portées d'écriture à l'échelle du locataire accordées aux principaux de service.",
    subcategory: "Applications",
  },
  "report-authentication-methods": {
    title: "Signaler les méthodes d'authentification",
    description:
      "Rapport prévu par utilisateur des méthodes enregistrées (Authenticator, FIDO2, téléphone, sans mot de passe) avec une classification de leur robustesse.",
    subcategory: "Authentification",
  },
  "export-registered-devices": {
    title: "Exporter les appareils enregistrés",
    description:
      "Export prévu des appareils Entra enregistrés et joints, avec le type de jonction, le propriétaire et l'état de conformité.",
    subcategory: "Appareils",
  },
  "identify-users-with-administrative-roles": {
    title: "Identifier les utilisateurs détenteurs de rôles administratifs",
    description:
      "Vue consolidée prévue des utilisateurs détenant des rôles administratifs directement ou via une attribution par groupe.",
    subcategory: "Accès privilégié",
  },
  "generate-microsoft-365-security-overview-report": {
    title: "Générer un rapport de synthèse de sécurité Microsoft 365",
    description:
      "Rapport combiné prévu résumant la posture MFA, les accès privilégiés et la couverture de l'accès conditionnel dans un seul document de revue.",
    subcategory: "Rapports de sécurité",
  },
};