import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { XMLParser } from 'fast-xml-parser';
import ExcelJS from 'exceljs';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

const xmlPath = path.join(process.cwd(), 'données', 'cc (1).xml');
const dataPath = path.join(process.cwd(), 'données');
const statusNames = { 1: 'À lancer', 2: 'En attente', 3: 'En cours', 4: 'Publié', 5: 'En cours', 6: 'Clôturé' };
const sessions = new Map();
const hasLocalXml = fs.existsSync(xmlPath);
const hasLocalDataDir = fs.existsSync(dataPath);

if (!hasLocalDataDir) {
  fs.mkdirSync(dataPath, { recursive: true });
}

function parseBudget(value) {
  if (value === undefined || value === null || value === '') return 0;
  return Number(String(value).replace(/\s/g, '').replace(',', '.')) || 0;
}

function toPostgresQuery(sql, params = []) {
  let number = 0;
  const text = sql.replace(/\?/g, () => {
    number += 1;
    return `$${number}`;
  });
  return { text, values: params };
}

function createDatabaseAdapter() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false
    });

    return {
      async exec(sql) {
        const statements = sql.split(';').map((part) => part.trim()).filter(Boolean);
        for (const statement of statements) {
          await pool.query(statement);
        }
      },
      prepare(sql) {
        const execute = async (...params) => {
          const query = toPostgresQuery(sql, params);
          return pool.query(query.text, query.values);
        };

        return {
          async run(...params) {
            const sqlToRun = /^\s*INSERT\b/i.test(sql) && !/RETURNING\b/i.test(sql)
              ? `${sql.trim()} RETURNING id`
              : sql;
            const result = await pool.query(toPostgresQuery(sqlToRun, params).text, toPostgresQuery(sqlToRun, params).values);
            return { lastInsertRowid: result.rows?.[0]?.id ?? null, changes: result.rowCount ?? 0 };
          },
          async get(...params) {
            const result = await execute(...params);
            return result.rows[0] ?? undefined;
          },
          async all(...params) {
            const result = await execute(...params);
            return result.rows ?? [];
          }
        };
      }
    };
  }

  const sqlite = new DatabaseSync(path.join(process.cwd(), 'agp.sqlite'));
  return {
    exec(sql) {
      sqlite.exec(sql);
    },
    prepare(sql) {
      return sqlite.prepare(sql);
    }
  };
}

const database = createDatabaseAdapter();

function loadDossiers() {
  if (!hasLocalXml) {
    return [];
  }

  const xml = fs.readFileSync(xmlPath, 'utf8');
  const parsed = new XMLParser({ isArray: (name) => name === 'ROW' }).parse(xml);
  return parsed.ROWSET.ROW.map((row) => ({
    id: Number(row.ID),
    reference: row.REF_AO || `DOS-${row.ID}`,
    title: row.OBJET_CCT || 'Sans intitulé',
    owner: row.CREER_PAR || 'Non renseigné',
    budget: parseBudget(row.BUDGET),
    status: statusNames[row.STATUS] || 'En attente',
    progress: statusNames[row.STATUS] === 'Clôturé' ? 100 : Number(row.STATUS) === 4 ? 68 : Number(row.STATUS) === 3 ? 45 : 20,
    date: row.DATE_LIMITE_PROPOSÉE || row.DATE_OUVERTURE_DES_PLIS || row.DATE_DE_LANC || row.DATE_DE_CRÉATION || null,
    nature: row.NATURE_DE_DEPENSE || 'Non renseignée'
  }));
}

function excelDate(value, fieldName = '') {
  if (!/(DATE|DAT|JOURS)/i.test(fieldName)) return value ?? null;
  if (typeof value !== 'number') return value || null;
  const epoch = Date.UTC(1899, 11, 30);
  return new Date(epoch + value * 86400000).toISOString();
}

async function loadXlsx(fileName) {
  const filePath = path.join(dataPath, fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];
    const headers = sheet.getRow(1).values.slice(1);
    const rows = [];
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const values = row.values.slice(1);
      rows.push(Object.fromEntries(headers.map((header, index) => [header, excelDate(values[index], header)])));
    });
    return rows;
  } catch (error) {
    console.warn(`Ignoring unreadable data file ${fileName}: ${error.message}`);
    return [];
  }
}

