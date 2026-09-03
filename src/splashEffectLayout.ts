/** Ajuste visual do campo binário na splash. */
export const BINARY_LAYOUT = {
  /** Topo da área binária (fração da altura). */
  top: 0.008,
  /** Reserva acima do wordmark (fração da altura). */
  bottomReserve: 0.015,
  /** Até onde o binário entra no cérebro (fração da largura do cérebro). */
  mergeDepth: 0.5,
  /** Extensão extra à esquerda (fração da largura da tela). */
  leftExtend: 0.025,
}

/** Ajuste visual das trilhas e pacotes de saída. */
export const OUTPUT_LAYOUT = {
  /** Topo da área das trilhas (fração da altura). */
  top: 0.008,
  /** Reserva acima do wordmark (fração da altura). */
  bottomReserve: 0.015,
  /** Margem da borda direita (fração da largura). */
  rightPad: 0.01,
}

/** Blur circular na splash — posição em frações da tela (0–1). */
export const BLUR_LAYOUT = {
  /** Centro horizontal (fração da largura). */
  centerX: 0.235,
  /** Centro vertical (fração da altura). */
  centerY: 0.305,
  /** Raio (fração do menor lado da tela). */
  radius: 0.225,
  /** Intensidade do desfoque em px (escala com uiScale). */
  blurPx: 12,
  /** Opacidade do véu escuro sobre o blur (0–1). */
  strength: 0.5,
}

export type BinaryLayout = typeof BINARY_LAYOUT
export type OutputLayout = typeof OUTPUT_LAYOUT
export type BlurLayout = typeof BLUR_LAYOUT
