// ADMIN LOGIN PAGE
// Accessible at: localhost:3000/admin

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) { setError(data.error || 'Login failed.') }
      else { router.push('/admin/dashboard') }
    } catch { setError('Network error.') }
    finally { setIsLoading(false) }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #273F5B 0%, #4B5D73 100%)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-sm p-8"
        style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-white shadow-md">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" style={{ objectPosition: 'center 30%' }} />
        </div>

        <h1 className="text-xl font-bold text-center mb-1" style={{ color: '#273F5B' }}>
          Admin Panel
        </h1>
        <p className="text-xs text-center mb-6" style={{ color: '#6A85A6' }}>
          KPK Citizen Portal — Administration
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
              Admin Email <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="email"
              placeholder="admin@kpkcitizens.gov.pk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{ borderColor: '#839DBC' }}
              onFocus={(e) => e.target.style.borderColor = '#0083FF'}
              onBlur={(e) => e.target.style.borderColor = '#839DBC'}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
              Password <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
              style={{ borderColor: '#839DBC' }}
              onFocus={(e) => e.target.style.borderColor = '#0083FF'}
              onBlur={(e) => e.target.style.borderColor = '#839DBC'}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
            style={{ backgroundColor: '#0083FF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0082D7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0083FF'}
          >
            {isLoading ? 'Logging in...' : 'Login as Admin'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: '#6A85A6' }}>
          Default: admin@kpkcitizens.gov.pk / Admin@123
        </p>
      </div>
    </div>
  )
}