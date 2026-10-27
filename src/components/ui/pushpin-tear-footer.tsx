"use client"

import * as React from "react"
import Link from "next/link"
import { useReducedMotion } from "motion/react"
import { ArrowLeft, ArrowRight, Check, Copy, FileText, Globe, Link as LinkIcon, Mail, MessageCircle, ShieldCheck, Waves } from "lucide-react"
import "./pushpin-tear-footer.css"

export type Flap = { at: number; span: number; len: number; skew: number; dir: number; jag: number[] }
export type Tear = { ys: number[]; rim: number[]; lag: number[]; flaps: Flap[] }
export const RIDGE_N = 84
export const START = 1.06
export const FLAPS = 6
const clamp01 = (v: number) => Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0

export function rng(seed: number) {
  let a = (Number.isFinite(seed) ? Math.floor(seed) : 0) >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const XS = (() => {
  const r = rng(911)
  return Array.from({ length: RIDGE_N }, (_, i) => {
    const jitter = i > 0 && i < RIDGE_N - 1 ? (r() - 0.5) * (0.8 / RIDGE_N) : 0
    return -0.02 + i / (RIDGE_N - 1) * 1.04 + jitter
  })
})()

export function ridgeFloor(x: number) {
  const d = Math.abs(x - 0.5)
  return d < 0.13 ? 0.39 : d < 0.25 ? 0.43 : 0.5
}

export function makeTear(seed: number, n = RIDGE_N): Tear {
  const r = rng(seed)
  const ph = [r() * 6.283, r() * 6.283, r() * 6.283]
  const ys: number[] = [], rim: number[] = [], lag: number[] = []
  for (let i = 0; i < n; i++) {
    const x = XS[Math.min(i, XS.length - 1)]
    const d = Math.min(1, Math.abs(x - 0.5) * 2)
    const base = 0.43 + 0.3 * Math.pow(d, 1.35)
    const wander = (0.022 * Math.sin(x * 7 + ph[0]) + 0.016 * Math.sin(x * 13 + ph[1]) + 0.01 * Math.sin(x * 29 + ph[2])) * (0.45 + 0.55 * d)
    const jag = (r() - 0.5) * 0.022 * (r() < 0.16 ? 2.3 : 1)
    ys.push(Math.min(0.8, Math.max(ridgeFloor(x), base + wander + jag)))
    rim.push(1.2 + r() * 3.6)
    lag.push(Math.min(0.48, d * 0.4 + 0.04 + 0.03 * Math.sin(x * 23 + ph[1]) + r() * 0.012))
  }
  const slots = [0.05, 0.19, 0.33, 0.67, 0.81, 0.95]
  const up = r() < 0.5 ? [2, 4] : [1, 3]
  const flaps = slots.map((slot, k) => {
    const x = slot + (r() - 0.5) * 0.05
    const span = 3 + Math.floor(r() * 5)
    const at = Math.max(0, Math.min(n - 1 - span, Math.round(x * (n - 1))))
    const dir = up.includes(k) ? -1 : 1
    const outer = k === 0 || k === slots.length - 1
    const len = dir < 0 ? 0.022 + r() * 0.022 : outer ? 0.085 + r() * 0.04 : 0.045 + r() * 0.05
    return { at, span, len, skew: (r() - 0.5) * 1.1, dir, jag: [r() - 0.5, r() - 0.5, r() - 0.5, r() - 0.5] }
  })
  return { ys, rim, lag, flaps }
}

export function easeTear(t: number) {
  const x = clamp01(t)
  return x === 0 || x === 1 ? x : 1 + 1.9 * Math.pow(x - 1, 3) + 0.9 * Math.pow(x - 1, 2)
}
const easeInOut = (t: number) => {
  const x = clamp01(t)
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}
export const introYs = (tear: Tear, t: number) => tear.ys.map((y, i) => START + (y - START) * easeTear((t - tear.lag[i]) / 0.5))
export const morphYs = (from: number[], to: Tear, t: number) => to.ys.map((y, i) => (from[i] ?? y) + (y - (from[i] ?? y)) * easeInOut((t - to.lag[i] * 0.6) / 0.6))
export const flapOpen = (tear: Tear, f: Flap, t: number) => easeTear((t - tear.lag[f.at] - 0.18) / 0.32)

export function flapPoly(ys: number[], f: Flap, W: number, H: number, open: number) {
  const b = Math.min(ys.length - 1, f.at + f.span)
  const top: number[][] = []
  for (let k = f.at; k <= b; k++) top.push([XS[k] * W, ys[k] * H])
  const A = top[0], B = top[top.length - 1]
  const L = f.len * H * Math.max(0, open)
  const tip = [(A[0] + B[0]) / 2 + f.skew * L, (A[1] + B[1]) / 2 + f.dir * L]
  const side = (P: number[], Q: number[], j0: number, j1: number) => {
    const dx = Q[0] - P[0], dy = Q[1] - P[1], len = Math.hypot(dx, dy) || 1
    return [
      [P[0] + dx / 3 - dy / len * j0 * 0.22 * L, P[1] + dy / 3 + dx / len * j0 * 0.22 * L],
      [P[0] + dx * 2 / 3 - dy / len * j1 * 0.22 * L, P[1] + dy * 2 / 3 + dx / len * j1 * 0.22 * L],
    ]
  }
  return [...top, ...side(B, tip, f.jag[0], f.jag[1]), tip, ...side(tip, A, f.jag[2], f.jag[3])]
}

const n1 = (v: number) => Math.round(v * 10) / 10
export const polyD = (pts: number[][]) => pts.length ? "M" + pts.map(p => n1(p[0]) + " " + n1(p[1])).join("L") + "Z" : ""
export function sheetD(ys: number[], W: number, H: number, off?: number[]) {
  let d = "M-20 -20L" + (W + 20) + " -20"
  for (let i = ys.length - 1; i >= 0; i--) d += "L" + n1(XS[i] * W) + " " + n1(ys[i] * H - (off ? off[i] : 0))
  return d + "Z"
}
export function mixHex(a: string, b: string, t: number) {
  const p = (h: string) => {
    const s = h.replace("#", "")
    const f = s.length === 3 ? s.split("").map(c => c + c).join("") : s.padEnd(6, "0").slice(0, 6)
    return [0, 2, 4].map(i => parseInt(f.slice(i, i + 2), 16) || 0)
  }
  const x = p(a), y = p(b), k = clamp01(t)
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join("")
}

export type IconName = "github" | "21st" | "x" | "ig" | "linkedin" | "dribbble" | "chat" | "globe" | "mail" | "link" | "shield" | "doc"
export type TearLink = { label: string; href?: string }
export type IconLink = TearLink & { icon: IconName }
export type FooterColumn = { title: string; links: TearLink[]; cta?: TearLink }
export type PushpinTearFooterProps = {
  brand?: string; name?: string; logo?: React.ReactNode; logoHref?: string; signature?: React.ReactNode
  socials?: IconLink[]; email?: string
  newsletter?: { label: string; placeholder?: string } | null
  tagline?: string; status?: TearLink | null; mark?: string
  timeZone?: string; timeLabel?: string; columns?: FooterColumn[]
  chat?: TearLink | null; sideLinks?: IconLink[]; copyright?: string
  credit?: string; handle?: TearLink; sheet?: string; paper?: string
  sheetInk?: string; paperInk?: string; seed?: number; height?: number | string
  fontSans?: string; onSubscribe?: (email: string) => void | Promise<void>
  onRepin?: (seed: number) => void; className?: string
}

function Icon({ name }: { name: IconName | "chevL" | "copy" | "squiggle" | "arrow" | "check" }) {
  const icons = { chevL: ArrowLeft, copy: Copy, squiggle: Waves, arrow: ArrowRight, check: Check, doc: FileText, chat: MessageCircle, globe: Globe, mail: Mail, link: LinkIcon, shield: ShieldCheck }
  if (name in icons) {
    const Component = icons[name as keyof typeof icons]
    return <Component className="tpf-ico" aria-hidden="true" strokeWidth={1.8} />
  }
  return <svg viewBox="0 0 24 24" className="tpf-ico" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {name === "ig" ? <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17.1" cy="6.9" r=".6" fill="currentColor" /></> : name === "x" ? <path d="M5 4.5h3.6l10.4 15H15.4zM18.6 4.5 13.4 10.4M5.4 19.5l5.4-6.2" /> : name === "linkedin" ? <><rect x="3.5" y="3.5" width="17" height="17" rx="3.5" /><path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6m0 2.5c0-3.5 5-3.5 5 0v3.5" /></> : <><circle cx="12" cy="12" r="8.5" /><path d="m8 9-3 3 3 3m8-6 3 3-3 3" /></>}
  </svg>
}

function Clock({ zone, label }: { zone: string; label: string }) {
  const [time, setTime] = React.useState("--:--")
  React.useEffect(() => {
    let format: Intl.DateTimeFormat
    try { format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: zone }) }
    catch { format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }) }
    const tick = () => setTime(format.format(new Date()))
    const initial = window.setTimeout(tick, 0)
    const interval = window.setInterval(tick, 10000)
    return () => { clearTimeout(initial); clearInterval(interval) }
  }, [zone])
  const [hours, minutes] = time.split(":")
  return <span className="tpf-clock">{label} {hours}<i>:</i>{minutes}</span>
}

