'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const QUICK_ACTIONS = [
  { label: 'New Application', icon: '📝', href: '/dashboard/eservices' },
  { label: 'Track Application', icon: '🔍', href: '/dashboard/applications' },
  { label: 'Complaints', icon: '📢', href: '/dashboard/complaints' },
  { label: 'Suggestions', icon: '💡', href: '/dashboard/suggestions' },
]

const SHORTCUTS = [
  { title: 'E-Services', urdu: 'ای سروسز', description: 'Apply for certificates and licenses online.', icon: '⚙️', href: '/dashboard/eservices', color: '#0083FF' },
  { title: 'Complaints', urdu: 'شکایات', description: 'Lodge a complaint against any department.', icon: '📢', href: '/dashboard/complaints', color: '#4B5D73' },
  { title: 'Suggestions', urdu: 'تجاویز', description: 'Submit ideas for governance reforms.', icon: '💡', href: '/dashboard/suggestions', color: '#6987AB' },
]

type Stats = { total: number; approved: number; inProgress: number; rejected: number }
type Notification = { id: string; message: string; type: string; isRead: boolean; createdAt: string }

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, inProgress: 0, rejected: 0 })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [citizenName, setCitizenName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch('/api/dashboard/applications')
        const data = await res.json()
        const all = [...(data.complaints || []), ...(data.suggestions || []), ...(data.eservices || [])]
        setStats({
          total: all.length,
          approved: all.filter((a) => a.status === 'Approved').length,
          inProgress: all.filter((a) => a.status === 'In Progress').length,
          rejected: all.filter((a) => a.status === 'Rejected').length,
        })
        const nRes = await fetch('/api/dashboard/notifications')
        const nData = await nRes.json()
        setNotifications(nData.notifications || [])
        setUnreadCount(nData.unreadCount || 0)
        const pRes = await fetch('/api/dashboard/profile')
        const pData = await pRes.json()
        if (pData.citizen?.fullName) setCitizenName(pData.citizen.fullName)
      } catch (err) { console.error(err) }
      finally { setIsLoading(false) }
    }
    fetchAll()
  }, [])

  async function markAllRead() {
    await fetch('/api/dashboard/notifications', { method: 'POST' })
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  function notifIcon(type: string) {
    if (type === 'success') return { icon: '✅', bg: '#f0fff4' }
    if (type === 'warning') return { icon: '⚠️', bg: '#fffbeb' }
    return { icon: 'ℹ️', bg: '#f0f4f8' }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* LEFT COLUMN */}
      <div className="flex-1 space-y-6">

        {/* Hero */}
        <div
          className="rounded-2xl p-8 text-white relative overflow-hidden min-h-36"
          style={{
            backgroundImage: "url('/background.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 rounded-2xl" style={{ backgroundColor: 'rgba(39,63,91,0.82)' }} />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-1">Welcome to KPK Citizen Portal</h1>
            {citizenName && <p className="text-sm mb-1" style={{ color: '#E6F99B' }}>Hello, {citizenName}!</p>}
            <p className="text-sm" style={{ color: '#839DBC' }}>Serving the People of Khyber Pakhtunkhwa</p>
          </div>
        </div>

        {/* Stats from DB */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Applications', value: stats.total,      icon: '📋', color: '#273F5B', bg: '#f0f4f8' },
            { label: 'Approved',           value: stats.approved,   icon: '✅', color: '#16a34a', bg: '#f0fff4' },
            { label: 'In Progress',        value: stats.inProgress, icon: '🕐', color: '#0083FF', bg: '#eff6ff' },
            { label: 'Rejected',           value: stats.rejected,   icon: '❌', color: '#dc2626', bg: '#fff1f2' },
          ].map((stat) => (
            <Link
              key={stat.label}
              href="/dashboard/applications"
              className="rounded-xl p-4 border hover:shadow-md transition-shadow"
              style={{ backgroundColor: stat.bg, borderColor: '#839DBC' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{stat.icon}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: stat.color }}>
                {isLoading ? '...' : stat.value}
              </div>
              <div className="text-xs text-gray-400 mt-1">View all →</div>
            </Link>
          ))}
        </div>

        {/* Quick Access */}
        <div>
          <h2 className="text-base font-semibold mb-3" style={{ color: '#273F5B' }}>Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SHORTCUTS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border group"
                style={{ borderColor: '#839DBC' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="text-white">{item.icon}</span>
                </div>
                <h3 className="font-bold" style={{ color: '#273F5B' }}>{item.title}</h3>
                <p className="text-xs mb-1" style={{ color: '#6A85A6' }}>{item.urdu}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="mt-3 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block" style={{ color: '#0083FF' }}>
                  Go →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Portal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: '92.4%', label: 'National Resolved Rate' },
            { value: '4.2M+', label: 'Registered Citizens' },
            { value: '20+',   label: 'Government Categories' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: '#273F5B' }}>
              <div className="text-2xl font-bold" style={{ color: '#E6F99B' }}>{s.value}</div>
              <div className="text-xs mt-1" style={{ color: '#839DBC' }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-80 space-y-6 flex-shrink-0">

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border p-5" style={{ borderColor: '#839DBC' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold" style={{ color: '#273F5B' }}>Notifications</h2>
              {unreadCount > 0 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium hover:underline" style={{ color: '#0083FF' }}>
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-2">🔔</div>
              <p className="text-sm text-gray-400">No notifications yet.</p>
              <p className="text-xs text-gray-300 mt-1">You will see updates on your applications here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => {
                const { icon, bg } = notifIcon(notif.type)
                return (
                  <div
                    key={notif.id}
                    className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: notif.isRead ? 'white' : '#f0f4f8' }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm" style={{ backgroundColor: bg }}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: '#0083FF' }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}