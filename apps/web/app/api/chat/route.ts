import { NextResponse } from 'next/server'
import { prewarmOriVmForIntent, runInOriVm, writeToOriVm } from '../../../lib/ori-vm'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  tool_call_id?: string
  tool_calls?: ToolCall[]
}
type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } }

const INTELLIGENCE_URL = process.env.ORI_INTELLIGENCE_URL?.trim().replace(/\/$/, '')
const INTELLIGENCE_API_KEY = process.env.ORI_INTELLIGENCE_API_KEY?.trim()

const INTERNAL_TOOLS = [
  { type: 'function', function: { name: 'run_sandbox_command', description: "Internal Ori capability: run a safe command inside Ori's private isolated workspace. Do not describe infrastructure details to the user.", parameters: { type: 'object', properties: { command: { type: 'string' }, args: { type: 'array', items: { type: 'string' } } }, required: ['command'] } } },
  { type: 'function', function: { name: 'write_workspace_file', description: "Internal Ori capability: write a text file into Ori's private isolated workspace.", parameters: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] } } },
]

function getSystemTimeContext(timeZone: string) {
  const safeTimeZone = typeof timeZone === 'string' && timeZone.includes('/') ? timeZone : 'UTC'
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: safeTimeZone }).format(new Date()))
  return { greeting: hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening' }
}

async function executeTool(call: ToolCall) {
  let args: Record<string, unknown>
  try { args = JSON.parse(call.function.arguments || '{}') } catch { return { ok: false, error: 'Invalid tool arguments.' } }

  try {
    if (call.function.name === 'run_sandbox_command') {
      const command = typeof args.command === 'string' ? args.command : ''
      const commandArgs = Array.isArray(args.args) && args.args.every((value) => typeof value === 'string') ? args.args as string[] : []
      if (!command) return { ok: false, error: 'A command is required.' }

      // The tool call is now a committed server-side action, so prewarm can
      // begin before the actual execution request. This is invisible to the UI.
      await prewarmOriVmForIntent({
        tool: 'ori_vm',
        action: 'execute',
        committed: true,
      })
      return { ok: true, ...(await runInOriVm(command, commandArgs)) }
    }

    if (call.function.name === 'write_workspace_file') {
      if (typeof args.path !== 'string' || typeof args.content !== 'string') return { ok: false, error: 'A path and text content are required.' }

      await prewarmOriVmForIntent({
        tool: 'ori_vm',
        action: 'write_and_execute',
        committed: true,
      })
      await writeToOriVm(args.path, args.content)
      return { ok: true, path: args.path }
    }

    return { ok: false, error: `Unknown tool: ${call.function.name}` }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Sandbox operation failed.' }
  }
}

export async function POST(request: Request) {
  if (!INTELLIGENCE_URL || !INTELLIGENCE_API_KEY) {
    return NextResponse.json({ error: 'Ori TensorFlow intelligence runtime is not configured yet.', code: 'INTELLIGENCE_NOT_CONFIGURED' }, { status: 503 })
  }

  let body: { messages?: ChatMessage[]; timezone?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter((message) => message && ['system', 'user', 'assistant', 'tool'].includes(message.role) && typeof message.content === 'string').slice(-24)
    : []
  if (!messages.length) return NextResponse.json({ error: 'At least one message is required.', code: 'INVALID_MESSAGES' }, { status: 400 })

  const clock = getSystemTimeContext(body.timezone ?? 'UTC')
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `You are Ori, a user-owned AI being developed inside Ori Platform. Be helpful, honest, concise, and never claim capabilities that are not actually available. Your intelligence is provided by Ori's private TensorFlow runtime. You have an internal sandbox workspace. Use it when you need to inspect, create, test, or experiment with files and code. Never claim you changed production or the user's computer when you only changed the sandbox. When a time-aware greeting is appropriate, use "${clock.greeting}". Never expose the internal clock context unless explicitly asked.`,
  }

  try {
    const response = await fetch(`${INTELLIGENCE_URL}/v1/chat`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${INTELLIGENCE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [systemMessage, ...messages.filter((message) => message.role !== 'system')], tools: INTERNAL_TOOLS }),
      signal: AbortSignal.timeout(30_000),
    })
    const text = await response.text()
    let data: any = null
    try { data = JSON.parse(text) } catch { data = null }

    if (!response.ok) {
      console.error('Ori TensorFlow runtime failed:', { status: response.status, detail: text.slice(0, 1000) })
      return NextResponse.json({ error: data?.error || `Ori TensorFlow runtime returned HTTP ${response.status}.`, code: 'INTELLIGENCE_REQUEST_FAILED' }, { status: 502 })
    }

    const toolCalls = Array.isArray(data?.tool_calls) ? data.tool_calls : []
    for (const toolCall of toolCalls) {
      if (toolCall?.type === 'function' && typeof toolCall?.function?.name === 'string') {
        const toolResult = await executeTool(toolCall as ToolCall)
        // Tool execution stays server-side. The result is retained only for
        // the orchestration response and is never exposed as VM infrastructure metadata.
        console.info('Ori internal tool completed', {
          tool: toolCall.function.name,
          ok: toolResult.ok,
        })
      }
    }

    const content = typeof data?.content === 'string' ? data.content.trim() : ''
    if (!content) return NextResponse.json({ error: 'Ori received an empty response from its TensorFlow intelligence runtime.', code: 'INTELLIGENCE_EMPTY_RESPONSE' }, { status: 502 })
    return NextResponse.json({ content, model: data.model ?? 'ori-tensorflow', sandbox: 'render-vm' })
  } catch (error) {
    console.error('Ori TensorFlow runtime connection error:', error)
    return NextResponse.json({ error: 'Ori could not connect to its private TensorFlow intelligence runtime.', code: 'INTELLIGENCE_NETWORK_ERROR' }, { status: 502 })
  }
}
