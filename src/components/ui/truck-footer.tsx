"use client"

import * as React from "react"
import Link from "next/link"
import { Truck3D } from "@/components/ui/truck-3d"
import "./truck-footer.css"

/*
 * A closing section over a giant dim wordmark: signup, links and contact in three columns, and a
 * 3D delivery truck driving along the top of the letters. Its background is the page's own black,
 * so there's no edge where the footer starts.
 */

/* ------------------------------------------------------------------ *
 * Scrambled text
 * ------------------------------------------------------------------ */
const NOISE = "ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789{}[]/<>#%&*+="

/** Text that runs through random characters left to right; unsettled ones can take an accent colour. */
function useScramble(text: string, accent?: string) {
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

export type FooterLink = { label: string; href: string }

function ScrambleLink({ label, href }: FooterLink) {
  const { ref, run } = useScramble(label)
  return (
    <Link className="azf-nav-link" href={href} onPointerEnter={run} onFocus={run} aria-label={label}>
      {/* Reserves the width, so the column doesn't shift while the characters change. */}
      <span className="azf-measure" aria-hidden="true">
        <span className="azf-ghost">{label}</span>
        <span className="azf-live" ref={ref}>
          {label}
        </span>
      </span>
    </Link>
  )
}

function UnderlineLink({ label, href }: FooterLink) {
  const external = /^https?:/.test(href)
  return (
    <a className="azf-line-link" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
      <span className="azf-rule" aria-hidden="true">
        <i />
        <i />
      </span>
    </a>
  )
}

const Plus = () => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
)

type FormState = "idle" | "sending" | "done" | "failed"

function Signup({ title, note, onSubscribe }: { title: string; note: string; onSubscribe: (data: { name: string; email: string }) => Promise<boolean> }) {
  const [state, setState] = React.useState<FormState>("idle")
  const label = state === "sending" ? "Sending" : "Subscribe"
  const { ref, run } = useScramble(label, "#fd551d")

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (state === "sending") return
    const form = e.currentTarget
    const data = new FormData(form)
    // Filled in only by bots.
    if (data.get("website")) return
    setState("sending")
    let ok = false
    try {
      ok = await onSubscribe({ name: String(data.get("name") || "").trim(), email: String(data.get("email") || "").trim() })
    } catch {
      ok = false
    }
    setState(ok ? "done" : "failed")
    if (ok) form.reset()
  }

  return (
    <div>
      <p className="azf-title">{title}</p>
      {state === "done" ? (
        <p className="azf-done" role="status">
          You&apos;re on the list. Thank you.
        </p>
      ) : (
        <form className="azf-form" onSubmit={submit}>
          <input className="azf-input" type="text" name="name" placeholder="Name" aria-label="Name" autoComplete="name" required />
          <input className="azf-input" type="email" name="email" placeholder="Email" aria-label="Email" autoComplete="email" required />
          <input className="azf-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button className="azf-submit" type="submit" disabled={state === "sending"} onPointerEnter={run} onFocus={run}>
            <span className="azf-plus azf-plus-in">
              <Plus />
            </span>
            <span className="azf-submit-label">
              <span ref={ref}>{label}</span>
            </span>
            <span className="azf-plus azf-plus-out">
              <Plus />
            </span>
          </button>
          <p className="azf-note" role={state === "failed" ? "alert" : undefined}>
            {state === "failed" ? "That didn't go through. Please try again." : note}
          </p>
        </form>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Footer
 * ------------------------------------------------------------------ */
export interface TruckFooterProps {
  signupTitle: string
  signupNote: string
  onSubscribe: (data: { name: string; email: string }) => Promise<boolean>
  status: { label: string; href?: string }[]
  quickLinks: FooterLink[]
  contactLinks: FooterLink[]
  socials: FooterLink[]
  company: string
  tagline: string
  signature?: React.ReactNode
  /** The giant wordmark: the first part leans, the second stands up. */
  wordmark: [string, string]
  className?: string
}

export default function TruckFooter({
  signupTitle,
  signupNote,
  onSubscribe,
  status,
  quickLinks,
  contactLinks,
  socials,
  company,
  tagline,
  signature,
  wordmark,
  className = "",
}: TruckFooterProps) {
  const clip = React.useRef<HTMLDivElement>(null)
  const footer = React.useRef<HTMLElement>(null)

  // The footer comes out from under the page above, travelling slower than the scroll.
  React.useEffect(() => {
    const box = clip.current
    const el = footer.current
    if (!box || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const update = () => {
      raf = 0
      // How much of the footer is still below the fold, so it always lands at 0 at the page end.
      const rect = box.getBoundingClientRect()
      const below = Math.min(1, Math.max(0, (rect.bottom - window.innerHeight) / Math.max(1, rect.height)))
      const shift = -25 * below
      el.style.transform = `translate3d(0, ${shift}%, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div ref={clip} className={`azf-clip ${className}`}>
      <div className="azf-separator">
        <button
          type="button"
          className="azf-up"
          onClick={() => {
            const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            window.scrollTo({ top: 0, behavior: still ? "instant" : "smooth" })
          }}
        >
          Back to top ↑
        </button>
      </div>
      <footer ref={footer} className="azf">
        <div className="azf-layout">
          <div className="azf-grid">
            <div className="azf-col azf-col-left">
              <Signup title={signupTitle} note={signupNote} onSubscribe={onSubscribe} />
              <ul className="azf-status">
                {status.map((s) => (
                  <li key={s.label}>
                    <i aria-hidden="true" />
                    {s.href ? <Link href={s.href}>{s.label}</Link> : <span>{s.label}</span>}
                  </li>
                ))}
              </ul>
            </div>

            <div className="azf-col azf-col-mid">
              <nav aria-label="Quick links">
                <ul className="azf-nav">
                  {quickLinks.map((l) => (
                    <li key={l.href}>
                      <ScrambleLink {...l} />
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="azf-colophon">
                <p>
                  © {new Date().getFullYear()} {company}
                </p>
                <p>{tagline}</p>
                {signature && <div className="azf-signature">{signature}</div>}
              </div>
            </div>

            <div className="azf-col azf-col-right">
              <ul className="azf-lines">
                {contactLinks.map((l) => (
                  <li key={l.href}>
                    <UnderlineLink {...l} />
                  </li>
                ))}
              </ul>
              <nav aria-label="Social">
                <ul className="azf-lines">
                  {socials.map((l) => (
                    <li key={l.href}>
                      <UnderlineLink {...l} />
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="azf-word-wrap">
            <Truck3D className="azf-truck" />
            <div className="azf-word" aria-label={wordmark.join(" ")} role="img">
              <span className="azf-word-inner" aria-hidden="true">
                <span className="azf-lean">{wordmark[0]}</span> <span>{wordmark[1]}</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
