import { NextResponse } from 'next/server'
import { authenticateRoboticsRequest } from '../../../../lib/robotics/auth'
import { getRoboticsState } from '../../../../lib/robotics/service'

export async function GET(request: Request) {
  const auth = authenticateRoboticsRequest(request)
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  const state = getRoboticsState()
  return NextResponse.json({
    ok: true,
    service: 'ori-robotics',
    timestamp: new Date().toISOString(),
    connection: state.connection,
    intelligence: {
      configured: Boolean(process.env.ORI_INTELLIGENCE_URL?.trim() && process.env.ORI_INTELLIGENCE_API_KEY?.trim()),
      provider: 'Ori TensorFlow Runtime',
    },
  })
}
