# Rapport détaillé — Page par page

## Application « Suivi Des Dossiers v2.3 » (alias SUIVI_DES_APPELS_D_OFFRES177924)

---

# PARTIE 1 — Pages métier (1 à 55)

## Page 1 — Page d
*Alias : `PAGE-D-ACCUEIL`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- APPELS D’OFFFRES en Cours *(NATIVE_CARDS)*
- APPELS D’OFFFRES en Cours *(statique/HTML)*
- Bienvenu *(statique/HTML)*
- Breadcrumb *(NATIVE_BREADCRUMB)*
- Navigation de page *(NATIVE_LIST)*
- New *(TMPL_THEME_42$COMMENTS)*
- Notes *(NATIVE_CARDS)*

**Champs / items (3) :**
- Visibles : `P1_FILTER_USER` (Filtrer pour Charger les dossiers), `P1_ROLE` (Nouveau)
- Cachés/techniques (1) : `P1_NB`

**Processus (traitements PL/SQL) :**
- **GET_PENDING_REMINDERS** — PL/SQL personnalisé *(déclenché : ON_DEMAND)*
- **Get_User_Role** — PL/SQL personnalisé *(déclenché : BEFORE_BOX_BODY)*
- **MARK_REMINDER_SENT** — PL/SQL personnalisé *(déclenché : ON_DEMAND)*
- **Nouveau** — PL/SQL personnalisé *(déclenché : BEFORE_HEADER)*

**Actions dynamiques (JS) :** `Alert_ouverture`, `masqué_notes`, `New`, `refresh2`, `refresh_1`

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL

---

## Page 2 — Etat - Des Dossiers
*Alias : `ETAT-APPEL-D-OFFFRES`*  
*Type de contenu : Dynamic Actions, Interactive Grid*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- New *(NATIVE_IG)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P2_ROLE`

**Actions dynamiques (JS) :** `attribut couleur`

---

## Page 3 — Recherche - DOSSIERS
*Alias : `RECHERCHE-APPEL-D-OFFFRES`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Barre de boutons *(statique/HTML)*
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Rechercher *(NATIVE_FACETED_SEARCH)*

**Champs / items (2) :**
- Visibles : `P3_SEARCH` (Rechercher)
- Cachés/techniques (1) : `P3_ANIM`

**Boutons :**
- **RESET** : Redirige vers une autre page → `f?p=&APP_ID.:3:&SESSION.::&DEBUG.:RR,3::`

**Actions dynamiques (JS) :** `New`

---

## Page 4 — Cc
*Alias : `CC1`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- APPEL D’OFFFRES *(NATIVE_FORM)*
- Boutons *(statique/HTML)*
- Dates *(statique/HTML)*
- Fichiers de lancement *(NATIVE_FORM)*
- New *(statique/HTML)*
- rem *(statique/HTML)*
- Statut *(statique/HTML)*
- تحيين المعطيات *(NATIVE_FORM)*
- معلومات أساسية عن الصفقة *(statique/HTML)*

**Champs / items (62) :**
- Visibles : `P4_ACORD` (تاريخ مصادقة اللجنة على كراسات الشروط), `P4_AVIS_DE_PRESSE` (Avis De Presse), `P4_BUDGET` (التكلفة التقديرية), `P4_CAUTION_P` (Caution Provisoire), `P4_CC_POUR_LANCEMENT` (CC Pour Lancement), `P4_CRITERES_EVALUATION` (Criteres Evaluation), `P4_DATE_LC` (التاريخ الإعلان عن المنافسة), `P4_DATE_LIMITE_PROPOSÉE` (آخر أجال تقديم العروض), `P4_DATE_OUVERTURE_DES_PLIS` (تاريخ فتح العروض), `P4_DECISION` (تاريخ قرار لجنة الصفقات), `P4_DESIGNATION_DE_LA_COMMISSION` (Designation De La Commission), `P4_DÉTAIL_DE_RÉPONSE` (الفترة المحددة لتسليم العروض), `P4_MAIL_PRESTATAIRE` (Mail Prestataire), `P4_NATURE_DE_DEPENSE` (Nature De Depense), `P4_NEW_NTB` (تاريخ ارجاع كراسات الشروط حسب المحضر), `P4_NOTE_OUVERTURE_PLIS` (Note Ouverture Plis), `P4_OBJET_CCT` (Titre), `P4_PROGRAMME_OUVERTURE_DE_PLIS` (Programe De lancemnt), `P4_PROPOSITION_COMMISSION` (Proposition Commission), `P4_REM` (لا توجد ملاحظات في هذا الملف حاليا), `P4_STATUS` (Statut), `P4_اللجنة_المختصة` (اللجنة المختصة), `P4_المكلف_بالملف` (المكلف بالملف), `P4_تاريخ_تقديم_كراسات_الشروط_للمصادقة` (تاريخ_تقديم_كراسات_الشروط_للمصادقة), `P4_طريقة_ابرام_الصفقة` (طريقة ابرام الصفقة), `P4_نوعية_الطلب` (نوعية الطلب)
- Cachés/techniques (36) : `P4_CREER_PAR`, `P4_DATE_AVIS81`, `P4_DATE_CC`, `P4_DATE_CRITERES`, `P4_DATE_CRÉATION`, `P4_DATE_DESIGNATION`, `P4_DATE_DE_LANC`, `P4_DATE_MAIL`, `P4_DATE_NOTE_OP`, `P4_DATE_PROGRAM_LANC`, `P4_DATE_PROGRAM_OUVERTURE`, `P4_DATE_PROPOSITION`, `P4_ID`, `P4_ID_1`, `P4_ID_2`, `P4_ID_CC`, `P4_JOURS_REST`, `P4_NB`, `P4_NEW_2`, `P4_PROGRAMME_DE_LANCEMENT`, `P4_PROGRAMME_OUVERTURE_DE_PLIS_1`, `P4_PROGRAM_LANC`, `P4_PV_CCT`, `P4_تاريخ__لجنة_الصفقات`, `P4_تاريخ_ارجاع_الضمانات_الوقتية`, `P4_تاريخ_ارجاع_كراسات_الشروط_حسب_المحضر`, `P4_تاريخ_ارسال_التقرير_للتقييم_الفني`, `P4_تاريخ_ارسال_مقترح_تركيبة_لجنة_التقييم`, `P4_تاريخ_امضاء_تقرير_تقييم_العروض`, `P4_تاريخ_تبليغ_الصفقة`, `P4_تاريخ_تقديم_الملف_للجنة_الشراءات`, `P4_تاريخ_نشر_نتائج_المنافسة`, `P4_تاريخ_ورود_CPT_ممضاة`, `P4_تاريخ_ورود_تعيين_تركيبة_لجنة_التقييم`, `P4_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط`, `P4_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط2`

**Boutons :**
- **Ajout_Rem** : Redirige vers une autre page → `f?p=&APP_ID.:27:&SESSION.::&DEBUG.::P27_ID_CC,P27_REF_DOS:&P4_ID.,&P4_NB.`
- **avis_de_presse** : Redirige vers une autre page → `f?p=&APP_ID.:8:&SESSION.::&DEBUG.::P8_REF_AE:&P4_NB.`
- **CANCEL** : Action gérée par Dynamic Action JS
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)
- **Vew** : Redirige vers une autre page → `f?p=&APP_ID.:9:&SESSION.::&DEBUG.::P9_REF:&P4_NB.`
- **Voir_Rem** : Redirige vers une autre page → `f?p=&APP_ID.:29:&SESSION.::&DEBUG.::P29_REF:&P4_ID.`

**Processus (traitements PL/SQL) :**
- **enregistrement des création** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Initialize form Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Initialize form Cc copie Page 4** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form Fichiers de lancement** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau Cc_1** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau Cc** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `activation_modif_admin_zone1`, `affiche REM`, `DA_CAUTION`, `DA_date de lanc`, `DA_DESIGNATION_DE_LA_COMMISSION`, `DA_MAIL`, `DA_NOTE_OP`, `DA_PROGRAM_LANC`, `DA_PROGRAM_OUVERTURE`, `DA_SET_DATE_AVIS`, `DA_SET_DATE_CC`, `DA_SET_DATE_CRITERES`, `date lancement statut`, `New_2`, `New_3`, `New_1`, `Nouveau`, `proposition`, `PV`

---

## Page 5 — Calendrier
*Alias : `CALENDRIER`*  
*Type de contenu : Page standard*

**Régions :**
- Calendrier *(NATIVE_CSS_CALENDAR)*
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- notification O.P *(TMPL_THEME_42$COMMENTS)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P5_NB`

---

## Page 6 — إنشاء صفقة جديدة
*Alias : `CREER-NOUVEAU`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Cc *(NATIVE_FORM)*
- Info Principales *(statique/HTML)*
- N *(NATIVE_FORM)*
- تحيين المعطيات *(NATIVE_FORM)*

