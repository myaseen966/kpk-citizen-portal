// API: GET /api/dashboard/applications
// Returns all complaints, suggestions and eservices for the logged-in citizen

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookie
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })
    }

    // Verify the token to get citizen ID
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
    }

    // Fetch all 3 types of applications for this citizen
    const [complaints, suggestions, eservices] = await Promise.all([
      prisma.complaint.findMany({
        where: { citizenId: decoded.citizenId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.suggestion.findMany({
        where: { citizenId: decoded.citizenId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.eService.findMany({
        where: { citizenId: decoded.citizenId },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return NextResponse.json({ complaints, suggestions, eservices })
  } catch (error) {
    console.error('Applications fetch error:', error)
    return NextResponse.json({ error: 'Failed to load applications.' }, { status: 500 })
  }
}