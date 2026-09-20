import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import ScrollReveal from '@/components/ScrollReveal'

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
    <section className="bg-black px-5 py-20 md:px-8 md:py-28">
      <div className="max-w-[1400px] mx-auto">
        <ScrollReveal className="text-center">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
            What We Offer
          </span>
          <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">Our Services &amp; Solutions</h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/65">
            End-to-end solutions tailored to supply, operations, and digital transformation needs.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 90}>
              <div className="group flex h-full flex-col">
                <div className="relative h-52 overflow-hidden bg-neutral-900">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="flex flex-grow flex-col pt-5">
                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{service.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{service.description}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white/70">
                    <span>Explore solution</span><span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={180} className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            <span>View All Services</span>
            <span className="text-lg">→</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
