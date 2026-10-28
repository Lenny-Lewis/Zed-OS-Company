'use client'

import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import ScrollReveal, { Stagger, StaggerItem } from '@/components/ScrollReveal'

const services = [
  {
    title: 'General Supplies',
    image: images.services.supplies,
    alt: 'Office and general supplies',
    description:
      'Comprehensive supply solutions for offices, institutions, and organizations of all sizes.',
  },
  {
    title: 'Vehicle Hire',
    image: images.services.vehicle,
    alt: 'Professional vehicle fleet',
    description:
      'Reliable, well-maintained vehicles for corporate transfers, field operations, and events.',
  },
  {
    title: 'Conference Facilities',
    image: images.services.conference,
    alt: 'Conference and meeting room',
    description:
      'Fully equipped spaces for meetings, workshops, training sessions, and corporate events.',
  },
  {
    title: 'Consultancy Services',
    image: images.services.consultancy,
    alt: 'Business consultancy meeting',
    description:
      'Expert guidance in supply chain management, business operations, and procurement strategy.',
  },
  {
    title: 'Software Systems',
    image: images.digital.systems,
    alt: 'Software development dashboard and multi-screen workspace',
    description:
      'Custom business systems, workflow tools, and internal platforms built to streamline operations.',
  },
  {
    title: 'Websites',
    image: images.digital.websites,
    alt: 'Developer working on a website in a code editor',
    description:
      'Modern, responsive websites designed to present your brand, services, and operations clearly.',
  },
  {
    title: 'Data Analytics',
    image: images.digital.analytics,
    alt: 'Data analytics and reporting visual on a laptop screen',
    description:
      'Dashboards, reports, and insights that help teams make faster, better-informed decisions.',
  },
  {
    title: 'AI & ML',
    image: images.digital.aiMl,
    alt: 'Artificial intelligence concept image',
    description:
      'AI-assisted workflows and machine learning solutions for automation, analysis, and productivity.',
  },
]

export default function HomeServices() {
  return (
    <section className="bg-black px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal variant="blur">
            <span className="font-eyebrow text-white/45">What We Offer</span>
          </ScrollReveal>
          <ScrollReveal variant="blur" delay={90}>
            <h2 className="font-display mt-5 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
              Our Services &amp; Solutions
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/60">
              End-to-end solutions tailored to supply, operations, and digital transformation needs.
            </p>
          </ScrollReveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 xl:grid-cols-4" delay={80} stagger={0.07}>
          {services.map((service, index) => (
            <StaggerItem key={service.title}>
              <Link href="/services" className="group flex h-full flex-col">
                <div className="relative h-52 overflow-hidden bg-neutral-950">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/0" />
                  <span className="font-mono absolute left-3 top-3 text-[10px] tracking-[0.14em] text-white/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-grow flex-col pt-5">
                  <h3 className="font-display text-2xl leading-tight text-white">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{service.description}</p>
                  <div className="mt-5 flex items-center gap-2 font-sans text-xs font-medium text-white/70">
                    <span>Explore solution</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <ScrollReveal delay={120} className="mt-16 text-center">
          <Link href="/services" className="btn-ink">
            <span>View All Services</span>
            <span aria-hidden="true">→</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
