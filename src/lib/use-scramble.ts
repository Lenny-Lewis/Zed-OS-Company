"use client"

import * as React from "react"

const NOISE = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789{}[]/<>#%&*+="

/** Text that runs through random characters left to right; unsettled ones can take an accent colour. */
export function useScramble(text: string, accent?: string) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const raf = React.useRef(0)

  const run = React.useCallback(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const chars = Array.from(text)
    const step = (now: number) => {
      const settled = Math.floor(((now - start) / 520) * chars.length)
      if (settled >= chars.length) {
        el.textContent = text
        return
      }
      el.replaceChildren(
        document.createTextNode(chars.slice(0, settled).join("")),
        ...chars.slice(settled).map((ch) => {
          const span = document.createElement("span")
          span.textContent = ch.trim() ? NOISE[Math.floor(Math.random() * NOISE.length)] : ch
          if (accent) span.style.color = accent
          return span
        }),
      )
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
  }, [text, accent])

  React.useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return { ref, run }
}
