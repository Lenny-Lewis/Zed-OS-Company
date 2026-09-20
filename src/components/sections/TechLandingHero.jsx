'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import styles from './TechLandingHero.module.css'

const ease = [0.16, 1, 0.3, 1]
const videoUrl = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4'

export default function TechLandingHero() {
  return (
    <main className={styles.hero} data-home-hero>
      <motion.div className={styles.videoFrame} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease }}>
        <video className={styles.video} src={videoUrl} autoPlay muted loop playsInline preload="metadata" />
      </motion.div>

      <motion.section className={styles.footerArea} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1, ease }}>
        <div className={styles.content}>
          <div className={styles.copy}>
            <motion.p className={styles.eyebrow} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8, ease }}><i />Kisumu-based. Serving East Africa.</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease }}>One partner, limitless<br />possibilities. Everywhere.</motion.h1>
            <motion.div className={styles.actions} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8, ease }}>
              <Link href="/services" className={styles.primaryAction}>Explore services</Link>
              <Link href="/about" className={styles.secondaryAction}>How we work</Link>
            </motion.div>
          </div>
          <div className={styles.capabilityTags}><span>Digital Systems</span><span>AI &amp; ML</span><span>Smart Operations</span></div>
        </div>
      </motion.section>
    </main>
  )
}