function Pin({ base, id }: { base: string; id: string }) {
  const hi = mixHex(base, "#ffffff", 0.62), lo = mixHex(base, "#000000", 0.42), deep = mixHex(base, "#000000", 0.66)
  return <svg viewBox="0 0 100 200" className="tpf-pin-svg" aria-hidden="true">
    <defs>
      <linearGradient id={id + "s"} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor={lo} /><stop offset=".24" stopColor={base} /><stop offset=".4" stopColor={hi} /><stop offset=".58" stopColor={base} /><stop offset="1" stopColor={deep} /></linearGradient>
      <radialGradient id={id + "t"} cx=".38" cy=".3" r=".8"><stop offset="0" stopColor={hi} /><stop offset=".55" stopColor={base} /><stop offset="1" stopColor={lo} /></radialGradient>
      <linearGradient id={id + "n"} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#5b616b" /><stop offset=".4" stopColor="#f4f5f7" /><stop offset=".7" stopColor="#a3a9b2" /><stop offset="1" stopColor="#4a4f57" /></linearGradient>
      <filter id={id + "b"} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4" /></filter>
    </defs>
    <path d="M48.3 112h3.4l-.7 76-1 4-1-4z" fill={`url(#${id}n)`} />
    <ellipse cx="50" cy="191.5" rx="3.2" ry="1.1" fill="#0b1a33" opacity=".35" />
    <path d="M28 103v6.5a22 7 0 0 0 44 0V103z" fill={`url(#${id}s)`} />
    <ellipse cx="50" cy="103" rx="22" ry="7" fill={`url(#${id}t)`} />
    <path d="M41.5 38c1.6 16 4.6 26 3 36-1.8 10-13 19-14.6 29h40.2c-1.6-10-12.8-19-14.6-29-1.6-10 1.4-20 3-36z" fill={`url(#${id}s)`} />
    <path d="M16 22v14a34 13 0 0 0 68 0V22z" fill={`url(#${id}s)`} />
    <ellipse cx="50" cy="22" rx="34" ry="13" fill={`url(#${id}t)`} />
    <ellipse cx="50" cy="22" rx="33" ry="12.3" fill="none" stroke="#fff" strokeOpacity=".28" strokeWidth=".8" />
    <ellipse cx="37" cy="17.5" rx="12" ry="4" fill="#fff" opacity=".7" filter={`url(#${id}b)`} />
    <path d="M22 38c4 4.5 9.5 6.4 15 7" stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" strokeLinecap="round" filter={`url(#${id}b)`} />
    <path d="M45 50c.8 8 1.6 14 .8 22" stroke="#fff" strokeOpacity=".45" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
}

