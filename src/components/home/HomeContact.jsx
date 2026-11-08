'use client'

import Image from 'next/image'
import { AnimatedButton, AnimatedHeadline, LineLink } from './primitives'
import { contact } from '@/data/home'
import styles from './home.module.css'
import s from './sections.module.css'

/*
 * The close, after good-fella.com's "Start a project": the heading and a wide photo on the left; on
 * the right a short line, how to reach us, and the two ways in.
 */
export default function HomeContact() {
  return (
    <section className={styles.light} data-header-tone="light" aria-label={contact.title}>
      <div className={styles.container}>
        <div className={`${styles.grid} ${s.contactGrid}`}>
          <div className={s.contactLeft}>
            <AnimatedHeadline text={contact.title} className={styles.h2} />
            <div className={s.contactMedia}>
              <Image src={contact.image.src} alt={contact.image.alt} fill sizes="(max-width: 1023px) 100vw, 50vw" className={styles.cover} />
            </div>
          </div>
          <div className={s.contactRight}>
            <AnimatedHeadline text={contact.lead} as="h3" className={styles.h4} />
            <div className={`${styles.body} ${s.contactProse}`}>
              <p>
                <a href={`mailto:${contact.email}`} className={s.plainLink}>
                  {contact.email}
                </a>
                <br />
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className={s.plainLink}>
                  {contact.phone}
                </a>
                <br />
                {contact.where}
              </p>
            </div>
            <div className={s.contactActions}>
              <LineLink href={contact.link.href} className={styles.body}>
                {contact.link.label}
              </LineLink>
              <AnimatedButton href={contact.whatsapp.href} theme="light" size="sm" external>
                {contact.whatsapp.label}
              </AnimatedButton>
              <p className={styles.body}>{contact.note}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
