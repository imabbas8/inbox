/** Deterministic pseudo-random helpers so UI data is stable across renders. */

export function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase()
}

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-orange-500',
]

export function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length]
}

/** Stable HH:MM style timestamp derived from an id. */
export function fakeTime(id: number) {
  const hour = (8 + (id * 7) % 15).toString().padStart(2, '0')
  const minute = ((id * 13) % 60).toString().padStart(2, '0')
  return `${hour}:${minute}`
}

export function fullName(first: string, last: string) {
  return `${first} ${last}`
}
