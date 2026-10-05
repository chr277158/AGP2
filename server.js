import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { XMLParser } from 'fast-xml-parser';
import ExcelJS from 'exceljs';
import pg from 'pg';

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());

// Remplace 'données' par 'donnees' pour éviter les problèmes d'encodage et d'accents sur Linux/Vercel
const xmlPath = path.join(process.cwd(), 'donnees', 'cc (1).xml');

// Sur Vercel (serverless), le dossier du projet est en lecture seule (/var/task/).
// On utilise os.tmpdir() pour le stockage temporaire si de l'écriture/mkdir est nécessaire.
const dataPath = process.env.VERCEL
  ? path.join(os.tmpdir(), 'donnees')
  : path.join(process.cwd(), 'donnees');

// Création sécurisée du dossier dataPath si nécessaire
if (!fs.existsSync(dataPath)) {
  try {
    fs.mkdirSync(dataPath, { recursive: true });
  } catch (error) {
    console.warn(`Impossible de créer le dossier ${dataPath}:`, error.message);
  }
}

const procurementStatusNames = {
  1: 'À lancer',
  2: 'Préparation AO',
  3: 'AO lancée',
  4: 'Évaluation',
  5: 'Décision commission',
  6: 'Attribué',
  7: 'Contrat signé',
  8: 'Exécution',
  9: 'Clôturé'
};

const legacyStatusAliases = {
  'En attente': 'Préparation AO',
  'En cours': 'AO lancée',
  'Publié': 'AO lancée',
  'A_LANCER': 'À lancer',
  'AO_LANCEE': 'AO lancée',
  'EVALUATION': 'Évaluation',
  'ATTRIBUE': 'Attribué',
  'CONTRAT_SIGNE': 'Contrat signé',
  'CLOTURE': 'Clôturé'
};

const statusNames = procurementStatusNames;
const hasLocalXml = fs.existsSync(xmlPath);

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

function createSqliteDatabaseAdapter() {
  const dbPath = process.env.VERCEL
    ? path.join(os.tmpdir(), 'agp.sqlite')
    : path.join(process.cwd(), 'agp.sqlite');

  const sqlite = new DatabaseSync(dbPath);
  return {
    exec(sql) {
      sqlite.exec(sql);
    },
    prepare(sql) {
      return sqlite.prepare(sql);
    }
  };
}

function createPostgresDatabaseAdapter() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured.');

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
          const query = toPostgresQuery(sqlToRun, params);
          const result = await pool.query(query.text, query.values);
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

function createDatabaseAdapter(usePostgres = Boolean(process.env.DATABASE_URL)) {
  if (usePostgres) {
    return createPostgresDatabaseAdapter();
  }
  return createSqliteDatabaseAdapter();
}

let usingPostgresDatabase = Boolean(process.env.DATABASE_URL);
let database = createDatabaseAdapter(usingPostgresDatabase);

function resolveProcurementStatus(statusValue) {
  if (statusValue === undefined || statusValue === null || statusValue === '') {
    return 'À lancer';
  }

  const normalized = String(statusValue).trim();
  if (legacyStatusAliases[normalized]) {
    return legacyStatusAliases[normalized];
  }

  if (statusNames[Number(normalized)]) {
    return statusNames[Number(normalized)];
  }

  return statusNames[normalized] || normalized;
}

