// USER MANUAL PAGE
// Complete guide for KPK Citizen Portal users

'use client'

import { useState } from 'react'

// All manual sections
const SECTIONS = [
  {
    id: 'getting-started',
    icon: '🚀',
    title: 'Getting Started',
    content: [
      {
        heading: 'How to Register',
        steps: [
          'Go to the main page at KP Citizen Portal',
          'Click on "Register Here" button',
          'Fill in your personal information (Full Name, CNIC, Date of Birth)',
          'Enter your contact details (Mobile Number, Email)',
          'Select your District from the KPK districts list',
          'Create a strong password (minimum 8 characters)',
          'Agree to Terms & Conditions',
          'Click "Register / رجسٹر کریں" button',
          'You will be redirected to login page after successful registration',
        ],
      },
      {
        heading: 'How to Login',
        steps: [
          'Go to the login page',
          'Enter your CNIC number (format: 12345-1234567-1)',
          'Enter your password',
          'Click "Login" button',
          'You will be taken to your personal dashboard',
        ],
      },
      {
        heading: 'Forgot Password',
        steps: [
          'Click "Forgot Password?" on the login page',
          'Enter your registered CNIC number',
          'Enter your registered email address',
          'Click "Verify Identity" — the system will check your information',
          'If verified, you can set a new password',
          'Enter your new password and confirm it',
          'Click "Reset Password"',
          'You will be redirected to login with your new password',
        ],
      },
    ],
  },
  {
    id: 'dashboard',
    icon: '🏠',
    title: 'Dashboard',
    content: [
      {
        heading: 'Understanding Your Dashboard',
        steps: [
          'After login you will see your personal dashboard',
          'The top section shows a welcome message with your name',
          'Stats section shows: Total Applications, Approved, In Progress, Rejected',
          'Quick Access section has shortcuts to E-Services, Complaints, Suggestions',
          'Portal Statistics show KPK resolved rate and registered citizens',
          'Notifications panel on the right shows real-time updates on your applications',
        ],
      },
      {
        heading: 'Using the Sidebar',
        steps: [
          'Click the ☰ (hamburger) button in the top left to open/close the sidebar',
          'Sidebar contains all navigation links',
          'The currently active page is highlighted in blue',
          'Click your name in the top right to go to your profile',
          'Click "Logout" button to safely log out',
        ],
      },
      {
        heading: 'Search Feature',
        steps: [
          'Use the search bar in the top header to find services',
          'Type any service name like "Health" or "NADRA"',
          'Results will appear as a dropdown below the search bar',
          'Click any result to go directly to that service',
          'You can also search your own submitted applications',
        ],
      },
    ],
  },
  {
    id: 'eservices',
    icon: '⚙️',
    title: 'E-Services',
    content: [
      {
        heading: 'What are E-Services?',
        steps: [
          'E-Services allow you to apply for government documents online',
          'Available services include: Domicile Certificate, Birth Certificate, Death Certificate',
          'Also available: Marriage Certificate, Divorce Certificate, Arms License',
          'Driving License, Vehicle Transfer/Registration, Character Certificate, Police Verification',
        ],
      },
      {
        heading: 'How to Apply for an E-Service',
        steps: [
          'Click "E-Services" in the sidebar',
          'You will see all 10 available services as cards',
          'Click on the service you need',
          'Fill in the Subject (brief title of your request)',
          'Fill in the Description (details of your request)',
          'Click "Submit Application"',
          'You will be redirected to "My Applications" to track your request',
          'You will receive a notification when the status changes',
        ],
      },
    ],
  },
  {
    id: 'complaints',
    icon: '📢',
    title: 'Complaints',
    content: [
      {
        heading: 'How to Lodge a Complaint',
        steps: [
          'Click "Complaints" in the sidebar',
          'Read the warning popup carefully and click "PROCEED"',
          'You will see your complaint statistics (Total, Open, Closed, Dropped)',
          'Click "+ NEW COMPLAINT" button',
          'Select the relevant category (e.g., Health, Education, Law & Order)',
          'Fill in the complaint form',
          'Select complaint type: Personal Grievance OR Social Responsibility',
          'Enter Subject (brief title) and Description (full details, max 1000 words)',
          'Select your Province, District, and Tehsil',
          'Toggle "Hide Complainant Identity" if you want to remain anonymous',
          'Attach any supporting documents (JPG, PNG, PDF, Word — max 5MB)',
          'Click "LODGE COMPLAINT"',
        ],
      },
      {
        heading: 'Important Warning',
        steps: [
          'Filing false complaints is a legal offense under Pakistani law',
          'Do NOT file complaints based on personal animosity without evidence',
          'If a baseless complaint is filed, your identity will be disclosed to authorities',
          'Only file complaints when you have genuine grievances',
        ],
      },
      {
        heading: 'Tracking Your Complaints',
        steps: [
          'Go to "My Applications" in the sidebar',
          'Scroll down to the Complaints section',
          'You can see the status of each complaint',
          'Status options: Pending → In Progress → Approved / Rejected',
          'You will receive notifications when status changes',
        ],
      },
    ],
  },
  {
    id: 'suggestions',
    icon: '💡',
    title: 'Suggestions',
    content: [
      {
        heading: 'How to Submit a Suggestion',
        steps: [
          'Click "Suggestions" in the sidebar',
          'Read the information popup and click "PROCEED"',
          'You will see your suggestion statistics',
          'Click "+ NEW SUGGESTION" button',
          'Step 1: Select a main category (e.g., Education, Health, Banking)',
          'Step 2: Select a sub-department within that category',
          'Fill in the suggestion form',
          'Select suggestion type: Personal OR Social Responsibility',
          'Enter Subject and Details (your suggestion, max 1000 words)',
          'Optionally select your location (Province, District, Tehsil)',
          'Toggle "Hide Identity" if you want to remain anonymous',
          'Attach any supporting documents if needed',
          'Click "LODGE SUGGESTION"',
        ],
      },
      {
        heading: 'What Suggestions Are For',
        steps: [
          'Suggestions are for submitting ideas to government authorities',
          'You can suggest improvements to government services',
          'Suggest new policies or policy reforms',
          'Submit ideas for development projects in your area',
          'Suggestions are NOT for complaints or grievances',
        ],
      },
    ],
  },
  {
    id: 'applications',
    icon: '📋',
    title: 'My Applications',
    content: [
      {
        heading: 'Tracking All Your Applications',
        steps: [
          'Click "My Applications" in the sidebar',
          'You will see 3 sections: E-Services, Complaints, Suggestions',
          'Each section shows statistics: Total, Approved, In Progress, Rejected',
          'Recent applications are listed below the stats',
          'Each application shows: Subject, Category, Date, and Current Status',
          'Click "View all →" to see all applications of that type',
        ],
      },
      {
        heading: 'Understanding Application Statuses',
        steps: [
          'Pending — Your application has been submitted and is waiting for review',
          'In Progress — An admin is currently reviewing your application',
          'Approved — Your application has been approved ✅',
          'Rejected — Your application was not approved (reason will be in notifications)',
        ],
      },
    ],
  },
  {
    id: 'notifications',
    icon: '🔔',
    title: 'Notifications',
    content: [
      {
        heading: 'How Notifications Work',
        steps: [
          'Notifications appear on the right side of your dashboard',
          'You receive a notification every time you submit an application',
          'You receive a notification when an admin changes the status of your application',
          'Unread notifications have a blue dot indicator',
          'The red badge shows how many unread notifications you have',
          'Click "Mark all read" to clear the unread count',
        ],
      },
    ],
  },
  {
    id: 'profile',
    icon: '👤',
    title: 'Profile',
    content: [
      {
        heading: 'Viewing Your Profile',
        steps: [
          'Click "Profile" in the sidebar OR click your name in the top header',
          'Your profile shows all your registered information',
          'Fields like CNIC, Gender, Province, District cannot be changed',
          'You can update: Full Name, Email, Mobile Number, Landline, Address',
        ],
      },
      {
        heading: 'Updating Your Profile',
        steps: [
          'Click the "✏️ Edit Profile" button',
          'The editable fields will become active (white background)',
          'Make your changes',
          'Click "Save Changes" to save',
          'Click "Cancel" to discard changes',
          'You will see a success message when saved',
        ],
      },
    ],
  },
  {
    id: 'contact',
    icon: '📞',
    title: 'Contact & Support',
    content: [
      {
        heading: 'Getting Help',
        steps: [
          'Click "Contact Us" in the sidebar',
          'Fill in your name, email, subject and message',
          'Click "Send Message"',
          'The support team will respond within 2-3 working days',
          'You can also call the helpline: 051-9000111',
          'Email: info@kpkcitizens.gov.pk',
          'Address: Chief Minister Secretariat, Peshawar, KPK',
          'Working hours: Monday - Friday, 9AM - 5PM',
        ],
      },
    ],
  },
]

