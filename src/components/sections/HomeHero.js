'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const heroVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4'
const capabilitiesVideo = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_093722_ccfc7ebf-182f-419f-8a62-2dc02db7dd9d.mp4'
const reveal = { initial: { filter: 'blur(10px)', opacity: 0, y: 20 }, animate: { filter: 'blur(0px)', opacity: 1, y: 0 }, transition: { duration: 0.8, ease: 'easeOut' } }

function ArrowUpRight() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4"><path d="M7 17L17 7M7 7h10v10" /></svg> }
function Play() { return <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M6 4 20 12 6 20V4Z" /></svg> }
function ClockIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg> }
function GlobeIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21M12 3C9.8 5.4 8.7 8.4 8.7 12S9.8 18.6 12 21" /></svg> }
function ImageIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M4 5h16v14H4V5Zm2 11 3.4-4.2 2.5 3 1.7-2.1L18 16H6Zm3-7.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" /></svg> }
function MovieIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M3 6h18v13H3V6Zm3.3 2.2-1.2 2.1h2.5l1.2-2.1H6.3Zm5.1 0-1.2 2.1h2.5l1.2-2.1h-2.5Zm5.1 0-1.2 2.1h2.5l1.2-2.1h-2.5ZM5 12v5h14v-5H5Z" /></svg> }
function LightbulbIcon() { return <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor"><path d="M9 21h6v-1H9v1Zm3-19a7 7 0 0 0-4.5 12.4c.8.7 1.3 1.6 1.5 2.6h6c.2-1 .7-1.9 1.5-2.6A7 7 0 0 0 12 2Zm2.6 10.9c-.9.8-1.5 1.8-1.7 3.1h-1.8c-.2-1.3-.8-2.3-1.7-3.1A5 5 0 1 1 14.6 12.9Z" /></svg> }

function FadingVideo({ src, className = '', style }) {
  const videoRef = useRef(null)
  const [sourceIndex, setSourceIndex] = useState(0)
  const sources = Array.isArray(src) ? src : [src]
  const fadeIn = () => requestAnimationFrame(() => {
    if (videoRef.current) {
      videoRef.current.style.transition = 'opacity 500ms ease'
      videoRef.current.style.opacity = '1'
    }
  })
  const fadeOut = () => {
    if (videoRef.current) {
      videoRef.current.style.transition = 'opacity 550ms ease'
      videoRef.current.style.opacity = '0'
    }
  }
  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video?.duration && video.duration - video.currentTime <= 0.55) fadeOut()
  }
  const handleEnded = () => {
    const video = videoRef.current
    if (sources.length === 1 && video) { video.currentTime = 0; video.play(); fadeIn() }
    else setSourceIndex((index) => (index + 1) % sources.length)
  }
  useEffect(() => { if (videoRef.current) { videoRef.current.load(); videoRef.current.play().catch(() => {}) } }, [sourceIndex])
  return <video ref={videoRef} src={sources[sourceIndex]} autoPlay muted playsInline preload="auto" onLoadedData={fadeIn} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} className={`transition-opacity duration-500 ${className}`} style={{ opacity: 0, ...style }} />
}

function BlurText({ text, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return <div ref={ref} className={`flex flex-wrap justify-center gap-y-[0.1em] ${className}`}>
    {text.split(' ').map((word, index) => <motion.span key={`${word}-${index}`} className="mr-[0.28em] inline-block" initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }} animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : undefined} transition={{ duration: 0.7, delay: index * 0.1, ease: 'easeOut' }}>{word}</motion.span>)}
  </div>
}

const capabilities = [
  { title: 'Supply & Mobility', icon: ImageIcon, tags: ['General Supplies', 'Vehicle Hire', 'Facilities'], body: 'Reliable procurement, fleet support, and conference facilities for organisations that need every operational detail handled with care.' },
  { title: 'Digital Systems', icon: MovieIcon, tags: ['Software', 'Websites', 'Analytics', 'AI & ML'], body: 'Practical digital platforms and data tools that replace manual work, improve visibility, and help teams make better decisions.' },
  { title: 'Consulting', icon: LightbulbIcon, tags: ['Strategy', 'Procurement', 'Optimisation'], body: 'Clear, hands-on guidance for supply chains, business operations, and workflows built to make your organisation more effective.' },
]

function Stat({ icon, number, copy }) { return <div className="liquid-glass w-[220px] rounded-[1.25rem] p-5 text-left">{icon}<p className="mt-4 font-heading text-4xl italic leading-none tracking-[-1px]">{number}</p><p className="mt-2 text-xs font-light text-white/90">{copy}</p></div> }

