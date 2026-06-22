
// FORGOT PASSWORD PAGE
// Step 1: User enters CNIC + Email to verify identity
// Step 2: User sets a new password

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Step = 'verify' | 'reset' | 'success'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('verify')

  // Step 1 fields
  const [cnic, setCnic] = useState('')
  const [email, setEmail] = useState('')

  // Step 2 fields
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  // ---- Step 1: Verify CNIC + Email ----
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/verify-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic, email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Verification failed.')
      } else {
        // Identity verified — move to reset step
        setStep('reset')
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ---- Step 2: Reset Password ----
  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cnic, email, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Password reset failed.')
      } else {
        setStep('success')
        // Redirect to login after 3 seconds
        setTimeout(() => router.push('/login'), 3000)
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setIsLoading(false)
    }
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
              className="w-full h-full object-cover scale-125"
              style={{ objectPosition: 'center 30%' }}
            />
          </div>
        </div>

        {/* ---- SUCCESS STEP ---- */}
        {step === 'success' && (
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#273F5B' }}>
              Password Reset Successful!
            </h2>
            <p className="text-sm mb-4" style={{ color: '#6A85A6' }}>
              Your password has been updated. Redirecting to login...
            </p>
            <Link
              href="/login"
              className="text-sm font-medium hover:underline"
              style={{ color: '#0083FF' }}
            >
              Go to Login →
            </Link>
          </div>
        )}

        {/* ---- STEP 1: VERIFY IDENTITY ---- */}
        {step === 'verify' && (
          <>
            <h1 className="text-xl font-bold text-center mb-1" style={{ color: '#273F5B' }}>
              Forgot Password
            </h1>
            <p className="text-xs text-center mb-6" style={{ color: '#6A85A6' }}>
              Enter your CNIC and registered email to verify your identity
            </p>

            <form onSubmit={handleVerify} className="space-y-4">

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
                  CNIC Number <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="12345-1234567-1"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                  style={{ borderColor: '#839DBC' }}
                  onFocus={(e) => e.target.style.borderColor = '#0083FF'}
                  onBlur={(e) => e.target.style.borderColor = '#839DBC'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
                  Registered Email <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
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
                {isLoading ? 'Verifying...' : 'Verify Identity'}
              </button>

            </form>
          </>
        )}

        {/* ---- STEP 2: RESET PASSWORD ---- */}
        {step === 'reset' && (
          <>
            <h1 className="text-xl font-bold text-center mb-1" style={{ color: '#273F5B' }}>
              Set New Password
            </h1>
            <p className="text-xs text-center mb-6" style={{ color: '#6A85A6' }}>
              Identity verified ✅ Now set your new password
            </p>

            <form onSubmit={handleReset} className="space-y-4">

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
                  New Password <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none"
                  style={{ borderColor: '#839DBC' }}
                  onFocus={(e) => e.target.style.borderColor = '#0083FF'}
                  onBlur={(e) => e.target.style.borderColor = '#839DBC'}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
                  Confirm New Password <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>

            </form>
          </>
        )}

        {/* Back to login */}
        {step !== 'success' && (
          <p className="text-center text-xs mt-5" style={{ color: '#6A85A6' }}>
            Remember your password?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: '#0083FF' }}>
              Back to Login
            </Link>
          </p>
        )}

      </div>
    </div>
  )
}