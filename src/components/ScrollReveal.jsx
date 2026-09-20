'use client'

import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

export default function ScrollReveal({ children, className = '', delay = 0, as = 'div' }) {
  const shouldReduceMotion = useReducedMotion()
  const MotionElement = motion[as]

  return (
    <MotionElement
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: delay / 1000, ease }}
    >
      {children}
    </MotionElement>
  )
}
