/** Reference-counted immersive mode for sticky scroll chapters. */

export function setImmersive(active) {
  if (typeof document === 'undefined') return
  const key = '__zedImmersive'
  const next = Math.max(0, (window[key] || 0) + (active ? 1 : -1))
  window[key] = next
  if (next > 0) document.documentElement.dataset.immersive = ''
  else delete document.documentElement.dataset.immersive
}
