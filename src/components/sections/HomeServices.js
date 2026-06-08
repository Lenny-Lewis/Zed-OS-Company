import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import Reveal from '@/components/Reveal'

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
]

export default function HomeServices() {
  return (
    <section className="bg-brand-deep py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <Reveal className="text-center">
          <p className="text-brand-accent text-xs uppercase tracking-widest">What We Offer</p>
          <h2 className="text-4xl font-bold text-white mt-3">Our Services</h2>
          <p className="text-brand-muted mt-4 max-w-2xl mx-auto">
            End-to-end solutions tailored to every business need.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 90}>
              <div className="bg-brand-card rounded-lg overflow-hidden border-t-4 border-brand-primary hover:border-brand-accent transition-colors duration-200">
                <div className="relative h-40">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg">{service.title}</h3>
                  <p className="text-brand-muted text-sm mt-3 leading-relaxed">{service.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180} className="text-center mt-10">
          <Link
            href="/services"
            className="text-brand-accent hover:text-white font-semibold transition-colors duration-200"
          >
            View All Services →
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
