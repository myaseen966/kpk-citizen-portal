// GET  → fetch all applications
// PUT  → update status of an application

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string }
  } catch { return null }
}

// GET — fetch all complaints, suggestions, eservices
export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

    const [complaints, suggestions, eservices] = await Promise.all([
      prisma.complaint.findMany({
        include: { citizen: { select: { fullName: true, cnic: true, email: true, mobileNumber: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.suggestion.findMany({
        include: { citizen: { select: { fullName: true, cnic: true, email: true, mobileNumber: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.eService.findMany({
        include: { citizen: { select: { fullName: true, cnic: true, email: true, mobileNumber: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return NextResponse.json({ complaints, suggestions, eservices })
  } catch (error) {
    console.error('Admin fetch error:', error)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}

// PUT — update status + send notification to citizen
export async function PUT(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

    const { id, type, status, adminNote } = await request.json()

    if (!id || !type || !status) {
      return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
    }

    let citizenId = ''
    let subject = ''

    // Update status based on type
    if (type === 'complaint') {
      const updated = await prisma.complaint.update({
        where: { id },
        data: { status, adminNote: adminNote || null },
      })
      citizenId = updated.citizenId
      subject = updated.subject
    } else if (type === 'suggestion') {
      const updated = await prisma.suggestion.update({
        where: { id },
        data: { status, adminNote: adminNote || null },
      })
      citizenId = updated.citizenId
      subject = updated.subject
    } else if (type === 'eservice') {
      const updated = await prisma.eService.update({
        where: { id },
        data: { status, adminNote: adminNote || null },
      })
      citizenId = updated.citizenId
      subject = updated.subject
    }

    // Send notification to citizen
    const notifType = status === 'Approved' ? 'success' : status === 'Rejected' ? 'warning' : 'info'
    const notifMessage =
      status === 'Approved'
        ? `Your ${type} "${subject}" has been Approved! ✅`
        : status === 'Rejected'
        ? `Your ${type} "${subject}" has been Rejected. ${adminNote ? `Reason: ${adminNote}` : ''}`
        : `Your ${type} "${subject}" is now ${status}.`

    await prisma.notification.create({
      data: { citizenId, message: notifMessage, type: notifType },
    })

    return NextResponse.json({ message: 'Status updated and citizen notified.' })
  } catch (error) {
    console.error('Update status error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}