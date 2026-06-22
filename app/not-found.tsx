// 404 PAGE
// Shows when user visits a page that doesn't exist

import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #273F5B 0%, #4B5D73 100%)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md p-10 text-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}
      >
        {/* Logo */}
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 bg-white shadow-md">
          <img
            src="/logo.png"
            alt="KPK Citizen Portal Logo"
            className="w-full h-full object-cover scale-125"
            style={{ objectPosition: 'center 30%' }}
          />
        </div>

        {/* 404 Number */}
        <div className="text-8xl font-black mb-2" style={{ color: '#E6F99B', WebkitTextStroke: `2px #273F5B` }}>
          404
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#273F5B' }}>
          Page Not Found
        </h1>
        <p className="text-sm mb-2" style={{ color: '#6A85A6' }}>
          صفحہ نہیں ملا
        </p>
        <p className="text-sm mb-8" style={{ color: '#6A85A6' }}>
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            style={{ backgroundColor: '#0083FF' }}
          >
            🏠 Go to Home
          </Link>
          <Link
            href="/dashboard"
            className="font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
            style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
          >
            📋 Go to Dashboard
          </Link>
        </div>

        <p className="text-xs mt-6" style={{ color: '#839DBC' }}>
          KPK Citizen Portal — Government of Khyber Pakhtunkhwa
        </p>
      </div>
    </div>
  )
}