**Champs / items (53) :**
- Visibles : `P6_BUDGET` (التكلفة التقديرية), `P6_DÉTAIL_DE_RÉPONSE` (الفترة المحددة لتسليم العروض), `P6_NATURE_DE_DEPENSE` (Nature De Depense), `P6_OBJET_CCT` (Titre), `P6_REF_AO` (رقم الصفقة), `P6_اللجنة_المختصة` (اللجنة المختصة), `P6_المكلف_بالملف` (المكلف بالملف), `P6_طريقة_ابرام_الصفقة` (طريقة ابرام الصفقة), `P6_نوعية_الطلب` (نوعية الطلب)
- Cachés/techniques (44) : `P6_AVIS_DE_PRESSE`, `P6_CC_POUR_LANCEMENT`, `P6_CREER_PAR`, `P6_CRITERES_EVALUATION`, `P6_DATE_AVIS`, `P6_DATE_CC`, `P6_DATE_CR`, `P6_DATE_CRITERES`, `P6_DATE_DESIGNATION`, `P6_DATE_MAIL`, `P6_DATE_NOTE_OP`, `P6_DATE_PROGRAM_LANC`, `P6_DATE_PROGRAM_OUVERTURE`, `P6_DATE_PROPOSITION`, `P6_DATE_RECEP_PV_CCT`, `P6_DESIGNATION_DE_LA_COMMISSION`, `P6_ID`, `P6_ID_1`, `P6_ID_2`, `P6_ID_CC`, `P6_MAIL_PRESTATAIRE`, `P6_NOTE_OUVERTURE_PLIS`, `P6_PROGRAMME_OUVERTURE_DE_PLIS`, `P6_PROGRAM_LANC`, `P6_PROPOSITION_COMMISSION`, `P6_PV_CCT`, `P6_STATUS`, `P6_التاريخ__للإعلان_عن_المنافسة`, `P6_تاريخ__لجنة_الصفقات`, `P6_تاريخ_ارجاع_الضمانات_الوقتية`, `P6_تاريخ_ارجاع_كراسات_الشروط_حسب_المحضر`, `P6_تاريخ_ارسال_التقرير_للتقييم_الفني`, `P6_تاريخ_ارسال_مقترح_تركيبة_لجنة_التقييم`, `P6_تاريخ_امضاء_تقرير_تقييم_العروض`, `P6_تاريخ_تبليغ_الصفقة`, `P6_تاريخ_تقديم_الملف_للجنة_الشراءات`, `P6_تاريخ_تقديم_كراسات_الشروط_للمصادقة`, `P6_تاريخ_قرار__لجنة_الصفقات`, `P6_تاريخ_مصادقة_اللجنة_على_كراسات_الشروط`, `P6_تاريخ_نشر_نتائج_المنافسة`, `P6_تاريخ_ورود_تعيين_تركيبة_لجنة_التقييم`, `P6_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط`, `P6_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط2`, `P6_عدد`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Initialize form creer_nouveau** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form FICHIER_LNCEMENT** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Process form تحيين المعطيات** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau Cc** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `date picker`, `New_2`

---

## Page 7 — suivi modification
*Alias : `SUIVI-MODIFICATION`*  
*Type de contenu : Page standard*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Rechercher *(NATIVE_SMART_FILTERS)*

**Champs / items (1) :**
- Visibles : `P7_SEARCH` (Rechercher)

---

## Page 8 — Ajout Demandes de renseignements  &P8_REF_AE.
*Alias : `ETAT-AVIS-DE-PRESSE`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- TEST *(NATIVE_FORM)*

**Champs / items (7) :**
- Visibles : `P8_EFFECTUER` (Réception), `P8_EFFECTUÉ_LE` (Reçu Le), `P8_ENVOYER` (Réponce), `P8_ENVOYÉ_LE` (Envoyé Le), `P8_REF_AE` (Ref Dossier), `P8_REMARQUES` (Objet du Demande de renseignements supplémentaires)
- Cachés/techniques (1) : `P8_ID_AVIS`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau etat avis de presse** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Traiter le panneau Etat Affichage Public** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`, `New_1`

---

## Page 9 — Demande de clarification
*Alias : `DEMANDE-DE-CLARIFICATION`*  
*Type de contenu : Dynamic Actions, Interactive Report, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- TEST *(NATIVE_IR)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P9_REF`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`

---

## Page 10 — cc
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- New *(statique/HTML)*

**Champs / items (2) :**
- Cachés/techniques (2) : `P10_ID`, `P10_REF`

**Boutons :**
- **BTN_IMPRIMER** : DEFINED_BY_DA
- **CANCEL** : Action gérée par Dynamic Action JS

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`

---

## Page 11 — Gestion de Compte
*Alias : `GESTION-DE-COMPTE`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*

**Champs / items (1) :**
- Visibles : `P11_` ()

**Actions dynamiques (JS) :** `Modifier un état - Boîte de dialogue fermée`

---

## Page 12 — Modification
*Alias : `MODIFICATION`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Modification *(NATIVE_FORM)*

**Champs / items (7) :**
- Visibles : `P12_FONCTION` (Fonction), `P12_GROUPE` (Groupe), `P12_MATRICULE` (Matricule), `P12_MDP` (Mdp), `P12_NOM` (Nom), `P12_TEL` (Tel)
- Cachés/techniques (1) : `P12_ID_1`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)
- **SUP** : Soumet la page (sauvegarde) (DELETE)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Modification** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Traiter le panneau Modification** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 13 — Gestion des Comptes
*Alias : `GESTION-DES-COMPTES`*  
*Type de contenu : Dynamic Actions*

**Boutons :**
- **CREATE** : Redirige vers une autre page → `f?p=&APP_ID.:12:&SESSION.::&DEBUG.:12`

**Actions dynamiques (JS) :** `Modifier un état - Boîte de dialogue fermée`

---

## Page 14 — Etat Avis
*Alias : `ETAT-AVIS`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Etat Avis *(NATIVE_FORM)*

**Champs / items (8) :**
- Visibles : `P14_EFFECTUER` (Effectuer ?), `P14_EFFECTUÉ_LE` (Effectué Le), `P14_ENVOYER` (Envoyer), `P14_ENVOYÉ_LE` (Envoyé Le), `P14_REF_AE` (Ref Ae), `P14_REMARQUES` (Remarques)
- Cachés/techniques (2) : `P14_ID_AVIS`, `P14_ROWID`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Etat Avis** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Traiter le panneau Etat Avis** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`, `New_1`, `New_2`

---

## Page 15 — Etat Affichage Public
*Alias : `ETAT-AFFICHAGE-PUBLIC`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Etat Affichage Public *(NATIVE_FORM)*
- . *(statique/HTML)*

**Champs / items (9) :**
- Visibles : `P15_EFFECTUER` (Effectuer), `P15_EFFECTUÉ_LE` (Effectué Le), `P15_ENVOYER` (Envoyer), `P15_ENVOYÉ_LE` (Envoyé Le), `P15_NEW`, `P15_REF_AE` (Ref Ae), `P15_REMARQUES` (Remarques)
- Cachés/techniques (2) : `P15_ID_AVIS`, `P15_ROWID`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Etat Affichage Public** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Traiter le panneau Etat Affichage Public** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`

---

## Page 16 — Cc
*Alias : `CC`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Cc *(NATIVE_FORM)*
- Dates *(statique/HTML)*
- Fichiers de lancement *(statique/HTML)*
- Info Principales *(statique/HTML)*

**Champs / items (24) :**
- Visibles : `P16_ACCORD_DG` (Accord DG), `P16_APPROBATION` (Approbation), `P16_AVIS_DE_PRESSE` (Avis De Presse), `P16_BUDGET` (Budget), `P16_CRITÈRES` (Critères), `P16_DATE_ACCORD` (Date Accord), `P16_DATE_AVIS` (Date Avis), `P16_DATE_DE_LANC` (Date De Lancement), `P16_DATE_LIMITE_PROPOSÉE` (Date Limite Proposée), `P16_DATE_OUVERTURE_DES_PLIS` (Date Ouverture Des Plis), `P16_DATE_PRO` (Date Pro), `P16_DATE_PV` (Date Pv), `P16_DÉTAIL_DE_RÉPONSE` (Délais De Réponse), `P16_FAX_PRESTATAIRE` (Fax Prestataire), `P16_NATURE_DE_DEPENSE` (Nature De Depense), `P16_NOTE_OUVERTURE_PLIS` (Note Ouverture Plis), `P16_OBJET_CCT` (Objet  de l'Appel d'Offres), `P16_PROGRAMME_OUVERTURE_DE_PLIS` (Programme Ouverture De Plis), `P16_PROPOSITION_DC_ET_DÉSIGNATION` (Proposition Dc Et Désignation), `P16_PV_CCT` (Pv Cct), `P16_REF_AO` (Ref Ao), `P16_STATUS` (Status)
- Cachés/techniques (2) : `P16_ID`, `P16_JOURS_REST`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **enregistrement des création** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Traiter le panneau Cc** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `date picker`

---

## Page 17 — Edit_Avis
*Alias : `EDIT-AVIS`*  
*Type de contenu : Modal*

**Régions :**
- Buttons *(statique/HTML)*
- Edit_Avis *(NATIVE_FORM)*

**Champs / items (4) :**
- Visibles : `P17_ID_CC` (Id Cc), `P17_REF_DOS` (Ref Dos), `P17_REMARQUE` (Remarque)
- Cachés/techniques (1) : `P17_ID_REM`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Close Dialog** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialize form Edit_Avis** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form Edit_Avis** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 18 — ETAT AFFICHAGE PUBLIC
*Alias : `ETAT-AFFICHAGE-PUBLIC1`*  
*Type de contenu : Modal*

**Régions :**
- Buttons *(statique/HTML)*
- ETAT AFFICHAGE PUBLIC *(NATIVE_FORM)*

**Champs / items (7) :**
- Visibles : `P18_EFFECTUER` (Effectuer), `P18_EFFECTUÉ_LE` (Effectué Le), `P18_ENVOYER` (Envoyer), `P18_ENVOYÉ_LE` (Envoyé Le), `P18_REF_AE` (Ref Ae), `P18_REMARQUES` (Remarques)
- Cachés/techniques (1) : `P18_ID_AVIS`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Close Dialog** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialize form ETAT AFFICHAGE PUBLIC** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form ETAT AFFICHAGE PUBLIC** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 19 — متابعة تقدم جميع الملفات
*Alias : `-`*  
*Type de contenu : Interactive Grid*

