import { useEffect, useRef, useState } from 'react'
import {
  CONTACT,
  LAB,
  POS,
  SOLUTIONS,
  STAGES,
  type PosTabId,
  type Solution,
  type SolutionId,
  type StageId,
} from './data'
import { useSwipe } from './hooks'
import { HomeButton, Logo } from './visuals'
import type { CanvasFocus } from './CityCanvas'
import { WORDMARK_LAYOUT } from './wordmarkLayout'

function StageIcon({ type }: { type: 'challenge' | 'solution' | 'impact' }) {
  if (type === 'challenge') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3.5 4.8 20.5h14.4L12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 10v4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="17.2" r="1.1" fill="currentColor" />
      </svg>
    )
  }
  if (type === 'solution') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9.5 18.5h5M10.2 15.8c-2.4-1-4-3.3-4-5.9A5.8 5.8 0 0 1 12 4a5.8 5.8 0 0 1 5.8 5.9c0 2.6-1.6 4.9-4 5.9"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M10.5 21h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 16.5 9.2 12l3.1 3.1L19 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.5 8.5H19v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NavIcon({ id }: { id: SolutionId }) {
  if (id === 'reurb') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 20V9.2L12 4l8 5.2V20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9.5 20v-6h5v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (id === 'consulta') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4.5 8.5h15M4.5 12.5h15M4.5 16.5h15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="8" cy="8.5" r="1.4" fill="currentColor" />
        <circle cx="12" cy="12.5" r="1.4" fill="currentColor" />
        <circle cx="16" cy="16.5" r="1.4" fill="currentColor" />
      </svg>
    )
  }
  if (id === 'fiscal') {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4.5 18.5V5.5M4.5 18.5h15"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M8 14.5v4M12 10.5v8M16 7.5v11"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20.5c0-3.2 1.5-5.4 3.4-7.1 1.5-1.3 2.6-2.8 2.6-4.7A6 6 0 0 0 12 2.8 6 6 0 0 0 6 8.7c0 1.9 1.1 3.4 2.6 4.7 1.9 1.7 3.4 3.9 3.4 7.1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9.2 10.2c.8-.9 1.8-1.4 2.8-1.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function Splash({
  onExplore,
  onContact,
  onPos,
}: {
  onExplore: () => void
  onContact: () => void
  onPos: () => void
}) {
  return (
    <div className="layer enter splash splash--ai" onPointerUp={onExplore}>
      <div
        className="splash-brand"
        aria-hidden="true"
        style={{
          bottom: `${WORDMARK_LAYOUT.bottom}vh`,
        }}
      >
        <p
          className="splash-wordmark"
          style={{
            fontSize: `${WORDMARK_LAYOUT.size}vw`,
            letterSpacing: `${WORDMARK_LAYOUT.letterSpacing}em`,
          }}
        >
          LABCIDADES
        </p>
        <p
          className="splash-tagline"
          style={{ fontSize: `${WORDMARK_LAYOUT.size * WORDMARK_LAYOUT.tagScale}vw` }}
        >
          {LAB.tag}
        </p>
      </div>
      <div className="splash-panel">
        <div className="splash-actions">
          <div className="splash-cta-row">
            <button
              className="cta"
              onPointerUp={(e) => {
                e.stopPropagation()
                onExplore()
              }}
            >
              <span>{LAB.cta}</span>
            </button>
            <button
              className="cta"
              onPointerUp={(e) => {
                e.stopPropagation()
                onPos()
              }}
            >
              <span>{LAB.posCta}</span>
            </button>
            <button
              className="cta"
              onPointerUp={(e) => {
                e.stopPropagation()
                onContact()
              }}
            >
              <span>{LAB.contactCta}</span>
            </button>
          </div>
          <p className="hint">{LAB.invite}</p>
        </div>
      </div>
    </div>
  )
}

export function Contact({
  onHome,
  onFocus,
}: {
  onHome: () => void
  onFocus?: (focus: CanvasFocus | null) => void
}) {
  const content = CONTACT
  const qrRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = qrRef.current
    if (!el || !onFocus) return

    const publish = () => {
      const target = el.querySelector('.contact-qr') as HTMLElement | null
      const box = (target ?? el).getBoundingClientRect()
      if (box.width < 8 || box.height < 8) return
      onFocus({
        x: Math.round(box.left + box.width / 2),
        y: Math.round(box.top + box.height / 2),
        w: Math.round(box.width),
        h: Math.round(box.height),
      })
    }

    publish()
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    window.addEventListener('resize', publish)
    const img = el.querySelector('img')
    img?.addEventListener('load', publish)
    const timer = window.setTimeout(publish, 100)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', publish)
      img?.removeEventListener('load', publish)
      window.clearTimeout(timer)
      onFocus(null)
    }
  }, [onFocus])

  return (
    <div className="layer enter contact">
      <div className="splash-scrim contact-scrim" aria-hidden="true" />

      <div className="topbar">
        <div className="logo-row">
          <Logo height={52} />
          <div>
            <strong>{LAB.name}</strong>
            <small>{content.kicker}</small>
          </div>
        </div>
        <HomeButton onPress={onHome} />
      </div>

      <div className="contact-stage">
        <div className="contact-copy">
          <div className="kicker">{content.kicker}</div>
          <h1 className="contact-title">{content.headline}</h1>
          <p className="contact-line">{content.line}</p>
        </div>

        <div className="contact-qr-stage" ref={qrRef}>
          <div className="contact-qr-halo" aria-hidden="true" />
          <div className="contact-qr-wrap">
            <img
              src={content.qrSrc}
              alt={content.qrLabel}
              className="contact-qr"
              draggable={false}
            />
          </div>
          <p className="contact-url">{content.urlLabel}</p>
        </div>

        <div className="contact-footer">
          <img
            src={content.ufesSrc}
            alt={content.ufesLabel}
            className="contact-ufes-logo"
            draggable={false}
          />
          <button type="button" className="cta contact-home-cta" onPointerUp={onHome}>
            <span>Voltar ao início</span>
          </button>
          <p className="hint">{content.invite}</p>
        </div>
      </div>
    </div>
  )
}

