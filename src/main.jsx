import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, ArrowDown, ArrowUp, Bell, CalendarClock, CalendarDays, Check, CheckCheck, ChevronDown, CircleHelp, ClipboardList, FilePlus2, Files, LayoutDashboard, LogOut, Menu, Printer, Search, Settings2, ShieldCheck, Trash2, UserPlus, Users, X } from 'lucide-react';
import './styles.css';
import './admin.css';
import './leave.css';
import './workflow.css';
import './profile.css';
import { DEFAULT_SELECT_OPTIONS } from '../select-options.js';

const navItems = [
  { label: 'Tableau de bord', icon: LayoutDashboard, key: 'dashboard' },
  { label: 'Dossiers', icon: ClipboardList, key: 'dossiers' },
  { label: 'Appels d’offres', icon: Files, key: 'appels' },
  { label: 'Contrats', icon: Files, key: 'contrats' },
  { label: 'Calendrier', icon: CalendarDays, key: 'calendar' },
  { label: 'Suivi des modifications', icon: Activity, key: 'audit' },
  { label: 'Administration utilisateurs', icon: Users, key: 'users' }
  , { label: 'Mes Congés', icon: CalendarDays, key: 'leaves' }
  , { label: 'Mes rappels', icon: CalendarClock, key: 'reminders' }
  , { label: 'Mon profil', icon: Settings2, key: 'profile' }
];

const CONFIGURABLE_SELECTS = [
  { key: 'procurementStatuses', label: 'Statuts des dossiers', arabic: 'حالات الملفات' },
  { key: 'expenseNatures', label: 'Natures de dépense', arabic: 'أنواع المصاريف' },
  { key: 'orderNatures', label: 'Natures de commande', arabic: 'أنواع الطلبات' },
  { key: 'procurementModes', label: 'Modes de passation', arabic: 'طرق إبرام الصفقات' },
  { key: 'commissions', label: 'Commissions compétentes', arabic: 'اللجان المختصة' },
  { key: 'workflowSteps', label: 'Étapes de suivi', arabic: 'مراحل المتابعة' }
];
const statusClass = {
  'À lancer': 'amber',
  'Préparation AO': 'rose',
  'AO lancée': 'blue',
  'Évaluation': 'teal',
  'Décision commission': 'amber',
  Attribué: 'blue',
  'Contrat signé': 'teal',
  Exécution: 'teal',
  Clôturé: 'gray'
};

function normalizeReference(value) {
  return String(value ?? '').trim().toUpperCase();
}

function text(language, french, arabic) {
  return language === 'ar' ? arabic : french;
}

const LanguageContext = createContext('fr');
const SelectOptionsContext = createContext(DEFAULT_SELECT_OPTIONS);

function buildDossierDetail(dossier, users = []) {
  if (!dossier) return null;
  const assignee = users.find((user) => Number(user.id) === Number(dossier.assigned_to)) || null;
  const defaultHistory = [
    { id: 1, label: 'Dossier créé', date: dossier.date || new Date().toISOString().slice(0, 10), actor: dossier.owner || 'Système', note: 'Le dossier a été enregistré et transmis au responsable.' },
    { id: 2, label: 'Analyse initiale', date: dossier.date || new Date().toISOString().slice(0, 10), actor: assignee?.name || dossier.owner || 'Chef de projet', note: 'Vérification du besoin et validation de la cible.' },
    { id: 3, label: 'Étude de faisabilité', date: dossier.date || new Date().toISOString().slice(0, 10), actor: assignee?.name || dossier.owner || 'Equipe technique', note: 'Contrôle de la conformité et préparation du dossier d’appel d’offres.' }
  ];
  const defaultAttachments = [
    { id: 1, name: 'Cahier des charges.pdf', type: 'PDF', size: '1.6 Mo', uploadedAt: dossier.date || new Date().toISOString().slice(0, 10) },
    { id: 2, name: 'Devis initial.xlsx', type: 'XLSX', size: '842 KB', uploadedAt: dossier.date || new Date().toISOString().slice(0, 10) }
  ];
  return {
    ...dossier,
    assignedUser: assignee?.name || dossier.owner || 'Non attribué',
    nature: dossier.nature || 'Marché public',
    description: dossier.description || 'Ce dossier est en cours de suivi. Le chef de projet vérifie la conformité, le plan de passation et les pièces justificatives avant validation.',
    history: Array.isArray(dossier.history) && dossier.history.length ? dossier.history : defaultHistory,
    attachments: Array.isArray(dossier.attachments) && dossier.attachments.length ? dossier.attachments : defaultAttachments
  };
}

function canManageDossiers(role) {
  return role === 'ADMINISTRATOR' || role === 'CONTRIBUTOR';
}

