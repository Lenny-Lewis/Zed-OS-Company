'use client'

import AboutHero from './AboutHero'
import OrbitEmblem from './OrbitEmblem'
import { AboutIntro, AboutMarquee, AboutStatement, AboutOval } from './AboutSections'
import AboutStory from './AboutStory'
import { AboutValues, AboutGallery } from './AboutValues'
import { useSmoothScroll } from './useSmoothScroll'
import styles from './About.module.css'

/* The About page, with Lenis smooth scrolling and the glass emblem behind it. */
export default function AboutExperience() {
  useSmoothScroll()

  return (
    <div className={styles.page} data-orbit-page>
      <OrbitEmblem />
      <AboutHero />
      <AboutIntro />
      <AboutMarquee />
      <AboutStatement />
      <AboutOval />
      <AboutStory />
      <AboutValues />
      <AboutGallery />
    </div>
  )
}
