'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import { images } from '@/data/images'

const inputClass =
  'w-full bg-brand-deep border border-brand-primary rounded px-4 py-3 text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors duration-200'

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-5 h-5 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        backgroundImage={images.pageHeroBg}
      />

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 py-20 px-6">
        <div>
          <div className="relative h-48 rounded-xl overflow-hidden mb-8">
            <Image
              src={images.aboutOffice}
              alt="Zed OS Technologies office"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <h2 className="text-2xl font-bold text-white">Get In Touch</h2>

          <ul className="mt-8 space-y-6">
            <li className="flex items-start gap-3">
              <PhoneIcon />
              <span className="text-brand-muted">+254 758 296 887</span>
            </li>
            <li className="flex items-start gap-3">
              <EmailIcon />
              <span className="text-brand-muted">Lennoxlewis.lenny@gmail.com</span>
            </li>
            <li className="flex items-start gap-3">
              <LocationIcon />
              <span className="text-brand-muted">P.O. Box 2371-40100, Kisumu Town West, Kenya</span>
            </li>
            <li className="flex items-start gap-3">
              <ClockIcon />
              <span className="text-brand-muted">Monday – Friday, 8:00 AM – 6:00 PM EAT</span>
            </li>
          </ul>

          <div className="bg-brand-card rounded-xl p-6 mt-8">
            <h3 className="text-brand-accent font-semibold mb-3">Why Contact Us?</h3>
            <ul className="space-y-2 text-brand-muted text-sm">
              <li>· Get a free quotation for your supply needs</li>
              <li>· Inquire about vehicle hire availability</li>
              <li>· Book a consultation session</li>
            </ul>
          </div>
        </div>

        <div className="bg-brand-card rounded-xl p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-xl mt-6">Message Sent!</h3>
              <p className="text-brand-muted mt-3">
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
                <option value="">Subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Supply Request">Supply Request</option>
                <option value="Vehicle Hire">Vehicle Hire</option>
                <option value="Conference Booking">Conference Booking</option>
                <option value="Consultancy">Consultancy</option>
                <option value="Partnership">Partnership</option>
              </select>
              <textarea
                name="message"
                placeholder="Message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                className={inputClass}
              />
              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-primary hover:bg-brand-accent disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded font-semibold transition-colors duration-200"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {error ? <p className="text-red-400 text-sm text-center">{error}</p> : null}
            </form>
          )}
        </div>
      </div>
    </>
  )
}
