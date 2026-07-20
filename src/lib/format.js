// helpers + formatting (ported from the original single-file app)

export function esc(s) {
  return (s == null ? '' : String(s)).replace(/[&<>"]/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  }[c]))
}

export function linkify(val, kind) {
  if (!val) return ''
  const v = String(val)
  if (v.toLowerCase().startsWith('não') || v.toLowerCase().startsWith('nao'))
    return `<span class="meta">${esc(v)}</span>`
  if (kind === 'email') {
    return v
      .split('/')
      .map((e) => {
        const t = e.trim()
        return t ? `<a href="mailto:${esc(t)}">${esc(t)}</a>` : ''
      })
      .filter(Boolean)
      .join('<br>')
  }
  if (kind === 'tel') {
    return v
      .split('/')
      .map((e) => {
        const t = e.trim()
        const num = t.replace(/[^\d]/g, '')
        if (!num) return esc(t)
        return `<a href="tel:+55${esc(num)}">${esc(t)}</a>`
      })
      .filter(Boolean)
      .join('<br>')
  }
  if (kind === 'site') {
    return v
      .split('/')
      .map((e) => {
        let t = e.trim()
        if (!t) return ''
        let url = t
        if (!/^https?:\/\//.test(url)) url = 'https://' + url
        t = t.replace(/^https?:\/\//, '')
        return `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(t)}</a>`
      })
      .filter(Boolean)
      .join('<br>')
  }
  return esc(v)
}

export function kindForCol(colName) {
  if (/e-mail/i.test(colName)) return 'email'
  if (/telefone/i.test(colName)) return 'tel'
  if (/site|acessar/i.test(colName)) return 'site'
  return null
}

export function uid(tab, i) {
  return `${tab}_${i}`
}
