/** Ajuste visual do wordmark LABCIDADES na splash. */
export const WORDMARK_LAYOUT = {
  bottom: 23,
  shiftX: 0,
  size: 4.6,
  letterSpacing: 0.045,
  tagScale: 0.32,
}

export type WordmarkLayout = typeof WORDMARK_LAYOUT

/** Faixa inferior reservada para o wordmark — trilhas do cérebro não devem cruzar. */
export function getWordmarkMaskBounds(width: number, height: number) {
  const bottom = (WORDMARK_LAYOUT.bottom / 100) * height
  const title = (WORDMARK_LAYOUT.size / 100) * width
  const tag = title * WORDMARK_LAYOUT.tagScale
  const gap = title * 0.08
  const padding = title * 0.2
  const maskHeight = bottom + title + gap + tag + padding
  return {
    top: height - maskHeight,
    height: maskHeight,
  }
}
