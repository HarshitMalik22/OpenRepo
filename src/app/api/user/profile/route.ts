import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile from Prisma
    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
    })

    if (!profile) {
      // If profile doesn't exist, return a default structure or 404
      // For now, returning a default structure to avoid breaking the UI
      return NextResponse.json({
        user: { id: userId },
        profile: null
      })
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
      },
      profile: profile,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Update user profile
    const updatedProfile = await prisma.profiles.upsert({
      where: { id: userId },
      update: {
        full_name: body.full_name,
        avatar_url: body.avatar_url,
        bio: body.bio,
        github_username: body.github_username,
        experience_level: body.experience_level,
        tech_interests: body.tech_interests,
      },
      create: {
        id: userId,
        full_name: body.full_name,
        avatar_url: body.avatar_url,
        bio: body.bio,
        github_username: body.github_username,
        experience_level: body.experience_level,
        tech_interests: body.tech_interests || [],
      },
    })

    return NextResponse.json({ success: true, profile: updatedProfile })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
