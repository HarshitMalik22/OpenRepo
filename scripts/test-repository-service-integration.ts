import { RepositoryService } from '../src/lib/repository-service';
import prisma from '../src/lib/prisma';

async function main() {
  console.log('Starting RepositoryService integration test...');
  
  const owner = 'facebook';
  const name = 'react';
  const fullName = `${owner}/${name}`;

  try {
    // 1. Clear existing entry to force fetch and save
    console.log(`Cleaning up ${fullName} from DB...`);
    await prisma.repositories.deleteMany({
      where: { full_name: fullName }
    });

    // 2. Call getRepository
    console.log(`Fetching ${fullName} via RepositoryService...`);
    const repo = await RepositoryService.getRepository(owner, name);

    if (!repo) {
      console.error('Failed to fetch repository.');
      process.exit(1);
    }

    console.log('Repository fetched:', repo.full_name);

    // 3. Verify it's in the DB
    console.log('Verifying DB insertion...');
    // Give it a moment as saving is async (fire and forget)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const dbRepo = await prisma.repositories.findFirst({
      where: { full_name: fullName }
    });

    if (dbRepo) {
      console.log('Verification PASSED: Repository found in DB:', dbRepo.full_name);
      console.log('Last analyzed:', dbRepo.last_analyzed);
    } else {
      console.error('Verification FAILED: Repository NOT found in DB.');
      process.exit(1);
    }

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
