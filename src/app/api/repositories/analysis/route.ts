import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const repositoryId = searchParams.get('repositoryId');

    console.log(`API: Fetching analysis for repositoryId: ${repositoryId}`);

    if (!repositoryId) {
      console.log('API: Missing repositoryId');
      return NextResponse.json({ error: 'Repository ID is required' }, { status: 400 });
    }

    // Fetch the latest analysis for this repository (global)
    // Using Prisma to bypass Supabase PostgREST schema cache issues
    const analysis = await prisma.analyses.findFirst({
        where: {
            repository_id: BigInt(repositoryId)
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    if (analysis) {
        console.log('API: Analysis found');
    } else {
        console.log('API: No analysis found');
    }

    // Handle BigInt serialization for the response
    const serializedData = analysis ? JSON.parse(JSON.stringify(analysis, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    )) : null;

    return NextResponse.json({ analysis: serializedData });
  } catch (error) {
    console.error('Internal server error in GET /api/repositories/analysis:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    
    // We allow saving analysis even if not authenticated, to populate the global cache
    // if (!userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const { repositoryId, fullName, repositoryData, mermaidCode, explanation, componentMapping, summary } = body;

    if (!repositoryId || !mermaidCode || !explanation) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert analysis for this repository
    // We use repository_id as the unique key now
    console.log(`Upserting global analysis for repo ${repositoryId} by user ${userId || 'anonymous'}`);

    // JIT Profile Provisioning: Ensure user exists in profiles table to satisfy FK constraint
    if (userId) {
        try {
            const profileExists = await prisma.profiles.findUnique({
                where: { id: userId },
                select: { id: true }
            });

            if (!profileExists) {
                console.log(`API: JIT creating profile for user ${userId}`);
                await prisma.profiles.create({
                    data: {
                        id: userId,
                        // Optional fields left null/default, will be populated by webhook or next login
                        full_name: 'JIT Provisioned User',
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                });
            }
        } catch (profileError) {
            console.error('API: Error checking/creating JIT profile:', profileError);
            // Continue, as the upsert might fail but we don't want to block if this check fails for some other reason
        }
    }

    // JIT Repository Provisioning: Ensure repository exists in repositories table to satisfy FK constraint
    try {
        const repoExists = await prisma.repositories.findUnique({
            where: { id: BigInt(repositoryId) },
            select: { id: true }
        });

        if (!repoExists) {
            console.log(`API: JIT creating repository record for ${repositoryId}`);
            if (!fullName || !repositoryData) {
                 console.warn('API: Cannot JIT create repository - missing fullName or data');
                 // We might fail here if we don't have the data, but let's try to proceed 
                 // and let the FK constraint fail if it must, or maybe we can create a dummy one?
                 // Better to fail with a clear error if we can't create it.
            } else {
                await prisma.repositories.create({
                    data: {
                        id: BigInt(repositoryId),
                        full_name: fullName,
                        data: repositoryData,
                        last_analyzed: new Date(),
                        created_at: new Date()
                    }
                });
            }
        }
    } catch (repoError) {
        console.error('API: Error checking/creating JIT repository:', repoError);
    }
    
    const result = await prisma.analyses.upsert({
        where: {
            repository_id: BigInt(repositoryId)
        },
        update: {
            user_id: userId || null, // Track who last updated it, or null if anonymous
            mermaid_code: mermaidCode,
            explanation: explanation,
            component_mapping: componentMapping,
            summary: summary,
            created_at: new Date()
        },
        create: {
            repository_id: BigInt(repositoryId),
            user_id: userId || null,
            mermaid_code: mermaidCode,
            explanation: explanation,
            component_mapping: componentMapping,
            summary: summary,
            created_at: new Date()
        }
    });

    // Serialize BigInt for response
    const serializedResult = JSON.parse(JSON.stringify(result, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
    ));

    return NextResponse.json({ success: true, analysis: serializedResult });
  } catch (error) {
    console.error('Internal server error in POST /api/repositories/analysis:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
