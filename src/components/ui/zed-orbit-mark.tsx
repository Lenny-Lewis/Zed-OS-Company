"use client"

import * as React from "react"

/*
 * The Zed OS orbit mark as vector geometry, traced from the brand sheet
 * (design/new_icons/05 · Orbit Z@2x.png). Two copies of one ellipse, mirrored at ±TILT round the
 * origin, cut away around the Z. Grey sits on top of the ink-coloured ring.
 */
const RX = 220.50
const RY = 81.45
const TILT = 28
const STROKE = 14.38
const GREY = "#8c8c8c"
const VIEW_BOX = "-208 -136 422 272"
const DOT = { x: 195.1, y: 103.8, r: 16.8 }
const Z_POINTS = "-62.3,-57.4 84.9,-57.4 -10.1,28.7 62.6,28.7 62.6,57.7 -84.1,57.7 11.5,-28.7 -62.3,-28.7"
// Where each ring is cut: round the Z, and at the top and bottom crossings.
const CUT_INK = "M28.0 -93.4 L24.7 -90.1 L-37.3 -60.1 L-90.3 -29.1 L-91.6 -30.4 L-90.1 -32.4 L-84.4 -45.4 L-77.5 -56.4 L-78.3 -57.0 L-85.3 -52.5 L-85.6 -53.4 L-83.6 -55.4 L-83.6 -56.4 L-82.3 -57.7 L-37.3 -85.7 L3.7 -102.7 L4.7 -102.7 L5.7 -101.7 L7.4 -101.4 L0.7 -98.4 L5.7 -95.9 L15.7 -94.7 L23.7 -93.0 L27.7 -94.0Z M92.0 30.6 L90.5 32.6 L84.8 45.6 L77.9 56.6 L78.7 57.2 L85.7 52.7 L86.0 53.6 L81.7 57.9 L40.7 83.9 L-4.3 102.9 L-5.3 101.9 L-7.0 101.6 L-0.3 98.6 L0.7 98.6 L-0.3 98.6 L-5.3 96.1 L-15.3 94.9 L-23.3 93.2 L-27.3 94.2 L-27.6 93.6 L-24.3 90.3 L90.7 29.3Z"
const CUT_GREY = "M92.0 -30.4 L90.7 -29.1 L29.7 -64.1 L-24.3 -90.1 L-27.6 -93.4 L-27.3 -94.0 L-23.3 -92.9 L-15.3 -94.7 L-7.3 -95.7 L3.7 -95.9 L4.7 -96.4 L-6.9 -101.4 L-1.3 -101.7 L44.7 -81.7 L83.7 -56.7 L87.0 -53.4 L85.7 -52.5 L82.7 -54.2 L81.7 -53.8 L80.6 -52.4 L85.8 -43.4 L90.5 -32.4Z M28.0 93.6 L27.7 94.2 L23.7 93.1 L15.7 94.9 L7.7 95.9 L-3.3 96.1 L-4.3 96.6 L7.4 101.6 L1.7 101.9 L-46.3 80.9 L-86.3 54.9 L-86.6 54.6 L-86.3 52.0 L-82.3 54.4 L-80.9 53.6 L-80.3 52.6 L-86.4 41.6 L-90.1 32.6 L-91.6 30.6 L-90.3 29.3 L-29.3 64.3 L24.7 90.3Z"

const rad = (deg: number) => (deg * Math.PI) / 180

/** A point on the ring tilted by `tilt` degrees, at ellipse parameter `t` (increasing t runs clockwise) */
function ringPoint(tilt: number, t: number) {
  const c = Math.cos(rad(tilt))
  const s = Math.sin(rad(tilt))
  const u = RX * Math.cos(t)
  const v = RY * Math.sin(t)
  return `${(u * c - v * s).toFixed(2)} ${(u * s + v * c).toFixed(2)}`
}

/** Where a ring passes the top crossing, which both rings share at x = 0 */
function topCrossing(tilt: number) {
  const t = Math.atan2(RX * Math.cos(rad(tilt)), RY * Math.sin(rad(tilt)))
  return Math.sin(t) * RY * Math.cos(rad(tilt)) + Math.cos(t) * RX * Math.sin(rad(tilt)) < 0 ? t : t + Math.PI
}

const arc = (tilt: number, t: number, large = 0) =>
  `A${RX} ${RY} ${tilt} ${large} 1 ${ringPoint(tilt, t)}`

/** One clockwise lap of a ring from the top crossing back to it */
function lap(tilt: number) {
  const t = topCrossing(tilt)
  return `${arc(tilt, t + Math.PI)}${arc(tilt, t)}`
}

const INK_RING = `M${ringPoint(-TILT, topCrossing(-TILT))}${lap(-TILT)}`
const GREY_RING = `M${ringPoint(TILT, topCrossing(TILT))}${lap(TILT)}`
// The dot's whole flight: a lap of the ink ring, across at the crossing, a lap of the grey ring, then
// on to the grey ring's far tip (t = 0), which is exactly where the dot rests in the finished mark.
const FLIGHT = `${INK_RING}${lap(TILT)}${arc(TILT, 0)}`

const MaskFrame = () => <rect x="-260" y="-180" width="520" height="360" fill="#fff" />

function RingMasks({ id }: { id: string }) {
  const area = { maskUnits: "userSpaceOnUse", x: -260, y: -180, width: 520, height: 360 } as const
  return (
    <>
      <mask id={`${id}i`} {...area}>
        <MaskFrame />
        <path d={CUT_INK} fill="#000" />
      </mask>
      <mask id={`${id}g`} {...area}>
        <MaskFrame />
        <path d={CUT_GREY} fill="#000" />
      </mask>
    </>
  )
}

