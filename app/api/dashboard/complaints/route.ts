import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) return NextResponse.json({ error: 'Not logged in.' }, { status: 401 })

    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })

    const {
      category,
      subCategory,
      complaintType,
      subject,
      description,
      province,
      district,
      tehsil,
      complaintAddress,
      hideIdentity,
    } = await request.json()

    if (!category || !subject || !description) {
      return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 })
    }

    const complaint = await prisma.complaint.create({
      data: {
        citizenId: decoded.citizenId,
        category,
        subCategory: subCategory || null,
        complaintType: complaintType || 'Personal Grievance',
        subject,
        description,
        province: province || null,
        district: district || null,
        tehsil: tehsil || null,
        complaintAddress: complaintAddress || null,
        hideIdentity: hideIdentity || false,
      },
    })

    // Create notification
    await prisma.notification.create({
      data: {
        citizenId: decoded.citizenId,
        message: `Your complaint "${subject}" has been submitted and is under review.`,
        type: 'info',
      },
    })

    return NextResponse.json({ message: 'Complaint submitted!', complaint }, { status: 201 })
  } catch (error) {
    console.error('Complaint error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}