import { NextResponse } from 'next/server'
import { authenticateRoboticsRequest } from '../../../../lib/robotics/auth'
import { executeRoboticsCommand } from '../../../../lib/robotics/service'
import type { RoboticsCommand } from '../../../../lib/robotics/types'

export async function POST(request: Request) {
  const auth = authenticateRoboticsRequest(request)
  if (!auth.ok) return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status })
  let body: { command?: RoboticsCommand }
  try { body = await request.json() } catch { return NextResponse.json({ ok: false, error: 'Request body must be valid JSON.' }, { status: 400 }) }
  if (!body.command) return NextResponse.json({ ok: false, error: 'command is required.' }, { status: 400 })
  const result = await executeRoboticsCommand(body.command)
  const status = result.accepted ? 200 : result.mode === 'disconnected' ? 503 : 422
  return NextResponse.json({ ok: result.accepted, result }, { status })
}
