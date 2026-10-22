import './loadEnv.mjs'
import cors from 'cors'
import express from 'express'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getDbPath, getInteresseStats, insertInteresse, listInteresses } from './db.mjs'
import { loginAdmin, logoutAdmin, requireAdmin, getTokenFromReq } from './auth.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const app = express()
const port = Number(process.env.PORT || 8787)

const CARGO_OPTIONS = new Set([
  'Sócio(a) / CEO / Proprietário(a) / Presidente',
  'Diretor(a)',
  'Gerente',
  'Coordenador(a) / Supervisor(a)',
  'Analista / Assistente',
  'Vendedor(a) / Executivo(a)',
  'Outros cargos',
  'Estudante',
  'Não trabalho atualmente',
])

app.use(cors())
app.use(express.json({ limit: '32kb' }))

function clean(value) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: getDbPath() })
})

app.post('/api/admin/login', (req, res) => {
  const user = clean(req.body?.user)
  const pass = String(req.body?.pass ?? '')
  const token = loginAdmin(user, pass)
  if (!token) {
    res.status(401).json({ ok: false, errors: ['Usuário ou senha inválidos.'] })
    return
  }
  res.json({ ok: true, token })
})

app.post('/api/admin/logout', (req, res) => {
  logoutAdmin(getTokenFromReq(req))
  res.json({ ok: true })
})

app.get('/api/admin/session', requireAdmin, (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/certificacao/interesse', (req, res) => {
  const nome = clean(req.body?.nome)
  const estado = clean(req.body?.estado).toUpperCase()
  const municipio = clean(req.body?.municipio)
  const cargo = clean(req.body?.cargo)
  const email = clean(req.body?.email).toLowerCase()
  const telefone = onlyDigits(req.body?.telefone)

  const errors = []
  if (nome.length < 2) errors.push('Informe o nome completo.')
  if (!/^[A-Z]{2}$/.test(estado)) errors.push('Selecione o estado.')
  if (municipio.length < 2) errors.push('Selecione o município.')
  if (!CARGO_OPTIONS.has(cargo)) errors.push('Selecione o tipo de cargo.')
  if (!isEmail(email)) errors.push('Informe um e-mail válido.')
  if (telefone.length < 10 || telefone.length > 11) {
    errors.push('Informe um telefone válido com DDD.')
  }

  if (errors.length) {
    res.status(400).json({ ok: false, errors })
    return
  }

  try {
    const row = insertInteresse({
      nome,
      estado,
      municipio,
      cargo,
      email,
      telefone,
      aceitaRodadas: '',
      lgpd: 'autorizo',
    })
    res.status(201).json({ ok: true, id: row.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, errors: ['Não foi possível salvar. Tente novamente.'] })
  }
})

app.get('/api/certificacao/interesses', requireAdmin, (req, res) => {
  try {
    const items = listInteresses({
      q: clean(req.query?.q),
      estado: clean(req.query?.estado).toUpperCase(),
      municipio: clean(req.query?.municipio),
      cargo: clean(req.query?.cargo),
      from: clean(req.query?.from),
      to: clean(req.query?.to),
    })
    res.json({ ok: true, items })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, errors: ['Falha ao listar interesses.'] })
  }
})

app.get('/api/certificacao/stats', requireAdmin, (_req, res) => {
  try {
    res.json({ ok: true, stats: getInteresseStats() })
  } catch (error) {
    console.error(error)
    res.status(500).json({ ok: false, errors: ['Falha ao carregar indicadores.'] })
  }
})

if (process.env.SERVE_STATIC === '1') {
  const dist = join(root, 'dist')
  app.use(express.static(dist))
  app.get('/{*path}', (_req, res) => {
    res.sendFile(join(dist, 'index.html'))
  })
}

app.listen(port, () => {
  console.log(`API certificações em http://localhost:${port}`)
  console.log(`SQLite: ${getDbPath()}`)
})
