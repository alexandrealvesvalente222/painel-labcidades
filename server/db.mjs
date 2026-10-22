import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..')
const dbPath = join(dataDir, 'data', 'certificacao.db')

mkdirSync(join(dataDir, 'data'), { recursive: true })

const db = new DatabaseSync(dbPath)

db.exec(`
  CREATE TABLE IF NOT EXISTS certificacao_interesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    municipio TEXT NOT NULL,
    entidade TEXT NOT NULL DEFAULT '',
    cargo TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)

function ensureColumn(column, typeSql) {
  const cols = db.prepare(`PRAGMA table_info(certificacao_interesses)`).all()
  if (!cols.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE certificacao_interesses ADD COLUMN ${column} ${typeSql}`)
  }
}

ensureColumn('estado', `TEXT NOT NULL DEFAULT ''`)
ensureColumn('telefone', `TEXT NOT NULL DEFAULT ''`)
ensureColumn('aceita_rodadas', `TEXT NOT NULL DEFAULT ''`)
ensureColumn('lgpd', `TEXT NOT NULL DEFAULT ''`)

export function insertInteresse({
  nome,
  estado,
  municipio,
  cargo,
  email,
  telefone,
  aceitaRodadas,
  lgpd,
}) {
  const stmt = db.prepare(`
    INSERT INTO certificacao_interesses
      (nome, estado, municipio, entidade, cargo, email, telefone, aceita_rodadas, lgpd)
    VALUES (?, ?, ?, '', ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(
    nome,
    estado,
    municipio,
    cargo,
    email,
    telefone,
    aceitaRodadas,
    lgpd,
  )
  return {
    id: Number(result.lastInsertRowid),
    nome,
    estado,
    municipio,
    cargo,
    email,
    telefone,
    aceitaRodadas,
    lgpd,
  }
}

export function listInteresses({
  q = '',
  estado = '',
  municipio = '',
  cargo = '',
  from = '',
  to = '',
} = {}) {
  const where = []
  const params = []

  if (q) {
    where.push(
      `(nome LIKE ? OR email LIKE ? OR telefone LIKE ? OR cargo LIKE ? OR municipio LIKE ? OR estado LIKE ?)`,
    )
    const like = `%${q}%`
    params.push(like, like, like, like, like, like)
  }
  if (estado) {
    where.push(`estado = ?`)
    params.push(estado)
  }
  if (municipio) {
    where.push(`municipio LIKE ?`)
    params.push(`%${municipio}%`)
  }
  if (cargo) {
    where.push(`cargo = ?`)
    params.push(cargo)
  }
  if (from) {
    where.push(`date(created_at) >= date(?)`)
    params.push(from)
  }
  if (to) {
    where.push(`date(created_at) <= date(?)`)
    params.push(to)
  }

  const sql = `
    SELECT id, nome, estado, municipio, cargo, email, telefone,
           aceita_rodadas AS aceitaRodadas, lgpd, entidade, created_at
    FROM certificacao_interesses
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY id DESC
  `
  return db.prepare(sql).all(...params)
}

function normalizeMunicipioKey(name) {
  return String(name ?? '')
    .replace(/\uFFFD/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function getInteresseStats() {
  const total = db.prepare(`SELECT COUNT(*) AS n FROM certificacao_interesses`).get().n
  const hoje = db
    .prepare(
      `SELECT COUNT(*) AS n FROM certificacao_interesses WHERE date(created_at) = date('now')`,
    )
    .get().n
  const semana = db
    .prepare(
      `SELECT COUNT(*) AS n FROM certificacao_interesses
       WHERE date(created_at) >= date('now', '-6 days')`,
    )
    .get().n

  const raw = db
    .prepare(
      `SELECT municipio AS name, COUNT(*) AS count
       FROM certificacao_interesses
       GROUP BY municipio
       ORDER BY count DESC, name ASC`,
    )
    .all()

  /** @type {Map<string, { name: string, count: number }>} */
  const merged = new Map()
  for (const row of raw) {
    const key = normalizeMunicipioKey(row.name)
    if (!key) continue
    const prev = merged.get(key)
    if (prev) {
      prev.count += Number(row.count)
      if (String(row.name).length > prev.name.length) prev.name = String(row.name)
    } else {
      merged.set(key, { name: String(row.name), count: Number(row.count) })
    }
  }

  const porMunicipio = [...merged.values()]
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'pt-BR'))
    .slice(0, 40)

  const porEstado = db
    .prepare(
      `SELECT CASE WHEN trim(estado) = '' THEN '—' ELSE estado END AS name,
              COUNT(*) AS count
       FROM certificacao_interesses
       GROUP BY name
       ORDER BY count DESC, name ASC
       LIMIT 30`,
    )
    .all()
    .map((row) => ({ name: String(row.name), count: Number(row.count) }))

  return {
    total: Number(total),
    hoje: Number(hoje),
    semana: Number(semana),
    municipios: porMunicipio.length,
    porMunicipio,
    porEstado,
  }
}

export function getDbPath() {
  return dbPath
}
