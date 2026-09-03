import { useCallback, useState } from 'react'
import BrainDataCanvas from './BrainDataCanvas'
import CityCanvas, { type CanvasFocus } from './CityCanvas'
import { SOLUTIONS, type SolutionId, type StageId, type ViewId } from './data'
import { useIdle, useUiScale } from './hooks'
import { Contact, Explore, Hub, Pos, Splash } from './screens'
import { Ripples } from './visuals'

export default function App() {
  const [view, setView] = useState<ViewId>('splash')
  const [solutionId, setSolutionId] = useState<SolutionId>('reurb')
  const [stage, setStage] = useState<StageId>('problema')
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const [shift, setShift] = useState({ x: 0, y: 0 })
  const [logoFocus, setLogoFocus] = useState<CanvasFocus | null>(null)
  const uiScale = useUiScale()

  const goHome = useCallback(() => {
    setView('splash')
    setStage('problema')
  }, [])

  const onLogoFocus = useCallback((focus: CanvasFocus | null) => {
    setLogoFocus(focus)
  }, [])

  useIdle(90000, goHome, view !== 'splash')

  const solution = SOLUTIONS.find((item) => item.id === solutionId) ?? SOLUTIONS[0]
  const cinematic = view === 'splash' || view === 'contact'
  const staticBg = view === 'hub' || view === 'pos' || view === 'explore'
  const focusY = logoFocus ? `${(logoFocus.y / Math.max(window.innerHeight, 1)) * 100}%` : '38%'

  const addRipple = (x: number, y: number) => {
    const id = Date.now() + Math.random()
    setRipples((list) => [...list.slice(-8), { id, x, y }])
    window.setTimeout(() => {
      setRipples((list) => list.filter((item) => item.id !== id))
    }, 700)
  }

  return (
    <div
      className="app"
      data-view={view}
      style={{ '--focus-y': focusY, '--ui-scale': uiScale } as React.CSSProperties}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => addRipple(e.clientX, e.clientY)}
      onPointerMove={(e) => {
        setShift({
          x: (e.clientX / window.innerWidth - 0.5) * 18,
          y: (e.clientY / window.innerHeight - 0.5) * 12,
        })
      }}
    >
      <div
        className={`city-shift${cinematic || staticBg ? ' city-shift--locked' : ''}`}
        style={{
          transform: cinematic || staticBg ? 'none' : `translate(${shift.x}px, ${shift.y}px) scale(1.03)`,
        }}
      >
        {view === 'splash' ? (
          <BrainDataCanvas />
        ) : (
          <CityCanvas
            mode={view}
            accent={view === 'explore' ? solution.accent : '#5d058c'}
            focus={view === 'contact' ? logoFocus : null}
          />
        )}
      </div>
      <div className="vignette" />
      <div className="grain" />
      <div className="scan" />

      {view === 'splash' && (
        <Splash
          onExplore={() => {
            document.documentElement.requestFullscreen?.().catch(() => undefined)
            setView('hub')
          }}
          onPos={() => setView('pos')}
          onContact={() => setView('contact')}
        />
      )}
      {view === 'contact' && <Contact onHome={goHome} onFocus={onLogoFocus} />}
      {view === 'pos' && <Pos onHome={goHome} />}
      {view === 'hub' && (
        <Hub
          onHome={goHome}
          onContact={() => setView('contact')}
          onOpen={(id) => {
            setSolutionId(id)
            setStage('problema')
            setView('explore')
          }}
        />
      )}
      {view === 'explore' && (
        <Explore
          solution={solution}
          stage={stage}
          onStage={setStage}
          onHome={goHome}
          onHub={() => setView('hub')}
          onSolution={(id) => {
            setSolutionId(id)
            setStage('problema')
          }}
        />
      )}
      <Ripples pulses={ripples} />
    </div>
  )
}
