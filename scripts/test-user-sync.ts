import prisma from '../src/lib/prisma';

async function main() {
  console.log('Starting user sync test...');
  
  const testUser = {
    id: 'test_user_' + Date.now(),
    email: 'test@example.com',
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.png',
    bio: 'I am a test user',
    github_username: 'testuser',
    experience_level: 'intermediate',
    tech_interests: ['typescript', 'nextjs', 'prisma'],
  };

  console.log('Upserting test user:', testUser.id);

  try {
    const user = await prisma.profiles.upsert({
      where: { id: testUser.id },
      update: {
        email: testUser.email,
        full_name: testUser.full_name,
        avatar_url: testUser.avatar_url,
        bio: testUser.bio,
        github_username: testUser.github_username,
        experience_level: testUser.experience_level,
        tech_interests: testUser.tech_interests,
      },
      create: {
        id: testUser.id,
        email: testUser.email,
        full_name: testUser.full_name,
        avatar_url: testUser.avatar_url,
        bio: testUser.bio,
        github_username: testUser.github_username,
        experience_level: testUser.experience_level,
        tech_interests: testUser.tech_interests,
      },
    });

    console.log('User synced successfully:', user);
    console.log('Verification PASSED: User data should now be visible in Prisma Studio.');
  } catch (error) {
    console.error('Verification FAILED:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
