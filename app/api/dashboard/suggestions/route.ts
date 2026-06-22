// API: POST /api/dashboard/suggestions
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    const { category, subject, description } = await request.json()

    if (!category || !subject || !description) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        citizenId: decoded.citizenId,
        category,
        subject,
        description,
      },
    })

await prisma.notification.create({
  data: {
    citizenId: decoded.citizenId,
    message: `Your suggestion "${subject}" has been submitted successfully.`,
    type: 'info',
  },
})

    return NextResponse.json({ message: 'Suggestion submitted!', suggestion }, { status: 201 })
  } catch (error) {
    console.error('Suggestion error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}