export function Pos({ onHome }: { onHome: () => void }) {
  const [tab, setTab] = useState<PosTabId>('sobre')

  return (
    <div className="layer enter pos">
      <div className="topbar">
        <div className="logo-row">
          <Logo height={52} />
          <div>
            <strong>{POS.headline}</strong>
            <small>{POS.kicker}</small>
          </div>
        </div>
        <HomeButton onPress={onHome} />
      </div>

      <div className="pos-hero">
        <h1 className="display">{POS.title}</h1>
        <div className="pos-facts" aria-label="Dados do curso">
          {POS.facts.map((fact) => (
            <div key={fact.label} className="pos-fact">
              <span>{fact.label}</span>
              <strong>{fact.value}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="pos-tabs" role="tablist" aria-label="Seções da pós-graduação">
        {POS.tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`pos-tab${tab === item.id ? ' is-active' : ''}`}
            onPointerUp={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="pos-panel" role="tabpanel">
        {tab === 'sobre' && (
          <div className="pos-section pos-section--sobre">
            <h2>Sobre o curso</h2>
            <p className="pos-about">{POS.about}</p>
            <dl className="pos-meta-list">
              <div>
                <dt>Coordenação</dt>
                <dd>{POS.coordinator}</dd>
              </div>
              <div>
                <dt>Carga horária</dt>
                <dd>{POS.hours}</dd>
              </div>
              <div>
                <dt>Organização</dt>
                <dd>{POS.modulesCount}</dd>
              </div>
            </dl>
            <div className="pos-offers">
              {POS.offers.map((offer) => (
                <div key={offer.year} className="pos-offer">
                  <strong>Oferta {offer.year}</strong>
                  <p>{offer.poles}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'perfil' && (
          <div className="pos-section pos-section--perfil">
            <h2>Perfil do egresso</h2>
            <p>Ao concluir o curso, espera-se que os profissionais sejam capazes de:</p>
            <ul className="pos-bullets">
              {POS.profile.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {tab === 'grade' && (
          <div className="pos-section pos-section--grade">
            <h2>Grade curricular</h2>
            <p>
              Especialização com {POS.hours}, organizada em módulos interdisciplinares de gestão,
              planejamento urbano e dados.
            </p>
            <div className="pos-modules">
              {POS.modules.map((module) => (
                <article key={module.id} className="pos-module">
                  <h3>{module.title}</h3>
                  <ul>
                    {module.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bottombar">
        <span>Fonte: SEAD / UFES</span>
        <span>{POS.source}</span>
      </div>
    </div>
  )
}

export function Hub({
  onHome,
  onOpen,
  onContact,
}: {
  onHome: () => void
  onOpen: (id: SolutionId) => void
  onContact?: () => void
}) {
  const [preview, setPreview] = useState<Solution | null>(null)

  return (
    <div className="layer enter hub">
      <div className="topbar">
        <div className="logo-row">
          <Logo height={52} />
          <div>
            <strong>{LAB.full}</strong>
            <small>{LAB.place}</small>
          </div>
        </div>
        <div className="top-actions">
          {onContact && (
            <button type="button" className="home-btn contact-btn" onPointerUp={onContact}>
              {LAB.contactCta}
            </button>
          )}
          <HomeButton onPress={onHome} />
        </div>
      </div>

      <div className="hub-copy">
        <h1 className="display">O que o LabCidades entrega para as cidades</h1>
      </div>

      <div className="cards">
        {SOLUTIONS.map((solution, index) => (
          <button
            key={solution.id}
            className="card"
            style={
              {
                '--accent': solution.accent,
                '--accent-soft': solution.accentSoft,
              } as React.CSSProperties
            }
            onPointerUp={() => setPreview(solution)}
          >
            <div className="card-top">
              <span className="card-index">0{index + 1}</span>
              <span className="card-area">{solution.area}</span>
            </div>
            <div className="card-visual">
              <img
                src={solution.image}
                alt=""
                className="card-image"
                draggable={false}
              />
            </div>
            <h2>{solution.name}</h2>
            <p className="tagline">{solution.tagline}</p>
            <div className="explore-more">Ver detalhes</div>
          </button>
        ))}
      </div>

      <div className="bottombar">
        <span>{LAB.place}</span>
        {onContact ? (
          <button type="button" className="bottom-link" onPointerUp={onContact}>
            {LAB.contactCta}
          </button>
        ) : (
          <span>labcidades.ufes.br</span>
        )}
      </div>

      {preview && (
        <SolutionDetail
          solution={preview}
          mode="hub"
          onClose={() => setPreview(null)}
          onExplore={() => {
            const id = preview.id
            setPreview(null)
            onOpen(id)
          }}
        />
      )}
    </div>
  )
}

export function Explore({
  solution,
  stage,
  onStage,
  onHome,
  onHub,
  onSolution,
}: {
  solution: Solution
  stage: StageId
  onStage: (stage: StageId) => void
  onHome: () => void
  onHub: () => void
  onSolution: (id: SolutionId) => void
}) {
  const [openImage, setOpenImage] = useState(false)
  const slides = solution.gallery?.length ? solution.gallery : [solution.image]
  const [shotIndex, setShotIndex] = useState(0)
  const shotSrc = slides[shotIndex % slides.length]
  const content = solution.stages[stage]
  const swipe = useSwipe((dir) => {
    const ids = SOLUTIONS.map((s) => s.id)
    const index = ids.indexOf(solution.id)
    const next =
      dir === 'left'
        ? ids[(index + 1) % ids.length]
        : ids[(index - 1 + ids.length) % ids.length]
    onSolution(next)
  })

  useEffect(() => {
    setShotIndex(0)
  }, [solution.id])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => {
      setShotIndex((value) => (value + 1) % slides.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [solution.id, slides.length])

  return (
    <div className="layer enter explore">
      <div className="topbar">
        <div className="logo-row">
          <Logo height={48} />
          <div>
            <strong>{solution.name}</strong>
            <small>{solution.area}</small>
          </div>
        </div>
        <div className="top-actions">
          <button className="home-btn" onPointerUp={onHub}>
            Todos os projetos
          </button>
          <HomeButton onPress={onHome} />
        </div>
      </div>

      <div className="explore-head" {...swipe}>
        <div className="kicker">{solution.area}</div>
        <h1 className="display explore-title">{solution.name}</h1>
        <p className="purpose">{solution.purpose}</p>
      </div>

      <div className="stage-nav">
        {STAGES.map((item) => (
          <button
            key={item.id}
            className={`stage-btn ${stage === item.id ? 'on' : ''}`}
            style={{ '--accent': solution.accent } as React.CSSProperties}
            onPointerUp={() => onStage(item.id)}
          >
            <span className="stage-icon" aria-hidden="true">
              <StageIcon type={item.icon} />
            </span>
            <span className="stage-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div
        className="explore-body"
        style={
          {
            '--accent': solution.accent,
            '--accent-soft': solution.accentSoft,
          } as React.CSSProperties
        }
      >
        <div className="panel story">
          <h3>{content.title}</h3>
          <p className="message">{content.message}</p>
          <ul className="points">
            {content.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          className="panel viz viz-button"
          onPointerUp={() => setOpenImage(true)}
          aria-label={`Ampliar imagem de ${solution.name}`}
        >
          <div className="solution-shot">
            <img
              key={shotSrc}
              src={shotSrc}
              alt={`Interface do projeto ${solution.name}`}
              className="solution-shot-image"
              draggable={false}
            />
            {slides.length > 1 && (
              <div className="solution-shot-dots" aria-hidden="true">
                {slides.map((src, i) => (
                  <span
                    key={`${src}-${i}`}
                    className={`solution-shot-dot${i === shotIndex % slides.length ? ' is-active' : ''}`}
                  />
                ))}
              </div>
            )}
            <div className="solution-shot-caption">
              <strong>{solution.name}</strong>
              <span className="solution-shot-hint">Toque para ampliar</span>
            </div>
          </div>
        </button>
      </div>

      <div className="rail">
        {SOLUTIONS.map((item) => (
          <button
            key={item.id}
            className={`nav-pill ${item.id === solution.id ? 'on' : ''}`}
            style={{ '--accent': item.accent } as React.CSSProperties}
            onPointerUp={() => onSolution(item.id)}
          >
            <NavIcon id={item.id} />
            <span>{item.short}</span>
          </button>
        ))}
      </div>

      {openImage && (
        <SolutionDetail
          solution={solution}
          mode="explore"
          imageSrc={shotSrc}
          onClose={() => setOpenImage(false)}
        />
      )}
    </div>
  )
}

function SolutionDetail({
  solution,
  mode,
  onClose,
  onExplore,
  imageSrc,
}: {
  solution: Solution
  mode: 'hub' | 'explore'
  onClose: () => void
  onExplore?: () => void
  imageSrc?: string
}) {
  const src = imageSrc ?? solution.image

  return (
    <div
      className="detail-overlay enter"
      style={
        {
          '--accent': solution.accent,
          '--accent-soft': solution.accentSoft,
        } as React.CSSProperties
      }
      onPointerUp={onClose}
    >
      <div className="detail-fullscreen" onPointerUp={(e) => e.stopPropagation()}>
        <img
          className="detail-fullscreen-image"
          src={src}
          alt={`Detalhe de ${solution.name}`}
          draggable={false}
        />

        <button type="button" className="detail-close" onPointerUp={onClose}>
          Fechar
        </button>

        <div className="detail-bar">
          <div className="detail-bar-copy">
            <span className="detail-bar-area">{solution.area}</span>
            <strong className="detail-bar-title">{solution.name}</strong>
            <p className="detail-bar-text">{solution.tagline}</p>
          </div>
          {mode === 'hub' && onExplore ? (
            <button type="button" className="cta detail-cta" onPointerUp={onExplore}>
              <span>Explorar o projeto</span>
            </button>
          ) : (
            <button type="button" className="detail-secondary" onPointerUp={onClose}>
              Voltar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
