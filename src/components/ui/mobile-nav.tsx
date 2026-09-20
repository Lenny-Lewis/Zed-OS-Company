"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const links = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Mark() {
  return <svg viewBox="0 0 40 40" className="h-8 w-8 fill-current" aria-hidden="true"><rect x="8" y="10" width="11" height="25" rx="5.5" transform="rotate(-35 8 10)" /><rect x="22" y="7" width="11" height="25" rx="5.5" transform="rotate(-35 22 7)" /></svg>;
}

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "Tab" && overlayRef.current) {
        const focusable = overlayRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[60] flex items-center justify-between px-4 py-4 text-black lg:hidden">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight" aria-label="ZedOS Technologies home"><Mark /><span>ZedOS Technologies</span></Link>
        <button ref={toggleRef} type="button" onClick={() => (open ? close() : setOpen(true))} aria-expanded={open} aria-label="Menu" className="grid h-11 w-11 place-items-center rounded-full bg-black text-white">
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          {open ? <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg> : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>}
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div ref={overlayRef} role="dialog" aria-modal="true" aria-label="Mobile navigation" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.25 }} onClick={close} className="fixed inset-0 z-50 bg-[radial-gradient(circle_at_top_right,#202020,#050505_55%)] text-white lg:hidden">
            <div className="flex h-full flex-col" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-4">
                <Link href="/" onClick={close} className="flex items-center gap-2 text-sm font-semibold tracking-tight" aria-label="ZedOS Technologies home"><Mark /><span>ZedOS Technologies</span></Link>
                <button type="button" onClick={close} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-white/25"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
              </div>
              <nav className="flex flex-1 flex-col items-center justify-center gap-5 px-6" aria-label="Mobile navigation links">
                {links.map((link, index) => <motion.div key={link.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.35 }}><Link ref={index === 0 ? firstLinkRef : undefined} href={link.href} onClick={close} className="text-4xl font-semibold uppercase tracking-[-.05em] sm:text-6xl">{link.label}</Link></motion.div>)}
                <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: links.length * 0.1, duration: 0.35 }}><Link href="/contact" onClick={close} className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/35 px-6 py-3 text-sm font-medium">Get in Touch <span aria-hidden="true">↗</span></Link></motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