function Hero() {
  return <section className="relative h-screen overflow-hidden bg-black">
    <FadingVideo src={heroVideo} className="absolute left-1/2 top-0 z-0 max-w-none -translate-x-1/2 object-cover object-top" style={{ width: '120%', height: '120%' }} />
    <div className="relative z-10 flex h-full flex-col">
      <header className="hidden fixed left-0 right-0 top-4 z-50 items-center justify-between px-8 lg:px-16">
        <Link href="/" aria-label="Zed OS Technologies home" className="liquid-glass flex h-12 w-12 items-center justify-center rounded-full font-heading text-2xl italic">Z</Link>
        <nav className="liquid-glass hidden rounded-full px-1.5 py-1.5 md:flex md:items-center" aria-label="Main navigation">
          {[['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Partner', '/partner'], ['Contact', '/contact']].map(([item, href]) => <Link key={item} href={href} className="px-3 py-2 font-body text-sm font-medium text-white/90 transition-colors hover:text-white">{item}</Link>)}
          <Link href="/contact" className="ml-1 flex items-center gap-1 rounded-full bg-white px-3 py-2 font-body text-sm font-medium text-black">Talk to Us <ArrowUpRight /></Link>
        </nav>
        <div className="h-12 w-12" />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-24 text-center">
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.4 }} className="liquid-glass rounded-full px-2 py-1 text-xs font-body text-white/90"><span className="mr-2 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-black">Zed OS</span>Kisumu-based. Serving Kenya and East Africa.</motion.div>
        <div className="mt-6 max-w-3xl"><BlurText text="Technology and operations, built to move you forward" className="font-heading text-6xl italic leading-[0.8] tracking-[-4px] text-white md:text-7xl lg:text-[5.5rem]" /></div>
        <motion.p {...reveal} transition={{ ...reveal.transition, delay: 0.8 }} className="mt-4 max-w-2xl font-body text-sm font-light leading-tight text-white md:text-base">Zed OS Technologies delivers dependable supplies, operational support, consulting, and digital systems that help organisations work smarter every day.</motion.p>
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 1.1 }} className="mt-6 flex gap-6"><Link href="/contact" className="liquid-glass-strong flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">Start a Conversation <ArrowUpRight /></Link><Link href="/services" className="flex items-center gap-2 text-sm text-white"><Play />Explore Services</Link></motion.div>
        <motion.div {...reveal} transition={{ ...reveal.transition, delay: 1.3 }} className="mt-8 flex flex-wrap justify-center gap-4"><Stat icon={<ClockIcon />} number="24 Hours" copy="Typical response time for new enquiries" /><Stat icon={<GlobeIcon />} number="8 Services" copy="For supply, operations, and digital growth" /></motion.div>
      </main>
      <motion.div {...reveal} transition={{ ...reveal.transition, delay: 1.4 }} className="flex flex-col items-center gap-4 pb-8"><div className="liquid-glass rounded-full px-4 py-2 text-xs text-white/90">Trusted by businesses, institutions, NGOs, and public-sector teams</div><div className="flex gap-8 font-heading text-2xl italic tracking-tight md:gap-16 md:text-3xl">{['Supply', 'Systems', 'Strategy', 'Service'].map((name) => <span key={name}>{name}</span>)}</div></motion.div>
    </div>
  </section>
}

function Capabilities() {
  return <section id="capabilities" className="relative min-h-screen overflow-hidden bg-black">
    <FadingVideo src={capabilitiesVideo} className="absolute inset-0 z-0 h-full w-full object-cover" />
    <div className="relative z-10 flex min-h-screen flex-col px-8 pb-10 pt-24 md:px-16 lg:px-20">
      <div className="mb-auto"><p className="mb-6 font-body text-sm text-white/80">{'// What we do'}</p><h2 className="whitespace-pre-line font-heading text-6xl italic leading-[0.9] tracking-[-3px] md:text-7xl lg:text-[6rem]">{'Reliable operations,\ndigital by design'}</h2></div>
      <div id="contact" className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">{capabilities.map(({ title, icon: Icon, tags, body }) => <article key={title} className="liquid-glass flex min-h-[360px] flex-col rounded-[1.25rem] p-6"><div className="flex items-start justify-between gap-4"><div className="liquid-glass flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.75rem]"><Icon /></div><div className="flex flex-wrap justify-end gap-1.5">{tags.map((tag) => <span key={tag} className="liquid-glass whitespace-nowrap rounded-full px-3 py-1 font-body text-[11px] text-white/90">{tag}</span>)}</div></div><div className="flex-1" /><h3 className="font-heading text-3xl italic leading-none tracking-[-1px] md:text-4xl">{title}</h3><p className="mt-3 max-w-[32ch] font-body text-sm font-light leading-snug text-white/90">{body}</p></article>)}</div>
    </div>
  </section>
}

export default function HomeHero() { return <><Hero /><Capabilities /></> }
