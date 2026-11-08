import styles from './About.module.css'

/*
 * Hover text: every letter rolls up and a copy rolls in from below, one after another. It reacts to
 * hovering (or keyboard focus on) the nearest link, button or [data-roll-host], so wrap it in one.
 */
export default function RollText({ text, className = '' }) {
  return (
    <span className={`${styles.roll} ${className}`}>
      <span className={styles.srOnly}>{text}</span>
      <span className={styles.rollLine} aria-hidden="true">
        {Array.from(text).map((char, index) => {
          const shown = char === ' ' ? ' ' : char
          return (
            <span key={index} className={styles.rollChar} data-c={shown} style={{ '--i': index }}>
              {shown}
            </span>
          )
        })}
      </span>
    </span>
  )
}

/** Round arrow button that turns to point forward on hover. Sits inside a link or roll host. */
export function ArrowDot({ className = '' }) {
  return (
    <span className={`${styles.arrowDot} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
