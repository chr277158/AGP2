# Rapport relationnel — Application « Suivi Des Dossiers v2.3 »

Ce rapport cartographie deux types de relations :

1. **Page → Page** : les liens de navigation (boutons de redirection, branches après traitement)
2. **Page → Table** : les tables de la base de données lues et/ou modifiées par chaque page

---

## 1. Graphe de navigation entre pages

| Page source | → | Page cible | Via | Nom du lien |
|---|---|---|---|---|
| 1 — Page d | → | 4 — Cc | branche | Aller à la page 4 |
| 3 — Recherche - DOSSIERS | → | 3 — Recherche - DOSSIERS | bouton | RESET |
| 4 — Cc | → | 27 — Créer une nouvelle  remarque | bouton | Ajout_Rem |
| 4 — Cc | → | 8 — Ajout Demandes de renseignements  &P8_REF_AE. | bouton | avis_de_presse |
| 4 — Cc | → | 9 — Demande de clarification | bouton | Vew |
| 4 — Cc | → | 29 — Remarque | bouton | Voir_Rem |
| 13 — Gestion des Comptes | → | 12 — Modification | bouton | CREATE |
| 23 — Cc copie Page 4 | → | 8 — Ajout Demandes de renseignements  &P8_REF_AE. | bouton | avis_de_presse |
| 23 — Cc copie Page 4 | → | 29 — Remarque | bouton | New |
| 23 — Cc copie Page 4 | → | 27 — Créer une nouvelle  remarque | bouton | New_1 |
| 23 — Cc copie Page 4 | → | 9 — Demande de clarification | bouton | Vew |
| 24 — تحيين معطيات الصفقة  عدد &P24_NB. | → | 8 — Ajout Demandes de renseignements  &P8_REF_AE. | bouton | avis_de_presse |
| 25 — etat avancement | → | 10 — cc | bouton | CREATE |
| 25 — etat avancement | → | 10 — cc | bouton | EDIT |
| 25 — etat avancement | → | 8 — Ajout Demandes de renseignements  &P8_REF_AE. | bouton | POP_ETAT_AVIS |
| 25 — etat avancement | → | 27 — Créer une nouvelle  remarque | bouton | POP_Remarque |
| 25 — etat avancement | → | 25 — etat avancement | bouton | RESET |
| 28 — Page d | → | 4 — Cc | branche | Aller à la page 4 |
| 30 — suivi des contrats | → | 10 — cc | bouton | EDIT |
| 32 — Gestion des Rappels | → | 33 — edit note | bouton | Add_Note |
| 37 — redirect | → | 40 — Cc | branche | - |
| 38 — test install | → | 47 — Congé | bouton | New |
| 40 — Cc | → | 8 — Ajout Demandes de renseignements  &P8_REF_AE. | bouton | avis_de_presse |
| 40 — Cc | → | 29 — Remarque | bouton | New |
| 40 — Cc | → | 27 — Créer une nouvelle  remarque | bouton | New_1 |
| 40 — Cc | → | 45 — AJOUT CONTRAT | bouton | Nouveau |
| 40 — Cc | → | 9 — Demande de clarification | bouton | Vew |
| 47 — Congé | → | 50 — solde | bouton | Nouveau |
| 51 — Mes Congés | → | 47 — Congé | bouton | Nouveau |
| 9999 — Cc - Connexion | → | 44 — Tableau de bord | branche | Branch To URL Identified By Item |
| 9999 — Cc - Connexion | → | 44 — Tableau de bord | branche | Go To Page 44 |
| 10000 — Administration | → | 10042 — Page 10042 | bouton | ADD_USER |
| 10010 — Options de configuration | → | 10000 — Administration | branche | Branchement sur la page d'administration |
| 10020 — Apparence de l | → | 10000 — Administration | branche | Branchement sur la page d'administration |
| 10030 — Tableau de bord des activités | → | 10031 — Principaux utilisateurs | bouton | VIEW_ACTIVITY_BY_USER |
| 10030 — Tableau de bord des activités | → | 10031 — Principaux utilisateurs | bouton | VIEW_ACTIVITY_BY_USER |
| 10030 — Tableau de bord des activités | → | 10034 — Vues de page | bouton | VIEW_ACTIVITY_DETAILS |
| 10030 — Tableau de bord des activités | → | 10032 — Journal des erreurs de l | bouton | VIEW_RECENT_ERRORS |
| 10040 — Page 10040 | → | 10000 — Administration | branche | Branchement sur la page d'administration |
| 10041 — Page 10041 | → | 10043 — Ajouter plusieurs utilisateurs | bouton | ADD_MULTIPLE_USERS |
| 10041 — Page 10041 | → | 10042 — Page 10042 | bouton | ADD_USER |
| 10043 — Ajouter plusieurs utilisateurs | → | 10044 — Ajouter plusieurs utilisateurs | branche | - |
| 10050 — Informations en retour | → | 10051 — Informations en retour soumises | branche | - |
| 20010 — Settings - Push Notifications | → | 20000 — Settings | bouton | BACK |

