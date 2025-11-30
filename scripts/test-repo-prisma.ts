import prisma from '../src/lib/prisma';

async function main() {
  console.log('Starting Prisma repository test...');
  
  try {
    const testRepo = {
      id: 123456789n, // BigInt
      full_name: 'test/repo-prisma',
      data: { description: 'Test repository via Prisma' },
      last_analyzed: new Date(),
    };

    console.log('Attempting to upsert test repository via Prisma:', testRepo.full_name);

    const repo = await prisma.repositories.upsert({
      where: { id: testRepo.id },
      update: {
        full_name: testRepo.full_name,
        data: testRepo.data,
        last_analyzed: testRepo.last_analyzed,
      },
      create: {
        id: testRepo.id,
        full_name: testRepo.full_name,
        data: testRepo.data,
        last_analyzed: testRepo.last_analyzed,
      },
    });

    console.log('Repository saved successfully via Prisma:', repo);
    
    // Verify read
    const readRepo = await prisma.repositories.findUnique({
      where: { id: testRepo.id },
    });
    
    console.log('Read back repository via Prisma:', readRepo);

  } catch (error) {
    console.error('Prisma test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
