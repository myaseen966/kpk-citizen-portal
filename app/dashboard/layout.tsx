'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard',       href: '/dashboard',              icon: '🏠' },
  { label: 'Profile',         href: '/dashboard/profile',      icon: '👤' },
  { label: 'My Applications', href: '/dashboard/applications', icon: '📋' },
  { label: 'E-Services',      href: '/dashboard/eservices',    icon: '⚙️' },
  { label: 'Complaints',      href: '/dashboard/complaints',   icon: '📢' },
  { label: 'Suggestions',     href: '/dashboard/suggestions',  icon: '💡' },
  { label: 'User Manual',     href: '/dashboard/manual',       icon: '📖' },
  { label: 'Contact Us',      href: '/dashboard/contact',      icon: '📞' },
]

type SearchResult = { type: string; title: string; href: string }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(pathname !== '/dashboard')
  const [citizenName, setCitizenName] = useState('')
  const [citizenProfilePic, setCitizenProfilePic] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Fetch citizen name and profile picture for header
  useEffect(() => {
  async function fetchProfile() {
    try {
      const res = await fetch('/api/dashboard/profile')
      const data = await res.json()
      if (data.citizen?.fullName) setCitizenName(data.citizen.fullName)
      if (data.citizen?.profilePicture) setCitizenProfilePic(data.citizen.profilePicture)
      else setCitizenProfilePic('')
    } catch {}
  }

  // Fetch on first load
  fetchProfile()

  // Re-fetch whenever profile is updated from profile page
  window.addEventListener('profile-updated', fetchProfile)
  return () => window.removeEventListener('profile-updated', fetchProfile)
}, [])

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search with debounce — waits 400ms after user stops typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const res = await fetch(`/api/dashboard/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        setSearchResults(data.results || [])
        setShowResults(true)
      } catch {}
      finally { setSearchLoading(false) }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f0f4f8' }}>

      {/* ===== SIDEBAR ===== */}
      <aside
        className="flex-shrink-0 flex flex-col text-white transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: '#273F5B',
          width: sidebarOpen ? '256px' : '0px',
        }}
      >
        <div className="w-64 flex flex-col h-full">

          {/* Logo + Close Button */}
          <div
            className="flex items-center justify-between px-5 py-5"
            style={{ borderBottom: '1px solid #4B5D73' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white shadow-sm">
                <img
                  src="/logo.png"
                  alt="KPK Citizen Portal Logo"
                  className="w-full h-full object-cover scale-125"
                  style={{ objectPosition: 'center 30%' }}
                />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight text-white">KPK CITIZEN</div>
                <div className="text-xs leading-tight" style={{ color: '#E6F99B' }}>PORTAL</div>
              </div>
            </div>

            {/* X button to close sidebar */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-xl font-bold hover:text-white transition-colors ml-2"
              style={{ color: '#839DBC' }}
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-5 py-3 text-sm transition-colors"
                  style={{
                    backgroundColor: isActive ? '#0083FF' : 'transparent',
                    borderLeft: isActive ? '4px solid #E6F99B' : '4px solid transparent',
                    color: isActive ? 'white' : '#839DBC',
                    fontWeight: isActive ? '600' : 'normal',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#4B5D73'
                      e.currentTarget.style.color = 'white'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#839DBC'
                    }
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Need Help Section */}
          <div className="mx-4 mb-3 rounded-xl p-4" style={{ backgroundColor: '#4B5D73' }}>
            <div className="text-sm font-bold text-white mb-1">Need Help?</div>
            <div className="text-xs mb-3" style={{ color: '#839DBC' }}>
              We are here to assist you
            </div>
            <Link
              href="/dashboard/contact"
              className="block text-center text-xs font-bold py-2 rounded-lg transition-colors"
              style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
            >
              Contact Support
            </Link>
          </div>

        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-h-screen p-3 gap-3 overflow-hidden">

        {/* TOP HEADER */}
        <header
          className="text-white px-5 py-3 flex items-center gap-4 shadow-md rounded-2xl"
          style={{ backgroundColor: '#273F5B' }}
        >

          {/* Hamburger — toggles sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-2xl font-bold transition-colors flex-shrink-0"
            style={{ color: '#839DBC' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#E6F99B'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#839DBC'}
          >
            ☰
          </button>

          {/* Search Bar */}
          <div ref={searchRef} className="flex-1 relative max-w-lg">
            <div className="flex items-center bg-white rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Search services, applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 text-gray-700 text-sm outline-none"
              />
              <div
                className="px-4 py-2 text-white text-sm"
                style={{ backgroundColor: '#0083FF' }}
              >
                {searchLoading ? '...' : '🔍'}
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                {searchResults.map((result, i) => (
                  <Link
                    key={i}
                    href={result.href}
                    onClick={() => { setShowResults(false); setSearchQuery('') }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                      style={{ backgroundColor: '#f0f4f8', color: '#273F5B' }}
                    >
                      {result.type}
                    </span>
                    <span className="text-sm text-gray-700">{result.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* No results message */}
            {showResults && searchResults.length === 0 && searchQuery && !searchLoading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-4 text-center text-sm text-gray-400">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Right Side — Logout + User Profile */}
          <div className="flex items-center gap-3 ml-auto">

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
              style={{ backgroundColor: '#0083FF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0082D7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0083FF'}
            >
              <span>🚪</span>
              <span className="hidden md:inline">Logout</span>
            </button>

            {/* User Name + Profile Picture — clicking goes to profile */}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 rounded-xl px-3 py-1.5 transition-colors"
              style={{ backgroundColor: '#4B5D73' }}
            >
              {/* Profile Picture or Initial */}
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
              >
                {citizenProfilePic ? (
                  <img
                    src={citizenProfilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  citizenName ? citizenName.charAt(0).toUpperCase() : '?'
                )}
              </div>

              {/* Name + Role */}
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-white leading-tight">
                  {citizenName || 'Citizen'}
                </div>
                <div className="text-xs leading-tight" style={{ color: '#839DBC' }}>
                  Citizen
                </div>
              </div>
            </Link>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm p-6">
          {children}
        </main>

      </div>
    </div>
  )
}