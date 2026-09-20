import Image from 'next/image'
import PageHero from '@/components/PageHero'
import PartnerForm from '@/components/PartnerForm'
import ScrollReveal from '@/components/ScrollReveal'
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
      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'NGOs & Development Organizations',
    description: 'Procurement support and logistics for NGOs operating across Kenya.',
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Private Sector Companies',
    description: 'Supply chain and consultancy partnerships with businesses of all sizes.',
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Individual Clients',
    description: 'Personalized supply and transport solutions for individuals and entrepreneurs.',
    icon: (
      <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      />

      <section className="bg-black px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-20">
            <ScrollReveal>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">Partnership, without friction</p>
              <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">Why Partner With Us?</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                At Zed OS Technologies Limited, we believe in building relationships, not just
                transactions. Whether you are a supplier, corporate client, NGO, or government institution,
                we offer a partnership model that creates mutual value, long-term reliability, and shared
                growth.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="relative h-64 overflow-hidden md:h-80">
                <Image
                  src={images.partnerHandshake}
                  alt="Business partnership handshake"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </ScrollReveal>
          </div>

          <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-white/15 border-y border-white/15 md:grid-cols-2 md:divide-x md:divide-y-0">
            {reasons.map((reason, index) => (
              <ScrollReveal key={reason.title} delay={index * 90}>
                <div className="h-full py-6 md:px-8 md:py-8 md:first:pl-0 md:last:pr-0">
                  <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{reason.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1400px]">
          <ScrollReveal className="mb-10 text-center">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
              Network &amp; Scope
            </span>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">Who We Work With</h2>
          </ScrollReveal>
          <div className="mt-10 grid grid-cols-1 gap-x-12 gap-y-0 divide-y divide-white/15 md:grid-cols-2 md:divide-y-0">
            {partnerTypes.map((type, index) => (
              <ScrollReveal key={type.title} delay={index * 90}>
                <div className="flex h-full gap-5 py-7 md:py-8">
                  <div className="shrink-0 pt-0.5">
                    {type.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium tracking-[-0.03em] text-white">{type.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{type.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <PartnerForm />
    </>
  )
}
