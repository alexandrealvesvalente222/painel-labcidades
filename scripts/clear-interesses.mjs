import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dbPath = path.join(root, 'data', 'certificacao.db')

if (!fs.existsSync(dbPath)) {
  console.log(JSON.stringify({ ok: true, message: 'Nenhum banco' }))
  process.exit(0)
}

const db = new DatabaseSync(dbPath)
const before = db.prepare('SELECT COUNT(*) AS n FROM certificacao_interesses').get().n
db.exec('DELETE FROM certificacao_interesses')
try {
  db.exec("DELETE FROM sqlite_sequence WHERE name = 'certificacao_interesses'")
} catch {
  /* ok */
}
const after = db.prepare('SELECT COUNT(*) AS n FROM certificacao_interesses').get().n
db.close()
console.log(JSON.stringify({ ok: true, before, after }))
