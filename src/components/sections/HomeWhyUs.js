import Reveal from '@/components/Reveal'

const items = [
  {
    title: 'Integrity First',
    description: 'Every interaction is guided by honesty, transparency, and ethical standards.',
  },
  {
    title: 'Timely Delivery',
    description: 'We understand deadlines matter — and we deliver on time, every time.',
  },
  {
    title: 'Quality Assured',
    description: 'All products and services meet the highest standards of quality and reliability.',
  },
  {
    title: 'Competitive Pricing',
    description: 'Value for money without compromising on the quality you deserve.',
  },
  {
    title: 'Experienced Team',
    description: 'A professional team with deep expertise across supply chain and consultancy.',
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock customer support whenever you need us.',
  },
]

function CheckIcon() {
  return (
    <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white shrink-0">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    </div>
  )
}

export default function HomeWhyUs() {
  return (
    <section className="bg-black py-20 md:py-28 px-4 md:px-8">
      <div className="max-w-[1400px] mx-auto">
        <Reveal className="text-center">
          <span className="text-white text-xs font-bold uppercase tracking-widest bg-neutral-900 px-4 py-1.5 rounded-full inline-block border border-neutral-800">
            Our Edge
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">Why Clients Trust Us</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="bg-neutral-950 border border-neutral-900 rounded-3xl p-8 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 flex flex-col justify-between hover:border-neutral-800">
                <div>
                  <CheckIcon />
                  <h3 className="text-white font-bold text-xl mt-5">{item.title}</h3>
                  <p className="text-neutral-300 text-sm mt-3 leading-relaxed font-normal">{item.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
