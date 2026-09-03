import { CITIES } from './data'
import { useCountUp } from './hooks'
import { useMemo, useRef, useState } from 'react'
import { LogoMark } from './LogoMark'

export function Logo({ height }: { height?: number }) {
  return (
    <LogoMark
      className="brand-logo"
      title="LabCidades — projetos inteligentes"
      style={height ? { height, width: 'auto' } : undefined}
    />
  )
}

export { LogoMark }

export function HomeButton({ onPress }: { onPress: () => void }) {
  return (
    <button className="home-btn" onPointerUp={onPress}>
      <span>←</span> Início
    </button>
  )
}

export function Ripples({ pulses }: { pulses: { id: number; x: number; y: number }[] }) {
  return (
    <div className="ripple-layer">
      {pulses.map((p) => (
        <span key={p.id} className="ripple" style={{ left: p.x, top: p.y }} />
      ))}
    </div>
  )
}

export function MetricValue({
  value,
  active,
  prefix = '',
  suffix = '',
  decimals = 0,
}: {
  value: number
  active: boolean
  prefix?: string
  suffix?: string
  decimals?: number
}) {
  const n = useCountUp(value, active, 1300, decimals)
  return (
    <>
      {prefix}
      {decimals ? n.toFixed(decimals) : Math.round(n)}
      {suffix}
    </>
  )
}

export function DengueMap({ accent }: { accent: string }) {
  const [selected, setSelected] = useState(CITIES[1])
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  return (
    <svg
      className="map-svg"
      viewBox="0 0 1000 720"
      onPointerDown={(e) => {
        e.stopPropagation()
        drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y }
        ;(e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => {
        if (!drag.current) return
        setPan({
          x: drag.current.px + (e.clientX - drag.current.x),
          y: drag.current.py + (e.clientY - drag.current.y),
        })
      }}
      onPointerUp={() => {
        drag.current = null
      }}
    >
      <defs>
        <radialGradient id="land" cx="60%" cy="45%">
          <stop offset="0%" stopColor="#5d058c" />
          <stop offset="100%" stopColor="#100013" />
        </radialGradient>
      </defs>
      <g transform={`translate(${pan.x * 0.4} ${pan.y * 0.4})`}>
        <path
          d="M620 40 C700 70 780 90 820 160 C860 240 840 320 800 390 C770 450 790 520 740 590 C680 670 560 700 470 680 C360 652 280 600 240 520 C190 420 220 300 280 210 C350 100 510 20 620 40 Z"
          fill="url(#land)"
          stroke={accent}
          strokeOpacity="0.35"
        />
        {CITIES.map((city) => {
          const cx = 180 + city.x * 700
          const cy = 40 + city.y * 620
          const hot = city.value > 60
          const on = selected.id === city.id
          return (
            <g key={city.id} onPointerUp={() => setSelected(city)} style={{ cursor: 'pointer' }}>
              {hot && (
                <circle cx={cx} cy={cy} r="18" fill={accent} opacity="0.12">
                  <animate attributeName="r" values="14;26;14" dur="2.4s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={cx} cy={cy} r={on ? 8 : 5} fill={hot ? accent : '#93039f'} />
              <text className="city-label" x={cx + 10} y={cy - 8}>
                {city.name}
              </text>
            </g>
          )
        })}
      </g>
      <rect x="24" y="24" width="260" height="86" rx="16" fill="rgba(4,12,22,.7)" stroke="rgba(255,255,255,.08)" />
      <text x="44" y="54" fill="#fff" fontSize="16" fontFamily="Uni Sans, Montserrat">
        {selected.name}
      </text>
      <text x="44" y="82" fill={accent} fontSize="22" fontFamily="Uni Sans, Montserrat" fontWeight="700">
        Índice {selected.value}
      </text>
      <text x="24" y="700" fill="rgba(244,247,251,.4)" fontSize="13" fontFamily="Uni Sans, Montserrat">
        Arraste o mapa · toque um município
      </text>
    </svg>
  )
}

export function TrendChart({ accent, stage }: { accent: string; stage: string }) {
  const interest = [22, 28, 31, 48, 62, 80, 96, 88, 70, 54, 41, 33]
  const cases = [18, 20, 24, 29, 40, 55, 72, 90, 84, 68, 50, 38]
  const path = (values: number[]) =>
    values
      .map((v, i) => `${i === 0 ? 'M' : 'L'} ${80 + i * 72} ${340 - v * 2.4}`)
      .join(' ')

  return (
    <svg className="chart-svg" viewBox="0 0 1000 400">
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="70" x2="960" y1={80 + i * 60} y2={80 + i * 60} stroke="rgba(255,255,255,.06)" />
      ))}
      <path d={path(interest)} fill="none" stroke={accent} strokeWidth="4">
        <animate attributeName="stroke-dasharray" from="0 1200" to="1200 0" dur="1.4s" fill="freeze" />
      </path>
      <path d={path(cases)} fill="none" stroke="#93039f" strokeWidth="3" strokeDasharray="7 7" opacity="0.8" />
      <text x="80" y="36" fill="#fff" fontSize="18" fontFamily="Uni Sans, Montserrat">
        {stage === 'problema' ? 'Notificações atrasam o sinal' : 'Interesse antecipa o surto'}
      </text>
      <circle cx="80" cy="370" r="5" fill={accent} />
      <text x="92" y="375" fill="#cde" fontSize="14" fontFamily="Uni Sans, Montserrat">
        Interesse
      </text>
      <circle cx="200" cy="370" r="5" fill="#93039f" />
      <text x="212" y="375" fill="#cde" fontSize="14" fontFamily="Uni Sans, Montserrat">
        Notificações (+15 dias)
      </text>
    </svg>
  )
}

