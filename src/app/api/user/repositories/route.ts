import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/supabase/auth'

export async function GET() {
  try {
    const user = await requireAuth()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('saved_repositories')
      .select('*')
      .eq('user_id', user.id)
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
    const user = await requireAuth()
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('saved_repositories')
      // @ts-expect-error
      .insert({
        user_id: user.id,
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
    const user = await requireAuth()
    const supabase = await createClient()
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
      .eq('user_id', user.id)
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

