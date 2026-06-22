// TERMS & CONDITIONS PAGE
// Accessible at: localhost:3000/terms

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#273F5B' }} className="text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex-shrink-0">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-125" style={{ objectPosition: 'center 30%' }} />
          </div>
          <div>
            <div className="font-bold text-sm">KPK CITIZEN PORTAL</div>
            <div className="text-xs" style={{ color: '#839DBC' }}>GOVERNMENT OF KHYBER PAKHTUNKHWA</div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8" style={{ border: '1px solid #839DBC' }}>

          {/* Title */}
          <div className="text-center mb-8 pb-6" style={{ borderBottom: '2px solid #f0f4f8' }}>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#273F5B' }}>
              Terms & Conditions
            </h1>
            <p className="text-sm" style={{ color: '#6A85A6' }}>
              شرائط و ضوابط — KPK Citizen Portal
            </p>
            <p className="text-xs mt-2" style={{ color: '#839DBC' }}>
              Last updated: January 2026
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8 text-sm" style={{ color: '#4B5D73', lineHeight: '1.8' }}>

            {/* Section 1 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                1. Acceptance of Terms
              </h2>
              <p className="mb-3">
                By registering and using the KPK Citizen Portal ("the Portal"), you agree to be bound
                by these Terms and Conditions. If you do not agree with any part of these terms,
                you must not use the Portal.
              </p>
              <p>
                The KPK Citizen Portal is operated by the Chief Minister's Performance Delivery Unit
                (CMDU), Government of Khyber Pakhtunkhwa. These terms may be updated from time to
                time without prior notice.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                2. Eligibility
              </h2>
              <p className="mb-3">To use the KPK Citizen Portal, you must:</p>
              <ul className="space-y-2 ml-4">
                {[
                  'Be a resident of Khyber Pakhtunkhwa or a Pakistani citizen with a valid CNIC',
                  'Provide accurate and truthful personal information during registration',
                  'Be at least 18 years of age, or have guardian consent',
                  'Have a valid National Identity Card (CNIC) number',
                  'Have a valid email address and mobile number',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#0083FF' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                3. User Responsibilities
              </h2>
              <p className="mb-3">As a registered citizen, you agree to:</p>
              <ul className="space-y-2 ml-4">
                {[
                  'Provide accurate, complete, and current information',
                  'Maintain the confidentiality of your password and account',
                  'Notify us immediately of any unauthorized use of your account',
                  'Not share your account credentials with any other person',
                  'Use the Portal only for lawful purposes',
                  'Not submit false, misleading, or fraudulent complaints or suggestions',
                  'Not use the Portal to harass, defame, or harm any individual or organization',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#0083FF' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 4 - Important Warning Box */}
            <div className="rounded-xl p-5" style={{ backgroundColor: '#fff8f0', border: '1px solid #fbbf24' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#92400e' }}>
                4. ⚠️ Warning — False Complaints
              </h2>
              <p className="mb-3" style={{ color: '#92400e' }}>
                Filing complaints against any individual, organization, representative, or citizen
                on the basis of personal animosity, without evidence, or on the basis of unfounded
                allegations constitutes a <strong>legal offense</strong> under Pakistani law.
              </p>
              <p style={{ color: '#92400e' }}>
                In the event of submitting a baseless complaint, your identity will be disclosed
                to law enforcement authorities. Please proceed only after understanding and
                accepting this responsibility.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                5. Privacy Policy
              </h2>
              <p className="mb-3">
                The KPK Citizen Portal collects personal information including your name, CNIC,
                email, mobile number, and address for the purpose of providing government services.
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  'Your personal data is stored securely and encrypted',
                  'We do not sell your personal information to third parties',
                  'Your information may be shared with relevant government departments to process your applications',
                  'Complaint details marked as "Hide Identity" will not reveal your identity to the public',
                  'However, in cases of legal proceedings, your identity may be disclosed to authorities',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#0083FF' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 6 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                6. Services
              </h2>
              <p className="mb-3">
                The Portal provides the following services to citizens of Khyber Pakhtunkhwa:
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  'E-Services: Apply for government certificates and documents online',
                  'Complaints: Lodge complaints against government departments',
                  'Suggestions: Submit policy improvement suggestions to authorities',
                  'Application Tracking: Monitor the status of your submitted applications',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#0083FF' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                7. Account Suspension
              </h2>
              <p className="mb-3">
                The administration reserves the right to suspend or deactivate your account if:
              </p>
              <ul className="space-y-2 ml-4">
                {[
                  'You provide false or misleading information',
                  'You file baseless or malicious complaints',
                  'You misuse the portal for purposes other than its intended use',
                  'You violate any of these Terms and Conditions',
                  'You use the portal to harass other citizens or officials',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#dc2626' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                8. Disclaimer
              </h2>
              <p>
                The KPK Citizen Portal is provided "as is" without any warranties. The Government
                of Khyber Pakhtunkhwa does not guarantee that the Portal will be uninterrupted or
                error-free. We reserve the right to modify or discontinue any service at any time
                without prior notice.
              </p>
            </div>

            {/* Section 9 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                9. Governing Law
              </h2>
              <p>
                These Terms and Conditions are governed by the laws of Pakistan and the KPK
                Government regulations. Any disputes arising from the use of this Portal shall
                be subject to the jurisdiction of the courts of Khyber Pakhtunkhwa.
              </p>
            </div>

            {/* Section 10 */}
            <div>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#273F5B' }}>
                10. Contact
              </h2>
              <p className="mb-3">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div
                className="rounded-xl p-4 space-y-2"
                style={{ backgroundColor: '#f0f4f8' }}
              >
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>Helpline: <strong>051-9000111</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>Email: <strong>info@kpkcitizens.gov.pk</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Chief Minister Secretariat, Peshawar, Khyber Pakhtunkhwa</span>
                </div>
              </div>
            </div>

          </div>

          {/* Agreement + Back Button */}
          <div
            className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: '2px solid #f0f4f8' }}
          >
            <p className="text-xs" style={{ color: '#6A85A6' }}>
              By using the KPK Citizen Portal, you confirm that you have read,
              understood and agreed to these Terms and Conditions.
            </p>
            <Link
              href="/register"
              className="flex-shrink-0 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors"
              style={{ backgroundColor: '#0083FF' }}
            >
              I Agree — Register Now
            </Link>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs" style={{ color: '#6A85A6' }}>
        © 2026 Government of Khyber Pakhtunkhwa. All Rights Reserved.
      </div>

    </div>
  )
}