function loadDossiers() {
  if (!hasLocalXml) {
    return [];
  }

  try {
    const xml = fs.readFileSync(xmlPath, 'utf8');
    const parsed = new XMLParser({ isArray: (name) => name === 'ROW' }).parse(xml);
    return (parsed.ROWSET?.ROW || []).map((row) => {
      const status = resolveProcurementStatus(row.STATUS);
      const progressMap = {
        'À lancer': 15,
        'Préparation AO': 30,
        'AO lancée': 55,
        'Évaluation': 72,
        'Décision commission': 82,
        'Attribué': 88,
        'Contrat signé': 92,
        'Exécution': 96,
        'Clôturé': 100
      };

      return {
        id: Number(row.ID),
        reference: row.REF_AO || `DOS-${row.ID}`,
        title: row.OBJET_CCT || 'Sans intitulé',
        owner: row.CREER_PAR || 'Non renseigné',
        budget: parseBudget(row.BUDGET),
        status,
        progress: progressMap[status] ?? 20,
        date: row.DATE_LIMITE_PROPOSÉE || row.DATE_OUVERTURE_DES_PLIS || row.DATE_DE_LANC || row.DATE_DE_CRÉATION || null,
        nature: row.NATURE_DE_DEPENSE || 'Non renseignée'
      };
    });
  } catch (error) {
    console.warn(`Erreur lors de la lecture du fichier XML : ${error.message}`);
    return [];
  }
}

function excelDate(value, fieldName = '') {
  if (!/(DATE|DAT|JOURS)/i.test(fieldName)) return value ?? null;
  if (typeof value !== 'number') return value || null;
  const epoch = Date.UTC(1899, 11, 30);
  return new Date(epoch + value * 86400000).toISOString();
}

