import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const userCount = await prisma.users.count()
    return NextResponse.json({ success: true, userCount })
  } catch (error) {
    console.error('Prisma verification error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
