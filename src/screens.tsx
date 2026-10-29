import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  CERT,
  CONTACT,
  LAB,
  POS,
  QUIZ,
  SOLUTIONS,
  STAGES,
  BRINDE,
  quizResultBand,
  quizResultTitle,
  type BrindePrize,
  type BrindePrizeId,
  type PosProgramTabId,
  type QuizOption,
  type Solution,
  type SolutionId,
  type StageId,
} from './data'
import { CertQr } from './CertQr'
import { useSwipe } from './hooks'
import SplashDataRain from './SplashDataRain'
import { ExploreCarousel } from './ExploreCarousel'
import { HomeWordmarkEdit } from './HomeWordmarkEdit'
import { SiteWindow } from './SiteWindow'
import { Logo } from './visuals'

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

function CscFrame({
  children,
  clear = false,
  compact = false,
  className = '',
  backdrop,
}: {
  children: ReactNode
  clear?: boolean
  compact?: boolean
  className?: string
  backdrop?: ReactNode
}) {
  const frameClass = [
    'csc-frame',
    clear ? 'csc-frame--clear' : '',
    compact ? 'csc-frame--compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="layer enter csc">
      <div className="csc-viewport">
        {backdrop}
        <div className={frameClass}>{children}</div>
      </div>
    </div>
  )
}

function SplashBackdrop() {
  return (
    <div className="csc-splash-backdrop" aria-hidden="true">
      <SplashDataRain />
    </div>
  )
}

function CscBar({ onHome, onBack }: { onHome: () => void; onBack?: () => void }) {
  return (
    <header className="csc-bar">
      <img
        className="csc-wordmark-header"
        src={LAB.wordmarkHeaderSrc}
        alt="LabCidades - Laboratório de projetos"
        draggable={false}
      />
      <div className="csc-bar-actions">
        {onBack ? (
          <button type="button" className="csc-voltar" onPointerUp={onBack}>
            Voltar
          </button>
        ) : null}
        <button type="button" className="csc-inicio" onPointerUp={onHome}>
          Início
        </button>
      </div>
    </header>
  )
}

function toggleDocumentFullscreen() {
  const root = document.documentElement
  const anyDoc = document as Document & {
    webkitFullscreenElement?: Element | null
    webkitExitFullscreen?: () => Promise<void> | void
  }
  const anyRoot = root as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
  }
  const active = document.fullscreenElement || anyDoc.webkitFullscreenElement
  if (active) {
    if (document.exitFullscreen) void document.exitFullscreen()
    else anyDoc.webkitExitFullscreen?.()
    return
  }
  if (root.requestFullscreen) void root.requestFullscreen()
  else anyRoot.webkitRequestFullscreen?.()
}

