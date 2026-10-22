import { useCallback, useState } from 'react'
import { SOLUTIONS, type SolutionId, type StageId, type ViewId } from './data'
import { useIdle, useOrientation, useUiScale } from './hooks'
import { Brinde, Cert, Contact, Explore, Hub, Pos, Quiz, Splash } from './screens'
import { Ripples } from './visuals'

export default function App() {
  const [view, setView] = useState<ViewId>('splash')
  const [solutionId, setSolutionId] = useState<SolutionId>('reurb')
  const [stage, setStage] = useState<StageId>('problema')
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const uiScale = useUiScale()
  const { orientation } = useOrientation()

  const goHome = useCallback(() => {
    setView('splash')
    setStage('problema')
  }, [])

  useIdle(90000, goHome, view !== 'splash')

  const solution = SOLUTIONS.find((item) => item.id === solutionId) ?? SOLUTIONS[0]

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
      data-orientation={orientation}
      style={{ '--ui-scale': uiScale } as React.CSSProperties}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => addRipple(e.clientX, e.clientY)}
    >
      {view === 'brinde' ? (
        <>
          <div className="vignette" />
          <div className="grain" />
          <div className="scan" />
        </>
      ) : null}

      {view === 'splash' && (
        <Splash
          onExplore={() => setView('hub')}
          onPos={() => setView('pos')}
          onCert={() => setView('cert')}
          onQuiz={() => setView('quiz')}
          onAdmin={() => {
            window.location.hash = '/admin'
          }}
        />
      )}
      {view === 'contact' && <Contact onHome={goHome} onBrinde={() => setView('brinde')} />}
      {view === 'brinde' && <Brinde onHome={goHome} onBack={() => setView('contact')} />}
      {view === 'pos' && <Pos onHome={goHome} />}
      {view === 'cert' && <Cert onHome={goHome} />}
      {view === 'quiz' && <Quiz onHome={goHome} />}
      {view === 'hub' && (
        <Hub
          onHome={goHome}
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
