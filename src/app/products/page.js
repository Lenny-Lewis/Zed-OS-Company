import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import { images } from '@/data/images'

const categories = [
  {
    title: 'Office Supplies',
    image: images.products.office,
    alt: 'Office stationery and supplies',
    description:
      'Stationery, pens, notebooks, paper, binders, filing systems, stamps, and all office consumables.',
  },
  {
    title: 'ICT Equipment',
    image: images.products.ict,
    alt: 'Modern ICT and software development workspace',
    description:
      'Laptops, desktops, printers, scanners, networking equipment, cables, and accessories.',
  },
  {
    title: 'Furniture & Fittings',
    image: images.products.furniture,
    alt: 'Office furniture and fittings',
    description:
      'Office chairs, desks, cabinets, shelving units, reception furniture, and custom fittings.',
  },
  {
    title: 'Cleaning & Hygiene',
    image: images.products.cleaning,
    alt: 'Cleaning and hygiene products',
    description:
      'Detergents, disinfectants, mops, bins, tissue paper, hand sanitizers, and janitorial supplies.',
  },
  {
    title: 'Protective Wear',
    image: images.products.protective,
    alt: 'Protective wear and safety equipment',
    description:
      'Safety boots, helmets, reflector jackets, gloves, goggles, overalls, and PPE kits.',
  },
  {
    title: 'Electrical & Lighting',
    image: images.products.electrical,
    alt: 'Electrical and lighting supplies',
    description:
      'Bulbs, extension cords, switches, sockets, wiring materials, and backup power solutions.',
  },
]

export default function ProductsPage() {
  return (
    <>
      <PageHero
        label="PRODUCT CATALOGUE"
        title="Our Products"
        subtitle="Quality goods sourced and delivered to your doorstep."
        backgroundImage={images.pageHeroBg}
      />

      <section className="bg-black py-10 md:py-14 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-neutral-300 leading-relaxed text-base md:text-lg font-normal">
            At Zed OS Technologies Limited, we supply a wide range of quality products to businesses,
            institutions, NGOs, and government organizations across Kenya. All products are sourced
            from trusted suppliers and delivered with speed and reliability.
          </p>
        </div>
      </section>

      <section className="bg-black py-8 md:py-12 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-900 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 group flex flex-col h-full hover:border-neutral-800"
            >
              <div className="relative h-56 overflow-hidden bg-black">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-white font-bold text-2xl group-hover:text-[#FCA311] transition-colors">{category.title}</h3>
                  <p className="text-neutral-300 text-sm mt-3 leading-relaxed font-normal">{category.description}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-bold text-white">
                  <span>Inquire Now</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-12 md:py-16 px-6 md:px-12 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Need a Custom Quote?</h2>
          <p className="text-neutral-300 mt-4 max-w-xl mx-auto leading-relaxed text-base font-normal">
            Can&apos;t find what you need? We source on demand. Get in touch and we&apos;ll handle the
            procurement for you.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 bg-white hover:bg-neutral-200 text-black px-9 py-4 rounded-full font-bold text-sm tracking-wide transition-all shadow-md hover:scale-105"
          >
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  )
}