export function Splash({
  onExplore,
  onPos,
  onCert,
  onQuiz,
  onAdmin,
}: {
  onExplore: () => void
  onPos: () => void
  onCert: () => void
  onQuiz: () => void
  onAdmin: () => void
}) {
  const [isFullscreen, setIsFullscreen] = useState(() =>
    typeof document !== 'undefined'
      ? Boolean(document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement)
      : false,
  )

  useEffect(() => {
    const sync = () => {
      const anyDoc = document as Document & { webkitFullscreenElement?: Element | null }
      setIsFullscreen(Boolean(document.fullscreenElement || anyDoc.webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', sync)
    document.addEventListener('webkitfullscreenchange', sync as EventListener)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      document.removeEventListener('webkitfullscreenchange', sync as EventListener)
    }
  }, [])

  return (
    <CscFrame clear backdrop={<SplashBackdrop />}>
      <button
        type="button"
        className="csc-quiz-fab"
        onPointerUp={onQuiz}
        aria-label="Abrir quiz Cidades Inteligentes"
      >
        <span className="csc-quiz-fab__mark" aria-hidden="true">
          ?
        </span>
      </button>
      <button
        type="button"
        className="csc-fs-fab"
        onPointerUp={toggleDocumentFullscreen}
        aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
        title={isFullscreen ? 'Sair da tela cheia (F11)' : 'Tela cheia (F11)'}
      >
        <span className="csc-fs-fab__mark" aria-hidden="true">
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M8 3v5H3M16 3v5h5M8 21v-5H3M16 21v-5h5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M3 8V3h5M21 8V3h-5M3 16v5h5M21 16v5h-5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>
      <button
        type="button"
        className="csc-ufes-btn"
        onPointerUp={onAdmin}
        aria-label="Acesso administrativo UFES"
        title="Painel administrativo"
      >
        <img
          className="csc-ufes"
          src={LAB.ufesMarkSrc}
          alt=""
          draggable={false}
        />
      </button>
      <HomeWordmarkEdit>
        <div className="csc-home-stack">
          <img
            className="csc-wordmark"
            src={LAB.wordmarkSrc}
            alt="LabCidades - Laboratório de projetos"
            draggable={false}
          />
          <p className="csc-home-lead">{LAB.homeLead}</p>
          <div className="csc-home-actions">
            <button type="button" className="csc-home-pill csc-home-pill--pos" onPointerUp={onPos}>
              <span>{LAB.posCta}</span>
            </button>
            <button type="button" className="csc-home-pill csc-home-pill--cert" onPointerUp={onCert}>
              <span>{LAB.certCta}</span>
            </button>
            <button type="button" className="csc-home-pill csc-home-pill--hub" onPointerUp={onExplore}>
              <span>{LAB.cta}</span>
            </button>
          </div>
        </div>
      </HomeWordmarkEdit>
    </CscFrame>
  )
}

export function Contact({
  onHome,
  onBrinde,
}: {
  onHome: () => void
  onBrinde: () => void
}) {
  const content = CONTACT

  return (
    <CscFrame>
      <CscBar onHome={onHome} />
      <h1 className="csc-title">{content.kicker}</h1>
      <p className="csc-org">{LAB.name}</p>
      <div className="csc-type">
        <span className="csc-type-label">SITE</span>
        <span className="csc-type-value">{content.urlLabel}</span>
      </div>
      <section className="csc-sheet csc-sheet--solo">
        <h2>{content.headline}</h2>
        <div className="csc-sheet-body csc-contact-body">
          <img
            src={content.qrSrc}
            alt={content.qrLabel}
            className="csc-qr"
            draggable={false}
          />
          <div>
            <p>{content.line}</p>
            <button type="button" className="csc-conhecer csc-conhecer--live" onPointerUp={onBrinde}>
              {content.brindeCta}
            </button>
            <p className="csc-contact-hint">{content.brindeHint}</p>
          </div>
        </div>
      </section>
    </CscFrame>
  )
}

function pickBrindePrize(prizes: BrindePrize[]): BrindePrize {
  const total = prizes.reduce((sum, p) => sum + p.weight, 0)
  let roll = Math.random() * total
  for (const prize of prizes) {
    roll -= prize.weight
    if (roll <= 0) return prize
  }
  return prizes[0]
}

function SlotArrow() {
  return (
    <svg className="slot-arrow" viewBox="0 0 96 64" aria-hidden="true">
      <defs>
        <linearGradient id="slot-arrow-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff1a8" />
          <stop offset="38%" stopColor="#ffd54a" />
          <stop offset="100%" stopColor="#d8890c" />
        </linearGradient>
        <linearGradient id="slot-arrow-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7d2" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#ffe27a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c46e00" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path
        d="M10 30H54V18L90 36L54 54V42H10Z"
        fill="rgba(16,0,19,0.38)"
        transform="translate(3 5)"
      />
      <path d="M6 24H52V10L92 32L52 54V40H6Z" fill="url(#slot-arrow-body)" />
      <path d="M6 24H52V10L92 32L70 32L52 22H6Z" fill="url(#slot-arrow-shine)" />
      <path
        d="M6 24H52V10L92 32L52 54V40H6Z"
        fill="none"
        stroke="#fff3c2"
        strokeOpacity="0.45"
        strokeWidth="1.6"
      />
    </svg>
  )
}

const CONFETTI_COLORS = ['#c26cff', '#ff8300', '#ffd54a', '#20b2aa', '#e4456a', '#ffb347', '#7ee8e0', '#ffffff']

function SlotConfetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 110 }, (_, i) => {
        const shape = i % 5 === 0 ? 'circle' : i % 5 === 1 ? 'strip' : 'rect'
        const size = 7 + Math.random() * 9
        return {
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.85,
          duration: 2.6 + Math.random() * 2.4,
          drift: `${(Math.random() - 0.5) * 140}px`,
          spin: `${(Math.random() > 0.5 ? 1 : -1) * (280 + Math.random() * 620)}deg`,
          width: shape === 'strip' ? 5 : size,
          height: shape === 'strip' ? size * 2.1 : size,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          shape,
        }
      }),
    [],
  )

  return (
    <div className="slot-confetti" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={`slot-confetti-piece is-${piece.shape}`}
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            ['--drift' as string]: piece.drift,
            ['--spin' as string]: piece.spin,
          }}
        />
      ))}
    </div>
  )
}

