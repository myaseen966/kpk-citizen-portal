'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const PAKISTAN_LOCATIONS: Record<string, Record<string, string[]>> = {
  'Khyber Pakhtunkhwa': {
    Peshawar: ['Peshawar City', 'Chamkani', 'Mattani', 'Regi', 'Bara'],
    Mardan: ['Mardan City', 'Takht Bhai', 'Katlang', 'Rustam'],
    Swat: ['Mingora', 'Bahrain', 'Kabal', 'Matta', 'Charbagh', 'Khwazakhela'],
    Abbottabad: ['Abbottabad City', 'Havelian', 'Lora', 'Nathiagali', 'Sherwan'],
    Mansehra: ['Mansehra City', 'Balakot', 'Oghi', 'Batagram', 'Darband'],
    Kohat: ['Kohat City', 'Lachi', 'Gumbat', 'Darra Adam Khel'],
    Nowshera: ['Nowshera City', 'Pabbi', 'Jehangira', 'Akora Khattak'],
    Charsadda: ['Charsadda City', 'Shabqadar', 'Tangi', 'Prang'],
    Haripur: ['Haripur City', 'Ghazi', 'Khanpur', 'Khalabat'],
    'Dir Lower': ['Timergara', 'Munda', 'Balambat', 'Adenzai'],
    'Dir Upper': ['Chitral', 'Drosh', 'Mastuj', 'Dir City'],
    Buner: ['Daggar', 'Totalai', 'Gagra', 'Sultanwas'],
    Swabi: ['Swabi City', 'Topi', 'Razar', 'Lahor'],
    Malakand: ['Malakand City', 'Bat Khela', 'Thana'],
    Shangla: ['Alpuri', 'Puran', 'Chakesar', 'Bisham'],
    Battagram: ['Battagram City', 'Allai', 'Ranolia'],
    Chitral: ['Chitral City', 'Drosh', 'Mastuj', 'Booni'],
    Karak: ['Karak City', 'Takht-e-Nasrati', 'Banda Daud Shah'],
    Hangu: ['Hangu City', 'Thall', 'Doaba'],
    Bannu: ['Bannu City', 'Domel', 'Miryan'],
    'Lakki Marwat': ['Lakki City', 'Serai Naurang', 'Naurang'],
    Tank: ['Tank City', 'Kot Azam'],
    'D.I. Khan': ['D.I. Khan City', 'Kulachi', 'Paharpur', 'Prova'],
    Orakzai: ['Kalaya', 'Ghiljo', 'Mamozai'],
    Kurram: ['Parachinar', 'Sadda', 'Alizai'],
    Khyber: ['Landi Kotal', 'Jamrud', 'Bar Qambar'],
    Bajaur: ['Khar', 'Nawagai', 'Mamond'],
    Mohmand: ['Ghalanai', 'Ekka Ghund', 'Pandiali'],
  },
}

