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

// Complete categories with exact sub-departments from user
const SUGGESTION_CATEGORIES: Record<string, string[]> = {
  'Auditor General of Pakistan (AGP)': [
    'Citizen Participatory Audit / شہریوں کی شرکت کا آڈٹ',
  ],
  'Banking': [
    'Account Maintenance / اکاؤنٹ کی بحالی',
    'Agent Banking / ایجنٹ بینکنگ',
    'Agricultural Loans / زرعی قرض',
    'ATM / Debit Cards / اے ٹی ایم / ڈیبٹ کارڈز',
    'Auto Loan / آٹو لون',
    'Bancassurance and 3rd Party Investment Schemes',
    'Branch Issues / برانچ کے مسائل',
    'Call Center / Phone Banking Issues',
    'Clearing / کلیئرنگ',
    'Credit Cards / کریڈٹ کارڈ',
    'E-Banking / ای - بینکنگ',
    'First Women Bank Ltd / فرسٹ ویمن بینک لمیٹڈ',
    'Home Remittances / ہوم ترسیلات',
    'House Loan / ہاؤس لون',
    'LC / BG / TC',
    'Mobile Banking / SMS Banking / Mobile App',
    'National Bank of Pakistan (NBP)',
    'Over The Counter Issues',
    'Overseas / NRPs / بیرون ملک',
    'Pension Accounts / پنشن اکاؤنٹس',
    'Personal Loan / ذاتی قرض',
    'Remittance / Clearing (Inland)',
    'Remittances through SWIFT',
    'SME Bank / ایس ایم ای بینک',
    'Utility Bill / یوٹیلیٹی بل',
    'Zarai Taraqiati Bank Limited (ZTBL)',
  ],
  'Cantonment Boards Services & POF': [
    'Abbottabad Cantonment Board',
    'Attock Cantonment Board',
    'Bahawalpur Cantonment Board',
    'Bannu Cantonment Board',
    'Cantonment Board Clifton',
    'Cantonment Board Taxila',
    'Chaklala Cantonment Board',
    'Cherat Cantonment Board',
    'D.I. Khan Cantonment Board',
    'Faisal Cantonment Board',
    'Gujranwala Cantonment Board',
    'Havelian Cantonment Board',
    'Hyderabad Cantonment Board',
    'Jhelum Cantonment Board',
    'Kamra Cantonment Board',
    'Karachi Cantonment Board',
    'Kharian Cantonment Board',
    'Kohat Cantonment Board',
    'Korangi Creek Cantonment Board',
    'Lahore Cantonment Board',
    'Loralai Cantonment Board',
    'Malir Cantonment Board',
    'Mangla Cantonment Board',
    'Manora Cantonment Board',
    'Mardan Cantonment Board',
    'Multan Cantonment Board',
    'Murree Hills Cantonment Board',
    'Nowshera Cantonment Board',
    'Okara Cantonment Board',
    'Ormara Cantonment Board',
    'Pano Aqil Cantonment Board',
    'Peshawar Cantonment Board',
    'Quetta Cantonment Board',
    'Rawalpindi Cantonment Board',
    'Risalpur Cantonment Board',
    'Sanjwal Cantonment Board',
    'Sargodha Cantonment Board',
    'Shorkot Cantonment Board',
    'Sialkot Cantonment Board',
    'Swat Cantonment Board',
    'Wah Cantonment Board',
    'Walton Cantonment Board',
    'Zhob Cantonment Board',
  ],
  'Capital Development Authority (CDA)': [
    'Building Control / بلڈنگ کنٹرول',
    'Cleanliness / صفائی',
    'Encroachment / تجاوزات',
    'Land Matters / زمین کے معاملات',
    'Market & Road Maintenance',
    'Property Matters / پراپرٹی کے معاملات',
    'Sewerage / سیوریج',
    'Street Lights / سٹریٹ لائٹ',
  ],
  'Controller General of Accounts (CGA)': [
    'Accountant General Pakistan Revenue (AGPR)',
    'Accountant General, AJK',
    'Accountant General, Balochistan',
    'Accountant General, Gilgit & Baltistan',
    'Accountant General, Khyber Pakhtunkhwa',
    'Accountant General, Punjab',
    'Accountant General, Sindh',
    'CAO GSP Quetta',
    'CAO MOFA',
    'CAO Pak Mint',
    'DAPPOD',
    'DBA Pak PWD',
    'DG Accounts Works Lahore',
    'DG MIS / FABS',
  ],
  'Development Projects': [
    'District Govt. Projects / ضلعی حکومتی منصوبے',
    'Federal Govt. Projects / وفاقی حکومت منصوبے',
    'Foreign Funded Projects / غیر ملکی حکومتی منصوبے',
    'NGO Infra-Projects / این- جی -او منصوبے',
    'Provincial Govt. Projects / صوبائی حکومتی منصوبے',
    'TMA Projects / تحصیل میونسپل منصوبے',
    'VC / NC Project / وی سی اینڈ این سی منصوبے',
  ],
  'Disaster / Emergency': [
    'Death Compensation / مالی مدد برائے اموات',
    'Earthquake / زلزلہ',
    'Floods / سیلاب',
    'Internally Displaced Persons / بے گھر افراد',
    'Rehabilitation / دوبارہ بحالی',
  ],
  'Education': [
    'Colleges / کالجز',
    'Elementary & Secondary / ایلمنٹری اینڈ سیکنڈری سکولز',
    'Higher Education Commission / ایچ ای سی',
    'Private Schools / پرائیویٹ سکولز',
    'Special Education / خصوصی تعلیم',
    'Universities / یونیورسٹیاں',
  ],
  'Energy & Power': [
    'Electricity / بجلی',
    'Gas / گیس',
    'OGDCL / او جی ڈی سی ایل',
    'OGRA / اوگرا',
    'Pakistan State Oil (PSO)',
  ],
  'Engineering / Manufacturing (EDB)': [
    'Engineering Development Board (EDB)',
  ],
  'Environment & Forest': [
    '10 Billion Tree Tsunami / دس بلین ٹری سونامی',
    'Billion Tree Tsunami / بلین ٹری سونامی',
    'Forest Cutting / جنگلات کٹائی',
    'Hospital Waste / طبی مراکزی کا فضلہ',
    'Industrial Pollution / صنعتی آلودگی',
    'Industrial Waste / صنعتی فضلہ',
  ],
  'Excise & Taxation': [
    'Financial Fraud / مالی دھوکہ دہی',
    'Islamabad Excise / اسلام آباد ایکسائز',
    'Money Laundering / منی لانڈرنگ',
    'Provincial Excise / صوبائی ایکسائز',
  ],
  'Farmer / Agriculture': [
    'Agriculture Engineering / زرعی انجینئرنگ',
    'Agriculture Loan / زرعی قرض',
    'Crop Insurance / فصل کا بیمہ',
    'Fertilizers / کھاد',
    'Kissan Card / کسان کارڈ',
    'Miscellaneous (Farmers) / متفرق',
    'Pesticides / کیڑے مارادویات',
    'Prices of Crops / Produce / فصل و اجناس کی قیمتیں',
    'Seeds / بیج',
    'Soil Conservation / مٹی کا تحفظ',
    'Water Management / واٹر مینجمنٹ',
  ],
  'FBR': [
    'Customs / کسٹم',
    'Federal Excise / وفاقی محصولات',
    'Income Tax / انکم ٹیکس',
    'Sales Tax Registration / سیلز ٹیکس',
  ],
  'Federal Employees Benevolent & Group Insurance Fund': [
    'Federal Employees Benevolent Fund',
  ],
  'FIA / Cyber Crime': [
    'Anti-Corruption / اینٹی کرپشن',
    'Banking Crimes / بینکنگ کرائمز',
    'Corporate Crime / کارپوریٹ کرائم',
    'Counter Terrorist / انسداد دہشت گردی',
    'Cyber Crime / سائبر کرائم',
    'Electricity, Gas, Oil Anti-Theft Unit',
    'Human Resource Management (HRM)',
    'Human Trafficking & Smuggling / انسانی اسمگلنگ',
    'Immigration / امیگریشن',
    'Intellectual Property Rights',
    'Interpol / انٹرپول',
  ],
  'Fisheries & Livestock': [
    'Fisheries / ماہی گیری',
    'Livestock & Dairy / لائیوسٹاک اینڈ ڈیری',
  ],
  'Health': [
    'Illegal Practice / Quacks / جعلی/ عطائی ڈاکٹرز',
    'Medical Teaching Institutes / طبی تدریسی ادارے',
    'Primary Health / بنیادی صحت',
    'Secondary Health / ثانوی صحت',
    'Spurious / Unregistered Medicines / جعلی ادویات',
  ],
  'Human Rights Violations': [
    'Human Rights Violations (General)',
  ],
  'Immigration & Passport': [
    'Blacklisting of Passport / پاسپورٹ کی بلیک لسٹنگ',
    'Diplomatic Passport / سفارتی پاسپورٹ',
    'Extension of Foreigner Visa / غیر ملکی ویزا میں توسیع',
    'Issuance of New Passport / نیا پاسپورٹ جاری کرنا',
    'Official Passport / آفیشل پاسپورٹ',
    'Pakistani Citizenship / پاکستانی شہریت',
    'Pakistani Visa / پاکستانی ویزہ',
    'Renewal of Passport / پاسپورٹ کی تجدید',
    'Renunciation of Pakistani Citizenship',
  ],
  'Investments': [
    'Banks related issues / بینک سے متعلقہ مسائل',
    'Board of Investment (BOI)',
    'National Savings (CDNS) / قومی بچت',
  ],
  'Land Grabbing / Encroachment': [
    'Govt. Land / سرکاری زمین',
    'Private Land / ذاتی زمین',
  ],
  'Land Revenue': [
    'Complaint against Land Mafia / لینڈ مافیا کے خلاف شکایت',
    'Transfer of Land / Mutation / جائیداد کی منتقلی',
  ],
  'Law & Order': [
    'Airport Security Force / ایئر پورٹ سیکورٹی',
    'Anti-Narcotics Force (ANF) / ادارہ برائے انسدادِ منشیات',
    'Motorway Police / موٹروے پولیس',
    'Pakistan Railway Police / پاکستان ریلوئے پولیس',
    'Police / پولیس',
    'Prisons / جیل خانہ جات',
    'Traffic Police / ٹریفک پولیس',
  ],
  'Licenses, Certificates & Registrations': [
    'Arm License / اسلحہ لائسنس',
    'Birth Certificate / پیدائش سرٹیفیکیٹ',
    'Death Certificate / ڈیتھ سرٹیفیکیٹ',
    'Divorce Registration / طلاق کی رجسٹریشن',
    'Domicile Certificate / ڈومیسائل سرٹیفیکیٹ',
    'Driving License / ڈرائیونگ لائسنس',
    'Fishing License / ماہی گیری کا لائسنس',
    'Marriage Certificate / میرج سرٹیفیکیٹ',
    'Medical Store License / لائسنس برائے ادویات',
    'NGO NOC / این جی او کے لئے این او سی',
    'NGO Registration / این جی او رجسٹریشن',
    'NOC for Foreign Traveler',
    'Pakistan Engineering Council (PEC)',
    'Pakistan Medical Commission (PMC)',
    'Route Permit / روٹ پرمٹ',
    'Union Registration / یونین رجسٹریشن',
    'Vehicle Fitness Certificate',
    'Vehicle Registration / گاڑیوں کا اندراج',
  ],
  'Media': [
    'Electronic Media / PEMRA / الیکٹرانک میڈیا',
    'Print Media / پرنٹ میڈیا',
    'Social Media / سوشل میڈیا',
  ],
  'Municipal Services': [
    'Cleanliness / صفائی',
    'Construction material on roads / تعمیراتی ملبہ',
    'Encroachment / تجاوزات',
    'Graveyards / قبرستان',
    'Illegal billboards / غیر قانونی بلبورڈز',
    'Illegal Construction / غیر قانونی تعمیرات',
    'Low hanging electricity wires / زمین کے نزدیک بجلی کی تاریں',
    'Parking / Adda / پارکنگ',
    'Price Control / قیمت کنٹرول',
    'Repair of Street / گلی و کوچوں کی مرمت',
    'Stray Animals / آوارہ جانور',
    'Street Lights / اسٹریٹ لائٹس',
    'Unhygienic Food / Factory / ضائع خوراک',
    'Water Connection / پانی کا کنکشن',
    'Water Supply Scheme / پانی کی فراہمی کا منصوبہ',
  ],
  'NADRA': [
    'Blocked / Impounded CNIC / بلاک شناختی کارڈ',
    'CNIC Replacement / Renewal / شناختی کی تجدید',
    'Correction / تصحیح',
    'Duplicate ID Card / ڈپلیکیٹ شناختی کارڈ',
    'Family Registration Certificate (FRC)',
    'Issuance of Form B (CRC) / فارم بی',
    'Issuance of New CNIC / شناختی کارڈ کا اجراء',
    'Juvenile Card (Under 18 ID Card)',
    'Modification in ID Card / شناختی کارڈ میں ترمیم',
    'Overseas Pakistani Card / اوورسیز پاکستانی کارڈز',
    'Updation / اپ ڈیٹ',
  ],
  'Naya Pakistan Housing': [
    'Naya Pakistan Housing Program (General)',
  ],
  'Overseas Pakistani / Call Sarzameen': [
    'Bureau of Emigration & Overseas Employment (BE&OE)',
    'Community Welfare Attaché (CWA)',
    'Directorate of Workers Education (DWE)',
    'Employees Old Age Benefit (EOBI)',
    'National Industrial Relation Commission (NIRC)',
    'Overseas Employment Corporation (OEC)',
    'Overseas Pakistani Foundation (OPF)',
    'Overseas Pakistanis & Human Resource Development',
    'Pakistan Embassy in Resident Country',
    'Pakistan Foreign Office / پاکستان کا خارجہ دفتر',
    'Workers Welfare Fund (WWF)',
  ],
  'Pakistan Telecommunication Authority (PTA)': [
    'Pakistan Telecommunication Authority (General)',
  ],
  'Poverty Alleviation and Social Safety': [
    'BISP / بینظیر انکم سپورٹ پروگرام',
    'Ehsaas Program / احساس پروگرام',
    'Pakistan Bait-ul-Mal / پاکستان بیت المال',
  ],
  "Prime Minister's Youth Program (PMYP)": [
    'PM Youth Business & Agriculture Loan Scheme',
    'Skill Development Program / سکل ڈویلپمنٹ پروگرام',
  ],
  'Provincial Development Authorities': [
    'Abbottabad Development Authority (ADA)',
    'Bahawalpur Development Authority (BDA)',
    'Balochistan Development Authority (BDA)',
    'Cholistan Development Authority (CDA)',
    'D.G Khan Development Authority (DGKDA)',
    'Dera Ismail Khan Development Authority (DIKDA)',
    'Faisalabad Development Authority (FDA)',
    'Fort Munro Development Authority (FMDA)',
    'Galliat Development Authority (GDA)',
    'Gilgit Development Authority (GDA)',
    'Gujranwala Development Authority (GDA)',
    'Gwadar Development Authority (GDA)',
    'Hyderabad Development Authority (HDA)',
    'Kaghan Development Authority (KDA)',
    'Karak Development Authority (KDA)',
    'Lahore Development Authority (LDA)',
    'Larkana Development Authority (LDA)',
    'Lyari Development Authority (LDA)',
    'Malir Development Authority (MDA)',
    'Mansehra Development Authority (MDA)',
    'Mardan Development Authority (MDA)',
    'Mirpur Development Authority (MDA)',
    'Multan Development Authority (MDA)',
    'Muzaffarabad Development Authority (MDA)',
    'Peshawar Development Authority (PDA)',
    'Quetta Development Authority (QDA)',
    'Rawalpindi Development Authority (RDA)',
    'Sargodha Development Authority (SDA)',
    'Sehwan Development Authority (SDA)',
    'Swabi Development Authority (SDA)',
    'Swat Development Authority (SDA)',
  ],
  'Public Service Commissions (PSC)': [
    'Public Service Commissions (General)',
  ],
  'Scholarships': [
    'CMMS Scholarships / سی ایم ایم ایس اسکالرشپ',
    'DFID Scholarship / ڈی ایف آئی ڈی اسکالرشپ',
    'Ehsaas Program Scholarships / احساس پروگرام اسکالرشپس',
    'Fellowship Scholarship / فیلوشپ اسکالرشپ',
    'German Academic Exchange Service',
    'Graduate Scholarship / گریجویٹ اسکالرشپ',
    'HEC Scholarships / ایچ ای سی اسکالرشپ',
    'Intermediate Scholarship / انٹرمیڈیٹ اسکالرشپ',
    'LLB Scholarships / ایل ایل بی اسکالرشپس',
    'Masters / MS Scholarships / ماسٹرز / ایم ایس اسکالرشپس',
    'Middle Scholarships / مڈل اسکالرشپس',
    'PhD Scholarship / پی ایچ ڈی اسکالرشپ',
    'Postgraduate Scholarships / پوسٹ گریجویٹ اسکالرشپس',
    'Primary Scholarships / پرائمری اسکالرشپس',
    'Rehmatul-lil-Alameen Scholarships',
    'Turkey Scholarship / ترکی اسکالرشپ',
    'Undergraduate Scholarship / انڈرگریجویٹ اسکالرشپ',
  ],
  'SECP': [
    'AMC - Mutual Funds',
    'Capital Market / سرمایہ مارکیٹ',
    'Company Registration / کمپنی رجسٹریشن',
    'Company Registration / Compliance',
    'e-Services / Technical Issues / ای خدمات',
    'Insurance / انشورنس',
    'SECP related issues / ایس ای سی پی سے متعلقہ مسائل',
    'Supervision of Listed Companies',
  ],
  'Sehat Insaf Card': [
    'Sehat Insaf Card (General)',
  ],
  'Special Technology Zones Authority': [
    'Special Technology Zones Authority (General)',
  ],
  'State Life (SLICP)': [
    'Administrative Issues / انتظامی امور',
    'Health Insurance / صحت کا بیمہ',
    'Issues Related to Policy Services / متعلقہ پالیسی خدمات',
    'Misselling & Defalcation of Premium / غلط بیانی',
  ],
  'Transport & Communications': [
    'Airports / ہوائی اڈے',
    'Bus Addas / بس اڈہ',
    'C&W Roads / سی اینڈ ڈبلیو روڈ',
    'Fares / فیرز',
    'Irrigation Roads / ایریگیشن روڈ',
    'Local Govt Roads / محکمہ بلدیات روڈ',
    'Motorways / موٹرویز',
    'NHA / قومی شاہراہیں',
    'NTC / این ٹی سی',
    'Overloading / اوورلوڈنگ',
    'Pakistan Post / پاکستان ڈاک',
    'Pakistan Telecommunication Company Limited (PTCL)',
    'PIA / پی آئی اے',
    'Ports & Shippings / بندرگاہ اور جہاز رانی',
    'Railways / ریلویز',
  ],
  'Utility Stores (USC)': [
    'Availability of Items / اشیا کی دستیابی',
    'Black Marketing / بلیک مارکیٹنگ',
    'Local Purchase / مقامی خریداری',
    'Over Charges / ضرورت سے زیادہ قیمت',
    'Price Related Issue / قیمت سے متعلق مسئلہ',
  ],
}

