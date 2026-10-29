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

/** Escala uniforme (contain) — útil para ícones/círculos. */
export function getCscScale(width: number, height: number, orientation: Orientation = 'landscape') {
  const board = cscArtboard(orientation)
  return Math.min(width / board.w, height / board.h)
}

/** Eixos fluidos: preenche a tela ao redimensionar (stretch do artboard). */
export function getCscAxes(width: number, height: number, orientation: Orientation = 'landscape') {
  const board = cscArtboard(orientation)
  const minAxis = 0.35
  return {
    u: Math.max(minAxis, width / board.w),
    v: Math.max(minAxis, height / board.h),
  }
}

/**
 * Escala tipográfica alinhada ao menor eixo — evita texto distorcido
 * quando a janela alonga só em uma direção.
 */
export function getTypeScale(width: number, height: number, orientation: Orientation = 'landscape') {
  const { u, v } = getCscAxes(width, height, orientation)
  return Math.max(0.45, Math.min(u, v))
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
