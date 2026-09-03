import Image from 'next/image'
import PageHero from '@/components/PageHero'
import Reveal from '@/components/Reveal'
import { images } from '@/data/images'

const values = [
  {
    title: 'Integrity',
    description:
      'We conduct every interaction with honesty, transparency, and ethical standards that build lasting trust with our clients.',
  },
  {
    title: 'Innovation',
    description:
      'We continuously evolve our services and approaches to stay ahead of market trends and deliver smarter solutions.',
  },
  {
    title: 'Excellence',
    description:
      'We hold ourselves to the highest standards in every supply, vehicle, facility, and consultation we deliver.',
  },
]

const strengths = [
  'Broad supplier network',
  'Reliable and well-maintained fleet',
  'Professional and experienced team',
  'Competitive pricing',
  '24/7 customer support',
]

function StrengthIcon() {
  return (
    <svg className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="WHO WE ARE"
        title="About Zed OS Technologies"
        subtitle="Integrity. Innovation. Excellence."
        backgroundImage={images.pageHeroBg}
      />

      <section className="bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-neutral-950 rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-neutral-900">
          <Reveal>
            <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-3.5 py-1.5 rounded-full inline-block mb-3 border border-neutral-800">
              Overview
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              Delivering Excellence Across Kenya &amp; East Africa
            </h2>
            <p className="text-neutral-300 leading-relaxed text-base mt-4 font-normal">
              Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
              specializing in General Supplies and Consultancy Services. The company was established
              to provide reliable, efficient, and professional solutions to individuals, private sector
              organizations, NGOs, and government institutions.
            </p>
            <p className="text-neutral-300 mt-4 leading-relaxed text-base font-normal">
              We pride ourselves on integrity, innovation, and customer satisfaction. Our operations
              are guided by a commitment to quality service delivery, timely execution, and value for
              money.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative h-80 md:h-96 rounded-3xl overflow-hidden shadow-md border border-neutral-800">
              <Image
                src={images.aboutTeam}
                alt="Zed OS Technologies team collaborating"
                fill
                className="object-cover opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto bg-neutral-950 rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-neutral-900">
          <Reveal className="text-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-4 py-1.5 rounded-full inline-block border border-neutral-800">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">Meet the Director</h2>
          </Reveal>

          <Reveal delay={120} className="bg-neutral-900 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto mt-12 border border-neutral-800 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)] gap-8 items-center">
              <div className="relative w-full h-80 md:h-[380px] rounded-2xl overflow-hidden bg-black border border-neutral-800 shadow-sm">
                <Image
                  src={images.director}
                  alt="Lennox Lewis Odhiambo, Founder and Director"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Lennox Lewis Odhiambo</h3>
                <p className="text-[#FCA311] font-bold mt-1 text-sm tracking-wide uppercase">Founder &amp; Director</p>
                <p className="text-neutral-300 mt-5 leading-relaxed text-sm font-normal">
                  Lennox Lewis Odhiambo is a highly motivated and visionary Director with an excellent
                  background in supply chain management and business consultation. Under his leadership,
                  Zed OS Technologies Limited has grown steadily, establishing itself as a reliable
                  partner in delivering high-quality products and services. His commitment to excellence
                  and innovation drives the company&apos;s mission to provide solutions that meet and exceed
                  customer expectations.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-black py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <Reveal className="text-center">
            <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-4 py-1.5 rounded-full inline-block border border-neutral-800">
              What Drives Us
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">Our Core Values</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 90}>
                <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-neutral-800">
                  <h3 className="text-white font-extrabold text-2xl">{value.title}</h3>
                  <p className="text-neutral-300 text-sm mt-4 leading-relaxed font-normal">{value.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
