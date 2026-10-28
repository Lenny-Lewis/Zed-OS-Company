'use client'

import { motion, useReducedMotion } from 'framer-motion'

const ease = [0.16, 1, 0.3, 1]

const variants = {
  up: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  blur: {
    hidden: { opacity: 0, y: 16, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  clip: {
    hidden: { opacity: 0, clipPath: 'inset(12% 0 12% 0)' },
    visible: { opacity: 1, clipPath: 'inset(0% 0 0% 0)' },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
  variant = 'up',
  duration = 0.75,
  amount = 0.18,
}) {
  const shouldReduceMotion = useReducedMotion()
  const MotionElement = motion[as] || motion.div
  const preset = variants[variant] || variants.up

  return (
    <MotionElement
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount }}
      variants={preset}
      transition={{ duration, delay: delay / 1000, ease }}
    >
      {children}
    </MotionElement>
  )
}

export function Stagger({ children, className = '', delay = 0, stagger = 0.08, amount = 0.12 }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay / 1000,
            staggerChildren: shouldReduceMotion ? 0 : stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '', variant = 'up' }) {
  const shouldReduceMotion = useReducedMotion()
  const preset = variants[variant] || variants.up

  return (
    <motion.div
      className={className}
      variants={
        shouldReduceMotion
          ? undefined
          : {
              hidden: preset.hidden,
              visible: {
                ...preset.visible,
                transition: { duration: 0.7, ease },
              },
            }
      }
    >
      {children}
    </motion.div>
  )
}