const COMPLAINT_CATEGORIES = [
  { en: 'Health', ur: 'صحت' },
  { en: 'Education', ur: 'تعلیم' },
  { en: 'Municipal Services', ur: 'میونسپل سروسز' },
  { en: 'Land Revenue', ur: 'مالیہ اراضی' },
  { en: 'Land Grabbing / Encroachment', ur: 'قبضہ مافیا' },
  { en: 'Corruption / Malpractice', ur: 'بدعنوانی' },
  { en: 'Law & Order', ur: 'امن و امان' },
  { en: 'Energy & Power', ur: 'بجلی و توانائی' },
  { en: 'Farmer / Agriculture', ur: 'کسان و زراعت' },
  { en: 'Environment & Forest', ur: 'ماحولیات و جنگلات' },
  { en: 'Fisheries & Livestock', ur: 'ماہی گیری اور مال مویشی' },
  { en: 'Disaster / Emergency', ur: 'قدرتی آفات' },
  { en: 'Development Projects', ur: 'ترقیاتی منصوبے' },
  { en: 'Excise & Taxation', ur: 'محصولات و زر' },
  { en: 'Licenses, Certificates & Registrations', ur: 'لائسنس / سرٹیفیکیٹ' },
  { en: 'Transport & Communications', ur: 'آمدورفت و مواصلات' },
  { en: 'Human Rights Violations', ur: 'انسانی حقوق' },
  { en: 'Investments', ur: 'سرمایہ کاری' },
  { en: 'Media', ur: 'میڈیا' },
  { en: 'NADRA', ur: 'نادرہ' },
  { en: 'Sehat Insaf Card', ur: 'صحت انصاف کارڈ' },
  { en: 'Utility Stores (USC)', ur: 'یوٹیلیٹی اسٹورز' },
  { en: 'State Life (SLICP)', ur: 'بیمہ کاریِ زندگی' },
  { en: 'FBR', ur: 'وفاقی ادارہ برائے محصولات' },
  { en: 'Poverty Alleviation', ur: 'غربت کا خاتمہ' },
  { en: 'Overseas Pakistani', ur: 'بیرون ملک پاکستانی' },
  { en: 'Cantonment Boards & POF', ur: 'کنٹونمنٹ بورڈز' },
  { en: 'Capital Development Authority (CDA)', ur: 'سی ڈی اے' },
  { en: 'FIA / Cyber Crime', ur: 'ایف آئی اے / سائبر کرائم' },
  { en: 'Immigration & Passport', ur: 'امیگریشن و پاسپورٹ' },
  { en: 'Railways', ur: 'ریلویز' },
  { en: 'PIA', ur: 'پی آئی اے' },
  { en: 'BISP', ur: 'بینظیر انکم سپورٹ' },
  { en: 'Pakistan Post', ur: 'پاکستان ڈاک' },
  { en: 'NHA / Motorways', ur: 'قومی شاہراہیں' },
]

type Step = 'popup' | 'overview' | 'categories' | 'form'
type Stats = { total: number; open: number; closed: number; dropped: number }

