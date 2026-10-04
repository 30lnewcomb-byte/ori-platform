import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

type TitleMessage = {
  role: 'user' | 'assistant'
  content: string
}

const INTELLIGENCE_URL = process.env.ORI_INTELLIGENCE_URL?.trim().replace(/\/$/, '')
const INTELLIGENCE_API_KEY = process.env.ORI_INTELLIGENCE_API_KEY?.trim()

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Sign in required.', code: 'UNAUTHORIZED' }, { status: 401 })
  }

  if (!INTELLIGENCE_URL || !INTELLIGENCE_API_KEY) {
    return NextResponse.json(
      { error: 'Ori TensorFlow intelligence runtime is not configured yet.', code: 'INTELLIGENCE_NOT_CONFIGURED' },
      { status: 503 },
    )
  }

  let body: { messages?: TitleMessage[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (message) =>
            message &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.content === 'string' &&
            message.content.trim(),
        )
        .slice(0, 6)
    : []

  const userMessages = messages.filter((message) => message.role === 'user').slice(0, 3)
  if (!userMessages.length) {
    return NextResponse.json({ error: 'At least one user message is required.' }, { status: 400 })
  }

  const conversation = messages
    .map((message) => {
      const role = message.role === 'user' ? 'User' : 'Ori'
      return role + ': ' + message.content.trim()
    })
    .join('\n')

  const prompt = [
    'Create a concise title for this conversation.',
    'Use the conversation to understand what the person is trying to do.',
    'Return only the title, with 2 to 7 words.',
    'Do not use quotation marks, labels, prefixes, or punctuation.',
    '',
    conversation,
    '',
    'Title:',
  ].join('\n')

  try {
    const response = await fetch(INTELLIGENCE_URL + '/v1/title', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + INTELLIGENCE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages: userMessages, prompt }),
      cache: 'no-store',
      signal: AbortSignal.timeout(45_000),
    })

    const responseText = await response.text()
    let data: any = null
    try {
      data = JSON.parse(responseText)
    } catch {
      data = null
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error || 'Ori TensorFlow runtime returned HTTP ' + response.status + '.',
          code: 'TITLE_GENERATION_FAILED',
        },
        { status: 502 },
      )
    }

    const title =
      typeof data?.title === 'string'
        ? data.title
            .replace(/^(title|name)\s*[:\-]\s*/i, '')
            .replace(/[“”"]/g, '')
            .replace(/[.!?,:;]+$/g, '')
            .replace(/\s+/g, ' ')
            .trim()
        : ''

    if (!title) {
      return NextResponse.json(
        { error: 'Ori produced an empty conversation title.', code: 'TITLE_EMPTY' },
        { status: 502 },
      )
    }

    return NextResponse.json({ title: title.slice(0, 56) })
  } catch (error) {
    console.error('Ori title generation failed:', error)
    return NextResponse.json(
      { error: 'Ori could not generate a conversation title.', code: 'TITLE_NETWORK_ERROR' },
      { status: 502 },
    )
  }
}
