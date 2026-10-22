import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { CARGO_OPTIONS } from './brLocations'
import { colorForCargo, normalizeCargoLabel } from './cargoColors'
import esCentroids from './data/es-centroids.json'
import 'leaflet/dist/leaflet.css'

type InteresseLite = {
  municipio: string
  estado: string
  cargo: string
}

type CityAgg = {
  key: string
  name: string
  estado: string
  lat: number
  lng: number
  total: number
  byCargo: { cargo: string; count: number; color: string }[]
}

const ES_CENTER: [number, number] = [-19.6, -40.5]

function normalizeName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\uFFFD/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

const CENTROID_BY_NORM: Record<string, { lat: number; lng: number; name: string }> = {}
for (const [name, value] of Object.entries(esCentroids as Record<string, { lat: number; lng: number }>)) {
  CENTROID_BY_NORM[normalizeName(name)] = { lat: value.lat, lng: value.lng, name }
}

function pointIcon(color: string, total: number) {
  const size = total >= 8 ? 28 : total >= 3 ? 24 : 20
  const html = `
    <span class="admin-map-dot" style="width:${size}px;height:${size}px;background:${color};">
      <em>${total}</em>
    </span>
  `
  return L.divIcon({
    className: 'admin-map-marker',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

function MapReady({ points }: { points: CityAgg[] }) {
  const map = useMap()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      map.invalidateSize()
      if (!points.length) {
        map.setView(ES_CENTER, 7)
        return
      }
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]))
      map.fitBounds(bounds.pad(0.4), { animate: false })
    }, 80)
    return () => window.clearTimeout(timer)
  }, [map, points])

  return null
}

export default function AdminMap({ items }: { items: InteresseLite[] }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  const cities = useMemo(() => {
    const groups = new Map<string, InteresseLite[]>()
    for (const item of items) {
      const key = `${normalizeName(item.municipio)}|${(item.estado || 'ES').toUpperCase()}`
      const list = groups.get(key) ?? []
      list.push(item)
      groups.set(key, list)
    }

    const result: CityAgg[] = []
    for (const [key, rows] of groups) {
      const [normName, uf] = key.split('|')
      const centroid = CENTROID_BY_NORM[normName]
      if (!centroid) continue
      const cargoCounts = new Map<string, number>()
      for (const row of rows) {
        const cargo = normalizeCargoLabel(row.cargo)
        cargoCounts.set(cargo, (cargoCounts.get(cargo) ?? 0) + 1)
      }
      const byCargo = [...cargoCounts.entries()]
        .map(([cargo, count]) => ({ cargo, count, color: colorForCargo(cargo) }))
        .sort((a, b) => b.count - a.count)
      result.push({
        key,
        name: centroid.name,
        estado: uf,
        lat: centroid.lat,
        lng: centroid.lng,
        total: rows.length,
        byCargo,
      })
    }
    return result.sort((a, b) => b.total - a.total)
  }, [items])

  const legendCargos = useMemo(() => {
    const present = new Set(cities.flatMap((c) => c.byCargo.map((b) => b.cargo)))
    return CARGO_OPTIONS.filter((c) => present.has(c))
  }, [cities])

  return (
    <div className="admin-leaflet">
      {ready ? (
        <MapContainer
          className="admin-leaflet-map"
          center={ES_CENTER}
          zoom={7}
          scrollWheelZoom
          attributionControl={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri"
            maxZoom={16}
          />
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
            opacity={0.9}
            maxZoom={16}
          />
          <MapReady points={cities} />
          {cities.map((city) => {
            const color = city.byCargo[0]?.color ?? '#32bcae'
            return (
              <Marker key={city.key} position={[city.lat, city.lng]} icon={pointIcon(color, city.total)}>
                <Popup>
                  <div className="admin-map-popup">
                    <strong>
                      {city.name} · {city.estado}
                    </strong>
                    <p>
                      {city.total} inscrito{city.total === 1 ? '' : 's'}
                    </p>
                    <ul>
                      {city.byCargo.map((row) => (
                        <li key={row.cargo}>
                          <span className="admin-map-swatch" style={{ background: row.color }} />
                          <em>{row.count}</em> {row.cargo}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      ) : (
        <div className="admin-leaflet-loading">Carregando mapa…</div>
      )}

      <div className="admin-map-overlay">
        {ready && cities.length === 0 ? (
          <p className="admin-map-empty-msg">Nenhum município com coordenada nesta visão.</p>
        ) : null}
        <ul className="admin-map-cargo-legend">
          {legendCargos.map((cargo) => (
            <li key={cargo}>
              <span className="admin-map-swatch" style={{ background: colorForCargo(cargo) }} />
              {cargo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
