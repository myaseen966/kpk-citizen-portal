// This is the LOGIN API.
// When a citizen enters their CNIC + password and clicks Login,
// this code checks if they exist in the database and if the password is correct.
// If everything is correct, it creates a session cookie so they stay logged in.
//
// URL: POST /api/auth/login

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Read the CNIC and password sent from the login form
    const body = await request.json()
    const { cnic, password } = body

    // Step 2: Make sure both fields are filled
    if (!cnic || !password) {
      return NextResponse.json(
        { error: 'Please enter your CNIC and password.' },
        { status: 400 }
      )
    }

    // Step 3: Search for this CNIC in the database
    const citizen = await prisma.citizen.findUnique({
      where: { cnic },
    })

    // Step 4: If CNIC not found, return error
    // Note: We give the same error for wrong CNIC and wrong password
    // This is a security trick — attacker won't know which one was wrong
    if (!citizen) {
      return NextResponse.json(
        { error: 'Invalid CNIC or password.' },
        { status: 401 }
      )
    }

    // Step 5: Check if the account is active (not banned)
    if (!citizen.isActive) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Contact PMDU support.' },
        { status: 403 }
      )
    }

    // Step 6: Check if the password is correct
    const isPasswordCorrect = await verifyPassword(password, citizen.password)

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid CNIC or password.' },
        { status: 401 }
      )
    }

    // Step 7: Password is correct! Now create a JWT session token
    const token = generateToken(citizen.id, citizen.cnic)

    // Step 8: Send back success response
    const response = NextResponse.json(
      {
        message: 'Login successful!',
        citizen: {
          id: citizen.id,
          fullName: citizen.fullName,
          cnic: citizen.cnic,
          email: citizen.email,
        },
      },
      { status: 200 }
    )

    // Step 9: Save the token in a secure cookie in the browser
    // httpOnly: true = JavaScript cannot read this cookie (protects against hackers)
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}