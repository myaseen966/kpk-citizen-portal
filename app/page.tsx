// This is the MAIN PAGE — first thing users see when they visit the website.
// Right panel now has two yellow buttons:
//   - Login Here → goes to /login
//   - Register Here → goes to /register

'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f4f8' }}>

      {/* HEADER */}
      <header style={{ backgroundColor: '#273F5B' }} className="text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white">
        <img
            src="/logo.png"
            alt="KPK Citizen Portal Logo"
            className="w-full h-full object-cover scale-128 "
         />
      </div>
            <div>
              <div className="font-bold text-sm md:text-base leading-tight">KPK CITIZEN PORTAL</div>
              <div className="text-xs leading-tight" style={{ color: '#839DBC' }}>
                GOVERNMENT OF KHYBER PAKHTUNKHWA
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <div className="text-center pl-4" style={{ borderLeft: '1px solid #4B5D73' }}>
              <div className="text-xs uppercase tracking-wider" style={{ color: '#839DBC' }}>
                National Resolved Rate
              </div>
              <div className="text-xl font-bold" style={{ color: '#E6F99B' }}>92.4%</div>
            </div>
            <div className="text-center pl-4" style={{ borderLeft: '1px solid #4B5D73' }}>
              <div className="text-xs uppercase tracking-wider" style={{ color: '#839DBC' }}>
                Registered Citizens
              </div>
              <div className="text-xl font-bold" style={{ color: '#E6F99B' }}>4.2 Million+</div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">

          {/* LEFT PANEL */}
          <div
            className="text-white p-8 md:w-2/5"
            style={{ backgroundColor: '#4B5D73' }}
          >
            <h1 className="text-2xl font-bold mb-3 leading-tight">
              KPK Citizen<br />Services Portal
            </h1>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: '#839DBC' }}>
              Connecting citizens of Khyber Pakhtunkhwa directly with government authorities
              for transparent service delivery, grievances redressal, and active civic suggestions.
            </p>

            <div className="space-y-4">
              {[
                { icon: '📋', title: 'Easy Grievance Redressal', desc: 'Lodge complaints across 20+ government categories.' },
                { icon: '💻', title: 'Digital E-Services', desc: 'Apply for certificates, licenses and permissions online.' },
                { icon: '🗳️', title: 'Participatory Polling', desc: 'Submit ideas and upvote public proposals for policy reforms.' },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#6987AB' }}>
                    <span className="text-xs">{f.icon}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{f.title}</div>
                    <div className="text-xs" style={{ color: '#839DBC' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white p-10 md:w-3/5 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold mb-1" style={{ color: '#273F5B' }}>
              Welcome, Dear Citizen / Member
            </h2>
            <p className="text-sm mb-10" style={{ color: '#6A85A6' }}>
              خوش آمدید معزز شہری / ممبر
            </p>

            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center justify-between rounded-lg px-6 py-5 mb-4 group transition-colors"
              style={{ backgroundColor: '#E6F99B' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4e88a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E6F99B'}
            >
              <div>
                <span className="text-sm font-semibold block" style={{ color: '#273F5B' }}>
                  Registered Citizen/Member:
                </span>
                <span className="font-bold text-base" style={{ color: '#273F5B' }}>
                  Login Here
                </span>
              </div>
              <span className="text-2xl font-bold group-hover:translate-x-1 transition-transform" style={{ color: '#273F5B' }}>
                →
              </span>
            </Link>

            {/* Register Button */}
            <Link
              href="/register"
              className="flex items-center justify-between rounded-lg px-6 py-5 mb-10 group transition-colors"
              style={{ backgroundColor: '#E6F99B' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4e88a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E6F99B'}
            >
              <div>
                <span className="text-sm font-semibold block" style={{ color: '#273F5B' }}>
                  New Citizen/Member:
                </span>
                <span className="font-bold text-base" style={{ color: '#273F5B' }}>
                  Register Here
                </span>
              </div>
              <span className="text-2xl font-bold group-hover:translate-x-1 transition-transform" style={{ color: '#273F5B' }}>
                →
              </span>
            </Link>

            <Link href="/contact" className="font-bold text-sm tracking-wide hover:underline" style={{ color: '#0083FF' }}>
              NEED HELP ? CONTACT US
            </Link>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-white py-8 px-4" style={{ backgroundColor: '#273F5B' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 uppercase text-xs tracking-wider text-white">
              Chief Minister's Office — KPK
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: '#6A85A6' }}>
              Implemented by the KPK Government to bridge governance feedback loops,
              fostering community transparency across Khyber Pakhtunkhwa.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 uppercase text-xs tracking-wider text-white">
              Direct Support Contacts
            </h3>
            <div className="space-y-1 text-xs" style={{ color: '#6A85A6' }}>
              <p>Helpline: <span className="text-white">051-9000111</span></p>
              <p>Email: <span className="text-white">info@kpkcitizens.gov.pk</span></p>
              <p>Address: <span className="text-white">Chief Minister Secretariat, Peshawar, KPK</span></p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2 uppercase text-xs tracking-wider text-white">
              Disclaimer Notice
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: '#6A85A6' }}>
              This web application serves as the official KPK Citizen Portal for
              service delivery, grievance redressal and civic engagement.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-4 text-center" style={{ borderTop: '1px solid #4B5D73' }}>
          <p className="text-xs" style={{ color: '#6A85A6' }}>
            © 2026 Government of Khyber Pakhtunkhwa. All Rights Reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}