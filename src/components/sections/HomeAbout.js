import Image from 'next/image'
import Link from 'next/link'
import { images } from '@/data/images'
import Reveal from '@/components/Reveal'

const stats = [
  { value: '24/7', label: 'Customer Support' },
  { value: '100%', label: 'Quality Assured' },
  { value: '5+', label: 'Years Experience' },
  { value: '50+', label: 'Clients Served' },
]

export default function HomeAbout() {
  return (
    <section className="bg-black py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-neutral-950 rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-neutral-900">
        <Reveal>
          <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-3.5 py-1.5 rounded-full inline-block border border-neutral-800">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Built on Trust. <br className="hidden sm:block" />Driven by Excellence.
          </h2>
          <p className="text-neutral-300 mt-6 leading-relaxed text-base font-normal">
            Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
            specializing in General Supplies, Software Systems, Websites, Data Analytics, AI,
            Machine Learning, and Consultancy Services. We deliver reliable, efficient, and
            professional solutions to individuals, private sector organizations, NGOs, and
            government institutions.
          </p>
          <p className="text-neutral-300 mt-4 leading-relaxed text-base font-normal">
            Our operations are guided by integrity, innovation, and customer satisfaction — with
            a commitment to quality service delivery, timely execution, and value for money.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 mt-8 bg-white hover:bg-neutral-200 text-black px-7 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md"
          >
            <span>Learn More</span>
            <span className="text-lg">→</span>
          </Link>
        </Reveal>

        <Reveal delay={120} className="space-y-6">
          <div className="relative h-64 md:h-72 rounded-3xl overflow-hidden shadow-md border border-neutral-800">
            <Image
              src={images.aboutOffice}
              alt="Modern office workspace"
              fill
              className="object-cover opacity-80"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center shadow-xs"
              >
                <p className="text-3xl font-black text-white">{stat.value}</p>
                <p className="text-neutral-400 text-xs font-semibold mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
