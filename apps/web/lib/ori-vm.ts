import 'server-only'

const VM_URL =
  process.env.ORI_VM_URL?.trim().replace(/\/$/, '') ||
  'https://ori-vm-runtime.onrender.com'
const VM_API_KEY = process.env.ORI_VM_API_KEY?.trim()

const VM_WAKE_TIMEOUT_MS = 75_000
const MAX_OUTPUT = 12000

let prewarmInFlight: Promise<{ status: string; service: string; version: string }> | null = null
let lastSuccessfulPrewarmAt = 0
const PREWARM_COOLDOWN_MS = 90_000

export type OriVmIntent = {
  tool: string
  action: 'execute' | 'write_and_execute' | string
  committed: boolean
}

export function shouldPrewarmOriVm(intent: OriVmIntent) {
  return (
    intent.committed &&
    intent.tool === 'ori_vm' &&
    (intent.action === 'execute' || intent.action === 'write_and_execute')
  )
}
const MAX_FILE_BYTES = 100_000

function requireConfigured() {
  if (!VM_URL || !VM_API_KEY) {
    throw new Error('Ori VM runtime is not configured.')
  }
}

async function request<T>(path: string, init: RequestInit = {}, timeoutMs = 30_000): Promise<T> {
  requireConfigured()
  const response = await fetch(`${VM_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${VM_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
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
    throw new Error(data?.detail || data?.error || `Ori VM returned HTTP ${response.status}.`)
  }

  return data as T
}

export async function prewarmOriVm() {
  if (!VM_URL) {
    throw new Error('Ori VM runtime URL is not configured.')
  }

  const response = await fetch(`${VM_URL}/v1/wake`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(VM_WAKE_TIMEOUT_MS),
  })

  const raw = await response.text()
  let data: any = null
  try {
    data = JSON.parse(raw)
  } catch {
    data = null
  }

  if (!response.ok || data?.status !== 'ready') {
    throw new Error(data?.detail || `Ori VM wake returned HTTP ${response.status}.`)
  }

  return {
    status: data.status,
    service: data.service,
    version: data.version,
  }
}

export async function prewarmOriVmForIntent(intent: OriVmIntent) {
  if (!shouldPrewarmOriVm(intent)) {
    return { started: false as const, reason: 'speculative-or-non-vm-action' }
  }

  if (!prewarmInFlight && Date.now() - lastSuccessfulPrewarmAt >= PREWARM_COOLDOWN_MS) {
    prewarmInFlight = prewarmOriVm().then((result) => {
      lastSuccessfulPrewarmAt = Date.now()
      return result
    }).finally(() => {
      prewarmInFlight = null
    })
  }

  return {
    started: true as const,
    wake: prewarmInFlight,
  }
}
export async function getOriVmStatus() {
  return request<{
    service: string
    status: string
    version: string
    workspace: string
    execution: string
    commands: string[]
  }>('/v1/status')
}

export async function runInOriVm(command: string, args: string[] = [], timeoutSeconds = 10) {
  if (prewarmInFlight) {
    await prewarmInFlight.catch(() => undefined)
  }

  const data = await request<{
    ok: boolean
    status: string
    exit_code: number | null
    stdout: string
    stderr: string
  }>('/v1/execute', {
    method: 'POST',
    body: JSON.stringify({
      command,
      args: args.slice(0, 32),
      timeout_seconds: Math.min(Math.max(timeoutSeconds, 1), 30),
    }),
  }, 90_000)

  return {
    exitCode: data.exit_code,
    stdout: (data.stdout ?? '').slice(-MAX_OUTPUT),
    stderr: (data.stderr ?? '').slice(-MAX_OUTPUT),
    status: data.status,
  }
}

export async function writeToOriVm(path: string, content: string) {
  if (!path || path.includes('..')) {
    throw new Error('VM workspace paths cannot escape the workspace.')
  }
  if (Buffer.byteLength(content, 'utf8') > MAX_FILE_BYTES) {
    throw new Error('VM workspace file is too large.')
  }

  return request<{ ok: boolean; path: string; bytes: number }>('/v1/files/write', {
    method: 'POST',
    body: JSON.stringify({ path, content }),
  })
}

export async function readFromOriVm(path: string) {
  if (!path || path.includes('..')) {
    throw new Error('VM workspace paths cannot escape the workspace.')
  }

  return request<{ ok: boolean; path: string; content: string }>('/v1/files/read', {
    method: 'POST',
    body: JSON.stringify({ path }),
  })
}

export const oriVmInfo = {
  configured: Boolean(VM_URL && VM_API_KEY),
  url: VM_URL ?? null,
  provider: 'Render',
  purpose: 'Server-side execution workspace for Ori.',
}
