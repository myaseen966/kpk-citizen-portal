// LOGIN PAGE — Only CNIC login

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  // Stores what user types
  const [cnic, setCnic] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

    // Runs when user clicks Login button
    async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic, password, rememberMe }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || 'Login failed.') }
      else { router.push('/dashboard') }
    } catch { setError('Network error. Please check your connection.') }
    finally { setIsLoading(false) }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #273F5B 0%, #4B5D73 100%)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-sm p-8"
        style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-white shadow-md">
      <img
        src="/logo.png"
        alt="KPK Citizen Portal Logo"
        className="w-full h-full object-cover scale-135"
      />
       </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-5 tracking-wider" style={{ color: '#273F5B' }}>
          LOG IN
        </h1>

         {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="12345-1234567-1"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
            style={{ borderColor: '#839DBC' }}
            onFocus={(e) => e.target.style.borderColor = '#0083FF'}
            onBlur={(e) => e.target.style.borderColor = '#839DBC'}
          />

          {/* Password */}
          <input
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
            style={{ borderColor: '#839DBC' }}
            onFocus={(e) => e.target.style.borderColor = '#0083FF'}
            onBlur={(e) => e.target.style.borderColor = '#839DBC'}
          />

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: '#4B5D73' }}>
              Remember me
            </label>
          </div>

          {/* Captcha */}
          <div className="border rounded-lg p-3" style={{ borderColor: '#839DBC', backgroundColor: '#f0f4f8' }}>
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm" style={{ color: '#4B5D73' }}>I'm not a robot</span>
              <div className="ml-auto text-right">
                <div className="text-xs text-gray-400">reCAPTCHA</div>
                <div className="text-xs text-gray-300">Privacy - Terms</div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-xs rounded-lg px-3 py-2 bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-70"
            style={{ backgroundColor: '#0083FF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0082D7'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0083FF'}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Bottom links */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-xs">
            <Link href="/forgot-password" className="hover:underline" style={{ color: '#0083FF' }}>
              Forgot Password?
            </Link>
          </p>
          <p className="text-xs" style={{ color: '#6A85A6' }}>
            Don't have an account?{' '}
            <Link href="/register" className="font-medium hover:underline" style={{ color: '#0083FF' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}