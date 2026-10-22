import brLocations from './data/br-locations.json'

export type BrEstado = { uf: string; nome: string }

export const BR_ESTADOS: BrEstado[] = brLocations.estados

export const BR_MUNICIPIOS: Record<string, string[]> = brLocations.municipios

export const CARGO_OPTIONS = [
  'Sócio(a) / CEO / Proprietário(a) / Presidente',
  'Diretor(a)',
  'Gerente',
  'Coordenador(a) / Supervisor(a)',
  'Analista / Assistente',
  'Vendedor(a) / Executivo(a)',
  'Outros cargos',
  'Estudante',
  'Não trabalho atualmente',
] as const

export type CargoOption = (typeof CARGO_OPTIONS)[number]

export function municipiosDoEstado(uf: string): string[] {
  return BR_MUNICIPIOS[uf] ?? []
}

export function matchEstadoFromAutofill(value: string): string {
  const raw = value.trim()
  if (!raw) return ''
  const upper = raw.toUpperCase()
  const byUf = BR_ESTADOS.find((e) => e.uf === upper)
  if (byUf) return byUf.uf
  const norm = raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
  const byNome = BR_ESTADOS.find(
    (e) =>
      e.nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase() === norm,
  )
  return byNome?.uf ?? ''
}

export function matchMunicipioFromAutofill(uf: string, value: string): string {
  const list = municipiosDoEstado(uf)
  if (!list.length || !value.trim()) return ''
  const norm = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
  const exact = list.find(
    (m) =>
      m
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase() === norm,
  )
  return exact ?? ''
}
