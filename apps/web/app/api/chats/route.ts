import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db, ensureConversationSchema } from '../../../lib/db'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    await ensureConversationSchema()
    const sql = db()
    const rows = await sql`
      SELECT
        id,
        title,
        messages,
        EXTRACT(EPOCH FROM created_at) * 1000 AS created_at,
        EXTRACT(EPOCH FROM updated_at) * 1000 AS updated_at
      FROM ori_conversations
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
      LIMIT 100
    `

    const conversationRows = rows as Array<Record<string, any>>

    return NextResponse.json({
      conversations: conversationRows.map((row: any) => ({
        id: row.id,
        title: row.title,
        messages: Array.isArray(row.messages) ? row.messages : [],
        createdAt: Number(row.created_at),
        updatedAt: Number(row.updated_at),
      })),
    })
  } catch (error) {
    console.error('Ori chat history read failed:', error)
    return NextResponse.json(
      { error: 'Ori could not load your conversations.', code: 'CHAT_HISTORY_READ_FAILED' },
      { status: 503 },
    )
  }
}
