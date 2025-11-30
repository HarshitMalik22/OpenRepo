import prisma from '../src/lib/prisma';

async function main() {
  console.log('Starting Prisma connection verification...');
  try {
    console.log('Attempting to connect to the database...');
    await prisma.$connect();
    console.log('Successfully connected to the database.');

    console.log('Running a simple query (SELECT 1)...');
    const result = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('Query result:', result);
    console.log('Prisma connection verification PASSED.');
  } catch (error) {
    console.error('Prisma connection verification FAILED.');
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
