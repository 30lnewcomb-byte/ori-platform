import { NextResponse } from 'next/server'
import { authenticateRoboticsRequest } from '../../../../lib/robotics/auth'
import { analyzeRoboticsPerception } from '../../../../lib/robotics/service'
import type { PerceptionInput } from '../../../../lib/robotics/types'

export async function POST(request: Request) {
  const auth = authenticateRoboticsRequest(request)
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  let body: PerceptionInput
  try { body = await request.json() } catch { return NextResponse.json({ ok: false, error: 'Request body must be valid JSON.' }, { status: 400 }) }
  try { return NextResponse.json({ ok: true, result: await analyzeRoboticsPerception(body) }) }
  catch (error) { console.error('Robotics perception failed:', error); return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Perception processing failed.' }, { status: 502 }) }
}
