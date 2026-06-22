// This creates the first admin account in the database
// Run it once with: npx ts-node prisma/seed.ts
// OR we will create it via API

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('Admin@123', 10)

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@kpkcitizens.gov.pk' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@kpkcitizens.gov.pk',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('Admin created:', admin.email)
  console.log('Password: Admin@123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())