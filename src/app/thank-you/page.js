import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

export const metadata = {
  title: 'Thank You | Zed OS Technologies Limited',
  description: 'Your message has been sent successfully.',
}

export default function ThankYouPage() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-black px-5 py-20 md:px-8 md:py-28">
      <ScrollReveal className="w-full max-w-2xl border-y border-white/15 py-12 text-center md:py-16">
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">
          Message Received
        </span>
        <h1 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white md:text-5xl">Thank you for reaching out.</h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/65">
          Your message has been sent successfully. We&apos;ll review it and get back to you as soon as possible.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-colors hover:bg-white/85"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Send Another Message
          </Link>
        </div>
      </ScrollReveal>
    </main>
  )
}
