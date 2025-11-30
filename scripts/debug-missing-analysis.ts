import { PrismaClient } from '../src/generated/client'

const prisma = new PrismaClient()

async function main() {
  const REPO_ID = BigInt(976635369)
  const USER_ID = 'user_369ubwgEm2XOIHL5cg6bneurgMm'

  console.log(`Checking database for Repo ID: ${REPO_ID} and User ID: ${USER_ID}`)

  try {
    // Check Repository
    const repository = await prisma.repositories.findUnique({
      where: { id: REPO_ID }
    })
    console.log('Repository found:', repository ? 'YES' : 'NO')
    if (repository) {
        console.log('Repository Name:', repository.full_name)
    } else {
        console.log('Repository is MISSING. This would cause an FK violation on repository_id.')
    }

    // Check Analysis
    const analysis = await prisma.analyses.findFirst({
      where: { repository_id: REPO_ID }
    })
    console.log('Analysis found:', analysis ? 'YES' : 'NO')
    if (analysis) {
        console.log('Analysis ID:', analysis.id)
        console.log('Analysis Created At:', analysis.created_at)
    }

    // Check Profile
    const profile = await prisma.profiles.findUnique({
      where: { id: USER_ID }
    })
    console.log('Profile found:', profile ? 'YES' : 'NO')
    if (profile) {
        console.log('Profile Name:', profile.full_name)
    } else {
        console.log('Profile is MISSING. This confirms why the FK constraint failed.')
    }

  } catch (error) {
    console.error('Error querying database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
