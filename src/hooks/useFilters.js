import { DATA } from '../data/contacts.js'
import { CITY_INDEX } from '../lib/geo.js'
import { uid } from '../lib/format.js'

const TABS = ['empresas', 'pesquisadores', 'universidades', 'fertilizantes', 'redes']

export function matchesFilters(row, { q, prio, doneF, estado }, tab, i) {
  const prior = row[row.length - 1]
  const id = uid(tab, i)
  if (prio !== 'Todas' && prior !== prio) return false
  if (doneF === 'contatados' && !estado[id]) return false
  if (doneF === 'pendentes' && estado[id]) return false
  const hay = row.join(' ').toLowerCase()
  if (q && !hay.includes(q)) return false
  return true
}

// returns list of {tab, i, row, prior, name, city, inst} filtered & sorted
export function getFilteredContacts({ q, prio, doneF, estado, tab }) {
  const showTab = tab === 'overview' || tab === 'mapa' ? null : tab
  const items = []
  TABS.forEach((t) => {
    if (showTab && t !== showTab) return
    const ci = CITY_INDEX[t]
    if (ci < 0) return
    DATA[t].rows.forEach((r, i) => {
      if (!matchesFilters(r, { q, prio, doneF, estado }, t, i)) return
      items.push({
        tab: t,
        i,
        row: r,
        prior: r[r.length - 1],
        name: r[0],
        city: r[ci] || '',
        inst: r[1] || '',
      })
    })
  })
  items.sort((a, b) => (a.prior === b.prior ? 0 : a.prior === 'Alta' ? -1 : 1))
  return items
}
