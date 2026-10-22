import { useEffect, useRef } from 'react'

type SiteWindowProps = {
  url: string
  title?: string
  className?: string
  onExpand?: () => void
}

/** Tempo da rolagem topo → rodapé (ms) — meio-termo (~2 min). */
const LEG_MS = 120000
/** Pausa no topo antes de começar a descer (ms). */
const HOLD_TOP_MS = 1400
/** Pausa no rodapé antes de “atualizar” (ms). */
const HOLD_BOTTOM_MS = 2200

function WinIcon({ kind }: { kind: 'min' | 'max' | 'close' }) {
  if (kind === 'min') {
    return (
      <svg viewBox="0 0 10 10" aria-hidden="true">
        <path d="M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    )
  }
  if (kind === 'max') {
    return (
      <svg viewBox="0 0 10 10" aria-hidden="true">
        <rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true">
      <path
        d="M2 2l6 6M8 2l-6 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function prepareDocument(doc: Document) {
  doc.documentElement.style.scrollBehavior = 'auto'
  doc.body?.classList.remove('page-load')
  if (doc.head.querySelector('[data-labcidades-scroll]')) return
  const style = doc.createElement('style')
  style.setAttribute('data-labcidades-scroll', '1')
  style.textContent = `
    html, body { scroll-behavior: auto !important; }
    html { scrollbar-width: none; }
    html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
  `
  doc.head.appendChild(style)
}

function measureMaxScroll(win: Window, doc: Document) {
  const el = (doc.scrollingElement || doc.documentElement) as HTMLElement
  const candidates = [
    el.scrollHeight,
    doc.documentElement.scrollHeight,
    doc.body?.scrollHeight ?? 0,
    doc.body?.offsetHeight ?? 0,
  ]

  const footer = doc.querySelector('.footer, footer') as HTMLElement | null
  if (footer) {
    candidates.push(footer.offsetTop + footer.offsetHeight + 24)
    const rect = footer.getBoundingClientRect()
    candidates.push(win.scrollY + rect.bottom + 24)
  }

  const last = doc.body?.lastElementChild as HTMLElement | null
  if (last) {
    candidates.push(last.offsetTop + last.offsetHeight + 24)
  }

  const contentH = Math.max(...candidates)
  const viewH = win.innerHeight || el.clientHeight || 1
  return Math.max(0, contentH - viewH)
}

function setScrollTop(win: Window, doc: Document, y: number) {
  const el = (doc.scrollingElement || doc.documentElement) as HTMLElement
  el.scrollTop = y
  doc.documentElement.scrollTop = y
  if (doc.body) doc.body.scrollTop = y
  win.scrollTo(0, y)
}

export function SiteWindow({
  url,
  title = 'LabCidades',
  className = '',
  onExpand,
}: SiteWindowProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const host = (() => {
    try {
      return new URL(url).host
    } catch {
      return url
    }
  })()

  // Sites locais em /sites (mesma origem) permitem rolagem até o rodapé.
  const frameSrc = url

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    let raf = 0
    const timers = new Set<number>()
    let start = 0
    let cancelled = false
    let maxY = 0
    let finished = false

    const stop = () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      timers.forEach((id) => window.clearTimeout(id))
      timers.clear()
      raf = 0
    }

    const refreshMax = (win: Window, doc: Document) => {
      maxY = measureMaxScroll(win, doc)
      return maxY
    }

    const reloadLikeRefresh = () => {
      // Volta ao início como se a página tivesse sido atualizada.
      frame.src = `${frameSrc}${frameSrc.includes('?') ? '&' : '?'}r=${Date.now()}`
    }

    const run = () => {
      const win = frame.contentWindow
      const doc = frame.contentDocument
      if (!win || !doc?.documentElement || !doc.body) return

      prepareDocument(doc)
      refreshMax(win, doc)
      setScrollTop(win, doc, 0)
      finished = false
      start = performance.now()

      const tick = (now: number) => {
        if (cancelled || finished) return

        refreshMax(win, doc)
        const t = now - start

        if (t < HOLD_TOP_MS) {
          setScrollTop(win, doc, 0)
          raf = requestAnimationFrame(tick)
          return
        }

        const downT = t - HOLD_TOP_MS
        if (downT < LEG_MS) {
          setScrollTop(win, doc, maxY * (downT / LEG_MS))
          raf = requestAnimationFrame(tick)
          return
        }

        // No rodapé: segura e depois “atualiza” a página.
        setScrollTop(win, doc, maxY)
        if (downT < LEG_MS + HOLD_BOTTOM_MS) {
          raf = requestAnimationFrame(tick)
          return
        }

        finished = true
        reloadLikeRefresh()
      }

      raf = requestAnimationFrame(tick)
    }

    const onLoad = () => {
      const doc = frame.contentDocument
      if (!doc?.body || doc.URL === 'about:blank') return

      stop()
      cancelled = false
      const t1 = window.setTimeout(() => {
        timers.delete(t1)
        run()
      }, 500)
      timers.add(t1)
    }

    frame.addEventListener('load', onLoad)
    return () => {
      frame.removeEventListener('load', onLoad)
      stop()
    }
  }, [frameSrc])

  return (
    <div
      className={`site-window ${className}`.trim()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="site-window__chrome" aria-hidden="true">
        <div className="site-window__caption">
          <span className="site-window__app-icon" />
          <span className="site-window__title">{title}</span>
        </div>
        <div className="site-window__controls">
          <span className="site-window__btn site-window__btn--min" title="Minimizar">
            <WinIcon kind="min" />
          </span>
          <button
            type="button"
            className="site-window__btn site-window__btn--max"
            title="Maximizar"
            aria-label="Ampliar site"
            onPointerUp={(e) => {
              e.stopPropagation()
              onExpand?.()
            }}
          >
            <WinIcon kind="max" />
          </button>
          <span className="site-window__btn site-window__btn--close" title="Fechar">
            <WinIcon kind="close" />
          </span>
        </div>
      </div>

      <div className="site-window__body">
        <iframe
          ref={frameRef}
          className="site-window__frame"
          src={frameSrc}
          title={`${title} — ${host}`}
          loading="eager"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen"
        />
      </div>
    </div>
  )
}