*44 liens de navigation détectés (boutons + branches).*

---

## 2. Relations Page → Table (tables métier)

| Page | Titre | Tables métier utilisées (opérations) |
|---|---|---|
| 1 | Page d | **CC** (SELECT); **CONTRATS** (SELECT); **FICHIER_MANQUANT_PAR_DOSSIER** (SELECT); **SP** (SELECT); **USER_NOTES** (INSERT,SELECT,UPDATE) |
| 2 | Etat - Des Dossiers | **FICHIER_LNCEMENT** (SELECT) |
| 4 | Cc | **CC** (DELETE,INSERT,SELECT,UPDATE); **FICHIER_LNCEMENT** (DELETE,INSERT,SELECT,UPDATE); **REMARQUE** (SELECT); **SP** (DELETE,INSERT,SELECT,UPDATE); **SUIVI_MODIF** (INSERT) |
| 5 | Calendrier | **FICHIER_MANQUANT_PAR_DOSSIER** (SELECT); **NOTIFICATION_OP** (SELECT); **SP** (SELECT) |
| 6 | إنشاء صفقة جديدة | **CC** (INSERT,SELECT); **FICHIER_LNCEMENT** (INSERT,SELECT); **SP** (INSERT,SELECT) |
| 8 | Ajout Demandes de renseignements  &P8_REF_AE. | **DEMANDE_CLARIFICATION** (SELECT) |
| 9 | Demande de clarification | **DEMANDE_CLARIFICATION** (SELECT) |
| 12 | Modification | **T_USER** (DELETE,INSERT,SELECT,UPDATE) |
| 14 | Etat Avis | **DEMANDE_CLARIFICATION** (DELETE,INSERT,SELECT,UPDATE) |
| 15 | Etat Affichage Public | **DEMANDE_CLARIFICATION** (DELETE,INSERT,SELECT,UPDATE) |
| 16 | Cc | **CC** (DELETE,INSERT,SELECT,UPDATE); **SUIVI_MODIF** (INSERT) |
| 17 | Edit_Avis | **REMARQUE** (DELETE,INSERT,SELECT,UPDATE) |
| 18 | ETAT AFFICHAGE PUBLIC | **DEMANDE_CLARIFICATION** (DELETE,INSERT,SELECT,UPDATE) |
| 19 | متابعة تقدم جميع الملفات | **SP** (SELECT) |
| 20 | إضافة ملف جديد | **SP** (DELETE,INSERT,SELECT,UPDATE) |
| 21 | متابعة تقدم الملفات | **FICHIER_LNCEMENT** (SELECT) |
| 23 | Cc copie Page 4 | **CC** (DELETE,INSERT,SELECT,UPDATE); **FICHIER_LNCEMENT** (DELETE,INSERT,SELECT,UPDATE); **REMARQUE** (SELECT); **SP** (DELETE,INSERT,SELECT,UPDATE); **SUIVI_MODIF** (INSERT) |
| 24 | تحيين معطيات الصفقة  عدد &P24_NB. | **CC** (SELECT); **DEMANDE_CLARIFICATION** (SELECT); **REMARQUE** (SELECT); **SP** (DELETE,INSERT,SELECT,UPDATE) |
| 27 | Créer une nouvelle  remarque | **REMARQUE** (INSERT,SELECT) |
| 28 | Page d | **FICHIER_MANQUANT_PAR_DOSSIER** (SELECT); **SP** (SELECT) |
| 30 | suivi des contrats | **CONTRATS** (SELECT) |
| 31 | Modifier la Remarque | **REMARQUE** (DELETE,INSERT,SELECT,UPDATE) |
| 32 | Gestion des Rappels | **CC** (SELECT); **CONTRATS** (SELECT); **USER_NOTES** (SELECT,UPDATE) |
| 33 | edit note | **USER_NOTES** (DELETE,INSERT,SELECT,UPDATE) |
| 34 | جدول الاشغال | **SUIVI** (SELECT) |
| 35 | Contrats | **CONTRATS** (SELECT) |
| 36 | edit_contrat &P36_N_CONTRAT_BC. | **CONTRATS** (SELECT) |
| 39 | Dossiers En Attente d | **CC** (SELECT); **CONTRATS** (SELECT) |
| 40 | Cc | **CC** (DELETE,INSERT,SELECT,UPDATE); **FICHIER_LNCEMENT** (DELETE,INSERT,SELECT,UPDATE); **REMARQUE** (SELECT); **SP** (DELETE,INSERT,SELECT,UPDATE); **SUIVI_MODIF** (INSERT) |
| 41 | قائمة الصفقات المبرمجة | **PREVIS_ANNUEL** (SELECT) |
| 42 | nouveau Dossier | **CC** (INSERT); **SUIVI** (SELECT) |
| 43 | Contrats 2 | **CONTRATS** (SELECT) |
| 44 | Tableau de bord | **CC** (SELECT); **CONTRATS** (SELECT) |
| 45 | AJOUT CONTRAT | **CONTRATS** (SELECT) |
| 46 | Suivi des Contrats | **CONTRATS** (SELECT) |
| 47 | Congé | **T_CONGE** (INSERT,SELECT) |
| 48 | heur sup | **HEUR_SPP** (SELECT) |
| 49 | Suivi des Dossiers | **FICHIER_LNCEMENT** (SELECT) |
| 50 | solde | **SOLDE_CONGE** (INSERT,SELECT,UPDATE) |
| 51 | Mes Congés | **T_CONGE** (SELECT) |
| 52 | Congé | **T_CONGE** (SELECT) |
| 54 | imprim_Congé | **T_CONGE** (SELECT) |

