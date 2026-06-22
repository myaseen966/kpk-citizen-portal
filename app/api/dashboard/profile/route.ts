import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// GET — fetch citizen profile
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    const citizen = await prisma.citizen.findUnique({
      where: { id: decoded.citizenId },
      select: {
        fullName: true,
        cnic: true,
        email: true,
        mobileNumber: true,
        gender: true,
        dateOfBirth: true,
        nationality: true,
        province: true,
        district: true,
        tehsil: true,
        address: true,
        landline: true,
        profilePicture: true, // ← new field
      },
    })

    if (!citizen) return NextResponse.json({ error: 'Citizen not found.' }, { status: 404 })

    return NextResponse.json({ citizen })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 })
  }
}

// PUT — update citizen profile including profile picture
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    const { fullName, email, mobileNumber, landline, address, profilePicture } = await request.json()

    const updated = await prisma.citizen.update({
      where: { id: decoded.citizenId },
      data: {
        fullName,
        email,
        mobileNumber,
        landline,
        address,
        // Only update picture if a new one was uploaded
        ...(profilePicture ? { profilePicture } : {}),
      },
    })

    return NextResponse.json({ message: 'Profile updated!', citizen: updated })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 })
  }
}