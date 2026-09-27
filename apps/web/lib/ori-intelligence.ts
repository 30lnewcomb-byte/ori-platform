import 'server-only'

const INTELLIGENCE_URL =
  process.env.ORI_INTELLIGENCE_URL?.trim().replace(/\/$/, '') ||
  'https://ori-tensorflow-runtime.onrender.com'
const INTELLIGENCE_API_KEY = process.env.ORI_INTELLIGENCE_API_KEY?.trim()

const MAX_OUTPUT = 12000

function requireConfigured() {
  if (!INTELLIGENCE_URL || !INTELLIGENCE_API_KEY) {
    throw new Error('Ori TensorFlow intelligence runtime is not configured.')
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  timeoutMs = 30_000,
): Promise<T> {
  requireConfigured()

  const response = await fetch(`${INTELLIGENCE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${INTELLIGENCE_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
    signal: init.signal ?? AbortSignal.timeout(timeoutMs),
  })

  const raw = await response.text()
  let data: any = null
  try {
    data = JSON.parse(raw)
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        data?.error ||
        `Ori TensorFlow runtime returned HTTP ${response.status}.`,
    )
  }

  return data as T
}

export type OriIntelligenceMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool' | string
  content: string
}

export type OriIntelligenceChatResult = {
  content: string
  model: string
  version: string
  finish_reason: string
  tool_calls: Array<Record<string, unknown>>
}

export async function getOriIntelligenceStatus() {
  return request<{
    service: string
    status: string
    version: string
    backend: string
    core_model_loaded: boolean
    language_model_loaded: boolean
    language_model_id: string | null
  }>('/v1/status')
}

export async function predictOriIntent(text: string) {
  return request<{
    model: string
    version: string
    label: string
    confidence: number
  }>('/v1/predict', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

export async function chatWithOriSmall(
  messages: OriIntelligenceMessage[],
  options: {
    temperature?: number
    maxTokens?: number
    topK?: number
    tools?: Array<Record<string, unknown>>
  } = {},
) {
  const data = await request<OriIntelligenceChatResult>(
    '/v1/chat',
    {
      method: 'POST',
      body: JSON.stringify({
        messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 96,
        top_k: options.topK ?? 20,
        tools: options.tools ?? [],
      }),
    },
    90_000,
  )

  return {
    ...data,
    content: (data.content ?? '').slice(0, MAX_OUTPUT),
  }
}

export const oriIntelligenceInfo = {
  configured: Boolean(INTELLIGENCE_URL && INTELLIGENCE_API_KEY),
  url: INTELLIGENCE_URL ?? null,
  provider: 'Render',
  model: 'ori-small',
  purpose: "Server-side learned intelligence for Ori's platform.",
}
