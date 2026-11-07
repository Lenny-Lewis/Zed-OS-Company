"use client"

import * as React from "react"
import gsap from "gsap"

/*
 * The developer's signature, written out by a pen when it comes on screen. The image stays exactly
 * as signed: a mask with the signature's traced centre lines uncovers it in writing order, while the
 * pen's tip follows the same lines. Then the pen moves aside and settles beside it.
 */

const IMAGE = "/Signatures/signature_L_white_640.png"
const WIDTH = 1278
const HEIGHT = 784
// Flat x,y lists in image coordinates. The long stroke first, then the humps and the tail.
const STROKES = [
  [300,264,308,262,322,244,327,218,322,195,313,180,303,169,285,161,256,161,233,167,219,176,214,177,180,208,162,239,155,269,155,290,161,314,167,325,175,336,197,356,218,368,226,370,234,375,244,376,253,381,274,382,284,385,328,385,339,382,362,380,377,375,387,374,419,362,424,358,453,345,485,323,508,317,513,308,516,288,525,268,523,259,525,235,529,223,529,210,534,196,535,183,541,164,548,124,564,66,575,39,585,24,590,22,597,24,603,33,605,62,603,109,598,129,597,143,586,183,575,208,569,217,568,224,558,239,555,247,546,258,526,266,523,270,515,291,513,308,508,317,508,346,505,358,503,386,511,396,511,399,510,406,497,417,496,446,492,460,491,488,488,505,486,507,483,560,479,589,476,654,473,674,473,700,472,705,466,711,466,725,469,735,469,763,469,735,466,725,466,712,448,700,442,674,437,666,436,658,432,651,429,639,425,634,424,628,404,588,386,561,373,546,369,534,372,531,369,533,354,533,349,522,338,512,303,492,271,482,236,478,219,478,158,487,131,496,82,517,41,543,29,555,22,567,23,580,31,586,45,591,92,591,122,585,135,585,155,579,171,579,187,573,197,573,214,567,226,567,237,562,251,561,261,556,275,555,285,550,299,549,309,544,326,542,333,538,347,537,353,532,369,533,381,526,392,525,450,507,457,507,470,503,480,503,486,507,488,505,491,489,494,491,522,489,562,476,579,473,612,462,643,455,651,451,662,450,670,445,681,444,690,439,701,438],
  [542,352,530,380,525,420,530,452,541,464,553,455,565,425,572,395,576,360,580,347,585,360,583,395,583,425,592,434,605,425,615,395,622,360,627,337,633,350,633,385,640,405,650,395,655,365,660,335,664,326,670,340,670,385,678,403,688,395,692,365,696,335,701,320,706,335,706,352,718,362,734,363,758,357,775,356,790,351,798,351,844,340,884,333,896,328,912,327,947,317,968,314,999,305,1012,304,1038,296,1063,292,1072,288,1106,282,1147,271,1166,269,1182,264],
]
const DOT = { x: 1259, y: 244 }
const MASK_WIDTH = 38

// Seconds. The brisk parts of a signature are the long sweeps, so time follows the stroke.
const ENTER = 0.5
const WRITE = [1.9, 1]
const LIFT = 0.18
const DAB = 0.12
const TO_REST = 0.75

const WRITING_ANGLE = 34
/** Where the pen ends up: tip just past the signature's right edge, leaning back */
const REST = { x: 1330, y: 640, angle: 62 }

interface Point {
  x: number
  y: number
}

function toPoints(flat: number[]) {
  const points: (Point & { at: number })[] = []
  let at = 0
  for (let i = 0; i < flat.length; i += 2) {
    const point = { x: flat[i], y: flat[i + 1] }
    if (i) at += Math.hypot(point.x - flat[i - 2], point.y - flat[i - 1])
    points.push({ ...point, at })
  }
  return { points, length: at }
}

function pointAlong({ points, length }: ReturnType<typeof toPoints>, progress: number): Point {
  const at = progress * length
  let low = 0
  let high = points.length - 1
  while (high - low > 1) {
    const mid = (low + high) >> 1
    if (points[mid].at <= at) low = mid
    else high = mid
  }
  const a = points[low]
  const b = points[high]
  const t = b.at > a.at ? Math.min(1, (at - a.at) / (b.at - a.at)) : 0
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}

const flatPath = (flat: number[]) => {
  let d = ""
  for (let i = 0; i < flat.length; i += 2) d += (i ? "L" : "M") + flat[i] + " " + flat[i + 1]
  return d
}

function Pen() {
  // The tip is at 0,0 with the barrel running straight up from it.
  return (
    <svg viewBox="-10 -96 20 98" width="100%" height="100%" style={{ display: "block", overflow: "visible" }} aria-hidden="true">
      <defs>
        <linearGradient id="pen-barrel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8f8b83" />
          <stop offset="0.38" stopColor="#f4f0e7" />
          <stop offset="1" stopColor="#6e6a63" />
        </linearGradient>
        <linearGradient id="pen-grip" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#141414" />
          <stop offset="0.4" stopColor="#4a4a4a" />
          <stop offset="1" stopColor="#0c0c0c" />
        </linearGradient>
      </defs>
      {/* Nib */}
      <path d="M0 0 C-1.2 -3.6 -4 -7.4 -3.9 -14 L3.9 -14 C4 -7.4 1.2 -3.6 0 0Z" fill="#e9e4da" />
      <path d="M0 0 L0 -8.6" stroke="#0a0a0a" strokeWidth="0.45" />
      <circle cx="0" cy="-9" r="0.85" fill="#0a0a0a" />
      {/* Grip */}
      <path d="M-4 -14 L-5.2 -27 L5.2 -27 L4 -14Z" fill="url(#pen-grip)" />
      <rect x="-5.6" y="-29" width="11.2" height="2.6" rx="0.5" fill="#fd551d" />
      {/* Barrel */}
      <path d="M-5.6 -29 L-5.9 -84 C-5.9 -91 -3 -95 0 -95 C3 -95 5.9 -91 5.9 -84 L5.6 -29Z" fill="url(#pen-barrel)" />
      <rect x="-5.85" y="-74" width="11.7" height="1.6" fill="#fd551d" />
    </svg>
  )
}

