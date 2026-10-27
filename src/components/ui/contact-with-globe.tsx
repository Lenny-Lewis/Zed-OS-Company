"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as d3 from "d3";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;
const CONTACT_LINKS = [
  { icon: Mail, label: "Lennoxlewis.lenny@gmail.com", href: "mailto:Lennoxlewis.lenny@gmail.com" },
  { icon: Phone, label: "+254 758 296 887", href: "tel:+254758296887" },
];

interface GlobeWireframeProps {
  className?: string;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  strokeWidth?: number;
}

// D3 owns the SVG paths so animation never rerenders the surrounding form.
function GlobeWireframe({ className, autoRotate = true, autoRotateSpeed = 0.45, strokeWidth = 0.6 }: GlobeWireframeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    const element = svgRef.current;
    if (!container || !element) return;
    const controller = new AbortController();
    const svg = d3.select(element);
    const projection = d3.geoOrthographic().rotate([-34.75, 0]).precision(0.5);
    const path = d3.geoPath(projection);
    const graticule = svg.append("path").datum(d3.geoGraticule10())
      .attr("fill", "none").attr("stroke", "currentColor")
      .attr("stroke-width", 0.5).attr("opacity", 0.12);
    const countries = svg.append("g").attr("fill", "none")
      .attr("stroke", "currentColor").attr("stroke-width", strokeWidth);
    const sphere = svg.append("path").datum({ type: "Sphere" } as d3.GeoPermissibleObjects)
      .attr("fill", "none").attr("stroke", "currentColor")
      .attr("stroke-width", 1.5).attr("opacity", 0.8);
    let countryPaths = countries.selectAll<SVGPathElement, d3.GeoPermissibleObjects>("path");
    let visible = false;
    let dragging = false;
    let lastPointer = [0, 0];
    let frame = 0;
    let previousTime = 0;

    const render = () => {
      graticule.attr("d", path);
      countryPaths.attr("d", path);
      sphere.attr("d", path);
    };
    const resize = () => {
      const size = container.clientWidth || 300;
      svg.attr("viewBox", `0 0 ${size} ${size}`);
      projection.scale(size * 0.45).translate([size / 2, size / 2]);
      render();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();
    const tick = (time: number) => {
      const delta = previousTime ? Math.min(time - previousTime, 50) : 0;
      previousTime = time;
      if (!dragging) {
        const [longitude, latitude] = projection.rotate();
        projection.rotate([(longitude + autoRotateSpeed * delta / (1000 / 60)) % 360, latitude]);
        render();
      }
      frame = requestAnimationFrame(tick);
    };
    const updateAnimation = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      if (visible && !document.hidden && autoRotate && !reducedMotion) frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateAnimation();
    }, { threshold: 0.1 });
    observer.observe(container);
    document.addEventListener("visibilitychange", updateAnimation);
    const pointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      dragging = true;
      lastPointer = [event.clientX, event.clientY];
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
    };
    const pointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const [longitude, latitude] = projection.rotate();
      projection.rotate([
        longitude + (event.clientX - lastPointer[0]) * 0.5,
        Math.max(-90, Math.min(90, latitude - (event.clientY - lastPointer[1]) * 0.5)),
      ]);
      lastPointer = [event.clientX, event.clientY];
      render();
    };
    const pointerUp = () => { dragging = false; element.style.cursor = "grab"; };
    element.addEventListener("pointerdown", pointerDown);
    element.addEventListener("pointermove", pointerMove);
    element.addEventListener("pointerup", pointerUp);
    element.addEventListener("pointercancel", pointerUp);
    element.addEventListener("lostpointercapture", pointerUp);

    async function loadWorld() {
      try {
        const response = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json", { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load globe map");
        const world = await response.json() as Topology<{ countries: GeometryCollection }>;
        if (controller.signal.aborted) return;
        countryPaths = countryPaths.data<d3.GeoPermissibleObjects>(feature(world, world.objects.countries).features).join("path");
        render();
      } catch {
        // Keep the sphere and graticule visible if the atlas is unavailable.
      }
    }
    void loadWorld();
    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateAnimation);
      element.removeEventListener("pointerdown", pointerDown);
      element.removeEventListener("pointermove", pointerMove);
      element.removeEventListener("pointerup", pointerUp);
      element.removeEventListener("pointercancel", pointerUp);
      element.removeEventListener("lostpointercapture", pointerUp);
      svg.selectAll("*").remove();
    };
  }, [autoRotate, autoRotateSpeed, reducedMotion, strokeWidth]);

  return <div ref={containerRef} className={cn("relative aspect-square w-full", className)}>
    <svg ref={svgRef} aria-hidden="true" className="h-full w-full cursor-grab touch-pan-y" />
  </div>;
}

