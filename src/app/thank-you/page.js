import Link from 'next/link'
import Reveal from '@/components/Reveal'

export const metadata = {
  title: 'Thank You | Zed OS Technologies Limited',
  description: 'Your message has been sent successfully.',
}

export default function ThankYouPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6 py-20">
      <Reveal className="max-w-xl w-full bg-brand-card border border-brand-primary rounded-2xl p-10 text-center">
        <p className="text-brand-accent uppercase tracking-[0.3em] text-xs mb-4">Message Received</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Thank you for reaching out.</h1>
        <p className="text-brand-muted mt-4 leading-relaxed">
          Your message has been sent successfully. We&apos;ll review it and get back to you as soon as possible.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded bg-brand-primary px-5 py-3 text-white font-semibold hover:bg-brand-accent transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded border border-brand-primary px-5 py-3 text-white font-semibold hover:border-brand-accent transition-colors"
          >
            Send Another Message
          </Link>
        </div>
      </Reveal>
    </main>
  )
}
