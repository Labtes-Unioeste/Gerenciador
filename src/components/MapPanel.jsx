import { MapContainer, GeoJSON, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { PR_GEO } from '../data/prGeo.js'
import { geoFor } from '../lib/geo.js'
import { CAT } from '../data/cat.js'
import { esc } from '../lib/format.js'
import MunicipiosLayer from './MunicipiosLayer.jsx'
import { supabase } from '../lib/supabase.js'

const PR_CENTER = [-24.5, -51.5]
const PR_ZOOM = 7

const STATUS_COR = {
  parceiro_ativo: '#1F5F3A', projeto_em_construcao: '#155e9c',
  interesse_confirmado: '#2E7D32', em_negociacao: '#B7791F',
  reuniao_agendada: '#B7791F', primeiro_contato: '#B7791F',
  email_enviado: '#9aa6a0', nao_iniciado: '#9aa6a0',
}
const STATUS_LABEL = {
  parceiro_ativo: 'Parceiro ativo', projeto_em_construcao: 'Projeto em construção',
  interesse_confirmado: 'Interesse confirmado', em_negociacao: 'Em negociação',
  reuniao_agendada: 'Reunião agendada', primeiro_contato: 'Primeiro contato',
  email_enviado: 'E-mail enviado', nao_iniciado: 'Não prospectado',
}
function pinIcon(status) {
  const cor = STATUS_COR[status] || '#9aa6a0'
  return L.divIcon({
    className: 'pin-marker',
    html: '<svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="' + cor + '" stroke="#ffffff" stroke-width="1.4" d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7z"/><circle cx="12" cy="9" r="3" fill="#fff"/></svg>',
    iconSize: [30, 30], iconAnchor: [15, 30], popupAnchor: [0, -26],
  })
}

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
  const [statusMap, setStatusMap] = useState({})
  const [painel, setPainel] = useState(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.from('instituicoes').select('nome, status_crm, pontuacao_maturidade, cidade')
      if (active && data) {
        const mm = {}
        data.forEach((d) => { mm[(d.nome || '').trim().toLowerCase()] = d })
        setStatusMap(mm)
      }
    })()
    return () => { active = false }
  }, [])

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
            const first = m.items[0]
            const sb = statusMap[(first && first.name || '').trim().toLowerCase()]
            const status = (sb && sb.status_crm) || 'nao_iniciado'
            return (
              <Marker key={m.coord.join(',')} position={m.coord} icon={pinIcon(status)}
                eventHandlers={{ click: () => setPainel({ nome: first && first.name, cidade: first && first.city, status: status, mat: sb && sb.pontuacao_maturidade, inst: first && first.inst, cat: first && first.cat }) }}>
                <Popup>
                  <div className="map-pop">
                    <strong>{m.items[0]?.name}</strong>
                    <div className="map-pop-sub">{m.items[0]?.inst || m.items[0]?.city}</div>
                    {m.items.length > 1 && <div className="map-pop-cnt">{m.items.length} contatos nesta cidade</div>}
                  </div>
                </Popup>
                <Tooltip direction="top" offset={[0, -26]}>
                  {tip}
                </Tooltip>
              </Marker>
            )
          })}
          <FixSize />
        </MapContainer>
        {painel && (
          <div className="map-sidepanel">
            <button className="map-sidepanel-x" onClick={() => setPainel(null)}>×</button>
            <span className={'crm-badge st-' + (painel.status || 'nao_iniciado')}>{STATUS_LABEL[painel.status] || painel.status}</span>
            <h3>{painel.nome}</h3>
            <div className="map-sidepanel-sub">{[painel.cat, painel.cidade].filter(Boolean).join(' · ')}</div>
            <div className="perfil-mat"><span>Maturidade</span><div className="mat-bar"><div className="mat-fill" style={{ width: (painel.mat || 5) + '%', background: (painel.mat||5)>=90?'#1F5F3A':(painel.mat||5)>=50?'#2E7D32':(painel.mat||5)>=15?'#B7791F':'#9aa6a0' }} /></div><b>{(painel.mat||5)}/100</b></div>
            <p className="map-sidepanel-hint">Acesse a Área Restrita (cadeado) para ver o perfil completo, conexões e linha do tempo.</p>
          </div>
        )}
      </div>
    </div>
  )
}
