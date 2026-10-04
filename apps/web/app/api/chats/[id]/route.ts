import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db, ensureConversationSchema } from '../../../../lib/db'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

function cleanMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value) || value.length > 200) return null
  const messages = value.filter(
    (message): message is Message =>
      !!message &&
      typeof message === 'object' &&
      ((message as Message).role === 'user' || (message as Message).role === 'assistant') &&
      typeof (message as Message).content === 'string' &&
      (message as Message).content.length <= 12000,
  )
  return messages.length === value.length ? messages : null
}

function cleanTitle(value: unknown) {
  if (typeof value !== 'string') return null
  const title = value.replace(/\s+/g, ' ').trim()
  if (!title) return null
  return title.slice(0, 56)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params
  if (!id || id.length > 100) {
    return NextResponse.json({ error: 'Invalid conversation ID.' }, { status: 400 })
  }

  let body: { title?: unknown; messages?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const messages = cleanMessages(body.messages)
  const title = cleanTitle(body.title)
  if (!messages || !title) {
    return NextResponse.json({ error: 'A valid title and messages array are required.' }, { status: 400 })
  }

  try {
    await ensureConversationSchema()
    const sql = db()
    await sql`
      INSERT INTO ori_conversations (id, user_id, title, messages)
      VALUES (${id}, ${userId}, ${title}, ${JSON.stringify(messages)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        messages = EXCLUDED.messages,
        updated_at = NOW()
      WHERE ori_conversations.user_id = ${userId}
    `

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Ori chat history write failed:', error)
    return NextResponse.json(
      { error: 'Ori could not save your conversation.', code: 'CHAT_HISTORY_WRITE_FAILED' },
      { status: 503 },
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await params
  if (!id || id.length > 100) {
    return NextResponse.json({ error: 'Invalid conversation ID.' }, { status: 400 })
  }

  try {
    await ensureConversationSchema()
    const sql = db()
    await sql`
      DELETE FROM ori_conversations
      WHERE id = ${id} AND user_id = ${userId}
    `
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Ori chat history delete failed:', error)
    return NextResponse.json(
      { error: 'Ori could not delete that conversation.', code: 'CHAT_HISTORY_DELETE_FAILED' },
      { status: 503 },
    )
  }
}
