import { useCallback, useEffect, useRef, useState } from 'react'
import { getUiScale, viewportSize } from './uiScale'

export function useUiScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const { width, height } = viewportSize()
      setScale(getUiScale(width, height))
    }
    update()
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    window.visualViewport?.addEventListener('scroll', update)
    return () => {
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('scroll', update)
    }
  }, [])

  return scale
}

export function useCountUp(target: number, active: boolean, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) {
      setValue(0)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Number((target * eased).toFixed(decimals)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration, decimals])

  return value
}

export function useIdle(ms: number, onIdle: () => void, enabled: boolean) {
  const saved = useRef(onIdle)
  saved.current = onIdle

  useEffect(() => {
    if (!enabled) return
    let timer = window.setTimeout(() => saved.current(), ms)
    const bump = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => saved.current(), ms)
    }
    const events = ['pointerdown', 'pointermove', 'touchstart', 'keydown'] as const
    events.forEach((event) => window.addEventListener(event, bump, { passive: true }))
    return () => {
      window.clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, bump))
    }
  }, [enabled, ms])
}

export function useSwipe(onSwipe: (dir: 'left' | 'right') => void) {
  const origin = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    origin.current = { x: event.clientX, y: event.clientY }
  }, [])

  const onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (!origin.current) return
      const dx = event.clientX - origin.current.x
      const dy = event.clientY - origin.current.y
      origin.current = null
      if (Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.2) return
      onSwipe(dx < 0 ? 'left' : 'right')
    },
    [onSwipe],
  )

  return { onPointerDown, onPointerUp }
}
