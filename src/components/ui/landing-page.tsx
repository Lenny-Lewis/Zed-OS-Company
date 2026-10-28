"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"; 
import Link from "next/link";
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";

// Reusable ScrollGlobe component following shadcn/ui patterns
export interface ScrollGlobeProps {
  sections: {
    id: string;
    badge?: string;
    title: string;
    subtitle?: string;
    description: string;
    align?: 'left' | 'center' | 'right';
    features?: { title: string; description: string }[];
    actions?: { label: string; variant: 'primary' | 'secondary'; onClick?: () => void; href?: string }[];
  }[];
  globeConfig?: {
    positions: {
      top: string;
      left: string;
      scale: number;
    }[];
  };
  className?: string;
}

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 },  // Hero: Right side, balanced
    { top: "25%", left: "50%", scale: 0.9 },  // Innovation: Top side, subtle
    { top: "15%", left: "90%", scale: 2 },    // Discovery: Left side, medium
    { top: "50%", left: "50%", scale: 1.8 },  // Future: Center, large backdrop
  ]
};

// Parse percentage string to number
const parsePercent = (str: string): number => parseFloat(str.replace('%', ''));

export function ScrollGlobe({ sections, globeConfig = defaultGlobeConfig, className }: ScrollGlobeProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [globeTransform, setGlobeTransform] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const animationFrameId = useRef<number | undefined>(undefined);
  
  // Pre-calculate positions for performance
  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  // Simple, direct scroll tracking
  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
    
    setScrollProgress(progress);

    // Simple section detection
    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    // Direct position update
    const currentPos = calculatedPositions[newActiveSection] || calculatedPositions[0];
    if (currentPos) {
      const transform = `translate3d(${currentPos.left}vw, ${currentPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${currentPos.scale}, ${currentPos.scale}, 1)`;
      setGlobeTransform(transform);
    }

    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  // Throttled scroll handler with RAF
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition(); // Initial call
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition]);

  // Initial globe position
  useEffect(() => {
    const initialPos = calculatedPositions[0];
    if (initialPos) {
      const initialTransform = `translate3d(${initialPos.left}vw, ${initialPos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${initialPos.scale}, ${initialPos.scale}, 1)`;
      setGlobeTransform(initialTransform);
    }
  }, [calculatedPositions]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full max-w-screen overflow-x-hidden min-h-screen bg-[#000000] text-white",
        className
      )}
    >
      {/* Clean Navigation Dots */}
      <div className="hidden sm:flex fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <div key={section.id || index} className="relative flex items-center justify-center">
              <button
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
                className={cn(
                  "relative w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125 cursor-pointer",
                  "before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300",
                  activeSection === index 
                    ? "bg-white border-white shadow-lg before:animate-ping before:bg-white/30" 
                    : "bg-transparent border-white/40 hover:border-white/80 hover:bg-white/20"
                )}
                aria-label={`Go to section ${index + 1}`}
              />
            </div>
          ))}
        </div>
        
        {/* Navigation vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2 -z-10" />
      </div>

      {/* 3D Rotating Globe tracked across viewport */}
      <div
        className="fixed top-0 left-0 z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: globeTransform,
          filter: `opacity(${activeSection === 3 ? 0.45 : 0.95})`,
        }}
      >
        <div className="scale-75 sm:scale-95 lg:scale-110">
          <Globe />
        </div>
      </div>

      {/* Fullscreen Narrative Sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className={cn(
            "relative min-h-screen flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 z-20 py-20",
            "w-full max-w-full overflow-hidden bg-transparent",
            section.align === 'center' && "items-center text-center",
            section.align === 'right' && "items-end text-right",
            section.align !== 'center' && section.align !== 'right' && "items-start text-left"
          )}
        >
          <div className={cn(
            "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl will-change-transform transition-all duration-700",
            "opacity-100 translate-y-0"
          )}>
            <h2 className={cn(
              "mb-6 sm:mb-8 leading-[1.04] tracking-[-0.03em] text-white",
              index === 0 
                ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem]" 
                : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
            )}>
              <span className="block font-sans font-light tracking-[-0.03em] text-white">
                {section.title}
              </span>
              {section.subtitle && (
                <span className="block font-serif italic font-normal text-white/80 tracking-[-0.02em] mt-1 sm:mt-2 text-[0.88em]">
                  {section.subtitle}
                </span>
              )}
            </h2>
            
            <div className={cn(
              "font-sans text-white/70 leading-[1.6] mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl font-normal",
              section.align === 'center' ? "max-w-2xl mx-auto text-center" : "max-w-2xl"
            )}>
              <p className="mb-3 sm:mb-4">{section.description}</p>
              {index === 0 && (
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 font-mono text-xs text-white/50 mt-4 sm:mt-6">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="tracking-[0.1em] uppercase">Global Reach &amp; East Africa Network</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <span className="tracking-[0.1em] uppercase">Scroll to Explore</span>
                  </div>
                </div>
              )}
            </div>

            {/* Features List */}
            {section.features && (
              <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-3xl text-left">
                {section.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "group p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-white/10 bg-neutral-950/70 backdrop-blur-md hover:bg-neutral-900/90 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5",
                      "hover:border-white/30 hover:-translate-y-0.5"
                    )}
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 group-hover:bg-blue-400 transition-colors shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      <div className="flex-1 space-y-1 min-w-0">
                        <h3 className="font-sans font-semibold text-white text-base sm:text-lg">{feature.title}</h3>
                        <p className="font-sans text-white/60 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {section.actions && (
              <div className={cn(
                "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2",
                section.align === 'center' && "justify-center",
                section.align === 'right' && "justify-end",
                (!section.align || section.align === 'left') && "justify-start"
              )}>
                {section.actions.map((action, actionIndex) => {
                  const commonClasses = cn(
                    "group relative px-7 sm:px-9 py-3.5 sm:py-4 rounded-full font-sans font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base text-center inline-flex items-center justify-center cursor-pointer",
                    "focus:outline-none focus:ring-2 focus:ring-white/20 w-full sm:w-auto",
                    action.variant === 'primary' 
                      ? "bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10" 
                      : "border border-white/25 bg-neutral-950/60 backdrop-blur-sm hover:bg-neutral-900 hover:border-white/50 text-white"
                  );

                  if (action.href) {
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        className={commonClasses}
                        style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                      >
                        <span className="relative z-10">{action.label}</span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={commonClasses}
                      style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                    >
                      <span className="relative z-10">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// Default export demo
export default function GlobeScrollDemo() {
  const demoSections = [
    {
      id: "hero",
      badge: "Welcome",
      title: "Explore",
      subtitle: "Our World",
      description: "Journey through an immersive experience where technology meets innovation. Watch as perspectives shift and possibilities unfold with every interaction, creating a symphony of digital artistry.",
      align: "left" as const,
      actions: [
        { label: "Begin Journey", variant: "primary" as const, href: "/contact" },
        { label: "Learn More", variant: "secondary" as const, href: "/about" },
      ]
    },
    {
      id: "innovation",
      badge: "Innovation",
      title: "Connected Worldwide",
      description: "From every corner of the globe, we witness the interconnected web of human achievement. Each connection represents progress, every interaction drives innovation forward into uncharted territories.",
      align: "center" as const,
    },
    {
      id: "discovery",
      badge: "Discovery",
      title: "Expanding",
      subtitle: "Possibilities",
      description: "As we push beyond familiar boundaries, new worlds of opportunity emerge from the horizon. What seemed impossible yesterday becomes tomorrow's foundation for extraordinary achievements.",
      align: "left" as const,
      features: [
        { title: "Limitless Exploration", description: "Discover new dimensions of possibility and innovation" },
        { title: "Seamless Integration", description: "Where cutting-edge technology meets human intuition" },
        { title: "Future-Ready Solutions", description: "Built for tomorrow's challenges and opportunities" }
      ]
    },
    {
      id: "future",
      badge: "Future",
      title: "Our Shared",
      subtitle: "Tomorrow",
      description: "In this moment of unity, we see not just a planet, but a canvas of infinite human potential. Every connection represents hope, every innovation builds bridges to our collective future of endless possibilities.",
      align: "center" as const,
      actions: [
        { label: "Join the Movement", variant: "primary" as const, href: "/contact" },
        { label: "Explore More", variant: "secondary" as const, href: "/partner" }
      ]
    }
  ];

  return (
    <ScrollGlobe 
      sections={demoSections}
      className="bg-[#000000]"
    />
  );
}