**Régions :**
- مراحل التقدم *(NATIVE_IG)*

**Processus (traitements PL/SQL) :**
- **New** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

---

## Page 20 — إضافة ملف جديد
*Alias : `-`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- تحيين المعطيات *(NATIVE_FORM)*

**Champs / items (27) :**
- Visibles : `P20_EXP__INV` (Exp  Inv), `P20_NB` (عدد الصفقة), `P20_التاريخ__للإعلان_عن_المنافسة` (التاريخ  للإعلان عن المنافسة), `P20_الكلفة_التقديرية__MDT_` (الكلفة التقديرية  Mdt), `P20_اللجنة_المختصة` (اللجنة المختصة), `P20_المكلف_بالملف` (المكلف بالملف), `P20_تاريخ__لجنة_الصفقات` (تاريخ  لجنة الصفقات), `P20_تاريخ_ارجاع_الضمانات_الوقتية` (تاريخ ارجاع الضمانات الوقتية), `P20_تاريخ_ارجاع_كراسات_الشروط_حسب_المحضر` (تاريخ ارجاع كراسات الشروط حسب المحضر), `P20_تاريخ_ارسال_التقرير_للتقييم_الفني` (تاريخ ارسال التقرير للتقييم الفني), `P20_تاريخ_ارسال_مقترح_تركيبة_لجنة_التقييم` (تاريخ ارسال مقترح تركيبة لجنة التقييم), `P20_تاريخ_امضاء_تقرير_تقييم_العروض` (تاريخ امضاء تقرير تقييم العروض), `P20_تاريخ_تبليغ_الصفقة` (تاريخ تبليغ الصفقة), `P20_تاريخ_تقديم_الملف_للجنة_الشراءات` (تاريخ تقديم الملف للجنة الشراءات), `P20_تاريخ_تقديم_كراسات_الشروط_للمصادقة` (تاريخ تقديم كراسات الشروط للمصادقة), `P20_تاريخ_فتح_العروض` (تاريخ فتح العروض), `P20_تاريخ_قرار__لجنة_الصفقات` (تاريخ قرار  لجنة الصفقات), `P20_تاريخ_مصادقة_اللجنة_على_كراسات_الشروط` (تاريخ مصادقة اللجنة على كراسات الشروط), `P20_تاريخ_نشر_نتائج_المنافسة` (تاريخ نشر نتائج المنافسة), `P20_تاريخ_ورود_CPT_ممضاة` (تاريخ ورود Cpt ممضاة), `P20_تاريخ_ورود_تعيين_تركيبة_لجنة_التقييم` (تاريخ ورود تعيين تركيبة لجنة التقييم), `P20_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط` (تاريخ ورود محضر مصادقة اللجنة على كراسات الشروط), `P20_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط2` (تاريخ ورود محضر مصادقة اللجنة على كراسات الشروط2), `P20_طريقة_ابرام_الصفقة` (طريقة ابرام الصفقة), `P20_موضوع_الصفقة` (موضوع الصفقة), `P20_نوعية_الطلب` (نوعية الطلب)
- Cachés/techniques (1) : `P20_ID`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)

**Processus (traitements PL/SQL) :**
- **Close Dialog** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialize form تحيين المعطيات** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form تحيين المعطيات** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 21 — متابعة تقدم الملفات
*Alias : `-`*  
*Type de contenu : Interactive Grid*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*
- مراحل التقدم *(NATIVE_IG)*

**Processus (traitements PL/SQL) :**
- **مراحل التقدم - Save Interactive Grid Data** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

---

## Page 22 — testee
*Alias : `TESTEE`*  
*Type de contenu : Dynamic Actions, Interactive Report*

**Régions :**
- Boutons *(statique/HTML)*
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Graphique des principaux utilisateurs *(NATIVE_JET_CHART)*
- Informations sur la liste de contrôle d'accès *(NATIVE_PLSQL)*
- Nouveau *(NATIVE_IR)*
- Nouveau *(statique/HTML)*
- Nouveau *(NATIVE_IR)*
- Principaux utilisateurs *(NATIVE_IR)*

**Champs / items (2) :**
- Visibles : `P22_TIMEFRAME` (Tranche de temps), `P22_VIEW_AS` (Visualiser comme)

**Boutons :**
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

**Actions dynamiques (JS) :** `Régénérer l'état`

---

## Page 23 — Cc copie Page 4
*Alias : `CC-COPIE-PAGE-4`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- APPEL D’OFFFRES *(NATIVE_FORM)*
- Boutons *(statique/HTML)*
- Dates *(statique/HTML)*
- Fichiers de lancement *(NATIVE_FORM)*
- New *(statique/HTML)*
- New *(statique/HTML)*
- تحيين المعطيات *(NATIVE_FORM)*
- معلومات أساسية عن الصفقة *(statique/HTML)*

**Champs / items (61) :**
- Visibles : `P23_AVIS_DE_PRESSE` (Avis De Presse), `P23_BUDGET` (التكلفة التقديرية), `P23_CC_POUR_LANCEMENT` (Cc Pour Lancement), `P23_CRITERES_EVALUATION` (Criteres Evaluation), `P23_DATE_DE_LANC` (Date De Lancement), `P23_DATE_LIMITE_PROPOSÉE` (آخر أجال تقديم العروض), `P23_DATE_OUVERTURE_DES_PLIS` (تاريخ فتح العروض), `P23_DESIGNATION_DE_LA_COMMISSION` (Designation De La Commission), `P23_DÉTAIL_DE_RÉPONSE` (الفترة المحددة لتسليم العروض), `P23_ETAT` (Status), `P23_MAIL_PRESTATAIRE` (Mail Prestataire), `P23_NATURE_DE_DEPENSE` (Nature De Depense), `P23_NEW_3` (لا توجد ملاحظات في هذا الملف حاليا), `P23_NEW_NTB` (تاريخ إستقبال ملاحظظات لجنة كراس الشروط), `P23_NOTE_OUVERTURE_PLIS` (Note Ouverture Plis), `P23_OBJET_CCT` (Titre), `P23_PROGRAMME_OUVERTURE_DE_PLIS` (Programme Ouverture De Plis), `P23_PROGRAM_LANC` (Program Lanc), `P23_PROPOSITION_COMMISSION` (Proposition Commission), `P23_STATUS` (Status), `P23_التاريخ__للإعلان_عن_المنافسة` (التاريخ للإعلان عن المنافسة), `P23_اللجنة_المختصة` (اللجنة المختصة), `P23_المكلف_بالملف` (المكلف بالملف), `P23_تاريخ_تقديم_كراسات_الشروط_للمصادقة` (تاريخ_تقديم_كراسات_الشروط_للمصادقة), `P23_تاريخ_قرار__لجنة_الصفقات` (تاريخ قرار لجنة الصفقات), `P23_تاريخ_مصادقة_اللجنة_على_كراسات_الشروط` (تاريخ مصادقة اللجنة على كراسات الشروط), `P23_طريقة_ابرام_الصفقة` (طريقة ابرام الصفقة), `P23_نوعية_الطلب` (نوعية الطلب)
- Cachés/techniques (33) : `P23_DATE_ACCORD`, `P23_DATE_AVIS`, `P23_DATE_AVIS81`, `P23_DATE_CC`, `P23_DATE_CRITERES`, `P23_DATE_DESIGNATION`, `P23_DATE_MAIL`, `P23_DATE_NOTE_OP`, `P23_DATE_PRO`, `P23_DATE_PROGRAM_LANC`, `P23_DATE_PROGRAM_OUVERTURE`, `P23_DATE_PROPOSITION`, `P23_DATE_PV`, `P23_ID`, `P23_ID_1`, `P23_ID_2`, `P23_ID_CC`, `P23_JOURS_REST`, `P23_NB`, `P23_NEW_2`, `P23_تاريخ__لجنة_الصفقات`, `P23_تاريخ_ارجاع_الضمانات_الوقتية`, `P23_تاريخ_ارجاع_كراسات_الشروط_حسب_المحضر`, `P23_تاريخ_ارسال_التقرير_للتقييم_الفني`, `P23_تاريخ_ارسال_مقترح_تركيبة_لجنة_التقييم`, `P23_تاريخ_امضاء_تقرير_تقييم_العروض`, `P23_تاريخ_تبليغ_الصفقة`, `P23_تاريخ_تقديم_الملف_للجنة_الشراءات`, `P23_تاريخ_نشر_نتائج_المنافسة`, `P23_تاريخ_ورود_CPT_ممضاة`, `P23_تاريخ_ورود_تعيين_تركيبة_لجنة_التقييم`, `P23_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط`, `P23_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط2`

**Boutons :**
- **avis_de_presse** : Redirige vers une autre page → `f?p=&APP_ID.:8:&SESSION.::&DEBUG.::P8_REF_AE:&P23_NB.`
- **CANCEL** : Action gérée par Dynamic Action JS
- **New** : Redirige vers une autre page → `f?p=&APP_ID.:29:&SESSION.::&DEBUG.::P29_REF:&P23_ID.`
- **New_1** : Redirige vers une autre page → `f?p=&APP_ID.:27:&SESSION.::&DEBUG.::P27_ID_CC,P27_REF_DOS:&P23_ID.,&P23_NB.`
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)
- **Vew** : Redirige vers une autre page → `f?p=&APP_ID.:9:&SESSION.::&DEBUG.::P9_REF:&P23_NB.`

