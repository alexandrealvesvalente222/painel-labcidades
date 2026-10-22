import { CARGO_OPTIONS } from './brLocations'

const PALETTE = [
  '#32bcae',
  '#f4a261',
  '#e76f51',
  '#9b5de5',
  '#00bbf9',
  '#fee440',
  '#90be6d',
  '#f72585',
  '#4cc9f0',
]

export const CARGO_COLORS: Record<string, string> = Object.fromEntries(
  CARGO_OPTIONS.map((cargo, index) => [cargo, PALETTE[index % PALETTE.length]]),
)

export function normalizeCargoLabel(cargo: string) {
  const raw = String(cargo ?? '').trim()
  if (!raw) return 'Outros cargos'
  if ((CARGO_OPTIONS as readonly string[]).includes(raw)) return raw
  return 'Outros cargos'
}

export function colorForCargo(cargo: string) {
  const label = normalizeCargoLabel(cargo)
  return CARGO_COLORS[label] ?? '#90be6d'
}
