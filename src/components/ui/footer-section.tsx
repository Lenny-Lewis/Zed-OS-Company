'use client'

import type { ComponentProps, ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'

interface FooterLink {
  title: string
  href: string
  imageSrc?: string
}

interface FooterSection {
  label: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    label: 'Services',
    links: [
      { title: 'General Supplies', href: '/services' },
      { title: 'Vehicle Hire', href: '/services' },
      { title: 'Conference Facilities', href: '/services' },
      { title: 'Consultancy', href: '/services' },
    ],
  },
  {
    label: 'Digital',
    links: [
      { title: 'Software Systems', href: '/services' },
      { title: 'Websites', href: '/services' },
      { title: 'Data Analytics', href: '/services' },
      { title: 'AI & ML', href: '/services' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'About Zed OS', href: '/about' },
      { title: 'Partner With Us', href: '/partner' },
      { title: 'Contact Us', href: '/contact' },
      { title: 'Products', href: '/products' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { title: 'Instagram', href: 'https://www.instagram.com/zedostechnologies?igsh=MXFyamJ2NjFvY2F0eQ==', imageSrc: 'https://cdn.simpleicons.org/instagram/E4405F' },
      { title: 'LinkedIn', href: 'https://www.linkedin.com/in/zedos-technologies-576bb3414', imageSrc: '/images/linkedin.svg' },
      { title: 'X', href: 'https://x.com/zedostechnology', imageSrc: 'https://cdn.simpleicons.org/x/FFFFFF' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center rounded-t-[2.5rem] border-t border-white/10 bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.08),transparent)] px-6 py-12 lg:rounded-t-[3.5rem] lg:py-16">
      <div className="absolute left-1/2 top-0 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-sm" />

      <div className="grid w-full gap-10 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-3 text-white" aria-label="Zed OS Technologies home">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 font-heading text-xl italic">Z</span>
            <span className="font-heading text-3xl italic tracking-tight">Zed OS</span>
          </Link>
          <p className="max-w-xs font-body text-sm font-light leading-relaxed text-white/65">Reliable supplies, operational support, and digital systems for organisations across Kenya and East Africa.</p>
          <p className="font-body text-sm text-white/45">© {new Date().getFullYear()} Zed OS Technologies Limited.</p>
        </AnimatedContainer>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div>
                <h3 className="font-body text-xs font-medium uppercase tracking-[0.18em] text-white/80">{section.label}</h3>
                <ul className="mt-4 space-y-2.5 font-body text-sm text-white/55">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a href={link.href} className="inline-flex items-center transition-colors duration-300 hover:text-white" target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noreferrer' : undefined}>
                        {link.imageSrc && <img src={link.imageSrc} alt="" aria-hidden="true" className="me-2 size-4 object-contain" />}
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>

      <div className="mt-12 flex w-full flex-col gap-3 border-t border-white/10 pt-6 font-body text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <span>Supply Chain · Software · Systems</span>
        <a href="https://www.lennoxlewis.co.ke" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Made by Lennox Lewis</a>
        <a href="mailto:Lennoxlewis.lenny@gmail.com" className="transition-colors hover:text-white">Lennoxlewis.lenny@gmail.com</a>
        <a href="tel:+254758296887" className="transition-colors hover:text-white">+254 758 296 887</a>
      </div>
    </footer>
  )
}

type ViewAnimationProps = {
  delay?: number
  className?: ComponentProps<typeof motion.div>['className']
  children: ReactNode
}

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) return <>{children}</>

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