**Processus (traitements PL/SQL) :**
- **enregistrement des création** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Initialize form Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Initialize form Cc copie Page 4** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form Fichiers de lancement** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau Cc_1** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau Cc** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `activation_modif_admin_zone1`, `DA_DESIGNATION_DE_LA_COMMISSION`, `DA_MAIL`, `DA_NOTE_OP`, `DA_PROGRAM_LANC`, `DA_PROGRAM_OUVERTURE`, `DA_SET_DATE_AVIS`, `DA_SET_DATE_CC`, `DA_SET_DATE_CRITERES`, `New_3`, `New_4_1`, `New_4`, `New_1`, `New_2`, `Programm_ lancement`, `proposition`, `PV`, `état`

---

## Page 24 — تحيين معطيات الصفقة  عدد &P24_NB.
*Alias : `-`*  
*Type de contenu : Modal*

**Régions :**
- Buttons *(statique/HTML)*
- Fichiers de lancement *(statique/HTML)*
- تحيين المعطيات *(NATIVE_FORM)*

**Champs / items (35) :**
- Visibles : `P24_APPROBATION` (Approbation), `P24_AVIS_DE_PRESSE` (Annonce presse), `P24_CRITÈRES` (Critères et Methodologie d'évaluation), `P24_FAX_PRESTATAIRE` (Fax Prestataires), `P24_NOTE_OUVERTURE_PLIS` (Note Ouverture Plis), `P24_PROGRAMME_OUVERTURE_DE_PLIS` (Programme pour lancement), `P24_PROPOSITION_DC_ET_DÉSIGNATION` (Proposition Dc Et Désignation), `P24_PV_CCT` (Pv Cct), `P24_التاريخ__للإعلان_عن_المنافسة` (التاريخ  للإعلان عن المنافسة), `P24_الكلفة_التقديرية__MDT_` (الكلفة التقديرية), `P24_اللجنة_المختصة` (اللجنة المختصة), `P24_المكلف_بالملف` (المكلف بالملف), `P24_تاريخ__لجنة_الصفقات` (تاريخ  لجنة الصفقات), `P24_تاريخ_ارجاع_الضمانات_الوقتية` (تاريخ ارجاع الضمانات الوقتية), `P24_تاريخ_ارجاع_كراسات_الشروط_حسب_المحضر` (تاريخ ارجاع كراسات الشروط حسب المحضر), `P24_تاريخ_ارسال_التقرير_للتقييم_الفني` (تاريخ ارسال التقرير للتقييم الفني), `P24_تاريخ_ارسال_مقترح_تركيبة_لجنة_التقييم` (تاريخ ارسال مقترح تركيبة لجنة التقييم), `P24_تاريخ_امضاء_تقرير_تقييم_العروض` (تاريخ امضاء تقرير تقييم العروض), `P24_تاريخ_تبليغ_الصفقة` (تاريخ تبليغ الصفقة), `P24_تاريخ_تقديم_الملف_للجنة_الشراءات` (تاريخ تقديم الملف للجنة الشراءات), `P24_تاريخ_تقديم_كراسات_الشروط_للمصادقة` (تاريخ تقديم كراسات الشروط للمصادقة), `P24_تاريخ_قرار__لجنة_الصفقات` (تاريخ قرار  لجنة الصفقات), `P24_تاريخ_مصادقة_اللجنة_على_كراسات_الشروط` (تاريخ مصادقة اللجنة على كراسات الشروط), `P24_تاريخ_نشر_نتائج_المنافسة` (تاريخ نشر نتائج المنافسة), `P24_تاريخ_ورود_CPT_ممضاة` (تاريخ ورود Cpt ممضاة), `P24_تاريخ_ورود_تعيين_تركيبة_لجنة_التقييم` (تاريخ ورود تعيين تركيبة لجنة التقييم), `P24_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط` (تاريخ ورود محضر مصادقة اللجنة على كراسات الشروط), `P24_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط2` (تاريخ ورود محضر مصادقة اللجنة على كراسات الشروط2), `P24_طريقة_ابرام_الصفقة` (طريقة ابرام الصفقة), `P24_نوعية_الطلب` (نوعية الطلب)
- Cachés/techniques (5) : `P24_ACCORD_DG`, `P24_ID`, `P24_NB`, `P24_NEW`, `P24_NEW_1`

**Boutons :**
- **avis_de_presse** : Redirige vers une autre page → `f?p=&APP_ID.:8:&SESSION.::&DEBUG.::P8_ID_AVIS,P8_REF_AE:&P24_NEW.,&P24_REF_AO.`
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Close Dialog** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialize form تحيين المعطيات** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form تحيين المعطيات** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 25 — etat avancement
*Alias : `ETAT-AVANCEMENT`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Aucun enregistrement sélectionné *(statique/HTML)*
- Rechercher *(statique/HTML)*
- Sélecteur d'affichage de région *(NATIVE_DISPLAY_SELECTOR)*

**Champs / items (3) :**
- Visibles : `P25_SEARCH` (Rechercher)
- Cachés/techniques (2) : `P25_ID`, `P25_REF`

**Boutons :**
- **CREATE** : Redirige vers une autre page → `f?p=&APP_ID.:10:&APP_SESSION.::&DEBUG.:RP,10::`
- **EDIT** : Redirige vers une autre page → `f?p=&APP_ID.:10:&SESSION.::&DEBUG.:RP,10:P10_ID,P10_REF:&P25_ID.,&P25_REF.`
- **POP_ETAT_AVIS** : Redirige vers une autre page → `f?p=&APP_ID.:8:&SESSION.::&DEBUG.:RP,14:P8_REF_AE:&P25_REF.`
- **POP_Remarque** : Redirige vers une autre page → `f?p=&APP_ID.:27:&SESSION.::&DEBUG.:RP,15:P27_ID_CC,P27_REF_DOS:&P25_ID.,&P25_REF.`
- **RESET** : Redirige vers une autre page → `f?p=&APP_ID.:25:&APP_SESSION.:RESET:&DEBUG.:RP,9::`

**Processus (traitements PL/SQL) :**
- **close dialog** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `Boîte de dialogue affichage fermée`, `Boîte de dialogue demande fermée`, `Boîte de dialogue fermée`, `Effectuez la recherche`

---

## Page 26 — متابع التغيرات
*Alias : `-`*  
*Type de contenu : Page standard*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*

---

## Page 27 — Créer une nouvelle  remarque
*Alias : `-`*  
*Type de contenu : Modal*

**Régions :**
- Remarque *(NATIVE_FORM)*

**Champs / items (4) :**
- Visibles : `P27_REF_DOS` (Ref Dos), `P27_REMARQUE` (Remarque)
- Cachés/techniques (2) : `P27_ID_CC`, `P27_ID_REM`

**Boutons :**
- **New** : Soumet la page (sauvegarde) (INSERT)

**Processus (traitements PL/SQL) :**
- **Initialize form crée remarque** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form New** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 28 — Page d
*Alias : `PAGE-D-ACCUEIL-COPIE`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- APPELS D’OFFFRES en Cours *(NATIVE_CARDS)*
- APPELS D’OFFFRES en Cours *(statique/HTML)*
- Bienvenu *(statique/HTML)*
- Navigation de page *(NATIVE_LIST)*
- New *(TMPL_THEME_42$COMMENTS)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P28_NB`

**Actions dynamiques (JS) :** `Alert_ouverture`, `New`, `refresh2`, `refresh_1`

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL

---

## Page 29 — Remarque
*Alias : `REMARQUE`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P29_REF`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`

---

## Page 30 — suivi des contrats
*Alias : `SUIVI-DES-CONTRATS`*  
*Type de contenu : Interactive Grid*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*
- Rechercher *(statique/HTML)*
- suivi des contrats *(NATIVE_IG)*

**Champs / items (3) :**
- Visibles : `P30_SEARCH` (Rechercher)
- Cachés/techniques (2) : `P30_ID`, `P30_REF`

**Boutons :**
- **EDIT** : Redirige vers une autre page → `f?p=&APP_ID.:10:&SESSION.::&DEBUG.:RP,10:P10_ID,P10_REF:&P30_ID.,&P30_REF.`

**Processus (traitements PL/SQL) :**
- **suivi des contrats - Enregistrer les données de grille interactive** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

---

## Page 31 — Modifier la Remarque
*Alias : `EDIT-REM`*  
*Type de contenu : Modal*

**Régions :**
- Buttons *(statique/HTML)*
- Modifier la Remarque *(NATIVE_FORM)*

**Champs / items (4) :**
- Visibles : `P31_REF_DOS` (Ref Dos), `P31_REMARQUE` (Remarque)
- Cachés/techniques (2) : `P31_ID_CC`, `P31_ID_REM`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **DELETE** : Soumet la page (sauvegarde) (DELETE)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Close Dialog** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialize form edit rem** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form edit rem** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 32 — Gestion des Rappels
*Alias : `GESTION-DES-RAPPELS`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*
- n *(statique/HTML)*
- Notes *(NATIVE_CARDS)*
- Notes2 *(NATIVE_CARDS)*
- Notes_Personnel *(NATIVE_CARDS)*
- Rappel *(statique/HTML)*
- Rappel *(statique/HTML)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P32_ROLE`

**Boutons :**
- **Add_Note** : Redirige vers une autre page → `f?p=&APP_ID.:33:&SESSION.::&DEBUG.:::`
- **CLEANUP_EXPIRED** : Action gérée par Dynamic Action JS

**Processus (traitements PL/SQL) :**
- **CLEANUP_EXPIRED_REMINDERS** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **GET_PENDING_REMINDERS** — PL/SQL personnalisé *(déclenché : ON_DEMAND)*
- **Get_User_Role** — PL/SQL personnalisé *(déclenché : BEFORE_BOX_BODY)*
- **MARK_REMINDER_SENT** — PL/SQL personnalisé *(déclenché : ON_DEMAND)*

**Actions dynamiques (JS) :** `Auto Refresh Cards`, `New_4`, `New_1`, `Nouveau`

---

## Page 33 — edit note
*Alias : `EDIT-NOTE`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Buttons *(statique/HTML)*
- edit note *(NATIVE_FORM)*

**Champs / items (10) :**
- Visibles : `P33_CREATED_ON_1` (Created On), `P33_IMPORTANCE_LEVEL_1` (مستوى أهمية التذكير), `P33_NOTE_DETAILS_1` (نص التذكير), `P33_NOTE_TITLE_1` (موضوع التذكير), `P33_PRE_REMINDER_MINS_1` (الفترة قبل التذكير بالدقائق), `P33_REMINDER_DATETIME_1` (وقت التذكير الرئيسي)
- Cachés/techniques (4) : `P33_ID_1`, `P33_IS_SENT_1`, `P33_LAST_UPDATED_1`, `P33_USER_ID_1`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **DELETE** : Soumet la page (sauvegarde) (DELETE)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Close Dialog** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialize form edit note** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form edit note** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `hide creared on`

---

## Page 34 — جدول الاشغال
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Interactive Grid*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*
- Rechercher *(statique/HTML)*
- جدول الاشغال *(NATIVE_IG)*

**Champs / items (2) :**
- Visibles : `P34_ANNEE` (Année), `P34_SEARCH` (Rechercher)

**Processus (traitements PL/SQL) :**
- **جدول الاشغال - Save Interactive Grid Data** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`

---

## Page 35 — Contrats
*Alias : `CONTRATS`*  
*Type de contenu : Interactive Grid*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- suivi des contrats &P46_NEW. *(NATIVE_IG)*

---

## Page 36 — edit_contrat &P36_N_CONTRAT_BC.
*Alias : `EDIT_CONTRAT`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- edit-contrat *(NATIVE_FORM)*

**Champs / items (38) :**
- Visibles : `P36_CADRE__PONCTUEL` (Cadre  Ponctuel), `P36_DATE_AVIS_JURIDIQUE` (Date Avis Juridique), `P36_DATE_DE_LA_DERNIÈRE_PIÈCE_LÉGALE` (Date De La Dernière Pièce Légale), `P36_DATE_DE_LA_PREMIÈRE_PIÈCE_LÉGALE` (Date De La Première Pièce Légale), `P36_DATE_DE_L_ARCHIVAGE` (Date De L Archivage), `P36_DATE_DE_MAIN_LEVÉE` (Date De Main Levée), `P36_DATE_DE_MISE_VIGUEUR` (Date De Mise Vigueur), `P36_DATE_ENVOI_ADMIN_SIGNATURE` (Date Envoi Admin Signature), `P36_DATE_ENVOI_CLIENT_ENREGISTREMENT` (Date Envoi Client Enregistrement), `P36_DATE_ENVOI_CLIENT_SIGNATURE` (Date Envoi Client Signature), `P36_DATE_FIN_DU_MARCHÉ` (Date Fin Du Marché), `P36_DATE_GARANTIE_FINALE` (Date Garantie Finale), `P36_DATE_LIVRAISON_JURIDIQUE` (Date Livraison Juridique), `P36_DATE_RETOUR_ADMIN_SIGNE` (Date Retour Admin Signe), `P36_DATE_RETOUR_CLIENT_SIGNE` (Date Retour Client Signe), `P36_DATE_RETOUR_ENREGISTRE` (Date Retour Enregistre), `P36_DEMANDEUR` (Demandeur), `P36_DEVISE` (Devise), `P36_ETAT` (Etat), `P36_MONTANT` (Montant), `P36_MONTANT_DE_LA_CAUTION` (Montant De La Caution), `P36_N_CONTRAT_BC` (N Contrat Bc), `P36_N__ARCHIVAGE` (N  Archivage), `P36_N__COMMISSION` (N  Commission), `P36_N__RANG_ARCHIVAGE` (N  Rang Archivage), `P36_OBJET` (Objet), `P36_OBSERVATION` (Observation), `P36_OBSERVATION_` (Observation), `P36_REF_AO` (Ref Ao), `P36_RESPONSABLE` (Responsable), `P36_RESPONSABLE_DOS` (Responsable Dos), `P36_TITULAIRE_DU_MARCHÉ` (Titulaire Du Marché)
- Cachés/techniques (6) : `P36_COL016`, `P36_ETAT_1`, `P36_ETAT_CONT`, `P36_ETAT_CONTRAT`, `P36_ID`, `P36_ID_CC`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **DELETE** : Soumet la page (sauvegarde) (DELETE)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau edit_contrat** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Traiter le panneau edit_contrat** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 37 — redirect
*Alias : `REDIRECT`*  
*Type de contenu : Page standard*

**Régions :**
- New *(statique/HTML)*

**Champs / items (3) :**
- Visibles : `P37_ID` (New), `P37_ID_CC` (Id Cc), `P37_NEW` (New)

**Branches (redirections conditionnelles) :**
- Point BEFORE_COMPUTATION, type REDIRECT_URL

---

## Page 38 — test install
*Alias : `TEST-INSTALL`*  
*Type de contenu : Page standard*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*
- New *(statique/HTML)*

**Boutons :**
- **New** : Redirige vers une autre page → `f?p=&APP_ID.:47:&SESSION.::&DEBUG.:::`

---

## Page 39 — Dossiers En Attente d
*Alias : `DOSSIERS-EN-ATTENTE`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Dossiers En Attente *(NATIVE_CARDS)*

**Actions dynamiques (JS) :** `dialog_close`

---

## Page 40 — Cc
*Alias : `CC2`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- APPEL D’OFFFRES *(NATIVE_FORM)*
- Boutons *(statique/HTML)*
- Dates *(statique/HTML)*
- Fichiers de lancement *(NATIVE_FORM)*
- New *(statique/HTML)*
- rem *(statique/HTML)*
- تحيين المعطيات *(NATIVE_FORM)*
- معلومات أساسية عن الصفقة *(statique/HTML)*

**Champs / items (62) :**
- Visibles : `P40_BUDGET` (التكلفة التقديرية), `P40_CAUTION_P` (Caution Provisoire), `P40_CC_POUR_LANCEMENT` (CC Pour Lancement), `P40_DATE_LC` (التاريخ الإعلان عن المنافسة), `P40_DATE_LIMITE_PROPOSÉE` (آخر أجال تقديم العروض), `P40_DATE_OUVERTURE_DES_PLIS` (تاريخ فتح العروض), `P40_DECISION` (تاريخ قرار لجنة الصفقات), `P40_DÉTAIL_DE_RÉPONSE` (الفترة المحددة لتسليم العروض), `P40_MAIL_PRESTATAIRE` (Mail Prestataire), `P40_NATURE_DE_DEPENSE` (Nature De Depense), `P40_NEW_3` (لا توجد ملاحظات في هذا الملف حاليا), `P40_NOTE_OUVERTURE_PLIS` (Note Ouverture Plis), `P40_OBJET_CCT` (Titre), `P40_STATUS` (Statut), `P40_اللجنة_المختصة` (اللجنة المختصة), `P40_المكلف_بالملف` (المكلف بالملف), `P40_تاريخ_ارجاع_الضمانات_الوقتية` (تاريخ_ارجاع_الضمانات_الوقتي), `P40_طريقة_ابرام_الصفقة` (طريقة ابرام الصفقة), `P40_نوعية_الطلب` (نوعية الطلب)
- Cachés/techniques (43) : `P40_ACORD`, `P40_AVIS_DE_PRESSE`, `P40_CREER_PAR`, `P40_CRITERES_EVALUATION`, `P40_DATE_AVIS81`, `P40_DATE_CC`, `P40_DATE_CRITERES`, `P40_DATE_CRÉATION`, `P40_DATE_DESIGNATION`, `P40_DATE_DE_LANC`, `P40_DATE_MAIL`, `P40_DATE_NOTE_OP`, `P40_DATE_PROGRAM_LANC`, `P40_DATE_PROGRAM_OUVERTURE`, `P40_DATE_PROPOSITION`, `P40_DESIGNATION_DE_LA_COMMISSION`, `P40_ID`, `P40_ID_1`, `P40_ID_2`, `P40_ID_CC`, `P40_JOURS_REST`, `P40_NB`, `P40_NEW_2`, `P40_NEW_NTB`, `P40_PROGRAMME_DE_LANCEMENT`, `P40_PROGRAMME_OUVERTURE_DE_PLIS`, `P40_PROGRAMME_OUVERTURE_DE_PLIS_1`, `P40_PROGRAM_LANC`, `P40_PROPOSITION_COMMISSION`, `P40_PV_CCT`, `P40_تاريخ__لجنة_الصفقات`, `P40_تاريخ_ارجاع_كراسات_الشروط_حسب_المحضر`, `P40_تاريخ_ارسال_التقرير_للتقييم_الفني`, `P40_تاريخ_ارسال_مقترح_تركيبة_لجنة_التقييم`, `P40_تاريخ_امضاء_تقرير_تقييم_العروض`, `P40_تاريخ_تبليغ_الصفقة`, `P40_تاريخ_تقديم_الملف_للجنة_الشراءات`, `P40_تاريخ_تقديم_كراسات_الشروط_للمصادقة`, `P40_تاريخ_نشر_نتائج_المنافسة`, `P40_تاريخ_ورود_CPT_ممضاة`, `P40_تاريخ_ورود_تعيين_تركيبة_لجنة_التقييم`, `P40_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط`, `P40_تاريخ_ورود_محضر_مصادقة_اللجنة_على_كراسات_الشروط2`

**Boutons :**
- **avis_de_presse** : Redirige vers une autre page → `f?p=&APP_ID.:8:&SESSION.::&DEBUG.::P8_REF_AE:&P40_NB.`
- **CANCEL** : Action gérée par Dynamic Action JS
- **New** : Redirige vers une autre page → `f?p=&APP_ID.:29:&SESSION.::&DEBUG.::P29_REF:&P40_ID.`
- **New_1** : Redirige vers une autre page → `f?p=&APP_ID.:27:&SESSION.::&DEBUG.::P27_ID_CC,P27_REF_DOS:&P40_ID.,&P40_NB.`
- **Nouveau** : Redirige vers une autre page → `f?p=&APP_ID.:45:&SESSION.::&DEBUG.:CR,45:P45_ID_CC,P45_REF_AO:&P40_ID.,&P40_NB.`
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)
- **Vew** : Redirige vers une autre page → `f?p=&APP_ID.:9:&SESSION.::&DEBUG.::P9_REF:&P40_NB.`

**Processus (traitements PL/SQL) :**
- **enregistrement des création** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Initialize form Cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Initialize form Cc copie Page 4** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Process form Fichiers de lancement** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau Cc_1** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*
- **Traiter le panneau Cc** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `activation_modif_admin_zone1`, `aff_bouton_contrat`, `affiche REM`, `DA_date de lanc`, `DA_DESIGNATION_DE_LA_COMMISSION`, `DA_MAIL`, `DA_NOTE_OP`, `DA_PROGRAM_LANC`, `DA_PROGRAM_OUVERTURE`, `DA_SET_DATE_AVIS`, `DA_SET_DATE_CC`, `DA_SET_DATE_CRITERES`, `date lancement statut`, `New_2`, `New_3`, `New_1`, `Nouveau`, `proposition`, `PV`

---

## Page 41 — قائمة الصفقات المبرمجة
*Alias : `-`*  
*Type de contenu : Interactive Grid*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*
- Rechercher *(statique/HTML)*
- Search Results *(NATIVE_IG)*

**Champs / items (2) :**
- Visibles : `P41_ANNE` (Plan Prévisionnelle pour L'Année), `P41_SEARCH` (Rechercher)

**Processus (traitements PL/SQL) :**
- **Search Results - Save Interactive Grid Data** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

---

## Page 42 — nouveau Dossier
*Alias : `NOUVEAU_DOSSIER`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- New *(NATIVE_FORM)*

**Champs / items (16) :**
- Visibles : `P42_DR` (رقم الملف), `P42_MESSAGE`, `P42_آجال_الانجاز` (آجال الانجاز), `P42_الكلفة_التقديرية` (الكلفة التقديرية), `P42_اللجنة_المختصة_1` (اللجنة المختصة), `P42_المكلف_بالملف` (المكلف بالملف), `P42_طريقة_ابرام_الصفقة_1` (طريقة ابرام الصفقة), `P42_موضوع_الصفقة` (موضوع الصفقة), `P42_نوعية_الطلب_1` (نوعية الطلب)
- Cachés/techniques (7) : `P42_CREER_PAR`, `P42_ETAT`, `P42_ID_3`, `P42_T`, `P42_الاجراءات`, `P42_التاريخ_نهاية_العقد_الجاري`, `P42_تاريخ_بداية_معالجة_الملف_الجديد`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialize form nouveau cc** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Insert_Into_3_Tables** — PL/SQL personnalisé *(déclenché : ON_SUBMIT_BEFORE_COMPUTATION)*
- **New** — Initialisation de formulaire (chargement des données) *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`

---

## Page 43 — Contrats 2
*Alias : `CONTRATS-2`*  
*Type de contenu : Page standard*

**Régions :**
- Contrats en Cours *(statique/HTML)*
- Rechercher *(NATIVE_SMART_FILTERS)*
- Résultats de la recherche *(NATIVE_CARDS)*

**Champs / items (1) :**
- Visibles : `P43_SEARCH` (Rechercher)

---

## Page 44 — Tableau de bord
*Alias : `TABLEAU-DE-BORD`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Appel d'Offres En Cours *(NATIVE_JET_CHART)*
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Contrats En Cours *(NATIVE_JET_CHART)*
- Notes *(NATIVE_CARDS)*
- Tous Les Appel d'Offres *(NATIVE_JET_CHART)*
- Tous Les Contrats *(NATIVE_JET_CHART)*

**Actions dynamiques (JS) :** `Nouveau_1`, `Nouveau`, `Nouveau_1_1`, `Nouveau_1_1_1`

---

## Page 45 — AJOUT CONTRAT
*Alias : `AJOUT-CONTRAT`*  
*Type de contenu : Dynamic Actions, Interactive Grid, Modal*

**Régions :**
- AJOUT CONTRAT *(NATIVE_IG)*
- تذكير *(statique/HTML)*

**Champs / items (2) :**
- Cachés/techniques (2) : `P45_ID_CC`, `P45_REF_AO`

**Boutons :**
- **exit** : Soumet la page (sauvegarde) (INSERT)

**Processus (traitements PL/SQL) :**
- **AJOUT CONTRAT - Enregistrer les données de grille interactive** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*
- **Close** — Fermeture de fenêtre modale *(déclenché : ON_SUBMIT_BEFORE_COMPUTATION)*

**Actions dynamiques (JS) :** `Nouveau`, `Nouveau_1`

---

## Page 46 — Suivi des Contrats
*Alias : `CONTRAT-EN-FONCTION-D-ETAT`*  
*Type de contenu : Interactive Grid, Modal*

**Régions :**
- Nouveau *(statique/HTML)*
- suivi des contrats &P46_NEW. *(NATIVE_IG)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P46_NEW`

**Processus (traitements PL/SQL) :**
- **contrat en fonction d'etat - Enregistrer les données de grille interactive** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

---

## Page 47 — Congé
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Form *(NATIVE_FORM)*
- SOLDE *(statique/HTML)*
- TITRE *(statique/HTML)*

**Champs / items (17) :**
- Visibles : `P47_ADRESSE_CONGE` (Adresse Conge), `P47_DATE_DEBUT` (Date Debut), `P47_DATE_DEMANDE` (Date Demande), `P47_DATE_FIN` (Date Fin), `P47_FONCTION` (Fonction), `P47_NBR_FERIES` (Nbr Feries), `P47_TELEPHONE` (Telephone), `P47_TYPE_CONGE` (Type Conge)
- Cachés/techniques (9) : `P47_CONGE_ID`, `P47_ID_SOL`, `P47_MATRICULE`, `P47_NBR_JOURS`, `P47_NOM_PRENOM`, `P47_SERVICE`, `P47_SOLDE_APRES`, `P47_SOLDE_AVANT`, `P47_STATUT`

**Boutons :**
- **Nouveau** : Redirige vers une autre page → `f?p=&APP_ID.:50:&SESSION.::&DEBUG.::P50_MATRICULE,P50_ID_SOLDE:&P0_MAT.,&P47_ID_SOL.`

**Processus (traitements PL/SQL) :**
- **close** — Fermeture de fenêtre modale *(déclenché : ON_SUBMIT_BEFORE_COMPUTATION)*
- **Initialiser le panneau heur** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **SAVE_CONGE** — PL/SQL personnalisé *(déclenché : ON_DEMAND)*

**Actions dynamiques (JS) :** `Nouveau`, `Nouveau`, `Nouveau_1`, `Nouveau_3`, `Nouveau_2`

---

## Page 48 — heur sup
*Alias : `HEUR-SUP`*  
*Type de contenu : Dynamic Actions, Interactive Grid*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Nouveau *(NATIVE_IG)*
- المجمع الكيميائي التونسي *(statique/HTML)*

**Champs / items (2) :**
- Visibles : `P48_NEW`, `P48_PERIODE` (Nouveau)

**Processus (traitements PL/SQL) :**
- **Nouveau** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `ajout_deux_point_bebut_fin`, `Cal_nbr_h`, `Nouveau`, `Nouveau_3`

---

## Page 49 — Suivi des Dossiers
*Alias : `SUIVI-DES-DOSSIERS`*  
*Type de contenu : Dynamic Actions, Interactive Grid, Modal*

**Régions :**
- Nouveau *(statique/HTML)*
- suivi des Dossiers *(NATIVE_IG)*

**Champs / items (2) :**
- Cachés/techniques (2) : `P49_NEW`, `P49_NEW_1`

**Processus (traitements PL/SQL) :**
- **contrat en fonction d'etat - Enregistrer les données de grille interactive** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `New`

---

## Page 50 — solde
*Alias : `SOLDE`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- solde *(NATIVE_FORM)*

**Champs / items (3) :**
- Visibles : `P50_SOLDE` (Solde)
- Cachés/techniques (2) : `P50_ID_SOLDE`, `P50_MATRICULE`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **DELETE** : Soumet la page (sauvegarde) (DELETE)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau solde** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*
- **Traiter le panneau solde** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 51 — Mes Congés
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Interactive Grid*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Mes Congés *(NATIVE_IG)*
- Nouveau *(statique/HTML)*
- Nouveau *(statique/HTML)*

**Boutons :**
- **Nouveau** : Redirige vers une autre page → `f?p=&APP_ID.:47:&SESSION.::&DEBUG.:::`

**Processus (traitements PL/SQL) :**
- **Mes Congés - Enregistrer les données de grille interactive** — NATIVE_IG_DML *(déclenché : AFTER_SUBMIT)*

**Actions dynamiques (JS) :** `Nouveau`

---

## Page 52 — Congé
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Nouveau *(NATIVE_FORM)*
- TITRE *(statique/HTML)*

**Champs / items (16) :**
- Visibles : `P52_ADRESSE_CONGE` (Adresse Conge), `P52_DATE_DEBUT` (Date Debut), `P52_DATE_DEMANDE` (Date Demande), `P52_DATE_FIN` (Date Fin), `P52_FONCTION` (Fonction), `P52_NBR_FERIES` (Nbr Feries), `P52_SOLDE_AVANT` (SOLDE_AVANT), `P52_TELEPHONE` (Telephone), `P52_TYPE_CONGE` (Type Conge)
- Cachés/techniques (7) : `P52_CONGE_ID`, `P52_MATRICULE`, `P52_NBR_JOURS`, `P52_NOM_PRENOM`, `P52_SERVICE`, `P52_SOLDE_APRES`, `P52_STATUT`

**Processus (traitements PL/SQL) :**
- **Initialiser le panneau heur** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*

**Actions dynamiques (JS) :** `Nouveau`, `Nouveau_3`

---

## Page 53 — classement
*Alias : `CLASSEMENT`*  
*Type de contenu : Page standard*

**Régions :**
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Nouveau *(statique/HTML)*

**Champs / items (2) :**
- Cachés/techniques (2) : `P53_OBJET`, `P53_REF`

---

## Page 54 — imprim_Congé
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Nouveau *(NATIVE_FORM)*
- TITRE *(statique/HTML)*

**Champs / items (17) :**
- Cachés/techniques (17) : `P54_ADRESSE_CONGE`, `P54_CONGE_ID`, `P54_DATE_DEBUT`, `P54_DATE_DEMANDE`, `P54_DATE_FIN`, `P54_FONCTION`, `P54_MATRICULE`, `P54_NBR_FERIES`, `P54_NBR_JOURS`, `P54_NEW`, `P54_NOM_PRENOM`, `P54_SERVICE`, `P54_SOLDE_APRES`, `P54_SOLDE_AVANT`, `P54_STATUT`, `P54_TELEPHONE`, `P54_TYPE_CONGE`

**Processus (traitements PL/SQL) :**
- **close** — Fermeture de fenêtre modale *(déclenché : ON_SUBMIT_BEFORE_COMPUTATION)*
- **Initialiser le panneau heur** — Initialisation de formulaire (chargement des données) *(déclenché : BEFORE_HEADER)*

**Actions dynamiques (JS) :** `Nouveau_3`

---

## Page 55 — Programme d’Ouverture des Offres
*Alias : `PROGRAMME-D-OUVERTURE-DES-OFFRES1`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Nouveau *(NATIVE_CARDS)*
- Nouveau *(statique/HTML)*

**Champs / items (9) :**
- Visibles : `P55_DATE_JOUR` (Date), `P55_MOTIF` (Motif de Report), `P55_NEW` (Approbation Cahier des Charges), `P55_TYPE` (Type du document)
- Cachés/techniques (5) : `P55_COMMI`, `P55_MOTIF_RE`, `P55_REF`, `P55_SUITE_INTRO`, `P55_TEXT_INTRO`

**Boutons :**
- **DOWNLOAD_DOCX** : Action gérée par Dynamic Action JS
- **Imprimer** : Action gérée par Dynamic Action JS

**Actions dynamiques (JS) :** `Nouveau_1`, `Nouveau_3`, `Nouveau_4`, `Nouveau_5`

---


# PARTIE 2 — Pages d'administration standard APEX (9999+)

*Ces pages sont générées automatiquement par Oracle APEX lors de la création de l'application (module "Administration"). Elles ne contiennent pas de logique métier spécifique.*

## Page 9999 — Cc - Connexion
*Alias : `LOGIN`*  
*Type de contenu : Page standard*

**Régions :**
- Connexion *(statique/HTML)*

**Champs / items (4) :**
- Visibles : `P9999_PASSWORD` (Mot de passe), `P9999_PERSISTENT_AUTH` (Se souvenir de moi), `P9999_REMEMBER` (Mémoriser le nom utilisateur), `P9999_USERNAME` (Nom Utilisateur)

**Boutons :**
- **LOGIN** : Soumet la page (sauvegarde)

**Processus (traitements PL/SQL) :**
- **Définir le cookie de nom utilisateur** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Effacer le cache des pages** — NATIVE_SESSION_STATE *(déclenché : AFTER_SUBMIT)*
- **Login** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Obtenir le cookie de nom utilisateur** — PL/SQL personnalisé *(déclenché : BEFORE_HEADER)*

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL
- Point BEFORE_COMPUTATION, type REDIRECT_URL

---

## Page 10000 — Administration
*Alias : `ADMIN`*  
*Type de contenu : Dynamic Actions, Interactive Grid*

**Régions :**
- Actions de contrôle d'accès *(NATIVE_LIST)*
- Chemin de navigation *(NATIVE_BREADCRUMB)*
- Colonne 1 *(statique/HTML)*
- Colonne 2 *(statique/HTML)*
- Configuration *(NATIVE_LIST)*
- connected *(TMPL_THEME_42$COMMENTS)*
- connected *(NATIVE_IG)*
- Contrôle d'accès *(statique/HTML)*
- Etats d'activité *(NATIVE_LIST)*
- Informations en retour *(statique/HTML)*
- Informations en retour *(NATIVE_LIST)*
- Informations sur la liste de contrôle d'accès *(NATIVE_PLSQL)*
- Interface utilisateur *(NATIVE_LIST)*

**Boutons :**
- **ADD_USER** : Redirige vers une autre page → `f?p=&APP_ID.:10042:&SESSION.::&DEBUG.:RP,10042::`

**Actions dynamiques (JS) :** `New_1`, `New`, `Régénérer l'état`

---

## Page 10002 — chargement des données
*Alias : `T`*  
*Type de contenu : Dynamic Actions*

**Régions :**
- Breadcrumb *(NATIVE_BREADCRUMB)*

**Actions dynamiques (JS) :** `New`

---

## Page 10010 — Options de configuration
*Alias : `OPTIONS-DE-CONFIGURATION`*  
*Type de contenu : Interactive Report, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Options de configuration *(NATIVE_IR)*

**Boutons :**
- **APPLY_CHANGES** : Soumet la page (sauvegarde)
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

**Processus (traitements PL/SQL) :**
- **Mettre à jour** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL

---

## Page 10020 — Apparence de l
*Alias : `APPARENCE-DE-L-APPLICATION`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Configurer l'apparence *(statique/HTML)*

**Champs / items (2) :**
- Visibles : `P10020_DESKTOP_THEME_STYLE_ID` (Style de thème du bureau), `P10020_END_USER_STYLE` (Préférence de thème de l'utilisateur final)

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **SAVE** : Soumet la page (sauvegarde)

**Processus (traitements PL/SQL) :**
- **Enregistrer la préférence de style de l'utilisateur final** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Enregistrer le style de thème** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL

---

## Page 10030 — Tableau de bord des activités
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Evénements de la page Horaire *(NATIVE_JET_CHART)*
- Filtres *(statique/HTML)*
- Pages les plus actives *(NATIVE_JET_CHART)*
- Principaux utilisateurs *(NATIVE_JET_CHART)*

**Champs / items (1) :**
- Visibles : `P10030_TIMEFRAME` (Tranche de temps)

**Boutons :**
- **VIEW_ACTIVITY_BY_USER** : Redirige vers une autre page → `f?p=&APP_ID.:10031:&SESSION.::&DEBUG.:RP,10031::`
- **VIEW_ACTIVITY_BY_USER** : Redirige vers une autre page → `f?p=&APP_ID.:10031:&SESSION.::&DEBUG.:RP,10031::`
- **VIEW_ACTIVITY_DETAILS** : Redirige vers une autre page → `f?p=&APP_ID.:10034:&SESSION.::&DEBUG.:RP,10034::`
- **VIEW_RECENT_ERRORS** : Redirige vers une autre page → `f?p=&APP_ID.:10032:&SESSION.::&DEBUG.:RP,10032::`

**Actions dynamiques (JS) :** `Modifier les filtres`

---

## Page 10031 — Principaux utilisateurs
*Alias : `PRINCIPAUX-UTILISATEURS`*  
*Type de contenu : Dynamic Actions, Interactive Report, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Graphique des principaux utilisateurs *(NATIVE_JET_CHART)*
- Principaux utilisateurs *(NATIVE_IR)*

**Champs / items (2) :**
- Visibles : `P10031_TIMEFRAME` (Tranche de temps), `P10031_VIEW_AS` (Visualiser comme)

**Boutons :**
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

**Actions dynamiques (JS) :** `Régénérer l'état`

---

## Page 10032 — Journal des erreurs de l
*Alias : `JOURNAL-DES-ERREURS-DE-L-APPLICATION`*  
*Type de contenu : Interactive Report, Modal*

**Régions :**
- Journal des erreurs de l'application *(NATIVE_IR)*

**Boutons :**
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

---

## Page 10033 — Performances de page
*Alias : `PERFORMANCES-DE-PAGE`*  
*Type de contenu : Dynamic Actions, Interactive Report, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Performances de page *(NATIVE_IR)*

**Champs / items (1) :**
- Visibles : `P10033_TIMEFRAME` (Tranche de temps)

**Boutons :**
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

**Actions dynamiques (JS) :** `Régénérer l'état`

---

## Page 10034 — Vues de page
*Alias : `VUES-DE-PAGE`*  
*Type de contenu : Dynamic Actions, Interactive Report, Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Vues de page *(NATIVE_IR)*

**Champs / items (1) :**
- Visibles : `P10034_TIMEFRAME` (Tranche de temps)

**Boutons :**
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

**Actions dynamiques (JS) :** `Régénérer l'état`

---

## Page 10035 — Journal des automatisations
*Alias : `JOURNAL-DES-AUTOMATISATIONS`*  
*Type de contenu : Interactive Report, Modal*

**Régions :**
- Journal des automatisations *(NATIVE_IR)*

**Boutons :**
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

---

## Page 10036 — Messages de journalisation
*Alias : `MESSAGES-DE-JOURNALISATION`*  
*Type de contenu : Modal*

**Régions :**
- Exécution d'automatisation *(statique/HTML)*

**Champs / items (4) :**
- Visibles : `P10036_AUTOMATION_NAME` (Automatisation), `P10036_START_TIMESTAMP` (Démarré), `P10036_STATUS` (Statut)
- Cachés/techniques (1) : `P10036_LOG_ID`

**Processus (traitements PL/SQL) :**
- **Obtenir les détails du journal** — PL/SQL personnalisé *(déclenché : BEFORE_HEADER)*

---

## Page 10040 — (sans titre)
*Alias : `-`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Configuration du contrôle d'accès *(statique/HTML)*

**Champs / items (1) :**
- Visibles : `P10040_ALLOW_OTHER_USERS` (Tous les utilisateurs authentifiés peuvent accéder à cette application)

**Boutons :**
- **APPLY_CHANGES** : Soumet la page (sauvegarde)
- **CANCEL** : Action gérée par Dynamic Action JS

**Processus (traitements PL/SQL) :**
- **Définir le contrôle d'accès** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL

---

## Page 10041 — (sans titre)
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Interactive Report, Modal*

**Régions :**
- Gérer l'accès utilisateur *(NATIVE_IR)*

**Boutons :**
- **ADD_MULTIPLE_USERS** : Redirige vers une autre page → `f?p=&APP_ID.:10043:&SESSION.::&DEBUG.:10043::`
- **ADD_USER** : Redirige vers une autre page → `f?p=&APP_ID.:10042:&SESSION.::&DEBUG.:10042`
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

**Actions dynamiques (JS) :** `Régénérer l'état`

---

## Page 10042 — (sans titre)
*Alias : `USER_ACCESS`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Panneau sur Gérer l'accès utilisateur *(NATIVE_FORM)*

**Champs / items (4) :**
- Visibles : `P10042_APPLICATION_ID` (New), `P10042_ID` (New), `P10042_ROLE_IDS` (Rôles), `P10042_USER_NAME` (Nom utilisateur)

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **CREATE** : Soumet la page (sauvegarde) (INSERT)
- **DELETE** : Soumet la page (sauvegarde) (DELETE)
- **SAVE** : Soumet la page (sauvegarde) (UPDATE)

**Processus (traitements PL/SQL) :**
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Initialiser le panneau Gérer l'accès utilisateur** — Initialisation de formulaire (chargement des données) *(déclenché : AFTER_HEADER)*
- **Traiter le panneau Gérer l'accès utilisateur** — Traitement du formulaire (INSERT/UPDATE/DELETE) *(déclenché : AFTER_SUBMIT)*

---

## Page 10043 — Ajouter plusieurs utilisateurs
*Alias : `AJOUTER-PLUSIEURS-UTILISATEURS-ETAPE-1`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Conteneur d'assistant *(statique/HTML)*

**Champs / items (3) :**
- Visibles : `P10043_PRELIM_USERS` (Noms utilisateur), `P10043_ROLE` (Rôles), `P10043_USERNAME_FORMAT` (Format de nom utilisateur)

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **NEXT** : Soumet la page (sauvegarde)

**Processus (traitements PL/SQL) :**
- **Créer des collections** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL

---

## Page 10044 — Ajouter plusieurs utilisateurs
*Alias : `AJOUTER-PLUSIEURS-UTILISATEURS-ETAPE-2`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Conteneur d'assistant *(statique/HTML)*
- Eléments masqués *(statique/HTML)*
- Il existe des utilisateurs valides - Infos sur la page *(NATIVE_PLSQL)*
- Il n'existe aucun utilisateur valide - Infos sur la page *(statique/HTML)*
- &P10044_VALID_COUNT. utilisateurs à ajouter *(NATIVE_JQM_LIST_VIEW)*

**Champs / items (3) :**
- Cachés/techniques (3) : `P10044_INVALID_COUNT`, `P10044_ROLE`, `P10044_VALID_COUNT`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **PREVIOUS** : Redirige vers une URL → `javascript:history.back();`
- **SUBMIT** : Soumet la page (sauvegarde)

**Processus (traitements PL/SQL) :**
- **Ajouter des utilisateurs à la liste de contrôle d'accès** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*

---

## Page 10050 — Informations en retour
*Alias : `INFORMATIONS-EN-RETOUR`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Panneau sur Informations en retour *(statique/HTML)*

**Champs / items (5) :**
- Visibles : `P10050_FEEDBACK` (Informations en retour), `P10050_RATING` (Expérience)
- Cachés/techniques (3) : `P10050_APPLICATION_ID`, `P10050_PAGE_ID`, `P10050_USER_AGENT`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **SUBMIT** : Soumet la page (sauvegarde)

**Processus (traitements PL/SQL) :**
- **Soumettre les informations en retour** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*

**Branches (redirections conditionnelles) :**
- Point AFTER_PROCESSING, type REDIRECT_URL

---

## Page 10051 — Informations en retour soumises
*Alias : `INFORMATIONS-EN-RETOUR-SOUMISES`*  
*Type de contenu : Modal*

**Régions :**
- Informations en retour soumises *(statique/HTML)*

**Boutons :**
- **CLOSE** : Action gérée par Dynamic Action JS

---

## Page 10053 — Gérer les informations en retour
*Alias : `-`*  
*Type de contenu : Dynamic Actions, Interactive Report, Modal*

**Régions :**
- Gérer les informations en retour *(NATIVE_IR)*

**Boutons :**
- **RESET_REPORT** : Redirige vers une autre page → `f?p=&APP_ID.:&APP_PAGE_ID.:&SESSION.::&DEBUG.:&APP_PAGE_ID.,RR::`

**Actions dynamiques (JS) :** `Régénérer l'état`

---

## Page 10054 — Informations en retour
*Alias : `INFORMATIONS-EN-RETOUR1`*  
*Type de contenu : Modal*

**Régions :**
- Boutons *(statique/HTML)*
- Région d'élément de panneau *(statique/HTML)*

**Champs / items (8) :**
- Visibles : `P10054_FEEDBACK` (Informations en retour), `P10054_FEEDBACK_STATUS` (Statut), `P10054_FILED` (Enregistré), `P10054_PAGE_ID` (Page), `P10054_RATING_ICON` (Evaluation), `P10054_RESPONSE` (Réponse), `P10054_USER_AGENT` (Agent utilisateur)
- Cachés/techniques (1) : `P10054_ID`

**Boutons :**
- **CANCEL** : Action gérée par Dynamic Action JS
- **DELETE** : Soumet la page (sauvegarde) (DELETE)
- **SAVE** : Soumet la page (sauvegarde)

**Processus (traitements PL/SQL) :**
- **Charger les données** — PL/SQL personnalisé *(déclenché : AFTER_HEADER)*
- **Effacer le cache des pages** — NATIVE_SESSION_STATE *(déclenché : AFTER_SUBMIT)*
- **Fermer la boîte de dialogue** — Fermeture de fenêtre modale *(déclenché : AFTER_SUBMIT)*
- **Répondre aux informations en retour** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Supprimer les informations en retour** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*

---

## Page 10060 — A propos de
*Alias : `HELP`*  
*Type de contenu : Page standard*

**Régions :**
- A propos de la page *(statique/HTML)*

---

## Page 10061 — Aide
*Alias : `PAGE_HELP`*  
*Type de contenu : Modal*

**Régions :**
- Dialogue de recherche *(NATIVE_PLSQL)*

**Champs / items (1) :**
- Cachés/techniques (1) : `P10061_PAGE_ID`

---

## Page 10071 — Modification du mot de passe
*Alias : `MODIFIER`*  
*Type de contenu : Page standard*

**Régions :**
- Cc - Connexion *(statique/HTML)*

**Champs / items (3) :**
- Visibles : `P10071_PASSWORD` (Mot de passe), `P10071_REMEMBER` (Mémoriser le nom utilisateur), `P10071_USERNAME` (Nom utilisateur)

**Boutons :**
- **LOGIN** : Soumet la page (sauvegarde)

**Processus (traitements PL/SQL) :**
- **Définir le cookie de nom utilisateur** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Effacer le cache des pages** — NATIVE_SESSION_STATE *(déclenché : AFTER_SUBMIT)*
- **Login** — PL/SQL personnalisé *(déclenché : AFTER_SUBMIT)*
- **Obtenir le cookie de nom utilisateur** — PL/SQL personnalisé *(déclenché : BEFORE_HEADER)*

---

## Page 20000 — Settings
*Alias : `SETTINGS`*  
*Type de contenu : Modal*

**Régions :**
- &APP_USER. *(statique/HTML)*
- &APP_USER. *(NATIVE_CARDS)*
- Settings *(NATIVE_LIST)*

---

## Page 20010 — Settings - Push Notifications
*Alias : `PUSH-NOTIFICATIONS`*  
*Type de contenu : Dynamic Actions, Modal*

**Régions :**
- Push Notifications *(statique/HTML)*
- Push Notifications Not Supported *(statique/HTML)*

**Champs / items (1) :**
- Visibles : `P20010_ENABLE_PUSH` (Enable push notifications on this device)

**Boutons :**
- **BACK** : Redirige vers une autre page → `f?p=&APP_ID.:20000:&APP_SESSION.::&DEBUG.:::`

**Actions dynamiques (JS) :** `Change P20010_ENABLE_PUSH`

---
