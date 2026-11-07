"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { images } from "@/data/images"
import { ZedOrbitForm, ZedOrbitMark } from "@/components/ui/zed-orbit-mark"
import "./curtain-navigation.css"

/*
 * Header with a full-screen menu that drops down behind a curved edge. Each link owns a photo: the
 * photos sit muted until their link is hovered, and the two columns drift apart with the pointer.
 * Everything is one timeline, so closing is simply the opening played backwards, faster.
 */

const LINKS = [
  { label: "Home", href: "/", image: images.menu.home },
  { label: "About", href: "/about", image: images.menu.about },
  { label: "Products", href: "/products", image: images.menu.products },
  { label: "Services", href: "/services", image: images.menu.services },
  { label: "Partner", href: "/partner", image: images.menu.partner },
  { label: "Contact", href: "/contact", image: images.menu.contact },
]

// Indexes into LINKS.
const COLUMNS = [
  [0, 2, 4],
  [1, 3, 5],
]

const EXTRAS = [
  { label: "Instagram", href: "https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/zedos-technologies-576bb3414" },
  { label: "X", href: "https://x.com/zedostechnology" },
  { label: "WhatsApp", href: "https://wa.me/254758296887" },
]

const CLIP_CLOSED_PANEL = "ellipse(120% 0% at 50% 0%)"
const CLIP_CLOSED_LINK = "ellipse(30% 0% at 50% 0%)"
const CLIP_OPEN = "ellipse(120% 100% at 50% 20%)"
const PARALLAX_REM = 6
const CLOSE_SPEED = 1.5
// Resting opacity of the full-colour photo for the page you're on
const CURRENT_TOP_OPACITY = 0.5

const isCurrent = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/")

