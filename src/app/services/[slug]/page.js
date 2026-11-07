import { notFound } from 'next/navigation'
import ServiceCase from '@/components/services/ServiceCase'
import { getNextService, getService, services } from '@/data/services'

// Only the services in src/data/services.js have pages; any other slug is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return {
    title: `${service.title} — Zed OS Technologies Limited`,
    description: `${service.tagline} ${service.intro[0]}`,
  }
}

export default async function ServicePage({ params }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()
  return <ServiceCase service={service} next={getNextService(slug)} />
}
