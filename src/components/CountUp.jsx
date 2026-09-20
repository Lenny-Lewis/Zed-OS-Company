'use client'

import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const ease = [0.16, 1, 0.3, 1]

export default function CountUp({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.75 })
  const shouldReduceMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (shouldReduceMotion) {
      const frame = requestAnimationFrame(() => setDisplayValue(value))
      return () => cancelAnimationFrame(frame)
    }

    const controls = animate(0, value, {
      duration: Math.min(1.35, 0.9 + String(value).length * 0.12),
      ease,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    })

    return () => controls.stop()
  }, [inView, shouldReduceMotion, value])

  return <span ref={ref} className="tabular-nums">{displayValue}{suffix}</span>
}
