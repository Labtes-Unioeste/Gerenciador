import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { PR_GEO } from '../data/prGeo.js'
import { geoFor } from '../lib/geo.js'
import { CAT } from '../data/cat.js'
import { esc } from '../lib/format.js'
import { ICONS, CAT_META } from '../lib/icons.js'

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

function FitBounds({ bounds }) {
  const map = useMap()
  useEffect(() => {
    try {
      const prBounds = L.geoJSON(PR_GEO).getBounds()
      const all = L.latLngBounds(bounds)
      map.fitBounds(prBounds.extend(all), { padding: [30, 30], maxZoom: 11, animate: true })
    } catch {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11, animate: true })
    }
  }, [bounds, map])
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

  const bounds = markers.map((m) => m.coord)

  return (
    <div className="map-card">
      <div className="hd">
        <h2>
          <span className="pin">
            <ICONS.MapPin size={18} strokeWidth={2.2} />
          </span>{' '}
          Localização no Paraná
        </h2>
        <span
          className="full"
          onClick={() => {
            const el = document.getElementById('map')
            if (el?.requestFullscreen) el.requestFullscreen()
            else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen()
          }}
        >
          <ICONS.Maximize2 size={14} strokeWidth={2.2} /> Tela cheia
        </span>
      </div>
      <div className="sub">
        Marcadores sincronizados com a busca, filtros e aba selecionada. Clique em um
        pino para ver os detalhes.
      </div>
      <div id="map">
        <MapContainer
          center={PR_CENTER}
          zoom={PR_ZOOM}
          scrollWheelZoom={true}
          attributionControl={false}
          style={{ height: '100%', width: '100%' }}
        >
          <GeoJSON
            data={PR_GEO}
            style={{ color: '#0B7A5C', weight: 2, fillColor: '#0B7A5C', fillOpacity: 0.08 }}
          />
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
          <FitBounds bounds={bounds} />
        </MapContainer>
      </div>
      <div className="map-legend">
        <b>Legenda</b>
        {(CAT.empresas ? ['empresas','pesquisadores','universidades','fertilizantes','redes'] : []).map((k) => {
          const meta = CAT_META[k]
          if (!meta) return null
          const label = {empresas:'Empresa / Mineradora',pesquisadores:'Pesquisador / Órgão',universidades:'Universidade',fertilizantes:'Biofertilizante',redes:'Rede / Evento'}[k] || k
          return (
            <div className="li" key={k}>
              <span className="dot" style={{ background: meta.bg, color: meta.fg }}><meta.Icon size={12} strokeWidth={2.2} /></span>
              {label}
            </div>
          )
        })}
      </div>
    </div>
  )
}
