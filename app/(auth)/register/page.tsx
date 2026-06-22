// This is the REGISTER PAGE — accessible at: localhost:3000/register
// Full citizen registration form with all fields from the design.

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Pakistan provinces list
const PROVINCES = ['Khyber Pakhtunkhwa | KP']

// Districts for each province
const DISTRICTS: Record<string, string[]> = {
  'Khyber Pakhtunkhwa | KP': [
    'Peshawar', 'Mardan', 'Swat', 'Abbottabad', 'Mansehra',
    'Kohat', 'Nowshera', 'Charsadda', 'Haripur', 'Dir Lower',
    'Dir Upper', 'Buner', 'Swabi', 'Malakand', 'Shangla',
    'Battagram', 'Chitral', 'Karak', 'Hangu', 'Bannu',
    'Lakki Marwat', 'Tank', 'D.I. Khan', 'Orakzai',
    'Kurram', 'Khyber', 'Bajaur', 'Mohmand',
  ],
}

const OPERATORS = ['Mobilink (Jazz)', 'Ufone', 'Telenor', 'Zong', 'SCOM']

export default function RegisterPage() {
    // All form fields stored in one object
  const [form, setForm] = useState({
    area: '92', operator: '', phone: '', email: '',
    fullName: '', cnic: '', nationality: 'Pakistan',
    dateOfBirth: '', gender: 'Male', landline: '',
    password: '', confirmPassword: '',
    province: 'Khyber Pakhtunkhwa | KP', district: '',
    tehsil: '', address: '', agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

    // Updates a single field in the form object
    function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // Reset district when province changes
      ...(field === 'province' ? { district: '', tehsil: '' } : {}),
    }))
  }

    // Districts available based on selected province
  const availableDistricts = form.province ? (DISTRICTS[form.province] || []) : []

    // Runs when Register button is clicked
    async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Check terms agreed
    if (!form.agreeTerms) { setError('You must agree to the Terms and Conditions.'); return }
    
    // Check passwords match
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    // Password length check
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName, cnic: form.cnic,
          dateOfBirth: form.dateOfBirth, gender: form.gender,
          nationality: form.nationality,
          mobileNumber: `+${form.area}${form.phone}`,
          landline: form.landline, email: form.email,
          password: form.password, confirmPassword: form.confirmPassword,
          province: form.province, district: form.district,
          tehsil: form.tehsil, address: form.address,
        }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Registration failed.') }
      else { setSuccess('Registration successful! Redirecting to login...'); setTimeout(() => router.push('/login'), 2000) }
    } catch { setError('Network error. Please check your connection.') }
    finally { setIsLoading(false) }
  }

    // Reusable CSS classes for inputs
  const inputClass = 'w-full border rounded px-3 py-1.5 text-sm outline-none focus:border-[#0083FF]'
  const selectClass = 'w-full border rounded px-3 py-1.5 text-sm bg-white outline-none focus:border-[#0083FF]'
  const labelClass = 'block text-xs font-medium mb-1'
  const borderStyle = { borderColor: '#839DBC' }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4"
      style={{ background: 'linear-gradient(135deg, #273F5B 0%, #4B5D73 100%)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-2xl p-8"
        style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto bg-white shadow-md">
        <img
         src="/logo.png"
        alt="KPK Citizen Portal Logo"
        className="w-full h-full object-cover scale-135"
      />
    </div>
        </div>

        <h1 className="text-xl font-bold text-center mb-0.5" style={{ color: '#273F5B' }}>
          Register as New Member / Citizen
        </h1>
        <p className="text-center text-sm mb-5 font-medium" style={{ color: '#6A85A6' }}>
          بطور نیا شہری
        </p>

        <form onSubmit={handleRegister} className="space-y-4">

          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Area *</label>
              <select value={form.area} onChange={(e) => updateField('area', e.target.value)} className={selectClass} style={borderStyle} required>
                <option value="92">Pakistan (92)</option>
                <option value="1">USA (1)</option>
                <option value="44">UK (44)</option>
                <option value="971">UAE (971)</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Operator *</label>
              <select value={form.operator} onChange={(e) => updateField('operator', e.target.value)} className={selectClass} style={borderStyle} required>
                <option value="">Select...</option>
                {OPERATORS.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Phone *</label>
              <input type="tel" placeholder="3341234567" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className={inputClass} style={borderStyle} required autoComplete="tel" />
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Email *</label>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={(e) => updateField('email', e.target.value)} className={inputClass} style={borderStyle} required autoComplete="email" />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Full Name *</label>
              <input type="text" placeholder="Full Name" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} className={inputClass} style={borderStyle} required />
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>CNIC *</label>
              <input type="text" placeholder="12345-1234567-1" value={form.cnic} onChange={(e) => updateField('cnic', e.target.value)} className={inputClass} style={borderStyle} required autoComplete="off" />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Nationality *</label>
              <select value={form.nationality} onChange={(e) => updateField('nationality', e.target.value)} className={selectClass} style={borderStyle} required>
                <option value="Pakistan">Pakistan</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Date of Birth *</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className={inputClass} style={borderStyle} required />
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Gender *</label>
              <select value={form.gender} onChange={(e) => updateField('gender', e.target.value)} className={selectClass} style={borderStyle} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Landline</label>
              <input type="tel" placeholder="xxxxxxx" value={form.landline} onChange={(e) => updateField('landline', e.target.value)} className={inputClass} style={borderStyle} />
            </div>
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Password *</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => updateField('password', e.target.value)} className={inputClass} style={borderStyle} required />
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Confirm Password *</label>
              <input type="password" placeholder="••••••" value={form.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} className={inputClass} style={borderStyle} required />
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Province *</label>
              <select value={form.province} onChange={(e) => updateField('province', e.target.value)} className={selectClass} style={borderStyle} required>
                {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>District *</label>
              <select value={form.district} onChange={(e) => updateField('district', e.target.value)} className={selectClass} style={borderStyle} required disabled={!form.province}>
                <option value="">-- Select District --</option>
                {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass} style={{ color: '#4B5D73' }}>Tehsil</label>
              <input type="text" placeholder="Tehsil name" value={form.tehsil} onChange={(e) => updateField('tehsil', e.target.value)} className={inputClass} style={borderStyle} />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={labelClass} style={{ color: '#4B5D73' }}>Address *</label>
            <textarea placeholder="Enter address here" value={form.address} onChange={(e) => updateField('address', e.target.value)} rows={3} className={`${inputClass} resize-none`} style={borderStyle} required />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" checked={form.agreeTerms} onChange={(e) => updateField('agreeTerms', e.target.checked)} />
            <label htmlFor="terms" className="text-xs cursor-pointer" style={{ color: '#4B5D73' }}>
              I Agree to the Terms and Conditions.{' '}
              <Link href="/terms" className="font-medium hover:underline" style={{ color: '#0083FF' }}>Read</Link>
            </label>
          </div>

          {/* Captcha */}
          <div className="border rounded p-3 w-56" style={{ borderColor: '#839DBC', backgroundColor: '#f0f4f8' }}>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm" style={{ color: '#4B5D73' }}>I'm not a robot</span>
              <div className="ml-auto text-right">
                <div className="text-xs text-gray-400">reCAPTCHA</div>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">{success}</div>}

          {/* Register Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="text-white font-semibold px-8 py-2 rounded-lg transition-colors disabled:opacity-70"
              style={{ backgroundColor: '#0083FF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0082D7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0083FF'}
            >
              {isLoading ? 'Registering...' : 'Register / رجسٹر کریں'}
            </button>
          </div>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#6A85A6' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium hover:underline" style={{ color: '#0083FF' }}>Log In</Link>
        </p>
      </div>
    </div>
  )
}