export function Brinde({
  onHome,
}: {
  onHome: () => void
  onBack: () => void
}) {
  const prizes = BRINDE.prizes
  const drumFaces = Array.from({ length: 3 }, () => prizes).flat()
  const faceStep = 360 / drumFaces.length
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'result'>('idle')
  const [result, setResult] = useState<BrindePrize | null>(null)
  const [reelAngles, setReelAngles] = useState([0, 0, 0])
  const [animateReels, setAnimateReels] = useState(false)
  const timers = useRef<number[]>([])
  const pendingWinner = useRef<BrindePrize | null>(null)

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const prizeIndex = (id: BrindePrizeId) => prizes.findIndex((p) => p.id === id)
  const busy = phase === 'spinning'

  const spin = () => {
    if (busy) return
    clearTimers()
    const winner = pickBrindePrize(prizes)
    pendingWinner.current = winner
    const winIdx = prizeIndex(winner.id)
    const loops = [4, 6, 8]
    const targets = loops.map((loop) => -(loop * 360 + winIdx * faceStep))

    setResult(null)
    setAnimateReels(false)
    setReelAngles([0, 0, 0])
    setPhase('spinning')

    timers.current.push(
      window.setTimeout(() => {
        setAnimateReels(true)
        setReelAngles(targets)
      }, 50),
    )

    timers.current.push(
      window.setTimeout(() => {
        setResult(pendingWinner.current)
        setPhase('result')
        setAnimateReels(false)
      }, 4200),
    )
  }

  const prizeLine =
    phase === 'spinning'
      ? BRINDE.spinningHint
      : result
        ? result.retry
          ? BRINDE.retryMessage
          : result.label
        : 'PRÊMIO'

  return (
    <div
      className={`layer enter brinde${phase === 'spinning' ? ' is-spinning' : ''}${
        phase === 'result' && result && !result.retry ? ' is-win' : ''
      }`}
    >
      {phase === 'result' && result && !result.retry ? <SlotConfetti key={result.id} /> : null}
      <div className="brinde-cabinet">
        <div className="slot-body">
          <div className="slot-premio-stage">
            <header
              className={`slot-premio${phase === 'result' && result ? (result.retry ? ' is-retry' : ' is-win') : ''}${
                phase === 'spinning' ? ' is-spinning' : ''
              }`}
              aria-live="polite"
            >
              <strong>{prizeLine}</strong>
            </header>
          </div>

          <section className="slot-playfield">
            <div className="slot-playfield-inner">
              <div className="slot-arrow-wrap" aria-hidden="true">
                <SlotArrow />
              </div>
              <div
                className="slot-window"
                style={{ ['--faces' as string]: drumFaces.length }}
              >
                {[0, 1, 2].map((reel) => (
                  <div key={reel} className="slot-reel">
                    <div className="slot-drum-scene">
                      <div
                        className={`slot-drum${animateReels ? ' is-rolling' : ''}`}
                        style={{
                          transform: `rotateX(${reelAngles[reel]}deg)`,
                          transition: animateReels
                            ? `transform ${2.2 + reel * 0.55}s cubic-bezier(0.08, 0.82, 0.12, 1)`
                            : 'none',
                        }}
                      >
                        {drumFaces.map((prize, i) => (
                          <div
                            key={`${reel}-${prize.id}-${i}`}
                            className="slot-cell"
                            style={{
                              transform: `rotateX(${i * faceStep}deg) translateZ(var(--drum-radius))`,
                            }}
                          >
                            <img src={prize.image} alt="" draggable={false} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="slot-reel-shade" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="slot-deck-stage">
            <div className="slot-deck">
              <button type="button" className="slot-round slot-round--home" onPointerUp={onHome}>
                <span className="slot-round-stem" aria-hidden="true" />
                <span className="slot-round-cap">Início</span>
              </button>
              <div className="slot-deck-mark">
                <Logo />
              </div>
              <button
                type="button"
                className="slot-round slot-round--spin"
                onPointerUp={spin}
                disabled={busy}
              >
                <span className="slot-round-stem" aria-hidden="true" />
                <span className="slot-round-cap">{BRINDE.spinCta}</span>
              </button>
            </div>
          </div>

          <footer className="slot-social">
            <p>
              {BRINDE.socialLine} <strong>{BRINDE.socialHandle}</strong>
            </p>
          </footer>
        </div>
        <div className="slot-base" aria-hidden="true" />
      </div>
    </div>
  )
}

export function Pos({ onHome }: { onHome: () => void }) {
  const [programId, setProgramId] = useState<PosProgramTabId>('cidades')
  const program = POS.programs.find((item) => item.id === programId) ?? POS.programs[0]

  return (
    <CscFrame compact className="csc-pos">
      <CscBar onHome={onHome} />
      <h1 className="csc-title csc-pos-title">
        {POS.pageTitle} - <span className="csc-pos-title-org">{POS.org}</span>
      </h1>
      <div className="csc-course-tabs" role="tablist" aria-label="Especializações">
        {POS.programs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={programId === item.id}
            className={`csc-course-tab${programId === item.id ? ' is-active' : ''}`}
            onPointerUp={() => setProgramId(item.id)}
          >
            {item.tabLabel}
          </button>
        ))}
      </div>
      <section className="csc-pos-panel" role="tabpanel">
        <header className="csc-pos-card-head">
          <h2 className="csc-pos-course-name">{program.highlight}</h2>
          <p className="csc-pos-degree">{program.degree}</p>
        </header>

        <div className="csc-pos-section csc-pos-section--objective">
          <h3 className="csc-pos-label">{POS.objectiveLabel}</h3>
          <p className="csc-pos-about-text">{program.objective}</p>
        </div>

        <div className="csc-pos-facts" aria-label="Dados do curso">
          <div className="csc-pos-fact">
            <span className="csc-pos-fact-label">Duração</span>
            <span className="csc-pos-fact-value">{program.duration}</span>
          </div>
          <div className="csc-pos-fact">
            <span className="csc-pos-fact-label">Modalidade</span>
            <span className="csc-pos-fact-value">{program.modality}</span>
          </div>
          <div className="csc-pos-fact">
            <span className="csc-pos-fact-label">Carga horária</span>
            <span className="csc-pos-fact-value">{program.hours}</span>
          </div>
        </div>

        <div className="csc-pos-section csc-pos-section--modules">
          <h3 className="csc-pos-label">{POS.orgTitle}</h3>
          <p className="csc-pos-lead">{program.modulesLead}</p>
          <div className="csc-pos-stack-gap" aria-hidden="true" />
          <div className="csc-pos-modules">
            {program.modules.map((module) => (
              <article key={module.id} className="csc-pos-module">
                <h4>{module.title}</h4>
                <ul>
                  {module.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </CscFrame>
  )
}

export function Quiz({ onHome }: { onHome: () => void }) {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<QuizOption['id'] | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const total = QUIZ.questions.length
  const question = QUIZ.questions[index]
  const isLast = index >= total - 1

  const reset = () => {
    setIndex(0)
    setPicked(null)
    setRevealed(false)
    setScore(0)
    setDone(false)
  }

  const pick = (id: QuizOption['id']) => {
    if (revealed || done) return
    setPicked(id)
    setRevealed(true)
    if (id === question.correct) setScore((s) => s + 1)
  }

  const advance = () => {
    if (!revealed) return
    if (isLast) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setPicked(null)
    setRevealed(false)
  }

  return (
    <CscFrame className="csc-quiz">
      <CscBar onHome={onHome} />
      <header className="csc-quiz-head">
        <h1 className="csc-quiz-title">{QUIZ.title}</h1>
        <p className="csc-quiz-sub">{QUIZ.subtitle}</p>
      </header>

      {!done ? (
        <section className={`csc-quiz-sheet${revealed ? ' is-revealed' : ''}`}>
          <div className="csc-quiz-progress">
            <span>
              {QUIZ.progressLabel} {index + 1} / {total}
            </span>
            <div className="csc-quiz-progress__bar" aria-hidden="true">
              <i style={{ width: `${((index + (revealed ? 1 : 0)) / total) * 100}%` }} />
            </div>
          </div>

          <p className="csc-quiz-prompt">{question.prompt}</p>

          <div className="csc-quiz-options">
            {question.options.map((opt) => {
              const isCorrect = opt.id === question.correct
              const isPicked = opt.id === picked
              let state = ''
              if (revealed) {
                if (isCorrect) state = 'is-correct'
                else if (isPicked) state = 'is-wrong'
                else state = 'is-muted'
              }
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`csc-quiz-option ${state}`}
                  onPointerUp={() => pick(opt.id)}
                  disabled={revealed}
                >
                  <span className="csc-quiz-option__key">{opt.id}</span>
                  <span className="csc-quiz-option__text">{opt.text}</span>
                </button>
              )
            })}
          </div>

          {revealed ? (
            <div className="csc-quiz-feedback">
              <p className="csc-quiz-feedback__status">
                {picked === question.correct ? QUIZ.correctLabel : QUIZ.wrongLabel}
                {picked !== question.correct ? (
                  <strong> {question.correct}</strong>
                ) : null}
              </p>
              <p className="csc-quiz-feedback__tip">
                <span>{QUIZ.tipLabel}</span> {question.tip}
              </p>
              <button type="button" className="csc-quiz-next" onPointerUp={advance}>
                {isLast ? QUIZ.finishCta : QUIZ.nextCta}
              </button>
            </div>
          ) : null}
        </section>
      ) : (
        <section className="csc-quiz-sheet csc-quiz-result">
          <p className="csc-quiz-result__score">
            {QUIZ.scoreLabel}: <strong>{score}</strong> / {total}
          </p>
          <p className="csc-quiz-result__title">{quizResultTitle(score)}</p>
          <p className="csc-quiz-result__msg">{quizResultBand(score).blurb}</p>
          <div className="csc-quiz-result__actions">
            <button type="button" className="csc-quiz-next" onPointerUp={reset}>
              {QUIZ.againCta}
            </button>
            <button type="button" className="csc-quiz-next csc-quiz-next--ghost" onPointerUp={onHome}>
              {QUIZ.homeCta}
            </button>
          </div>
        </section>
      )}
    </CscFrame>
  )
}

export function Cert({ onHome }: { onHome: () => void }) {
  return (
    <CscFrame className="csc-cert">
      <CscBar onHome={onHome} />
      <div className="csc-cert-body">
        <header className="csc-cert-head">
          <div className="csc-cert-head-copy">
            <p className="csc-cert-kicker">{CERT.org}</p>
            <h1 className="csc-cert-title">{CERT.title}</h1>
            <p className="csc-cert-lead">{CERT.lead}</p>
          </div>
          <div className="csc-cert-type" aria-label={`${CERT.typeLabel}: ${CERT.typeValue}`}>
            <span className="csc-cert-type-label">{CERT.typeLabel}</span>
            <span className="csc-cert-type-value">{CERT.typeValue}</span>
          </div>
        </header>

        <section className="csc-cert-layout">
          <div className="csc-cert-main">
            <p className="csc-cert-about">{CERT.about}</p>
            <div className="csc-cert-tracks" aria-label="Trilhas de capacitação">
              {CERT.tracks.map((track) => (
                <article key={track.id} className="csc-cert-track">
                  <h2>{track.title}</h2>
                  <p>{track.blurb}</p>
                </article>
              ))}
            </div>
            <ul className="csc-cert-list">
              {CERT.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <aside className="csc-cert-qr-panel">
            <h2>{CERT.qrTitle}</h2>
            <p>{CERT.qrHint}</p>
            <div className="csc-cert-qr-stage">
              <CertQr />
            </div>
            <p className="csc-cert-qr-note">Sistema próprio de acompanhamento dos interessados.</p>
          </aside>
        </section>
      </div>
    </CscFrame>
  )
}

export function Hub({
  onHome,
  onOpen,
}: {
  onHome: () => void
  onOpen: (id: SolutionId) => void
}) {
  return (
    <CscFrame className="csc-hub">
      <CscBar onHome={onHome} />
      <h1 className="csc-title csc-title--hub csc-hub-title">{LAB.cta}</h1>
      <div className="csc-cards">
        {SOLUTIONS.map((solution) => {
          const isBanner = Boolean(solution.cardBg)
          return (
            <article
              key={solution.id}
              className={`csc-card${isBanner ? ' csc-card--banner' : ''} csc-card--${solution.id}`}
              onPointerUp={() => onOpen(solution.id)}
            >
              {isBanner ? (
                <div className="csc-card-split">
                  <div className="csc-card-visual" aria-hidden="true">
                    <img
                      className="csc-card-cover"
                      src={solution.cardBg ?? solution.image}
                      alt=""
                      draggable={false}
                    />
                  </div>
                  <div className="csc-card-panel">
                    <span className="csc-card-tag">{solution.cardArea}</span>
                    <div className="csc-card-copy">
                      {solution.brandLogo ? (
                        <img
                          className="csc-card-brand-logo"
                          src={solution.brandLogo}
                          alt={`${solution.brandTitle} ${solution.brandSubtitle}`}
                          draggable={false}
                        />
                      ) : (
                        <div className="csc-card-brand-row">
                          <strong className="csc-card-brand">{solution.brandTitle}</strong>
                          <span className="csc-card-brand-sub">{solution.brandSubtitle}</span>
                        </div>
                      )}
                    </div>
                    {solution.cardTitle ? (
                      <p className="csc-card-impact">{solution.cardTitle}</p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <>
                  <span className="csc-card-tag">{solution.cardArea}</span>
                  <div className="csc-card-media-wrap">
                    <img
                      className="csc-card-media"
                      src={solution.image}
                      alt=""
                      draggable={false}
                    />
                  </div>
                  <div className="csc-card-body">
                    <div className="csc-card-copy">
                      <h2>{solution.cardTitle ?? solution.name}</h2>
                      <p>{solution.cardBlurb ?? solution.tagline}</p>
                    </div>
                    <div className="csc-card-foot">
                      <span className="csc-conhecer">{LAB.conhecerCta}</span>
                    </div>
                  </div>
                </>
              )}
            </article>
          )
        })}
      </div>
    </CscFrame>
  )
}

export function Explore({
  solution,
  stage,
  onStage,
  onHome,
  onBack,
  onSolution,
}: {
  solution: Solution
  stage: StageId
  onStage: (stage: StageId) => void
  onHome: () => void
  onBack: () => void
  onSolution: (id: SolutionId) => void
}) {
  const slides = useMemo(() => {
    if (solution.gallery?.length) return solution.gallery
    if (solution.demo) return [solution.demo]
    return [solution.image]
  }, [solution.demo, solution.gallery, solution.image])
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

  return (
    <CscFrame className="csc-explore">
      <CscBar onHome={onHome} onBack={onBack} />
      <div className="csc-explore-layout" {...swipe}>
        <h1 className="csc-title csc-explore-title">{LAB.exploreTitle}</h1>

        <div className="csc-course-tabs csc-course-tabs--stages" role="tablist" aria-label="Etapas da solução">
          {STAGES.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={stage === item.id}
              className={`csc-course-tab${stage === item.id ? ' is-active' : ''}`}
              onPointerUp={() => onStage(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <section className="csc-explore-panel" role="tabpanel">
          <div className="csc-explore-copy">
            <p className="csc-explore-about-text">{content.message}</p>
            <ul className="csc-explore-points">
              {content.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
          <div className="csc-explore-rule" aria-hidden="true" />
          <div className="csc-explore-showcase">
            <div className={`csc-explore-brand${solution.brandLogo ? ' has-logo' : ''}`}>
              {solution.brandLogo ? (
                <img
                  className="csc-explore-brand-logo"
                  src={solution.brandLogo}
                  alt={`${solution.brandTitle} ${solution.brandSubtitle}`}
                  draggable={false}
                />
              ) : (
                <>
                  <strong>{solution.brandTitle}</strong>
                  <span>{solution.brandSubtitle}</span>
                </>
              )}
            </div>
            <ExploreCarousel images={slides} alt={`Imagens de ${solution.name}`} />
          </div>
        </section>

        <div className="csc-explore-rule csc-explore-rule--rail" aria-hidden="true" />

        <div className="csc-rail" aria-label="Outras soluções">
          {SOLUTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`csc-tab${item.id === solution.id ? ' is-active' : ''}`}
              onPointerUp={() => onSolution(item.id)}
            >
              {item.railLabel}
            </button>
          ))}
        </div>
      </div>
    </CscFrame>
  )
}

function SolutionDetail({
  solution,
  mode,
  onClose,
  onExplore,
  imageSrc,
  liveUrl,
}: {
  solution: Solution
  mode: 'hub' | 'explore'
  onClose: () => void
  onExplore?: () => void
  imageSrc?: string
  liveUrl?: string
}) {
  const src = imageSrc ?? solution.demo ?? solution.image
  const site = liveUrl ?? solution.liveUrl

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
      <div
        className={`detail-fullscreen${site ? ' detail-fullscreen--live' : ''}`}
        onPointerUp={(e) => e.stopPropagation()}
      >
        {site ? (
          <SiteWindow
            className="detail-fullscreen-live"
            url={site}
            title={solution.short}
          />
        ) : (
          <img
            className="detail-fullscreen-image"
            src={src}
            alt={`Detalhe de ${solution.name}`}
            draggable={false}
          />
        )}

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
