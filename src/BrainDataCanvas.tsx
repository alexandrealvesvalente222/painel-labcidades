import { useEffect, useRef } from 'react'
import { BRAIN_ASPECT, BRAIN_EDGES, BRAIN_LAYOUT, BRAIN_NODES } from './brainGraph'
import { BINARY_LAYOUT, BLUR_LAYOUT, OUTPUT_LAYOUT } from './splashEffectLayout'
import { getUiScale, viewportSize } from './uiScale'
import { getWordmarkMaskBounds } from './wordmarkLayout'

interface OutputBit {
  x: number
  y: number
  bit: string
  size: number
  speed: number
  tone: OutputTone
}

type OutputTone = 'white' | 'orange' | 'purple'

const MAGENTA = { r: 170, g: 70, b: 220 }
const ORANGE = { r: 255, g: 131, b: 0 }
const NEON_PURPLE = { r: 200, g: 80, b: 255 }
const WHITE = { r: 255, g: 255, b: 255 }

/** Linhas horizontais de saída — y é fração da área útil (0–1). */
const OUTPUT_LANES = [0.1, 0.24, 0.38, 0.52, 0.66, 0.8, 0.9]

function rgba(c: { r: number; g: number; b: number }, a: number) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`
}

function toneColor(tone: OutputTone) {
  if (tone === 'white') return WHITE
  if (tone === 'orange') return ORANGE
  return NEON_PURPLE
}

function pickTone(seed: number): OutputTone {
  const m = seed % 9
  if (m === 0) return 'white'
  if (m <= 3) return 'orange'
  return 'purple'
}

export default function BrainDataCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let running = true
    let frame = 0
    let brain = { x: 0, y: 0, w: 0, h: 0 }
    let binaryOffset = 0
    let outputOffset = 0
    let uiScale = 1
    let binaryTop = 0
    let binaryBottom = 0
    let outputTop = 0
    let outputBottom = 0
    let outputStartX = 0
    let outputEndX = 0
    let outputBits: OutputBit[] = []
    let blurCanvas: HTMLCanvasElement | null = null

    const effectZone = () => {
      const mask = getWordmarkMaskBounds(width, height)
      const top = height * OUTPUT_LAYOUT.top
      const bottom = mask.top - height * OUTPUT_LAYOUT.bottomReserve
      return { top, bottom, spanY: Math.max(bottom - top, 1), mask }
    }

    const updateBounds = () => {
      const mask = getWordmarkMaskBounds(width, height)
      binaryTop = height * BINARY_LAYOUT.top
      binaryBottom = mask.top - height * BINARY_LAYOUT.bottomReserve
      const zone = effectZone()
      outputTop = zone.top
      outputBottom = zone.bottom
      outputStartX = brain.x + brain.w * 0.88
      outputEndX = width - width * OUTPUT_LAYOUT.rightPad
    }

    const makeOutputBit = (): OutputBit => ({
      x: outputStartX - Math.random() * 60,
      y: outputTop + Math.random() * (outputBottom - outputTop),
      bit: Math.random() > 0.5 ? '1' : '0',
      size: 13 + Math.random() * 16,
      speed: 0.2 + Math.random() * 0.32,
      tone: pickTone(Math.floor(Math.random() * 9)),
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const parent = canvas.parentElement
      const vp = viewportSize()
      width = parent?.clientWidth || vp.width
      height = parent?.clientHeight || vp.height
      uiScale = getUiScale(width, height)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      let bh = height * BRAIN_LAYOUT.heightRatio
      let bw = (bh * BRAIN_LAYOUT.stretchX) / (BRAIN_ASPECT * BRAIN_LAYOUT.stretchY)
      const maxBw = width * 0.84
      const maxBh = height * 0.64
      if (bw > maxBw) {
        bw = maxBw
        bh = (bw * BRAIN_ASPECT * BRAIN_LAYOUT.stretchY) / BRAIN_LAYOUT.stretchX
      }
      if (bh > maxBh) {
        bh = maxBh
        bw = (bh * BRAIN_LAYOUT.stretchX) / (BRAIN_ASPECT * BRAIN_LAYOUT.stretchY)
      }
      brain = {
        w: bw,
        h: bh,
        x: width * BRAIN_LAYOUT.left,
        y: height * BRAIN_LAYOUT.centerY - bh / 2,
      }
      updateBounds()
      outputBits = Array.from({ length: 22 }, () => {
        const b = makeOutputBit()
        b.x = outputStartX + Math.random() * (outputEndX - outputStartX) * 0.5
        return b
      })
    }

    const drawBg = (t: number) => {
      const g = ctx.createLinearGradient(0, 0, width, 0)
      g.addColorStop(0, '#14001f')
      g.addColorStop(0.4, '#210035')
      g.addColorStop(1, '#100018')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, width, height)

      const breath = 0.22 + Math.sin(t * 0.0011) * 0.06
      const core = ctx.createRadialGradient(
        brain.x + brain.w * 0.42,
        brain.y + brain.h * 0.5,
        10,
        brain.x + brain.w * 0.55,
        brain.y + brain.h * 0.5,
        Math.max(brain.w * 0.9, brain.h * 1.15),
      )
      core.addColorStop(0, `rgba(150, 40, 220, ${breath})`)
      core.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = core
      ctx.fillRect(0, 0, width, height)
    }

    const brainNodeAt = (i: number) => {
      const n = BRAIN_NODES[i]
      const scale = Math.min(brain.w, brain.h / BRAIN_ASPECT) * BRAIN_LAYOUT.nodeScale
      return {
        x: brain.x + n.x * brain.w,
        y: brain.y + n.y * brain.h,
        r: n.r * scale,
      }
    }

    const distToSegment = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
      const dx = bx - ax
      const dy = by - ay
      const len2 = dx * dx + dy * dy || 1
      let t = ((px - ax) * dx + (py - ay) * dy) / len2
      t = Math.max(0, Math.min(1, t))
      return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
    }

    /** Silhueta do cérebro (nós + conexões) — binários não passam por dentro. */
    const insideBrainSilhouette = (x: number, y: number, pad: number) => {
      for (let i = 0; i < BRAIN_NODES.length; i++) {
        const p = brainNodeAt(i)
        if (Math.hypot(x - p.x, y - p.y) < p.r * 1.1 + pad) return true
      }
      for (const [i, j] of BRAIN_EDGES) {
        const a = brainNodeAt(i)
        const b = brainNodeAt(j)
        const tube = Math.min(a.r, b.r) * BRAIN_LAYOUT.lineScale * 0.62 + pad
        if (distToSegment(x, y, a.x, a.y, b.x, b.y) < tube) return true
      }
      return false
    }

    const blurMetrics = () => {
      const cx = width * BLUR_LAYOUT.centerX
      const cy = height * BLUR_LAYOUT.centerY
      const radius = Math.min(width, height) * BLUR_LAYOUT.radius
      const blurPx = Math.round(BLUR_LAYOUT.blurPx * uiScale)
      const pad = blurPx + 12
      return { cx, cy, radius, blurPx, pad }
    }

    const drawRoundBlur = () => {
      const { cx, cy, radius, blurPx, pad } = blurMetrics()
      const x = cx - radius - pad
      const y = cy - radius - pad
      const w = (radius + pad) * 2
      const h = (radius + pad) * 2
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      if (!blurCanvas) blurCanvas = document.createElement('canvas')
      if (blurCanvas.width !== Math.ceil(w * dpr) || blurCanvas.height !== Math.ceil(h * dpr)) {
        blurCanvas.width = Math.ceil(w * dpr)
        blurCanvas.height = Math.ceil(h * dpr)
      }

      const bctx = blurCanvas.getContext('2d')
      if (!bctx) return

      bctx.setTransform(1, 0, 0, 1, 0, 0)
      bctx.clearRect(0, 0, blurCanvas.width, blurCanvas.height)
      bctx.drawImage(canvas, x * dpr, y * dpr, w * dpr, h * dpr, 0, 0, blurCanvas.width, blurCanvas.height)

      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, Math.PI * 2)
      ctx.clip()

      ctx.filter = `blur(${blurPx}px)`
      ctx.drawImage(blurCanvas, x, y, w, h)
      ctx.filter = 'none'

      if (BLUR_LAYOUT.strength > 0) {
        const veil = ctx.createRadialGradient(cx, cy, radius * 0.15, cx, cy, radius)
        veil.addColorStop(0, `rgba(22, 0, 34, ${BLUR_LAYOUT.strength * 0.55})`)
        veil.addColorStop(0.72, `rgba(18, 0, 28, ${BLUR_LAYOUT.strength * 0.28})`)
        veil.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = veil
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()
    }

    const drawBinaryField = (dt: number) => {
      binaryOffset += dt * 0.11
      const rowH = Math.max(12, 22 * uiScale)
      const charW = Math.max(11, 18 * uiScale)
      const binaryFont = Math.max(10, 15 * uiScale)
      const startX = -width * BINARY_LAYOUT.leftExtend - charW * 2
      const stopX = brain.x + brain.w * BINARY_LAYOUT.mergeDepth
      const top = binaryTop
      const bottom = binaryBottom
      const rows = Math.max(12, Math.ceil((bottom - top) / rowH) + 1)
      const span = Math.max(stopX - startX, 120)
      const hitPad = charW * 0.55

      ctx.font = `${binaryFont}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let r = 0; r < rows; r++) {
        const y = top + r * rowH
        if (y < -20 || y > bottom + 20) continue
        const speed = 0.45 + (r % 6) * 0.14
        const drift = binaryOffset * speed + r * 17
        const cols = Math.ceil(span / charW) + 3

        for (let c = -1; c < cols; c++) {
          const x = startX + ((c * charW + drift) % span)
          if (x < -16 || x >= stopX) continue
          if (insideBrainSilhouette(x, y, hitPad)) continue

          let fade = Math.min(1, (x + 24) / 48)
          const nearBrain = insideBrainSilhouette(x + charW * 0.6, y, hitPad * 1.8)
          if (nearBrain) fade *= 0.55

          const head = (r + c) % 12 === 0
          const a = (head ? 0.5 : 0.17 + (r % 4) * 0.04) * fade
          if (a <= 0) continue

          ctx.fillStyle = rgba(head ? WHITE : MAGENTA, a)
          ctx.fillText((r * 5 + c * 7 + ((drift / charW) | 0)) % 2 ? '1' : '0', x, y)
        }
      }
    }

    const drawBitWithTrail = (
      x: number,
      y: number,
      bit: string,
      fontSize: number,
      tone: OutputTone,
      alpha: number,
    ) => {
      const size = fontSize * uiScale
      const color = toneColor(tone)
      const trailLen = size * (tone === 'white' ? 4.5 : tone === 'orange' ? 3.4 : 3)

      const grad = ctx.createLinearGradient(x - trailLen, y, x, y)
      grad.addColorStop(0, rgba(color, 0))
      grad.addColorStop(0.45, rgba(NEON_PURPLE, alpha * 0.14))
      grad.addColorStop(0.75, rgba(tone === 'orange' ? ORANGE : NEON_PURPLE, alpha * 0.28))
      grad.addColorStop(1, rgba(color, alpha * (tone === 'white' ? 0.88 : 0.68)))

      ctx.strokeStyle = grad
      ctx.lineWidth = Math.max(1.2, size * 0.12)
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(x - trailLen, y)
      ctx.lineTo(x - size * 0.2, y)
      ctx.stroke()

      ctx.font = `${tone === 'white' ? 700 : 600} ${Math.round(size)}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`
      ctx.shadowColor = rgba(color, alpha * 0.9)
      ctx.shadowBlur = tone === 'white' ? 12 : tone === 'orange' ? 10 : 8
      ctx.fillStyle = rgba(color, alpha * (tone === 'white' ? 0.98 : 0.85))
      ctx.fillText(bit, x, y)
      ctx.shadowBlur = 0
    }

    const drawOutputStream = (dt: number) => {
      outputOffset += dt * 0.13
      const span = Math.max(outputEndX - outputStartX, 1)
      const rowH = Math.max(13, 24 * uiScale)
      const charW = Math.max(10, 17 * uiScale)
      const fontBase = Math.max(11, 17 * uiScale)

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let li = 0; li < OUTPUT_LANES.length; li++) {
        const laneY = outputTop + OUTPUT_LANES[li] * (outputBottom - outputTop)
        const speed = 0.32 + (li % 5) * 0.11
        const drift = outputOffset * speed + li * 19
        const cols = Math.ceil(span / charW) + 2

        for (let c = -1; c < cols; c++) {
          const x = outputStartX + ((c * charW + drift) % span)
          if (x < outputStartX - 8 || x > outputEndX) continue

          const u = (x - outputStartX) / span
          const density = 1 - u * 0.5
          const pick = (li * 7 + c * 11 + ((drift / charW) | 0)) % 12
          if (pick > density * 5) continue

          const tone = pickTone(li * 3 + c * 5 + pick)
          const sizeVar = 0.88 + (li % 4) * 0.1 + (pick % 3) * 0.09
          const fontSize = fontBase * sizeVar * (1 - u * 0.15)
          const alpha = (0.4 + density * 0.5) * Math.min(1, (x - outputStartX + 30) / 50)
          if (alpha <= 0) continue

          drawBitWithTrail(
            x,
            laneY + ((li % 3) - 1) * 2,
            (li * 5 + c * 7 + pick) % 2 ? '1' : '0',
            fontSize,
            tone,
            alpha,
          )
        }
      }

      outputBits.forEach((b, i) => {
        b.x += b.speed * dt
        if (b.x > outputEndX + 24) {
          outputBits[i] = makeOutputBit()
          return
        }

        const u = (b.x - outputStartX) / span
        const fade = Math.min(1, (b.x - outputStartX + 28) / 55) * (1 - u * 0.25)
        if (fade <= 0) return
        drawBitWithTrail(b.x, b.y, b.bit, b.size, b.tone, fade)
      })
    }

    const nodePos = (i: number) => {
      const n = BRAIN_NODES[i]
      return {
        x: brain.x + n.x * brain.w,
        y: brain.y + n.y * brain.h,
        r: n.r * Math.min(brain.w, brain.h / BRAIN_ASPECT) * BRAIN_LAYOUT.nodeScale,
        hot: n.c === 'o',
      }
    }

    const drawBrain = () => {
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.shadowColor = 'rgba(147, 3, 159, 0.42)'
      ctx.shadowBlur = 26

      for (const [i, j] of BRAIN_EDGES) {
        const a = nodePos(i)
        const b = nodePos(j)
        ctx.strokeStyle = '#7d0fa3'
        ctx.lineWidth = Math.min(a.r, b.r) * 0.5 * BRAIN_LAYOUT.lineScale
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      ctx.shadowBlur = 18
      BRAIN_NODES.forEach((_, i) => {
        const p = nodePos(i)
        ctx.shadowColor = p.hot ? 'rgba(255, 131, 0, 0.45)' : 'rgba(147, 3, 159, 0.4)'
        ctx.fillStyle = p.hot ? '#ff8300' : '#8e12b8'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.restore()
    }

    const drawWordmarkShield = () => {
      const mask = getWordmarkMaskBounds(width, height)
      const fadeH = mask.height * 0.45
      const y0 = mask.top - fadeH

      const g = ctx.createLinearGradient(0, y0, 0, height)
      g.addColorStop(0, 'rgba(20, 0, 31, 0)')
      g.addColorStop(0.5, 'rgba(20, 0, 31, 0.9)')
      g.addColorStop(1, '#100018')
      ctx.fillStyle = g
      ctx.fillRect(0, y0, width, height - y0)
    }

    const paint = (now: number, dt: number) => {
      const mask = getWordmarkMaskBounds(width, height)
      drawBg(now)
      drawBinaryField(dt)
      drawRoundBlur()
      drawBrain()

      ctx.save()
      ctx.beginPath()
      ctx.rect(0, 0, width, mask.top)
      ctx.clip()
      drawOutputStream(dt)
      ctx.restore()

      drawWordmarkShield()
    }

    let last = performance.now()
    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(40, now - last)
      last = now
      paint(now, dt)
      frame = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    window.visualViewport?.addEventListener('resize', resize)
    window.visualViewport?.addEventListener('scroll', resize)
    frame = requestAnimationFrame(loop)
    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('scroll', resize)
    }
  }, [])

  return <canvas ref={ref} className="city-canvas" aria-hidden="true" />
}
