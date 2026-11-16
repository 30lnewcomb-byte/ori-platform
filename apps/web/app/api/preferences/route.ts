import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { ACCENT_COLORS, APPEARANCES, type OriAccent, type OriAppearance } from '../../../lib/theme-settings'

export async function PATCH(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in to save your appearance.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null) as
    | { appearance?: unknown; accent?: unknown }
    | null

  if (
    !body ||
    !APPEARANCES.includes(body.appearance as OriAppearance) ||
    !ACCENT_COLORS.includes(body.accent as OriAccent)
  ) {
    return NextResponse.json({ error: 'Choose a supported appearance and accent color.' }, { status: 400 })
  }

  try {
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      privateMetadata: {
        oriPreferences: {
          appearance: body.appearance,
          accent: body.accent,
        },
      },
    })

    return NextResponse.json({ ok: true }, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Ori appearance preference save failed:', error)
    return NextResponse.json({ error: 'Ori could not save your appearance right now.' }, { status: 503 })
  }
}
