export function authenticateRoboticsRequest(request: Request): { ok: true; principal: string } | { ok: false; status: number; error: string } {
  const expected = process.env.ORI_ROBOTICS_API_KEY?.trim()
  if (!expected) return { ok: false, status: 503, error: 'Robotics API authentication is not configured.' }
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim()
  if (!provided || provided !== expected) return { ok: false, status: 401, error: 'Robotics API authentication failed.' }
  return { ok: true, principal: 'robotics-client' }
}
