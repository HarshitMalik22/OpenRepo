import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (userError && userError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: userError.message },
        { status: 500 }
      )
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      user: userData || {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
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
    const user = await requireAuth()
    const supabase = await createClient()
    const body = await request.json()

    // Update user data
    if (body.full_name !== undefined || body.avatar_url !== undefined) {
      const { error: userError } = await supabase
        .from('users')
        // @ts-expect-error
        .update({
          full_name: body.full_name,
          avatar_url: body.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (userError) {
        return NextResponse.json(
          { error: userError.message },
          { status: 500 }
        )
      }
    }

    // Update user profile
    if (body.bio !== undefined || body.github_username !== undefined || 
        body.experience_level !== undefined || body.tech_interests !== undefined) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          bio: body.bio,
          github_username: body.github_username,
          experience_level: body.experience_level,
          tech_interests: body.tech_interests,
          updated_at: new Date().toISOString(),
        } as any, {
          onConflict: 'user_id',
        })

      if (profileError) {
        return NextResponse.json(
          { error: profileError.message },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

