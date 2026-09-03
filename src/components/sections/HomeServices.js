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
    <section className="bg-black py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <Reveal className="text-center">
          <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-4 py-1.5 rounded-full inline-block border border-neutral-800">
            What We Offer
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">Our Services &amp; Solutions</h2>
          <p className="text-neutral-300 mt-4 max-w-2xl mx-auto leading-relaxed text-base font-normal">
            End-to-end solutions tailored to supply, operations, and digital transformation needs.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-14">
          {services.map((service, index) => (
            <Reveal key={service.title} delay={index * 90}>
              <div className="bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-900 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group flex flex-col h-full hover:border-neutral-700">
                <div className="relative h-48 overflow-hidden bg-black">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <div className="p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xl group-hover:text-[#FCA311] transition-colors">{service.title}</h3>
                    <p className="text-neutral-300 text-sm mt-3 leading-relaxed font-normal">{service.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-bold text-white">
                    <span>Explore Solution</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180} className="text-center mt-14">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-white hover:bg-neutral-200 text-black font-bold px-8 py-4 rounded-full text-sm tracking-wide transition-all shadow-md"
          >
            <span>View All Services</span>
            <span className="text-lg">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
