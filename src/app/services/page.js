import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { images } from '@/data/images'

const services = [
  {
    name: 'General Supplies',
    bg: 'bg-brand-base',
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
    bg: 'bg-brand-deep',
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
    bg: 'bg-brand-base',
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
    bg: 'bg-brand-deep',
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
    bg: 'bg-brand-base',
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
    bg: 'bg-brand-deep',
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
    bg: 'bg-brand-base',
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
    bg: 'bg-brand-deep',
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

      <section className="bg-brand-base py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-accent text-xs uppercase tracking-widest">Digital Capability</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
            We now build software systems, websites, data solutions, and AI-driven workflows.
          </h2>
          <p className="text-brand-muted mt-5 leading-relaxed">
            Alongside our supply and consultancy work, we support businesses that need a stronger
            digital presence, better internal systems, and sharper data-driven decisions.
          </p>
        </div>
      </section>

      {services.map((service, index) => (
        <section key={service.name} className={`${service.bg} py-20 px-6`}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <Reveal className={index % 2 === 1 ? 'md:order-2' : ''}>
              <h2 className="text-3xl font-bold text-white">{service.name}</h2>
              <p className="text-brand-muted mt-4 leading-relaxed">{service.description}</p>
              <h3 className="text-white font-semibold mt-8">What&apos;s Included</h3>
              <ul className="mt-4 space-y-2">
                {service.includes.map((item) => (
                  <li key={item} className="text-brand-muted flex items-start gap-2">
                    <span className="text-brand-accent mt-1">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className={index % 2 === 1 ? 'md:order-1' : ''}>
              <div className="relative h-72 rounded-xl overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  )
}