async function loadXlsx(fileName) {
  const filePath = path.join(process.cwd(), 'donnees', fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const sheet = workbook.worksheets[0];
    if (!sheet) return [];
    
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

async function initializeDatabase() {
  const schemaSql = (usePostgres) => `
    CREATE TABLE IF NOT EXISTS users (
      id ${usePostgres ? 'INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
      name TEXT NOT NULL,
      matricule TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL DEFAULT 'READER',
      function_name TEXT,
      service TEXT,
      phone TEXT,
      password_hash TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_leave_balances (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      balance NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0)
    );

    CREATE TABLE IF NOT EXISTS user_leave_requests (
      id ${usePostgres ? 'INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      request_date TEXT NOT NULL,
      date_start TEXT NOT NULL,
      date_end TEXT NOT NULL,
      holidays INTEGER NOT NULL DEFAULT 0,
      number_of_days INTEGER NOT NULL DEFAULT 0,
      address TEXT NOT NULL DEFAULT '',
      balance_before NUMERIC NOT NULL DEFAULT 0,
      balance_after NUMERIC NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'VALIDE'
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      id ${usePostgres ? 'INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
      token_hash TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dossier_history (
      id ${usePostgres ? 'INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
      dossier_id INTEGER NOT NULL,
      label TEXT NOT NULL,
      note TEXT NOT NULL,
      actor TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS dossier_attachments (
      id ${usePostgres ? 'INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
      dossier_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      size TEXT NOT NULL,
      uploaded_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      data_url TEXT
    );

    CREATE TABLE IF NOT EXISTS dossier_discussions (
      id ${usePostgres ? 'INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
      dossier_id INTEGER NOT NULL,
      kind TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Ouverte',
      actor TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await database.exec(schemaSql(Boolean(process.env.DATABASE_URL)));
  } catch (error) {
    if (process.env.VERCEL) {
      throw new Error(`Base de données indisponible sur Vercel : ${error.message}`);
    }
    console.warn('PostgreSQL unavailable. Falling back to SQLite:', error.message);
    usingPostgresDatabase = false;
    database = createDatabaseAdapter(false);
    await database.exec(schemaSql(false));
  }

  if (usingPostgresDatabase) {
    await database.exec('ALTER TABLE users ADD COLUMN IF NOT EXISTS service TEXT');
  } else {
    const userColumns = database.prepare('PRAGMA table_info(users)').all();
    if (!userColumns.some((column) => column.name === 'service')) {
      await database.exec('ALTER TABLE users ADD COLUMN service TEXT');
    }
  }

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

  if (usingPostgresDatabase) {
    await database.prepare(`SELECT setval(
      pg_get_serial_sequence('users', 'id'),
      COALESCE(MAX(id), 1),
      MAX(id) IS NOT NULL
    ) FROM users`).get();
  }

  const existingAdmin = await database.prepare('SELECT id FROM users WHERE matricule = ?').get('admin');
  if (!existingAdmin) {
    const salt = randomBytes(16).toString('hex');
    const password = 'admin123';
    const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
    await database.prepare('INSERT INTO users (name, matricule, role, function_name, phone, password_hash, active) VALUES (?, ?, ?, ?, ?, ?, 1)')
      .run('Administrateur', 'admin', 'ADMINISTRATOR', 'Gestion', '00000000', passwordHash);
  }
}

await initializeDatabase();

const userFields = 'id, name, matricule, role, function_name AS "function", service, phone, active, created_at, COALESCE((SELECT balance FROM user_leave_balances WHERE user_id = users.id), 0) AS leave_balance';

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

function getSessionToken(req) {
  return req.headers.cookie?.match(/(?:^|;\s*)agp_session=([^;]+)/)?.[1] || null;
}

async function requireSession(req, res, next) {
  const token = getSessionToken(req);
  if (!token) return res.status(401).json({ error: 'Session expirée. Veuillez vous connecter.' });
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const session = await database.prepare('SELECT user_id FROM user_sessions WHERE token_hash = ? AND expires_at > ?').get(tokenHash, new Date().toISOString());
  if (!session) return res.status(401).json({ error: 'Session expirée. Veuillez vous connecter.' });
  req.userId = session.user_id;
  next();
}

function canManageDossiers(role) {
  return role === 'ADMINISTRATOR' || role === 'CONTRIBUTOR';
}

function canManageUsers(role) {
  return role === 'ADMINISTRATOR';
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
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const tokenHash = createHash('sha256').update(token).digest('hex');
  await database.prepare('DELETE FROM user_sessions WHERE expires_at <= ?').run(new Date().toISOString());
  await database.prepare('INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(tokenHash, user.id, expiresAt);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `agp_session=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${secure}`);
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

app.get('/api/dossiers/:id/discussions', requireSession, async (req, res) => {
  const dossierId = Number(req.params.id);
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  const visible = getVisibleDossiersForUser(req.userId, requester?.role);
  if (!visible.some((item) => Number(item.id) === dossierId)) {
    return res.status(404).json({ error: 'Dossier introuvable.' });
  }
  const rows = await database.prepare('SELECT * FROM dossier_discussions WHERE dossier_id = ? ORDER BY created_at DESC, id DESC').all(dossierId);
  res.json(rows.map((row) => ({ id: row.id, kind: row.kind, message: row.message, status: row.status, actor: row.actor, date: row.created_at })));
});

app.get('/api/tables', (_req, res) => res.json(Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.length]))));
app.get('/api/tables/:table', (req, res) => {
  const rows = tables[req.params.table];
  if (!rows) return res.status(404).json({ error: 'Table non trouvée' });
  res.json(rows);
});

app.get('/api/users', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  if (!canManageUsers(requester?.role)) return res.status(403).json({ error: 'Droits administrateur requis.' });
  const rows = await database.prepare(`SELECT ${userFields} FROM users ORDER BY id DESC`).all();
  res.json(rows.map((user) => ({ ...user, active: Boolean(user.active) })));
});

app.post('/api/users', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  if (!canManageUsers(requester?.role)) return res.status(403).json({ error: 'Droits administrateur requis.' });
  const { name, matricule, role = 'READER', function: functionName = 'Non renseignée', phone = 'Non renseigné', password } = req.body;
  if (!name || !matricule || !password) return res.status(400).json({ error: 'Nom, matricule et mot de passe obligatoires.' });
  if (password.length < 8) return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
  const salt = randomBytes(16).toString('hex');
  const passwordHash = `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
  try {
    const result = await database.prepare(`INSERT INTO users (name, matricule, role, function_name, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(name, matricule, role, functionName, phone, passwordHash);
    const user = await database.prepare(`SELECT ${userFields} FROM users WHERE id = ?`).get(result.lastInsertRowid);
    res.status(201).json({ ...user, active: Boolean(user.active) });
  } catch (error) {
    res.status(409).json({ error: error.message.includes('UNIQUE') ? 'Ce matricule existe déjà' : 'Création impossible' });
  }
});

app.put('/api/users/:id', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  const targetId = Number(req.params.id);
  const canEditAnyUser = canManageUsers(requester?.role);
  if (!canEditAnyUser && req.userId !== targetId) return res.status(403).json({ error: 'Vous ne pouvez modifier que votre profil.' });
  const current = await database.prepare('SELECT id FROM users WHERE id = ?').get(targetId);
  if (!current) return res.status(404).json({ error: 'Utilisateur non trouvé' });

  const fields = {
    name: req.body.name,
    matricule: req.body.matricule,
    function_name: req.body.function,
    service: req.body.service,
    phone: req.body.phone,
    active: canEditAnyUser && req.body.active !== undefined ? (req.body.active ? 1 : 0) : undefined
  };

  if (canEditAnyUser && req.body.role !== undefined) fields.role = req.body.role;
  if (req.body.password) {
    const salt = randomBytes(16).toString('hex');
    fields.password_hash = `${salt}:${scryptSync(String(req.body.password), salt, 64).toString('hex')}`;
  }

  const updates = Object.entries(fields).filter(([, value]) => value !== undefined);
  if (updates.length) {
    await database.prepare(`UPDATE users SET ${updates.map(([field]) => `${field} = ?`).join(', ')} WHERE id = ?`).run(...updates.map(([, value]) => value), targetId);
  }

  const user = await database.prepare(`SELECT ${userFields} FROM users WHERE id = ?`).get(targetId);
  res.json({ ...user, active: Boolean(user.active) });
});

app.get('/api/me', requireSession, async (req, res) => {
  const user = await database.prepare(`SELECT ${userFields} FROM users WHERE id = ?`).get(req.userId);
  res.json({ ...user, active: Boolean(user.active) });
});

app.get('/api/my-leaves', requireSession, async (req, res) => {
  const currentUser = await database.prepare('SELECT matricule, name, function_name AS "function", phone FROM users WHERE id = ?').get(req.userId);
  const storedLeaves = await database.prepare('SELECT * FROM user_leave_requests WHERE user_id = ? ORDER BY id DESC').all(req.userId);
  const persisted = storedLeaves.map((leave) => ({
    CONGE_ID: `request-${leave.id}`,
    MATRICULE: currentUser.matricule,
    NOM_PRENOM: currentUser.name,
    FONCTION: currentUser.function || '',
    TELEPHONE: currentUser.phone || '',
    SERVICE: 'الإقتناء المجمع للخدمات',
    TYPE_CONGE: leave.type,
    NBR_JOURS: leave.number_of_days,
    NBR_FERIES: leave.holidays,
    DATE_DEBUT: leave.date_start,
    DATE_FIN: leave.date_end,
    ADRESSE_CONGE: leave.address,
    DATE_DEMANDE: leave.request_date,
    SOLDE_AVANT: leave.balance_before,
    SOLDE_APRES: leave.balance_after,
    STATUT: leave.status
  }));
  const imported = (tables.conges || []).filter((leave) => String(leave.MATRICULE) === String(currentUser.matricule));
  res.json([...persisted, ...imported]);
});

app.put('/api/my-leave-balance', requireSession, async (req, res) => {
  const balance = Number(req.body.balance);
  if (!Number.isFinite(balance) || balance < 0 || Number(balance.toFixed(2)) !== balance) {
    return res.status(400).json({ error: 'Le solde doit être un nombre positif avec au plus deux décimales.' });
  }
  await database.prepare(`INSERT INTO user_leave_balances (user_id, balance) VALUES (?, ?)
    ON CONFLICT (user_id) DO UPDATE SET balance = excluded.balance`).run(req.userId, balance);
  res.json({ leave_balance: balance });
});

function leaveDateTimestamp(value) {
  if (!value) return null;
  const text = value instanceof Date ? value.toISOString() : String(value).trim();
  const isoDate = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoDate) return Date.UTC(Number(isoDate[1]), Number(isoDate[2]) - 1, Number(isoDate[3]));
  const frenchDate = text.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})$/);
  if (frenchDate) return Date.UTC(Number(frenchDate[3]), Number(frenchDate[2]) - 1, Number(frenchDate[1]));
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function hasActiveLeaveOverlap(leaves, requestStart, requestEnd) {
  const inactiveStatuses = new Set(['ANNULE', 'ANNULEE', 'REFUSE', 'REFUSEE', 'REJETE', 'REJETEE', 'CANCELLED', 'REJECTED']);
  return leaves.some((leave) => {
    const status = String(leave.STATUT ?? leave.status ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    if (inactiveStatuses.has(status)) return false;
    const start = leaveDateTimestamp(leave.DATE_DEBUT ?? leave.date_start);
    const end = leaveDateTimestamp(leave.DATE_FIN ?? leave.date_end);
    return start !== null && end !== null && requestStart < end && requestEnd > start;
  });
}

app.post('/api/my-leaves', requireSession, async (req, res) => {
  const currentUser = await database.prepare(`SELECT matricule, COALESCE((SELECT balance FROM user_leave_balances WHERE user_id = users.id), 0) AS balance FROM users WHERE id = ?`).get(req.userId);
  const sourceUser = (tables.utilisateurs || []).find((user) => String(user.MATRICULE) === String(currentUser.matricule));
  const { type, requestDate, dateStart, dateEnd, address = '', holidays = 0 } = req.body;
  if (!type || !dateStart || !dateEnd) return res.status(400).json({ error: 'Type et période de congé obligatoires' });
  const start = new Date(`${dateStart}T00:00:00Z`);
  const end = new Date(`${dateEnd}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return res.status(400).json({ error: 'La date de retour doit être postérieure à la date de début.' });
  const existingStoredLeaves = await database.prepare('SELECT date_start, date_end, status FROM user_leave_requests WHERE user_id = ?').all(req.userId);
  const existingImportedLeaves = (tables.conges || []).filter((leave) => String(leave.MATRICULE) === String(currentUser.matricule));
  if (hasActiveLeaveOverlap([...existingStoredLeaves, ...existingImportedLeaves], start.getTime(), end.getTime())) {
    return res.status(409).json({ error: 'Un congé existe déjà sur cette période.' });
  }
  const holidayDays = Math.max(0, Math.trunc(Number(holidays) || 0));
  const numberOfDays = Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start ? 0 : Math.floor((end - start) / 86400000);
  const chargedDays = Math.max(0, numberOfDays - holidayDays);
  let balanceBefore = Number(currentUser.balance) || 0;
  let balanceAfter = balanceBefore;
  if (type === 'SOLDE') {
    await database.prepare('INSERT INTO user_leave_balances (user_id, balance) VALUES (?, 0) ON CONFLICT (user_id) DO NOTHING').run(req.userId);
    const updatedBalance = await database.prepare('UPDATE user_leave_balances SET balance = balance - ? WHERE user_id = ? AND balance >= ? RETURNING balance')
      .get(chargedDays, req.userId, chargedDays);
    if (!updatedBalance) return res.status(409).json({ error: 'Votre solde de congé est insuffisant.' });
    balanceAfter = Number(updatedBalance.balance);
    balanceBefore = balanceAfter + chargedDays;
  }
  const saved = await database.prepare(`INSERT INTO user_leave_requests (user_id, type, request_date, date_start, date_end, holidays, number_of_days, address, balance_before, balance_after, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'VALIDE')`)
    .run(req.userId, type, requestDate || today(), dateStart, dateEnd, holidayDays, numberOfDays, address, balanceBefore, balanceAfter);
  const leave = { CONGE_ID: `request-${saved.lastInsertRowid}`, MATRICULE: currentUser.matricule, NOM_PRENOM: sourceUser?.NOM || '', FONCTION: sourceUser?.FONCTION || '', TELEPHONE: sourceUser?.TEL || '', SERVICE: 'الإقتناء المجمع للخدمات', TYPE_CONGE: type, NBR_JOURS: numberOfDays, NBR_FERIES: holidayDays, DATE_DEBUT: dateStart, DATE_FIN: dateEnd, ADRESSE_CONGE: address, DATE_DEMANDE: requestDate || today(), SOLDE_AVANT: balanceBefore, SOLDE_APRES: balanceAfter, STATUT: 'VALIDE' };
  res.status(201).json(leave);
});

app.post('/api/logout', async (req, res) => {
  const token = getSessionToken(req);
  if (token) {
    const tokenHash = createHash('sha256').update(token).digest('hex');
    await database.prepare('DELETE FROM user_sessions WHERE token_hash = ?').run(tokenHash);
  }
  res.setHeader('Set-Cookie', 'agp_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  res.status(204).end();
});

app.get('/api/stats', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  const visibleDossiers = getVisibleDossiersForUser(req.userId, requester?.role);
  res.json({
    total: visibleDossiers.length,
    active: visibleDossiers.filter(({ status }) => status === 'En cours' || status === 'Publié').length,
    contracts: (tables.contrats || []).length,
    reminders: (tables.notes || []).length,
    budget: visibleDossiers.reduce((total, { budget }) => total + budget, 0)
  });
});

app.post('/api/dossiers', requireSession, async (req, res) => {
  const requester = await database.prepare('SELECT role FROM users WHERE id = ?').get(req.userId);
  if (!canManageDossiers(requester?.role)) return res.status(403).json({ error: 'Seuls un administrateur ou un contributeur peuvent créer un dossier.' });

  const { reference, title, budget, date, nature_depense, mode_passation, nature_commande, commission, description } = req.body;
  const assignedToId = Number(req.body.assigned_to);
  if (!reference || !title || !date) return res.status(400).json({ error: 'Référence, intitulé et date sont obligatoires.' });
  const assignee = await database.prepare('SELECT id, name FROM users WHERE id = ? AND active = 1').get(assignedToId);
  if (!assignee) return res.status(400).json({ error: 'Veuillez sélectionner un utilisateur valide pour l’attribution.' });

  const dossier = {
    id: Date.now(),
    reference,
    title,
    owner: assignee.name,
    assigned_to: assignee.id,
    budget: Number(budget) || 0,
    date,
    nature_depense,
    mode_passation,
    nature_commande,
    commission,
    description: String(description || '').trim(),
    progress: 0,
    status: ['À lancer', 'En attente', 'En cours'].includes(req.body.status) ? req.body.status : 'À lancer'
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

app.post('/api/dossiers/:id/discussions', requireSession, async (req, res) => {
  const dossierId = Number(req.params.id);
  const dossier = dossiers.find((item) => Number(item.id) === dossierId);
  if (!dossier) return res.status(404).json({ error: 'Dossier introuvable.' });
  const requester = await database.prepare('SELECT role, name FROM users WHERE id = ?').get(req.userId);
  const visible = getVisibleDossiersForUser(req.userId, requester?.role);
  if (!visible.some((item) => Number(item.id) === dossierId)) {
    return res.status(403).json({ error: 'Vous ne pouvez pas commenter ce dossier.' });
  }
  const kind = req.body.kind === 'clarification' ? 'clarification' : req.body.kind === 'remark' ? 'remark' : null;
  const message = String(req.body.message || '').trim();
  if (!kind || !message) return res.status(400).json({ error: 'Type et contenu sont obligatoires.' });
  const result = await database.prepare('INSERT INTO dossier_discussions (dossier_id, kind, message, actor) VALUES (?, ?, ?, ?)')
    .run(dossierId, kind, message, requester?.name || 'Utilisateur');
  const row = await database.prepare('SELECT * FROM dossier_discussions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ id: row.id, kind: row.kind, message: row.message, status: row.status, actor: row.actor, date: row.created_at });
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