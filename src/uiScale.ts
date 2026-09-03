/** Escala fluida com base no menor lado da viewport (referência 1080px). */
export function getUiScale(width: number, height: number) {
  return Math.max(0.55, Math.min(1.35, Math.min(width, height) / 1080))
}

export function viewportSize() {
  const vp = window.visualViewport
  return {
    width: vp?.width ?? window.innerWidth,
    height: vp?.height ?? window.innerHeight,
  }
}
