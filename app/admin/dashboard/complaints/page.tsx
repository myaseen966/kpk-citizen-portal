'use client'

import { useEffect, useState } from 'react'

type Complaint = {
  id: string
  subject: string
  category: string
  status: string
  description: string
  complaintType: string
  province: string
  district: string
  adminNote: string
  createdAt: string
  hideIdentity: boolean
  citizen: { fullName: string; cnic: string; email: string; mobileNumber: string }
}

const STATUSES = ['Pending', 'In Progress', 'Approved', 'Rejected']

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<Complaint | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    fetch('/api/admin/applications')
      .then((r) => r.json())
      .then((data) => { setComplaints(data.complaints || []); setIsLoading(false) })
      .catch(console.error)
  }, [])

  async function handleUpdateStatus() {
    if (!selected || !newStatus) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selected.id, type: 'complaint', status: newStatus, adminNote }),
      })
      if (res.ok) {
        setSuccess('Status updated and citizen notified!')
        setComplaints((prev) =>
          prev.map((c) => c.id === selected.id ? { ...c, status: newStatus, adminNote } : c)
        )
        setSelected(null)
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch { console.error('Update failed') }
    finally { setIsSaving(false) }
  }

  function statusStyle(status: string) {
    if (status === 'Approved') return { backgroundColor: '#f0fff4', color: '#16a34a' }
    if (status === 'In Progress') return { backgroundColor: '#eff6ff', color: '#0083FF' }
    if (status === 'Rejected') return { backgroundColor: '#fff1f2', color: '#dc2626' }
    return { backgroundColor: '#fefce8', color: '#ca8a04' }
  }

  const filtered = filterStatus === 'All' ? complaints : complaints.filter((c) => c.status === filterStatus)

  if (isLoading) return <div className="text-center py-20" style={{ color: '#6A85A6' }}>Loading...</div>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>Complaints</h1>
          <p className="text-sm" style={{ color: '#6A85A6' }}>Manage all citizen complaints</p>
        </div>
        {/* Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm outline-none"
          style={{ borderColor: '#839DBC', color: '#273F5B' }}
        >
          <option value="All">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
          {success}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #839DBC' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#273F5B', color: 'white' }}>
              <th className="px-4 py-3 text-left">Citizen</th>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8" style={{ color: '#6A85A6' }}>
                  No complaints found.
                </td>
              </tr>
            ) : (
              filtered.map((complaint) => (
                <tr key={complaint.id} style={{ borderBottom: '1px solid #f0f4f8' }}>
                  <td className="px-4 py-3">
                    {complaint.hideIdentity ? (
                      <span style={{ color: '#6A85A6' }}>Hidden</span>
                    ) : (
                      <div>
                        <div className="font-medium" style={{ color: '#273F5B' }}>{complaint.citizen.fullName}</div>
                        <div className="text-xs" style={{ color: '#6A85A6' }}>{complaint.citizen.cnic}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#273F5B' }}>{complaint.subject}</td>
                  <td className="px-4 py-3" style={{ color: '#6A85A6' }}>{complaint.category}</td>
                  <td className="px-4 py-3" style={{ color: '#6A85A6' }}>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={statusStyle(complaint.status)}>
                      {complaint.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { setSelected(complaint); setNewStatus(complaint.status); setAdminNote(complaint.adminNote || '') }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
                      style={{ backgroundColor: '#0083FF' }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Manage Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(39,63,91,0.7)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: '#273F5B' }}>Manage Complaint</h2>
              <button onClick={() => setSelected(null)} className="text-xl" style={{ color: '#6A85A6' }}>✕</button>
            </div>

            {/* Complaint Details */}
            <div className="rounded-xl p-4 mb-4 space-y-2" style={{ backgroundColor: '#f0f4f8' }}>
              <div><span className="text-xs font-medium" style={{ color: '#6A85A6' }}>Subject: </span><span className="text-sm" style={{ color: '#273F5B' }}>{selected.subject}</span></div>
              <div><span className="text-xs font-medium" style={{ color: '#6A85A6' }}>Category: </span><span className="text-sm" style={{ color: '#273F5B' }}>{selected.category}</span></div>
              <div><span className="text-xs font-medium" style={{ color: '#6A85A6' }}>Description: </span><span className="text-sm" style={{ color: '#273F5B' }}>{selected.description}</span></div>
              {!selected.hideIdentity && (
                <div><span className="text-xs font-medium" style={{ color: '#6A85A6' }}>Citizen: </span><span className="text-sm" style={{ color: '#273F5B' }}>{selected.citizen.fullName} — {selected.citizen.mobileNumber}</span></div>
              )}
            </div>

            {/* Update Status */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ borderColor: '#839DBC' }}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
                  Admin Note (optional — shown to citizen)
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note for the citizen..."
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ borderColor: '#839DBC' }}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm rounded-lg border"
                  style={{ borderColor: '#839DBC', color: '#4B5D73' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isSaving}
                  className="px-6 py-2 text-sm text-white font-semibold rounded-lg disabled:opacity-70"
                  style={{ backgroundColor: '#0083FF' }}
                >
                  {isSaving ? 'Saving...' : 'Update & Notify Citizen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}