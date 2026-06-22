// Returns counts for admin dashboard
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string; role: string }
  } catch { return null }
}

export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

    const [
      totalCitizens,
      totalComplaints,
      totalSuggestions,
      totalEServices,
      pendingComplaints,
      pendingSuggestions,
      pendingEServices,
    ] = await Promise.all([
      prisma.citizen.count(),
      prisma.complaint.count(),
      prisma.suggestion.count(),
      prisma.eService.count(),
      prisma.complaint.count({ where: { status: 'Pending' } }),
      prisma.suggestion.count({ where: { status: 'Pending' } }),
      prisma.eService.count({ where: { status: 'Pending' } }),
    ])

    return NextResponse.json({
      totalCitizens,
      totalComplaints,
      totalSuggestions,
      totalEServices,
      pendingComplaints,
      pendingSuggestions,
      pendingEServices,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}