'use client'

import { useEffect, useState } from 'react'

type Citizen = {
  id: string
  fullName: string
  cnic: string
  email: string
  mobileNumber: string
  province: string
  district: string
  isActive: boolean
  createdAt: string
}

export default function AdminCitizensPage() {
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/citizens')
      .then((r) => r.json())
      .then((data) => { setCitizens(data.citizens || []); setIsLoading(false) })
      .catch(console.error)
  }, [])

  const filtered = citizens.filter((c) =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.cnic.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  if (isLoading) return <div className="text-center py-20" style={{ color: '#6A85A6' }}>Loading...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>Citizens</h1>
          <p className="text-sm" style={{ color: '#6A85A6' }}>All registered citizens — {citizens.length} total</p>
        </div>
        <input
          type="text"
          placeholder="Search by name, CNIC or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none w-64"
          style={{ borderColor: '#839DBC' }}
          onFocus={(e) => e.target.style.borderColor = '#0083FF'}
          onBlur={(e) => e.target.style.borderColor = '#839DBC'}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #839DBC' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#273F5B', color: 'white' }}>
              <th className="px-4 py-3 text-left">Full Name</th>
              <th className="px-4 py-3 text-left">CNIC</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">District</th>
              <th className="px-4 py-3 text-left">Registered</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8" style={{ color: '#6A85A6' }}>No citizens found.</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#273F5B' }}>{c.fullName}</td>
                  <td className="px-4 py-3" style={{ color: '#6A85A6' }}>{c.cnic}</td>
                  <td className="px-4 py-3" style={{ color: '#6A85A6' }}>{c.email}</td>
                  <td className="px-4 py-3" style={{ color: '#6A85A6' }}>{c.mobileNumber}</td>
                  <td className="px-4 py-3" style={{ color: '#6A85A6' }}>{c.district}</td>
                  <td className="px-4 py-3" style={{ color: '#6A85A6' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={c.isActive
                        ? { backgroundColor: '#f0fff4', color: '#16a34a' }
                        : { backgroundColor: '#fff1f2', color: '#dc2626' }
                      }
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}