type Step = 'popup' | 'overview' | 'categories' | 'departments' | 'form'
type Stats = { total: number; open: number; closed: number; dropped: number }

export default function SuggestionsPage() {
  const [step, setStep] = useState<Step>('popup')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, closed: 0, dropped: 0 })

  const [suggestionType, setSuggestionType] = useState('Personal')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [tehsil, setTehsil] = useState('')
  const [suggestionAddress, setSuggestionAddress] = useState('')
  const [hideIdentity, setHideIdentity] = useState(false)

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  const districts = province ? Object.keys(PAKISTAN_LOCATIONS[province] || {}) : []
  const tehsils = province && district ? (PAKISTAN_LOCATIONS[province]?.[district] || []) : []
  const departments = selectedCategory ? (SUGGESTION_CATEGORIES[selectedCategory] || []) : []

  function handleProvinceChange(val: string) { setProvince(val); setDistrict(''); setTehsil('') }
  function handleDistrictChange(val: string) { setDistrict(val); setTehsil('') }

  async function handleFileUpload(file: File) {
    setUploadError('')
    setIsUploading(true)
    setUploadedFile(file)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setUploadError(data.error || 'Upload failed.'); setUploadedFile(null) }
      else { setAttachmentUrl(data.fileUrl) }
    } catch { setUploadError('Network error.'); setUploadedFile(null) }
    finally { setIsUploading(false) }
  }

  useEffect(() => {
    if (step === 'overview') {
      fetch('/api/dashboard/applications')
        .then((r) => r.json())
        .then((data) => {
          const s = data.suggestions || []
          setStats({
            total: s.length,
            open: s.filter((x: { status: string }) => x.status === 'Pending' || x.status === 'In Progress').length,
            closed: s.filter((x: { status: string }) => x.status === 'Approved').length,
            dropped: s.filter((x: { status: string }) => x.status === 'Rejected').length,
          })
        })
        .catch(console.error)
    }
  }, [step])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/dashboard/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          department: selectedDepartment,
          suggestionType,
          subject,
          description,
          province,
          district,
          tehsil,
          suggestionAddress,
          hideIdentity,
          attachmentUrl,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Submission failed.') }
      else { setSuccess('Suggestion submitted successfully!'); setTimeout(() => router.push('/dashboard/applications'), 2000) }
    } catch { setError('Network error.') }
    finally { setIsLoading(false) }
  }

  const selectClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400'

  return (
    <div>

      {/* POPUP */}
      {step === 'popup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: 'rgba(34,139,100,0.5)' }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-[#1ca2c4] text-white px-5 py-3">
              <span className="font-semibold text-sm">Attention / متوجہ ہوں</span>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center rounded-lg">
                  <span className="text-white text-4xl font-black">!</span>
                </div>
              </div>
              <p className="text-right text-sm text-gray-700 leading-relaxed mb-4" dir="rtl">
                آپ نے جس زمرے کا انتخاب کیا ہے وہ صرف سرکاری حکام کو تجاویز / رائے دینے کیلئے ہے۔ اس کے علاوہ اس زمرے میں کوئی دوسری سہولت نہیں دی جاتی۔ شکریہ !
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                The option you selected is only for submission of suggestions to government authorities. No other services can be availed here. Thankyou !
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => router.push('/dashboard')} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-bold rounded uppercase">CLOSE</button>
                <button onClick={() => setStep('overview')} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-bold rounded uppercase">PROCEED</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERVIEW */}
      {step === 'overview' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1a7199]">Suggestions</h1>
              <p className="text-gray-500 text-sm">تجاویز — Manage your suggestions</p>
            </div>
            <button onClick={() => setStep('categories')} className="flex items-center gap-2 bg-[#2c83bd] hover:bg-[#0a2e1e] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors">
              <span>+</span><span>NEW SUGGESTION</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Total Suggestions',   value: stats.total,   icon: '💡', color: 'bg-blue-500' },
              { label: 'Open Suggestions',    value: stats.open,    icon: '🔓', color: 'bg-pink-500' },
              { label: 'Closed Suggestions',  value: stats.closed,  icon: '✅', color: 'bg-green-500' },
              { label: 'Dropped Suggestions', value: stats.dropped, icon: '❌', color: 'bg-red-500' },
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

      {/* STEP 3: CATEGORIES */}
      {step === 'categories' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('overview')} className="text-gray-400 hover:text-gray-600 text-xl">←</button>
            <div>
              <h1 className="text-2xl font-bold text-[#0d3d28]">Select Category</h1>
              <p className="text-gray-500 text-sm">Step 1 of 3 — Choose category</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.keys(SUGGESTION_CATEGORIES).map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setStep('departments') }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-yellow-400 hover:shadow-md transition-all group"
              >
                <div className="text-sm font-semibold text-gray-700 group-hover:text-yellow-600 leading-snug">{cat}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: DEPARTMENTS */}
      {step === 'departments' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('categories')} className="text-gray-400 hover:text-gray-600 text-xl">←</button>
            <div>
              <h1 className="text-2xl font-bold text-[#0d3d28]">Select Department</h1>
              <p className="text-gray-500 text-sm">
                Step 2 of 3 — <span className="text-yellow-600 font-medium">{selectedCategory}</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => { setSelectedDepartment(dept); setStep('form') }}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-yellow-400 hover:shadow-md transition-all group flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 text-base">🏛️</div>
                <div className="text-sm font-medium text-gray-700 group-hover:text-yellow-600 leading-snug">{dept}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 5: FORM */}
      {step === 'form' && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep('departments')} className="text-gray-400 hover:text-gray-600 text-xl">←</button>
            <div>
              <h2 className="font-bold text-gray-800 text-xl">Lodge Suggestion</h2>
              <p className="text-xs text-gray-400">{selectedCategory} → {selectedDepartment}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* LEFT */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Suggestion Information & Category</h3>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600">{selectedCategory}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                  <div className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-600">{selectedDepartment}</div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Suggestion Type</label>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="suggestionType" value="Personal" checked={suggestionType === 'Personal'} onChange={(e) => setSuggestionType(e.target.value)} className="accent-yellow-500" />
                      <span className="text-sm text-gray-700">Personal Grievance - ذاتی</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="suggestionType" value="Social Responsibility" checked={suggestionType === 'Social Responsibility'} onChange={(e) => setSuggestionType(e.target.value)} className="accent-yellow-500" />
                      <span className="text-sm text-gray-700">Suggestion as Social Responsibility - سماجی ذمہ داری</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Suggestion Subject / Title *</label>
                  <input type="text" placeholder="Suggestion Subject/Title" value={subject} onChange={(e) => setSubject(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Suggestion Details *</label>
                  <textarea placeholder="Suggestion Details - Maximum 1000 words!" value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} maxLength={6000} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{description.length} / 6000 characters</p>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setHideIdentity(!hideIdentity)} className={`relative w-12 h-6 rounded-full transition-colors ${hideIdentity ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${hideIdentity ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-sm text-gray-600">Hide Identity</span>
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Suggestion Area & Location</h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Province</label>
                    <select value={province} onChange={(e) => handleProvinceChange(e.target.value)} className={selectClass}>
                      <option value="">-- Select Province --</option>
                      {Object.keys(PAKISTAN_LOCATIONS).map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">District</label>
                    <select value={district} onChange={(e) => handleDistrictChange(e.target.value)} className={selectClass} disabled={!province}>
                      <option value="">-- Select District --</option>
                      {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tehsil</label>
                    <select value={tehsil} onChange={(e) => setTehsil(e.target.value)} className={selectClass} disabled={!district}>
                      <option value="">-- Select Tehsil --</option>
                      {tehsils.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Suggestion Address</label>
                    <textarea placeholder="Suggestion Address" value={suggestionAddress} onChange={(e) => setSuggestionAddress(e.target.value)} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none" />
                  </div>
                </div>

                {/* ATTACHMENTS */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2 mb-4">Attachments</h3>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-yellow-400 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('suggFileInput')?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFileUpload(f) }}
                  >
                    {uploadedFile && !isUploading ? (
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">{uploadedFile.type.includes('image') ? '🖼️' : '📄'}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-700">{uploadedFile.name}</p>
                          <p className="text-xs text-green-600">✅ Uploaded successfully</p>
                          <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setAttachmentUrl(''); setUploadError('') }} className="text-red-400 hover:text-red-600 text-xl ml-2">✕</button>
                      </div>
                    ) : isUploading ? (
                      <div><div className="text-3xl mb-2">⏳</div><p className="text-sm text-green-600 font-medium">Uploading file...</p></div>
                    ) : (
                      <>
                        <div className="text-3xl mb-2">📎</div>
                        <p className="text-sm text-gray-500">DRAG & DROP FILES HERE!</p>
                        <p className="text-xs text-gray-400 mt-1">or click to browse</p>
                        <p className="text-xs text-gray-300 mt-1">JPG, PNG, PDF, Word — Max 5MB</p>
                      </>
                    )}
                  </div>
                  {uploadError && <p className="text-xs text-red-600 mt-2">❌ {uploadError}</p>}
                  <input id="suggFileInput" type="file" className="hidden" accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f) }} />
                </div>
              </div>
            </div>

            {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
            {success && <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">{success}</div>}

            <div className="flex justify-end mt-5">
              <button type="submit" disabled={isLoading || isUploading} className="bg-[#1a7a45] hover:bg-[#155e38] text-white font-bold px-10 py-3 rounded-xl transition-colors disabled:opacity-70 uppercase tracking-wide">
                {isLoading ? 'Submitting...' : 'LODGE SUGGESTION'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  )
}