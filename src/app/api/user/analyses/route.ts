import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: Request) {
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

    let query = supabase
      .from('repository_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (repoFullName) {
      query = query.eq('repo_full_name', repoFullName)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ analyses: data || [] })
  } catch (error) {
    console.error('Get analyses error:', error)
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
      .from('repository_analyses')
      .upsert({
        user_id: userId,
        repo_full_name: body.repo_full_name,
        repo_url: body.repo_url,
        flowchart_mermaid: body.flowchart_mermaid,
        explanation: body.explanation,
        resources: body.resources,
        insights: body.insights,
        analysis_version: body.analysis_version || '1.0',
      }, {
        onConflict: 'user_id,repo_full_name',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ analysis: data })
  } catch (error) {
    console.error('Save analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

