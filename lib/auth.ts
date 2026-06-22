// This file has 4 helper functions used for login/registration security.
// 1. hashPassword    → scrambles password before saving to database
// 2. verifyPassword  → checks if entered password matches the scrambled one
// 3. generateToken   → creates a login session token (like a digital ID card)
// 4. verifyToken     → checks if the session token is valid

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// How many times to scramble the password (10 is the industry standard)
const SALT_ROUNDS = 10

// Secret key used to sign tokens — stored in your .env file
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production'

// --- PASSWORD FUNCTIONS ---

// Takes a plain password like "MyPass123" and returns a scrambled version
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Compares "MyPass123" with the scrambled version — returns true or false
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

// --- TOKEN FUNCTIONS ---

// Creates a JWT token after successful login (valid for 7 days)
export function generateToken(citizenId: string, cnic: string): string {
  return jwt.sign(
    { citizenId, cnic },  // data stored inside the token
    JWT_SECRET,
    { expiresIn: '7d' }   // expires after 7 days
  )
}

// Checks if a token is valid — returns the data inside or null if invalid
export function verifyToken(token: string): { citizenId: string; cnic: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded as { citizenId: string; cnic: string }
  } catch {
    return null // token is expired or fake
  }
}