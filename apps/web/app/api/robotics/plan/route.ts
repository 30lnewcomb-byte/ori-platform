import { NextResponse } from 'next/server'
import { authenticateRoboticsRequest } from '../../../../lib/robotics/auth'
import { planRoboticsTask } from '../../../../lib/robotics/service'

export async function POST(request: Request) {
  const auth = authenticateRoboticsRequest(request)
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  let body: { goal?: string; state?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ ok: false, error: 'Request body must be valid JSON.' }, { status: 400 }) }
  try { return NextResponse.json({ ok: true, result: await planRoboticsTask({ goal: body.goal || '', state: body.state }) }) }
  catch (error) { console.error('Robotics planning failed:', error); return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Robotics planning failed.' }, { status: 502 }) }
}