const dossiers = loadDossiers();
const tables = await Promise.all([
  ['contrats', 'contrats (1).xlsx'], ['clarifications', 'demande_clarification (1).xlsx'],
  ['fichiersLancement', 'fichier_lncement (1).xlsx'], ['membres', 'membre.xlsx'],
  ['remarques', 'remarque (1).xlsx'], ['previsions', 'previs_annuel (1).xlsx'],
  ['soldesConge', 'solde_conge.xlsx'], ['suivi', 'suivi (2).xlsx'],
  ['suiviModifications', 'suivi_modif (2).xlsx'], ['conges', 't_conge.xlsx'],
  ['utilisateurs', 't_user (2).xlsx'], ['notes', 'user_notes (1).xlsx'],
  ['heuresSupplementaires', 'heur_spp.xlsx']
].map(async ([name, fileName]) => [name, await loadXlsx(fileName)])).then(Object.fromEntries);

await database.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    matricule TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'READER',
    function_name TEXT,
    phone TEXT,
    password_hash TEXT,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS dossier_history (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    dossier_id INTEGER NOT NULL,
    label TEXT NOT NULL,
    note TEXT NOT NULL,
    actor TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS dossier_attachments (
    id INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    dossier_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_url TEXT
  );
`);

const insertUser = database.prepare(`INSERT INTO users (id, name, matricule, role, function_name, phone, password_hash)
  VALUES (?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(id) DO UPDATE SET name = excluded.name, matricule = excluded.matricule,
    role = excluded.role, function_name = excluded.function_name, phone = excluded.phone`);

for (const user of tables.utilisateurs || []) {
  const password = String(user.MDP || randomBytes(16).toString('hex'));
  const salt = randomBytes(16).toString('hex');
  const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
  await insertUser.run(Number(user.ID_1), user.NOM || 'Sans nom', String(user.MATRICULE || ''), user.GROUPE || 'READER', user.FONCTION || 'Non renseignée', user.TEL || 'Non renseigné', passwordHash);
}

const userFields = 'id, name, matricule, role, function_name AS "function", phone, active, created_at';
const currentUserId = 6;

function buildDefaultHistory(dossier, assignee = null) {
  const actor = assignee?.name || dossier.owner || 'Chef de projet';
  return [
    { id: 1, label: 'Dossier créé', date: dossier.date || today(), actor: dossier.owner || 'Système', note: 'Le dossier a été enregistré et transmis au responsable.' },
    { id: 2, label: 'Analyse initiale', date: dossier.date || today(), actor, note: 'Vérification du besoin et validation de la cible.' },
    { id: 3, label: 'Étude de faisabilité', date: dossier.date || today(), actor, note: 'Contrôle de la conformité et préparation du dossier d’appel d’offres.' }
  ];
}

function buildDefaultAttachments(dossier) {
  return [
    { id: 1, name: 'Cahier des charges.pdf', type: 'PDF', size: '1.6 Mo', uploadedAt: dossier.date || today() },
    { id: 2, name: 'Devis initial.xlsx', type: 'XLSX', size: '842 KB', uploadedAt: dossier.date || today() }
  ];
}

async function buildDossierDetailPayload(dossier) {
  if (!dossier) return null;
  const assignee = await database.prepare('SELECT id, name FROM users WHERE id = ?').get(dossier.assigned_to);
  const historyRows = await database.prepare('SELECT * FROM dossier_history WHERE dossier_id = ? ORDER BY created_at DESC').all(dossier.id);
  const attachmentRows = await database.prepare('SELECT * FROM dossier_attachments WHERE dossier_id = ? ORDER BY uploaded_at DESC').all(dossier.id);
  const history = historyRows.length ? historyRows.map((row) => ({
    id: row.id,
    label: row.label,
    date: row.created_at ? String(row.created_at).slice(0, 10) : today(),
    actor: row.actor,
    note: row.note
  })) : buildDefaultHistory(dossier, assignee);

  const attachments = attachmentRows.length ? attachmentRows.map((row) => ({
    id: row.id,
    name: row.name,
    type: row.type,
    size: row.size,
    uploadedAt: row.uploaded_at ? String(row.uploaded_at).slice(0, 10) : today(),
    dataUrl: row.data_url || null
  })) : buildDefaultAttachments(dossier);

  return {
    ...dossier,
    assignedUser: assignee?.name || dossier.owner || 'Non attribué',
    nature: dossier.nature || 'Marché public',
    description: dossier.description || 'Ce dossier est en cours de suivi. Le chef de projet vérifie la conformité, le plan de passation et les pièces justificatives avant validation.',
    history,
    attachments
  };
}

function getSessionUser(req) {
  const token = req.headers.cookie?.match(/(?:^|;\s*)agp_session=([^;]+)/)?.[1];
  return token ? sessions.get(token) : null;
}

function requireSession(req, res, next) {
  const userId = getSessionUser(req);
  if (!userId) return res.status(401).json({ error: 'Session expirée. Veuillez vous connecter.' });
  req.userId = userId;
  next();
}

function canManageDossiers(role) {
  return role === 'ADMINISTRATOR' || role === 'CONTRIBUTOR';
}

function getVisibleDossiersForUser(userId, role) {
  const currentUserIdNumber = Number(userId);
  if (canManageDossiers(role)) return dossiers;
  return dossiers.filter((dossier) => {
    if (dossier.assigned_to === undefined || dossier.assigned_to === null || dossier.assigned_to === '') return true;
    return Number(dossier.assigned_to) === currentUserIdNumber;
  });
}

function today() { return new Date().toISOString().slice(0, 10); }

app.post('/api/login', async (req, res) => {
  const user = await database.prepare('SELECT id, password_hash FROM users WHERE matricule = ? AND active = 1').get(String(req.body.matricule || '').trim());
  if (!user || !req.body.password) return res.status(401).json({ error: 'Matricule ou mot de passe incorrect.' });
  const [salt, storedHash] = String(user.password_hash || '').split(':');
  const suppliedHash = scryptSync(String(req.body.password), salt, 64);
  if (!salt || !storedHash || !timingSafeEqual(suppliedHash, Buffer.from(storedHash, 'hex'))) return res.status(401).json({ error: 'Matricule ou mot de passe incorrect.' });
  const token = randomBytes(32).toString('hex');
  sessions.set(token, user.id);
  res.setHeader('Set-Cookie', `agp_session=${token}; HttpOnly; SameSite=Lax; Path=/`);
  res.json({ ok: true });
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'AGP' }));

app.get('/api/dossiers', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  res.json(getVisibleDossiersForUser(req.userId, requester?.role));
});

app.get('/api/dossiers/:id', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  const dossierId = Number(req.params.id);
  const dossier = dossiers.find((item) => Number(item.id) === dossierId);
  if (!dossier) return res.status(404).json({ error: 'Dossier introuvable.' });
  const visible = getVisibleDossiersForUser(req.userId, requester?.role);
  if (!visible.some((item) => Number(item.id) === dossierId)) {
    return res.status(403).json({ error: 'Vous ne pouvez pas consulter ce dossier.' });
  }
  res.json(await buildDossierDetailPayload(dossier));
});

app.get('/api/tables', (_req, res) => res.json(Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.length]))));
app.get('/api/tables/:table', (req, res) => {
  const rows = tables[req.params.table];
  if (!rows) return res.status(404).json({ error: 'Table non trouvée' });
  res.json(rows);
});

app.get('/api/users', requireSession, async (_req, res) => {
  const rows = await database.prepare(`SELECT ${userFields} FROM users ORDER BY id DESC`).all();
  res.json(rows.map((user) => ({ ...user, active: Boolean(user.active) })));
});

app.post('/api/users', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  if (requester?.role !== 'ADMINISTRATOR') return res.status(403).json({ error: 'Droits administrateur requis.' });
  const { name, matricule, role = 'READER', function: functionName = 'Non renseignée', phone = 'Non renseigné' } = req.body;
  if (!name || !matricule) return res.status(400).json({ error: 'Nom et matricule obligatoires' });
  try {
    const result = await database.prepare(`INSERT INTO users (name, matricule, role, function_name, phone) VALUES (?, ?, ?, ?, ?)`)
      .run(name, matricule, role, functionName, phone);
    const user = await database.prepare(`SELECT ${userFields} FROM users WHERE id = ?`).get(result.lastInsertRowid);
    res.status(201).json({ ...user, active: Boolean(user.active) });
  } catch (error) {
    res.status(409).json({ error: error.message.includes('UNIQUE') ? 'Ce matricule existe déjà' : 'Création impossible' });
  }
});

app.put('/api/users/:id', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  const targetId = Number(req.params.id);
  if (requester?.role !== 'ADMINISTRATOR' && req.userId !== targetId) return res.status(403).json({ error: 'Vous ne pouvez modifier que votre profil.' });
  const current = await database.prepare('SELECT id FROM users WHERE id = ?').get(targetId);
  if (!current) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  const fields = { name: req.body.name, matricule: req.body.matricule, function_name: req.body.function, phone: req.body.phone, active: requester?.role === 'ADMINISTRATOR' && req.body.active !== undefined ? (req.body.active ? 1 : 0) : undefined };
  if (requester?.role === 'ADMINISTRATOR' && req.body.role !== undefined) fields.role = req.body.role;
  if (req.body.password) { const salt = randomBytes(16).toString('hex'); fields.password_hash = `${salt}:${scryptSync(String(req.body.password), salt, 64).toString('hex')}`; }
  const updates = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (updates.length) await database.prepare(`UPDATE users SET ${updates.map(([field]) => `${field} = ?`).join(', ')} WHERE id = ?`).run(...updates.map(([, value]) => value), targetId);
  const user = await database.prepare(`SELECT ${userFields} FROM users WHERE id = ?`).get(targetId);
  res.json({ ...user, active: Boolean(user.active) });
});

app.get('/api/me', requireSession, async (req, res) => {
  const user = await database.prepare(`SELECT ${userFields} FROM users WHERE id = ?`).get(req.userId);
  res.json({ ...user, active: Boolean(user.active) });
});

app.get('/api/my-leaves', requireSession, async (req, res) => {
  const currentUser = await database.prepare('SELECT matricule FROM users WHERE id = ?').get(req.userId);
  const leaves = tables.conges.filter((leave) => String(leave.MATRICULE) === String(currentUser.matricule));
  res.json(leaves);
});

app.post('/api/my-leaves', requireSession, async (req, res) => {
  const currentUser = await database.prepare('SELECT matricule FROM users WHERE id = ?').get(req.userId);
  const sourceUser = tables.utilisateurs.find((user) => String(user.MATRICULE) === String(currentUser.matricule));
  const { type, requestDate, dateStart, dateEnd, address = '', holidays = 0 } = req.body;
  if (!type || !dateStart || !dateEnd || dateEnd < dateStart) return res.status(400).json({ error: 'Type et période de congé obligatoires' });
  const start = new Date(`${dateStart}T00:00:00Z`);
  const end = new Date(`${dateEnd}T00:00:00Z`);
  const holidayDays = Math.max(0, Math.trunc(Number(holidays) || 0));
  const numberOfDays = Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start ? 0 : Math.max(0, Math.floor((end - start) / 86400000) - holidayDays);
  const leave = { CONGE_ID: Date.now(), MATRICULE: currentUser.matricule, NOM_PRENOM: sourceUser?.NOM || '', FONCTION: sourceUser?.FONCTION || '', TELEPHONE: sourceUser?.TEL || '', SERVICE: 'الإقتناء المجمع للخدمات', TYPE_CONGE: type, NBR_JOURS: numberOfDays, NBR_FERIES: holidayDays, DATE_DEBUT: dateStart, DATE_FIN: dateEnd, ADRESSE_CONGE: address, DATE_DEMANDE: requestDate || today(), STATUT: 'EN_ATTENTE' };
  tables.conges.unshift(leave);
  res.status(201).json(leave);
});

app.post('/api/logout', (req, res) => {
  const token = req.headers.cookie?.match(/(?:^|;\s*)agp_session=([^;]+)/)?.[1];
  if (token) sessions.delete(token);
  res.setHeader('Set-Cookie', 'agp_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  res.status(204).end();
});

app.get('/api/stats', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  const visibleDossiers = getVisibleDossiersForUser(req.userId, requester?.role);
  res.json({
    total: visibleDossiers.length,
    active: visibleDossiers.filter(({ status }) => status === 'En cours' || status === 'Publié').length,
    contracts: tables.contrats.length,
    reminders: tables.notes.length,
    budget: visibleDossiers.reduce((total, { budget }) => total + budget, 0)
  });
});

app.post('/api/dossiers', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  if (!canManageDossiers(requester?.role)) return res.status(403).json({ error: 'Seuls un administrateur ou un contributeur peuvent créer un dossier.' });

  const { reference, title, owner, budget, date } = req.body;
  const assignedToId = Number(req.body.assigned_to);
  if (!reference || !title || !date) return res.status(400).json({ error: 'Référence, intitulé et date sont obligatoires.' });
  const assignee = await database.prepare('SELECT id, name FROM users WHERE id = ? AND active = 1').get(assignedToId);
  if (!assignee) return res.status(400).json({ error: 'Veuillez sélectionner un utilisateur valide pour l’attribution.' });

  const dossier = {
    id: Date.now(),
    reference,
    title,
    owner: owner || assignee.name,
    assigned_to: assignee.id,
    budget: Number(budget) || 0,
    date,
    progress: 0,
    status: 'À lancer'
  };

  dossiers.unshift(dossier);
  res.status(201).json(await buildDossierDetailPayload(dossier));
});

app.post('/api/dossiers/:id/steps', requireSession, async (req, res) => {
  const dossierId = Number(req.params.id);
  const dossier = dossiers.find((item) => Number(item.id) === dossierId);
  if (!dossier) return res.status(404).json({ error: 'Dossier non trouvé.' });

  const requester = await database.prepare('SELECT role, name FROM users WHERE id = ?').get(req.userId);
  if (!canManageDossiers(requester?.role) && Number(dossier.assigned_to) !== Number(req.userId)) {
    return res.status(403).json({ error: 'Vous n’êtes pas autorisé à modifier ce dossier.' });
  }

  const { label, note } = req.body;
  if (!label || !note || !String(note).trim()) {
    return res.status(400).json({ error: 'Une étape avec une note est obligatoire.' });
  }

  const actor = requester?.name || 'Chef de projet';
  const result = await database.prepare('INSERT INTO dossier_history (dossier_id, label, note, actor) VALUES (?, ?, ?, ?)')
    .run(dossierId, String(label), String(note).trim(), actor);

  const row = await database.prepare('SELECT * FROM dossier_history WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    id: row.id,
    dossier_id: row.dossier_id,
    label: row.label,
    note: row.note,
    actor: row.actor,
    date: String(row.created_at).slice(0, 10)
  });
});

app.post('/api/dossiers/:id/attachments', requireSession, async (req, res) => {
  const dossierId = Number(req.params.id);
  const dossier = dossiers.find((item) => Number(item.id) === dossierId);
  if (!dossier) return res.status(404).json({ error: 'Dossier non trouvé.' });

  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  if (!canManageDossiers(requester?.role) && Number(dossier.assigned_to) !== Number(req.userId)) {
    return res.status(403).json({ error: 'Vous n’êtes pas autorisé à modifier ce dossier.' });
  }

  const { name, type, size, dataUrl } = req.body;
  if (!name || !type || !size) {
    return res.status(400).json({ error: 'La pièce jointe est incomplète.' });
  }

  const result = await database.prepare('INSERT INTO dossier_attachments (dossier_id, name, type, size, uploaded_at, data_url) VALUES (?, ?, ?, ?, ?, ?)')
    .run(dossierId, String(name), String(type), String(size), new Date().toISOString(), dataUrl || null);

  const row = await database.prepare('SELECT * FROM dossier_attachments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    id: row.id,
    name: row.name,
    type: row.type,
    size: row.size,
    uploadedAt: String(row.uploaded_at).slice(0, 10),
    dataUrl: row.data_url
  });
});

if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`AGP API listening on http://localhost:${port}`));
}

export { app };
export default app;
