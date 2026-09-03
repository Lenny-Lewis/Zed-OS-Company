import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { images } from '@/data/images'

const services = [
  {
    name: 'General Supplies',
    bg: 'bg-black',
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
    bg: 'bg-[#0A0F1D]',
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
    bg: 'bg-black',
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
    bg: 'bg-[#0A0F1D]',
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
    bg: 'bg-black',
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
    bg: 'bg-[#0A0F1D]',
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
    bg: 'bg-black',
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
    bg: 'bg-[#0A0F1D]',
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

      <section className="bg-black py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto bg-neutral-950 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl border border-neutral-900 max-w-4xl">
          <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-4 py-1.5 rounded-full inline-block mb-3 border border-neutral-800">
            Digital Capability
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2 tracking-tight leading-tight">
            Software Systems, Websites, Data Analytics &amp; AI-driven Workflows
          </h2>
          <p className="text-neutral-300 mt-4 leading-relaxed text-base font-normal max-w-2xl mx-auto">
            Alongside our general supply and consultancy work, we empower organizations with high-performance
            digital platforms, internal system automation, and actionable data analytics.
          </p>
        </div>
      </section>

      <section className="bg-black py-8 md:py-12 px-4 md:px-8 space-y-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Reveal key={service.name} delay={index * 60}>
              <div className="bg-neutral-950 rounded-[2.5rem] p-8 md:p-12 border border-neutral-900 shadow-2xl flex flex-col h-full justify-between hover:border-neutral-800">
                <div>
                  <div className="relative h-60 rounded-3xl overflow-hidden mb-8 bg-black border border-neutral-900">
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      className="object-cover opacity-85"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{service.name}</h2>
                  <p className="text-neutral-300 mt-3 leading-relaxed text-sm font-normal">{service.description}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-900">
                  <h3 className="text-[#FCA311] font-bold text-xs uppercase tracking-wider mb-4">What&apos;s Included</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.includes.map((item) => (
                      <li key={item} className="text-neutral-300 flex items-center gap-2 text-xs font-normal">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
