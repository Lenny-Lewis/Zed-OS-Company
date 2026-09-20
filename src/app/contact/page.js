'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import { images } from '@/data/images'
import ScrollReveal from '@/components/ScrollReveal'

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/60'

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

export default function ContactPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const response = await fetch('https://formspree.io/f/xbdeoozz', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: new FormData(e.currentTarget),
    })

    setIsSubmitting(false)

    if (response.ok) {
      setSubmitted(true)
      setForm({ fullName: '', email: '', phone: '', subject: '', message: '' })
      router.push('/thank-you')
      return
    }

    setError('Something went wrong. Please try again or email us directly.')
  }

  return (
    <>
      <PageHero
        label="REACH US"
        title="Contact Us"
        subtitle="We'd love to hear from you. Let's talk."
      />

      <section className="bg-black px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
          <ScrollReveal>
            <div className="relative mb-8 h-56 overflow-hidden md:h-64">
              <Image
                src={images.aboutOffice}
                alt="Zed OS Technologies office"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/55">We&apos;re ready to listen</p>
            <h2 className="mt-4 text-4xl font-light tracking-[-0.04em] text-white md:text-6xl">Get In Touch</h2>

            <ul className="mt-8 divide-y divide-white/15 border-y border-white/15">
              <ScrollReveal as="li" delay={80} className="flex items-center gap-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20">
                  <PhoneIcon />
                </div>
                <span className="text-sm text-white/70 md:text-base">+254 758 296 887</span>
              </ScrollReveal>
              <ScrollReveal as="li" delay={160} className="flex items-center gap-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20">
                  <EmailIcon />
                </div>
                <span className="break-all text-sm text-white/70 md:text-base">Lennoxlewis.lenny@gmail.com</span>
              </ScrollReveal>
              <ScrollReveal as="li" delay={240} className="flex items-center gap-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20">
                  <LocationIcon />
                </div>
                <span className="text-sm text-white/70 md:text-base">P.O. Box 2371-40100, Kisumu Town West, Kenya</span>
              </ScrollReveal>
              <ScrollReveal as="li" delay={320} className="flex items-center gap-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20">
                  <ClockIcon />
                </div>
                <span className="text-sm text-white/70 md:text-base">Monday – Friday, 8:00 AM – 6:00 PM EAT</span>
              </ScrollReveal>
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={120} className="border-t border-white/15 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            {submitted ? (
              <div className="text-center py-12">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-black">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-6 text-2xl font-medium text-white">Message Sent!</h3>
                <p className="mt-3 text-white/65">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
                <select
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="" className="bg-neutral-900">Subject</option>
                  <option value="General Inquiry" className="bg-neutral-900">General Inquiry</option>
                  <option value="Supply Request" className="bg-neutral-900">Supply Request</option>
                  <option value="Vehicle Hire" className="bg-neutral-900">Vehicle Hire</option>
                  <option value="Conference Booking" className="bg-neutral-900">Conference Booking</option>
                  <option value="Consultancy" className="bg-neutral-900">Consultancy</option>
                  <option value="Partnership" className="bg-neutral-900">Partnership</option>
                </select>
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/[0.04] p-4 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/60"
                />
                <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-full bg-white py-3.5 text-sm font-medium text-black transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {error ? <p className="text-red-400 text-sm text-center font-medium mt-2">{error}</p> : null}
              </form>
            )}
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
