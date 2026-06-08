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
    <section className="bg-brand-base py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="text-brand-accent text-xs uppercase tracking-widest">About Us</p>
          <h2 className="text-4xl font-bold text-white mt-3">
            Built on Trust. Driven by Excellence.
          </h2>
          <p className="text-brand-muted mt-6 leading-relaxed">
            Zed OS Technologies Limited is a registered Kenyan company based in Kisumu Town West,
            specializing in General Supplies and Consultancy Services. We deliver reliable,
            efficient, and professional solutions to individuals, private sector organizations,
            NGOs, and government institutions.
          </p>
          <p className="text-brand-muted mt-4 leading-relaxed">
            Our operations are guided by integrity, innovation, and customer satisfaction — with
            a commitment to quality service delivery, timely execution, and value for money
            across East Africa.
          </p>
          <Link
            href="/about"
            className="inline-block mt-8 text-brand-accent hover:text-white font-semibold transition-colors duration-200"
          >
            Learn More →
          </Link>
        </Reveal>

        <Reveal delay={120} className="space-y-4">
          <div className="relative h-56 rounded-xl overflow-hidden">
            <Image
              src={images.aboutOffice}
              alt="Modern office workspace"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-brand-card rounded-xl p-8 text-center"
              >
                <p className="text-3xl font-bold text-brand-accent">{stat.value}</p>
                <p className="text-brand-muted text-sm mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
