import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const form = await request.formData()
  const token = String(form.get('hfToken') ?? '').trim()

  if (!token || !token.startsWith('hf_')) {
    return NextResponse.json({ ok: false, error: 'Enter a valid Hugging Face token.' }, { status: 400 })
  }

  // TODO: Persist this in Ori's encrypted server-side secret store.
  // Never write the token to GitHub, client storage, logs, or response bodies.
  return NextResponse.json({ ok: false, error: 'Secure secret storage is not configured yet.' }, { status: 503 })
}
