import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { images } from '@/data/images'

const services = [
  {
    name: 'General Supplies',
    image: images.services.supplies,
    alt: 'General office and institutional supplies',
    description:
      'We provide a comprehensive range of supply solutions for offices, institutions, and organizations of all sizes. Our procurement network ensures timely delivery of quality goods at competitive prices.',
    includes: [
      'Office stationery & printing materials',
      'ICT equipment & accessories',
      'Office furniture & fittings',
      'Cleaning & hygiene materials',
      'Electrical items & fittings',
      'Protective wear & safety equipment',
      'Branded & promotional items',
    ],
  },
  {
    name: 'Vehicle Hire',
    image: images.services.vehicle,
    alt: 'Vehicle hire fleet',
    description:
      'Our fleet hire service offers reliable, well-maintained vehicles for both short-term and long-term needs. Whether for corporate transfers, field operations, or events, we have the right vehicle for you.',
    includes: [
      'Short-term & long-term hire options',
      'Corporate transport arrangements',
      'Event & conference transport',
      'Field operations vehicles',
      'Saloons, SUVs, and minibuses',
      'Professional drivers available on request',
    ],
  },
  {
    name: 'Conference Facilities',
    image: images.services.conference,
    alt: 'Conference and meeting facilities',
    description:
      'Our professional conference facilities are designed to support productive meetings, workshops, training sessions, and corporate events. Fully equipped and adaptable to any event format.',
    includes: [
      'Fully equipped conference halls',
      'Audio-visual equipment & setup',
      'High-speed internet access',
      'Flexible seating arrangements',
      'Catering coordination',
      'On-site technical support',
    ],
  },
  {
    name: 'Consultancy Services',
    image: images.services.consultancy,
    alt: 'Business consultancy session',
    description:
      'Our consultancy arm provides expert guidance in supply chain management, business operations, and procurement strategy. We help organizations streamline processes and achieve their operational goals.',
    includes: [
      'Supply chain analysis & optimization',
      'Procurement strategy & planning',
      'Vendor identification & management',
      'Operational efficiency consulting',
      'Business process improvement',
      'Institutional & NGO support',
    ],
  },
  {
    name: 'Software Systems',
    image: images.digital.systems,
    alt: 'Software systems development workspace',
    description:
      'We design and build custom software systems that automate manual work, improve visibility, and help teams run better operations.',
    includes: [
      'Internal business tools',
      'Inventory and workflow systems',
      'Client and project portals',
      'Role-based dashboards',
      'Process automation',
      'System support and enhancement',
    ],
  },
  {
    name: 'Websites',
    image: images.digital.websites,
    alt: 'Website development workspace',
    description:
      'We create modern websites that look sharp, load fast, and communicate your services with clarity across every device.',
    includes: [
      'Corporate websites',
      'Landing pages',
      'Responsive mobile-first design',
      'Content updates and maintenance',
      'Hosting guidance',
      'Conversion-focused layouts',
    ],
  },
  {
    name: 'Data Analytics',
    image: images.digital.analytics,
    alt: 'Data analytics dashboard on a laptop',
    description:
      'We turn raw data into dashboards, reports, and insights that support planning, performance tracking, and decision-making.',
    includes: [
      'Business intelligence dashboards',
      'Reporting and KPI tracking',
      'Data cleaning and preparation',
      'Trend and performance analysis',
      'Operational insights',
      'Decision support reporting',
    ],
  },
  {
    name: 'AI & ML',
    image: images.digital.aiMl,
    alt: 'Artificial intelligence concept artwork',
    description:
      'We help clients explore practical AI and machine learning applications for automation, analysis, and smarter workflows.',
    includes: [
      'AI-assisted workflows',
      'Predictive models',
      'Classification and pattern detection',
      'Automation opportunities',
      'Prototype development',
      'AI strategy support',
    ],
  },
]

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="WHAT WE OFFER"
        title="Our Services"
        subtitle="End-to-end solutions for supply, operations, and digital transformation."
        backgroundImage={images.pageHeroBg}
      />

      <section className="bg-black px-5 pb-8 pt-16 text-center md:px-8 md:pb-12 md:pt-20">
        <div className="mx-auto max-w-4xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
            Digital Capability
          </span>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-light leading-[0.95] tracking-[-0.04em] text-white md:text-6xl">
            Software Systems, Websites, Data Analytics &amp; AI-driven Workflows
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65">
            Alongside our general supply and consultancy work, we empower organizations with high-performance
            digital platforms, internal system automation, and actionable data analytics.
          </p>
        </div>
      </section>

      <section className="bg-black px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {services.map((service, index) => (
            <Reveal key={service.name} delay={index * 60}>
              <article className="flex h-full flex-col justify-between">
                <div>
                  <div className="relative mb-6 h-56 overflow-hidden bg-neutral-900 md:h-64">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h2 className="text-3xl font-light tracking-[-0.04em] text-white md:text-4xl">{service.name}</h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">{service.description}</p>
                </div>

                <div className="mt-7 border-t border-white/15 pt-5">
                  <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">What&apos;s Included</h3>
                  <ul className="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                    {service.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs text-white/65">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-white/70" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
