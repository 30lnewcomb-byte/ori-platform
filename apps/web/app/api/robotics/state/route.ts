import { NextResponse } from 'next/server'
import { authenticateRoboticsRequest } from '../../../../lib/robotics/auth'
import { getRoboticsState } from '../../../../lib/robotics/service'

export async function GET(request: Request) {
  const auth = authenticateRoboticsRequest(request)
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  const state = getRoboticsState()
  return NextResponse.json({ ok: true, state })
}
