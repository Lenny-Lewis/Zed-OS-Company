import { ScrollGlobe } from '@/components/ui/landing-page'

export const metadata = {
  title: 'Services — Zed OS Technologies Limited',
  description:
    'End-to-end solutions for general supplies, fleet hire, conference facilities, supply chain consultancy, custom software, and AI analytics in Kenya and East Africa.',
}

const servicesSections = [
  {
    id: 'overview',
    title: 'End-to-End Solutions',
    subtitle: 'Supply, Logistics & Technology',
    description:
      'Zed OS Technologies delivers integrated supply chain, corporate transport, and modern technology solutions across Kenya and East Africa. One trusted partner connecting institutional procurement with cutting-edge digital execution.',
    align: 'left',
    actions: [
      { label: 'Work With Us', variant: 'primary', href: '/contact' },
      { label: 'View Products Catalogue', variant: 'secondary', href: '/products' },
    ],
  },
  {
    id: 'supplies-and-fleet',
    title: 'Supplies, Fleet & Facilities',
    subtitle: 'Dependable Foundation',
    description:
      'We handle the physical operations that keep organizations moving forward — from essential institutional supplies to reliable corporate fleet hire and full-service conference management.',
    align: 'center',
    features: [
      {
        title: 'General Supplies & PPE',
        description:
          'Office stationery, ICT equipment, ergonomic furniture, cleaning materials, electrical fittings, and certified safety gear delivered reliably.',
      },
      {
        title: 'Vehicle Hire & Fleet Services',
        description:
          'Well-maintained saloons, SUVs, and minibuses with professional drivers for corporate transfers, conferences, and field operations.',
      },
      {
        title: 'Conference & Event Facilities',
        description:
          'Fully-equipped meeting halls with state-of-the-art audio-visual setup, high-speed connectivity, and catering coordination.',
      },
    ],
  },
  {
    id: 'digital-ai',
    title: 'Software, Data & AI',
    subtitle: 'Next-Gen Intelligence',
    description:
      'We engineer custom digital platforms, automated business systems, and AI-driven workflows that eliminate manual friction, illuminate data, and scale your operational reach.',
    align: 'left',
    features: [
      {
        title: 'Custom Software Systems & Web Platforms',
        description:
          'Internal business tools, inventory tracking, role-based dashboards, and high-performance corporate web platforms.',
      },
      {
        title: 'Data Analytics & KPI Dashboards',
        description:
          'Transform raw operational data into actionable executive dashboards, trend forecasting, and reporting.',
      },
      {
        title: 'AI & Machine Learning Workflows',
        description:
          'Practical AI-driven process automation, predictive analysis models, and intelligent workflows tailored to your sector.',
      },
    ],
  },
  {
    id: 'consultancy-partnership',
    title: 'Consultancy & Impact',
    subtitle: 'Partners in Growth',
    description:
      'Beyond delivery, our consultancy practice advises on procurement strategy, vendor ecosystems, and business process optimization for institutions, corporations, and NGOs.',
    align: 'center',
    actions: [
      { label: 'Request a Consultation', variant: 'primary', href: '/contact' },
      { label: 'Become a Partner', variant: 'secondary', href: '/partner' },
    ],
  },
]

export default function ServicesPage() {
  return (
    <main className="bg-[#000000] min-h-screen text-white">
      <ScrollGlobe sections={servicesSections} className="bg-[#000000]" />
    </main>
  )
}