---

## 3. Relations Table → Pages (vue inversée)

Pour chaque table métier, la liste des pages qui la lisent et/ou la modifient :

### `CC`
- Page 1 (Page d) — SELECT
- Page 4 (Cc) — DELETE, INSERT, SELECT, UPDATE
- Page 6 (إنشاء صفقة جديدة) — INSERT, SELECT
- Page 16 (Cc) — DELETE, INSERT, SELECT, UPDATE
- Page 23 (Cc copie Page 4) — DELETE, INSERT, SELECT, UPDATE
- Page 24 (تحيين معطيات الصفقة  عدد &P24_NB.) — SELECT
- Page 32 (Gestion des Rappels) — SELECT
- Page 39 (Dossiers En Attente d) — SELECT
- Page 40 (Cc) — DELETE, INSERT, SELECT, UPDATE
- Page 42 (nouveau Dossier) — INSERT
- Page 44 (Tableau de bord) — SELECT

### `CONTRATS`
- Page 1 (Page d) — SELECT
- Page 30 (suivi des contrats) — SELECT
- Page 32 (Gestion des Rappels) — SELECT
- Page 35 (Contrats) — SELECT
- Page 36 (edit_contrat &P36_N_CONTRAT_BC.) — SELECT
- Page 39 (Dossiers En Attente d) — SELECT
- Page 43 (Contrats 2) — SELECT
- Page 44 (Tableau de bord) — SELECT
- Page 45 (AJOUT CONTRAT) — SELECT
- Page 46 (Suivi des Contrats) — SELECT

### `DEMANDE_CLARIFICATION`
- Page 8 (Ajout Demandes de renseignements  &P8_REF_AE.) — SELECT
- Page 9 (Demande de clarification) — SELECT
- Page 14 (Etat Avis) — DELETE, INSERT, SELECT, UPDATE
- Page 15 (Etat Affichage Public) — DELETE, INSERT, SELECT, UPDATE
- Page 18 (ETAT AFFICHAGE PUBLIC) — DELETE, INSERT, SELECT, UPDATE
- Page 24 (تحيين معطيات الصفقة  عدد &P24_NB.) — SELECT

### `FICHIER_LNCEMENT`
- Page 2 (Etat - Des Dossiers) — SELECT
- Page 4 (Cc) — DELETE, INSERT, SELECT, UPDATE
- Page 6 (إنشاء صفقة جديدة) — INSERT, SELECT
- Page 21 (متابعة تقدم الملفات) — SELECT
- Page 23 (Cc copie Page 4) — DELETE, INSERT, SELECT, UPDATE
- Page 40 (Cc) — DELETE, INSERT, SELECT, UPDATE
- Page 49 (Suivi des Dossiers) — SELECT

