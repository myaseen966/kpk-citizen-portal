// GET /api/dashboard/search?q=health
// Searches through categories and citizen's own applications

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// All searchable services and categories
const ALL_SERVICES = [
  'Domicile Certificate', 'Birth Certificate', 'Death Certificate',
  'Marriage Certificate', 'Divorce Certificate', 'Arms License',
  'Driving License', 'Vehicle Transfer/Registration',
  'Character Certificate', 'Police Verification',
]

const ALL_CATEGORIES = [
  'Health', 'Education', 'Municipal Services', 'Land Revenue',
  'Law & Order', 'Energy & Power', 'NADRA', 'FBR', 'Railways',
  'FIA / Cyber Crime', 'Immigration & Passport', 'Investments',
  'Transport & Communications', 'Human Rights Violations',
  'Farmer / Agriculture', 'Environment & Forest', 'Media',
  'Sehat Insaf Card', 'Utility Stores', 'Pakistan Post', 'PIA',
  'BISP', 'Poverty Alleviation', 'Overseas Pakistani',
  'Banking', 'Scholarships', 'Development Projects',
]

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    const query = request.nextUrl.searchParams.get('q') || ''
    if (!query.trim()) return NextResponse.json({ results: [] })

    const q = query.toLowerCase()

    // Search services
    const matchedServices = ALL_SERVICES
      .filter((s) => s.toLowerCase().includes(q))
      .map((s) => ({ type: 'E-Service', title: s, href: '/dashboard/eservices' }))

    // Search categories
    const matchedCategories = ALL_CATEGORIES
      .filter((c) => c.toLowerCase().includes(q))
      .map((c) => ({ type: 'Category', title: c, href: '/dashboard/complaints' }))

    // Search citizen's own applications
    const [complaints, suggestions, eservices] = await Promise.all([
      prisma.complaint.findMany({
        where: {
          citizenId: decoded.citizenId,
          OR: [
            { subject: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.suggestion.findMany({
        where: {
          citizenId: decoded.citizenId,
          OR: [
            { subject: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      prisma.eService.findMany({
        where: {
          citizenId: decoded.citizenId,
          OR: [
            { subject: { contains: query, mode: 'insensitive' } },
            { serviceType: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ])

    const myApps = [
      ...complaints.map((c) => ({ type: 'My Complaint', title: c.subject, href: '/dashboard/applications' })),
      ...suggestions.map((s) => ({ type: 'My Suggestion', title: s.subject, href: '/dashboard/applications' })),
      ...eservices.map((e) => ({ type: 'My E-Service', title: e.subject, href: '/dashboard/applications' })),
    ]

    const results = [...matchedServices, ...matchedCategories, ...myApps].slice(0, 10)

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed.' }, { status: 500 })
  }
}