import ServicesIndex from '@/components/services/ServicesIndex'
import { services, serviceTags } from '@/data/services'

export const metadata = {
  title: 'Services',
  description:
    'End-to-end solutions for general supplies, fleet hire, conference facilities, supply chain consultancy, custom software, data analytics and AI in Kenya and East Africa.',
}

export default function ServicesPage() {
  return (
    <ServicesIndex
      services={services}
      tags={serviceTags}
      heading="Our Services"
      stats={['Seven services. One trusted partner.', 'Based in Kisumu, serving Kenya and East Africa.']}
    />
  )
}
