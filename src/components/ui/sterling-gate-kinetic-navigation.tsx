"use client"

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import "./sterling-gate-kinetic-navigation.css";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

function ZedMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7 fill-current" aria-hidden="true">
      <rect x="8" y="10" width="11" height="25" rx="5.5" transform="rotate(-35 8 10)" />
      <rect x="22" y="7" width="11" height="25" rx="5.5" transform="rotate(-35 22 7)" />
    </svg>
  );
}

export function Component() {
  // We need a ref for the parent container to scope GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isFirstRender = useRef(true);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Initial Setup, Hover Effects, and Master Navigation Timeline
  useEffect(() => {
    if (!containerRef.current) return;

    // Create custom easing
    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch (e) {
      console.warn("CustomEase failed to load, falling back to default.", e);
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      // 1. Arrow Animation (Safe check)
      const arrowLine = document.querySelector(".arrow-line");
      if (arrowLine) {
        const pathLength = (arrowLine as SVGPathElement).getTotalLength();
        gsap.set(arrowLine, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        arrowTl
          .to(arrowLine, { strokeDashoffset: 0, duration: 1, ease: "power2.out" })
          .to({}, { duration: 1.2 })
          .to(arrowLine, { strokeDashoffset: -pathLength, duration: 0.6, ease: "power2.in" })
          .set(arrowLine, { strokeDashoffset: pathLength });
      }

      // 2. Shape Hover
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;

        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          }
          shape.classList.add("active");

          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);

        (item as any)._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });

      // 3. Kinetic Navigation Master Timeline (Handles bidirectional Play & Reverse)
      const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
      const menu = containerRef.current!.querySelector(".menu-content");
      const overlay = containerRef.current!.querySelector(".overlay");
      const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
      const menuLinks = containerRef.current!.querySelectorAll(".nav-link");
      const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");

      const menuButton = containerRef.current!.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton?.querySelectorAll(".p-large");
      const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

      // Initial element state
      if (navWrap) {
        gsap.set(navWrap, { display: "none" });
      }
      if (menu) {
        gsap.set(menu, { xPercent: 0 });
      }

      const tl = gsap.timeline({
        paused: true,
        onStart: () => {
          if (navWrap) {
            navWrap.setAttribute("data-nav", "open");
            gsap.set(navWrap, { display: "block" });
          }
        },
        onReverseComplete: () => {
          if (navWrap) {
            navWrap.setAttribute("data-nav", "closed");
            gsap.set(navWrap, { display: "none" });
          }
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          }
        },
      });

      // Overlay backdrop fade
      if (overlay) {
        tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.out" }, 0);
      }

      // Button Text Swapping ("Menu" -> "Close") & Icon Rotation (+) -> (x)
      if (menuButtonTexts && menuButtonTexts.length > 0) {
        tl.fromTo(
          menuButtonTexts,
          { yPercent: 0 },
          { yPercent: -100, stagger: 0.12, duration: 0.35, ease: "power2.out" },
          0
        );
      }
      if (menuButtonIcon) {
        tl.fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315, duration: 0.45, ease: "power2.out" }, 0);
      }

      // Staggered sliding background panels (Layer 1 -> Layer 2 -> Layer 3)
      if (bgPanels && bgPanels.length > 0) {
        tl.fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.1, duration: 0.55, ease: "main" }, 0.05);
      }

      // Menu Links cascade in with rotation
      if (menuLinks && menuLinks.length > 0) {
        tl.fromTo(
          menuLinks,
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, stagger: 0.05, duration: 0.45, ease: "power3.out" },
          0.28
        );
      }

      // Fade Targets
      if (fadeTargets && fadeTargets.length > 0) {
        tl.fromTo(
          fadeTargets,
          { autoAlpha: 0, yPercent: 40 },
          { autoAlpha: 1, yPercent: 0, stagger: 0.04, duration: 0.35, ease: "power2.out" },
          0.38
        );
      }

      tlRef.current = tl;
    }, containerRef);

    return () => {
      ctx.revert();
      if (tlRef.current) {
        tlRef.current.kill();
      }
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll(".menu-list-item[data-shape]");
        items.forEach((item: any) => item._cleanup && item._cleanup());
      }
    };
  }, []);

  // Menu Open/Close trigger effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!tlRef.current) return;

    if (isMenuOpen) {
      const navWrap = containerRef.current?.querySelector(".nav-overlay-wrapper");
      if (navWrap) {
        navWrap.setAttribute("data-nav", "open");
        gsap.set(navWrap, { display: "block" });
      }
      tlRef.current.timeScale(1).play();
    } else {
      tlRef.current.timeScale(1.2).reverse();
    }
  }, [isMenuOpen]);

  // keydown Escape handling
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef}>
      <div className="site-header-wrapper">
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row">
              <Link href="/" aria-label="ZedOS Technologies home" className="nav-logo-row w-inline-block">
                <ZedMark />
                <span className="font-sans text-sm font-semibold tracking-tight text-white">ZedOS Technologies</span>
              </Link>
              <div className="nav-row__right">
                {/* Restored Menu Button */}
                <button
                  type="button"
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  className="nav-close-btn"
                  onClick={toggleMenu}
                  style={{ pointerEvents: "auto" }}
                >
                  <div className="menu-button-text">
                    <span className="p-large block">Menu</span>
                    <span className="p-large block">Close</span>
                  </div>
                  <div className="icon-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="menu-button-icon"
                    >
                      <path
                        d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                        fill="currentColor"
                      ></path>
                      <path
                        d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content">
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              {/* Abstract shapes container */}
              <div className="ambient-background-shapes">
                {/* Shape 1: Floating circles */}
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(255,255,255,0.12)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(255,255,255,0.08)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(255,255,255,0.06)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(255,255,255,0.12)" />
                </svg>

                {/* Shape 2: Wave pattern */}
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(255,255,255,0.18)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                {/* Shape 3: Grid dots */}
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(255,255,255,0.15)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(255,255,255,0.15)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(255,255,255,0.15)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(255,255,255,0.2)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(255,255,255,0.2)" />
                </svg>

                {/* Shape 4: Organic blobs */}
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(255,255,255,0.1)"
                  />
                  <path
                    className="shape-element"
                    d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(255,255,255,0.08)"
                  />
                </svg>

                {/* Shape 5: Diagonal lines */}
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(255,255,255,0.12)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(255,255,255,0.1)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                <li className="menu-list-item" data-shape="1">
                  <Link href="/about" onClick={closeMenu} className="nav-link w-inline-block">
                    <span className="nav-link-text block">About us</span>
                    <div className="nav-link-hover-bg"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="2">
                  <Link href="/products" onClick={closeMenu} className="nav-link w-inline-block">
                    <span className="nav-link-text block">Products</span>
                    <div className="nav-link-hover-bg"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="3">
                  <Link href="/services" onClick={closeMenu} className="nav-link w-inline-block">
                    <span className="nav-link-text block">Services</span>
                    <div className="nav-link-hover-bg"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="4">
                  <Link href="/partner" onClick={closeMenu} className="nav-link w-inline-block">
                    <span className="nav-link-text block" data-menu-fade>Partner</span>
                    <div className="nav-link-hover-bg"></div>
                  </Link>
                </li>
                <li className="menu-list-item" data-shape="5">
                  <Link href="/contact" onClick={closeMenu} className="nav-link w-inline-block">
                    <span className="nav-link-text block">Contact us</span>
                    <div className="nav-link-hover-bg"></div>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default Component;