function A({ href, label, children, ...props }: { href?: string; label?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  if (!href || href === "#") return <span {...props}>{children}</span>
  if (href.startsWith("/")) return <Link href={href} aria-label={label} title={label} {...props}>{children}</Link>
  return <a href={href} aria-label={label} title={label} {...props} {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  { title: "Company", links: [{ label: "About Zed OS", href: "/about" }, { label: "Services", href: "/services" }, { label: "Products", href: "/products" }, { label: "Partner with us", href: "/partner" }], cta: { label: "explore.", href: "/services" } },
  { title: "Connect", links: [{ label: "Contact us", href: "/contact" }, { label: "Instagram", href: "https://www.instagram.com/zedostechnologies" }, { label: "LinkedIn", href: "https://www.linkedin.com/in/zedos-technologies-576bb3414" }, { label: "X", href: "https://x.com/zedostechnology" }], cta: { label: "let’s talk.", href: "/contact" } },
]

export default function PushpinTearFooter({
  brand = "zed os.", name = "Zed OS Technologies", logo, logoHref = "/", signature, socials = [],
  email = "Lennoxlewis.lenny@gmail.com", newsletter = null,
  tagline = "Supply Chain · Software · Systems", status = { label: "Let’s work together", href: "/contact" },
  mark = "Kisumu, Kenya", timeZone = "Africa/Nairobi", timeLabel = "EAT",
  columns = DEFAULT_COLUMNS, chat = { label: "say hello", href: "/contact" }, sideLinks = [],
  copyright = "© Zed OS Technologies Limited", credit = "", handle = { label: "+254 758 296 887", href: "tel:+254758296887" },
  sheet = "#000000", paper = "#f3f3f1", sheetInk = "#ffffff", paperInk = "#111111", seed = 7,
  height = "clamp(720px, 92svh, 1000px)", fontSans = "'Barlow', sans-serif", onSubscribe, onRepin, className = "",
}: PushpinTearFooterProps) {
  const uid = "tpf" + React.useId().replace(/[^a-zA-Z0-9]/g, "")
  const rootRef = React.useRef<HTMLElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const sheetRef = React.useRef<SVGPathElement>(null)
  const rimRef = React.useRef<SVGPathElement>(null)
  const grainRef = React.useRef<SVGImageElement>(null)
  const flapRefs = React.useRef<(SVGPathElement | null)[]>([])
  const gradRefs = React.useRef<(SVGLinearGradientElement | null)[]>([])
  const pinRef = React.useRef<HTMLButtonElement>(null)
  const repinRef = React.useRef<(() => void) | null>(null)
  const historyRef = React.useRef<{ tear: Tear; ys: number[]; seed: number } | null>(null)
  const still = useReducedMotion()
  const [address, setAddress] = React.useState("")
  const [subscription, setSubscription] = React.useState<"idle" | "sending" | "sent">("idle")
  const [toast, setToast] = React.useState("")
  const toastTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep animation state outside React renders; only active tears request frames.
  React.useEffect(() => {
    const el = rootRef.current, svg = svgRef.current, pin = pinRef.current
    if (!el || !svg || !pin) return
    const previous = historyRef.current
    const tearSeed = previous && previous.seed === seed ? previous.seed : seed
    let tear = makeTear(tearSeed), prev: Tear | null = previous?.tear ?? null
    let from = previous?.ys ?? [], ys = tear.ys.map(() => START)
    let mode: "wait" | "intro" | "morph" | "rest" = previous ? (still ? "rest" : "morph") : "wait"
    let W = 0, H = 0, raf = 0, t0 = performance.now(), dur = 1100, currentSeed = tearSeed
    let px = -1e4, py = -1e4, busy = false, started = !!previous
    const lift = new Array<number>(FLAPS).fill(0)
    const timers: number[] = []
    const later = (fn: () => void, delay: number) => { timers.push(window.setTimeout(fn, delay)) }

    function draw(now: number) {
      raf = 0
      if (!W || !H) return
      let active = false
      const open = new Array<number>(FLAPS).fill(1), old = new Array<number>(FLAPS).fill(0)
      if (mode === "wait") { ys = tear.ys.map(() => START); open.fill(0) }
      else if (mode === "intro") {
        const p = Math.min(1, (now - t0) / dur)
        ys = introYs(tear, p)
        tear.flaps.forEach((f, k) => { open[k] = flapOpen(tear, f, p) })
        if (p >= 1) mode = "rest"
        else active = true
      } else if (mode === "morph") {
        const p = Math.min(1, (now - t0) / dur)
        ys = morphYs(from, tear, p)
        open.fill(easeTear((p - 0.5) / 0.5)); old.fill(1 - easeInOut(p / 0.35))
        if (p >= 1) mode = "rest"
        else active = true
      } else ys = tear.ys
      tear.flaps.forEach((f, k) => {
        const b = Math.min(ys.length - 1, f.at + f.span)
        const target = still ? 0 : clamp01(1 - Math.hypot(px - (XS[f.at] + XS[b]) / 2 * W, py - (ys[f.at] + ys[b]) / 2 * H) / (0.2 * Math.max(W, 520)))
        lift[k] += (target - lift[k]) * 0.14
        if (Math.abs(target - lift[k]) > 0.003) active = true
        open[k] *= 1 + 0.32 * lift[k]
      })
      sheetRef.current?.setAttribute("d", sheetD(ys, W, H, tear.rim))
      rimRef.current?.setAttribute("d", sheetD(ys, W, H))
      const flap = (k: number, f: Flap | undefined, o: number) => {
        const path = flapRefs.current[k], gradient = gradRefs.current[k]
        if (!path || !gradient) return
        if (!f || o < 0.01) { path.setAttribute("d", ""); return }
        const pts = flapPoly(ys, f, W, H, o), b = Math.min(ys.length - 1, f.at + f.span), tip = pts[f.span + 3]
        path.setAttribute("d", polyD(pts))
        gradient.setAttribute("x1", String((XS[f.at] + XS[b]) / 2 * W))
        gradient.setAttribute("y1", String((ys[f.at] + ys[b]) / 2 * H))
        gradient.setAttribute("x2", String(tip[0])); gradient.setAttribute("y2", String(tip[1]))
      }
      for (let k = 0; k < FLAPS; k++) { flap(k, tear.flaps[k], open[k]); flap(FLAPS + k, prev?.flaps[k], old[k]) }
      if (mode !== "wait") historyRef.current = { tear, ys, seed: currentSeed }
      if (active) raf = requestAnimationFrame(draw)
    }
    function kick() { if (!raf) raf = requestAnimationFrame(draw) }
    function resize() {
      W = el!.clientWidth; H = el!.clientHeight
      svg!.setAttribute("width", String(W)); svg!.setAttribute("height", String(H)); svg!.setAttribute("viewBox", `0 0 ${W} ${H}`)
      kick()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el); resize()
    function start() {
      if (started) return
      started = true
      el!.classList.add("s1")
      if (still) { el!.classList.add("s2", "s3"); mode = "rest"; kick(); return }
      later(() => el!.classList.add("s2"), 640)
      later(() => {
        el!.classList.add("s3", "is-hit")
        mode = "intro"; t0 = performance.now(); dur = 1550; kick()
      }, 1140)
      later(() => el!.classList.remove("is-hit"), 1480)
    }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) start() }, { threshold: 0.1 })
    observer.observe(el)
    if (previous) { el.classList.add("s1", "s2", "s3"); kick() }
    function pointerMove(e: PointerEvent) {
      if (still || e.pointerType === "touch") return
      const rect = el!.getBoundingClientRect()
      px = e.clientX - rect.left; py = e.clientY - rect.top
      pin!.style.setProperty("--tilt", `${Math.max(-9, Math.min(9, (px / rect.width - 0.5) * 18))}deg`)
      kick()
    }
    function pointerLeave() { px = py = -1e4; pin!.style.setProperty("--tilt", "0deg"); kick() }
    el.addEventListener("pointermove", pointerMove); el.addEventListener("pointerleave", pointerLeave)
    repinRef.current = () => {
      if (busy || mode !== "rest") return
      const next = currentSeed + 1
      const swap = () => { currentSeed = next; prev = tear; from = ys; tear = makeTear(next) }
      if (still) { swap(); prev = null; mode = "rest"; kick(); onRepin?.(next); return }
      busy = true; pin.dataset.pin = "lift"
      later(() => { swap(); mode = "morph"; t0 = performance.now(); dur = 1150; kick() }, 300)
      later(() => { pin.dataset.pin = "stab" }, 1280)
      later(() => { pin.dataset.pin = "idle"; busy = false; onRepin?.(next) }, 1720)
    }
    return () => {
      ro.disconnect(); observer.disconnect(); cancelAnimationFrame(raf)
      timers.forEach(clearTimeout)
      el.removeEventListener("pointermove", pointerMove); el.removeEventListener("pointerleave", pointerLeave)
      repinRef.current = null
    }
  }, [seed, still, onRepin])

  React.useEffect(() => {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 160
    const context = canvas.getContext("2d")
    if (!context) return
    const img = context.createImageData(160, 160), r = rng(42)
    for (let i = 0; i < img.data.length; i += 4) {
      img.data[i] = img.data[i + 1] = img.data[i + 2] = r() < 0.5 ? 0 : 255
      img.data[i + 3] = Math.floor(r() * 46)
    }
    context.putImageData(img, 0, 0)
    grainRef.current?.setAttribute("href", canvas.toDataURL())
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current) }
  }, [])

  const flash = (message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(""), 2500)
  }
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(email); flash("Email copied") }
    catch { flash(email) }
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!onSubscribe || subscription !== "idle") return
    setSubscription("sending")
    try { await onSubscribe(address.trim()); setSubscription("sent") }
    catch { setSubscription("idle"); flash("Please try again") }
  }
  const flapBase = mixHex(paper, "#ffffff", 0.35)
  const vars = {
    height: typeof height === "number" ? `${height}px` : height,
    "--tpf-sheet": sheet, "--tpf-paper": paper, "--tpf-on-sheet": sheetInk,
    "--tpf-on-paper": paperInk, "--tpf-rim": mixHex(flapBase, "#ffffff", 0.6), "--tpf-sans": fontSans,
  } as React.CSSProperties
  const H = (i: number) => ({ "--i": i }) as React.CSSProperties
  const mailto = "mailto:" + email

  return <footer ref={rootRef} className={`tpf ${className}`} style={vars}>
    <svg ref={svgRef} className="tpf-stage" aria-hidden="true">
      <defs>
        <radialGradient id={uid + "v"} cx=".5" cy=".78" r=".75"><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#0d1c38" stopOpacity=".07" /></radialGradient>
        <linearGradient id={uid + "l"} x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".04" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#001033" stopOpacity=".12" /></linearGradient>
        <pattern id={uid + "g"} width="160" height="160" patternUnits="userSpaceOnUse"><image ref={grainRef} width="160" height="160" /></pattern>
        <filter id={uid + "d"} x="-5%" y="-5%" width="110%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#0a1a3a" floodOpacity=".3" /></filter>
        <filter id={uid + "f"} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="-2" dy="4" stdDeviation="4" floodColor="#0a1a3a" floodOpacity=".26" /></filter>
        {Array.from({ length: FLAPS * 2 }, (_, k) => <linearGradient key={k} id={`${uid}fg${k}`} ref={el => { gradRefs.current[k] = el }} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={mixHex(flapBase, "#1c2a44", 0.34)} /><stop offset=".5" stopColor={mixHex(flapBase, "#1c2a44", 0.08)} /><stop offset="1" stopColor="#ffffff" />
        </linearGradient>)}
        <path id={uid + "s"} ref={sheetRef} />
      </defs>
      <rect className="tpf-paper" width="100%" height="100%" />
      <rect width="100%" height="100%" fill={`url(#${uid}v)`} style={{ mixBlendMode: "multiply" }} />
      <rect width="100%" height="100%" fill={`url(#${uid}g)`} opacity=".32" />
      <g className="tpf-sheet-g" filter={`url(#${uid}d)`}><path ref={rimRef} className="tpf-rim" /><use href={`#${uid}s`} className="tpf-sheet" /></g>
      <use href={`#${uid}s`} fill={`url(#${uid}l)`} />
      <use href={`#${uid}s`} fill={`url(#${uid}g)`} opacity=".5" />
      <g filter={`url(#${uid}f)`}>{Array.from({ length: FLAPS * 2 }, (_, k) => <path key={k} ref={el => { flapRefs.current[k] = el }} fill={`url(#${uid}fg${k})`} />)}</g>
    </svg>
    <div className="tpf-z tpf-top">
      <div className="tpf-row tpf-h" style={H(0)}>
        <button type="button" className="tpf-ib tpf-up" onClick={() => window.scrollTo({ top: 0, behavior: still ? "instant" : "smooth" })} aria-label="Back to top" title="Back to top"><Icon name="chevL" /></button>
        <span className="tpf-spacer" />
        {socials.map(l => <A key={l.label} href={l.href} className="tpf-ib" label={l.label}><Icon name={l.icon} /></A>)}
      </div>
      <A href={logoHref} className="tpf-logo tpf-h" label={name + ", home"} style={H(1)}>{logo ?? <span className="tpf-monogram">Z.</span>}</A>
      <div className="tpf-mail-wrap tpf-h" style={H(2)}>
        <button type="button" className="tpf-mail" onClick={copyEmail} aria-label={"Copy " + email} title="Copy email"><span>{email}</span><Icon name="copy" /></button>
        <span className={"tpf-toast" + (toast ? " on" : "")} role="status" aria-live="polite">{toast}</span>
      </div>
    </div>
    {newsletter && onSubscribe ? <form className="tpf-z tpf-news tpf-h" style={H(3)} onSubmit={submit}>
      <label htmlFor={uid + "e"}>{newsletter.label}</label>
      <div className="tpf-pill" data-sent={subscription === "sent"}>
        <input id={uid + "e"} type="email" required placeholder={newsletter.placeholder ?? "you@company.com"} autoComplete="email" value={address} disabled={subscription !== "idle"} onChange={e => setAddress(e.target.value)} />
        <span className="tpf-sent" aria-live="polite">{subscription === "sent" ? <><Icon name="check" /> You&apos;re on the list</> : null}</span>
        <button type="submit" className="tpf-knob" aria-label={subscription === "sending" ? "Subscribing" : "Subscribe"} disabled={subscription !== "idle"}><Icon name={subscription === "sent" ? "check" : "arrow"} /></button>
      </div>
    </form> : <div className="tpf-z tpf-news tpf-tagline tpf-h" style={H(3)}><p>{tagline}</p><span>Reliable solutions. Lasting partnerships.</span></div>}
    {mark && <span className="tpf-z tpf-flank tpf-h" style={{ ...H(4), left: "24%" }}>{mark}</span>}
    {timeZone && <span className="tpf-z tpf-flank tpf-h" style={{ ...H(4), left: "76%" }} title={"Local time · " + timeZone}><Clock zone={timeZone} label={timeLabel} /></span>}
    {status && <A href={status.href ?? mailto} className="tpf-z tpf-status tpf-h" style={H(5)}><i className="tpf-live" aria-hidden="true" /><span>{status.label}</span></A>}
    {columns.slice(0, 2).map((c, i) => <nav key={c.title} className={`tpf-z tpf-col tpf-h ${i ? "r" : "l"}`} style={H(6 + i)} aria-label={c.title}>
      <h3>{c.title}<Icon name="squiggle" /></h3>
      <ul>{c.links.map(l => <li key={l.label}><A href={l.href}>{l.label}</A></li>)}</ul>
      {c.cta && <A href={c.cta.href} className="tpf-big">{c.cta.label}</A>}
    </nav>)}
    <button ref={pinRef} type="button" className="tpf-pin" onClick={() => repinRef.current?.()} aria-label="Re-pin: tear a new edge" title="Pull the pin">
      <span className="tpf-shadow" aria-hidden="true" /><span className="tpf-tilt"><span className="tpf-drop"><span className="tpf-body"><Pin base={sheet === "#000000" ? "#444444" : sheet} id={uid + "p"} /></span></span></span>
    </button>
    <div className="tpf-z tpf-brand tpf-ink">
      <div className="tpf-brand-top tpf-p" style={H(0)}><span className="tpf-eye">{name}</span>
        {chat && <A href={chat.href ?? mailto} className="tpf-bub" label={chat.label}><span className="tpf-dots" aria-hidden="true"><i /><i /><i /></span><b>{chat.label}</b></A>}
      </div>
      <A href={logoHref} className="tpf-word" label={name}><span>{brand}</span></A>
      {signature && <div className="tpf-signature tpf-p" style={H(2)}>{signature}</div>}
    </div>
    {sideLinks.slice(0, 2).map((l, i) => <A key={l.label} href={l.href} className={`tpf-z tpf-side tpf-ink tpf-p ${i ? "r" : "l"}`} label={l.label} style={{ ...H(1 + i), left: i ? "80%" : "20%" }}><span>{l.label}</span><Icon name={l.icon} /></A>)}
    <div className="tpf-z tpf-foot tpf-ink"><span className="tpf-p" style={H(3)}>{copyright}</span>{credit && <span className="tpf-credit tpf-p" style={H(4)}>{credit}</span>}<A href={handle.href} className="tpf-handle tpf-p" style={H(5)}>{handle.label}</A></div>
  </footer>
}
