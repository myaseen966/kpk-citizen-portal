'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Stats = {
  totalCitizens: number
  totalComplaints: number
  totalSuggestions: number
  totalEServices: number
  pendingComplaints: number
  pendingSuggestions: number
  pendingEServices: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => { setStats(data); setIsLoading(false) })
      .catch(console.error)
  }, [])

  if (isLoading) return <div className="text-center py-20" style={{ color: '#6A85A6' }}>Loading...</div>

  const cards = [
    { label: 'Total Citizens',     value: stats?.totalCitizens,     icon: '👥', color: '#273F5B', href: '/admin/dashboard/citizens' },
    { label: 'Total Complaints',   value: stats?.totalComplaints,   icon: '📢', color: '#0083FF', href: '/admin/dashboard/complaints' },
    { label: 'Total Suggestions',  value: stats?.totalSuggestions,  icon: '💡', color: '#6987AB', href: '/admin/dashboard/suggestions' },
    { label: 'Total E-Services',   value: stats?.totalEServices,    icon: '⚙️', color: '#4B5D73', href: '/admin/dashboard/eservices' },
    { label: 'Pending Complaints', value: stats?.pendingComplaints, icon: '⏳', color: '#dc2626', href: '/admin/dashboard/complaints' },
    { label: 'Pending Suggestions',value: stats?.pendingSuggestions,icon: '⏳', color: '#ca8a04', href: '/admin/dashboard/suggestions' },
    { label: 'Pending E-Services', value: stats?.pendingEServices,  icon: '⏳', color: '#0083FF', href: '/admin/dashboard/eservices' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>Admin Dashboard</h1>
        <p className="text-sm" style={{ color: '#6A85A6' }}>Overview of all citizen applications</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow"
            style={{ border: '1px solid #839DBC' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
              style={{ backgroundColor: card.color }}
            >
              <span className="text-white text-sm">{card.icon}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: '#273F5B' }}>{card.value ?? 0}</div>
            <div className="text-xs mt-1" style={{ color: '#6A85A6' }}>{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}