const ringStyle = { fill: "none", strokeWidth: STROKE } as const

/** The finished mark. The rings, Z and dot take `currentColor`; the second ring stays grey. */
export function ZedOrbitMark({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  const id = React.useId()
  return (
    <svg viewBox={VIEW_BOX} className={className} aria-hidden="true" {...props}>
      <defs>
        <RingMasks id={id} />
      </defs>
      <g mask={`url(#${id}i)`}>
        <path d={INK_RING} stroke="currentColor" {...ringStyle} />
      </g>
      <g mask={`url(#${id}g)`}>
        <path d={GREY_RING} stroke={GREY} {...ringStyle} />
      </g>
      <polygon points={Z_POINTS} fill="currentColor" />
      <circle cx={DOT.x} cy={DOT.y} r={DOT.r} fill="currentColor" />
    </svg>
  )
}

/* All in ms from the start of the animation */
const DOT_IN = [120, 340] as const
const FLY = [260, 2900] as const
const WRITE_Z = [1500, 2720] as const
const PULSE = [2860, 3320] as const
const END = PULSE[1]

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const progress = (ms: number, [from, to]: readonly [number, number]) => clamp01((ms - from) / (to - from))
const easeInOut = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x)
const easeOut = (x: number) => 1 - (1 - x) ** 3

export interface ZedOrbitFormProps {
  className?: string
  /** Set `color` here to choose the ink; the second ring stays grey */
  style?: React.CSSProperties
  /** Called once, when the mark has fully formed */
  onComplete?: () => void
}

/**
 * The mark building itself out of nothing: a dot appears and flies a lap of each ring, drawing it as
 * it goes, the Z is written stroke by stroke while it flies, and the dot lands where it rests in the
 * logo. The server-rendered state is the empty first frame, so nothing flashes before hydration.
 */
export function ZedOrbitForm({ className, style, onComplete }: ZedOrbitFormProps) {
  const id = React.useId()
  const flight = React.useRef<SVGPathElement>(null)
  const inkRing = React.useRef<SVGPathElement>(null)
  const greyRing = React.useRef<SVGPathElement>(null)
  const zStroke = React.useRef<SVGPathElement>(null)
  const dot = React.useRef<SVGCircleElement>(null)
  const pulse = React.useRef<SVGCircleElement>(null)
  const done = React.useRef(onComplete)

  React.useLayoutEffect(() => {
    done.current = onComplete
  })

  React.useEffect(() => {
    const path = flight.current
    const ink = inkRing.current
    const grey = greyRing.current
    const z = zStroke.current
    const ball = dot.current
    const ring = pulse.current
    if (!path || !ink || !grey || !z || !ball || !ring) return

    const total = path.getTotalLength()
    const inkLap = ink.getTotalLength()
    const greyLap = grey.getTotalLength()

    const draw = (ms: number) => {
      const flown = easeInOut(progress(ms, FLY)) * total
      const at = path.getPointAtLength(flown)
      const grown = easeOut(progress(ms, DOT_IN))
      ball.setAttribute("cx", String(at.x))
      ball.setAttribute("cy", String(at.y))
      ball.setAttribute("r", String(DOT.r * grown))
      ball.style.opacity = String(grown)
      ink.style.strokeDashoffset = String(1 - clamp01(flown / inkLap))
      grey.style.strokeDashoffset = String(1 - clamp01((flown - inkLap) / greyLap))
      z.style.strokeDashoffset = String(1 - easeInOut(progress(ms, WRITE_Z)))
      const landed = progress(ms, PULSE)
      ring.setAttribute("r", String(DOT.r * (1 + 2.4 * easeOut(landed))))
      ring.style.opacity = landed > 0 && landed < 1 ? String(0.55 * (1 - landed)) : "0"
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(END)
      done.current?.()
      return
    }

    // Accumulated frame time rather than the clock: a background tab pauses the
    // animation instead of skipping it, so nobody comes back to a finished logo.
    let raf = 0
    let last = 0
    let elapsed = 0
    const tick = (now: number) => {
      elapsed += last ? Math.min(100, now - last) : 0
      last = now
      draw(elapsed)
      if (elapsed < END) raf = requestAnimationFrame(tick)
      else done.current?.()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const hidden = { strokeDasharray: "1 1", strokeDashoffset: 1 }

  return (
    <svg viewBox={VIEW_BOX} className={className} style={style} aria-hidden="true">
      <defs>
        <RingMasks id={id} />
        <mask id={`${id}z`} maskUnits="userSpaceOnUse" x="-260" y="-180" width="520" height="360">
          <path
            ref={zStroke}
            d="M-68 -43.1H48.2L-46.9 43H70"
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={46}
            strokeMiterlimit={20}
            style={hidden}
          />
        </mask>
      </defs>
      <path ref={flight} d={FLIGHT} fill="none" stroke="none" />
      <g mask={`url(#${id}i)`}>
        <path ref={inkRing} d={INK_RING} pathLength={1} stroke="currentColor" {...ringStyle} style={hidden} />
      </g>
      <g mask={`url(#${id}g)`}>
        <path ref={greyRing} d={GREY_RING} pathLength={1} stroke={GREY} {...ringStyle} style={hidden} />
      </g>
      <g mask={`url(#${id}z)`}>
        <polygon points={Z_POINTS} fill="currentColor" />
      </g>
      <circle ref={pulse} cx={DOT.x} cy={DOT.y} r={DOT.r} fill="none" stroke="currentColor" strokeWidth={2.5} style={{ opacity: 0 }} />
      <circle ref={dot} cx={DOT.x} cy={DOT.y} r={0} fill="currentColor" style={{ opacity: 0 }} />
    </svg>
  )
}
