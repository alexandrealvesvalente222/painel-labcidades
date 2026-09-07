/** Escala fluida para caber a arte 1920×1080 em qualquer janela. */
export function getUiScale(width: number, height: number) {
  const fit = Math.min(width / 1920, height / 1080)
  return Math.max(0.4, Math.min(1.35, fit))
}

export function viewportSize() {
  const vp = window.visualViewport
  return {
    width: vp?.width ?? window.innerWidth,
    height: vp?.height ?? window.innerHeight,
  }
}
