'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import RollText, { ArrowDot } from '@/components/about/RollText'
import { categories } from '@/data/products'
import { useQuote } from './QuoteContext'
import about from '@/components/about/About.module.css'
import partner from '@/components/partner/Partner.module.css'
import styles from './Products.module.css'

// Same Formspree form as the partner and contact pages.
const ENDPOINT = 'https://formspree.io/f/xbdeoozz'

/*
 * The floating "Quote" button (bottom left, clear of the WhatsApp button) and the quote drawer it
 * opens: the chosen categories, the rest to add with a tap, and the request form. Escape or the
 * backdrop closes it; focus moves in when it opens and back to where it was when it closes.
 */
export default function QuoteDock() {
  const router = useRouter()
  const { ids, has, toggle, remove, clear, open, setOpen } = useQuote()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const panel = useRef(null)
  const closeButton = useRef(null)
  const returnFocus = useRef(null)

  const chosen = categories.filter((category) => ids.includes(category.id))
  const [footerInView, setFooterInView] = useState(false)
  const showButton = ids.length > 0 && !footerInView

  // Steps aside over the footer, where it would sit on top of the signup form.
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const watch = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting))
    watch.observe(footer)
    return () => watch.disconnect()
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (!open) return
    returnFocus.current = document.activeElement
    root.setAttribute('data-modal-open', '')
    closeButton.current?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
      // Keep Tab inside the drawer.
      if (event.key !== 'Tab' || !panel.current) return
      const focusable = panel.current.querySelectorAll('button, input, textarea, select, a[href]')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      root.removeAttribute('data-modal-open')
      document.removeEventListener('keydown', onKey)
      returnFocus.current?.focus?.()
    }
  }, [open, setOpen])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSending(true)
    setError('')
    try {
      const body = new FormData(event.currentTarget)
      body.append('categories', chosen.map((category) => category.title).join(', ') || 'None selected (custom request)')
      body.append('_subject', 'Product quote request')
      const response = await fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body })
      if (!response.ok) throw new Error(`Formspree ${response.status}`)
      clear()
      setOpen(false)
      router.push('/thank-you')
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
      setSending(false)
    }
  }

  const field = (name, label, type = 'text', { required = true, autoComplete } = {}) => (
    <label className={partner.field}>
      <span className={partner.fieldLabel}>
        {label}
        {!required && ' (optional)'}
      </span>
      <input className={partner.input} type={type} name={name} required={required} autoComplete={autoComplete} />
      <span className={partner.fieldLine} aria-hidden="true" />
    </label>
  )

  return (
    <>
      <button
        type="button"
        className={`${about.pillLink} ${styles.dockButton}`}
        data-show={showButton || undefined}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        tabIndex={showButton ? 0 : -1}
        aria-hidden={!showButton || undefined}
      >
        <RollText text="Quote" />
        <span className={styles.dockCount}>{ids.length}</span>
      </button>

      <div className={styles.drawerRoot} data-open={open || undefined}>
        <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />
        <div
          ref={panel}
          className={styles.drawer}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-title"
          data-lenis-prevent
          inert={!open || undefined}
        >
          <div className={styles.drawerHead}>
            <h2 id="quote-title" className={styles.drawerTitle}>
              Your quote
            </h2>
            <button ref={closeButton} type="button" className={styles.drawerClose} onClick={() => setOpen(false)}>
              <RollText text="Close" />
            </button>
          </div>

          {chosen.length ? (
            <ul className={styles.chosen}>
              {chosen.map((category) => (
                <li key={category.id} className={styles.chosenItem}>
                  <span>{category.title}</span>
                  <button type="button" className={styles.chosenRemove} onClick={() => remove(category.id)} aria-label={`Remove ${category.title}`}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.drawerEmpty}>Nothing added yet. Pick categories below, or just tell us what you need.</p>
          )}

          <div className={styles.addMore}>
            <p className={about.mono}>Add categories</p>
            <div className={styles.chips}>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={styles.chip}
                  aria-pressed={has(category.id)}
                  onClick={() => toggle(category.id)}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          <form className={styles.drawerForm} onSubmit={handleSubmit}>
            {field('name', 'Your name', 'text', { autoComplete: 'name' })}
            {field('organization', 'Organization', 'text', { required: false, autoComplete: 'organization' })}
            <div className={partner.fieldPair}>
              {field('email', 'Email', 'email', { autoComplete: 'email' })}
              {field('phone', 'Phone', 'tel', { autoComplete: 'tel' })}
            </div>
            {field('location', 'Delivery location', 'text', { autoComplete: 'address-level2' })}
            <label className={partner.field}>
              <span className={partner.fieldLabel}>Items, quantities and notes</span>
              <textarea className={`${partner.input} ${partner.textarea}`} name="message" rows={4} required placeholder="e.g. 20 office chairs, 5 laptops (i5, 8GB)…" />
              <span className={partner.fieldLine} aria-hidden="true" />
            </label>
            <input type="text" name="_gotcha" className={partner.gotcha} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button type="submit" disabled={sending} className={`${about.pillLink} ${partner.submit}`}>
              <RollText text={sending ? 'Sending…' : 'Send quote request'} />
              <ArrowDot />
            </button>
            {error && (
              <p className={partner.formError} role="alert">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
