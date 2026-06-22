// ADMIN LOGIN API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required.' }, { status: 400 })
    }

    // Find admin
    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    // Verify password
    const isCorrect = await bcrypt.compare(password, admin.password)
    if (!isCorrect) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }

    // Create admin token
    const token = jwt.sign(
      { adminId: admin.id, role: admin.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    const response = NextResponse.json({
      message: 'Login successful!',
      admin: { id: admin.id, username: admin.username, email: admin.email },
    })

    // Set admin cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}