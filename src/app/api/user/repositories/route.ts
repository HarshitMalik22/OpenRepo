import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = (await createAdminClient()) as any

    const { data, error } = await supabase
      .from('saved_repositories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ repositories: data || [] })
  } catch (error) {
    console.error('Get saved repositories error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = (await createAdminClient()) as any
    const body = await request.json()

    const { data, error } = await supabase
      .from('saved_repositories')
      .insert({
        user_id: userId,
        repo_full_name: body.repo_full_name,
        repo_name: body.repo_name,
        repo_url: body.repo_url,
        description: body.description,
        language: body.language,
        stars: body.stars,
        tags: body.tags,
        notes: body.notes,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ repository: data })
  } catch (error) {
    console.error('Save repository error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = (await createAdminClient()) as any
    const { searchParams } = new URL(request.url)
    const repoFullName = searchParams.get('repo_full_name')

    if (!repoFullName) {
      return NextResponse.json(
        { error: 'repo_full_name is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('saved_repositories')
      .delete()
      .eq('user_id', userId)
      .eq('repo_full_name', repoFullName)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete saved repository error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

