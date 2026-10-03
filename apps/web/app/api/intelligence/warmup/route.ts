import { NextResponse } from 'next/server'

const INTELLIGENCE_URL = process.env.ORI_INTELLIGENCE_URL?.trim().replace(/\/$/, '') || 'https://ori-tensorflow-runtime.onrender.com'
const INTELLIGENCE_API_KEY = process.env.ORI_INTELLIGENCE_API_KEY?.trim()

export async function GET() {
  if (!INTELLIGENCE_URL || !INTELLIGENCE_API_KEY) {
    return NextResponse.json({ ok: false, code: 'INTELLIGENCE_NOT_CONFIGURED' }, { status: 503 })
  }

  try {
    const response = await fetch(`${INTELLIGENCE_URL}/health`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${INTELLIGENCE_API_KEY}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(70_000),
    })

    return NextResponse.json(
      { ok: response.ok, status: response.status },
      { status: response.ok ? 200 : 502 },
    )
  } catch {
    return NextResponse.json({ ok: false, code: 'INTELLIGENCE_WAKE_FAILED' }, { status: 502 })
  }
}
