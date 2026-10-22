export type Orientation = 'landscape' | 'portrait'

/** Artboard Figma paisagem. */
export const CSC_LANDSCAPE = { w: 1440, h: 1024 } as const

/** Artboard retrato para o totem. */
export const CSC_PORTRAIT = { w: 768, h: 1280 } as const

export function cscArtboard(orientation: Orientation) {
  return orientation === 'portrait' ? CSC_PORTRAIT : CSC_LANDSCAPE
}

/** Escala fluida para caber a arte 1920×1080 em qualquer janela. */
export function getUiScale(width: number, height: number) {
  const fit = Math.min(width / 1920, height / 1080)
  return Math.max(0.4, Math.min(1.35, fit))
}

/** Escala do artboard CSC conforme orientação. */
export function getCscScale(width: number, height: number, orientation: Orientation = 'landscape') {
  const board = cscArtboard(orientation)
  return Math.min(width / board.w, height / board.h)
}

/**
 * Escala tipográfica alinhada ao layout.
 * No retrato, --t acompanha --u/--v (artboard 768×1280) para o texto
 * não ficar minúsculo dentro de botões e blocos grandes.
 */
export function getTypeScale(width: number, height: number, orientation: Orientation = 'landscape') {
  if (orientation === 'portrait') {
    return Math.max(0.45, getCscScale(width, height, orientation))
  }
  return Math.max(0.45, Math.min(width / CSC_LANDSCAPE.w, height / CSC_LANDSCAPE.h))
}

export function viewportSize() {
  const vp = window.visualViewport
  return {
    width: vp?.width ?? window.innerWidth,
    height: vp?.height ?? window.innerHeight,
  }
}

/** Orientação automática pela proporção da tela (altura > largura = retrato). */
export function detectOrientation(width?: number, height?: number): Orientation {
  const size =
    width != null && height != null
      ? { width, height }
      : typeof window === 'undefined'
        ? { width: 1440, height: 1024 }
        : viewportSize()
  return size.height > size.width ? 'portrait' : 'landscape'
}

export function readOrientation(): Orientation {
  if (typeof window !== 'undefined') return detectOrientation()
  const value = document.documentElement.dataset.orientation
  return value === 'portrait' ? 'portrait' : 'landscape'
}
