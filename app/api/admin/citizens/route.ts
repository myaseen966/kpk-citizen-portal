import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

function verifyAdminToken(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) } catch { return null }
}

export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdminToken(request)
    if (!admin) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

    const citizens = await prisma.citizen.findMany({
      select: {
        id: true, fullName: true, cnic: true, email: true,
        mobileNumber: true, province: true, district: true,
        isActive: true, createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ citizens })
  } catch (error) {
    console.error('Citizens fetch error:', error)
    return NextResponse.json({ error: 'Failed.' }, { status: 500 })
  }
}