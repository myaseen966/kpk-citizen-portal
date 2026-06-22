// API: POST /api/auth/verify-identity
// Checks if the CNIC + Email combination exists in the database

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { cnic, email } = await request.json()

    if (!cnic || !email) {
      return NextResponse.json(
        { error: 'Please enter both CNIC and email.' },
        { status: 400 }
      )
    }

    // Find citizen with matching CNIC AND email
    const citizen = await prisma.citizen.findFirst({
      where: { cnic, email },
    })

    if (!citizen) {
      return NextResponse.json(
        { error: 'No account found with this CNIC and email combination.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Identity verified.' })
  } catch (error) {
    console.error('Verify identity error:', error)
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    )
  }
}