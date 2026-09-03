import { useEffect, useRef } from 'react'
import type { ViewId } from './data'

type Mode = ViewId

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

interface Pin {
  x: number
  y: number
  s: number
}

interface Bokeh {
  x: number
  y: number
  r: number
  a: number
  phase: number
  hot: boolean
  vx: number
  vy: number
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  r: number
  hot: boolean
}

interface Wave {
  r: number
  max: number
  a: number
  hot: boolean
}

interface DataBit {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  hot: boolean
  bits: string[]
  size: number
  trail: number
}

interface CityCanvasProps {
  mode: Mode
  accent?: string
  focus?: CanvasFocus | null
}

export interface CanvasFocus {
  x: number
  y: number
  w: number
  h: number
}

/** Brand Book 2024 — Pantone 2597 C / 248 C / 151 C / Black 6 C */
const PURPLE = { r: 93, g: 5, b: 140 }
const MAGENTA = { r: 147, g: 3, b: 159 }
const WHITE = { r: 255, g: 255, b: 255 }
const ORANGE = { r: 255, g: 131, b: 0 }

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

export default function CityCanvas({
  mode,
  accent = '#5d058c',
  focus = null,
}: CityCanvasProps) {
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
    let chipW = 0
    let chipH = 0
    let traces: Trace[] = []
    let pulses: Pulse[] = []
    let pads: Pad[] = []
    let pins: Pin[] = []
    let bokeh: Bokeh[] = []
    let sparks: Spark[] = []
    let waves: Wave[] = []
    let dataBits: DataBit[] = []
    let frame = 0
    let running = true
    let lastSpark = 0
    let lastWave = 0
    let lastData = 0

    const staticScene = mode === 'hub' || mode === 'pos' || mode === 'explore'
    const vivid = true
    const cinematic = mode === 'splash' || mode === 'contact'
    const dense = true

    const randLabel = () => (Math.random() > 0.5 ? '1' : '0')

    const rgba = (c: { r: number; g: number; b: number }, a: number) =>
      `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`

    const dirIndex = (dx: number, dy: number) => {
      const i = DIRS.findIndex((d) => d.x === dx && d.y === dy)
      return i < 0 ? 0 : i
    }

    const measure = (points: Point[], weight: number, hot: boolean): Trace => {
      const lengths: number[] = [0]
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
      let started = false
      const start = pointAt(trace, a)
      ctx.moveTo(start.x, start.y)
      started = true
      for (let i = 1; i < trace.points.length; i++) {
        const d0 = trace.lengths[i - 1]
        const d1 = trace.lengths[i]
        if (d1 < a) continue
        if (d0 > b) break
        const p = d1 <= b ? trace.points[i] : pointAt(trace, b)
        if (!started) {
          const s = d0 < a ? pointAt(trace, a) : trace.points[i - 1]
          ctx.moveTo(s.x, s.y)
          started = true
        }
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
        if (Math.random() < (vivid ? 0.4 : 0.32)) {
          const turn = Math.random() < 0.5 ? 1 : -1
          const next = DIRS[(dirIndex(dx, dy) + turn + 8) % 8]
          const outward = (x - cx) * next.x + (y - cy) * next.y
          if (outward >= 0 || Math.random() > 0.78) {
            dx = next.x
            dy = next.y
          }
        }
        const run = 1 + Math.floor(Math.random() * (vivid ? 5 : 4))
        x += dx * grid * run
        y += dy * grid * run
        points.push({ x, y })
        if (x < -60 || y < -60 || x > width + 60 || y > height + 60) break
      }
      return points
    }

    const spawnSpark = (x: number, y: number, hot = false, burst = false) => {
      const ang = Math.random() * Math.PI * 2
      const speed = burst ? 0.8 + Math.random() * 2.4 : 0.25 + Math.random() * 1.1
      sparks.push({
        x,
        y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life: 0,
        max: 420 + Math.random() * 700,
        r: burst ? 1.6 + Math.random() * 2.4 : 1 + Math.random() * 1.8,
        hot: hot || Math.random() > 0.55,
      })
      if (sparks.length > (vivid ? 140 : 40)) sparks.splice(0, sparks.length - (vivid ? 140 : 40))
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const parent = canvas.parentElement
      width = parent?.clientWidth || window.innerWidth
      height = parent?.clientHeight || window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const canvasBox = canvas.getBoundingClientRect()
      const scaleX = canvasBox.width > 0 ? width / canvasBox.width : 1
      const scaleY = canvasBox.height > 0 ? height / canvasBox.height : 1

      if (cinematic && focus) {
        // Emission from the brain (upper area of the logo mark)
        const logoCx = (focus.x - canvasBox.left) * scaleX
        const logoCy = (focus.y - canvasBox.top) * scaleY
        const logoH = focus.h * scaleY
        const logoW = focus.w * scaleX
        cx = logoCx
        cy = logoCy - logoH * 0.22
        chipW = Math.min(logoW, logoH) * 0.42
        chipH = chipW
      } else {
        cx = width * 0.5
        cy = height * (cinematic ? 0.38 : 0.5)
        chipW = Math.min(width, height) * (cinematic ? 0.22 : 0.09)
        chipH = chipW
      }

      const grid = cinematic ? 14 : 16
      traces = []
      pads = []
      pins = []
      sparks = []
      waves = []
      dataBits = []

      const hw = chipW * 0.58
      const hh = chipH * 0.58
      const spacing = cinematic ? 12 : 16

      const spawn = (x: number, y: number, dx: number, dy: number, hotChance: number) => {
        const hot = Math.random() < hotChance
        const pts = route(
          { x, y },
          dx,
          dy,
          grid,
          dense
            ? (vivid ? 16 : 10) + Math.floor(Math.random() * (vivid ? 24 : 16))
            : 7 + Math.floor(Math.random() * 10),
        )
        traces.push(measure(pts, hot ? 1.85 : 1.05 + Math.random() * 0.55, hot))
      }

      // Radiate from brain core
      for (let i = 0; i < (cinematic ? 56 : 0); i++) {
        const ang = (i / 56) * Math.PI * 2 + Math.random() * 0.15
        const d = DIRS[Math.round((ang / (Math.PI * 2)) * 8) % 8]
        const startR = chipW * (0.22 + Math.random() * 0.18)
        spawn(cx + Math.cos(ang) * startR, cy + Math.sin(ang) * startR, d.x, d.y, vivid ? 0.4 : 0.2)
      }

      if (!cinematic) {
        for (let x = cx - hw + 10; x <= cx + hw - 10; x += spacing) {
          spawn(x, cy - hh, 0, -1, vivid ? 0.22 : 0.12)
          spawn(x, cy + hh, 0, 1, vivid ? 0.22 : 0.12)
          pins.push({ x, y: cy - hh, s: 3 })
          pins.push({ x, y: cy + hh, s: 3 })
        }
        for (let y = cy - hh + 10; y <= cy + hh - 10; y += spacing) {
          spawn(cx - hw, y, -1, 0, vivid ? 0.22 : 0.12)
          spawn(cx + hw, y, 1, 0, vivid ? 0.22 : 0.12)
          pins.push({ x: cx - hw, y, s: 3 })
          pins.push({ x: cx + hw, y, s: 3 })
        }

        ;[
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
        ].forEach(([dx, dy]) => {
          spawn(cx + dx * hw, cy + dy * hh, dx, dy, vivid ? 0.5 : 0.35)
          if (vivid) spawn(cx + dx * hw * 0.7, cy + dy * hh * 0.7, dx, dy, 0.4)
        })

        const extra = vivid ? 48 : dense ? 28 : 12
        for (let i = 0; i < extra; i++) {
          const ang = (i / extra) * Math.PI * 2 + Math.random() * 0.2
          const d = DIRS[Math.round((ang / (Math.PI * 2)) * 8) % 8]
          spawn(cx + d.x * hw * 0.9, cy + d.y * hh * 0.9, d.x, d.y, vivid ? 0.32 : 0.2)
        }
      } else {
        // Extra outward bursts — bias horizontal like data leaving a neural head
        for (let i = 0; i < 36; i++) {
          const side = i % 2 === 0 ? 1 : -1
          const ang = side * (Math.PI * 0.5 + (Math.random() - 0.5) * 1.1)
          const d = DIRS[Math.round(((ang + Math.PI * 2) % (Math.PI * 2) / (Math.PI * 2)) * 8) % 8]
          spawn(
            cx + Math.cos(ang) * chipW * 0.12,
            cy + Math.sin(ang) * chipW * 0.1,
            d.x || side,
            d.y,
            0.6,
          )
        }
      }

      const nodeMap = new Map<string, Pad>()
      traces.forEach((tr) => {
        tr.points.forEach((p, i) => {
          const last = i === tr.points.length - 1
          const joint = i > 0 && i < tr.points.length - 1
          if (!last && !joint) return
          if (joint && Math.random() > (vivid ? 0.55 : 0.42)) return
          const key = `${Math.round(p.x / 8)}_${Math.round(p.y / 8)}`
          if (nodeMap.has(key)) return
          nodeMap.set(key, {
            x: p.x,
            y: p.y,
            r: last ? 3.2 + Math.random() * 2.4 : 2 + Math.random() * 1.6,
            hollow: last ? Math.random() > 0.45 : Math.random() > 0.7,
            hot: tr.hot || Math.random() > (vivid ? 0.72 : 0.86),
            phase: Math.random() * Math.PI * 2,
          })
        })
      })
      pads = [...nodeMap.values()]

      pulses = Array.from(
        { length: staticScene ? 0 : cinematic ? 84 : vivid ? 72 : dense ? 42 : 18 },
        () => ({
          trace: Math.floor(Math.random() * Math.max(traces.length, 1)),
          t: cinematic ? Math.random() * 0.15 : Math.random(),
          speed:
            (cinematic ? 0.00038 : vivid ? 0.00028 : 0.00018) +
            Math.random() * (cinematic ? 0.0007 : vivid ? 0.00055 : 0.00038),
          hot: Math.random() > (cinematic ? 0.4 : vivid ? 0.62 : 0.78),
          length:
            (cinematic ? 40 : vivid ? 34 : 28) + Math.random() * (cinematic ? 80 : vivid ? 72 : 54),
        }),
      )

      bokeh = Array.from({ length: staticScene ? 24 : vivid ? 58 : dense ? 36 : 18 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (vivid ? 18 : 16) + Math.random() * (vivid ? 64 : 48),
        a: (staticScene ? 0.06 : vivid ? 0.08 : 0.035) + Math.random() * (vivid && !staticScene ? 0.14 : 0.06),
        phase: Math.random() * Math.PI * 2,
        hot: Math.random() > (vivid ? 0.55 : 0.82),
        vx: staticScene ? 0 : (Math.random() - 0.5) * (vivid ? 0.12 : 0.04),
        vy: staticScene ? 0 : (Math.random() - 0.5) * (vivid ? 0.1 : 0.03),
      }))
      sparks = []
      waves = []
      dataBits = []
    }

    const drawBackground = (t: number, dt: number) => {
      ctx.fillStyle = cinematic ? '#0a0214' : '#1a0528'
      ctx.fillRect(0, 0, width, height)

      const breath = staticScene ? 0.78 : 0.78 + Math.sin(t * 0.00045) * 0.1
      const wash = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.85)
      if (cinematic) {
        wash.addColorStop(0, `rgba(120, 30, 170, ${breath * 0.55})`)
        wash.addColorStop(0.25, 'rgba(70, 10, 110, 0.55)')
        wash.addColorStop(0.55, 'rgba(28, 6, 48, 0.88)')
        wash.addColorStop(1, 'rgba(8, 1, 16, 1)')
      } else {
        wash.addColorStop(0, `rgba(168, 48, 210, ${breath})`)
        wash.addColorStop(0.18, 'rgba(147, 3, 159, 0.62)')
        wash.addColorStop(0.42, 'rgba(93, 5, 140, 0.55)')
        wash.addColorStop(0.72, 'rgba(42, 8, 64, 0.78)')
        wash.addColorStop(1, 'rgba(22, 4, 34, 0.95)')
      }
      ctx.fillStyle = wash
      ctx.fillRect(0, 0, width, height)

      if (!staticScene) {
        const bloom = ctx.createRadialGradient(
          cx + Math.sin(t * 0.0003) * 40,
          cy + Math.cos(t * 0.00028) * 30,
          20,
          cx,
          cy,
          Math.min(width, height) * (cinematic ? 0.42 : 0.55),
        )
        bloom.addColorStop(0, cinematic ? 'rgba(255, 150, 60, 0.14)' : 'rgba(255, 160, 80, 0.16)')
        bloom.addColorStop(0.35, cinematic ? 'rgba(180, 60, 220, 0.12)' : 'rgba(210, 80, 220, 0.14)')
        bloom.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = bloom
        ctx.fillRect(0, 0, width, height)

        if (!cinematic) {
          const sweep = ctx.createLinearGradient(
            width * (0.2 + Math.sin(t * 0.00025) * 0.15),
            0,
            width * (0.8 + Math.cos(t * 0.00022) * 0.12),
            height,
          )
          sweep.addColorStop(0, 'rgba(255, 131, 0, 0)')
          sweep.addColorStop(0.45, 'rgba(255, 131, 0, 0.08)')
          sweep.addColorStop(0.55, 'rgba(180, 60, 210, 0.1)')
          sweep.addColorStop(1, 'rgba(93, 5, 140, 0)')
          ctx.fillStyle = sweep
          ctx.fillRect(0, 0, width, height)
        }
      } else {
        const bloom = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.min(width, height) * 0.55)
        bloom.addColorStop(0, 'rgba(255, 160, 80, 0.1)')
        bloom.addColorStop(0.4, 'rgba(210, 80, 220, 0.1)')
        bloom.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = bloom
        ctx.fillRect(0, 0, width, height)
      }

      bokeh.forEach((b) => {
        if (!staticScene) {
          b.x += b.vx * dt * 0.06
          b.y += b.vy * dt * 0.06
          if (b.x < -b.r) b.x = width + b.r
          if (b.x > width + b.r) b.x = -b.r
          if (b.y < -b.r) b.y = height + b.r
          if (b.y > height + b.r) b.y = -b.r
        }

        const pulse = staticScene ? 0.85 : 0.7 + Math.sin(t * 0.0007 + b.phase) * 0.3
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, rgba(b.hot ? ORANGE : MAGENTA, b.a * pulse * (cinematic ? 1.2 : 1.85)))
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const drawTraces = (t: number) => {
      traces.forEach((tr, i) => {
        const shimmer = staticScene ? 1 : 0.85 + Math.sin(t * 0.0018 + i * 0.35) * 0.15
        const c = tr.hot ? ORANGE : MAGENTA
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
    }

    const drawPads = (t: number) => {
      pads.forEach((p) => {
        const blink = staticScene ? 0.85 : 0.65 + Math.sin(t * 0.0022 + p.phase) * 0.35
        const c = p.hot ? ORANGE : MAGENTA
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
          ctx.fillStyle = rgba(p.hot ? ORANGE : WHITE, 0.55 + 0.35 * blink)
          ctx.fill()
        }
      })

      ctx.fillStyle = rgba(MAGENTA, 0.7)
      if (!cinematic) {
        pins.forEach((pin) => {
          ctx.fillRect(pin.x - pin.s / 2, pin.y - pin.s / 2, pin.s, pin.s)
        })
      }
    }

    const drawPulses = (dt: number) => {
      pulses.forEach((p) => {
        p.t += p.speed * dt
        if (p.t > 1.05) {
          p.t = cinematic ? -0.02 : -0.05
          p.trace = Math.floor(Math.random() * traces.length)
          p.hot = Math.random() > (cinematic ? 0.38 : vivid ? 0.58 : 0.78)
          if (vivid && Math.random() > 0.7) {
            const tr = traces[p.trace]
            if (tr) {
              const head = pointAt(tr, Math.min(tr.total, Math.max(0, p.t * tr.total)))
              spawnSpark(head.x, head.y, p.hot)
            }
          }
        }
        const tr = traces[p.trace]
        if (!tr || tr.total < 8) return
        const dist = p.t * tr.total
        const c = p.hot ? ORANGE : WHITE

        ctx.lineCap = 'round'
        ctx.strokeStyle = rgba(p.hot ? ORANGE : MAGENTA, vivid ? 0.3 : 0.22)
        ctx.lineWidth = tr.weight + (vivid ? 9 : 7)
        strokeWindow(tr, dist - p.length, dist)

        ctx.strokeStyle = rgba(c, 0.95)
        ctx.lineWidth = tr.weight + 0.6
        strokeWindow(tr, dist - p.length * 0.55, dist)

        const head = pointAt(tr, Math.min(tr.total, Math.max(0, dist)))
        const glowR = vivid ? 16 : 12
        const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, glowR)
        g.addColorStop(0, rgba(WHITE, 0.95))
        g.addColorStop(0.35, rgba(c, 0.55))
        g.addColorStop(1, rgba(c, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(head.x, head.y, glowR, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const drawSparks = (dt: number) => {
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx * dt * 0.06
        s.y += s.vy * dt * 0.06
        s.life += dt
        if (s.life > s.max) {
          sparks.splice(i, 1)
          continue
        }
        const fade = 1 - s.life / s.max
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
        g.addColorStop(0, rgba(WHITE, 0.9 * fade))
        g.addColorStop(0.4, rgba(s.hot ? ORANGE : MAGENTA, 0.55 * fade))
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const drawWaves = (dt: number) => {
      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i]
        w.r += dt * (vivid ? 0.18 : 0.12)
        w.a *= 0.985
        if (w.r > w.max || w.a < 0.02) {
          waves.splice(i, 1)
          continue
        }
        ctx.beginPath()
        ctx.arc(cx, cy, w.r, 0, Math.PI * 2)
        ctx.strokeStyle = rgba(w.hot ? ORANGE : MAGENTA, w.a)
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const chamfer = (half: number, cut: number) => {
      ctx.beginPath()
      ctx.moveTo(cx - half + cut, cy - half)
      ctx.lineTo(cx + half - cut, cy - half)
      ctx.lineTo(cx + half, cy - half + cut)
      ctx.lineTo(cx + half, cy + half - cut)
      ctx.lineTo(cx + half - cut, cy + half)
      ctx.lineTo(cx - half + cut, cy + half)
      ctx.lineTo(cx - half, cy + half - cut)
      ctx.lineTo(cx - half, cy - half + cut)
      ctx.closePath()
    }

    const drawCore = (t: number) => {
      if (cinematic) {
        const half = chipW * 0.7
        const aura = ctx.createRadialGradient(cx, cy, 2, cx, cy, half * 2.4)
        aura.addColorStop(0, 'rgba(255, 255, 255, 0.16)')
        aura.addColorStop(0.2, 'rgba(255, 150, 60, 0.2)')
        aura.addColorStop(0.5, rgba(MAGENTA, 0.14))
        aura.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = aura
        ctx.beginPath()
        ctx.arc(cx, cy, half * 2.4, 0, Math.PI * 2)
        ctx.fill()

        // Faint binary field inside the brain zone
        ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
        ctx.textAlign = 'center'
        for (let i = 0; i < 28; i++) {
          const a = (i / 28) * Math.PI * 2 + t * 0.0002
          const r = half * (0.25 + (i % 5) * 0.12)
          const x = cx + Math.cos(a) * r
          const y = cy + Math.sin(a) * r * 0.85
          ctx.fillStyle = rgba(i % 3 === 0 ? ORANGE : MAGENTA, 0.14 + (i % 4) * 0.03)
          ctx.fillText(i % 2 === 0 ? '1' : '0', x, y)
        }
        return
      }

      const pulse = staticScene ? 1 : 1 + Math.sin(t * 0.0016) * 0.04
      const half = chipW * 0.58 * pulse

      const aura = ctx.createRadialGradient(cx, cy, 8, cx, cy, half * 3.1)
      aura.addColorStop(0, hexToRgba(accent, 0.5))
      aura.addColorStop(0.35, rgba(PURPLE, 0.24))
      aura.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = aura
      ctx.beginPath()
      ctx.arc(cx, cy, half * 3.1, 0, Math.PI * 2)
      ctx.fill()

      const inner = ctx.createRadialGradient(cx, cy, 4, cx, cy, half)
      inner.addColorStop(0, 'rgba(255, 255, 255, 0.2)')
      inner.addColorStop(0.45, 'rgba(147, 3, 159, 0.16)')
      inner.addColorStop(1, 'rgba(93, 5, 140, 0)')
      ctx.fillStyle = inner
      chamfer(half * 0.92, half * 0.16)
      ctx.fill()

      ;[1, 1.14, 1.3].forEach((s, i) => {
        chamfer(half * s, half * s * 0.16)
        ctx.strokeStyle = i === 0 ? rgba(WHITE, 0.55) : rgba(MAGENTA, 0.28 - i * 0.05)
        ctx.lineWidth = i === 0 ? 2.2 : 1.2
        ctx.stroke()
      })

      ctx.setLineDash([5, 9])
      ctx.strokeStyle = rgba(ORANGE, 0.38)
      chamfer(half * 1.42, half * 0.22)
      ctx.stroke()
      ctx.setLineDash([])

      if (!staticScene) {
        const spin = t * 0.00055
        ;[
          { r: half * 1.75, dash: [3, 14], color: ORANGE, a: 0.32 },
          { r: half * 2.15, dash: [8, 18], color: MAGENTA, a: 0.22 },
          { r: half * 2.55, dash: [2, 22], color: WHITE, a: 0.12 },
        ].forEach((ring, i) => {
          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(spin * (i % 2 === 0 ? 1 : -1) + i)
          ctx.beginPath()
          ctx.arc(0, 0, ring.r, 0, Math.PI * 2)
          ctx.setLineDash(ring.dash)
          ctx.strokeStyle = rgba(ring.color, ring.a)
          ctx.lineWidth = 1.4
          ctx.stroke()
          ctx.setLineDash([])
          ctx.restore()
        })
      }
    }

    const spawnDataBit = () => {
      // Prefer horizontal streams leaving the brain (like the AI head reference)
      const side = Math.random() > 0.42 ? 1 : -1
      const speed = (1.4 + Math.random() * 2.8) * side
      const lift = (Math.random() - 0.5) * 0.55
      const count = 5 + ((Math.random() * 7) | 0)
      dataBits.push({
        x: cx + side * chipW * (0.08 + Math.random() * 0.12),
        y: cy + (Math.random() - 0.5) * chipW * 0.55,
        vx: speed,
        vy: lift,
        life: 0,
        max: 1100 + Math.random() * 1400,
        hot: Math.random() > 0.35,
        bits: Array.from({ length: count }, () => randLabel()),
        size: 12 + Math.random() * 10,
        trail: 18 + Math.random() * 28,
      })
      if (dataBits.length > 90) dataBits.splice(0, dataBits.length - 90)
    }

    const drawDataBits = (dt: number) => {
      if (!cinematic) return
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (let i = dataBits.length - 1; i >= 0; i--) {
        const d = dataBits[i]
        d.x += d.vx * dt * 0.065
        d.y += d.vy * dt * 0.065
        d.life += dt
        if (d.life > d.max || d.x < -80 || d.x > width + 80) {
          dataBits.splice(i, 1)
          continue
        }

        const fade = Math.min(1, d.life / 180) * (1 - d.life / d.max)
        const c = d.hot ? ORANGE : MAGENTA
        const dir = d.vx >= 0 ? 1 : -1

        // Motion blur streak
        const streak = ctx.createLinearGradient(d.x - dir * d.trail * 2.2, d.y, d.x + dir * 8, d.y)
        streak.addColorStop(0, rgba(c, 0))
        streak.addColorStop(0.55, rgba(c, 0.18 * fade))
        streak.addColorStop(1, rgba(WHITE, 0.55 * fade))
        ctx.strokeStyle = streak
        ctx.lineWidth = Math.max(1.5, d.size * 0.18)
        ctx.beginPath()
        ctx.moveTo(d.x - dir * d.trail * 2.2, d.y)
        ctx.lineTo(d.x + dir * 4, d.y)
        ctx.stroke()

        // Binary trail
        ctx.font = `${Math.round(d.size)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
        d.bits.forEach((bit, bi) => {
          const bx = d.x - dir * bi * (d.size * 0.72)
          const alpha = fade * (1 - bi / (d.bits.length + 1))
          ctx.fillStyle = rgba(bi === 0 ? WHITE : c, alpha * (bi === 0 ? 0.95 : 0.7))
          ctx.shadowColor = rgba(c, 0.55 * alpha)
          ctx.shadowBlur = bi === 0 ? 12 : 4
          ctx.fillText(bit, bx, d.y)
        })
        ctx.shadowBlur = 0
      }
    }

    const paint = (now = performance.now(), dt = 16) => {
      ctx.clearRect(0, 0, width, height)
      drawBackground(now, dt)
      if (cinematic) drawCore(now)
      drawTraces(now)
      drawPads(now)
      if (!staticScene) {
        drawPulses(dt)
        if (!cinematic) drawWaves(dt)
        drawSparks(dt)
        drawDataBits(dt)
      }
      if (!cinematic) drawCore(now)
    }

    let last = performance.now()
    const loop = (now: number) => {
      if (!running) return
      if (staticScene) {
        paint(0, 0)
        return
      }
      const dt = Math.min(40, now - last)
      last = now

      if (now - lastSpark > (cinematic ? 60 : 90)) {
        lastSpark = now
        const ang = Math.random() * Math.PI * 2
        const rad = cinematic ? chipW * (0.1 + Math.random() * 0.45) : chipW * (0.7 + Math.random() * 1.8)
        spawnSpark(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad, Math.random() > 0.4)
      }
      if (cinematic && now - lastData > 28) {
        lastData = now
        spawnDataBit()
        if (Math.random() > 0.35) spawnDataBit()
        if (Math.random() > 0.7) spawnDataBit()
      }
      if (!cinematic && now - lastWave > 2200) {
        lastWave = now
        waves.push({
          r: chipW * 0.5,
          max: Math.max(width, height) * 0.55,
          a: 0.28,
          hot: Math.random() > 0.45,
        })
      }

      paint(now, dt)
      frame = requestAnimationFrame(loop)
    }

    const onResize = () => {
      resize()
      if (staticScene) paint(0, 0)
    }

    resize()
    window.addEventListener('resize', onResize)
    frame = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
    }
  }, [mode, accent, focus?.x, focus?.y, focus?.w, focus?.h])

  return <canvas ref={ref} className="city-canvas" />
}

function hexToRgba(hex: string, a: number) {
  const clean = hex.replace('#', '')
  const n = parseInt(clean, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${a})`
}
