import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from 'react'

const STORAGE_KEY = 'csc-wordmark-pos'
const DEFAULT = { left: 300, top: 200, width: 840 }

export type WordmarkPos = { left: number; top: number; width: number }

function readStored(): WordmarkPos {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT }
    const parsed = JSON.parse(raw) as Partial<WordmarkPos>
    return {
      left: Number.isFinite(parsed.left) ? Number(parsed.left) : DEFAULT.left,
      top: Number.isFinite(parsed.top) ? Number(parsed.top) : DEFAULT.top,
      width: Number.isFinite(parsed.width) ? Number(parsed.width) : DEFAULT.width,
    }
  } catch {
    return { ...DEFAULT }
  }
}

export function isLogoEditMode() {
  if (typeof window === 'undefined') return false
  const q = new URLSearchParams(window.location.search)
  return q.get('edit') === 'logo' || q.get('edit') === '1'
}

function unitPx(el: HTMLElement | null, name: '--u' | '--v') {
  if (!el) return 1
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  const n = parseFloat(raw)
  return Number.isFinite(n) && n > 0 ? n : 1
}

function cssSnippet(pos: WordmarkPos) {
  return `.csc-wordmark {
  left: calc(${Math.round(pos.left)} * var(--u));
  top: calc(${Math.round(pos.top)} * var(--v));
  width: calc(${Math.round(pos.width)} * var(--u));
}`
}

/** Arraste o logo; scroll = tamanho. Ative com ?edit=logo na URL. */
export function HomeWordmarkEdit({ children }: { children: ReactNode }) {
  const edit = isLogoEditMode()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<WordmarkPos>(() => (edit ? readStored() : { ...DEFAULT }))
  const [copied, setCopied] = useState(false)
  const drag = useRef<{
    px: number
    py: number
    left: number
    top: number
  } | null>(null)

  useEffect(() => {
    if (!edit) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
  }, [edit, pos])

  const style = (
    edit
      ? ({
          ['--wm-left' as string]: String(pos.left),
          ['--wm-top' as string]: String(pos.top),
          ['--wm-width' as string]: String(pos.width),
        } as CSSProperties)
      : undefined
  )

  const onPointerDown = useCallback(
    (e: ReactPointerEvent) => {
      if (!edit) return
      const target = e.target as HTMLElement
      if (!target.closest('.csc-wordmark')) return
      e.preventDefault()
      e.stopPropagation()
      target.setPointerCapture?.(e.pointerId)
      drag.current = { px: e.clientX, py: e.clientY, left: pos.left, top: pos.top }
    },
    [edit, pos.left, pos.top],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent) => {
      if (!edit || !drag.current) return
      const root = wrapRef.current?.closest('.csc-frame') as HTMLElement | null
      const u = unitPx(root, '--u')
      const v = unitPx(root, '--v')
      const dx = (e.clientX - drag.current.px) / u
      const dy = (e.clientY - drag.current.py) / v
      setPos((p) => ({
        ...p,
        left: Math.round((drag.current!.left + dx) * 10) / 10,
        top: Math.round((drag.current!.top + dy) * 10) / 10,
      }))
    },
    [edit],
  )

  const endDrag = useCallback(() => {
    drag.current = null
  }, [])

  const onWheel = useCallback(
    (e: ReactWheelEvent) => {
      if (!edit) return
      const target = e.target as HTMLElement
      if (!target.closest('.csc-wordmark')) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -8 : 8
      setPos((p) => ({
        ...p,
        width: Math.max(120, Math.min(900, Math.round(p.width + delta))),
      }))
    },
    [edit],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(cssSnippet(pos))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  if (!edit) {
    return <>{children}</>
  }

  return (
    <div
      ref={wrapRef}
      className="csc-wm-edit-root"
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onWheel={onWheel}
    >
      {children}
      <div className="csc-wm-hud" role="status">
        <strong>Posicionar logo</strong>
        <span>
          L {Math.round(pos.left)} · T {Math.round(pos.top)} · W {Math.round(pos.width)}
        </span>
        <p>Arraste o logo · scroll = tamanho</p>
        <div className="csc-wm-hud__row">
          <button type="button" onClick={copy}>
            {copied ? 'Copiado' : 'Copiar CSS'}
          </button>
          <button type="button" onClick={() => setPos({ ...DEFAULT })}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
