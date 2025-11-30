import { PrismaClient } from '../src/generated/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Connecting to database...')
  try {
    // Try to count users as a simple test
    const userCount = await prisma.users.count()
    console.log(`Successfully connected! Found ${userCount} users.`)
    
    // Try to fetch one user to verify data mapping
    const user = await prisma.users.findFirst()
    if (user) {
      console.log('Sample user ID:', user.id)
    }
  } catch (error) {
    console.error('Error connecting to database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
