
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const dateTimeFmt = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function formatDate(iso) {
  return dateFmt.format(new Date(iso))
}

export function formatDateTime(iso) {
  return dateTimeFmt.format(new Date(iso))
}

// "2 hours ago", "yesterday". Falls back to a plain date after two weeks.
export function timeAgo(iso) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000
  const units = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  if (Math.abs(seconds) > 14 * 86400) return formatDate(iso)
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return rtf.format(Math.round(seconds / size), unit)
    }
  }
  return 'just now'
}