import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const allowedUseCases = new Set(['chat', 'coding', '3d', 'everything'])

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const useCase = typeof body?.useCase === 'string' && allowedUseCases.has(body.useCase)
    ? body.useCase
    : 'everything'

  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      oriOnboardingComplete: true,
      oriUseCase: useCase,
    },
  })

  return NextResponse.json({ ok: true })
}
