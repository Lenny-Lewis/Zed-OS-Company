'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatedHeadline, scramble } from './primitives'
import { faqs } from '@/data/home'
import styles from './home.module.css'
import s from './sections.module.css'

/*
 * Common questions, after good-fella.com's: the heading holds in place on the left (pinned under the
 * header on wide screens, over the list on narrow ones) while the questions scroll by. One answer is
 * open at a time; it slides open as its text scrambles into place, and the plus folds into a minus.
 */
export default function HomeFaq() {
  const [open, setOpen] = useState(-1)

  return (
    <section className={`${styles.dark} ${styles.faqPad}`} aria-label={faqs.title}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={s.faqSide}>
            <AnimatedHeadline text={faqs.title} className={styles.h2} />
          </div>
          <div className={s.faqList}>
            {faqs.items.map((item, i) => (
              <Question key={item.q} item={item} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Question({ item, open, onToggle }) {
  const id = useId()
  const answer = useRef(null)

  useEffect(() => {
    if (open) return scramble(answer.current, item.a, { duration: 0.8, reveal: true })
  }, [open, item.a])

  return (
    <div className={s.faqItem} data-open={open || undefined}>
      <button type="button" className={s.faqQuestion} aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span className={`${styles.accent} ${styles.upper}`}>{item.q}</span>
        <svg className={s.faqIcon} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path className={s.faqIconUp} d="M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
      <div id={id} className={s.faqAnswerWrap} role="region" aria-hidden={!open}>
        <div className={s.faqAnswerInner}>
          <p className={`${styles.body} ${styles.muted} ${s.faqAnswer}`}>
            <span ref={answer}>{item.a}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
