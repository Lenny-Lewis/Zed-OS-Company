'use client'

import { useRouter } from 'next/navigation'
import InkOrbitHero from '@/components/ui/ink-orbit-hero'

const accents = ['Digital Systems', 'AI & ML', 'Smart Operations']

const demoSteps = [
  { label: 'Discover', detail: 'Mapping operations, systems and service gaps across your team' },
  { label: 'Design', detail: 'Scoping software, supplies and analytics around your goals' },
  { label: 'Build', detail: 'Shipping websites, digital systems and intelligent workflows' },
  { label: 'Deliver', detail: 'Training teams and handing over with clear runbooks' },
  { label: 'Support', detail: 'Monitoring, iterating and staying on call around the clock' },
]

export default function TechLandingHero() {
  const router = useRouter()

  return (
    <div data-home-hero className="bg-black">
      <InkOrbitHero
        className="ih-fullbleed"
        theme="dark"
        titleTop="One partner for"
        titleAccent={accents}
        description="Zed OS Technologies helps East African teams automate workflows, ship digital systems, and scale operations — from Kisumu to everywhere you need to be."
        primaryCta="Explore services"
        onPrimary={() => router.push('/services')}
        secondaryCta="Watch Demo"
        demoSteps={demoSteps}
        proof={{ before: 'Trusted by', value: '50+', after: 'clients across East Africa' }}
        sculptureLabel="ZED OS · 3D"
        sculptureHint="Drag to rotate · Click to reforge"
        sculptureSeed={7}
        minHeight="100svh"
      />
    </div>
  )
}
