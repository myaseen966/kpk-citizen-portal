// LOGOUT API — clears the session cookie when user logs out
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out.' })
  // Delete the auth cookie
  response.cookies.delete('auth-token')
  return response
}