const FormDots = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root ref={ref} decorative={decorative} orientation={orientation}
    className={cn("flex shrink-0 items-center justify-center overflow-hidden", orientation === "horizontal" ? "w-full" : "h-full", className)} {...props}>
    <div className={cn("relative", orientation === "horizontal" ? "h-4 w-full" : "h-full w-4")}>
      <div className="absolute inset-0 bg-repeat text-white/20" style={{
        backgroundImage: "radial-gradient(circle, currentColor 0.8px, transparent 0.8px)",
        backgroundSize: orientation === "horizontal" ? "6px 100%" : "100% 6px",
        maskImage: `linear-gradient(to ${orientation === "horizontal" ? "right" : "bottom"}, transparent 0%, black 10%, black 90%, transparent 100%)`,
      }} />
    </div>
  </SeparatorPrimitive.Root>
));
FormDots.displayName = "FormDots";

interface ContactWithGlobeProps {
  title?: string;
  description?: string;
  className?: string;
}

const inputClass = "w-full rounded-xl border border-white/20 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 hover:border-white/30 focus:border-white/60 focus:ring-2 focus:ring-white/10";
const labelClass = "text-xs font-semibold uppercase tracking-widest text-zinc-400";

export default function ContactWithGlobe({
  title = "Contact us",
  description = "Have a project in mind? Talk to Zed OS Technologies about supplies, consultancy, or your next business opportunity.",
  className,
}: ContactWithGlobeProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitLock = useRef(false);
  const reveal = (delay = 0, y = 14) => ({
    initial: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : delay, ease: smoothEase },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current) return;
    const body = new FormData(event.currentTarget);
    submitLock.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("https://formspree.io/f/xbdeoozz", {
        method: "POST", headers: { Accept: "application/json" }, body,
      });
      if (!response.ok) throw new Error("Submission failed");
      router.push("/thank-you");
    } catch {
      setError("Something went wrong. Please try again or email us directly.");
      submitLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="contact-title" className={cn("relative w-full overflow-hidden bg-black py-20 text-white", className)}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-12 flex flex-col items-center gap-4 text-center">
          <motion.h1 id="contact-title" {...reveal(0.15)} className="text-4xl font-bold md:text-5xl lg:text-6xl">{title}</motion.h1>
          <motion.p {...reveal(0.3)} className="max-w-md text-base text-zinc-400">{description}</motion.p>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <motion.div {...reveal(0.2, 28)} className="flex min-w-0 flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-semibold">Get in touch</h2>
              <p className="max-w-xs text-sm leading-relaxed text-zinc-400">Reach out via any channel below. We&apos;d love to hear how we can help.</p>
            </div>
            <div className="flex flex-col gap-3">
              {CONTACT_LINKS.map(({ icon: Icon, label, href }, i) => (
                <motion.a key={label} href={href} {...reveal(0.3 + i * 0.1)} className="group flex w-fit max-w-full items-center gap-3 text-sm text-zinc-400 transition-colors hover:text-white">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/80 transition-colors group-hover:border-rose-500/40 group-hover:bg-rose-500/10">
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 text-zinc-400 group-hover:text-rose-400" />
                  </span>
                  <span className="break-all">{label}</span>
                </motion.a>
              ))}
              <p className="flex items-start gap-3 text-sm text-zinc-400"><MapPin aria-hidden="true" className="m-2 h-4 w-4 shrink-0" /><span className="pt-1.5">P.O. Box 2371-40100,<br />Kisumu Town West, Kenya</span></p>
              <p className="flex items-start gap-3 text-sm text-zinc-400"><Clock aria-hidden="true" className="m-2 h-4 w-4 shrink-0" /><span className="pt-1.5">Monday – Friday, 8:00 AM – 6:00 PM EAT</span></p>
            </div>
            <div className="relative h-52 overflow-hidden text-zinc-400 sm:h-64 lg:h-60">
              <GlobeWireframe className="absolute left-0 top-0 max-w-full" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black to-transparent" />
            </div>
          </motion.div>
          <motion.form onSubmit={handleSubmit} {...reveal(0.35, 28)} aria-labelledby="message-title" aria-busy={isSubmitting}
            className="flex min-w-0 flex-col gap-5 rounded-2xl border border-white/15 bg-black p-6 shadow-[0_0_40px_rgba(255,255,255,0.035),inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8">
            <div>
              <h2 id="message-title" className="mb-0.5 text-lg font-semibold">Send a message</h2>
              <p className="text-sm text-zinc-400">Fill out the form and we&apos;ll get back to you promptly.</p>
            </div>
            <FormDots />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-full-name" className={labelClass}>Full name</label>
                <input id="contact-full-name" name="fullName" type="text" autoComplete="name" placeholder="Your full name" required className={inputClass} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-company" className={labelClass}>Company <span className="font-normal normal-case tracking-normal">(optional)</span></label>
                <input id="contact-company" name="company" type="text" autoComplete="organization" placeholder="Your company" className={inputClass} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-email" className={labelClass}>Email address</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required className={inputClass} />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className={labelClass}>Message</label>
              <textarea id="contact-message" name="message" placeholder="Tell us how we can help" rows={4} required className={cn(inputClass, "resize-none py-3")} />
            </div>
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <Button type="submit" disabled={isSubmitting} className="group h-11 w-fit cursor-pointer rounded-xl bg-white px-8 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 focus-visible:ring-rose-400 focus-visible:ring-offset-zinc-900">
              {isSubmitting ? "Sending..." : "Submit"}
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Button>
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
