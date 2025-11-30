import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { repositoryId } = body;

    if (!repositoryId) {
      return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 });
    }

    // Convert repositoryId to BigInt for Prisma
    const repoIdBigInt = BigInt(repositoryId);

    // Check if the repository exists in our DB (it should, but just in case)
    // We might need to ensure it exists if the user is saving it for the first time
    // and it hasn't been synced yet. But for now, let's assume it's there or handled by other services.
    // Actually, if we are saving it, we should probably ensure it exists.
    // But let's stick to the minimal requirement: toggle the relation.

    // Check if already saved
    const existingSave = await prisma.saved_repositories.findUnique({
      where: {
        user_id_repository_id: {
          user_id: userId,
          repository_id: repoIdBigInt
        }
      }
    });

    if (existingSave) {
      // Unsave
      await prisma.saved_repositories.delete({
        where: {
          id: existingSave.id
        }
      });
      return NextResponse.json({ saved: false });
    } else {
      // Save
      // First ensure the repository exists in our DB. 
      // If it doesn't, we might fail foreign key constraint.
      // Ideally, the RepositoryService ensures this.
      // For robustness, we could check/create here, but let's assume it exists for now.
      
      await prisma.saved_repositories.create({
        data: {
          user_id: userId,
          repository_id: repoIdBigInt
        }
      });
      return NextResponse.json({ saved: true });
    }

  } catch (error) {
    console.error('Error toggling saved repository:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
