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
    <svg className="w-6 h-6 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}

export default function HomeWhyUs() {
  return (
    <section className="bg-brand-base py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center">
          <p className="text-brand-accent text-xs uppercase tracking-widest">Our Edge</p>
          <h2 className="text-4xl font-bold text-white mt-3">Why Clients Trust Us</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="bg-brand-card rounded-lg p-6">
                <CheckIcon />
                <h3 className="text-white font-bold mt-4">{item.title}</h3>
                <p className="text-brand-muted text-sm mt-2 leading-relaxed">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
