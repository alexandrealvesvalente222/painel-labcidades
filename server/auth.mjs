import './loadEnv.mjs'
import { randomBytes, timingSafeEqual, createHash } from 'node:crypto'

const ADMIN_USER = process.env.ADMIN_USER || 'alexandre.valente'
const ADMIN_PASS = process.env.ADMIN_PASS || ''
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12 // 12h

/** @type {Map<string, number>} */
const sessions = new Map()

function hashPass(value) {
  return createHash('sha256').update(String(value)).digest()
}

function safeEqual(a, b) {
  const ba = hashPass(a)
  const bb = hashPass(b)
  return timingSafeEqual(ba, bb)
}

export function loginAdmin(user, pass) {
  const userOk = safeEqual(user ?? '', ADMIN_USER)
  const passOk = safeEqual(pass ?? '', ADMIN_PASS)
  if (!userOk || !passOk) return null

  const token = randomBytes(32).toString('hex')
  sessions.set(token, Date.now() + TOKEN_TTL_MS)
  return token
}

export function logoutAdmin(token) {
  if (token) sessions.delete(token)
}

export function isAdminAuthed(token) {
  if (!token) return false
  const exp = sessions.get(token)
  if (!exp) return false
  if (Date.now() > exp) {
    sessions.delete(token)
    return false
  }
  // renova sessão a cada uso
  sessions.set(token, Date.now() + TOKEN_TTL_MS)
  return true
}

export function getTokenFromReq(req) {
  const header = req.headers.authorization || ''
  if (header.startsWith('Bearer ')) return header.slice(7).trim()
  const query = req.query?.token
  if (typeof query === 'string' && query) return query
  return ''
}

export function requireAdmin(req, res, next) {
  const token = getTokenFromReq(req)
  if (!isAdminAuthed(token)) {
    res.status(401).json({ ok: false, errors: ['Não autorizado. Faça login.'] })
    return
  }
  next()
}
