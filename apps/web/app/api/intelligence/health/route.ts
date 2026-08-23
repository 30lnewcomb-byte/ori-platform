import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.HF_TOKEN?.trim()
  const model = process.env.HF_MODEL?.trim() || 'Qwen/Qwen3-0.6B'

  return NextResponse.json({
    configured: Boolean(token),
    model,
    provider: 'Hugging Face Inference Router',
    tokenPresent: Boolean(token),
    tokenFormat: token ? (token.startsWith('hf_') ? 'hf' : 'unexpected') : 'missing',
    note: 'This endpoint never returns the token itself.',
  })
}
