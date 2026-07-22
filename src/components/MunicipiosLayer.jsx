import { useEffect, useMemo, useState } from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import L from 'leaflet'

const STYLE = {
  color: '#66BB6A',
  weight: 0.8,
  opacity: 0.9,
  fillColor: '#E8F5E9',
  fillOpacity: 0.7,
}

const OUTER_STYLE = {
  color: '#1F5F3A',
  weight: 2.2,
  opacity: 1,
  fillColor: '#E8F5E9',
  fillOpacity: 0.7,
}

const HOVER_STYLE = {
  color: '#2E7D32',
  weight: 1.6,
  opacity: 1,
  fillColor: '#C8E6C9',
  fillOpacity: 0.9,
}

export default function MunicipiosLayer({ contacts }) {
  const map = useMap()
  const [geoJsonData, setGeoJsonData] = useState(null)

  const countByCity = useMemo(() => {
    const m = {}
    ;(contacts || []).forEach((c) => {
      const key = c.city || c.name || ''
      if (!m[key]) m[key] = { suppliers: 0, products: 0 }
      m[key].suppliers += 1
      m[key].products += 1
    })
    return m
  }, [contacts])

  useEffect(() => {
    let cancelled = false
    fetch('/municipios-pr.json')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setGeoJsonData(d)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!geoJsonData) return
    try {
      const layer = L.geoJSON(geoJsonData, {
        style: () => ({ color: '#66BB6A', weight: 0.8, opacity: 0.9, fillColor: '#E8F5E9', fillOpacity: 0.7 }),
        onEachFeature: (feature, layer) => {
          const props = feature?.properties || {}
          const name = props.name || props.NM_MUN || 'Município'
          layer.bindTooltip(`<b>${name}</b>`, { className: 'municipio-tooltip', direction: 'top', offset: [0, -10], opacity: 1 })
        },
      })
      layer.addTo(map)
      return () => {
        try { map.removeLayer(layer) } catch {}
      }
    } catch {
      // ignore
    }
  }, [map, geoJsonData])

  return null
}
