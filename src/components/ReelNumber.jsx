'use client'

// Slot-machine number, the same animation as the stats on lennoxlewis.co.ke: every digit is a
// reel of 8 digits that spins (alternate reels in opposite directions) and lands on the real
// value, with a motion blur that peaks mid-spin. Plays once when 40% in view; click to replay.
// Reduced motion shows the plain number.

import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const ROWS = 8 // digits on each reel
const DURATION = 2 // seconds per reel
const STAGGER = 0.1 // seconds between neighbouring reels
const BLUR = 6 // px of motion blur at full speed
const EASE = [0.25, 0.46, 0.45, 0.94]
// Row height in em. A little over 1em so tall serif glyphs (Newsreader) never peek into the window
// from the neighbouring row.
const ROW = 1.15

// Deterministic filler digit, so server and client agree and each replay gets a fresh sequence.
function filler(digit, reel, replay, row) {
  let s = (digit + 1) * 17 + (reel + 1) * 29 + (replay + 1) * 47 + row * 41
  s = Math.imul(s ^ (s >>> 3), 2654435761)
  return (s >>> 0) % 10
}

function Reel({ digit, index, replay, active }) {
  const down = index % 2 === 1
  const rows = Array.from({ length: ROWS }, (_, row) => filler(digit, index, replay, row))
  // The real digit sits where the reel stops.
  rows[down ? 0 : ROWS - 1] = digit
  const end = `-${(ROWS - 1) * ROW}em`
  const from = down ? end : '0em'
  const to = down ? '0em' : end

  return (
    <span
      className="relative inline-block w-[1ch] overflow-hidden leading-none"
      style={{ height: `${ROW}em`, fontVariantNumeric: 'tabular-nums' }}
    >
      <motion.span
        className="absolute left-0 top-0 flex w-full flex-col will-change-transform"
        initial={{ y: from, filter: 'blur(0px)' }}
        animate={
          active
            ? { y: to, filter: ['blur(0px)', `blur(${BLUR}px)`, `blur(${BLUR}px)`, 'blur(0px)'] }
            : { y: from, filter: 'blur(0px)' }
        }
        transition={{
          y: { duration: DURATION, delay: index * STAGGER, ease: EASE },
          filter: { duration: DURATION, delay: index * STAGGER, times: [0, 0.2, 0.8, 1], ease: 'easeOut' },
        }}
      >
        {rows.map((d, row) => (
          <span key={row} className="flex w-full shrink-0 items-center justify-center leading-none" style={{ height: `${ROW}em` }}>
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  )
}

export default function ReelNumber({ value, suffix, label, className = '', suffixClassName = '' }) {
  const ref = useRef(null)
  const timer = useRef(0)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const [replayed, setReplayed] = useState(false) // true while a click-replay is running
  const [replay, setReplay] = useState(0)
  const active = inView && !replayed

  // Every digit spins, in the suffix too (the 7 of "24/7"); symbols like / + % stay still.
  // Reel indices run on across value and suffix, so the stagger flows left to right.
  let reelIndex = 0
  const renderChars = (text) =>
    String(text)
      .split('')
      .map((c, i) => {
        if (!/\d/.test(c)) return <span key={`s${i}`}>{c}</span>
        const index = reelIndex++
        return <Reel key={`${index}-${c}-${replay}`} digit={Number(c)} index={index} replay={replay} active={active} />
      })

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (reduced) {
    return (
      <span ref={ref} className={`inline-flex items-baseline ${className}`}>
        <span className="tabular-nums">{value}</span>
        {suffix != null && <span className={suffixClassName}>{suffix}</span>}
      </span>
    )
  }

  // Reset the reels to their start, remount them with a new sequence, then spin again.
  const onReplay = () => {
    window.clearTimeout(timer.current)
    setReplayed(true)
    setReplay((r) => r + 1)
    timer.current = window.setTimeout(() => setReplayed(false), 50)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onReplay}
      aria-label={`${value}${suffix ?? ''} ${label ?? ''}. Replay number animation`.trim()}
      className={`inline-flex cursor-pointer appearance-none items-center border-0 bg-transparent p-0 text-left focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-center leading-none tabular-nums">
        {renderChars(value)}
      </span>
      {suffix != null && (
        <span aria-hidden="true" className={`inline-flex items-center leading-none tabular-nums ${suffixClassName}`}>
          {renderChars(suffix)}
        </span>
      )}
    </button>
  )
}
