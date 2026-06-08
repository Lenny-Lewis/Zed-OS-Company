import Image from 'next/image'
import PageHero from '@/components/PageHero'
import PartnerForm from '@/components/PartnerForm'
import Reveal from '@/components/Reveal'
import { images } from '@/data/images'

const reasons = [
  {
    title: 'Reliable Partnership',
    description: 'We show up, deliver, and follow through — every single time.',
  },
  {
    title: 'Flexible Arrangements',
    description: 'We adapt our terms, timelines, and scope to match your operational needs.',
  },
  {
    title: 'Ethical Business',
    description: 'All partnerships are governed by transparency, integrity, and professional standards.',
  },
  {
    title: 'Growth-Oriented',
    description: 'We grow with our partners, investing in relationships that create long-term value.',
  },
]

const partnerTypes = [
  {
    title: 'Government Institutions',
    description: 'Tendering and supply partnerships with national and county government bodies.',
    icon: (
      <svg className="w-10 h-10 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'NGOs & Development Organizations',
    description: 'Procurement support and logistics for NGOs operating across Kenya.',
    icon: (
      <svg className="w-10 h-10 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Private Sector Companies',
    description: 'Supply chain and consultancy partnerships with businesses of all sizes.',
    icon: (
      <svg className="w-10 h-10 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Individual Clients',
    description: 'Personalized supply and transport solutions for individuals and entrepreneurs.',
    icon: (
      <svg className="w-10 h-10 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function PartnerPage() {
  return (
    <>
      <PageHero
        label="WORK WITH US"
        title="Partner With Us"
        subtitle="Build a lasting business relationship with Zed OS Technologies."
        backgroundImage={images.pageHeroBg}
      />

      <section className="bg-brand-base py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-10">
            <Reveal>
              <h2 className="text-3xl font-bold text-white">Why Partner With Us?</h2>
              <p className="text-brand-muted mt-4 leading-relaxed">
                At Zed OS Technologies Limited, we believe in building relationships, not just
                transactions. Whether you are a supplier, corporate client, NGO, or government institution,
                we offer a partnership model that creates mutual value, long-term reliability, and shared
                growth.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div className="relative h-64 rounded-xl overflow-hidden">
              <Image
                src={images.partnerHandshake}
                alt="Business partnership handshake"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              </div>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {reasons.map((reason, index) => (
              <Reveal key={reason.title} delay={index * 90}>
                <div
                  className="bg-brand-card rounded-lg p-6 border-l-4 border-brand-accent h-full"
                >
                  <h3 className="text-white font-bold">{reason.title}</h3>
                  <p className="text-brand-muted text-sm mt-2 leading-relaxed">{reason.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-deep py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold text-white">Who We Work With</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            {partnerTypes.map((type, index) => (
              <Reveal key={type.title} delay={index * 80}>
                <div className="flex gap-4 h-full">
                  {type.icon}
                  <div>
                    <h3 className="text-white font-bold">{type.title}</h3>
                    <p className="text-brand-muted text-sm mt-2 leading-relaxed">{type.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <PartnerForm />
    </>
  )
}
