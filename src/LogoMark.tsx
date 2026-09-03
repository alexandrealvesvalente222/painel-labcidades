import type { CSSProperties } from 'react'

/** Marca vertical LabCidades — logo.png */
export function LogoMark({
  className,
  title = 'LabCidades — projetos inteligentes',
  style,
}: {
  className?: string
  title?: string
  style?: CSSProperties
}) {
  return (
    <img
      src="./logo-labcidades.png"
      alt={title}
      className={className}
      style={style}
      draggable={false}
    />
  )
}
