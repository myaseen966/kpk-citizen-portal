// MY APPLICATIONS PAGE
// Shows all citizen's complaints, suggestions and e-services
// with their status: Total, Approved, In Progress, Rejected

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Type for each application item
type Application = { id: string; 
  category: string; 
  subject: string; 
  status: string; 
  createdAt: string 
}

// Type for each application item
type Stats = { total: number; 
  approved: number; 
  inProgress: number; 
  rejected: number; 
  pending: number 
}

export default function ApplicationsPage() {
  const [complaints, setComplaints] = useState<Application[]>([])
  const [suggestions, setSuggestions] = useState<Application[]>([])
  const [eservices, setEservices] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

    // Fetch all applications from the API when page loads
    useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/dashboard/applications')
        const data = await res.json()
        setComplaints(data.complaints || [])
        setSuggestions(data.suggestions || [])
        setEservices(data.eservices || [])
      } catch (err) { console.error(err) }
      finally { setIsLoading(false) }
    }
    fetchData()
  }, [])

    // Calculate stats for a list of applications
    function getStats(items: Application[]): Stats {
    return {
      total: items.length,
      approved: items.filter((i) => i.status === 'Approved').length,
      inProgress: items.filter((i) => i.status === 'In Progress').length,
      rejected: items.filter((i) => i.status === 'Rejected').length,
      pending: items.filter((i) => i.status === 'Pending').length,
    }
  }

    // Color for each status badge
    function statusStyle(status: string) {
    if (status === 'Approved') return { backgroundColor: '#f0fff4', color: '#16a34a' }
    if (status === 'In Progress') return { backgroundColor: '#eff6ff', color: '#0083FF' }
    if (status === 'Rejected') return { backgroundColor: '#fff1f2', color: '#dc2626' }
    return { backgroundColor: '#fefce8', color: '#ca8a04' }
  }

  if (isLoading) return <div className="text-center py-20" style={{ color: '#6A85A6' }}>Loading applications...</div>

    // Section component to avoid repeating code 3 times
    const Section = ({ 
      title, 
      urdu, 
      items, 
      href, 
      icon 
    }: {
    title: string; 
    urdu: string; 
    items: Application[]; 
    href: string; 
    icon: string
  }) => {
    const stats = getStats(items)
    return (
      <div className="rounded-xl shadow-sm overflow-hidden mb-6" style={{ border: '1px solid #839DBC' }}>
        <div className="text-white px-6 py-4 flex items-center justify-between" style={{ backgroundColor: '#273F5B' }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div>
              <div className="font-semibold">{title}</div>
              <div className="text-xs" style={{ color: '#839DBC' }}>{urdu}</div>
            </div>
          </div>
          <Link
            href={href}
            className="text-xs px-3 py-1 rounded-full font-semibold transition-colors"
            style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
          >
            + Add New
          </Link>
        </div>

        <div className="grid grid-cols-4 divide-x" style={{ borderBottom: '1px solid #f0f4f8' }}>
          {[
            { label: 'Total', value: stats.total, color: '#273F5B' },
            { label: 'Approved', value: stats.approved, color: '#16a34a' },
            { label: 'In Progress', value: stats.inProgress, color: '#0083FF' },
            { label: 'Rejected', value: stats.rejected, color: '#dc2626' },
          ].map((s) => (
            <div key={s.label} className="text-center py-3">
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Applications list */}
        {items.length === 0 ? (
          <div className="text-center py-8 text-sm" style={{ color: '#6A85A6' }}>
            No {title.toLowerCase()} submitted yet.
          </div>
        ) : (
          <div>
            {items.slice(0, 5).map((item) => (
              <div key={item.id} className="px-6 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #f0f4f8' }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: '#273F5B' }}>{item.subject}</div>
                  <div className="text-xs" style={{ color: '#6A85A6' }}>{item.category} • {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={statusStyle(item.status)}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>My Applications</h1>
        <p className="text-sm" style={{ color: '#6A85A6' }}>Track all your submitted applications</p>
      </div>
      <Section title="E-Services" urdu="ای سروسز" items={eservices} href="/dashboard/eservices" icon="⚙️" />
      <Section title="Complaints" urdu="شکایات" items={complaints} href="/dashboard/complaints" icon="📢" />
      <Section title="Suggestions" urdu="تجاویز" items={suggestions} href="/dashboard/suggestions" icon="💡" />
    </div>
  )
}