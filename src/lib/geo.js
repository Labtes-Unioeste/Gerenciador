import { GEO } from '../data/geo.js'

export function normCity(s) {
  return (s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\//g, ' ')
    .trim()
    .toLowerCase()
}

export function geoFor(cityRaw) {
  if (!cityRaw) return null
  const variants = String(cityRaw).split('/').map((s) => s.trim())
  for (const v of variants) {
    const c = GEO[normCity(v)]
    if (c) return c
  }
  const nc = normCity(cityRaw)
  for (const k in GEO) {
    if (nc.includes(k) || k.includes(nc)) return GEO[k]
  }
  return null
}

// city column index per tab (from original logic)
export const CITY_INDEX = {
  empresas: 1,
  pesquisadores: 3,
  universidades: 2,
  fertilizantes: 1,
  redes: -1,
}
