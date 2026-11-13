import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import {
  getOriIntelligenceStatus,
  oriIntelligenceInfo,
} from '../../../../lib/ori-intelligence'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json(
      { configured: false, status: 'unauthorized' },
      { status: 401 },
    )
  }

  if (!oriIntelligenceInfo.configured) {
    return NextResponse.json(
      {
        configured: false,
        provider: 'Ori TensorFlow Intelligence',
        status: 'not_configured',
      },
      { status: 503 },
    )
  }

  try {
    const runtime = await getOriIntelligenceStatus()
    return NextResponse.json({
      configured: true,
      provider: 'Ori TensorFlow Intelligence',
      ...runtime,
    })
  } catch {
    return NextResponse.json(
      {
        configured: true,
        provider: 'Ori TensorFlow Intelligence',
        status: 'unavailable',
      },
      { status: 502 },
    )
  }
}
