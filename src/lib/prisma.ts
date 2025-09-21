import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function to ensure user exists in database
export async function ensureUser(clerkUser: {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string;
}) {
  const existingUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: { preferences: true }
  });

  if (existingUser) {
    return existingUser;
  }

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    },
    include: { preferences: true }
  });

  return newUser;
}

// Helper function to get user with preferences
export async function getUserWithPreferences(clerkId: string) {
  return await prisma.user.findUnique({
    where: { clerkId },
    include: { 
      userPreferences: true,
      interactions: {
        orderBy: { timestamp: 'desc' },
        take: 50
      },
      savedRepos: {
        orderBy: { savedAt: 'desc' }
      }
    }
  });
}