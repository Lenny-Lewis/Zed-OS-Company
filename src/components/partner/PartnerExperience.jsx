'use client'

import OrbitEmblem from '@/components/about/OrbitEmblem'
import { AboutMarquee, AboutStatement } from '@/components/about/AboutSections'
import { AboutValues } from '@/components/about/AboutValues'
import { useSmoothScroll } from '@/components/about/useSmoothScroll'
import PartnerHero from './PartnerHero'
import PartnerAudiences from './PartnerAudiences'
import PartnerForm from './PartnerForm'
import { partnerStatement, partnerCategories, reasons } from '@/data/partner'
import about from '@/components/about/About.module.css'

/*
 * The Partner page, built from the same pieces as About: smooth scrolling, the glass emblem (whose
 * rings join in the hero, then settle by the form), highlight sweeps and rolling hovers.
 */
export default function PartnerExperience() {
  useSmoothScroll()

  return (
    <div className={about.page} data-orbit-page>
      <OrbitEmblem />
      <PartnerHero />
      <AboutStatement label="(Why partner with us)" parts={partnerStatement.parts} by={null} />
      <AboutMarquee items={partnerCategories} label="Who we partner with" />
      <AboutValues
        id="reasons-title"
        label="(Partnership, without friction)"
        titleBefore="Why "
        titleHighlight="Zed OS"
        items={reasons}
      />
      <PartnerAudiences />
      <PartnerForm />
    </div>
  )
}