function Highlight({ href, children }: { href: string; children: string }) {
  return (
    <a className="cn-extra" href={href} {...(/^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      <span className="cn-extra-text">{children}</span>
      <i className="cn-extra-cover" aria-hidden="true" />
    </a>
  )
}

export function CurtainNavigation() {
  const pathname = usePathname()
  const root = React.useRef<HTMLDivElement>(null)
  const panel = React.useRef<HTMLDivElement>(null)
  const timeline = React.useRef<gsap.core.Timeline | null>(null)
  const hoverIndex = React.useRef(-1)
  const leaveTimer = React.useRef(0)
  const reduced = React.useRef(false)

  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  // Photos are fetched once someone reaches for the menu, not on every page view.
  const [warm, setWarm] = React.useState(false)
  // Restarts the forming emblem on every open.
  const [opens, setOpens] = React.useState(0)

  // Navigating by any route (back button included) closes the menu.
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setIsOpen(false)
  }

  const currentIndex = LINKS.findIndex((l) => isCurrent(pathname, l.href))

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // The whole open sequence
  React.useEffect(() => {
    const el = panel.current
    if (!el) return
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      const tiles = Array.from(el.querySelectorAll<HTMLElement>(".cn-tile")).sort(
        (a, b) => Number(a.dataset.index) - Number(b.dataset.index),
      )
      const links = el.querySelectorAll(".cn-link")
      const strikes = el.querySelectorAll(".cn-strike path")
      const extras = el.querySelectorAll(".cn-extra")
      const covers = el.querySelectorAll(".cn-extra-cover")
      const bg = el.querySelector(".cn-bg")
      const emblem = el.querySelector(".cn-emblem")

      gsap.set(el, { clipPath: CLIP_CLOSED_PANEL })
      gsap.set(tiles, { clipPath: CLIP_CLOSED_PANEL, y: 25 })
      gsap.set(links, { clipPath: CLIP_CLOSED_LINK, y: 20 })
      gsap.set(strikes, { strokeDasharray: 1, strokeDashoffset: 1 })
      gsap.set(bg, { autoAlpha: 0 })
      gsap.set(emblem, { autoAlpha: 0 })
      gsap.set(extras, { clipPath: "inset(0 100% 0 0)", y: 15 })
      gsap.set(covers, { scaleX: 1 })

      timeline.current = gsap
        .timeline({
          paused: true,
          onReverseComplete: () => {
            gsap.set(el, { display: "none" })
            gsap.set(el.querySelectorAll(".cn-col"), { y: 0 })
          },
        })
        .to(el, { clipPath: CLIP_OPEN, duration: 0.8, ease: "power3.out" }, 0)
        .to(tiles, { clipPath: CLIP_OPEN, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 0.15)
        .to(links, { clipPath: CLIP_OPEN, y: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.2)" }, 0.35)
        .to(strikes, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.4)
        .to(extras, { clipPath: "inset(0 0% 0 0)", y: 0, duration: 0.7, stagger: 0.04, ease: "back.out(1.1)" }, 0.5)
        .to(bg, { autoAlpha: 0.07, duration: 0.6 }, 0.6)
        .to(emblem, { autoAlpha: 1, duration: 0.4 }, 0.6)
        .to(covers, { scaleX: 0, duration: 0.6, stagger: 0.05, ease: "power2.inOut" }, 0.7)
    }, el)

    return () => {
      ctx.revert()
      timeline.current = null
    }
  }, [])

  // Play it, and hold everything behind still while it's up
  const wasOpen = React.useRef(false)
  React.useEffect(() => {
    const tl = timeline.current
    const el = panel.current
    if (!tl || !el || wasOpen.current === isOpen) return
    wasOpen.current = isOpen

    const html = document.documentElement
    // Tells the heavy 3D canvases to idle, and hides the header's glass.
    if (isOpen) html.setAttribute("data-menu-open", "")
    else html.removeAttribute("data-menu-open")

    if (isOpen) {
      gsap.set(el, { display: "grid" })
      tl.timeScale(reduced.current ? 50 : 1).play()
    } else {
      tl.timeScale(reduced.current ? 50 : CLOSE_SPEED).reverse()
    }
  }, [isOpen])

  // Scroll lock, keeping the page from shifting sideways when the scrollbar goes
  React.useEffect(() => {
    if (!isOpen) return
    const { body } = document
    const gutter = window.innerWidth - document.documentElement.clientWidth
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    body.style.overflow = "hidden"
    if (gutter > 0) body.style.paddingRight = gutter + "px"
    return () => {
      body.style.overflow = previous.overflow
      body.style.paddingRight = previous.paddingRight
    }
  }, [isOpen])

  // Escape closes, and the photo columns drift apart with the pointer
  React.useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    const cols = panel.current?.querySelectorAll(".cn-col")
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !cols || cols.length < 2 || reduced.current) return
      const shift = (e.clientY / window.innerHeight - 0.5) * 2 * PARALLAX_REM * rem
      gsap.to(cols[0], { y: -shift, duration: 2, ease: "power2.out", overwrite: "auto" })
      gsap.to(cols[1], { y: shift, duration: 2, ease: "power2.out", overwrite: "auto" })
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointermove", onMove)
    }
  }, [isOpen])

  const restTops = React.useCallback(() => {
    panel.current?.querySelectorAll<HTMLElement>(".cn-tile").forEach((tile) => {
      const top = tile.querySelector(".cn-top")
      if (!top) return
      const rest = Number(tile.dataset.index) === currentIndex ? CURRENT_TOP_OPACITY : 0
      gsap.to(top, { opacity: rest, duration: 0.2, ease: "power2.inOut", overwrite: "auto" })
    })
  }, [currentIndex])

  // The current page's photo rests half lit; photos can arrive after this first runs.
  React.useEffect(() => {
    panel.current?.querySelectorAll<HTMLElement>(".cn-tile").forEach((tile) => {
      const top = tile.querySelector(".cn-top")
      if (top) gsap.set(top, { opacity: Number(tile.dataset.index) === currentIndex ? CURRENT_TOP_OPACITY : 0 })
    })
  }, [currentIndex, warm])

  const onLinkEnter = (e: React.PointerEvent<HTMLAnchorElement>, index: number) => {
    if (e.pointerType !== "mouse") return
    window.clearTimeout(leaveTimer.current)
    hoverIndex.current = index
    if (!reduced.current) {
      gsap.to(e.currentTarget.querySelectorAll(".cn-char"), { yPercent: -100, duration: 0.6, stagger: 0.02, ease: "power3.out", overwrite: true })
    }
    panel.current?.querySelectorAll<HTMLElement>(".cn-tile").forEach((tile) => {
      const top = tile.querySelector(".cn-top")
      if (!top) return
      if (Number(tile.dataset.index) === index) gsap.to(top, { opacity: 1, duration: 0.2, ease: "power2.inOut", overwrite: "auto" })
      else gsap.to(top, { opacity: 0, duration: 0.3, overwrite: "auto" })
    })
  }

  const onLinkLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return
    gsap.to(e.currentTarget.querySelectorAll(".cn-char"), { yPercent: 0, duration: 0.6, stagger: 0.02, ease: "power3.out", overwrite: true })
    hoverIndex.current = -1
    // A short wait, so moving between links doesn't flash the resting state.
    leaveTimer.current = window.setTimeout(() => {
      if (hoverIndex.current === -1) restTops()
    }, 50)
  }

  const toggle = () => {
    setWarm(true)
    if (!isOpen) setOpens((n) => n + 1)
    setIsOpen((open) => !open)
  }
  const close = () => setIsOpen(false)
  const warmUp = () => setWarm(true)

  return (
    <div ref={root}>
      <div className="site-header-wrapper">
        <header className="cn-header" data-scrolled={isScrolled ? "" : undefined}>
          <Link href="/" aria-label="ZedOS Technologies home" className="cn-brand" onClick={close}>
            <ZedOrbitMark className="h-7 w-auto text-white" />
            <span>Zed</span>
          </Link>
          <div className="cn-actions">
            <Link href="/contact" className="cn-cta" onClick={close}>
              Let&apos;s talk
              <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M1 6h9.2M6.4 2.2 10.2 6l-3.8 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
            </Link>
            <button
              type="button"
              className="cn-ham"
              data-open={isOpen ? "" : undefined}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="cn-panel"
              onClick={toggle}
              onPointerEnter={warmUp}
              onFocus={warmUp}
            >
              <i aria-hidden="true" />
              <i aria-hidden="true" />
            </button>
          </div>
        </header>
      </div>

      <div
        ref={panel}
        id="cn-panel"
        className="cn-panel"
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") restTops()
        }}
      >
        <svg className="cn-bg" viewBox="-500 -320 1000 640" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
          {[120, 190, 270, 360, 460, 570, 690].map((rx) => (
            <g key={rx} stroke="#ffffff" strokeWidth="1">
              <ellipse rx={rx} ry={rx * 0.37} transform="rotate(-28)" vectorEffect="non-scaling-stroke" />
              <ellipse rx={rx} ry={rx * 0.37} transform="rotate(28)" vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </svg>

        <div className="cn-images" aria-hidden="true">
          {COLUMNS.map((column, c) => (
            <div className="cn-col" key={c}>
              {column.map((index) => (
                <div className="cn-tile" data-index={index} key={index}>
                  {warm && (
                    <>
                      <Image className="cn-base" src={LINKS[index].image} alt="" fill sizes="(min-width: 768px) 24vw, 1px" loading="eager" />
                      <Image className="cn-top" src={LINKS[index].image} alt="" fill sizes="(min-width: 768px) 24vw, 1px" loading="eager" />
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <nav className="cn-menu" aria-label="Main">
          <div />
          <div className="cn-center">
            <ul className="cn-links">
              {LINKS.map((link, index) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="cn-link"
                    data-current={index === currentIndex ? "" : undefined}
                    aria-label={link.label}
                    aria-current={index === currentIndex ? "page" : undefined}
                    onClick={close}
                    onPointerEnter={(e) => onLinkEnter(e, index)}
                    onPointerLeave={onLinkLeave}
                  >
                    <span className="cn-word" aria-hidden="true">
                      {Array.from(link.label).map((ch, i) => (
                        <span className="cn-char" key={i}>
                          {ch}
                        </span>
                      ))}
                    </span>
                    <svg className="cn-strike" viewBox="0 0 400 26" preserveAspectRatio="none" fill="none" aria-hidden="true">
                      <path
                        d="M0 7 C40 7 60 7 86 7 C112 7 112 20 138 20 L196 20 C222 20 222 7 248 7 L300 7 C326 7 326 20 352 20 L400 20"
                        pathLength={1}
                        stroke="currentColor"
                        strokeWidth="4"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="cn-emblem">
              {opens > 0 && <ZedOrbitForm key={opens} className="cn-emblem-mark" style={{ color: "#ececec" }} />}
              <p>Supply Chain · Software · Systems</p>
            </div>
          </div>
          <div className="cn-bottom">
            <Highlight href="mailto:lennoxlewis.lenny@gmail.com">Business enquiries</Highlight>
            <div className="cn-bottom-row">
              {EXTRAS.map((l) => (
                <Highlight key={l.href} href={l.href}>
                  {l.label}
                </Highlight>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default CurtainNavigation
