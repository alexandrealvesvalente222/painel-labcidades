import { useEffect, useMemo, useState, type FormEvent } from 'react'
import AdminMap from './AdminMap'
import { BR_ESTADOS, CARGO_OPTIONS, municipiosDoEstado } from './brLocations'
import { LAB } from './data'

type Interesse = {
  id: number
  nome: string
  estado: string
  municipio: string
  cargo: string
  email: string
  telefone: string
  lgpd?: string
  created_at: string
}

type Stats = {
  total: number
  hoje: number
  semana: number
  municipios: number
  porMunicipio: { name: string; count: number }[]
  porEstado?: { name: string; count: number }[]
}

const TOKEN_KEY = 'labcidades-admin-token'

function formatPhone(value: string) {
  const d = String(value ?? '').replace(/\D/g, '')
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return value || '—'
}

function formatDate(value: string) {
  if (!value) return '—'
  const raw = value.includes('T') ? value : value.replace(' ', 'T')
  const date = new Date(raw.includes('Z') || raw.includes('+') ? raw : `${raw}Z`)
  if (Number.isNaN(date.getTime())) {
    return value.replace('T', ' ').slice(0, 16)
  }
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

function openPanel() {
  const url = new URL(window.location.href)
  url.hash = ''
  window.location.href = url.toString()
}

export default function CertAdmin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [checking, setChecking] = useState(Boolean(token))
  const [user, setUser] = useState('alexandre.valente')
  const [pass, setPass] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [municipio, setMunicipio] = useState('')
  const [cargo, setCargo] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [items, setItems] = useState<Interesse[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const municipiosFiltro = useMemo(
    () => (estado ? municipiosDoEstado(estado) : []),
    [estado],
  )

  const hasFilters = Boolean(q || estado || municipio || cargo || from || to)

  useEffect(() => {
    if (!token) {
      setChecking(false)
      return
    }
    let cancelled = false
    fetch('/api/admin/session', { headers: authHeaders(token) })
      .then(async (res) => {
        if (cancelled) return
        if (!res.ok) {
          localStorage.removeItem(TOKEN_KEY)
          setToken('')
        }
      })
      .catch(() => {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY)
          setToken('')
        }
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  async function loadData(activeToken: string, filters = { q, estado, municipio, cargo, from, to }) {
    setLoading(true)
    setLoadError('')
    const params = new URLSearchParams()
    if (filters.q.trim()) params.set('q', filters.q.trim())
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.municipio.trim()) params.set('municipio', filters.municipio.trim())
    if (filters.cargo) params.set('cargo', filters.cargo)
    if (filters.from) params.set('from', filters.from)
    if (filters.to) params.set('to', filters.to)
    const qs = params.toString()

    try {
      const [listRes, statsRes] = await Promise.all([
        fetch(`/api/certificacao/interesses${qs ? `?${qs}` : ''}`, {
          headers: authHeaders(activeToken),
        }),
        fetch('/api/certificacao/stats', { headers: authHeaders(activeToken) }),
      ])
      if (listRes.status === 401 || statsRes.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        setToken('')
        return
      }
      const listPayload = (await listRes.json()) as {
        ok?: boolean
        items?: Interesse[]
        errors?: string[]
      }
      const statsPayload = (await statsRes.json()) as {
        ok?: boolean
        stats?: Stats
        errors?: string[]
      }
      if (!listRes.ok || !listPayload.ok) {
        setLoadError(listPayload.errors?.[0] ?? 'Falha ao carregar inscritos.')
        return
      }
      if (!statsRes.ok || !statsPayload.ok || !statsPayload.stats) {
        setLoadError(statsPayload.errors?.[0] ?? 'Falha ao carregar indicadores.')
        return
      }
      setItems(listPayload.items ?? [])
      setStats(statsPayload.stats)
    } catch {
      setLoadError('Sem conexão com a API. Verifique se o servidor está no ar.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!token || checking) return
    void loadData(token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, checking])

  async function onLogin(event: FormEvent) {
    event.preventDefault()
    setLoggingIn(true)
    setLoginError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, pass }),
      })
      const payload = (await res.json()) as { ok?: boolean; token?: string; errors?: string[] }
      if (!res.ok || !payload.ok || !payload.token) {
        setLoginError(payload.errors?.[0] ?? 'Falha no login.')
        return
      }
      localStorage.setItem(TOKEN_KEY, payload.token)
      setToken(payload.token)
      setPass('')
    } catch {
      setLoginError('Sem conexão com a API.')
    } finally {
      setLoggingIn(false)
    }
  }

  async function onLogout() {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: authHeaders(token),
        })
      } catch {
        /* ignore */
      }
    }
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setItems([])
    setStats(null)
  }

  function clearFilters() {
    const empty = { q: '', estado: '', municipio: '', cargo: '', from: '', to: '' }
    setQ('')
    setEstado('')
    setMunicipio('')
    setCargo('')
    setFrom('')
    setTo('')
    if (token) void loadData(token, empty)
  }

  function exportCsv() {
    const header = ['Nome', 'Estado', 'Município', 'Cargo', 'E-mail', 'Telefone', 'LGPD', 'Data']
    const lines = items.map((row) =>
      [
        row.nome,
        row.estado,
        row.municipio,
        row.cargo,
        row.email,
        formatPhone(row.telefone),
        row.lgpd === 'autorizo' ? 'Autorizado' : '',
        formatDate(row.created_at),
      ]
        .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
        .join(';'),
    )
    const blob = new Blob([[header.join(';'), ...lines].join('\n')], {
      type: 'text/csv;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `interessados-labcidades-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (checking) {
    return (
      <div className="admin-page">
        <div className="admin-shell admin-shell--narrow">
          <p className="admin-muted">Verificando sessão…</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="admin-page">
        <div className="admin-shell admin-shell--narrow">
          <header className="admin-head">
            <img src={LAB.wordmarkSrc} alt="LabCidades" className="admin-logo" draggable={false} />
            <h1>Painel administrativo</h1>
            <p>Acompanhe os interessados nos cursos de curta duração.</p>
          </header>
          <form className="admin-login" onSubmit={onLogin}>
            <label>
              <span>Usuário</span>
              <input value={user} onChange={(e) => setUser(e.target.value)} autoComplete="username" />
            </label>
            <label>
              <span>Senha</span>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
              />
            </label>
            {loginError ? <p className="admin-error">{loginError}</p> : null}
            <button type="submit" className="admin-btn" disabled={loggingIn}>
              {loggingIn ? 'Entrando…' : 'Entrar'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={openPanel}>
              Voltar ao totem
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-top">
          <div className="admin-brand">
            <img
              src={LAB.wordmarkSrc}
              alt="LabCidades"
              className="admin-brand-logo"
              draggable={false}
            />
          </div>
          <div className="admin-top-actions">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => void loadData(token)}
              disabled={loading}
            >
              {loading ? 'Atualizando…' : 'Atualizar'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={exportCsv} disabled={!items.length}>
              Exportar CSV
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={openPanel}>
              Totem
            </button>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onLogout}>
              Sair
            </button>
          </div>
        </header>

        <section className="admin-cards" aria-label="Indicadores">
          <article className="admin-card">
            <span>Total</span>
            <strong>{stats?.total ?? '—'}</strong>
          </article>
          <article className="admin-card">
            <span>Hoje</span>
            <strong>{stats?.hoje ?? '—'}</strong>
          </article>
          <article className="admin-card">
            <span>7 dias</span>
            <strong>{stats?.semana ?? '—'}</strong>
          </article>
          <article className="admin-card">
            <span>Municípios</span>
            <strong>{stats?.municipios ?? '—'}</strong>
          </article>
        </section>

        <section className="admin-toolbar" aria-label="Filtros">
          <label className="admin-field admin-field--grow">
            <span>Busca</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Nome, e-mail ou telefone"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void loadData(token)
              }}
            />
          </label>
          <label className="admin-field">
            <span>UF</span>
            <select
              value={estado}
              onChange={(e) => {
                setEstado(e.target.value)
                setMunicipio('')
              }}
            >
              <option value="">Todas</option>
              {BR_ESTADOS.map((e) => (
                <option key={e.uf} value={e.uf}>
                  {e.uf}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field admin-field--md">
            <span>Município</span>
            <select
              value={municipio}
              onChange={(e) => setMunicipio(e.target.value)}
              disabled={!estado}
            >
              <option value="">{estado ? 'Todos' : 'UF primeiro'}</option>
              {municipiosFiltro.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field admin-field--lg">
            <span>Cargo</span>
            <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
              <option value="">Todos</option>
              {CARGO_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="admin-field">
            <span>De</span>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Até</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <div className="admin-toolbar-actions">
            <button
              type="button"
              className="admin-btn"
              onClick={() => void loadData(token)}
              disabled={loading}
            >
              {loading ? 'Filtrando…' : 'Filtrar'}
            </button>
            {hasFilters ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={clearFilters}>
                Limpar
              </button>
            ) : null}
          </div>
        </section>

        {loadError ? <p className="admin-error">{loadError}</p> : null}

        <section className="admin-panel admin-panel--map" aria-label="Mapa de interessados">
          <header className="admin-panel-head">
            <h2>Mapa</h2>
            <p>Pontos por município · segmentados por cargo</p>
          </header>
          <AdminMap items={items} />
        </section>

        <section className="admin-panel admin-list-panel" aria-label="Lista de inscritos">
          <header className="admin-panel-head admin-panel-head--row">
            <div>
              <h2>Inscritos</h2>
              <p>
                {items.length === 1
                  ? '1 registro nesta visão'
                  : `${items.length} registros nesta visão`}
              </p>
            </div>
          </header>

          <div className="admin-sheet-wrap">
            <table className="admin-sheet">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">UF</th>
                  <th scope="col">Município</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Data</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    <td className="admin-sheet-name">{row.nome}</td>
                    <td className="admin-sheet-uf">{row.estado || '—'}</td>
                    <td>{row.municipio || '—'}</td>
                    <td>{row.cargo || '—'}</td>
                    <td>
                      {row.email ? (
                        <a href={`mailto:${row.email}`}>{row.email}</a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      {row.telefone ? (
                        <a href={`tel:${row.telefone}`}>{formatPhone(row.telefone)}</a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="admin-sheet-date">
                      <time dateTime={row.created_at}>{formatDate(row.created_at)}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {items.length === 0 ? (
              <p className="admin-empty">Nenhum registro encontrado com esses filtros.</p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
