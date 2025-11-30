import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function main() {
  try {
    const count = await prisma.repositories.count()
    console.log(`Total repositories in DB: ${count}`)
    
    if (count > 0) {
      const first = await prisma.repositories.findFirst()
      console.log('First repository:', first)
    }
  } catch (e) {
    console.error('Error querying database:', e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
