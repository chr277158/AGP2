import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, Bell, CalendarDays, ChevronDown, CircleHelp, ClipboardList, FilePlus2, Files, LayoutDashboard, LogOut, Menu, Printer, Search, Settings2, ShieldCheck, UserPlus, Users, X } from 'lucide-react';
import './styles.css';
import './admin.css';
import './leave.css';

const navItems = [
  { label: 'Tableau de bord', icon: LayoutDashboard, key: 'dashboard' },
  { label: 'Dossiers', icon: ClipboardList, key: 'dossiers' },
  { label: 'Appels d’offres', icon: Files, key: 'appels' },
  { label: 'Contrats', icon: Files, key: 'contrats' },
  { label: 'Calendrier', icon: CalendarDays, key: 'calendar' },
  { label: 'Suivi des modifications', icon: Activity, key: 'audit' },
  { label: 'Administration utilisateurs', icon: Users, key: 'users' }
  , { label: 'Mes Congés', icon: CalendarDays, key: 'leaves' }
  , { label: 'Mon profil', icon: Settings2, key: 'profile' }
];

const statusClass = { 'En cours': 'teal', 'À lancer': 'amber', Publié: 'blue', Clôturé: 'gray', 'En attente': 'rose' };

function normalizeReference(value) {
  return String(value ?? '').trim().toUpperCase();
}

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
  const [dossiers, setDossiers] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [currentUser, setCurrentUser] = useState({ name: '', matricule: '', function: '', role: 'READER' });
  const [signedIn, setSignedIn] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, contracts: 0, reminders: 0, budget: 0 });
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

  useEffect(() => {
    Promise.all([
      fetchJson('/api/dossiers'),
      fetchJson('/api/stats'),
      fetchJson('/api/tables/contrats'),
      fetchJson('/api/users')
      , fetchJson('/api/my-leaves'), fetchJson('/api/me')
    ])
      .then(([items, summary, contractItems, userItems, leaveItems, user]) => { setDossiers(items); setStats(summary); setContrats(contractItems); setUsers(userItems); setLeaves(leaveItems); setCurrentUser(user); setSignedIn(true); })
      .catch((error) => { setSignedIn(false); if (error) notify('Connectez-vous pour accéder à votre espace.', 'warning'); });
  }, []);

  const isAdmin = currentUser.role === 'ADMINISTRATOR';
  const visibleNavItems = navItems.filter((item) => item.key !== 'users' || isAdmin);
  const filtered = dossiers.filter((item) => `${item.reference} ${item.title} ${item.owner} ${item.status}`.toLowerCase().includes(query.toLowerCase()));
  const title = page === 'dossier-detail' ? 'Détail du dossier' : page === 'dashboard-dossiers' ? 'Dossiers suivis' : page === 'dashboard-actifs' ? 'Dossiers actifs' : page === 'dashboard-contracts' ? 'Contrats en cours' : page === 'dashboard-reminders' ? 'Rappels à traiter' : navItems.find((item) => item.key === page)?.label || 'Tableau de bord';

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

  if (signedIn === null) return null;
  if (!signedIn) return <LoginView error={loginError} onLogin={(user) => { setCurrentUser(user); setSignedIn(true); setLoginError(''); window.location.reload(); }} onError={setLoginError} />;

  function createDossier(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      reference: normalizeReference(form.get('reference')),
      title: form.get('title'),
      owner: form.get('owner'),
      assigned_to: Number(form.get('assigned_to')),
      budget: Number(form.get('budget')),
      date: form.get('date')
    };
    fetch('/api/dossiers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Création du dossier impossible.');
        return result;
      })
      .then((item) => { setDossiers((current) => [item, ...current]); setShowForm(false); notify('Dossier créé avec succès.', 'success'); })
      .catch((error) => notify(error.message, 'error'));
  }

  function createLeave(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const dateStart = form.get('dateStart');
    const dateEnd = form.get('dateEnd');
    const holidays = Math.max(0, Math.trunc(Number(form.get('holidays') || 0)));
    const numberOfDays = calculateLeaveDays(dateStart, dateEnd, holidays);
    const payload = { type: form.get('type'), requestDate: form.get('requestDate'), dateStart, dateEnd, holidays, address: form.get('address'), numberOfDays };
    fetch('/api/my-leaves', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Création impossible.'); return result; })
      .then((item) => { setLeaves((current) => [item, ...current]); setShowLeaveForm(false); setLeaveDays(0); notify('Demande de congé créée avec succès.', 'success'); })
      .catch((error) => notify(error.message, 'error'));
  }

  function updateLeaveDays(event) {
    const form = event.currentTarget.form;
    setLeaveDays(calculateLeaveDays(form.dateStart.value, form.dateEnd.value, form.holidays.value));
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">A</div><div><strong>AGP</strong><span>Suivi des dossiers</span></div></div>
      <div className="workspace-label">ESPACE DE TRAVAIL</div>
      <nav>{visibleNavItems.map(({ label, icon: Icon, key }) => <button key={key} className={page === key ? 'nav-item active' : 'nav-item'} onClick={() => setPage(key)}><Icon size={18} /><span>{label}</span>{key === 'dossiers' && <b className="nav-count">18</b>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18} /><span>Paramètres</span></button><button className="nav-item"><CircleHelp size={18} /><span>Centre d’aide</span></button><div className="user-card"><div className="avatar">{getInitials(currentUser.name)}</div><div><strong>{currentUser.name}</strong><span>{currentUser.function || currentUser.role}</span></div><ChevronDown size={16} /></div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu"><Menu size={20} /></button><div className="breadcrumbs"><span>AGP</span><span>/</span><strong>{title}</strong></div><div className="top-actions"><button className="icon-button" title="Notifications"><Bell size={19} /><i /></button><div className="top-avatar">{getInitials(currentUser.name)}</div><button className="logout-button" onClick={() => { fetch('/api/logout', { method: 'POST' }); setSignedIn(false); }} title="Se déconnecter"><LogOut size={17} /><span>Se déconnecter</span></button></div></header>
      <section className="page-content">
        <div className="page-heading"><div><p className="eyebrow">MARDI 02 SEPTEMBRE 2026</p><h1>{page === 'dashboard' ? `Bonjour ${currentUser.name}, voici votre activité.` : title}</h1><p className="subheading">Pilotez les appels d’offres et gardez une vue claire sur vos engagements.</p></div>{page === 'leaves' ? <button className="primary-button" onClick={() => setShowLeaveForm(true)}><CalendarDays size={18} />Nouveau congé</button> : canManageDossiers(currentUser.role) ? <button className="primary-button" onClick={() => setShowForm(true)}><FilePlus2 size={18} />Nouveau dossier</button> : null}</div>
        {notice && <div className={`notice notice-${notice.tone}`}><ShieldCheck size={17} />{notice.message}<button onClick={() => setNotice(null)}><X size={16} /></button></div>}
        {page === 'dashboard' ? <Dashboard stats={stats} dossiers={dossiers} contrats={contrats} onOpen={() => setPage('dossiers')} onSelectDossier={openDossierDetail} onSelectStat={(key) => setPage(key)} /> : page === 'dashboard-dossiers' ? <DashboardStatDetailView kind="dossiers" items={dossiers} onBack={() => setPage('dashboard')} onOpenDossier={openDossierDetail} /> : page === 'dashboard-actifs' ? <DashboardStatDetailView kind="actifs" items={dossiers.filter((item) => item.status === 'En cours' || item.status === 'Publié')} onBack={() => setPage('dashboard')} onOpenDossier={openDossierDetail} /> : page === 'dashboard-contracts' ? <DashboardStatDetailView kind="contracts" items={contrats.map((item) => ({ id: item.ID, reference: item.N_CONTRAT_BC || item.REF_AO || `CTR-${item.ID}`, title: item.OBJET || item.TITULAIRE_DU_MARCHÉ || 'Contrat sans intitulé', owner: item.RESPONSABLE || item.DEMANDEUR || 'Non renseigné', budget: Number(String(item.MONTANT || 0).replace(/\s/g, '').replace(',', '.')) || 0, status: item.ETAT || 'En attente', progress: item.ETAT === 'Clôturé' ? 100 : 55, date: item.DATE_FIN_DU_MARCHÉ }))} onBack={() => setPage('dashboard')} onOpenDossier={() => setPage('dashboard')} /> : page === 'dashboard-reminders' ? <DashboardStatDetailView kind="reminders" items={dossiers.filter((item) => item.status === 'À lancer' || item.status === 'En attente').slice(0, 10)} onBack={() => setPage('dashboard')} onOpenDossier={openDossierDetail} /> : page === 'dossier-detail' ? <DossierDetailView dossier={selectedDossier} onBack={() => { setSelectedDossier(null); setPage('dashboard'); }} users={users} /> : page === 'users' ? <UsersView users={users} setUsers={setUsers} /> : page === 'leaves' ? <LeavesView leaves={leaves} user={currentUser} /> : page === 'profile' ? <ProfileView user={currentUser} onSaved={setCurrentUser} /> : <ListView page={page} items={page === 'contrats' ? contrats : filtered} query={query} setQuery={setQuery} onOpen={canManageDossiers(currentUser.role) ? () => setShowForm(true) : undefined} onSelectDossier={openDossierDetail} />}
      </section>
    </main>
    {showForm && <div className="modal-backdrop"><form className="modal" onSubmit={createDossier}><div className="modal-header"><div><p className="eyebrow">NOUVEL ENREGISTREMENT</p><h2>Créer un dossier</h2></div><button type="button" className="close-button" onClick={() => setShowForm(false)}><X size={19} /></button></div><label>Référence<input name="reference" onChange={(event) => { event.target.value = normalizeReference(event.target.value); }} placeholder="AO-2026-015" required /></label><label>Intitulé du dossier<input name="title" placeholder="Objet de l’appel d’offres" required /></label><div className="form-grid"><label>Responsable<input name="owner" defaultValue={currentUser.name} required /></label><label>Budget estimé<input name="budget" type="number" placeholder="0" required /></label></div><label>Attribuer à<select name="assigned_to" defaultValue={currentUser.id || ''} required>{users.filter((user) => user.active).map((user) => <option key={user.id} value={user.id}>{user.name} ({user.role})</option>)}</select></label><label>Date limite<input name="date" type="date" required /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Annuler</button><button className="primary-button" type="submit"><FilePlus2 size={17} />Créer le dossier</button></div></form></div>}
    {showLeaveForm && <div className="modal-backdrop"><form className="modal" onSubmit={createLeave}><div className="modal-header"><div><p className="eyebrow">NOUVELLE DEMANDE</p><h2>Nouveau congé</h2></div><button type="button" className="close-button" onClick={() => setShowLeaveForm(false)}><X size={19} /></button></div><label>Type de congé<select name="type" defaultValue="SOLDE" required><option value="SOLDE">Congé payé</option><option value="NON_SOLDE">Congé sans solde</option><option value="FAMILIAL">Raisons familiales</option><option value="AUTORISE">Congé autorisé</option><option value="COMPENSATION">Récupération</option></select></label><label>Date de demande<input name="requestDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label><div className="form-grid"><label>Date de début<input name="dateStart" type="date" onChange={updateLeaveDays} required /></label><label>Date de fin<input name="dateEnd" type="date" onChange={updateLeaveDays} required /></label></div><label>Nombre de jours<input name="numberOfDays" type="number" value={leaveDays} readOnly /></label><label>Jours fériés<input name="holidays" type="number" min="0" defaultValue="0" onChange={updateLeaveDays} /></label><label>Adresse pendant le congé<input name="address" placeholder="Adresse complète" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => { setShowLeaveForm(false); setLeaveDays(0); }}>Annuler</button><button className="primary-button" type="submit"><CalendarDays size={17} />Créer la demande</button></div></form></div>}
  </div>;
}

function Dashboard({ stats, dossiers, contrats, onOpen, onSelectDossier, onSelectStat }) { return <><div className="stats-grid"><Stat icon={ClipboardList} label="Dossiers suivis" value={stats.total} change="+6 ce mois" tone="teal" onClick={() => onSelectStat('dashboard-dossiers')} /><Stat icon={Activity} label="Dossiers actifs" value={stats.active} change="4 à traiter" tone="amber" onClick={() => onSelectStat('dashboard-actifs')} /><Stat icon={Files} label="Contrats en cours" value={stats.contracts} change="2 échéances proches" tone="blue" onClick={() => onSelectStat('dashboard-contracts')} /><Stat icon={Bell} label="Rappels à traiter" value={stats.reminders} change="Voir les rappels" tone="rose" onClick={() => onSelectStat('dashboard-reminders')} /></div><div className="dashboard-grid"><section className="panel large-panel"><div className="panel-heading"><div><p className="eyebrow">SUIVI OPÉRATIONNEL</p><h2>Dossiers récents</h2></div><button className="text-button" onClick={onOpen}>Voir tous les dossiers <span>→</span></button></div><DossierTable items={dossiers.slice(0, 4)} onSelectDossier={onSelectDossier} /></section><section className="panel deadline-panel"><div className="panel-heading"><div><p className="eyebrow">PROCHAINES ÉCHÉANCES</p><h2>À ne pas manquer</h2></div></div><div className="deadline-list"><Deadline day="08" month="SEP" title="Clôture des offres" refText="AO-2026-009" tone="rose" /><Deadline day="14" month="SEP" title="Ouverture des plis" refText="AO-2026-014" tone="amber" /><Deadline day="18" month="SEP" title="Commission d’évaluation" refText="AO-2026-004" tone="teal" /></div></section></div></> }
function Stat({ icon: Icon, label, value, change, tone, onClick }) { return <button type="button" className="stat-card is-clickable" onClick={onClick}><div className={`stat-icon ${tone}`}><Icon size={20} /></div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small className={tone}>{change}</small></div></button> }
function LeavesView({ leaves, user }) {
  const totalDays = leaves.reduce((sum, leave) => sum + Number(leave.NBR_JOURS || 0), 0);
  return <><div className="admin-summary"><div><p className="eyebrow">HISTORIQUE PERSONNEL</p><h2>Mes Congés</h2><p>Consultez uniquement vos demandes de congé et leur évolution.</p></div><div className="leave-total"><strong>{totalDays}</strong><span>jours demandés</span></div></div><section className="panel list-panel"><div className="panel-heading"><div><p className="eyebrow">MES DEMANDES</p><h2>{leaves.length} demande{leaves.length > 1 ? 's' : ''}</h2></div><span className="admin-badge"><ShieldCheck size={15} />Données personnelles</span></div><div className="table-wrap"><table><thead><tr><th>Période</th><th>Type</th><th>Durée</th><th>Solde avant</th><th>Solde après</th><th>Demande déposée le</th><th>Statut</th><th>Imprimer</th></tr></thead><tbody>{leaves.map((leave) => <tr key={leave.CONGE_ID}><td><strong>{formatDate(leave.DATE_DEBUT)} → {formatDate(leave.DATE_FIN)}</strong></td><td>{leave.TYPE_CONGE || 'Non renseigné'}</td><td><strong>{leave.NBR_JOURS || 0} jours</strong><span className="muted">{leave.NBR_FERIES || 0} jour(s) férié(s)</span></td><td>{leave.SOLDE_AVANT ?? '-'} jours</td><td>{leave.SOLDE_APRES ?? '-'} jours</td><td>{formatDate(leave.DATE_DEMANDE)}</td><td><span className={`status ${leave.STATUT === 'VALIDE' ? 'teal' : 'amber'}`}><i />{leave.STATUT || 'EN_ATTENTE'}</span></td><td><button className="table-action" onClick={() => printLeaveRequest(leave, user)} title="Imprimer la demande"><Printer size={16} />Imprimer</button></td></tr>)}</tbody></table></div>{leaves.length === 0 && <div className="empty-state"><CalendarDays size={30} /><p>Aucun congé enregistré pour votre compte.</p></div>}</section></>;
}
function formatDate(value) { return value ? new Date(value).toLocaleDateString('fr-FR') : '-'; }
function getInitials(name) { return String(name || '?').trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function LoginView({ error, onLogin, onError }) {
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ matricule: form.get('matricule'), password: form.get('password') }) })
      .then(async (response) => { const text = await response.text(); let result; try { result = JSON.parse(text); } catch { throw new Error(response.status === 404 ? 'Service de connexion indisponible. Redémarrez le serveur.' : 'Réponse invalide du serveur.'); } if (!response.ok) throw new Error(result.error || 'Connexion refusée.'); return result; })
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
    const payload = Object.fromEntries(['name', 'matricule', 'function', 'phone', 'password'].map((key) => [key, form.get(key)]));
    fetch(`/api/users/${user.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error); return result; }).then((updated) => { onSaved(updated); formElement.reset(); onNotify('Profil mis à jour.', 'success'); }).catch((error) => onNotify(error.message, 'error'));
  }
  return <section className="panel profile-panel"><div className="panel-heading"><div><p className="eyebrow">ESPACE PERSONNEL</p><h2>Mon profil</h2></div></div><form className="profile-form" onSubmit={save}><label>Nom et prénom<input name="name" defaultValue={user.name} required /></label><label>Matricule<input name="matricule" defaultValue={user.matricule} required /></label><label>Fonction<input name="function" defaultValue={user.function} /></label><label>Téléphone<input name="phone" defaultValue={user.phone} /></label><label>Nouveau mot de passe<input name="password" type="password" placeholder="Laisser vide pour conserver l’actuel" minLength="6" /></label><button className="primary-button" type="submit">Enregistrer mes modifications</button></form></section>;
}
function calculateLeaveDays(dateStart, dateEnd, holidays = 0) {
  if (!dateStart || !dateEnd) return 0;
  const start = new Date(`${dateStart}T00:00:00`);
  const end = new Date(`${dateEnd}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
  return Math.max(0, Math.floor((end - start) / 86400000) - Math.max(0, Math.trunc(Number(holidays) || 0)));
}
function printLeaveRequest(leave, user) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) return;
  const checked = (value) => value === leave.TYPE_CONGE ? '☑' : '☐';
  printWindow.document.write(buildLeavePrintHtml(leave, user, checked));
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
  const add = (event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const payload = Object.fromEntries(['name', 'matricule', 'role', 'function', 'phone'].map((key) => [key, form.get(key)])); fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then((r) => r.json()).then((user) => { setUsers((current) => [user, ...current]); setShowAdd(false); onNotify('Utilisateur ajouté.', 'success'); }).catch((error) => onNotify(error.message, 'error')); };
  return <><div className="admin-summary"><div><p className="eyebrow">CONTRÔLE DES ACCÈS</p><h2>Utilisateurs et habilitations</h2><p>Gérez les comptes autorisés à accéder à l’espace AGP.</p></div><button className="primary-button" onClick={() => setShowAdd(true)}><UserPlus size={18} />Ajouter un utilisateur</button></div><div className="filter-bar"><div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un nom ou matricule..." /></div><select className="filter-button" value={group} onChange={(event) => setGroup(event.target.value)}>{groups.map((item) => <option key={item}>{item}</option>)}</select></div><section className="panel list-panel"><div className="panel-heading"><div><p className="eyebrow">ANNUAIRE INTERNE</p><h2>{filtered.length} utilisateurs</h2></div><span className="admin-badge"><ShieldCheck size={15} />Accès administrateur</span></div><div className="table-wrap"><table><thead><tr><th>Utilisateur</th><th>Matricule</th><th>Groupe</th><th>Fonction</th><th>Téléphone</th><th>État</th><th>Action</th></tr></thead><tbody>{filtered.map((user) => <tr key={user.id}><td><div className="person-cell"><div className="person-avatar">{user.name.slice(0, 2)}</div><strong>{user.name}</strong></div></td><td>{user.matricule}</td><td><span className="role-chip">{user.role}</span></td><td>{user.function}</td><td>{user.phone}</td><td><span className={`status ${user.active ? 'teal' : 'gray'}`}><i />{user.active ? 'Actif' : 'Désactivé'}</span></td><td><button className="table-action" onClick={() => toggle(user)}>{user.active ? 'Désactiver' : 'Activer'}</button></td></tr>)}</tbody></table></div></section>{showAdd && <div className="modal-backdrop"><form className="modal" onSubmit={add}><div className="modal-header"><div><p className="eyebrow">NOUVEAU COMPTE</p><h2>Ajouter un utilisateur</h2></div><button type="button" className="close-button" onClick={() => setShowAdd(false)}><X size={19} /></button></div><label>Nom complet<input name="name" required placeholder="Nom et prénom" /></label><div className="form-grid"><label>Matricule<input name="matricule" required /></label><label>Groupe<select name="role" defaultValue="READER"><option>READER</option><option>CONTRIBUTOR</option><option>ADMINISTRATOR</option></select></label></div><label>Fonction<input name="function" placeholder="Fonction" /></label><label>Téléphone<input name="phone" placeholder="98 000 000" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowAdd(false)}>Annuler</button><button className="primary-button" type="submit"><UserPlus size={17} />Créer le compte</button></div></form></div>}</>;
}
function Deadline({ day, month, title, refText, tone }) { return <div className="deadline"><div className={`date-tile ${tone}`}><strong>{day}</strong><span>{month}</span></div><div><strong>{title}</strong><span>{refText}</span></div><ChevronDown className="deadline-arrow" size={17} /></div> }
function ListView({ page, items, query, setQuery, onOpen, onSelectDossier }) { const rows = page === 'contrats' ? items.map((item) => ({ id: item.ID, reference: item.N_CONTRAT_BC || item.REF_AO || `CTR-${item.ID}`, title: item.OBJET || item.TITULAIRE_DU_MARCHÉ || 'Contrat sans intitulé', owner: item.RESPONSABLE || item.DEMANDEUR || 'Non renseigné', budget: Number(String(item.MONTANT || 0).replace(/\s/g, '').replace(',', '.')) || 0, status: item.ETAT || 'En attente', progress: item.ETAT === 'Clôturé' ? 100 : 55, date: item.DATE_FIN_DU_MARCHÉ })) : items; return <><div className="filter-bar"><div className="search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher par référence, intitulé..." /></div><button className="filter-button">Tous les statuts <ChevronDown size={16} /></button><button className="filter-button">Responsable <ChevronDown size={16} /></button></div><section className="panel list-panel"><div className="panel-heading"><div><p className="eyebrow">{page === 'calendar' ? 'PLANNING' : 'REGISTRE MÉTIER'}</p><h2>{page === 'calendar' ? 'Calendrier des échéances' : `${rows.length} enregistrements`}</h2></div>{onOpen ? <button className="secondary-button" onClick={onOpen}><FilePlus2 size={17} />Ajouter</button> : null}</div>{page === 'calendar' ? <div className="calendar-placeholder"><CalendarDays size={36} /><h3>Septembre 2026</h3><p>Les échéances des dossiers apparaîtront ici.</p></div> : <DossierTable items={rows} onSelectDossier={onSelectDossier} />}</section></> }
function DossierTable({ items, onSelectDossier }) { return <div className="table-wrap"><table><thead><tr><th>Référence</th><th>Intitulé</th><th>Responsable</th><th>Budget estimé</th><th>Statut</th><th>Avancement</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><button type="button" className="link-button" onClick={() => onSelectDossier?.(item.id)}><strong className="ref">{item.reference}</strong></button></td><td><strong>{item.title}</strong><span className="muted">Échéance : {new Date(item.date).toLocaleDateString('fr-FR')}</span></td><td>{item.owner}</td><td>{new Intl.NumberFormat('fr-FR').format(item.budget)} TND</td><td><span className={`status ${statusClass[item.status] || 'gray'}`}><i />{item.status}</span></td><td><div className="progress-row"><div className="progress"><span style={{ width: `${item.progress}%` }} /></div><small>{item.progress}%</small></div></td></tr>)}</tbody></table></div> }
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
  const [attachments, setAttachments] = useState(dossier?.attachments || []);
  const [history, setHistory] = useState(dossier?.history || []);
  const [stepLabel, setStepLabel] = useState('Analyse');
  const [stepNote, setStepNote] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setAttachments(dossier?.attachments || []);
    setHistory(dossier?.history || []);
    setFeedback('');
    setStepNote('');
  }, [dossier]);

  if (!dossier) {
    return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">DOSSIER</p><h2>Aucun dossier sélectionné</h2></div></div><button className="secondary-button" onClick={onBack}>Retour</button></section>;
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

  return <div className="detail-page">
    <header className="detail-header">
      <div>
        <p className="eyebrow">FICHE DOSSIER</p>
        <h2>{dossier.reference}</h2>
      </div>
      <div className="detail-header-actions">
        <span className={`status ${statusClass[dossier.status] || 'gray'}`}><i />{dossier.status}</span>
        <button type="button" className="secondary-button" onClick={onBack}>Retour</button>
      </div>
    </header>

    <section className="detail-summary-grid">
      <article className="detail-summary-card highlight">
        <span className="detail-label">Intitulé</span>
        <strong>{dossier.title}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">Nature</span>
        <strong>{dossier.nature}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">Responsable</span>
        <strong>{dossier.owner}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">Attribué à</span>
        <strong>{dossier.assignedUser}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">Budget</span>
        <strong>{new Intl.NumberFormat('fr-FR').format(dossier.budget || 0)} TND</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">Date limite</span>
        <strong>{dossier.date ? new Date(dossier.date).toLocaleDateString('fr-FR') : 'Non renseignée'}</strong>
      </article>
      <article className="detail-summary-card">
        <span className="detail-label">Avancement</span>
        <strong>{dossier.progress || 0}%</strong>
      </article>
    </section>

    <section className="detail-main-grid">
      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>Description documentaire</h3>
        </div>
        <p className="detail-description">{dossier.description}</p>
        <div className="document-metadata">
          <div><span>Référence</span><strong>{dossier.reference}</strong></div>
          <div><span>Responsable</span><strong>{dossier.owner}</strong></div>
          <div><span>Assigné</span><strong>{dossier.assignedUser}</strong></div>
          <div><span>Nature</span><strong>{dossier.nature}</strong></div>
        </div>
      </div>

      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>Chronologie</h3>
          <span className="mini-chip">{history.length} étapes</span>
        </div>
        <div className="timeline">
          {history.map((step) => <div key={step.id} className="timeline-item"><div className="timeline-dot" /><div className="timeline-content"><div className="timeline-meta"><strong>{step.label}</strong><span>{step.date ? new Date(step.date).toLocaleDateString('fr-FR') : 'Date inconnue'}</span></div><small>{step.actor}</small><p>{step.note}</p></div></div>)}
        </div>
        <form className="step-form" onSubmit={handleAddStep}>
          <select value={stepLabel} onChange={(event) => setStepLabel(event.target.value)}>
            <option value="Analyse">Analyse</option>
            <option value="Validation">Validation</option>
            <option value="Appel d’offres">Appel d’offres</option>
            <option value="Négociation">Négociation</option>
            <option value="Décision">Décision</option>
          </select>
          <textarea value={stepNote} onChange={(event) => setStepNote(event.target.value)} rows="3" placeholder="Ajouter une note sur cette étape..." />
          <button type="submit" className="primary-button">Ajouter une étape</button>
        </form>
      </div>
    </section>

    <section className="detail-main-grid">
      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>Pièces jointes</h3>
          <span className="mini-chip">{attachments.length} fichiers</span>
        </div>
        <ul className="attachment-list">
          {attachments.map((file) => <li key={file.id} className="attachment-item"><div className="attachment-copy"><strong>{file.name}</strong><span>{file.type} • {file.size} • {file.uploadedAt}</span></div>{file.dataUrl ? <a className="table-action" href={file.dataUrl} target="_blank" rel="noreferrer">Ouvrir</a> : <button type="button" className="table-action">Télécharger</button>}</li>)}
        </ul>
        <form className="upload-form" onSubmit={handleAddAttachment}>
          <input type="file" name="attachment" />
          <button type="submit" className="primary-button">Ajouter une pièce jointe</button>
        </form>
        {feedback && <p className="form-error">{feedback}</p>}
      </div>

      <div className="detail-section-card">
        <div className="detail-section-head">
          <h3>Informations complémentaires</h3>
        </div>
        <div className="document-metadata side">
          <div><span>Statut</span><strong>{dossier.status}</strong></div>
          <div><span>Échéance</span><strong>{dossier.date ? new Date(dossier.date).toLocaleDateString('fr-FR') : 'Non renseignée'}</strong></div>
          <div><span>Avancement</span><strong>{dossier.progress || 0}%</strong></div>
          <div><span>Budget</span><strong>{new Intl.NumberFormat('fr-FR').format(dossier.budget || 0)} TND</strong></div>
        </div>
      </div>
    </section>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
