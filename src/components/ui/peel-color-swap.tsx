"use client"

import React from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { setImmersive } from "@/lib/immersive"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export type PeelColorSwapProps = {
  eyebrow?: string
  title?: React.ReactNode
  description?: string
  meta?: string[]
  /** Scroll length in viewport heights while the scene stays pinned. */
  scrollLength?: number
  className?: string
}

function LayerContent({
  tone,
  eyebrow,
  title,
  description,
  meta,
}: {
  tone: "dark" | "light"
  eyebrow: string
  title: React.ReactNode
  description: string
  meta: string[]
}) {
  const dark = tone === "dark"
  return (
    <div
      className={
        "relative flex h-full w-full flex-col justify-between overflow-hidden px-5 py-24 font-sans md:px-10 md:py-28 " +
        (dark ? "bg-[#000000] text-white" : "bg-[#ffffff] text-[#111111]")
      }
    >
      <div
        className={
          "pointer-events-none absolute inset-0 opacity-[0.28] " +
          (dark
            ? "bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.1),transparent_40%),radial-gradient(circle_at_82%_72%,rgba(47,99,255,0.16),transparent_38%)]"
            : "bg-[radial-gradient(circle_at_18%_18%,rgba(0,0,0,0.05),transparent_40%),radial-gradient(circle_at_82%_72%,rgba(47,99,255,0.1),transparent_38%)]")
        }
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] items-start justify-between gap-8">
        <p className={"font-eyebrow " + (dark ? "text-white/45" : "text-black/45")}>{eyebrow}</p>
        <p
          className={
            "hidden font-mono text-[11px] uppercase tracking-[0.14em] sm:block " +
            (dark ? "text-white/35" : "text-black/35")
          }
        >
          Scroll to peel
        </p>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px]">
        <h2 className="font-display max-w-5xl text-4xl leading-[0.98] sm:text-5xl md:text-7xl lg:text-[5.5rem]">
          {title}
        </h2>
        <p
          className={
            "mt-7 max-w-xl font-sans text-[15px] font-normal leading-relaxed md:text-base " +
            (dark ? "text-white/65" : "text-black/60")
          }
        >
          {description}
        </p>
      </div>

      <div
        className="relative z-10 mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-3 md:gap-8 md:pt-10"
        style={{ borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)" }}
      >
        {meta.map((item) => (
          <p
            key={item}
            className={
              "font-mono text-[11px] uppercase tracking-[0.14em] " + (dark ? "text-white/55" : "text-black/50")
            }
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  )
}

/**
 * Sticky dual-layer peel: a dark top sheet shrinks via clip-path on scroll,
 * revealing the inverted light layer underneath. Takes over the viewport
 * (hides site chrome) while active.
 */
export default function PeelColorSwap({
  eyebrow = "Delivery",
  title = (
    <>
      Sourced with care.
      <br />
      Delivered without drama.
    </>
  ),
  description = "From warehouse floor to your doorstep, Zed OS handles procurement and last-mile delivery as one continuous motion — so your team stays focused on the work, not the chase.",
  meta = ["Kisumu hub", "East Africa routes", "Same-week fulfillment"],
  scrollLength = 180,
  className = "",
}: PeelColorSwapProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const topRef = React.useRef<HTMLDivElement | null>(null)
  const immersiveOn = React.useRef(false)

  React.useEffect(() => {
    const root = rootRef.current
    const top = topRef.current
    if (!root || !top) return

    const release = () => {
      if (!immersiveOn.current) return
      immersiveOn.current = false
      setImmersive(false)
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      top.style.clipPath = "polygon(14% 0%, 72% 0%, 88% 90%, 0% 95%)"
      top.style.borderRadius = "0% 0% 40% 10%"
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onToggle: (self) => {
          if (self.isActive && !immersiveOn.current) {
            immersiveOn.current = true
            setImmersive(true)
          } else if (!self.isActive) {
            release()
          }
        },
      })

      if (!reduced) {
        gsap.fromTo(
          top,
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            borderRadius: "0% 0% 0% 0%",
          },
          {
            clipPath: "polygon(14% 0%, 72% 0%, 88% 90%, 0% 95%)",
            borderRadius: "0% 0% 40% 10%",
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          },
        )
      }
    }, root)

    return () => {
      release()
      ctx.revert()
    }
  }, [scrollLength])

  const shared = { eyebrow, title, description, meta }

  return (
    <section
      ref={rootRef}
      className={"relative z-[80] w-full bg-[#000000] " + className}
      style={{ height: `${scrollLength}vh` }}
      aria-label="Delivery peel section"
      data-immersive-section="peel"
    >
      <div className="sticky top-0 z-[90] h-[100svh] w-full overflow-hidden bg-[#000000]">
        <div className="absolute inset-0">
          <LayerContent tone="light" {...shared} />
        </div>

        <div
          ref={topRef}
          className="absolute inset-0 z-10 will-change-[clip-path,border-radius]"
          style={{
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            borderRadius: "0% 0% 0% 0%",
          }}
        >
          <LayerContent tone="dark" {...shared} />
        </div>
      </div>
    </section>
  )
}
