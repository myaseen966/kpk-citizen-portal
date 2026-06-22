'use client'

import { useEffect, useState } from 'react'

type CitizenProfile = {
  fullName: string
  cnic: string
  email: string
  mobileNumber: string
  gender: string
  dateOfBirth: string
  nationality: string
  province: string
  district: string
  tehsil: string
  address: string
  landline: string
  profilePicture: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<CitizenProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<CitizenProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Profile picture states
  const [isUploadingPic, setIsUploadingPic] = useState(false)
  const [picError, setPicError] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/dashboard/profile')
        const data = await res.json()
        setProfile(data.citizen)
        setForm(data.citizen)
        // Set preview if picture already exists
        if (data.citizen?.profilePicture) {
          setPreviewUrl(data.citizen.profilePicture)
        }
      } catch { setError('Failed to load profile.') }
      finally { setIsLoading(false) }
    }
    fetchProfile()
  }, [])

  function updateForm(field: string, value: string) {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev)
  }

  // Handle profile picture upload
  async function handlePictureUpload(file: File) {
    setPicError('')

    // Check file type — only images
    if (!file.type.startsWith('image/')) {
      setPicError('Please upload an image file (JPG, PNG, etc.)')
      return
    }

    // Check file size — max 2MB for profile picture
    if (file.size > 2 * 1024 * 1024) {
      setPicError('Image must be smaller than 2MB.')
      return
    }

    setIsUploadingPic(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setPicError(data.error || 'Upload failed.')
      } else {
        // Show preview immediately
        setPreviewUrl(data.fileUrl)
        // Update form with new picture URL
        setForm((prev) => prev ? { ...prev, profilePicture: data.fileUrl } : prev)
      }
    } catch {
      setPicError('Network error. Try again.')
    } finally {
      setIsUploadingPic(false)
    }
  }

  async function handleSave() {
    setIsSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/dashboard/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Update failed.') }
      else {
        setProfile(form)
        setSuccess('Profile updated successfully!')
        setIsEditing(false)
        // Tell the header to refresh profile data
        window.dispatchEvent(new Event('profile-updated'))
        }
    } catch { setError('Network error.') }
    finally { setIsSaving(false) }
  }

  if (isLoading) return (
    <div className="text-center py-20" style={{ color: '#6A85A6' }}>
      Loading profile...
    </div>
  )

  const inputClass = 'w-full border rounded-lg px-3 py-2 text-sm outline-none disabled:opacity-60'
  const borderStyle = { borderColor: '#839DBC' }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>My Profile</h1>
          <p className="text-sm" style={{ color: '#6A85A6' }}>View and update your information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#273F5B' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4B5D73'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#273F5B'}
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false)
                setForm(profile)
                setPreviewUrl(profile?.profilePicture || '')
                setPicError('')
              }}
              className="border text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-50"
              style={{ borderColor: '#839DBC', color: '#4B5D73' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="text-white text-sm font-semibold px-5 py-2 rounded-lg disabled:opacity-70 transition-colors"
              style={{ backgroundColor: '#0083FF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0082D7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0083FF'}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: '1px solid #839DBC' }}>

        {/* ===== PROFILE PICTURE SECTION ===== */}
        <div
          className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6"
          style={{ borderBottom: '1px solid #f0f4f8' }}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {/* Profile Picture or Initials */}
            {previewUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-md" style={{ border: '3px solid #273F5B' }}>
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md"
                style={{ backgroundColor: '#273F5B', border: '3px solid #4B5D73' }}
              >
                {profile?.fullName?.charAt(0).toUpperCase() || '?'}
              </div>
            )}

            {/* Camera icon overlay — only when editing */}
            {isEditing && (
              <button
                onClick={() => document.getElementById('profilePicInput')?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                style={{ backgroundColor: '#0083FF' }}
                title="Change profile picture"
              >
                📷
              </button>
            )}
          </div>

          {/* Name + Upload Info */}
          <div className="text-center sm:text-left">
            <div className="text-xl font-bold mb-1" style={{ color: '#273F5B' }}>
              {profile?.fullName}
            </div>
            <div className="text-sm mb-2" style={{ color: '#6A85A6' }}>
              {profile?.cnic}
            </div>

            {/* Upload button — only when editing */}
            {isEditing && (
              <div>
                <button
                  onClick={() => document.getElementById('profilePicInput')?.click()}
                  disabled={isUploadingPic}
                  className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
                  style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
                >
                  {isUploadingPic ? '⏳ Uploading...' : '📷 Change Profile Picture'}
                </button>
                <p className="text-xs mt-1" style={{ color: '#839DBC' }}>
                  JPG or PNG, max 2MB
                </p>
                {picError && (
                  <p className="text-xs mt-1" style={{ color: '#dc2626' }}>
                    ❌ {picError}
                  </p>
                )}
                {previewUrl && !isUploadingPic && previewUrl !== profile?.profilePicture && (
                  <p className="text-xs mt-1" style={{ color: '#16a34a' }}>
                    ✅ New picture ready — click Save Changes
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            id="profilePicInput"
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handlePictureUpload(file)
            }}
          />
        </div>

        {/* ===== PROFILE FIELDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {[
            { label: 'Full Name', field: 'fullName', editable: true },
            { label: 'CNIC', field: 'cnic', editable: false },
            { label: 'Email', field: 'email', editable: true },
            { label: 'Mobile Number', field: 'mobileNumber', editable: true },
            { label: 'Gender', field: 'gender', editable: false },
            { label: 'Date of Birth', field: 'dateOfBirth', editable: false, isDate: true },
            { label: 'Province', field: 'province', editable: false },
            { label: 'District', field: 'district', editable: false },
            { label: 'Landline', field: 'landline', editable: true },
            { label: 'Nationality', field: 'nationality', editable: false },
          ].map((item) => (
            <div key={item.field}>
              <label
                className="block text-xs font-medium mb-1"
                style={{ color: '#4B5D73' }}
              >
                {item.label}
              </label>
              <input
                type="text"
                value={
                  item.isDate
                    ? form?.[item.field as keyof CitizenProfile]
                      ? new Date(form[item.field as keyof CitizenProfile] as string).toLocaleDateString()
                      : ''
                    : (form?.[item.field as keyof CitizenProfile] as string) || ''
                }
                onChange={(e) => updateForm(item.field, e.target.value)}
                disabled={!isEditing || !item.editable}
                className={inputClass}
                style={{
                  ...borderStyle,
                  backgroundColor: (!isEditing || !item.editable) ? '#f0f4f8' : 'white',
                }}
                onFocus={(e) => { if (isEditing && item.editable) e.target.style.borderColor = '#0083FF' }}
                onBlur={(e) => e.target.style.borderColor = '#839DBC'}
              />
            </div>
          ))}

          {/* Address — full width */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium mb-1" style={{ color: '#4B5D73' }}>
              Address
            </label>
            <textarea
              value={(form?.address as string) || ''}
              onChange={(e) => updateForm('address', e.target.value)}
              disabled={!isEditing}
              rows={2}
              className={`${inputClass} resize-none`}
              style={{
                ...borderStyle,
                backgroundColor: !isEditing ? '#f0f4f8' : 'white',
              }}
              onFocus={(e) => { if (isEditing) e.target.style.borderColor = '#0083FF' }}
              onBlur={(e) => e.target.style.borderColor = '#839DBC'}
            />
          </div>

        </div>
      </div>
    </div>
  )
}