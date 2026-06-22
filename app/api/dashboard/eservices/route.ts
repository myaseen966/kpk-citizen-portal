// API: POST /api/dashboard/eservices
// Saves a new e-service application to the database

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    const { serviceType, subject, description } = await request.json()

    if (!serviceType || !subject || !description) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const eservice = await prisma.eService.create({
      data: {
        citizenId: decoded.citizenId,
        serviceType,
        subject,
        description,
      },
    })

    await prisma.notification.create({
  data: {
    citizenId: decoded.citizenId,
    message: `Your application for "${serviceType}" has been submitted and is pending review.`,
    type: 'info',
  },
})

    return NextResponse.json({ message: 'Application submitted!', eservice }, { status: 201 })
  } catch (error) {
    console.error('E-Service error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}