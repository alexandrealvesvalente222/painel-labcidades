import { useEffect, useRef } from 'react'
import { viewportSize } from './uiScale'

interface Drop {
  x: number
  y: number
  speed: number
  size: number
  glyphs: string[]
  delay: number
  tone: 'teal' | 'tealSoft' | 'white'
}

function toneColor(tone: Drop['tone'], a: number) {
  if (tone === 'white') return `rgba(255, 255, 255, ${a})`
  if (tone === 'tealSoft') return `rgba(50, 188, 174, ${a * 0.75})`
  return `rgba(50, 188, 174, ${a})`
}

function makeDrop(width: number, height: number, fromTop = false): Drop {
  const len = 8 + Math.floor(Math.random() * 14)
  const roll = Math.random()
  const tone: Drop['tone'] = roll > 0.82 ? 'white' : roll > 0.45 ? 'tealSoft' : 'teal'
  return {
    x: Math.random() * width,
    y: fromTop ? -Math.random() * height * 0.4 : Math.random() * height,
    speed: 42 + Math.random() * 110,
    size: 11 + Math.random() * 10,
    glyphs: Array.from({ length: len }, () => (Math.random() > 0.5 ? '1' : '0')),
    delay: Math.random() * 1.2,
    tone,
  }
}

/** Chuva de bits caindo de cima para baixo na splash. */
export default function SplashDataRain() {
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
    let last = performance.now()
    let drops: Drop[] = []

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
      const count = Math.max(28, Math.floor(width / 38))
      drops = Array.from({ length: count }, () => makeDrop(width, height))
    }

    const paint = (now: number, dt: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const logoBandTop = height * 0.18
      const logoBandBottom = height * 0.58

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]
        if (now / 1000 < drop.delay) continue

        drop.y += drop.speed * dt
        const trail = drop.size * 1.35
        if (drop.y - drop.glyphs.length * trail > height + 40) {
          drops[i] = makeDrop(width, height, true)
          continue
        }

        ctx.font = `600 ${drop.size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`

        for (let g = 0; g < drop.glyphs.length; g++) {
          const gy = drop.y - g * trail
          if (gy < -20 || gy > height + 20) continue

          // Mais discreto na faixa do logo para o wordmark continuar legível
          const inLogoBand = gy > logoBandTop && gy < logoBandBottom
          const head = g === 0
          const fade = head ? 0.72 : Math.max(0.08, 0.42 - g * 0.028)
          const a = fade * (inLogoBand ? 0.28 : 0.9)

          if (head && Math.random() > 0.985) {
            drop.glyphs[g] = Math.random() > 0.5 ? '1' : '0'
          }

          ctx.fillStyle = toneColor(drop.tone, a)
          if (head) {
            ctx.shadowColor = toneColor(drop.tone, 0.55)
            ctx.shadowBlur = 10
          } else {
            ctx.shadowBlur = 0
          }
          ctx.fillText(drop.glyphs[g], drop.x, gy)
        }
        ctx.shadowBlur = 0
      }
    }

    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      paint(now, dt)
      frame = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    window.visualViewport?.addEventListener('resize', resize)
    frame = requestAnimationFrame(loop)

    return () => {
      running = false
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.visualViewport?.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="csc-splash-rain" aria-hidden="true" />
}
