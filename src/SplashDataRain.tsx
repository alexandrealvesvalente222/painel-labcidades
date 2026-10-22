import { useEffect, useRef } from 'react'
import { viewportSize } from './uiScale'

/** Magenta + teal LabCidades (#32bcae dos botões/logo) */
const MAGENTA = { r: 170, g: 70, b: 220 }
const TEAL = { r: 50, g: 188, b: 174 }
const WHITE = { r: 255, g: 255, b: 255 }

interface Point {
  x: number
  y: number
}

interface Trace {
  points: Point[]
  lengths: number[]
  total: number
  weight: number
  hot: boolean
}

interface Pulse {
  trace: number
  t: number
  speed: number
  hot: boolean
  length: number
}

interface Pad {
  x: number
  y: number
  r: number
  hollow: boolean
  hot: boolean
  phase: number
}

const DIRS: Point[] = [
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
  { x: 0, y: -1 },
  { x: 1, y: -1 },
]

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`
}

/** PRNG determinístico — layout idêntico a cada reload. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LAYOUT_SEED = 0x32bcae01

/** Trilhas estilo PCB (magenta/teal) saindo da borda do wordmark. */
export default function SplashDataRain() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let cx = 0
    let cy = 0
    let logo = { x: 0, y: 0, w: 0, h: 0 }
    let lead = { x: 0, y: 0, w: 0, h: 0 }
    /** Spawn um pouco afastado; o punch final limpa o contorno do logo. */
    const CLEAR = 22
    let logoImg: HTMLImageElement | null = null
    let logoMask: HTMLCanvasElement | null = null
    let logoMaskPad = 0
    let leadMask: HTMLCanvasElement | null = null
    let leadMaskPad = 0
    let traces: Trace[] = []
    let pulses: Pulse[] = []
    let pads: Pad[] = []
    let rnd = mulberry32(LAYOUT_SEED)
    let running = true
    let frame = 0
    let last = performance.now()

    const insideBox = (
      box: { x: number; y: number; w: number; h: number },
      x: number,
      y: number,
      pad = CLEAR,
    ) =>
      box.w > 0 &&
      x > box.x - pad &&
      x < box.x + box.w + pad &&
      y > box.y - pad &&
      y < box.y + box.h + pad

    const insideClearZone = (x: number, y: number, pad = CLEAR) =>
      insideBox(logo, x, y, pad) || insideBox(lead, x, y, pad)

    const outwardDir = (x: number, y: number): Point => {
      const dx = x < cx ? -1 : x > cx ? 1 : 0
      const dy = y < cy ? -1 : y > cy ? 1 : 0
      if (dx === 0 && dy === 0) return { x: 1, y: 0 }
      // Prefer cardinal / 45° nearest to outward
      let best = DIRS[0]
      let bestDot = -2
      for (const d of DIRS) {
        const dot = d.x * dx + d.y * dy
        if (dot > bestDot) {
          bestDot = dot
          best = d
        }
      }
      return best
    }

    const dirIndex = (dx: number, dy: number) => {
      const i = DIRS.findIndex((d) => d.x === dx && d.y === dy)
      return i < 0 ? 0 : i
    }

    const measure = (points: Point[], weight: number, hot: boolean): Trace => {
      const lengths = [0]
      let total = 0
      for (let i = 1; i < points.length; i++) {
        total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y)
        lengths.push(total)
      }
      return { points, lengths, total, weight, hot }
    }

    const pointAt = (trace: Trace, dist: number): Point => {
      const d = Math.max(0, Math.min(dist, trace.total))
      for (let i = 1; i < trace.lengths.length; i++) {
        if (d <= trace.lengths[i]) {
          const a = trace.points[i - 1]
          const b = trace.points[i]
          const seg = trace.lengths[i] - trace.lengths[i - 1] || 1
          const u = (d - trace.lengths[i - 1]) / seg
          return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }
        }
      }
      return trace.points[trace.points.length - 1]
    }

    const strokeWindow = (trace: Trace, from: number, to: number) => {
      const a = Math.max(0, from)
      const b = Math.min(trace.total, to)
      if (b - a < 1) return
      ctx.beginPath()
      const start = pointAt(trace, a)
      ctx.moveTo(start.x, start.y)
      for (let i = 1; i < trace.points.length; i++) {
        const d0 = trace.lengths[i - 1]
        const d1 = trace.lengths[i]
        if (d1 < a) continue
        if (d0 > b) break
        const p = d1 <= b ? trace.points[i] : pointAt(trace, b)
        ctx.lineTo(p.x, p.y)
      }
      ctx.stroke()
    }

    const route = (start: Point, ox: number, oy: number, grid: number, steps: number): Point[] => {
      const points: Point[] = [{ ...start }]
      let x = start.x
      let y = start.y
      let dx = ox
      let dy = oy
      for (let i = 0; i < steps; i++) {
        if (rnd() < 0.4) {
          const turn = rnd() < 0.5 ? 1 : -1
          const next = DIRS[(dirIndex(dx, dy) + turn + 8) % 8]
          const outward = (x - cx) * next.x + (y - cy) * next.y
          if (outward >= 0 || rnd() > 0.78) {
            dx = next.x
            dy = next.y
          }
        }
        const run = 1 + Math.floor(rnd() * 5)
        x += dx * grid * run
        y += dy * grid * run
        points.push({ x, y })
        if (x < -60 || y < -60 || x > width + 60 || y > height + 60) break
      }
      return points
    }

    const readOrigin = () => {
      const parent = canvas.parentElement
      const mark = document.querySelector('.csc-wordmark') as HTMLElement | null
      const leadEl = document.querySelector('.csc-home-lead') as HTMLElement | null

      if (mark && parent) {
        const mr = mark.getBoundingClientRect()
        const pr = parent.getBoundingClientRect()
        logo = {
          x: Math.round(mr.left - pr.left),
          y: Math.round(mr.top - pr.top),
          w: Math.round(mr.width),
          h: Math.round(mr.height),
        }
      } else {
        logo = {
          x: Math.round(width * 0.17),
          y: Math.round(height * 0.27),
          w: Math.round(width * 0.62),
          h: Math.round(height * 0.12),
        }
      }

      if (leadEl && parent) {
        const lr = leadEl.getBoundingClientRect()
        const pr = parent.getBoundingClientRect()
        lead = {
          x: Math.round(lr.left - pr.left),
          y: Math.round(lr.top - pr.top),
          w: Math.round(lr.width),
          h: Math.round(lr.height),
        }
      } else {
        lead = {
          x: Math.round(width * 0.17),
          y: Math.round(height * 0.62),
          w: Math.round(width * 0.66),
          h: Math.round(height * 0.08),
        }
      }

      cx = logo.x + logo.w * 0.5
      cy = logo.y + logo.h * 0.5
    }

    const rebuild = () => {
      readOrigin()
      rebuildLogoMask()
      rebuildLeadMask()
      rnd = mulberry32(LAYOUT_SEED)
      const grid = 14
      traces = []

      const spawn = (x: number, y: number, dx: number, dy: number, hotChance: number) => {
        const hot = rnd() < hotChance
        const pts = route(
          { x, y },
          dx,
          dy,
          grid,
          14 + Math.floor(rnd() * 20),
        )
        traces.push(measure(pts, hot ? 1.85 : 1.05 + rnd() * 0.55, hot))
      }

      // Pontos de saída só na borda do wordmark (centro limpo)
      const gap = CLEAR + 6
      const left = logo.x - gap
      const right = logo.x + logo.w + gap
      const top = logo.y - gap
      const bottom = logo.y + logo.h + gap
      const exits: Point[] = []

      const along = (n: number) => Math.max(5, n)
      const nTop = along(Math.floor(logo.w / 55))
      const nSide = along(Math.floor(logo.h / 28))

      for (let i = 0; i < nTop; i++) {
        const u = (i + 0.5) / nTop
        exits.push({ x: logo.x + logo.w * u, y: top })
        exits.push({ x: logo.x + logo.w * u, y: bottom })
      }
      for (let i = 0; i < nSide; i++) {
        const u = (i + 0.5) / nSide
        exits.push({ x: left, y: logo.y + logo.h * u })
        exits.push({ x: right, y: logo.y + logo.h * u })
      }
      // Cantos
      exits.push({ x: left, y: top }, { x: right, y: top }, { x: left, y: bottom }, { x: right, y: bottom })

      for (const p of exits) {
        const d = outwardDir(p.x, p.y)
        spawn(p.x, p.y, d.x, d.y, 0.45)
        if (rnd() > 0.45) {
          const jitter = DIRS[Math.floor(rnd() * DIRS.length)]
          const outward = (p.x - cx) * jitter.x + (p.y - cy) * jitter.y
          if (outward >= 0) spawn(p.x, p.y, jitter.x, jitter.y, 0.55)
        }
      }

      const nodeMap = new Map<string, Pad>()
      traces.forEach((tr) => {
        tr.points.forEach((p, i) => {
          const lastPt = i === tr.points.length - 1
          const joint = i > 0 && i < tr.points.length - 1
          if (!lastPt && !joint) return
          if (joint && rnd() > 0.55) return
          // Sem pads em cima do logo
          if (insideClearZone(p.x, p.y, CLEAR + 4)) return
          const key = `${Math.round(p.x / 8)}_${Math.round(p.y / 8)}`
          if (nodeMap.has(key)) return
          nodeMap.set(key, {
            x: p.x,
            y: p.y,
            r: lastPt ? 3.2 + rnd() * 2.4 : 2 + rnd() * 1.6,
            hollow: lastPt ? rnd() > 0.45 : rnd() > 0.7,
            hot: tr.hot || rnd() > 0.72,
            phase: rnd() * Math.PI * 2,
          })
        })
      })
      // Pads de origem na borda (destaque ao redor do logo)
      for (const p of exits) {
        if (rnd() > 0.35) continue
        const key = `${Math.round(p.x / 8)}_${Math.round(p.y / 8)}`
        if (nodeMap.has(key)) continue
        nodeMap.set(key, {
          x: p.x,
          y: p.y,
          r: 2.8 + rnd() * 1.8,
          hollow: rnd() > 0.5,
          hot: rnd() > 0.4,
          phase: rnd() * Math.PI * 2,
        })
      }
      pads = [...nodeMap.values()]

      pulses = Array.from({ length: 72 }, () => ({
        trace: Math.floor(rnd() * Math.max(traces.length, 1)),
        t: 0.08 + rnd() * 0.2,
        speed: 0.00038 + rnd() * 0.0007,
        hot: rnd() > 0.4,
        length: 40 + rnd() * 80,
      }))

    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const parent = canvas.parentElement
      const vp = viewportSize()
      width = parent?.clientWidth || vp.width
      height = parent?.clientHeight || vp.height
      canvas.width = Math.max(1, Math.floor(width * dpr))
      canvas.height = Math.max(1, Math.floor(height * dpr))
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rebuild()
    }

    /** Máscara dilatada do wordmark — fecha ocos tipográficos e suaviza a borda. */
    const rebuildLogoMask = () => {
      logoMask = null
      logoMaskPad = 0
      if (!logoImg || logo.w <= 0 || logo.h <= 0) return

      const pad = Math.max(32, logo.h * 0.48)
      const mw = Math.max(1, Math.ceil(logo.w + pad * 2))
      const mh = Math.max(1, Math.ceil(logo.h + pad * 2))
      const mask = document.createElement('canvas')
      mask.width = mw
      mask.height = mh
      const m = mask.getContext('2d')
      if (!m) return

      const layers = [
        { blur: Math.max(26, logo.h * 0.32), scale: 1.06 },
        { blur: Math.max(14, logo.h * 0.18), scale: 1.03 },
        { blur: Math.max(5, logo.h * 0.07), scale: 1 },
        { blur: 0, scale: 1 },
      ]
      for (const layer of layers) {
        const w = logo.w * layer.scale
        const h = logo.h * layer.scale
        const x = pad + (logo.w - w) / 2
        const y = pad + (logo.h - h) / 2
        m.save()
        m.filter = layer.blur > 0 ? `blur(${layer.blur}px)` : 'none'
        m.drawImage(logoImg, x, y, w, h)
        m.restore()
      }

      logoMask = mask
      logoMaskPad = pad
    }

    /** Máscara suave atrás do texto de apoio (home lead). */
    const rebuildLeadMask = () => {
      leadMask = null
      leadMaskPad = 0
      if (lead.w <= 0 || lead.h <= 0) return

      const pad = Math.max(22, lead.h * 0.55)
      const mw = Math.max(1, Math.ceil(lead.w + pad * 2))
      const mh = Math.max(1, Math.ceil(lead.h + pad * 2))
      const mask = document.createElement('canvas')
      mask.width = mw
      mask.height = mh
      const m = mask.getContext('2d')
      if (!m) return

      const radius = Math.min(lead.h * 0.5, 28)
      m.filter = `blur(${Math.max(14, pad * 0.7)}px)`
      m.fillStyle = '#fff'
      m.beginPath()
      // roundRect — borda suave, sem caixa dura
      const x = pad
      const y = pad
      const w = lead.w
      const h = lead.h
      const r = radius
      m.moveTo(x + r, y)
      m.arcTo(x + w, y, x + w, y + h, r)
      m.arcTo(x + w, y + h, x, y + h, r)
      m.arcTo(x, y + h, x, y, r)
      m.arcTo(x, y, x + w, y, r)
      m.closePath()
      m.fill()

      // Núcleo mais opaco no miolo do texto
      m.filter = `blur(${Math.max(4, lead.h * 0.12)}px)`
      m.beginPath()
      m.moveTo(x + r, y)
      m.arcTo(x + w, y, x + w, y + h, r)
      m.arcTo(x + w, y + h, x, y + h, r)
      m.arcTo(x, y + h, x, y, r)
      m.arcTo(x, y, x + w, y, r)
      m.closePath()
      m.fill()

      leadMask = mask
      leadMaskPad = pad
    }

    const punchClearZones = () => {
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      if (logoMask) ctx.drawImage(logoMask, logo.x - logoMaskPad, logo.y - logoMaskPad)
      if (leadMask) ctx.drawImage(leadMask, lead.x - leadMaskPad, lead.y - leadMaskPad)
      ctx.restore()
    }

    const paint = (now: number, dt: number) => {
      ctx.clearRect(0, 0, width, height)

      // Trilhas PCB
      traces.forEach((tr, i) => {
        const shimmer = 0.85 + Math.sin(now * 0.0018 + i * 0.35) * 0.15
        const c = tr.hot ? TEAL : MAGENTA
        ctx.lineJoin = 'miter'
        ctx.lineCap = 'round'

        ctx.beginPath()
        tr.points.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = rgba(c, (tr.hot ? 0.18 : 0.14) * shimmer)
        ctx.lineWidth = tr.weight + 5
        ctx.stroke()

        ctx.beginPath()
        tr.points.forEach((p, j) => (j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
        ctx.strokeStyle = rgba(c, (tr.hot ? 0.62 : 0.4) * shimmer)
        ctx.lineWidth = tr.weight
        ctx.stroke()
      })

      // Pads / vias
      pads.forEach((p) => {
        const blink = 0.65 + Math.sin(now * 0.0022 + p.phase) * 0.35
        const c = p.hot ? TEAL : MAGENTA
        if (p.hollow) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r + 1.4, 0, Math.PI * 2)
          ctx.strokeStyle = rgba(c, 0.55 * blink)
          ctx.lineWidth = 1.4
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2)
          ctx.fillStyle = rgba(WHITE, 0.35 * blink)
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r + 5, 0, Math.PI * 2)
          ctx.fillStyle = rgba(c, 0.12 * blink)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = rgba(p.hot ? TEAL : WHITE, 0.55 + 0.35 * blink)
          ctx.fill()
        }
      })

      // Pulsos de sinal
      pulses.forEach((p) => {
        p.t += p.speed * dt
        if (p.t > 1.05) {
          p.t = -0.02
          p.trace = traces.length ? (p.trace + 11) % traces.length : 0
          p.hot = (p.trace % 5) > 1
        }
        const tr = traces[p.trace]
        if (!tr || tr.total < 8) return
        const dist = p.t * tr.total
        const c = p.hot ? TEAL : WHITE

        ctx.lineCap = 'round'
        ctx.strokeStyle = rgba(p.hot ? TEAL : MAGENTA, 0.3)
        ctx.lineWidth = tr.weight + 9
        strokeWindow(tr, dist - p.length, dist)

        ctx.strokeStyle = rgba(c, 0.95)
        ctx.lineWidth = tr.weight + 0.6
        strokeWindow(tr, dist - p.length * 0.55, dist)

        const head = pointAt(tr, Math.min(tr.total, Math.max(0, dist)))
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 16)
        g.addColorStop(0, rgba(WHITE, 0.95))
        g.addColorStop(0.35, rgba(c, 0.55))
        g.addColorStop(1, rgba(c, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(head.x, head.y, 16, 0, Math.PI * 2)
        ctx.fill()
      })

      punchClearZones()
    }

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(40, now - last)
      last = now
      paint(now, dt)
      frame = requestAnimationFrame(loop)
    }

    const markEl = document.querySelector('.csc-wordmark') as HTMLImageElement | null
    const img = new Image()
    img.decoding = 'async'
    img.src = markEl?.currentSrc || markEl?.src || './csc/wordmark.svg'
    img.onload = () => {
      logoImg = img
      rebuild()
    }
    if (img.complete && img.naturalWidth > 0) logoImg = img

    resize()
    window.addEventListener('resize', resize)
    window.visualViewport?.addEventListener('resize', resize)
    const originTimer = window.setTimeout(rebuild, 100)
    frame = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.clearTimeout(originTimer)
      window.removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="csc-splash-rain" aria-hidden="true" />
}
