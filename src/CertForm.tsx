import { useMemo, useState, type FormEvent } from 'react'
import {
  BR_ESTADOS,
  CARGO_OPTIONS,
  matchEstadoFromAutofill,
  matchMunicipioFromAutofill,
  municipiosDoEstado,
} from './brLocations'
import { CERT, LAB } from './data'

type FormState = {
  nome: string
  estado: string
  municipio: string
  cargo: string
  email: string
  telefone: string
}

const empty: FormState = {
  nome: '',
  estado: '',
  municipio: '',
  cargo: '',
  email: '',
  telefone: '',
}

function openPanel() {
  const url = new URL(window.location.href)
  url.hash = ''
  window.location.href = url.toString()
}

function onlyPhoneDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 11)
}

function formatPhone(value: string) {
  const d = onlyPhoneDigits(value)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export default function CertForm() {
  const [form, setForm] = useState<FormState>(empty)
  const [errors, setErrors] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const municipios = useMemo(() => municipiosDoEstado(form.estado), [form.estado])

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      if (key === 'estado') {
        return { ...prev, estado: String(value), municipio: '' }
      }
      return { ...prev, [key]: value }
    })
  }

  function applyEstadoAutofill(raw: string) {
    const uf = matchEstadoFromAutofill(raw) || raw.toUpperCase().slice(0, 2)
    if (!BR_ESTADOS.some((e) => e.uf === uf)) return
    setForm((prev) => ({
      ...prev,
      estado: uf,
      municipio: prev.estado === uf ? prev.municipio : '',
    }))
  }

  function applyMunicipioAutofill(raw: string) {
    setForm((prev) => {
      const matched = matchMunicipioFromAutofill(prev.estado, raw)
      return { ...prev, municipio: matched || raw }
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSending(true)
    setErrors([])

    try {
      const response = await fetch('/api/certificacao/interesse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          telefone: onlyPhoneDigits(form.telefone),
          lgpd: 'autorizo',
        }),
      })
      const payload = (await response.json()) as { ok?: boolean; errors?: string[] }
      if (!response.ok || !payload.ok) {
        setErrors(payload.errors ?? ['Não foi possível enviar. Tente novamente.'])
        return
      }
      setDone(true)
      setForm(empty)
    } catch {
      setErrors(['Sem conexão com o servidor. Verifique a rede e tente de novo.'])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="cert-form-page">
      <div className="cert-form-shell">
        <header className="cert-form-head">
          <img
            className="cert-form-logo"
            src={LAB.wordmarkSrc}
            alt="LabCidades - Laboratório de projetos"
            draggable={false}
          />
          {!done ? (
            <>
              <h1 className="cert-form-title">Manifeste interesse</h1>
              <p className="cert-form-lead">{CERT.formLead}</p>
            </>
          ) : null}
        </header>

        {done ? (
          <div className="cert-form-success" role="status">
            <div className="cert-form-success-mark" aria-hidden="true">
              ✓
            </div>
            <h2>{CERT.successTitle}</h2>
            <p className="cert-form-success-lead">{CERT.successMessage}</p>
            <p className="cert-form-success-note">{CERT.successContact}</p>
            <div className="cert-form-actions">
              <button type="button" className="cert-form-submit" onClick={openPanel}>
                {CERT.backToPanelCta}
              </button>
              <div className="cert-form-success-links">
                <a
                  className="cert-form-link"
                  href={CERT.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CERT.instagramCta}
                </a>
                <a
                  className="cert-form-link cert-form-link--ghost"
                  href={CERT.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CERT.siteCta}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <form className="cert-form" onSubmit={onSubmit} autoComplete="on" noValidate>
            <section className="cert-form-section">
              <h2>Seus dados</h2>
              <label className="cert-field">
                <span>Nome completo</span>
                <input
                  name="name"
                  autoComplete="name"
                  value={form.nome}
                  onChange={(e) => setField('nome', e.target.value)}
                  required
                />
              </label>

              <div className="cert-form-row">
                <label className="cert-field">
                  <span>Estado</span>
                  <select
                    name="address-level1"
                    autoComplete="address-level1"
                    value={form.estado}
                    onChange={(e) => setField('estado', e.target.value)}
                    onInput={(e) => applyEstadoAutofill((e.target as HTMLSelectElement).value)}
                    required
                  >
                    <option value="" disabled>
                      Selecione o estado
                    </option>
                    {BR_ESTADOS.map((e) => (
                      <option key={e.uf} value={e.uf}>
                        {e.nome} ({e.uf})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="cert-field">
                  <span>Município</span>
                  <select
                    name="address-level2"
                    autoComplete="address-level2"
                    value={form.municipio}
                    onChange={(e) => setField('municipio', e.target.value)}
                    onInput={(e) => applyMunicipioAutofill((e.target as HTMLSelectElement).value)}
                    required
                    disabled={!form.estado}
                  >
                    <option value="">
                      {form.estado ? 'Selecione o município' : 'Escolha o estado primeiro'}
                    </option>
                    {municipios.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="cert-field">
                <span>Tipo de cargo</span>
                <select
                  name="organization-title"
                  autoComplete="organization-title"
                  value={form.cargo}
                  onChange={(e) => setField('cargo', e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {CARGO_OPTIONS.map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <section className="cert-form-section">
              <h2>Contato</h2>
              <div className="cert-form-row">
                <label className="cert-field">
                  <span>E-mail</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    required
                  />
                </label>
                <label className="cert-field">
                  <span>Telefone</span>
                  <input
                    type="tel"
                    name="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(27) 99999-0000"
                    value={form.telefone}
                    onChange={(e) => setField('telefone', formatPhone(e.target.value))}
                    required
                  />
                </label>
              </div>
            </section>

            <section className="cert-form-section">
              <h2>LGPD</h2>
              <p className="cert-lgpd-note">
                Ao enviar este formulário, você declara ciência e autoriza o LabCidades a
                utilizar e compartilhar seus dados pessoais (nome, cargo, município, e-mail
                e telefone) com entidades parceiras, conforme a Lei Geral de Proteção de
                Dados (LGPD).
              </p>
            </section>

            {errors.length > 0 ? (
              <ul className="cert-form-errors">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            ) : null}

            <button type="submit" className="cert-form-submit" disabled={sending}>
              {sending ? 'Enviando…' : CERT.formCta}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