export function PenSignature({ href, label, title }: { href: string; label: string; title: string }) {
  const root = React.useRef<HTMLDivElement>(null)
  const pen = React.useRef<HTMLDivElement>(null)
  const inks = React.useRef<(SVGPathElement | null)[]>([])
  const dot = React.useRef<SVGCircleElement>(null)
  const signature = React.useRef<SVGImageElement>(null)
  const id = React.useId()

  // Runs before paint, so a signature that's going to be written never flashes up finished.
  React.useLayoutEffect(() => {
    const box = root.current
    const el = pen.current
    const image = signature.current
    if (!box || !el || !image) return

    const place = (x: number, y: number, angle: number) => {
      el.style.left = (x / WIDTH) * 100 + "%"
      el.style.top = (y / HEIGHT) * 100 + "%"
      el.style.transform = `rotate(${angle}deg)`
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      image.removeAttribute("mask")
      place(REST.x, REST.y, REST.angle)
      el.style.opacity = "1"
      return
    }

    const inked = inks.current
    inked.forEach((path) => path?.setAttribute("stroke-dashoffset", "1"))
    dot.current?.setAttribute("r", "0")
    el.style.opacity = "0"

    const strokes = STROKES.map(toPoints)
    const first = pointAlong(strokes[0], 0)
    const tl = gsap.timeline({ paused: true, onComplete: () => image.removeAttribute("mask") })
    const at = { x: first.x + 170, y: first.y - 170, angle: WRITING_ANGLE + 16 }
    const sync = () => place(at.x, at.y, at.angle)

    tl.set(el, { opacity: 0 })
    tl.to(el, { opacity: 1, duration: ENTER * 0.6, ease: "power1.out" }, 0)
    tl.to(at, { x: first.x, y: first.y, angle: WRITING_ANGLE, duration: ENTER, ease: "power2.out", onUpdate: sync }, 0)

    strokes.forEach((stroke, index) => {
      if (index) {
        const start = pointAlong(stroke, 0)
        tl.to(at, { x: start.x, y: start.y, duration: LIFT, ease: "power1.inOut", onUpdate: sync })
      }
      const progress = { value: 0 }
      tl.to(progress, {
        value: 1,
        duration: WRITE[index],
        ease: "sine.inOut",
        onUpdate: () => {
          const point = pointAlong(stroke, progress.value)
          inked[index]?.setAttribute("stroke-dashoffset", String(1 - progress.value))
          at.x = point.x
          at.y = point.y
          // A wrist doesn't hold still: the pen leans a little as it travels.
          at.angle = WRITING_ANGLE + Math.sin(progress.value * stroke.length * 0.012) * 4
          sync()
        },
      })
    })

    // The dot: over, down, up
    tl.to(at, { x: DOT.x, y: DOT.y - 34, angle: WRITING_ANGLE, duration: LIFT, ease: "power1.inOut", onUpdate: sync })
    tl.to(at, { y: DOT.y, duration: DAB, ease: "power2.in", onUpdate: sync })
    tl.call(() => dot.current?.setAttribute("r", "26"))
    tl.to(at, { y: DOT.y - 46, duration: DAB, ease: "power2.out", onUpdate: sync })

    // Aside, then a small settle
    tl.to(at, { x: REST.x, y: REST.y, duration: TO_REST, ease: "power3.inOut", onUpdate: sync })
    tl.to(at, { angle: REST.angle, duration: TO_REST + 0.55, ease: "elastic.out(1, 0.55)", onUpdate: sync }, `-=${TO_REST * 0.45}`)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        tl.play()
      },
      { threshold: 0.6 },
    )
    io.observe(box)

    return () => {
      io.disconnect()
      tl.kill()
    }
  }, [])

  return (
    <div ref={root} style={{ position: "relative", width: "100%", aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={title}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width="100%" height="100%" style={{ display: "block" }} aria-hidden="true">
          <defs>
            <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={WIDTH} height={HEIGHT}>
              {STROKES.map((flat, i) => (
                <path
                  key={i}
                  ref={(node) => {
                    inks.current[i] = node
                  }}
                  d={flatPath(flat)}
                  pathLength={1}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={MASK_WIDTH}
                  strokeLinejoin="round"
                  strokeDasharray="1 1"
                  strokeDashoffset={0}
                />
              ))}
              <circle ref={dot} cx={DOT.x} cy={DOT.y} r={26} fill="#fff" />
            </mask>
          </defs>
          <image ref={signature} href={IMAGE} width={WIDTH} height={HEIGHT} mask={`url(#${id})`} />
        </svg>
      </a>
      <div
        ref={pen}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "13px",
          height: "64px",
          // The pivot and anchor are the nib's tip, so left/top are exactly where it touches.
          marginLeft: "-6.5px",
          marginTop: "-63px",
          transformOrigin: "50% 98.5%",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <Pen />
      </div>
    </div>
  )
}

export default PenSignature
