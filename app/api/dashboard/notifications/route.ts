// GET  → fetch all notifications for logged in citizen
// POST → mark all notifications as read

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    // Get latest 10 notifications for this citizen
    const notifications = await prisma.notification.findMany({
      where: { citizenId: decoded.citizenId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Count unread
    const unreadCount = await prisma.notification.count({
      where: { citizenId: decoded.citizenId, isRead: false },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Notifications error:', error)
    return NextResponse.json({ error: 'Failed to load.' }, { status: 500 })
  }
}

// Mark all as read
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    await prisma.notification.updateMany({
      where: { citizenId: decoded.citizenId, isRead: false },
      data: { isRead: true },
    })

    return NextResponse.json({ message: 'Marked as read.' })
  } catch (error) {
    console.error('Mark read error:', error)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}