export default function ComplaintsPage() {
  const [step, setStep] = useState<Step>('popup')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, closed: 0, dropped: 0 })

  // Form fields
  const [complaintType, setComplaintType] = useState('Personal Grievance')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [tehsil, setTehsil] = useState('')
  const [complaintAddress, setComplaintAddress] = useState('')
  const [hideIdentity, setHideIdentity] = useState(false)

  // File upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Submit states
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  // Districts based on selected province
  const districts = province ? Object.keys(PAKISTAN_LOCATIONS[province] || {}) : []
  // Tehsils based on selected district
  const tehsils = province && district ? (PAKISTAN_LOCATIONS[province]?.[district] || []) : []

  function handleProvinceChange(val: string) {
    setProvince(val)
    setDistrict('')
    setTehsil('')
  }

  function handleDistrictChange(val: string) {
    setDistrict(val)
    setTehsil('')
  }

  // Upload file to server
  async function handleFileUpload(file: File) {
    setUploadError('')
    setIsUploading(true)
    setUploadedFile(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadError(data.error || 'Upload failed.')
        setUploadedFile(null)
      } else {
        setAttachmentUrl(data.fileUrl)
      }
    } catch {
      setUploadError('Network error. Try again.')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  // Fetch stats when overview page loads
  useEffect(() => {
    if (step === 'overview') {
      async function fetchStats() {
        try {
          const res = await fetch('/api/dashboard/applications')
          const data = await res.json()
          const complaints = data.complaints || []
          setStats({
            total: complaints.length,
            open: complaints.filter((c: { status: string }) =>
              c.status === 'Pending' || c.status === 'In Progress').length,
            closed: complaints.filter((c: { status: string }) =>
              c.status === 'Approved').length,
            dropped: complaints.filter((c: { status: string }) =>
              c.status === 'Rejected').length,
          })
        } catch (err) { console.error(err) }
      }
      fetchStats()
    }
  }, [step])

  // Submit complaint to database
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/dashboard/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          complaintType,
          subject,
          description,
          province,
          district,
          tehsil,
          complaintAddress,
          hideIdentity,
          attachmentUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Submission failed.')
      } else {
        setSuccess('Complaint submitted successfully!')
        setTimeout(() => router.push('/dashboard/applications'), 2000)
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const selectClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400'

  return (
    <div>

      {/* ===== STEP 1: POPUP ===== */}
      {step === 'popup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(34, 139, 100, 0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#1b9da7] text-white px-5 py-3">
              <span className="font-semibold text-sm">Attention / متوجہ ہوں</span>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center rounded-lg">
                  <span className="text-white text-4xl font-black">!</span>
                </div>
              </div>
              <ul className="text-right text-sm text-gray-700 space-y-2 mb-3 list-disc list-inside leading-relaxed" dir="rtl">
                <li>کسی شخص / ادارے / نمائندے یا شہری کے خلاف ذاتی رنجش کی بنیاد پر، بغیر کسی ثبوت کے، یا بے بنیاد الزامات کے ساتھ شکایات کرنا قانوناً جرم ہے۔</li>
                <li>ایسی بے بنیاد شکایت کرنے کی صورت میں، آپ کی شناخت قانون نافذ کرنے والے اداروں کو دی جائے گی۔</li>
                <li>براہ کرم اس ذمہ داری کو سمجھتے اور قبول کرنے کے بعد ہی آگے بڑھیں۔</li>
              </ul>
              <p className="text-center text-sm font-semibold text-gray-700 mb-3">!شکریہ</p>
              <ul className="text-sm text-gray-700 space-y-2 mb-3 list-disc list-inside leading-relaxed">
                <li>Filing complaints against any individual, organization on the basis of personal animosity, without evidence constitutes a legal offense.</li>
                <li>In the event of submitting such a baseless complaint, your identity will be disclosed to law enforcement authorities.</li>
                <li>Please proceed only after understanding and accepting this responsibility.</li>
              </ul>
              <p className="text-center text-sm font-bold text-gray-700 mb-5">Thankyou !</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold rounded uppercase">CLOSE</button>
                <button onClick={() => setStep('overview')} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded uppercase">PROCEED</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== STEP 2: OVERVIEW ===== */}
      {step === 'overview' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0d3d28]">Complaints</h1>
              <p className="text-gray-500 text-sm">شکایات — Manage your complaints</p>
            </div>
            <button onClick={() => setStep('categories')} className="flex items-center gap-2 bg-[#2480b6] hover:bg-[#0a2e1e] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <span className="text-lg">+</span>
              <span>NEW COMPLAINT</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Total Complaints',   value: stats.total,   icon: '📋', color: 'bg-blue-500' },
              { label: 'Open Complaints',    value: stats.open,    icon: '🔓', color: 'bg-pink-500' },
              { label: 'Closed Complaints',  value: stats.closed,  icon: '✅', color: 'bg-green-500' },
              { label: 'Dropped Complaints', value: stats.dropped, icon: '❌', color: 'bg-red-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-white text-xl mb-4`}>{s.icon}</div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm mb-1">{s.label}</p>
                  <p className="text-4xl font-bold text-gray-800">{s.value}</p>
                </div>
                <button onClick={() => router.push('/dashboard/applications')} className="mt-4 bg-gray-800 text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-gray-700">VIEW</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== STEP 3: CATEGORIES ===== */}
      {step === 'categories' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('overview')} className="text-gray-400 hover:text-gray-600 text-xl">←</button>
            <div>
              <h1 className="text-2xl font-bold text-[#0d3d28]">Select Category</h1>
              <p className="text-gray-500 text-sm">Choose the complaint category</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {COMPLAINT_CATEGORIES.map((cat) => (
              <button
                key={cat.en}
                onClick={() => { setSelectedCategory(cat.en); setStep('form') }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-red-300 hover:shadow-md transition-all group"
              >
                <div className="text-sm font-semibold text-gray-700 group-hover:text-red-600">{cat.en}</div>
                <div className="text-xs text-gray-400 mt-1">{cat.ur}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ===== STEP 4: COMPLAINT FORM ===== */}
      {step === 'form' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('categories')} className="text-gray-400 hover:text-gray-600 text-xl">←</button>
            <div>
              <h2 className="font-bold text-gray-800 text-xl">Lodge Complaint</h2>
              <p className="text-xs text-gray-400">Category: {selectedCategory}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* LEFT: Complaint Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">
                  Complaint Information & Category
                </h3>

                {/* Category read only */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600">
                    {selectedCategory}
                  </div>
                </div>

                {/* Complaint Type */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Complaint Type</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="complaintType" value="Personal Grievance" checked={complaintType === 'Personal Grievance'} onChange={(e) => setComplaintType(e.target.value)} className="accent-red-500" />
                      <span className="text-sm text-gray-700">Personal Grievance / Complaint - ذاتی</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="complaintType" value="Social Responsibility" checked={complaintType === 'Social Responsibility'} onChange={(e) => setComplaintType(e.target.value)} className="accent-red-500" />
                      <span className="text-sm text-gray-700">Complaint as Social Responsibility - سماجی ذمہ داری</span>
                    </label>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Complaint Subject / Title *</label>
                  <input type="text" placeholder="Complaint Subject/Title" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Complaint Details *</label>
                  <textarea placeholder="Complaint Details - Maximum 1000 words!" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} maxLength={6000} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{description.length} / 6000 characters</p>
                </div>

                {/* Hide Identity Toggle */}
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setHideIdentity(!hideIdentity)} className={`relative w-12 h-6 rounded-full transition-colors ${hideIdentity ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${hideIdentity ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-gray-600">Hide Complainant Identity</span>
                </div>
              </div>

              {/* RIGHT: Location + Attachments */}
              <div className="space-y-5">

                {/* Location */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">
                    Complaint Area & Location
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Province</label>
                    <select value={province} onChange={(e) => handleProvinceChange(e.target.value)} className={selectClass}>
                      <option value="">-- Select Province --</option>
                      {Object.keys(PAKISTAN_LOCATIONS).map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
                    <select value={district} onChange={(e) => handleDistrictChange(e.target.value)} className={selectClass} disabled={!province}>
                      <option value="">-- Select District --</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tehsil</label>
                    <select value={tehsil} onChange={(e) => setTehsil(e.target.value)} className={selectClass} disabled={!district}>
                      <option value="">-- Select Tehsil --</option>
                      {tehsils.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Complaint Address</label>
                    <textarea placeholder="Complaint Address" value={complaintAddress} onChange={(e) => setComplaintAddress(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
                  </div>
                </div>

                {/* Attachments — WORKING */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-4">
                    Attachments
                  </h3>

                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('fileInput')?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const droppedFile = e.dataTransfer.files[0]
                      if (droppedFile) handleFileUpload(droppedFile)
                    }}
                  >
                    {/* Show file info after upload */}
                    {uploadedFile && !isUploading ? (
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">
                          {uploadedFile.type.includes('image') ? '🖼️' : '📄'}
                        </span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">{uploadedFile.name}</p>
                          <p className="text-xs text-green-600">✅ Uploaded successfully</p>
                          <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        {/* Remove file button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadedFile(null)
                            setAttachmentUrl('')
                            setUploadError('')
                          }}
                          className="text-red-400 hover:text-red-600 text-xl ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ) : isUploading ? (
                      // Uploading spinner
                      <div>
                        <div className="text-3xl mb-2">⏳</div>
                        <p className="text-sm text-green-600 font-medium">Uploading file...</p>
                      </div>
                    ) : (
                      // Default upload prompt
                      <>
                        <div className="text-3xl mb-2">📎</div>
                        <p className="text-sm text-gray-500">DRAG & DROP FILES HERE!</p>
                        <p className="text-xs text-gray-400 mt-1">
                          or click to browse
                        </p>
                        <p className="text-xs text-gray-300 mt-1">
                          JPG, PNG, PDF, Word — Max 5MB
                        </p>
                      </>
                    )}
                  </div>

                  {/* Upload error */}
                  {uploadError && (
                    <p className="text-xs text-red-600 mt-2">❌ {uploadError}</p>
                  )}

                  {/* Hidden file input */}
                  <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                </div>

              </div>
            </div>

            {/* Error / Success messages */}
            {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
            {success && <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">{success}</div>}

            {/* Submit Button */}
            <div className="flex justify-end mt-5">
              <button type="submit" disabled={isLoading || isUploading} className="bg-[#1a7a45] hover:bg-[#155e38] text-white font-bold px-10 py-3 rounded-xl transition-colors disabled:opacity-70 uppercase tracking-wide">
                {isLoading ? 'Submitting...' : 'LODGE COMPLAINT'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}