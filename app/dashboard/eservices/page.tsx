// E-SERVICES PAGE
// Shows 10 government services citizen can apply for

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// All 10 available e-services
const SERVICES = [
  { title: 'Domicile Certificate',          urdu: 'ڈومیسائل سرٹیفیکیٹ',      icon: '🏠' },
  { title: 'Birth Certificate',             urdu: 'پیدائش سرٹیفیکیٹ',         icon: '👶' },
  { title: 'Death Certificate',             urdu: 'وفات سرٹیفیکیٹ',           icon: '📄' },
  { title: 'Marriage Certificate',          urdu: 'نکاح نامہ',                icon: '💍' },
  { title: 'Divorce Certificate',           urdu: 'طلاق نامہ',                icon: '📋' },
  { title: 'Arms License',                  urdu: 'اسلحہ لائسنس',             icon: '🔫' },
  { title: 'Driving License',               urdu: 'ڈرائیونگ لائسنس',          icon: '🚗' },
  { title: 'Vehicle Transfer/Registration', urdu: 'گاڑی ٹرانسفر / رجسٹریشن', icon: '🚙' },
  { title: 'Character Certificate',         urdu: 'کردار سرٹیفیکیٹ',          icon: '✅' },
  { title: 'Police Verification',           urdu: 'پولیس تصدیق',              icon: '👮' },
]

export default function EServicesPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

    // Submit the e-service application
    async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/dashboard/eservices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType: selectedService, subject, description }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed.') }
      else {
        setSuccess('Application submitted successfully!')
        setSelectedService(null); setSubject(''); setDescription('')
        setTimeout(() => { setSuccess(''); router.push('/dashboard/applications') }, 2000)
      }
    } catch { setError('Network error. Try again.') }
    finally { setIsLoading(false) }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>E-Services</h1>
        <p className="text-sm" style={{ color: '#6A85A6' }}>Apply for government services online • ای سروسز</p>
      </div>

        {/* Show form if a service is selected */}
        {selectedService ? (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl" style={{ border: '1px solid #839DBC' }}>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setSelectedService(null)} className="text-xl" style={{ color: '#6A85A6' }}>←</button>
            <div>
              <h2 className="font-bold" style={{ color: '#273F5B' }}>{selectedService}</h2>
              <p className="text-xs" style={{ color: '#6A85A6' }}>Fill in the details below</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>Subject *</label>
              <input type="text" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} required
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                style={{ borderColor: '#839DBC' }}
                onFocus={(e) => e.target.style.borderColor = '#0083FF'}
                onBlur={(e) => e.target.style.borderColor = '#839DBC'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>Description *</label>
              <textarea placeholder="Describe your request in detail" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none"
                style={{ borderColor: '#839DBC' }}
                onFocus={(e) => e.target.style.borderColor = '#0083FF'}
                onBlur={(e) => e.target.style.borderColor = '#839DBC'}
              />
            </div>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">{success}</div>}
            <button type="submit" disabled={isLoading}
              className="text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-70"
              style={{ backgroundColor: '#0083FF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0082D7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0083FF'}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      ) : (
        /* Show service cards grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SERVICES.map((service) => (
            <button
              key={service.title}
              onClick={() => setSelectedService(service.title)}
              className="bg-white rounded-xl p-4 hover:shadow-md transition-all text-center group"
              style={{ border: '1px solid #839DBC' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0083FF'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#839DBC'}
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{service.icon}</div>
              <div className="text-xs font-semibold leading-tight" style={{ color: '#273F5B' }}>{service.title}</div>
              <div className="text-xs mt-1" style={{ color: '#6A85A6' }}>{service.urdu}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}