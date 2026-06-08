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
]

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="WHAT WE OFFER"
        title="Our Services"
        subtitle="End-to-end solutions for every business need."
        backgroundImage={images.pageHeroBg}
      />

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