function App() {
  const [page, setPage] = useState('dashboard');
  const [language, setLanguage] = useState(() => typeof window !== 'undefined' && window.localStorage.getItem('agp-language') === 'ar' ? 'ar' : 'fr');
  const [dossiers, setDossiers] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: '', matricule: '', function: '', role: 'READER' });
  const [signedIn, setSignedIn] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, contracts: 0, reminders: 0, budget: 0 });
  const [selectOptions, setSelectOptions] = useState(DEFAULT_SELECT_OPTIONS);
  const [selectOptionsReady, setSelectOptionsReady] = useState(false);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveDays, setLeaveDays] = useState(0);
  const [notice, setNotice] = useState(null);
  const [selectedDossier, setSelectedDossier] = useState(null);

  function notify(message, tone = 'info') {
    setNotice({ message, tone });
    if (typeof window !== 'undefined') {
      window.clearTimeout(notify.timeoutId);
      notify.timeoutId = window.setTimeout(() => setNotice(null), 4000);
    }
  }

  async function fetchJson(url, options = {}) {
    const requestOptions = { credentials: 'include', ...options };

    try {
      const response = await fetch(url, requestOptions);
      const text = await response.text();

      if (!text) {
        if (!response.ok) throw new Error('Le serveur de données est indisponible.');
        return null;
      }

      let payload;
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error('Le service de données a renvoyé une réponse invalide.');
      }

      if (!response.ok) {
        throw new Error(payload?.error || 'Requête refusée.');
      }

      return payload;
    } catch (error) {
      throw new Error(error?.message || 'Failed to fetch');
    }
  }

  function saveSelectOptions(options) {
    return fetchJson('/api/select-options', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options)
    }).then((options) => {
      setSelectOptions(options);
      return options;
    });
  }

  useEffect(() => {
    fetchJson('/api/me')
      .then((user) => { setCurrentUser(user); setSignedIn(true); })
      .catch(() => setSignedIn(false));
  }, []);

  useEffect(() => {
    if (!signedIn) return;

    Promise.all([
      fetchJson('/api/dossiers'),
      fetchJson('/api/stats'),
      fetchJson('/api/tables/contrats'),
      currentUser.role === 'ADMINISTRATOR' ? fetchJson('/api/users') : Promise.resolve([]),
      fetchJson('/api/my-leaves'),
      fetchJson('/api/select-options')
    ])
      .then(([items, summary, contractItems, userItems, leaveItems, options]) => {
        setDossiers(items);
        setStats(summary);
        setContrats(contractItems);
        setUsers(userItems);
        setLeaves(leaveItems);
        setSelectOptions(options);
      })
      .catch((error) => {
        if (error.message.includes('Session expirée')) setSignedIn(false);
        else notify(error.message, 'error');
      })
      .finally(() => setSelectOptionsReady(true));
  }, [signedIn, currentUser.role]);

  const isAdmin = currentUser.role === 'ADMINISTRATOR';
  const visibleNavItems = navItems.filter((item) => item.key !== 'users' || isAdmin);
  const filtered = dossiers.filter((item) => `${item.reference} ${item.title} ${item.owner} ${item.status}`.toLowerCase().includes(query.toLowerCase()));
  const title = page === 'settings' ? text(language, 'Paramètres', 'الإعدادات') : page === 'help' ? text(language, 'Centre d’aide', 'مركز المساعدة') : page === 'dossier-detail' ? 'Détail du dossier' : page === 'dashboard-dossiers' ? 'Dossiers suivis' : page === 'dashboard-actifs' ? 'Dossiers actifs' : page === 'dashboard-contracts' ? 'Contrats en cours' : page === 'dashboard-reminders' ? 'Rappels à traiter' : navItems.find((item) => item.key === page)?.label || 'Tableau de bord';

  useEffect(() => {
    window.localStorage.setItem('agp-language', language);
  }, [language]);

  useEffect(() => {
    if (page === 'users' && !isAdmin) {
      setPage('dashboard');
    }
  }, [page, isAdmin]);

  function openDossierDetail(id) {
    fetchJson(`/api/dossiers/${id}`)
      .then((dossier) => {
        setSelectedDossier(dossier);
        setPage('dossier-detail');
      })
      .catch((error) => notify(error.message, 'error'));
  }

  function openNotification(notification) {
    const link = String(notification.link || '').replace(/^\/+/, '');
    if (navItems.some((item) => item.key === link) || ['dashboard', 'settings', 'help', 'profile'].includes(link)) {
      setPage(link);
      return;
    }
    const dossierMatch = link.match(/^dossiers\/(\d+)$/);
    if (dossierMatch) openDossierDetail(dossierMatch[1]);
  }

  if (signedIn === null) return null;
  if (!signedIn) return <LoginView error={loginError} onLogin={(user) => { setCurrentUser(user); setSignedIn(true); setLoginError(''); }} onError={setLoginError} />;

  function createDossier(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      reference: normalizeReference(form.get('reference')),
      title: form.get('title'),
      assigned_to: Number(form.get('assigned_to')),
      budget: Number(form.get('budget')),
      date: form.get('date'),
      nature_depense: form.get('nature_depense'),
      mode_passation: form.get('mode_passation'),
      nature_commande: form.get('nature_commande'),
      commission: form.get('commission'),
      status: form.get('status'),
      description: form.get('description')
    };
    fetch('/api/dossiers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Création du dossier impossible.');
        return result;
      })
      .then((item) => { setDossiers((current) => [item, ...current]); setShowForm(false); setPage('appels'); notify(text(language, 'Dossier créé avec succès.', 'تم إنشاء الملف بنجاح.'), 'success'); })
      .catch((error) => notify(error.message, 'error'));
  }

  function createLeave(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateStart = form.get('dateStart');
    const dateEnd = form.get('dateEnd');
    const holidays = Math.max(0, Math.trunc(Number(form.get('holidays') || 0)));
    const numberOfDays = calculateLeaveDays(dateStart, dateEnd);
    const payload = { type: form.get('type'), requestDate: form.get('requestDate'), dateStart, dateEnd, holidays, address: form.get('address'), numberOfDays };
    fetch('/api/my-leaves', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Création impossible.'); return result; })
      .then((item) => { setLeaves((current) => [item, ...current]); setCurrentUser((user) => ({ ...user, leave_balance: item.SOLDE_APRES })); setShowLeaveForm(false); setLeaveDays(0); notify('Demande de congé créée et validée automatiquement.', 'success'); })
      .catch((error) => notify(error.message, 'error'));
  }

  function updateLeaveDays(event) {
    const form = event.currentTarget.form;
    setLeaveDays(calculateLeaveDays(form.dateStart.value, form.dateEnd.value));
  }

  return <LanguageContext.Provider value={language}><SelectOptionsContext.Provider value={selectOptions}><div className="app-shell" dir={language === 'ar' ? 'rtl' : 'ltr'}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">A</div><div><strong>AGP</strong><span>Suivi des dossiers</span></div></div>
      <div className="workspace-label">{text(language, 'ESPACE DE TRAVAIL', 'مساحة العمل')}</div>
      <nav>{visibleNavItems.map(({ label, icon: Icon, key }) => <button key={key} className={page === key ? 'nav-item active' : 'nav-item'} onClick={() => setPage(key)}><Icon size={18} /><span>{text(language, label, ({ 'Tableau de bord': 'لوحة القيادة', Dossiers: 'الملفات', "Appels d’offres": 'طلبات العروض', Contrats: 'العقود', Calendrier: 'التقويم', 'Suivi des modifications': 'سجل التعديلات', 'Administration utilisateurs': 'إدارة المستخدمين', 'Mes Congés': 'إجازاتي', 'Mes rappels': 'تذكيراتي', 'Mon profil': 'ملفي الشخصي' })[label] || label)}</span>{key === 'dossiers' && <b className="nav-count">{dossiers.length}</b>}</button>)}</nav>
      <div className="sidebar-bottom"><button className={page === 'settings' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('settings')}><Settings2 size={18} /><span>{text(language, 'Paramètres', 'الإعدادات')}</span></button><button className={page === 'help' ? 'nav-item active' : 'nav-item'} onClick={() => setPage('help')}><CircleHelp size={18} /><span>{text(language, 'Centre d’aide', 'مركز المساعدة')}</span></button><div className="user-card"><div className="avatar">{getInitials(currentUser.name)}</div><div><strong>{currentUser.name}</strong><span>{currentUser.function || currentUser.role}</span></div><ChevronDown size={16} /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar">
        <button className="mobile-menu"><Menu size={20} /></button>
        <div className="breadcrumbs"><span>AGP</span><span>/</span><strong>{text(language, title, ({ 'Tableau de bord': 'لوحة القيادة', 'Détail du dossier': 'تفاصيل الملف', 'Nouveau dossier': 'ملف جديد', Dossiers: 'الملفات', "Appels d’offres": 'طلبات العروض', Contrats: 'العقود', 'Paramètres': 'الإعدادات', 'Centre d’aide': 'مركز المساعدة' })[title] || title)}</strong></div>
        <div className="top-actions">
          <div className="language-switch" role="group" aria-label="Langue"><button type="button" className={language === 'fr' ? 'selected' : ''} onClick={() => setLanguage('fr')}>FR</button><button type="button" className={language === 'ar' ? 'selected' : ''} onClick={() => setLanguage('ar')}>عربي</button></div>
          <NotificationCenter language={language} onNavigate={openNotification} onIncoming={(notification) => notify(`${notification.title} : ${notification.message}`, notification.type === 'success' ? 'success' : notification.type === 'warning' || notification.type === 'alert' ? 'error' : 'info')} />
          <div className="top-avatar">{getInitials(currentUser.name)}</div>
          <button className="logout-button" onClick={() => { fetch('/api/logout', { method: 'POST' }); setSignedIn(false); }} title={text(language, 'Se déconnecter', 'تسجيل الخروج')}><LogOut size={17} /><span>{text(language, 'Se déconnecter', 'تسجيل الخروج')}</span></button>
        </div>
      </header>
      <section className={`page-content page-${page} ${page === 'dossier-new' ? 'creating-dossier' : ''}`}>
        {page === 'dossier-new' && <DossierCreateView language={language} users={users} currentUser={currentUser} onCancel={() => setPage('appels')} onSubmit={createDossier} />}
        {page !== 'dossier-new' && <div className="page-heading"><div><p className="eyebrow">{text(language, 'SUIVI DES MARCHÉS', 'متابعة الصفقات')}</p><h1>{page === 'dashboard' ? text(language, `Bonjour ${currentUser.name}, voici votre activité.`, `مرحباً ${currentUser.name}، إليك ملخص نشاطك.`) : text(language, title, ({ 'Détail du dossier': 'تفاصيل الملف', "Appels d’offres": 'طلبات العروض', Dossiers: 'الملفات' })[title] || title)}</h1><p className="subheading">{text(language, 'Pilotez les appels d’offres et gardez une vue claire sur vos engagements.', 'تابع طلبات العروض والتزاماتك بوضوح.')}</p></div>{page === 'leaves' ? <button className="primary-button" onClick={() => setShowLeaveForm(true)}><CalendarDays size={18} />{text(language, 'Nouveau congé', 'طلب إجازة')}</button> : canManageDossiers(currentUser.role) ? <button className="primary-button" onClick={() => setPage('dossier-new')}><FilePlus2 size={18} />{text(language, 'Créer un dossier', 'إنشاء ملف')}</button> : null}</div>}
        {notice && <div className={`notice notice-${notice.tone}`}><ShieldCheck size={17} />{notice.message}<button onClick={() => setNotice(null)}><X size={16} /></button></div>}
        {page === 'settings' && <SettingsView language={language} setLanguage={setLanguage} options={selectOptions} isAdmin={isAdmin} optionsReady={selectOptionsReady} onSaveOptions={saveSelectOptions} onOpenProfile={() => setPage('profile')} />}
        {page === 'help' && <HelpView language={language} onNavigate={setPage} />}
        {page === 'reminders' && <MyRemindersView language={language} />}
        {page === 'dashboard' ? <Dashboard stats={stats} dossiers={dossiers} contrats={contrats} onOpen={() => setPage('dossiers')} onSelectDossier={openDossierDetail} onSelectStat={(key) => setPage(key)} /> : page === 'dashboard-dossiers' ? <DashboardStatDetailView kind="dossiers" items={dossiers} onBack={() => setPage('dashboard')} onOpenDossier={openDossierDetail} /> : page === 'dashboard-actifs' ? <DashboardStatDetailView kind="actifs" items={dossiers.filter((item) => item.status === 'En cours' || item.status === 'Publié')} onBack={() => setPage('dashboard')} onOpenDossier={openDossierDetail} /> : page === 'dashboard-contracts' ? <DashboardStatDetailView kind="contracts" items={contrats.map((item) => ({ id: item.ID, reference: item.N_CONTRAT_BC || item.REF_AO || `CTR-${item.ID}`, title: item.OBJET || item.TITULAIRE_DU_MARCHÉ || 'Contrat sans intitulé', owner: item.RESPONSABLE || item.DEMANDEUR || 'Non renseigné', budget: Number(String(item.MONTANT || 0).replace(/\s/g, '').replace(',', '.')) || 0, status: item.ETAT || 'En attente', progress: item.ETAT === 'Clôturé' ? 100 : 55, date: item.DATE_FIN_DU_MARCHÉ }))} onBack={() => setPage('dashboard')} onOpenDossier={() => setPage('dashboard')} /> : page === 'dashboard-reminders' ? <DashboardStatDetailView kind="reminders" items={dossiers.filter((item) => item.status === 'À lancer' || item.status === 'En attente').slice(0, 10)} onBack={() => setPage('dashboard')} onOpenDossier={openDossierDetail} /> : page === 'dossier-detail' ? <DossierDetailView dossier={selectedDossier} onBack={() => { setSelectedDossier(null); setPage('dashboard'); }} users={users} /> : page === 'users' ? <UsersView users={users} setUsers={setUsers} /> : page === 'leaves' ? <LeavesView leaves={leaves} user={currentUser} /> : page === 'profile' ? <ProfileView user={currentUser} onSaved={setCurrentUser} /> : <ListView page={page} items={page === 'contrats' ? contrats : filtered} query={query} setQuery={setQuery} onOpen={canManageDossiers(currentUser.role) ? () => setShowForm(true) : undefined} onSelectDossier={openDossierDetail} />}
      </section>
    </main>
    {showForm && <div className="modal-backdrop"><form className="modal" onSubmit={createDossier}><div className="modal-header"><div><p className="eyebrow">NOUVEL ENREGISTREMENT</p><h2>Créer un dossier</h2></div><button type="button" className="close-button" onClick={() => setShowForm(false)}><X size={19} /></button></div><label>Référence<input name="reference" onChange={(event) => { event.target.value = normalizeReference(event.target.value); }} placeholder="AO-2026-015" required /></label><label>Intitulé du dossier<input name="title" placeholder="Objet de l’appel d’offres" required /></label><div className="form-grid"><label>Nature de dépense<select name="nature_depense" required><option value="">Sélectionner</option>{selectOptions.expenseNatures.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label>Nature de la commande<select name="nature_commande" required><option value="">Sélectionner</option>{selectOptions.orderNatures.map((option) => <option key={option} value={option}>{option}</option>)}</select></label></div><label>Mode de passation du marché<select name="mode_passation" required><option value="">Sélectionner</option>{selectOptions.procurementModes.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><div className="form-grid"><label>Commission compétente<select name="commission" required><option value="">Sélectionner</option>{selectOptions.commissions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label><label>Budget estimé<input name="budget" type="number" placeholder="0" required /></label></div><label>Responsable du dossier<select name="assigned_to" defaultValue={currentUser.id || ''} required>{users.filter((user) => user.active).map((user) => <option key={user.id} value={user.id}>{user.name} ({user.role})</option>)}</select></label><label>Date limite<input name="date" type="date" required /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Annuler</button><button className="primary-button" type="submit"><FilePlus2 size={17} />Créer le dossier</button></div></form></div>}
    {showLeaveForm && <div className="modal-backdrop"><form className="modal" onSubmit={createLeave}><div className="modal-header"><div><p className="eyebrow">NOUVELLE DEMANDE</p><h2>Nouveau congé</h2></div><button type="button" className="close-button" onClick={() => setShowLeaveForm(false)}><X size={19} /></button></div><label>Type de congé<select name="type" defaultValue="SOLDE" required><option value="SOLDE">Congé payé</option><option value="NON_SOLDE">Congé sans solde</option><option value="FAMILIAL">Raisons familiales</option><option value="AUTORISE">Congé autorisé</option><option value="COMPENSATION">Récupération</option></select></label><label>Date de demande<input name="requestDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label><div className="form-grid"><label>Date de début<input name="dateStart" type="date" onChange={updateLeaveDays} required /></label><label>Date de fin<input name="dateEnd" type="date" onChange={updateLeaveDays} required /></label></div><label>Nombre de jours<input name="numberOfDays" type="number" value={leaveDays} readOnly /></label><label>Jours fériés<input name="holidays" type="number" min="0" defaultValue="0" onChange={updateLeaveDays} /></label><label>Adresse pendant le congé<input name="address" placeholder="Adresse complète" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => { setShowLeaveForm(false); setLeaveDays(0); }}>Annuler</button><button className="primary-button" type="submit"><CalendarDays size={17} />Créer la demande</button></div></form></div>}
  </div></SelectOptionsContext.Provider></LanguageContext.Provider>;
}

function DossierCreateView({ language, users, currentUser, onCancel, onSubmit }) {
  const t = (fr, ar) => text(language, fr, ar);
  const selectOptions = useContext(SelectOptionsContext);
  const activeUsers = users.filter((user) => user.active);
  return <div className="dossier-create-view">
    <form className="dossier-create-form" onSubmit={onSubmit}>
      <header className="create-page-header"><div><p className="eyebrow">{t('NOUVEL ENREGISTREMENT', 'تسجيل جديد')}</p><h1>{t('Créer un dossier', 'إنشاء ملف')}</h1><p>{t('Renseignez les informations du marché et son suivi.', 'أدخل بيانات الصفقة ومعلومات المتابعة.')}</p></div><button className="primary-button" type="submit"><FilePlus2 size={17} />{t('Créer le dossier', 'إنشاء الملف')}</button></header>
      <section className="create-section"><div className="create-section-title"><div><span>01</span><div><h2>{t('Informations principales', 'المعلومات الأساسية')}</h2><p>{t('Identification et méthode de passation', 'التعريف وطريقة إبرام الصفقة')}</p></div></div></div>
        <div className="create-fields">
          <label>{t('Référence du dossier', 'رقم الملف')}<input name="reference" onChange={(event) => { event.target.value = normalizeReference(event.target.value); }} placeholder="AO-2026-015" required /></label>
          <label className="span-two">{t('Objet de l’appel d’offres', 'موضوع طلب العروض')}<input name="title" required /></label>
          <label>{t('Statut', 'الحالة')}<select name="status" defaultValue={selectOptions.procurementStatuses[0]} required>{selectOptions.procurementStatuses.map((status) => <option key={status} value={status}>{t(status, status)}</option>)}</select></label>
          <label>{t('Mode de passation', 'طريقة إبرام الصفقة')}<select name="mode_passation" required><option value="">{t('Sélectionner', 'اختر')}</option>{selectOptions.procurementModes.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          <label>{t('Nature de la commande', 'نوعية الطلب')}<select name="nature_commande" required><option value="">{t('Sélectionner', 'اختر')}</option>{selectOptions.orderNatures.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          <label>{t('Commission compétente', 'اللجنة المختصة')}<select name="commission" required><option value="">{t('Sélectionner', 'اختر')}</option>{selectOptions.commissions.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          <label>{t('Responsable du dossier', 'المكلف بالملف')}<select name="assigned_to" defaultValue={currentUser.id || ''} required>{activeUsers.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label>
        </div>
      </section>
      <section className="create-section"><div className="create-section-title"><div><span>02</span><div><h2>{t('Budget et nature de dépense', 'الميزانية ونوع المصاريف')}</h2><p>{t('Montant prévisionnel et échéance', 'المبلغ التقديري والأجل')}</p></div></div></div>
        <div className="create-fields">
          <label>{t('Coût estimatif (TND)', 'الكلفة التقديرية (دينار)')}<input name="budget" type="number" min="0" step="0.001" placeholder="0" required /></label>
          <label>{t('Nature de dépense', 'نوع المصاريف')}<select name="nature_depense" required><option value="">{t('Sélectionner', 'اختر')}</option>{selectOptions.expenseNatures.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
          <label>{t('Date limite', 'آخر أجل')}<input name="date" type="date" required /></label>
          <label className="span-two">{t('Description et remarques initiales', 'الوصف والملاحظات الأولية')}<textarea name="description" rows="4" placeholder={t('Précisez le besoin ou le contexte...', 'وضّح الحاجة أو السياق...')} /></label>
        </div>
      </section>
      <footer className="create-actions"><button type="button" className="secondary-button" onClick={onCancel}>{t('Annuler', 'إلغاء')}</button><button type="submit" className="primary-button"><FilePlus2 size={17} />{t('Enregistrer le dossier', 'حفظ الملف')}</button></footer>
    </form>
  </div>;
}

function Dashboard({ stats, dossiers, onOpen, onSelectDossier, onSelectStat }) {
  const language = useContext(LanguageContext);
  const t = (fr, ar) => text(language, fr, ar);
  return <><div className="stats-grid"><Stat icon={ClipboardList} label={t('Appels d’offres', 'طلبات العروض')} value={stats.total} change={t('Dossiers suivis', 'الملفات المتابعة')} tone="teal" onClick={() => onSelectStat('dashboard-dossiers')} /><Stat icon={Activity} label={t('Dossiers actifs', 'الملفات النشطة')} value={stats.active} change={t('En cours de traitement', 'قيد المعالجة')} tone="amber" onClick={() => onSelectStat('dashboard-actifs')} /><Stat icon={Files} label={t('Contrats en cours', 'العقود الجارية')} value={stats.contracts} change={t('Contrats suivis', 'العقود المتابعة')} tone="blue" onClick={() => onSelectStat('dashboard-contracts')} /><Stat icon={Bell} label={t('Rappels à traiter', 'تذكيرات للمتابعة')} value={stats.reminders} change={t('Voir les rappels', 'عرض التذكيرات')} tone="rose" onClick={() => onSelectStat('dashboard-reminders')} /></div><div className="dashboard-grid"><section className="panel large-panel"><div className="panel-heading"><div><p className="eyebrow">{t('SUIVI OPÉRATIONNEL', 'المتابعة التشغيلية')}</p><h2>{t('Appels d’offres récents', 'أحدث طلبات العروض')}</h2></div><button className="text-button" onClick={onOpen}>{t('Voir tous les appels', 'عرض جميع الطلبات')} <span>→</span></button></div><DossierTable items={dossiers.slice(0, 4)} onSelectDossier={onSelectDossier} /></section><section className="panel deadline-panel"><div className="panel-heading"><div><p className="eyebrow">{t('PROCHAINES ÉCHÉANCES', 'الآجال القادمة')}</p><h2>{t('À ne pas manquer', 'مواعيد مهمة')}</h2></div></div><div className="deadline-list"><Deadline day="08" month="SEP" title={t('Clôture des offres', 'آخر أجل لتقديم العروض')} refText="AO-2026-009" tone="rose" /><Deadline day="14" month="SEP" title={t('Ouverture des plis', 'فتح العروض')} refText="AO-2026-014" tone="amber" /><Deadline day="18" month="SEP" title={t('Commission d’évaluation', 'لجنة التقييم')} refText="AO-2026-004" tone="teal" /></div></section></div></>;
}
function Stat({ icon: Icon, label, value, change, tone, onClick }) { return <button type="button" className="stat-card is-clickable" onClick={onClick}><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small className={tone}>{change}</small></div></button> }
function LeavesView({ leaves, user }) {
  const totalDays = leaves.reduce((sum, leave) => sum + Number(leave.NBR_JOURS || 0), 0);
  const [balance, setBalance] = useState(Number(user.leave_balance || 0));
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [balanceError, setBalanceError] = useState('');

  useEffect(() => {
    fetch('/api/me').then((response) => response.ok ? response.json() : null).then((profile) => {
      if (profile) setBalance(Number(profile.leave_balance || 0));
    }).catch(() => {});
  }, [user.id]);

  function saveBalance(event) {
    event.preventDefault();
    const nextBalance = Number(new FormData(event.currentTarget).get('balance'));
    fetch('/api/my-leave-balance', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ balance: nextBalance }) })
      .then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Mise à jour impossible.'); return result; })
      .then((result) => { setBalance(result.leave_balance); setShowBalanceForm(false); setBalanceError(''); })
      .catch((error) => setBalanceError(error.message));
  }

  return <><div className="admin-summary"><div><p className="eyebrow">HISTORIQUE PERSONNEL</p><h2>Mes Congés</h2><p>Consultez uniquement vos demandes de congé et leur évolution.</p></div><div className="leave-summary-actions"><div className="leave-total"><strong>{balance}</strong><span>jours de congé disponibles</span></div><div className="leave-total leave-request-total"><strong>{totalDays}</strong><span>jours demandés</span></div><button className="secondary-button" onClick={() => setShowBalanceForm(true)}><Settings2 size={16} />Régler mon solde</button></div></div><section className="panel list-panel"><div className="panel-heading"><div><p className="eyebrow">MES DEMANDES</p><h2>{leaves.length} demande{leaves.length > 1 ? 's' : ''}</h2></div><span className="admin-badge"><ShieldCheck size={15} />Données personnelles</span></div><div className="table-wrap"><table><thead><tr><th>Période</th><th>Type</th><th>Durée</th><th>Solde avant</th><th>Solde après</th><th>Demande déposée le</th><th>Statut</th><th>Imprimer</th></tr></thead><tbody>{leaves.map((leave) => <tr key={leave.CONGE_ID}><td><strong>{formatDate(leave.DATE_DEBUT)} → {formatDate(leave.DATE_FIN)}</strong></td><td>{leave.TYPE_CONGE || 'Non renseigné'}</td><td><strong>{leave.NBR_JOURS || 0} jours</strong><span className="muted">{leave.NBR_FERIES || 0} jour(s) férié(s)</span></td><td>{leave.SOLDE_AVANT ?? '-'} jours</td><td>{leave.SOLDE_APRES ?? '-'} jours</td><td>{formatDate(leave.DATE_DEMANDE)}</td><td><span className={`status ${leave.STATUT === 'VALIDE' ? 'teal' : 'amber'}`}><i />{leave.STATUT || 'EN_ATTENTE'}</span></td><td><button className="table-action" onClick={() => printLeaveRequest(leave, user)} title="Imprimer la demande"><Printer size={16} />Imprimer</button></td></tr>)}</tbody></table></div>{leaves.length === 0 && <div className="empty-state"><CalendarDays size={30} /><p>Aucun congé enregistré pour votre compte.</p></div>}</section>{showBalanceForm && <div className="modal-backdrop"><form className="modal" onSubmit={saveBalance}><div className="modal-header"><div><p className="eyebrow">SOLDE PERSONNEL</p><h2>Régler mon solde de congé</h2></div><button type="button" className="close-button" onClick={() => { setShowBalanceForm(false); setBalanceError(''); }}><X size={19} /></button></div><label>Solde disponible (jours)<input name="balance" type="number" min="0" step="0.01" defaultValue={balance} required /></label>{balanceError && <p className="form-error">{balanceError}</p>}<div className="modal-actions"><button type="button" className="secondary-button" onClick={() => { setShowBalanceForm(false); setBalanceError(''); }}>Annuler</button><button className="primary-button" type="submit"><Settings2 size={17} />Enregistrer le solde</button></div></form></div>}</>;
}
function formatDate(value) { return value ? new Date(value).toLocaleDateString('fr-FR') : '-'; }
function formatPrintDate(value) {
  if (!value) return '-';
  const parts = String(value).match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (parts) return `${parts[1]}/${parts[2].padStart(2, '0')}/${parts[3].padStart(2, '0')}`;
  const frenchParts = String(value).match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (frenchParts) return `${frenchParts[3]}/${frenchParts[2].padStart(2, '0')}/${frenchParts[1].padStart(2, '0')}`;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
}
function getInitials(name) { return String(name || '?').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function LoginView({ error, onLogin, onError }) {
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matricule: form.get('matricule'), password: form.get('password') }) })
      .then(async (response) => { const text = await response.text(); let result; try { result = JSON.parse(text); } catch { throw new Error(response.status === 404 ? 'Service de connexion indisponible. Vérifiez le déploiement de l’API.' : `Réponse invalide du serveur (HTTP ${response.status}). Vérifiez les journaux Vercel.`); } if (!response.ok) throw new Error(result.error || 'Connexion refusée.'); return result; })
      .then(() => fetch('/api/me').then(async (response) => { if (!response.ok) throw new Error('Session impossible à établir.'); return response.json(); }).then(onLogin))
      .catch((loginError) => onError(loginError.message));
  }
  return <div className="signed-out"><div className="signed-out-mark">A</div><p className="eyebrow">ESPACE AGP</p><h1>Connexion requise</h1><p>Identifiez-vous pour accéder à votre espace.</p><form className="modal" onSubmit={submit}><label>Matricule<input name="matricule" required autoComplete="username" /></label><label>Mot de passe<input name="password" type="password" required autoComplete="current-password" /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" type="submit">Se connecter</button></form></div>;
}
function ProfileView({ user, onSaved, onNotify }) {
  function save(event) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = Object.fromEntries(['name', 'matricule', 'function', 'service', 'phone', 'password'].map((key) => [key, form.get(key)]));
    fetch(`/api/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error); return result; }).then((updated) => { onSaved(updated); formElement.elements.password.value = ''; onNotify('Profil mis à jour.', 'success'); }).catch((error) => onNotify(error.message, 'error'));
  }
  return <section className="panel profile-panel"><div className="panel-heading"><div><p className="eyebrow">ESPACE PERSONNEL</p><h2>Mon profil</h2></div></div><form className="profile-form" onSubmit={save}><label>Nom et prénom<input name="name" defaultValue={user.name} required /></label><label>Matricule<input name="matricule" defaultValue={user.matricule} required /></label><label>Fonction<input name="function" defaultValue={user.function} /></label><label>Service<input name="service" defaultValue={user.service || ''} /></label><label>Téléphone<input name="phone" defaultValue={user.phone} /></label><label>Nouveau mot de passe<input name="password" type="password" placeholder="Laisser vide pour conserver l’actuel" minLength="6" /></label><button className="primary-button" type="submit">Enregistrer mes modifications</button></form></section>;
}
function NotificationCenter({ language, onNavigate, onIncoming }) {
  const t = (fr, ar) => text(language, fr, ar);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const lastId = useRef(0);
  const streamInitialized = useRef(false);
  const onIncomingRef = useRef(onIncoming);
  onIncomingRef.current = onIncoming;

  async function loadNotifications(reset = false) {
    setLoading(true);
    setError('');
    const query = new URLSearchParams({ limit: '20', filter });
    if (!reset && cursor) {
      query.set('beforeId', cursor.beforeId);
      query.set('beforeCreatedAt', cursor.beforeCreatedAt);
    }
    try {
      const response = await fetch(`/api/notifications?${query}`, { credentials: 'include' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('Impossible de charger les notifications.', 'تعذر تحميل الإشعارات.'));
      const normalizedItems = result.items.map((item) => ({ ...item, is_read: Boolean(item.is_read) }));
      if (reset) setItems(normalizedItems);
      else setItems((current) => [...current, ...normalizedItems.filter((item) => !current.some((existing) => existing.id === item.id))]);
      if (reset) {
        if (normalizedItems.length) lastId.current = Math.max(lastId.current, ...normalizedItems.map((item) => Number(item.id)));
        streamInitialized.current = true;
      }
      setUnreadCount(Number(result.unread_count) || 0);
      setCursor(result.next_cursor);
      setHasMore(Boolean(result.next_cursor));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications(true);
  }, [filter]);

  useEffect(() => {
    let pollingTimer;
    const poll = async () => {
      try {
        const response = await fetch('/api/notifications?limit=1', { credentials: 'include' });
        if (!response.ok) return;
        const result = await response.json();
        setUnreadCount(Number(result.unread_count) || 0);
        const latest = result.items?.[0];
        if (!latest) return;
        const latestId = Number(latest.id);
        if (latestId > lastId.current) {
          const shouldNotify = streamInitialized.current;
          lastId.current = latestId;
          setItems((current) => [latest, ...current.filter((item) => item.id !== latest.id)].slice(0, 20));
          if (shouldNotify) onIncomingRef.current(latest);
        }
        streamInitialized.current = true;
      } catch {
        // Polling is best-effort; the next interval retries automatically.
      }
    };

    const eventSource = new EventSource(`/api/notifications/stream?afterId=${lastId.current}`, { withCredentials: true });
    eventSource.addEventListener('unread-count', (event) => {
      try {
        setUnreadCount(Number(JSON.parse(event.data).unread_count) || 0);
      } catch {
        return;
      }
    });
    eventSource.addEventListener('ready', (event) => {
      try {
        lastId.current = Math.max(lastId.current, Number(JSON.parse(event.data).last_id) || 0);
        streamInitialized.current = true;
      } catch {
        return;
      }
    });
    eventSource.addEventListener('notification', (event) => {
      try {
        const notification = JSON.parse(event.data);
        const notificationId = Number(notification.id);
        if (notificationId <= lastId.current) return;
        const hadPreviousId = lastId.current > 0;
        lastId.current = notificationId;
        setItems((current) => [notification, ...current.filter((item) => item.id !== notification.id)].slice(0, 20));
        if (hadPreviousId) onIncomingRef.current(notification);
      } catch {
        return;
      }
    });
    eventSource.onerror = () => {
      eventSource.close();
      pollingTimer = window.setInterval(poll, 30000);
      poll();
    };
    poll();

    return () => {
      eventSource.close();
      window.clearInterval(pollingTimer);
    };
  }, []);

  async function updateNotification(notification, action) {
    const endpoint = action === 'read' ? `/api/notifications/${notification.id}/read` : `/api/notifications/${notification.id}`;
    try {
      const response = await fetch(endpoint, { method: action === 'read' ? 'PATCH' : 'DELETE', credentials: 'include' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('Action impossible.', 'تعذر تنفيذ العملية.'));
      setItems((current) => action === 'read'
        ? filter === 'unread' ? current.filter((item) => item.id !== notification.id) : current.map((item) => item.id === notification.id ? { ...item, is_read: true, read_at: new Date().toISOString() } : item)
        : current.filter((item) => item.id !== notification.id));
      setUnreadCount(Number(result.unread_count) || 0);
    } catch (actionError) {
      setError(actionError.message);
    }
  }

  async function markAllRead() {
    try {
      const response = await fetch('/api/notifications/read-all', { method: 'PATCH', credentials: 'include' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('Action impossible.', 'تعذر تنفيذ العملية.'));
      setItems((current) => filter === 'unread' ? [] : current.map((item) => ({ ...item, is_read: true, read_at: item.read_at || new Date().toISOString() })));
      setUnreadCount(Number(result.unread_count) || 0);
    } catch (actionError) {
      setError(actionError.message);
    }
  }

  function activateNotification(notification) {
    if (!notification.is_read) updateNotification(notification, 'read');
    setOpen(false);
    onNavigate(notification);
  }

  return <div className="notification-center">
    <button type="button" className="icon-button notification-trigger" title={t('Notifications', 'الإشعارات')} aria-label={t('Notifications', 'الإشعارات')} aria-expanded={open} onClick={() => { setOpen((current) => !current); if (!open) loadNotifications(true); }}>
      <Bell size={19} />{unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
    </button>
    {open && <section className="notification-popover" aria-label={t('Centre de notifications', 'مركز الإشعارات')}>
      <header className="notification-header"><div><p className="eyebrow">{t('CENTRE', 'مركز')}</p><h2>{t('Notifications', 'الإشعارات')}</h2></div><button type="button" className="notification-icon-action" title={t('Tout marquer comme lu', 'تحديد الكل كمقروء')} aria-label={t('Tout marquer comme lu', 'تحديد الكل كمقروء')} disabled={!unreadCount} onClick={markAllRead}><CheckCheck size={17} /></button></header>
      <div className="notification-filters" role="tablist" aria-label={t('Filtrer les notifications', 'تصفية الإشعارات')}><button type="button" role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>{t('Toutes', 'الكل')}</button><button type="button" role="tab" aria-selected={filter === 'unread'} className={filter === 'unread' ? 'selected' : ''} onClick={() => setFilter('unread')}>{t('Non lues', 'غير مقروءة')} {unreadCount > 0 && <span>{unreadCount}</span>}</button></div>
      {error && <p className="notification-error" role="alert">{error}</p>}
      <div className="notification-list" aria-live="polite">{items.map((notification) => <article className={`notification-item notification-${notification.type} ${notification.is_read ? 'is-read' : 'is-unread'}`} key={notification.id}>
        <button type="button" className="notification-open" onClick={() => activateNotification(notification)}><span className="notification-type-mark" /><span className="notification-copy"><strong>{notification.title}</strong><span>{notification.message}</span><time dateTime={notification.created_at}>{new Date(notification.created_at).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')}</time></span></button>
        <div className="notification-item-actions">{!notification.is_read && <button type="button" className="notification-icon-action" title={t('Marquer comme lue', 'تحديد كمقروءة')} aria-label={`${t('Marquer comme lue', 'تحديد كمقروءة')} ${notification.title}`} onClick={() => updateNotification(notification, 'read')}><Check size={15} /></button>}<button type="button" className="notification-icon-action delete" title={t('Supprimer', 'حذف')} aria-label={`${t('Supprimer', 'حذف')} ${notification.title}`} onClick={() => updateNotification(notification, 'delete')}><Trash2 size={15} /></button></div>
      </article>)}{!loading && items.length === 0 && <p className="notification-empty">{filter === 'unread' ? t('Aucune notification non lue.', 'لا توجد إشعارات غير مقروءة.') : t('Aucune notification pour le moment.', 'لا توجد إشعارات حالياً.')}</p>}{loading && items.length === 0 && <p className="notification-empty">{t('Chargement…', 'جارٍ التحميل...')}</p>}</div>
      {hasMore && <button type="button" className="notification-load-more" disabled={loading} onClick={() => loadNotifications(false)}>{loading ? t('Chargement…', 'جارٍ التحميل...') : t('Charger davantage', 'تحميل المزيد')}</button>}
    </section>}
  </div>;
}
function MyRemindersView({ language }) {
  const t = (fr, ar) => text(language, fr, ar);
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadReminders() {
    setLoading(true);
    try {
      const response = await fetch('/api/my-reminders', { credentials: 'include' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('Impossible de charger vos rappels.', 'تعذر تحميل تذكيراتك.'));
      setReminders(result);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadReminders(); }, []);

  async function createReminder(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/my-reminders', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: form.get('title'), description: form.get('description'), due_at: new Date(form.get('due_at')).toISOString() })
      });
      const reminder = await response.json();
      if (!response.ok) throw new Error(reminder.error || t('Impossible de créer le rappel.', 'تعذر إنشاء التذكير.'));
      setReminders((current) => [...current, reminder].sort((first, second) => new Date(first.due_at) - new Date(second.due_at)));
      setShowForm(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function updateReminder(reminder, patch) {
    setError('');
    try {
      const response = await fetch(`/api/my-reminders/${reminder.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.error || t('Impossible de modifier le rappel.', 'تعذر تعديل التذكير.'));
      setReminders((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function deleteReminder(reminder) {
    setError('');
    try {
      const response = await fetch(`/api/my-reminders/${reminder.id}`, { method: 'DELETE', credentials: 'include' });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || t('Impossible de supprimer le rappel.', 'تعذر حذف التذكير.'));
      }
      setReminders((current) => current.filter((item) => item.id !== reminder.id));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  const pendingCount = reminders.filter((reminder) => !reminder.is_completed).length;
  return <div className="reminders-view">
    <section className="panel reminders-panel"><header className="reminders-toolbar"><div><p className="eyebrow">{t('VOTRE ESPACE PERSONNEL', 'مساحتك الشخصية')}</p><h2>{t('Mes rappels', 'تذكيراتي')}</h2><p>{t(`${pendingCount} rappel${pendingCount === 1 ? '' : 's'} à traiter`, `${pendingCount} تذكيرات قيد المتابعة`)}</p></div><button type="button" className="primary-button" onClick={() => { setError(''); setShowForm((current) => !current); }}><CalendarClock size={17} />{showForm ? t('Fermer', 'إغلاق') : t('Nouveau rappel', 'تذكير جديد')}</button></header>
      {error && <p className="reminder-error" role="alert">{error}</p>}
      {showForm && <form className="reminder-create-form" onSubmit={createReminder}><label>{t('Titre', 'العنوان')}<input name="title" maxLength="180" required autoFocus /></label><label>{t('Échéance', 'الموعد النهائي')}<input name="due_at" type="datetime-local" required /></label><label>{t('Détail (facultatif)', 'تفاصيل (اختياري)')}<textarea name="description" rows="3" maxLength="2000" /></label><div className="reminder-form-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>{t('Annuler', 'إلغاء')}</button><button type="submit" className="primary-button" disabled={saving}>{saving ? t('Enregistrement…', 'جارٍ الحفظ...') : t('Enregistrer le rappel', 'حفظ التذكير')}</button></div></form>}
      {loading ? <p className="reminders-empty">{t('Chargement…', 'جارٍ التحميل...')}</p> : reminders.length === 0 ? <div className="reminders-empty"><CalendarClock size={26} /><p>{t('Vous n’avez encore aucun rappel.', 'ليس لديك أي تذكير بعد.')}</p></div> : <div className="reminder-list">{reminders.map((reminder) => {
        const dueDate = new Date(reminder.due_at);
        const isOverdue = !reminder.is_completed && dueDate < new Date();
        return <article className={`reminder-row ${reminder.is_completed ? 'is-completed' : ''} ${isOverdue ? 'is-overdue' : ''}`} key={reminder.id}>
          <button type="button" className={`reminder-complete ${reminder.is_completed ? 'checked' : ''}`} aria-label={reminder.is_completed ? t('Rouvrir le rappel', 'إعادة فتح التذكير') : t('Terminer le rappel', 'إكمال التذكير')} aria-pressed={reminder.is_completed} onClick={() => updateReminder(reminder, { is_completed: !reminder.is_completed })}>{reminder.is_completed && <Check size={15} />}</button>
          <div className="reminder-copy"><strong>{reminder.title}</strong>{reminder.description && <p>{reminder.description}</p>}<time dateTime={reminder.due_at}>{t('Échéance', 'الموعد النهائي')} · {dueDate.toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR')}</time></div>
          <span className={`reminder-status ${isOverdue ? 'overdue' : reminder.is_completed ? 'completed' : ''}`}>{isOverdue ? t('En retard', 'متأخر') : reminder.is_completed ? t('Terminé', 'مكتمل') : t('À faire', 'قيد الإنجاز')}</span>
          <button type="button" className="reminder-delete" title={t('Supprimer', 'حذف')} aria-label={`${t('Supprimer', 'حذف')} ${reminder.title}`} onClick={() => deleteReminder(reminder)}><Trash2 size={16} /></button>
        </article>;
      })}</div>}
    </section>
  </div>;
}
function SettingsView({ language, setLanguage, onOpenProfile, options, isAdmin, optionsReady, onSaveOptions }) {
  const t = (fr, ar) => text(language, fr, ar);
  const [draftOptions, setDraftOptions] = useState(options);
  const [newValues, setNewValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => setDraftOptions(options), [options]);

  const updateOptions = (key, values) => setDraftOptions((current) => ({ ...current, [key]: values }));
  const moveOption = (key, index, offset) => {
    const values = [...draftOptions[key]];
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= values.length) return;
    [values[index], values[targetIndex]] = [values[targetIndex], values[index]];
    updateOptions(key, values);
  };
  const addOption = (event, key) => {
    event.preventDefault();
    const value = String(newValues[key] || '').trim();
    if (!value || draftOptions[key].includes(value)) return;
    updateOptions(key, [...draftOptions[key], value]);
    setNewValues((current) => ({ ...current, [key]: '' }));
  };
  const isValid = CONFIGURABLE_SELECTS.every(({ key }) => {
    const values = draftOptions[key] || [];
    return values.length > 0 && values.every((value) => value.trim() && value.length <= 120) && new Set(values).size === values.length;
  });

  async function saveOptions(nextOptions = draftOptions) {
    setSaving(true);
    setSaveMessage('');
    try {
      const savedOptions = await onSaveOptions(nextOptions);
      setDraftOptions(savedOptions);
      setSaveMessage(t('Modifications enregistrées.', 'تم حفظ التعديلات.'));
    } catch (error) {
      setSaveMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  return <div className="utility-page settings-view">
    <section className="panel settings-panel"><div className="panel-heading"><div><p className="eyebrow">{t('PRÉFÉRENCES', 'التفضيلات')}</p><h2>{t('Affichage', 'العرض')}</h2><p>{t('Choisissez la langue utilisée dans l’application.', 'اختر اللغة المستخدمة في التطبيق.')}</p></div></div><div className="setting-row"><div><strong>{t('Langue de l’interface', 'لغة الواجهة')}</strong><span>{t('Votre choix est conservé sur cet appareil.', 'يتم حفظ اختيارك على هذا الجهاز.')}</span></div><div className="setting-segmented" role="group" aria-label={t('Langue de l’interface', 'لغة الواجهة')}><button type="button" className={language === 'fr' ? 'selected' : ''} aria-pressed={language === 'fr'} onClick={() => setLanguage('fr')}>Français</button><button type="button" className={language === 'ar' ? 'selected' : ''} aria-pressed={language === 'ar'} onClick={() => setLanguage('ar')}>العربية</button></div></div></section>
    <section className="panel settings-panel select-options-panel"><div className="panel-heading"><div><p className="eyebrow">{t('FORMULAIRES', 'النماذج')}</p><h2>{t('Options des listes déroulantes', 'خيارات القوائم المنسدلة')}</h2><p>{t('Ces choix sont partagés avec les formulaires de dossier et leur suivi.', 'تُستخدم هذه الخيارات في نماذج الملفات ومتابعتها.')}</p></div></div>
      {!isAdmin && <p className="settings-hint">{t('Seuls les administrateurs peuvent modifier ces listes.', 'يمكن للمسؤولين فقط تعديل هذه القوائم.')}</p>}
      {!optionsReady && <p className="settings-hint">{t('Chargement des options enregistrées…', 'جارٍ تحميل الخيارات المحفوظة...')}</p>}
      <div className="configurable-selects">{CONFIGURABLE_SELECTS.map(({ key, label, arabic }) => <fieldset className="configurable-select" key={key} disabled={!isAdmin || !optionsReady || saving}><legend>{t(label, arabic)}</legend><ul>{(draftOptions[key] || []).map((value, index) => <li key={value}><span>{value}</span><div className="configurable-select-actions"><button type="button" aria-label={`${t('Monter', 'تحريك للأعلى')} ${value}`} title={t('Monter', 'Déplacer vers le haut')} onClick={() => moveOption(key, index, -1)} disabled={index === 0}><ArrowUp size={14} /></button><button type="button" aria-label={`${t('Descendre', 'تحريك للأسفل')} ${value}`} title={t('Descendre', 'Déplacer vers le bas')} onClick={() => moveOption(key, index, 1)} disabled={index === draftOptions[key].length - 1}><ArrowDown size={14} /></button><button type="button" aria-label={`${t('Supprimer', 'حذف')} ${value}`} title={t('Supprimer', 'حذف')} onClick={() => updateOptions(key, draftOptions[key].filter((item) => item !== value))} disabled={draftOptions[key].length <= 1}><X size={15} /></button></div></li>)}</ul><form className="settings-add-form" onSubmit={(event) => addOption(event, key)}><input value={newValues[key] || ''} maxLength="120" aria-label={`${t('Ajouter une option', 'إضافة خيار')} : ${t(label, arabic)}`} placeholder={t('Nouvelle option', 'خيار جديد')} onChange={(event) => setNewValues((current) => ({ ...current, [key]: event.target.value }))} /><button className="secondary-button" type="submit">{t('Ajouter', 'إضافة')}</button></form></fieldset>)}</div>
      <div className="settings-save-row"><span className="settings-save-message" role="status">{saveMessage}</span><button className="secondary-button" type="button" disabled={!isAdmin || !optionsReady || saving} onClick={() => saveOptions(DEFAULT_SELECT_OPTIONS)}>{t('Valeurs par défaut', 'القيم الافتراضية')}</button><button className="primary-button" type="button" disabled={!isAdmin || !optionsReady || saving || !isValid} onClick={() => saveOptions()}>{saving ? t('Enregistrement…', 'جارٍ الحفظ...') : t('Enregistrer les listes', 'حفظ القوائم')}</button></div>
    </section>
    <section className="panel settings-panel"><div className="panel-heading"><div><p className="eyebrow">{t('COMPTE', 'الحساب')}</p><h2>{t('Informations personnelles', 'المعلومات الشخصية')}</h2><p>{t('Gérez vos coordonnées et votre mot de passe depuis votre profil.', 'أدر بيانات الاتصال وكلمة المرور من ملفك الشخصي.')}</p></div></div><button className="secondary-button" type="button" onClick={onOpenProfile}><Settings2 size={16} />{t('Ouvrir mon profil', 'فتح ملفي الشخصي')}</button></section>
  </div>;
}
function HelpView({ language, onNavigate }) {
  const t = (fr, ar) => text(language, fr, ar);
  return <div className="utility-page help-view">
    <section className="panel help-panel"><div className="panel-heading"><div><p className="eyebrow">{t('GUIDE RAPIDE', 'دليل سريع')}</p><h2>{t('Questions fréquentes', 'الأسئلة الشائعة')}</h2></div></div><div className="help-faq"><details><summary>{t('Comment retrouver un dossier ?', 'كيف أجد ملفاً؟')}</summary><p>{t('Ouvrez Dossiers ou Appels d’offres, puis utilisez la recherche et les filtres pour retrouver une référence ou un intitulé.', 'افتح الملفات أو طلبات العروض، ثم استخدم البحث والتصفية للعثور على رقم أو عنوان.')}</p></details><details><summary>{t('Comment mettre à jour mes coordonnées ?', 'كيف أحدّث بياناتي؟')}</summary><p>{t('Ouvrez votre profil pour modifier vos informations personnelles ou votre mot de passe.', 'افتح ملفك الشخصي لتعديل بياناتك أو كلمة المرور.')}</p></details><details><summary>{t('Où consulter mes congés ?', 'أين أجد إجازاتي؟')}</summary><p>{t('La page Mes Congés affiche votre solde et l’historique de vos demandes.', 'تعرض صفحة إجازاتي رصيدك وسجل طلباتك.')}</p></details></div></section>
    <section className="panel help-panel"><div className="panel-heading"><div><p className="eyebrow">{t('ACCÈS DIRECT', 'وصول مباشر')}</p><h2>{t('Ouvrir une rubrique', 'فتح قسم')}</h2></div></div><div className="help-links"><button type="button" onClick={() => onNavigate('dashboard')}><LayoutDashboard size={18} />{t('Tableau de bord', 'لوحة القيادة')}</button><button type="button" onClick={() => onNavigate('dossiers')}><ClipboardList size={18} />{t('Dossiers', 'الملفات')}</button><button type="button" onClick={() => onNavigate('leaves')}><CalendarDays size={18} />{t('Mes Congés', 'إجازاتي')}</button><button type="button" onClick={() => onNavigate('profile')}><Users size={18} />{t('Mon profil', 'ملفي الشخصي')}</button></div></section>
  </div>;
}
function calculateLeaveDays(dateStart, dateEnd) {
  if (!dateStart || !dateEnd) return 0;
  const start = new Date(`${dateStart}T00:00:00`);
  const end = new Date(`${dateEnd}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  return Math.floor((end - start) / 86400000);
}
function printLeaveRequest(leave, user) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) return;
  const checked = (value) => value === leave.TYPE_CONGE ? '☑' : '☐';
  const printDocument = new DOMParser().parseFromString(buildLeavePrintHtml(leave, user, checked), 'text/html');
  const serviceLabel = Array.from(printDocument.querySelectorAll('.main-table .lbl')).find((cell) => cell.textContent.includes('المصلحة'));
  if (serviceLabel?.nextElementSibling) serviceLabel.nextElementSibling.textContent = user.service || '-';
  const headerDate = printDocument.querySelector('.header-date');
  if (headerDate) {
    const dateSpan = printDocument.createElement('span');
    dateSpan.dir = 'ltr';
    dateSpan.textContent = formatPrintDate(leave.DATE_DEMANDE);
    headerDate.replaceChildren(printDocument.createTextNode('قابس في : '), dateSpan);
  }
  const dateCells = printDocument.querySelectorAll('.main-table td.val2');
  if (dateCells[0]) dateCells[0].textContent = formatPrintDate(leave.DATE_DEBUT);
  if (dateCells[1]) dateCells[1].textContent = formatPrintDate(leave.DATE_FIN);
  printWindow.document.write(`<!doctype html>${printDocument.documentElement.outerHTML}`);
  const printStyles = printWindow.document.createElement('style');
  printStyles.textContent = '@page{size:A4 portrait;margin:8mm}@media print{body{background:#fff}.a4{width:100%;height:281mm;min-height:281mm;margin:0;padding:5mm;border:2px double #000}.main-table td{padding:7pt 5pt}.footer-sign{margin-top:10mm;break-inside:avoid}.header,.titre,.checkboxes,.main-table{break-inside:avoid}}';
  printWindow.document.head.append(printStyles);
  printWindow.document.close();
  return;
  printWindow.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>مطلب إجازة</title><style>@page{size:A4;margin:18mm}*{box-sizing:border-box}body{font-family:Arial,Tahoma,sans-serif;color:#111;margin:0;font-size:17px}.sheet{border:1px solid #222;padding:34px 38px;min-height:250mm}.brand{text-align:center;font-size:14px;line-height:1.8;margin-bottom:24px}.title{text-align:center;text-decoration:underline;font-size:28px;margin:10px 0 60px}.checks{display:flex;justify-content:space-between;gap:16px;margin-bottom:70px;white-space:nowrap}.details{display:grid;grid-template-columns:1fr 1fr;gap:28px 55px;line-height:2.2}.field{border-bottom:1px dotted #777;min-height:34px}.label{font-weight:bold}.summary{margin-top:48px;border-top:1px solid #222;padding-top:24px;line-height:2.2}.signatures{display:grid;grid-template-columns:1fr 1fr;gap:70px;margin-top:70px;text-align:center}.signature{height:90px;border-bottom:1px solid #222}small{display:block;color:#555;margin-top:18px}</style></head><body><main class="sheet"><div class="brand">الجمهورية التونسية<br>وزارة الشؤون الاجتماعية<br>مطلب إجازة</div><h1 class="title">مطلب إجازة</h1><div class="checks"><span>${checked('SOLDE')} خالصة الأجر</span><span>${checked('NON_SOLDE')} غير خالصة الأجر</span><span>${checked('FAMILIAL')} لأسباب عائلية</span><span>${checked('AUTORISE')} مرخص فيها</span><span>${checked('COMPENSATION')} تعويض</span></div><section class="details"><div><span class="label">الاسم و اللقب:</span> ${escapeHtml(user.name)}</div><div><span class="label">الرقم الآلي:</span> ${escapeHtml(user.matricule)}</div><div><span class="label">المصلحة:</span> ${escapeHtml(user.function || '-')}</div><div><span class="label">الهاتف:</span> ${escapeHtml(user.phone || '-')}</div><div><span class="label">نوع الإجازة:</span> ${escapeHtml(type)}</div><div><span class="label">تاريخ تقديم الطلب:</span> ${formatDate(leave.DATE_DEMANDE)}</div><div><span class="label">تاريخ بداية الإجازة:</span> ${formatDate(leave.DATE_DEBUT)}</div><div><span class="label">تاريخ نهاية الإجازة:</span> ${formatDate(leave.DATE_FIN)}</div></section><section class="summary"><div><span class="label">عدد الأيام المطلوبة:</span> ${leave.NBR_JOURS || 0} يوم</div><div><span class="label">من ضمنها أيام العطل:</span> ${leave.NBR_FERIES || 0} يوم</div><div><span class="label">الرصيد السابق:</span> ${leave.SOLDE_AVANT ?? '-'} يوم</div><div><span class="label">الرصيد الحالي:</span> ${leave.SOLDE_APRES ?? '-'} يوم</div><div><span class="label">الحالة:</span> ${escapeHtml(leave.STATUT || 'EN_ATTENTE')}</div></section><div class="signatures"><div><div class="signature"></div><small>إمضاء العون</small></div><div><div class="signature"></div><small>رأي المسؤول</small></div></div></main><script>window.onload=()=>window.print();</script></body></html>`);
  printWindow.document.close();
}
function escapeHtml(value) { return String(value ?? '-').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character])); }
function buildLeavePrintHtml(leave, user, checked) {
  const field = (value) => escapeHtml(value || '-');
  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>طباعة مطلب إجازة</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:"Times New Roman",serif;background:#f0f0f0}.a4{width:210mm;min-height:297mm;background:#fff;margin:0 auto 20px;padding:15mm;position:relative;border:3px double #000;direction:rtl}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8mm}.header-date,.header-org{font-size:13pt;font-weight:bold}.header-org{text-align:left;line-height:1.5}.titre{text-align:center;font-size:22pt;font-style:italic;text-decoration:underline;font-weight:bold;margin-bottom:6mm}.checkboxes{display:flex;justify-content:space-around;direction:rtl;font-size:12pt;font-weight:bold;padding:4pt 6pt;margin-bottom:5mm}.checkboxes span{white-space:nowrap}.main-table{width:100%;border-collapse:collapse;font-size:13pt;font-weight:bold;direction:rtl}.main-table td{padding:12pt 8pt;vertical-align:middle}.lbl{text-align:right;white-space:nowrap;width:25%}.val{text-align:right;min-width:120px}.val2{text-align:right;min-width:120px;direction:ltr}.sep{width:12mm}.footer-sign{margin-top:20mm;display:flex;justify-content:space-between;direction:rtl;font-size:13pt;font-weight:bold}@media print{body{background:#fff}.a4{margin:0}}</style></head><body><div class="a4"><div class="header"><div class="header-org"><div>المجمع الكيميائي التونسي</div><div>الإدارة الجهوية للمعامل بقابس</div></div><div class="header-date">قابس في : ${formatDate(leave.DATE_DEMANDE)}</div></div><div class="titre">مطلب إجازة</div><div class="checkboxes"><span>${checked('SOLDE')} &nbsp; خالصة الأجر</span><span>${checked('NON_SOLDE')} &nbsp; غير خالصة الأجر</span><span>${checked('FAMILIAL')} &nbsp; لأسباب عائلية</span><span>${checked('AUTORISE')} &nbsp; مرخص فيها</span><span>${checked('COMPENSATION')} &nbsp; تعويض</span></div><table class="main-table"><tr><td class="lbl">الاسم و اللقب :</td><td class="val">${field(user.name)}</td><td class="sep"></td><td class="lbl">الرقم الآلي :</td><td class="val">${field(user.matricule)}</td></tr><tr><td class="lbl">المصلحة :</td><td class="val" colspan="2">${field(user.service || 'الإدارة الجهوية للمعامل بقابس')}</td><td class="lbl">المهنة :</td><td class="val">${field(user.function)}</td></tr><tr><td class="lbl">عدد الأيام المطلوبة :</td><td class="val">${leave.NBR_JOURS || 0}</td><td class="sep"></td><td class="lbl" colspan="2">من ضمنها : ( ${leave.NBR_FERIES || 0} يوم) أعياد رسمية</td></tr><tr><td class="lbl">تاريخ بداية الإجازة :</td><td class="val2">${formatDate(leave.DATE_DEBUT)}</td><td class="sep"></td><td class="lbl">تاريخ الرجوع :</td><td class="val2">${formatDate(leave.DATE_FIN)}</td></tr><tr><td class="lbl">الرصيد السابق :</td><td class="val">${leave.SOLDE_AVANT ?? '-'}</td><td class="sep"></td><td class="lbl">الرصيد الحالي :</td><td class="val">${leave.SOLDE_APRES ?? '-'}</td></tr><tr><td class="lbl" colspan="2">العنوان أثناء الإجازة : ${field(leave.ADRESSE_CONGE)} قابس</td><td class="sep"></td><td class="lbl">رقم الهاتف :</td><td class="val2">${field(user.phone)}</td></tr></table><div class="footer-sign"><span>إمضاء المعني بالأمر</span><span>إمضاء رئيس المصلحة</span></div></div><script>window.onload=()=>window.print();</script></body></html>`;
}
function UsersView({ users, setUsers, onNotify }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('Tous');
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const groups = ['Tous', ...new Set(users.map(({ role }) => role))];
  const filtered = users.filter((user) => (group === 'Tous' || user.role === group) && `${user.name} ${user.matricule} ${user.function}`.toLowerCase().includes(query.toLowerCase()));
  const toggle = (user) => fetch(`/api/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !user.active }) }).then((r) => r.json()).then((updated) => setUsers((current) => current.map((item) => item.id === updated.id ? updated : item))).catch((error) => onNotify(error.message, 'error'));
  const edit = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(['name', 'matricule', 'role', 'function', 'phone', 'password'].map((key) => [key, form.get(key)])); payload.active = form.get('active') === 'on'; fetch(`/api/users/${editingUser.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error); return result; }).then((updated) => { setUsers((current) => current.map((item) => item.id === updated.id ? updated : item)); setEditingUser(null); onNotify('Utilisateur modifié.', 'success'); }).catch((error) => onNotify(error.message, 'error')); };
  const add = (event) => { event.preventDefault(); const password = window.prompt('Mot de passe initial (8 caractères minimum)'); if (!password) return; if (password.length < 8) { onNotify('Le mot de passe doit contenir au moins 8 caractères.', 'error'); return; } const form = new FormData(event.currentTarget); const payload = Object.fromEntries(['name', 'matricule', 'role', 'function', 'phone'].map((key) => [key, form.get(key)])); payload.password = password; fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Création impossible.'); return result; }).then((user) => { setUsers((current) => [user, ...current]); setShowAdd(false); onNotify('Utilisateur ajouté.', 'success'); }).catch((error) => onNotify(error.message, 'error')); };
  return <><div className="admin-summary"><div><p className="eyebrow">CONTRÔLE DES ACCÈS</p><h2>Utilisateurs et habilitations</h2><p>Gérez les comptes autorisés à accéder à l’espace AGP.</p></div><button className="primary-button" onClick={() => setShowAdd(true)}><UserPlus size={18} />Ajouter un utilisateur</button></div><div className="filter-bar"><div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un nom ou matricule..." /></div><select className="filter-button" value={group} onChange={(event) => setGroup(event.target.value)}>{groups.map((item) => <option key={item}>{item}</option>)}</select></div><section className="panel list-panel"><div className="panel-heading"><div><p className="eyebrow">ANNUAIRE INTERNE</p><h2>{filtered.length} utilisateurs</h2></div><span className="admin-badge"><ShieldCheck size={15} />Accès administrateur</span></div><div className="table-wrap"><table><thead><tr><th>Utilisateur</th><th>Matricule</th><th>Groupe</th><th>Fonction</th><th>Téléphone</th><th>État</th><th>Action</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id}><td><div className="person-cell"><div className="person-avatar">{user.name.slice(0, 2)}</div><strong>{user.name}</strong></div></td><td>{user.matricule}</td><td><span className="role-chip">{user.role}</span></td><td>{user.function}</td><td>{user.phone}</td><td><span className={`status ${user.active ? 'teal' : 'gray'}`}><i />{user.active ? 'Actif' : 'Désactivé'}</span></td><td><button className="table-action" onClick={() => toggle(user)}>{user.active ? 'Désactiver' : 'Activer'}</button></td></tr>)}</tbody></table></div></section>{showAdd && <div className="modal-backdrop"><form className="modal" onSubmit={add}><div className="modal-header"><div><p className="eyebrow">NOUVEAU COMPTE</p><h2>Ajouter un utilisateur</h2></div><button type="button" className="close-button" onClick={() => setShowAdd(false)}><X size={19} /></button></div><label>Nom complet<input name="name" required placeholder="Nom et prénom" /></label><div className="form-grid"><label>Matricule<input name="matricule" required /></label><label>Groupe<select name="role" defaultValue="READER"><option>READER</option><option>CONTRIBUTOR</option><option>ADMINISTRATOR</option></select></label></div><label>Fonction<input name="function" placeholder="Fonction" /></label><label>Téléphone<input name="phone" placeholder="98 000 000" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAdd(false)}>Annuler</button><button className="primary-button" type="submit"><UserPlus size={17} />Créer le compte</button></div></form></div>}</>;
}
function Deadline({ day, month, title, refText, tone }) { return <div className="deadline"><div className={`date-tile ${tone}`}><strong>{day}</strong><span>{month}</span></div><div><strong>{title}</strong><span>{refText}</span></div><ChevronDown className="deadline-arrow" size={17} /></div> }
function ListView({ page, items, query, setQuery, onOpen, onSelectDossier }) {
  const language = useContext(LanguageContext);
  const selectOptions = useContext(SelectOptionsContext);
  const [statusFilter, setStatusFilter] = useState('');
  const rows = page === 'contrats' ? items.map((item) => ({ id: item.ID, reference: item.N_CONTRAT_BC || item.REF_AO || `CTR-${item.ID}`, title: item.OBJET || item.TITULAIRE_DU_MARCHÉ || 'Contrat sans intitulé', owner: item.RESPONSABLE || item.DEMANDEUR || 'Non renseigné', budget: Number(String(item.MONTANT || 0).replace(/\s/g, '').replace(',', '.')) || 0, status: item.ETAT || 'En attente', progress: item.ETAT === 'Clôturé' ? 100 : 55, date: item.DATE_FIN_DU_MARCHÉ })) : items;
  const visibleRows = rows.filter((item) => !statusFilter || item.status === statusFilter);
  const t = (fr, ar) => text(language, fr, ar);
  if (page === 'settings' || page === 'help' || page === 'reminders') return null;
  return <>
    <div className="filter-bar"><div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('Rechercher par référence, intitulé ou responsable...', 'ابحث بالمرجع أو الموضوع أو المسؤول...')} /></div><select className="filter-button" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">{t('Tous les statuts', 'كل الحالات')}</option>{selectOptions.procurementStatuses.map((status) => <option key={status} value={status}>{text(language, status, ({ 'À lancer': 'قيد التحضير', 'Préparation AO': 'تحضير طلب العروض', 'AO lancée': 'طلب عروض منشور', 'Évaluation': 'التقييم', 'Décision commission': 'قرار اللجنة', Attribué: 'مُسند', 'Contrat signé': 'العقد موقع', Exécution: 'التنفيذ', Clôturé: 'مغلق' })[status] || status)}</option>)}</select></div>
    <section className="panel list-panel"><div className="panel-heading"><div><p className="eyebrow">{page === 'appels' ? t('REGISTRE DES APPELS D’OFFRES', 'سجل طلبات العروض') : t('REGISTRE MÉTIER', 'السجل')}</p><h2>{page === 'appels' ? t(`${visibleRows.length} appels d’offres`, `${visibleRows.length} طلبات عروض`) : t(`${visibleRows.length} enregistrements`, `${visibleRows.length} سجلات`)}</h2></div>{onOpen && <button className="secondary-button" onClick={onOpen}><FilePlus2 size={17} />{t('Nouveau dossier', 'ملف جديد')}</button>}</div><DossierTable items={visibleRows} onSelectDossier={onSelectDossier} /></section>
  </>;
}
function DossierTable({ items, onSelectDossier }) {
  const language = useContext(LanguageContext);
  const t = (fr, ar) => text(language, fr, ar);
  return <div className="table-wrap"><table><thead><tr><th>{t('Référence', 'المرجع')}</th><th>{t('Intitulé', 'الموضوع')}</th><th>{t('Responsable', 'المسؤول')}</th><th>{t('Budget estimé', 'الميزانية التقديرية')}</th><th>{t('Statut', 'الحالة')}</th><th>{t('Avancement', 'التقدم')}</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><button type="button" className="link-button" onClick={() => onSelectDossier?.(item.id)}><strong className="ref">{item.reference}</strong></button></td><td><strong>{item.title}</strong><span className="muted">{t('Échéance', 'آخر أجل')} : {formatDate(item.date)}</span></td><td>{item.owner}</td><td>{new Intl.NumberFormat(language === 'ar' ? 'ar-TN' : 'fr-FR').format(item.budget || 0)} TND</td><td><span className={`status ${statusClass[item.status] || 'gray'}`}><i />{text(language, item.status, ({ 'À lancer': 'قيد التحضير', 'En attente': 'في الانتظار', 'En cours': 'قيد التنفيذ', Publié: 'منشور', Clôturé: 'مغلق' })[item.status] || item.status)}</span></td><td><div className="progress-row"><div className="progress"><span style={{ width: `${item.progress}%` }} /></div><small>{item.progress}%</small></div></td></tr>)}</tbody></table>{!items.length && <div className="empty-state"><ClipboardList size={30} /><p>{t('Aucun appel d’offres ne correspond à la recherche.', 'لا توجد طلبات عروض مطابقة للبحث.')}</p></div>}</div>;
}
function DashboardStatDetailView({ kind, items, onBack, onOpenDossier }) {
  const titleMap = {
    dossiers: 'Dossiers suivis',
    actifs: 'Dossiers actifs',
    contracts: 'Contrats en cours',
    reminders: 'Rappels à traiter'
  };
  const descriptionMap = {
    dossiers: 'Vue complète des dossiers suivis par l’équipe.',
    actifs: 'Suivi des dossiers actuellement en cours de réalisation.',
    contracts: 'Liste des contrats actifs et à suivre.',
    reminders: 'Points d’attention à traiter rapidement.'
  };

  return <section className="panel list-panel"><div className="panel-heading"><div><p className="eyebrow">TABLEAU DE BORD</p><h2>{titleMap[kind]}</h2></div><button className="secondary-button" onClick={onBack}>Retour</button></div><p className="detail-description compact">{descriptionMap[kind]}</p><div className="table-wrap"><table><thead><tr><th>Référence</th><th>Intitulé</th><th>Responsable</th><th>Statut</th><th>Échéance</th></tr></thead><tbody>{(items || []).map((item) => <tr key={item.id}><td><button type="button" className="link-button" onClick={() => onOpenDossier?.(item.id)}><strong className="ref">{item.reference}</strong></button></td><td><strong>{item.title}</strong></td><td>{item.owner}</td><td><span className={`status ${statusClass[item.status] || 'gray'}`}><i />{item.status}</span></td><td>{item.date ? new Date(item.date).toLocaleDateString('fr-FR') : '—'}</td></tr>)}</tbody></table></div>{!items?.length && <div className="empty-state"><ClipboardList size={30} /><p>Aucune donnée pour cette zone.</p></div>}</section>;
}

function DossierDetailView({ dossier, onBack, users }) {
  const language = useContext(LanguageContext);
  const selectOptions = useContext(SelectOptionsContext);
  const [attachments, setAttachments] = useState(dossier?.attachments || []);
  const [history, setHistory] = useState(dossier?.history || []);
  const [discussions, setDiscussions] = useState([]);
  const [discussionKind, setDiscussionKind] = useState('remark');
  const [discussionMessage, setDiscussionMessage] = useState('');
  const [discussionError, setDiscussionError] = useState('');
  const [stepLabel, setStepLabel] = useState(selectOptions.workflowSteps[0] || '');
  const [stepNote, setStepNote] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setAttachments(dossier?.attachments || []);
    setHistory(dossier?.history || []);
    setDiscussions([]);
    setFeedback('');
    setStepNote('');
    setDiscussionMessage('');
    setDiscussionError('');
    if (dossier?.id) {
      fetch(`/api/dossiers/${dossier.id}/discussions`).then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Chargement impossible.');
        setDiscussions(result);
      }).catch((error) => setDiscussionError(error.message));
    }
  }, [dossier]);

  const t = (fr, ar) => text(language, fr, ar);

  if (!dossier) {
    return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">{t('DOSSIER', 'الملف')}</p><h2>{t('Aucun dossier sélectionné', 'لم يتم اختيار ملف')}</h2></div></div><button className="secondary-button" onClick={onBack}>{t('Retour', 'رجوع')}</button></section>;
  }

  function handleAddAttachment(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get('attachment');
    if (!file || !file.name) {
      setFeedback('Sélectionnez un fichier avant d’ajouter une pièce jointe.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      fetch(`/api/dossiers/${dossier.id}/attachments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
          size: file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : 'Inconnu',
          dataUrl: typeof reader.result === 'string' ? reader.result : null
        })
      })
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'Ajout de pièce jointe impossible.');
          return result;
        })
        .then((attachment) => {
          setAttachments((current) => [attachment, ...current]);
          event.currentTarget.reset();
          setFeedback('');
        })
        .catch((error) => setFeedback(error.message));
    };
    reader.readAsDataURL(file);
  }

  function handleAddStep(event) {
    event.preventDefault();
    if (!stepNote.trim()) return;
    fetch(`/api/dossiers/${dossier.id}/steps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: stepLabel, note: stepNote.trim() })
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Ajout d’étape impossible.');
        return result;
      })
      .then((entry) => {
        setHistory((current) => [{
          id: entry.id,
          label: entry.label,
          date: entry.date,
          actor: entry.actor,
          note: entry.note
        }, ...current]);
        setStepNote('');
        setFeedback('');
      })
      .catch((error) => setFeedback(error.message));
  }

  function handleAddDiscussion(event) {
    event.preventDefault();
    const message = discussionMessage.trim();
    if (!message) return;
    fetch(`/api/dossiers/${dossier.id}/discussions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind: discussionKind, message })
    }).then(async (response) => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t('Envoi impossible.', 'تعذر الإرسال.'));
      return result;
    }).then((entry) => {
      setDiscussions((current) => [entry, ...current]);
      setDiscussionMessage('');
      setDiscussionError('');
    }).catch((error) => setDiscussionError(error.message));
  }

  return <div className="detail-page">
    <header className="detail-header">
      <div>
        <p className="eyebrow">{t('FICHE DOSSIER', 'بطاقة الملف')}</p>
        <h2>{dossier.reference}</h2>
      </div>
      <div className="detail-header-actions">
        <span className={`status ${statusClass[dossier.status] || 'gray'}`}><i />{text(language, dossier.status, ({ 'À lancer': 'قيد التحضير', 'En attente': 'في الانتظار', 'En cours': 'قيد التنفيذ', Publié: 'منشور', Clôturé: 'مغلق' })[dossier.status] || dossier.status)}</span>
        <button type="button" className="secondary-button" onClick={onBack}>{t('Retour aux appels d’offres', 'العودة إلى طلبات العروض')}</button>
      </div>
    </header>

    <section className="detail-summary-grid">
      <article className="detail-summary-card highlight">
        <span className="detail-label">{t('Intitulé', 'الموضوع')}</span>
        <strong>{dossier.title}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">{t('Nature de dépense', 'نوع المصاريف')}</span>
        <strong>{dossier.nature_depense || dossier.nature || '—'}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">{t('Responsable', 'المسؤول')}</span>
        <strong>{dossier.owner}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">{t('Attribué à', 'المكلف بالملف')}</span>
        <strong>{dossier.assignedUser}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">{t('Budget', 'الميزانية')}</span>
        <strong>{new Intl.NumberFormat('fr-FR').format(dossier.budget || 0)} TND</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">{t('Date limite', 'آخر أجل')}</span>
        <strong>{dossier.date ? new Date(dossier.date).toLocaleDateString('fr-FR') : 'Non renseignée'}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">{t('Avancement', 'التقدم')}</span>
        <strong>{dossier.progress || 0}%</strong>
      </article>
    </section>

    <section className="detail-main-grid">
      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>{t('Informations du marché', 'معلومات الصفقة')}</h3>
        </div>
        <p className="detail-description">{dossier.description}</p>
        <div className="document-metadata">
          <div><span>{t('Référence', 'المرجع')}</span><strong>{dossier.reference}</strong></div>
          <div><span>{t('Responsable', 'المسؤول')}</span><strong>{dossier.assignedUser}</strong></div>
          <div><span>{t('Mode de passation', 'طريقة إبرام الصفقة')}</span><strong>{dossier.mode_passation || '—'}</strong></div>
          <div><span>{t('Nature de la commande', 'نوعية الطلب')}</span><strong>{dossier.nature_commande || '—'}</strong></div>
          <div><span>{t('Commission', 'اللجنة')}</span><strong>{dossier.commission || '—'}</strong></div>
          <div><span>{t('Description', 'الوصف')}</span><strong>{dossier.description || '—'}</strong></div>
        </div>
      </div>

      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>{t('Chronologie', 'سجل المتابعة')}</h3>
          <span className="mini-chip">{history.length} étapes</span>
        </div>
        <div className="timeline">
          {history.map((step) => <div key={step.id} className="timeline-item"><div className="timeline-dot" /><div className="timeline-content"><div className="timeline-meta"><strong>{step.label}</strong><span>{step.date ? new Date(step.date).toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR') : t('Date inconnue', 'تاريخ غير معروف')}</span></div><small>{step.actor}</small><p>{step.note}</p></div></div>)}
        </div>
        <form className="step-form" onSubmit={handleAddStep}>
          <select value={stepLabel} onChange={(event) => setStepLabel(event.target.value)}>
            {selectOptions.workflowSteps.map((step) => <option key={step} value={step}>{step}</option>)}
          </select>
          <textarea value={stepNote} onChange={(event) => setStepNote(event.target.value)} rows="3" placeholder={t('Ajouter une note sur cette étape...', 'أضف ملاحظة لهذه المرحلة...')} />
          <button type="submit" className="primary-button">{t('Ajouter une étape', 'إضافة مرحلة')}</button>
        </form>
      </div>
    </section>

    <section className="detail-main-grid">
      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>{t('Pièces jointes', 'المرفقات')}</h3>
          <span className="mini-chip">{attachments.length} {t('fichiers', 'ملفات')}</span>
        </div>
        <ul className="attachment-list">
          {attachments.map((file) => <li key={file.id} className="attachment-item"><div className="attachment-copy"><strong>{file.name}</strong><span>{file.type} • {file.size} • {file.uploadedAt}</span></div>{file.dataUrl ? <a className="table-action" href={file.dataUrl} target="_blank" rel="noreferrer">{t('Ouvrir', 'فتح')}</a> : <button type="button" className="table-action">{t('Télécharger', 'تنزيل')}</button>}</li>)}
        </ul>
        <form className="upload-form" onSubmit={handleAddAttachment}>
          <input type="file" name="attachment" />
          <button type="submit" className="primary-button">{t('Ajouter une pièce jointe', 'إضافة مرفق')}</button>
        </form>
        {feedback && <p className="form-error">{feedback}</p>}
      </div>

      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>{t('Informations complémentaires', 'معلومات إضافية')}</h3>
        </div>
        <div className="document-metadata side">
          <div><span>{t('Statut', 'الحالة')}</span><strong>{dossier.status}</strong></div>
          <div><span>{t('Échéance', 'آخر أجل')}</span><strong>{dossier.date ? formatDate(dossier.date) : t('Non renseignée', 'غير محدد')}</strong></div>
          <div><span>{t('Avancement', 'التقدم')}</span><strong>{dossier.progress || 0}%</strong></div>
          <div><span>{t('Budget', 'الميزانية')}</span><strong>{new Intl.NumberFormat('fr-FR').format(dossier.budget || 0)} TND</strong></div>
        </div>
      </div>
    </section>

    <section className="detail-section-card discussion-section">
      <div className="detail-section-head"><div><h3>{t('Remarques et clarifications', 'الملاحظات وطلبات التوضيح')}</h3><p className="detail-description">{t('Échanges associés à ce dossier.', 'المراسلات المرتبطة بهذا الملف.')}</p></div><span className="mini-chip">{discussions.length}</span></div>
      <form className="discussion-form" onSubmit={handleAddDiscussion}>
        <label>{t('Type de message', 'نوع الرسالة')}<select value={discussionKind} onChange={(event) => setDiscussionKind(event.target.value)}><option value="remark">{t('Remarque', 'ملاحظة')}</option><option value="clarification">{t('Demande de clarification', 'طلب توضيح')}</option></select></label>
        <label>{t('Votre message', 'رسالتك')}<textarea value={discussionMessage} onChange={(event) => setDiscussionMessage(event.target.value)} rows="3" required placeholder={t('Saisissez une remarque ou votre question...', 'اكتب ملاحظة أو سؤالاً...')} /></label>
        <button type="submit" className="primary-button">{t('Ajouter au dossier', 'إضافة إلى الملف')}</button>
      </form>
      {discussionError && <p className="form-error">{discussionError}</p>}
      <div className="discussion-list">{discussions.map((entry) => <article className="discussion-item" key={entry.id}><div className="discussion-item-head"><div className="discussion-tags"><span className={`discussion-kind ${entry.kind}`}>{entry.kind === 'clarification' ? t('Clarification', 'طلب توضيح') : t('Remarque', 'ملاحظة')}</span>{entry.kind === 'clarification' && <span className="discussion-state">{t('Ouverte', 'مفتوحة')}</span>}</div><time>{entry.date ? new Date(entry.date).toLocaleString(language === 'ar' ? 'ar-TN' : 'fr-FR') : ''}</time></div><p>{entry.message}</p><small>{entry.actor}</small></article>)}{!discussions.length && <p className="empty-state">{t('Aucune remarque ni demande pour le moment.', 'لا توجد ملاحظات أو طلبات حالياً.')}</p>}</div>
    </section>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
