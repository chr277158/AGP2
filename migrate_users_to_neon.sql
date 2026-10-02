BEGIN;

-- Prerequisite: import the legacy Oracle/SQLite table into Neon as "T_USER"
-- with its original column names: ID_1, NOM, MATRICULE, MDP, GROUPE, FONCTION, TEL.
-- MDP is deliberately not copied: the application expects scrypt password hashes.
INSERT INTO users (
    name,
    matricule,
    role,
    function_name,
    phone,
    password_hash,
    active
)
SELECT
    COALESCE(NULLIF(BTRIM(src."NOM"::text), ''), 'Sans nom'),
    NULLIF(BTRIM(src."MATRICULE"::text), ''),
    CASE UPPER(BTRIM(COALESCE(src."GROUPE"::text, '')))
        WHEN 'ADMIN' THEN 'ADMINISTRATOR'
        WHEN 'ADMINISTRATEUR' THEN 'ADMINISTRATOR'
        WHEN 'ADMINISTRATOR' THEN 'ADMINISTRATOR'
        WHEN 'CONTRIBUTEUR' THEN 'CONTRIBUTOR'
        WHEN 'CONTRIBUTOR' THEN 'CONTRIBUTOR'
        ELSE 'READER'
    END,
    COALESCE(NULLIF(BTRIM(src."FONCTION"::text), ''), 'Non renseignée'),
    COALESCE(NULLIF(BTRIM(src."TEL"::text), ''), 'Non renseigné'),
    NULL,
    1
FROM "T_USER" AS src
WHERE NULLIF(BTRIM(src."MATRICULE"::text), '') IS NOT NULL
ON CONFLICT (matricule) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    function_name = EXCLUDED.function_name,
    phone = EXCLUDED.phone;

COMMIT;

-- Verify the migrated accounts without displaying password data.
SELECT id, name, matricule, role, function_name, phone, active
FROM users
ORDER BY id;