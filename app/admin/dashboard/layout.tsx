'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard',   href: '/admin/dashboard',             icon: '📊' },
  { label: 'Complaints',  href: '/admin/dashboard/complaints',  icon: '📢' },
  { label: 'Suggestions', href: '/admin/dashboard/suggestions', icon: '💡' },
  { label: 'E-Services',  href: '/admin/dashboard/eservices',   icon: '⚙️' },
  { label: 'Citizens',    href: '/admin/dashboard/citizens',    icon: '👥' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin'
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f0f4f8' }}>

      {/* Sidebar */}
      <aside className="w-64 flex flex-col flex-shrink-0" style={{ backgroundColor: '#273F5B' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid #4B5D73' }}>
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-white">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" style={{ objectPosition: 'center 30%' }} />
          </div>
          <div>
            <div className="text-xs font-bold text-white leading-tight">KPK CITIZEN</div>
            <div className="text-xs leading-tight" style={{ color: '#E6F99B' }}>ADMIN PANEL</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4">
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
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid #4B5D73' }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm transition-colors w-full"
            style={{ color: '#839DBC' }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="text-white px-6 py-4 shadow-sm" style={{ backgroundColor: '#273F5B' }}>
          <div className="font-semibold" style={{ color: '#839DBC' }}>
            KPK Citizen Portal — Admin Panel
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}