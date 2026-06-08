'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass =
  'w-full bg-brand-deep border border-brand-primary rounded px-4 py-3 text-white placeholder-brand-muted focus:outline-none focus:border-brand-accent transition-colors duration-200'

export default function PartnerForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    organization: '',
    contactPerson: '',
    email: '',
    phone: '',
    partnershipType: '',
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
      setForm({
        organization: '',
        contactPerson: '',
        email: '',
        phone: '',
        partnershipType: '',
        message: '',
      })
      router.push('/thank-you')
      return
    }

    setError('Something went wrong. Please try again or email us directly.')
  }

  return (
    <section className="bg-brand-base py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center">Start a Conversation</h2>
        <p className="text-brand-muted text-center mt-4">
          Fill in the form below and our team will reach out within 24 hours.
        </p>

        {submitted ? (
          <div className="bg-brand-card rounded-xl p-8 mt-10 text-center border border-brand-accent">
            <p className="text-brand-accent font-semibold">
              Thank you! We&apos;ll review your request and be in touch within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-4">
            <input
              type="text"
              name="organization"
              placeholder="Organization Name"
              value={form.organization}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              type="text"
              name="contactPerson"
              placeholder="Contact Person"
              value={form.contactPerson}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
            <select
              name="partnershipType"
              value={form.partnershipType}
              onChange={handleChange}
              required
              className={inputClass}
            >
              <option value="">Partnership Type</option>
              <option value="Supplier">Supplier</option>
              <option value="Corporate Client">Corporate Client</option>
              <option value="NGO">NGO</option>
              <option value="Government">Government</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              name="message"
              placeholder="Message"
              rows={5}
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
              {isSubmitting ? 'Sending...' : 'Submit Partnership Request'}
            </button>
            {error ? <p className="text-red-400 text-sm text-center">{error}</p> : null}
          </form>
        )}
      </div>
    </section>
  )
}
