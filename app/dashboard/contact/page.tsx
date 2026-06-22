// CONTACT US PAGE

'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [success, setSuccess] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSuccess('Your message has been sent. We will respond within 2-3 working days.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const inputClass = 'w-full border rounded-lg px-3 py-2 text-sm outline-none'
  const borderStyle = { borderColor: '#839DBC' }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>Contact Us</h1>
        <p className="text-sm" style={{ color: '#6A85A6' }}>Get in touch with KPK Citizen Portal support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/*Contact Form */}
        <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: '1px solid #839DBC' }}>
          <h2 className="font-bold mb-4" style={{ color: '#273F5B' }}>Send us a Message</h2>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2 mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name *', field: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email *', field: 'email', type: 'email', placeholder: 'your@email.com' },
              { label: 'Subject *', field: 'subject', type: 'text', placeholder: 'What is this about?' },
            ].map((item) => (
              <div key={item.field}>
                <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>{item.label}</label>
                <input
                  type={item.type}
                  value={form[item.field as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [item.field]: e.target.value })}
                  required
                  className={inputClass}
                  style={borderStyle}
                  placeholder={item.placeholder}
                  onFocus={(e) => e.target.style.borderColor = '#0083FF'}
                  onBlur={(e) => e.target.style.borderColor = '#839DBC'}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required rows={4}
                className={`${inputClass} resize-none`}
                style={borderStyle}
                placeholder="Describe your issue or question"
                onFocus={(e) => e.target.style.borderColor = '#0083FF'}
                onBlur={(e) => e.target.style.borderColor = '#839DBC'}
              />
            </div>
            <button
              type="submit"
              className="w-full text-white font-semibold py-2.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#0083FF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0082D7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0083FF'}
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: '1px solid #839DBC' }}>
            <h2 className="font-bold mb-4" style={{ color: '#273F5B' }}>Direct Support Contacts</h2>
            <div className="space-y-3">
              {[
                { icon: '📞', label: 'Helpline', value: '051-9000111' },
                { icon: '📧', label: 'Email', value: 'info@kpkcitizens.gov.pk' },
                { icon: '📍', label: 'Address', value: 'Chief Minister Secretariat, Peshawar, KPK' },
                { icon: '🕐', label: 'Working Hours', value: 'Monday - Friday, 9AM - 5PM' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="text-xs font-medium" style={{ color: '#6A85A6' }}>{item.label}</div>
                    <div className="text-sm" style={{ color: '#273F5B' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: '#273F5B' }}>
            <div className="text-lg font-bold text-white mb-2">KPK Citizen Portal</div>
            <div className="text-sm" style={{ color: '#839DBC' }}>
              Serving the people of Khyber Pakhtunkhwa with transparent service delivery and grievance redressal.
            </div>
            <div className="font-bold mt-3 text-sm" style={{ color: '#E6F99B' }}>عوام کی آواز</div>
          </div>
        </div>
      </div>
    </div>
  )
}