// This file creates ONE database connection and reuses it.
// Without this, every time you save your code in development,
// a new connection would be created and your database would get overloaded.

import { PrismaClient } from '@prisma/client'

// We attach prisma to the global object so it survives hot reloads
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// If a connection already exists, reuse it. Otherwise create a new one.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL as string,
      },
    },
  })

// Save it globally so it's reused next time

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}