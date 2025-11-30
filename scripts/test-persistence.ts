import prisma from '../src/lib/prisma';
import 'dotenv/config';

async function main() {
  console.log('Starting persistence test...');

  try {
    // 1. Get or create a test user (using the one from previous tests if available)
    const testUserEmail = 'testuser@example.com';
    let user = await prisma.profiles.findFirst({
      where: { email: testUserEmail }
    });

    if (!user) {
      console.log('Creating test user...');
      user = await prisma.profiles.create({
        data: {
          email: testUserEmail,
          full_name: 'Test User',
          id: 'user_test_persistence_123' // Explicit ID for testing
        }
      });
    }
    console.log('Test user:', user.id);

    // 2. Get or create a test repository
    const repoId = 123456789;
    let repo = await prisma.repositories.findUnique({
      where: { id: repoId }
    });

    if (!repo) {
      console.log('Creating test repository...');
      repo = await prisma.repositories.create({
        data: {
          id: repoId,
          full_name: 'test/persistence-repo',
          data: { description: 'A test repo for persistence' }
        }
      });
    }
    console.log('Test repository:', repo.full_name);

    // 3. Test Saved Repository
    console.log('Testing saved_repositories...');
    // Clean up existing save if any
    await prisma.saved_repositories.deleteMany({
      where: {
        user_id: user.id,
        repository_id: repoId
      }
    });

    const savedRepo = await prisma.saved_repositories.create({
      data: {
        user_id: user.id,
        repository_id: repoId
      }
    });
    console.log('✅ Created saved_repository entry:', savedRepo.id);

    // 4. Test Analysis
    console.log('Testing analyses...');
    const analysis = await prisma.analyses.create({
      data: {
        user_id: user.id,
        repository_id: repoId,
        mermaid_code: 'graph TD; A-->B;',
        explanation: 'This is a test analysis.'
      }
    });
    console.log('✅ Created analysis entry:', analysis.id);

    // 5. Verify Relations
    const userWithData = await prisma.profiles.findUnique({
      where: { id: user.id },
      include: {
        saved_repositories: true,
        analyses: true
      }
    });

    if (userWithData?.saved_repositories.length && userWithData.analyses.length) {
      console.log('✅ Verification PASSED: User has related data.');
    } else {
      console.error('❌ Verification FAILED: User missing related data.');
    }

    // Cleanup
    console.log('Cleaning up test data...');
    await prisma.analyses.delete({ where: { id: analysis.id } });
    await prisma.saved_repositories.delete({
      where: {
        user_id_repository_id: {
          user_id: user.id,
          repository_id: repoId
        }
      }
    });
    console.log('Cleanup complete.');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