export default function ManualPage() {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [expandedItems, setExpandedItems] = useState<string[]>(['How to Register'])

  function toggleItem(heading: string) {
    setExpandedItems((prev) =>
      prev.includes(heading)
        ? prev.filter((h) => h !== heading)
        : [...prev, heading]
    )
  }

  const currentSection = SECTIONS.find((s) => s.id === activeSection)

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: '#273F5B' }}>User Manual</h1>
        <p className="text-sm" style={{ color: '#6A85A6' }}>
          Complete guide to using KPK Citizen Portal • صارف دستی
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT: Section Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            style={{ border: '1px solid #839DBC' }}
          >
            <div
              className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
              style={{ backgroundColor: '#273F5B' }}
            >
              Contents
            </div>
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors"
                style={{
                  backgroundColor: activeSection === section.id ? '#f0f4f8' : 'white',
                  borderLeft: activeSection === section.id ? `3px solid #0083FF` : '3px solid transparent',
                  color: activeSection === section.id ? '#0083FF' : '#4B5D73',
                  fontWeight: activeSection === section.id ? '600' : 'normal',
                  borderBottom: '1px solid #f0f4f8',
                }}
              >
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Section Content */}
        <div className="flex-1">
          {currentSection && (
            <div
              className="bg-white rounded-xl shadow-sm p-6"
              style={{ border: '1px solid #839DBC' }}
            >
              {/* Section Title */}
              <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '2px solid #f0f4f8' }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: '#273F5B' }}
                >
                  {currentSection.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#273F5B' }}>
                    {currentSection.title}
                  </h2>
                  <p className="text-xs" style={{ color: '#6A85A6' }}>
                    Click on any topic below to expand
                  </p>
                </div>
              </div>

              {/* Accordion Items */}
              <div className="space-y-3">
                {currentSection.content.map((item) => (
                  <div
                    key={item.heading}
                    className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid #839DBC' }}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleItem(item.heading)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                      style={{
                        backgroundColor: expandedItems.includes(item.heading) ? '#273F5B' : '#f0f4f8',
                        color: expandedItems.includes(item.heading) ? 'white' : '#273F5B',
                      }}
                    >
                      <span className="font-semibold text-sm">{item.heading}</span>
                      <span className="text-lg">
                        {expandedItems.includes(item.heading) ? '−' : '+'}
                      </span>
                    </button>

                    {/* Accordion Content */}
                    {expandedItems.includes(item.heading) && (
                      <div className="px-5 py-4" style={{ backgroundColor: 'white' }}>
                        <ol className="space-y-2">
                          {item.steps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                              {/* Step Number */}
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
                              >
                                {index + 1}
                              </div>
                              <span className="text-sm leading-relaxed" style={{ color: '#4B5D73' }}>
                                {step}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Help Banner */}
      <div
        className="mt-6 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ backgroundColor: '#273F5B' }}
      >
        <div>
          <h3 className="font-bold text-white text-lg mb-1">Still need help?</h3>
          <p className="text-sm" style={{ color: '#839DBC' }}>
            Our support team is available Monday - Friday, 9AM - 5PM
          </p>
        </div>
        <div className="flex gap-3">
          <a
            href="tel:051-9000111"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#0083FF' }}
          >
            📞 Call Us
          </a>
          <a
            href="/dashboard/contact"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ backgroundColor: '#E6F99B', color: '#273F5B' }}
          >
            ✉️ Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}