export function ParcelGrid({ accent, stage }: { accent: string; stage: string }) {
  const cells = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        i,
        hidden: [3, 8, 14, 21, 27, 33, 41, 46, 52, 61, 67, 74].includes(i),
        debt: [5, 11, 18, 29, 38, 44, 58, 70].includes(i),
      })),
    [],
  )

  return (
    <svg className="grid-svg" viewBox="0 0 1000 640">
      <text x="24" y="36" fill="#fff" fontSize="18" fontFamily="Uni Sans, Montserrat">
        {stage === 'problema' ? 'Cadastro incompleto' : stage === 'solucao' ? 'Território fiscal revelado' : 'Base justa e visível'}
      </text>
      {cells.map((cell) => {
        const col = cell.i % 10
        const row = Math.floor(cell.i / 10)
        const x = 40 + col * 94
        const y = 70 + row * 68
        const after = stage !== 'problema'
        const fill = cell.hidden && !after ? 'rgba(255,255,255,.04)' : cell.debt && stage !== 'impacto' ? 'rgba(255, 170, 80, .28)' : `${accent}33`
        const stroke = cell.hidden && !after ? 'rgba(255,255,255,.08)' : accent
        return <rect key={cell.i} x={x} y={y} width="84" height="58" rx="8" fill={fill} stroke={stroke} strokeOpacity="0.55" />
      })}
    </svg>
  )
}

export function TerritoryFlow({ accent, stage }: { accent: string; stage: string }) {
  const [selected, setSelected] = useState(CITIES[9])
  const tools = ['Dashboard', 'Mapa SIG', 'Estudos', 'Capacitações']
  const activeTools = stage === 'problema' ? 0 : stage === 'solucao' ? 3 : 4

  return (
    <svg className="flow-svg" viewBox="0 0 1000 640">
      <text x="24" y="36" fill="#fff" fontSize="18" fontFamily="Uni Sans, Montserrat">
        {stage === 'problema'
          ? 'Espírito Santo sem diagnóstico visível'
          : stage === 'solucao'
            ? 'Mapa de Maturidade · SIG'
            : 'Acompanhamento contínuo da REURB'}
      </text>
      <path
        d="M620 50 C700 80 780 100 820 170 C860 250 840 330 800 400 C770 460 790 510 740 560 C680 610 560 620 470 600 C360 572 280 530 240 450 C190 350 220 250 280 170 C350 80 510 30 620 50 Z"
        fill="#100013"
        stroke={accent}
        strokeOpacity={stage === 'problema' ? 0.2 : 0.55}
      />
      {CITIES.map((city) => {
        const cx = 200 + city.x * 620
        const cy = 40 + city.y * 480
        const level = city.value
        const color = stage === 'problema' ? 'rgba(255,255,255,.18)' : level > 60 ? accent : level > 35 ? '#ff8300' : '#5d058c'
        const on = selected.id === city.id
        return (
          <g key={city.id} onPointerUp={() => setSelected(city)} style={{ cursor: 'pointer' }}>
            <circle cx={cx} cy={cy} r={on ? 9 : 5} fill={color} />
            {stage !== 'problema' && on && (
              <text x={cx + 8} y={cy - 8} fill="#fff" fontSize="11" fontFamily="Uni Sans, Montserrat">
                {city.name}
              </text>
            )}
          </g>
        )
      })}
      {tools.map((label, i) => {
        const on = i < activeTools
        return (
          <g key={label}>
            <rect
              x={40 + i * 240}
              y="560"
              width="220"
              height="56"
              rx="16"
              fill={on ? `${accent}28` : 'rgba(255,255,255,.04)'}
              stroke={on ? accent : 'rgba(255,255,255,.12)'}
            />
            <text x={150 + i * 240} y="594" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Uni Sans, Montserrat">
              {label}
            </text>
          </g>
        )
      })}
      {stage !== 'problema' && (
        <>
          <rect x="24" y="52" width="280" height="78" rx="16" fill="rgba(4,8,16,.72)" stroke="rgba(255,255,255,.08)" />
          <text x="44" y="82" fill="#fff" fontSize="16" fontFamily="Uni Sans, Montserrat">
            {selected.name}
          </text>
          <text x="44" y="110" fill={accent} fontSize="18" fontFamily="Uni Sans, Montserrat" fontWeight="700">
            Maturidade {selected.value}
          </text>
        </>
      )}
    </svg>
  )
}

