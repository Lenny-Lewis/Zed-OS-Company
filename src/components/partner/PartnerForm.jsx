'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap, MOTION_OK } from '@/components/about/motion'
import Highlight from '@/components/about/Highlight'
import RollText, { ArrowDot } from '@/components/about/RollText'
import { partnerForm } from '@/data/partner'
import about from '@/components/about/About.module.css'
import styles from './Partner.module.css'

// Same Formspree form, and the same field names, as before the redesign.
const ENDPOINT = 'https://formspree.io/f/xbdeoozz'

/*
 * The partnership request form: underlined fields whose line fills white on focus, and a rolling
 * submit button. The glass emblem (now locked together) settles beside the heading.
 */
export default function PartnerForm() {
  const router = useRouter()
  const ref = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const el = ref.current
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from(el.querySelectorAll('[data-field]'), {
        y: 30,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: el.querySelector('form'), start: 'top 85%' },
      })
    })
    return () => mm.revert()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(event.currentTarget),
      })
      if (!response.ok) throw new Error(`Formspree ${response.status}`)
      router.push('/thank-you')
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
      setIsSubmitting(false)
    }
  }

  const field = (name, label, type = 'text', autoComplete) => (
    <label className={styles.field} data-field>
      <span className={styles.fieldLabel}>{label}</span>
      <input className={styles.input} type={type} name={name} required autoComplete={autoComplete} />
      <span className={styles.fieldLine} aria-hidden="true" />
    </label>
  )

  return (
    <section ref={ref} className={styles.formSection} aria-labelledby="partner-form-title">
      <div className={styles.formIntro}>
        <p className={about.label}>{partnerForm.label}</p>
        <h2 id="partner-form-title" className={about.display}>
          Start a <Highlight>conversation</Highlight>
        </h2>
        <p className={styles.formNote}>{partnerForm.note}</p>
        <div className={styles.formOrbit} data-orbit-anchor="end" aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {field('organization', 'Organization name', 'text', 'organization')}
        {field('contactPerson', 'Contact person', 'text', 'name')}
        <div className={styles.fieldPair}>
          {field('email', 'Email', 'email', 'email')}
          {field('phone', 'Phone', 'tel', 'tel')}
        </div>
        <label className={styles.field} data-field>
          <span className={styles.fieldLabel}>Partnership type</span>
          <select className={`${styles.input} ${styles.select}`} name="partnershipType" required defaultValue="">
            <option value="" disabled>
              Choose one
            </option>
            {partnerForm.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <span className={styles.fieldLine} aria-hidden="true" />
        </label>
        <label className={styles.field} data-field>
          <span className={styles.fieldLabel}>Message</span>
          <textarea className={`${styles.input} ${styles.textarea}`} name="message" rows={4} required />
          <span className={styles.fieldLine} aria-hidden="true" />
        </label>
        <input type="text" name="_gotcha" className={styles.gotcha} tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <div className={styles.formActions} data-field>
          <button type="submit" disabled={isSubmitting} className={`${about.pillLink} ${styles.submit}`}>
            <RollText text={isSubmitting ? 'Sending…' : 'Submit partnership request'} />
            <ArrowDot />
          </button>
          {error && (
            <p className={styles.formError} role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </section>
  )
}