### `FICHIER_MANQUANT_PAR_DOSSIER`
- Page 1 (Page d) — SELECT
- Page 5 (Calendrier) — SELECT
- Page 28 (Page d) — SELECT

### `HEUR_SPP`
- Page 48 (heur sup) — SELECT

### `NOTIFICATION_OP`
- Page 5 (Calendrier) — SELECT

### `PREVIS_ANNUEL`
- Page 41 (قائمة الصفقات المبرمجة) — SELECT

### `REMARQUE`
- Page 4 (Cc) — SELECT
- Page 17 (Edit_Avis) — DELETE, INSERT, SELECT, UPDATE
- Page 23 (Cc copie Page 4) — SELECT
- Page 24 (تحيين معطيات الصفقة  عدد &P24_NB.) — SELECT
- Page 27 (Créer une nouvelle  remarque) — INSERT, SELECT
- Page 31 (Modifier la Remarque) — DELETE, INSERT, SELECT, UPDATE
- Page 40 (Cc) — SELECT

### `SOLDE_CONGE`
- Page 50 (solde) — INSERT, SELECT, UPDATE

### `SP`
- Page 1 (Page d) — SELECT
- Page 4 (Cc) — DELETE, INSERT, SELECT, UPDATE
- Page 5 (Calendrier) — SELECT
- Page 6 (إنشاء صفقة جديدة) — INSERT, SELECT
- Page 19 (متابعة تقدم جميع الملفات) — SELECT
- Page 20 (إضافة ملف جديد) — DELETE, INSERT, SELECT, UPDATE
- Page 23 (Cc copie Page 4) — DELETE, INSERT, SELECT, UPDATE
- Page 24 (تحيين معطيات الصفقة  عدد &P24_NB.) — DELETE, INSERT, SELECT, UPDATE
- Page 28 (Page d) — SELECT
- Page 40 (Cc) — DELETE, INSERT, SELECT, UPDATE

### `SUIVI`
- Page 34 (جدول الاشغال) — SELECT
- Page 42 (nouveau Dossier) — SELECT

### `SUIVI_MODIF`
- Page 4 (Cc) — INSERT
- Page 16 (Cc) — INSERT
- Page 23 (Cc copie Page 4) — INSERT
- Page 40 (Cc) — INSERT

### `T_CONGE`
- Page 47 (Congé) — INSERT, SELECT
- Page 51 (Mes Congés) — SELECT
- Page 52 (Congé) — SELECT
- Page 54 (imprim_Congé) — SELECT

### `T_USER`
- Page 12 (Modification) — DELETE, INSERT, SELECT, UPDATE

### `USER_NOTES`
- Page 1 (Page d) — INSERT, SELECT, UPDATE
- Page 32 (Gestion des Rappels) — SELECT, UPDATE
- Page 33 (edit note) — DELETE, INSERT, SELECT, UPDATE

---

## 4. Tables système APEX utilisées (module Administration)

Ces tables ne relèvent pas du métier mais des vues APEX standard (`APEX_*`), utilisées par les pages d'administration générées automatiquement :

- `APEX_ACTIVITY_LOG` : pages 22, 10032, 10034
- `APEX_APPLICATIONS` : pages 10020
- `APEX_APPLICATION_BUILD_OPTIONS` : pages 10010
- `APEX_APPLICATION_PAGES` : pages 10033, 10034, 10061
- `APEX_APPLICATION_THEMES` : pages 10020
- `APEX_APPLICATION_THEME_STYLES` : pages 10020
- `APEX_APPL_ACL_ROLES` : pages 10044
- `APEX_APPL_ACL_USERS` : pages 22, 10041, 10042
- `APEX_APPL_ACL_USER_ROLES` : pages 1, 32
- `APEX_APPL_AUTOMATIONS` : pages 10035
- `APEX_AUTOMATION_LOG` : pages 10036
- `APEX_AUTOMATION_MSG_LOG` : pages 10035
- `APEX_COLLECTIONS` : pages 10044
- `APEX_TEAM_FEEDBACK` : pages 10053, 10054
- `APEX_WORKSPACE_APEX_USERS` : pages 20000
- `APEX_WORKSPACE_SESSIONS` : pages 10000

---
