import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

type Props = {
  images: string[]
  alt: string
}

/** Carrossel horizontal por toque/arraste no quadro cinza (Soluções 2.0). */
export function ExploreCarousel({ images, alt }: Props) {
  const slides = images.length ? images : []
  const [index, setIndex] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const start = useRef<{ x: number; y: number; index: number } | null>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIndex(0)
    setDragX(0)
    setDragging(false)
    start.current = null
  }, [slides.join('|')])

  const width = () => viewportRef.current?.clientWidth || 1

  const onPointerDown = useCallback((e: ReactPointerEvent) => {
    if (slides.length < 1) return
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    start.current = { x: e.clientX, y: e.clientY, index }
    setDragging(true)
    setDragX(0)
  }, [index, slides.length])

  const onPointerMove = useCallback((e: ReactPointerEvent) => {
    if (!start.current || !dragging) return
    e.stopPropagation()
    setDragX(e.clientX - start.current.x)
  }, [dragging])

  const endDrag = useCallback(
    (e: ReactPointerEvent) => {
      if (!start.current) return
      e.stopPropagation()
      const dx = e.clientX - start.current.x
      const w = width()
      const threshold = Math.min(80, w * 0.18)
      const total = slides.length
      let next = start.current.index
      if (total > 1) {
        if (dx <= -threshold) next = (next + 1) % total
        else if (dx >= threshold) next = (next - 1 + total) % total
      }
      setIndex(next)
      setDragX(0)
      setDragging(false)
      start.current = null
    },
    [slides.length],
  )

  if (!slides.length) {
    return <div className="csc-explore-carousel is-empty" aria-hidden="true" />
  }

  const offsetPct = (-index * 100) + (dragging ? (dragX / width()) * 100 : 0)

  return (
    <div
      ref={viewportRef}
      className={`csc-explore-carousel${dragging ? ' is-dragging' : ''}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="region"
      aria-roledescription="carrossel"
      aria-label={alt}
    >
      <div
        className="csc-explore-carousel__track"
        style={{
          transform: `translate3d(${offsetPct}%, 0, 0)`,
          transition: dragging ? 'none' : 'transform 0.28s ease',
        }}
      >
        {slides.map((src, i) => (
          <div key={src} className="csc-explore-carousel__slide">
            <img src={src} alt={i === index ? alt : ''} draggable={false} />
          </div>
        ))}
      </div>
      {slides.length > 1 ? (
        <div className="csc-explore-carousel__dots" aria-hidden="true">
          {slides.map((src, i) => (
            <span key={src} className={i === index ? 'is-active' : undefined} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
