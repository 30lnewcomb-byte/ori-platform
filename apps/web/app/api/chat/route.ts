import { NextResponse } from 'next/server'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const MODEL = process.env.ORI_MENTOR_MODEL ?? 'google/gemma-2-2b-it:fastest'
const HF_ENDPOINT = 'https://router.huggingface.co/v1/chat/completions'

export async function POST(request: Request) {
  const token = process.env.HF_TOKEN

  if (!token) {
    return NextResponse.json(
      {
        error: 'Ori intelligence is not configured yet.',
        code: 'INTELLIGENCE_NOT_CONFIGURED',
      },
      { status: 503 },
    )
  }

  let body: { messages?: ChatMessage[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter((message) =>
          message &&
          ['system', 'user', 'assistant'].includes(message.role) &&
          typeof message.content === 'string',
        )
        .slice(-24)
    : []

  if (!messages.length) {
    return NextResponse.json({ error: 'At least one message is required.' }, { status: 400 })
  }

  const systemMessage: ChatMessage = {
    role: 'system',
    content:
      'You are Ori, a user-owned AI being developed inside Ori Platform. Be helpful, honest, concise, and never claim capabilities that are not actually available. You are currently operating through the Mentor integration while Ori\'s deeper intelligence is still under development.',
  }

  try {
    const response = await fetch(HF_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [systemMessage, ...messages.filter((message) => message.role !== 'system')],
        temperature: 0.4,
        max_tokens: 700,
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error('Mentor request failed:', response.status, detail)
      return NextResponse.json(
        { error: 'Ori could not reach its intelligence service.' },
        { status: 502 },
      )
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content

    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'Ori received an empty response from its intelligence service.' },
        { status: 502 },
      )
    }

    return NextResponse.json({ content, model: MODEL })
  } catch (error) {
    console.error('Mentor request error:', error)
    return NextResponse.json(
      { error: 'Ori could not reach its intelligence service.' },
      { status: 502 },
    )
  }
}
