export function sinerp (from, to, t = 0) {
  const range = to - from
  const angle = t * Math.PI / 2
  return Math.sin(angle) * range + from
}
