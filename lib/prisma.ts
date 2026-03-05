import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined
}

// Determine which database to use based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || ''
const isNeonDatabase = databaseUrl.includes('neon.tech')

if (isNeonDatabase) {
  console.log('🔗 Using Neon PostgreSQL (production)')
} else {
  console.log('🔗 Using local PostgreSQL (development)')
}

// Create or reuse the Prisma client
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = global.prismaGlobal ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma
}

console.log('✅ Prisma client ready')