export function QueryViz({ accent, stage }: { accent: string; stage: string }) {
  const nodes = [
    { x: 180, y: 180, label: 'Cadastro' },
    { x: 500, y: 90, label: 'Território' },
    { x: 820, y: 180, label: 'Arrecadação' },
    { x: 320, y: 420, label: 'Saúde' },
    { x: 680, y: 430, label: 'Licenças' },
  ]
  const lit = stage === 'problema' ? 1 : stage === 'solucao' ? 3 : 5

  return (
    <svg className="flow-svg" viewBox="0 0 1000 640">
      <text x="24" y="40" fill="#fff" fontSize="18" fontFamily="Uni Sans, Montserrat">
        {stage === 'problema' ? 'Bases isoladas' : stage === 'solucao' ? 'Consulta integrada' : 'Cidade inteira à vista'}
      </text>
      <circle cx="500" cy="280" r="54" fill={`${accent}33`} stroke={accent} />
      <text x="500" y="286" textAnchor="middle" fill="#fff" fontSize="16" fontFamily="Uni Sans, Montserrat">
        Consulta
      </text>
      {nodes.map((node, i) => (
        <g key={node.label} opacity={i < lit ? 1 : 0.28}>
          <line x1="500" y1="280" x2={node.x} y2={node.y} stroke={accent} strokeOpacity="0.45" />
          <circle cx={node.x} cy={node.y} r="36" fill={`${accent}22`} stroke={accent} />
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#fff" fontSize="13" fontFamily="Uni Sans, Montserrat">
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

export function LicenseMap({ accent, stage }: { accent: string; stage: string }) {
  const spots = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        i,
        x: 80 + (i % 7) * 130 + (i % 2) * 18,
        y: 90 + Math.floor(i / 7) * 130,
        status: i % 5 === 0 ? 'vencida' : i % 4 === 0 ? 'a vencer' : 'válida',
      })),
    [],
  )

  return (
    <svg className="map-svg" viewBox="0 0 1000 640">
      <text x="24" y="40" fill="#fff" fontSize="18" fontFamily="Uni Sans, Montserrat">
        {stage === 'problema' ? 'Licenças fora do radar' : stage === 'solucao' ? 'Status no território' : 'Prazos sob controle'}
      </text>
      {spots.map((spot) => {
        const hidden = stage === 'problema' && spot.status !== 'válida'
        const color = spot.status === 'válida' ? accent : spot.status === 'a vencer' ? '#ff8300' : '#93039f'
        return (
          <g key={spot.i}>
            <circle cx={spot.x} cy={spot.y} r="18" fill={hidden ? 'rgba(255,255,255,.08)' : `${color}44`} stroke={hidden ? 'rgba(255,255,255,.2)' : color} />
            {stage !== 'problema' && (
              <circle cx={spot.x} cy={spot.y} r="5" fill={color}>
                {spot.status !== 'válida' && <animate attributeName="opacity" values="1;0.25;1" dur="1.8s" repeatCount="indefinite" />}
              </circle>
            )}
          </g>
        )
      })}
      <text x="24" y="610" fill="rgba(244,247,251,.45)" fontSize="14" fontFamily="Uni Sans, Montserrat">
        Verde: válida · Laranja: a vencer · Vermelho: vencida
      </text>
    </svg>
  )
}
