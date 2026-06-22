// This is the REGISTER API.
// When a citizen fills the registration form and clicks Register,
// the form sends all the data HERE.
// This code validates it, then saves it to the database.
//
// URL: POST /api/auth/register

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Read all the data sent from the registration form
    const body = await request.json()
    const {
      fullName,
      cnic,
      dateOfBirth,
      gender,
      nationality,
      mobileNumber,
      landline,
      email,
      password,
      confirmPassword,
      province,
      district,
      tehsil,
      address,
    } = body

    // Step 2: Check all required fields are filled
    if (!fullName || !cnic || !email || !password || !mobileNumber || !province || !district) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // Step 3: Make sure CNIC format is correct (e.g. 12345-1234567-1)
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
    if (!cnicRegex.test(cnic)) {
      return NextResponse.json(
        { error: 'CNIC format must be: 12345-1234567-1' },
        { status: 400 }
      )
    }

    // Step 4: Make sure both passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match.' },
        { status: 400 }
      )
    }

    // Step 5: Password must be at least 8 characters
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      )
    }

    // Step 6: Check if this CNIC is already registered
    const existingByCnic = await prisma.citizen.findUnique({
      where: { cnic },
    })
    if (existingByCnic) {
      return NextResponse.json(
        { error: 'This CNIC is already registered. Please log in.' },
        { status: 409 }
      )
    }

    // Step 7: Check if this email is already registered
    const existingByEmail = await prisma.citizen.findUnique({
      where: { email },
    })
    if (existingByEmail) {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 409 }
      )
    }

    // Step 8: Scramble (hash) the password before saving
    // We NEVER save plain text passwords in the database!
    const hashedPassword = await hashPassword(password)

    // Step 9: Save the new citizen to the database
    const newCitizen = await prisma.citizen.create({
      data: {
        fullName,
        cnic,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        nationality: nationality || 'Pakistan',
        mobileNumber,
        landline: landline || null,
        email,
        password: hashedPassword,
        province,
        district,
        tehsil: tehsil || null,
        address,
      },
    })

    // Step 10: Send back success message
    // IMPORTANT: never send the password back!
    return NextResponse.json(
      {
        message: 'Registration successful! You can now log in.',
        citizenId: newCitizen.id,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}