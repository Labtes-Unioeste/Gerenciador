import { MapContainer, GeoJSON, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { PR_GEO } from '../data/prGeo.js'
import { geoFor } from '../lib/geo.js'
import { CAT } from '../data/cat.js'
import { esc } from '../lib/format.js'
import MunicipiosLayer from './MunicipiosLayer.jsx'

const PR_CENTER = [-24.5, -51.5]
const PR_ZOOM = 7

const MAP_ICON = L.divIcon({
  className: 'pin-marker',
  html: '<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#10b981" stroke="#065f46" stroke-width="1.2" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="3" fill="#fff"/></svg>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -26],
})

function FixSize() {
  const map = useMap()
  useEffect(() => {
    const fix = () => {
      try { map.invalidateSize({ animate: false }) } catch {}
    }
    fix()
    const t1 = setTimeout(fix, 300)
    const t2 = setTimeout(fix, 1200)
    window.addEventListener('resize', fix)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('resize', fix)
    }
  }, [map])
  return null
}

export default function MapPanel({ contacts }) {
  const markers = useMemo(() => {
    const seen = {}
    const out = []
    contacts.forEach((c) => {
      const g = geoFor(c.city)
      if (!g) return
      const key = g[0] + ',' + g[1]
      if (seen[key]) {
        seen[key].items.push(c)
        return
      }
      const item = { name: c.name, city: c.city, inst: c.inst, cat: CAT[c.tab] || c.tab }
      seen[key] = { coord: g, items: [item] }
      out.push(seen[key])
    })
    return out
  }, [contacts])

  return (
    <div className="map-card map-card--bare">
      <div id="map" style={{ position: 'relative' }}>
        <div className="map-compass" aria-hidden="true">N</div>
        <MapContainer
          center={PR_CENTER}
          zoom={PR_ZOOM}
          minZoom={PR_ZOOM}
          maxZoom={PR_ZOOM}
          scrollWheelZoom={false}
          dragging={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          zoomControl={false}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <GeoJSON
            data={PR_GEO}
            style={{ color: '#1F5F3A', weight: 2.4, fillOpacity: 0 }}
          />
          <MunicipiosLayer contacts={contacts} />
          {markers.map((m) => {
            const html = m.items
              .map(
                (it) =>
                  `<div style="margin-bottom:6px"><span style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:.3px;text-transform:uppercase;color:#10b981;margin-bottom:3px">${esc(
                    it.cat
                  )}</span><br><b style="color:#065f46">${esc(it.name)}</b><br><span style="color:#5d756a">📍 ${esc(
                    it.city || ''
                  )}</span>${
                    it.inst && it.inst !== it.city
                      ? `<br><span style="color:#5d756a">${esc(it.inst)}</span>`
                      : ''
                  }</div>`
              )
              .join('')
            const tip = esc(m.items[0].city || '') + (m.items.length > 1 ? ` (+${m.items.length - 1})` : '')
            return (
              <Marker key={m.coord.join(',')} position={m.coord} icon={MAP_ICON}>
                <Popup>{<div dangerouslySetInnerHTML={{ __html: html }} />}</Popup>
                <Tooltip direction="top" offset={[0, -26]}>
                  {tip}
                </Tooltip>
              </Marker>
            )
          })}
          <FixSize />
        </MapContainer>
      </div>
    </div>
  )
}
