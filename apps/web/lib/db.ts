import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

let sqlClient: NeonQueryFunction<false, false> | null = null
let schemaPromise: Promise<void> | null = null

function getDatabase() {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) {
    throw new Error('DATABASE_URL is not configured.')
  }
  if (!sqlClient) {
    sqlClient = neon(url)
  }
  return sqlClient
}

export async function ensureConversationSchema() {
  if (!schemaPromise) {
    const sql = getDatabase()
    schemaPromise = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS ori_conversations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT 'New chat',
        messages JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`
      await sql`CREATE INDEX IF NOT EXISTS ori_conversations_user_updated_idx
        ON ori_conversations (user_id, updated_at DESC)`
    })().catch((error) => {
      schemaPromise = null
      throw error
    })
  }
  return schemaPromise
}

export function db() {
  return getDatabase()
}
