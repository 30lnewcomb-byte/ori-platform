import { NextResponse } from 'next/server'
import { prewarmOriVmForIntent, readFromOriVm, runInOriVm, writeToOriVm } from '../../../lib/ori-vm'

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
  {
    type: 'function',
    function: {
      name: 'ori_vm',
      description: "Internal Ori capability for controlled work in Ori's private isolated workspace. Use only when the task genuinely requires creating, reading, or executing workspace content. Never expose infrastructure details to the user.",
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['execute', 'write', 'read'],
            description: 'The concrete workspace operation to perform.',
          },
          command: { type: 'string', description: 'Allowlisted command to execute. Required for execute.' },
          args: { type: 'array', items: { type: 'string' }, description: 'Arguments for the allowlisted command.' },
          path: { type: 'string', description: 'Workspace-relative path. Required for write and read.' },
          content: { type: 'string', description: 'UTF-8 text to write. Required for write.' },
          timeout_seconds: { type: 'integer', minimum: 1, maximum: 30, description: 'Execution timeout in seconds.' },
        },
        required: ['action'],
        additionalProperties: false,
      },
    },
  },
]

function getSystemTimeContext(timeZone: string) {
  const safeTimeZone = typeof timeZone === 'string' && timeZone.includes('/') ? timeZone : 'UTC'
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: safeTimeZone }).format(new Date()))
  return { greeting: hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening' }
}

async function executeTool(call: ToolCall) {
  let args: Record<string, unknown>
  try { args = JSON.parse(call.function.arguments || '{}') } catch { return { ok: false, error: 'Invalid tool arguments.' } }

  if (call.function.name !== 'ori_vm') {
    return { ok: false, error: `Unknown tool: ${call.function.name}` }
  }

  const action = typeof args.action === 'string' ? args.action : ''

  try {
    if (action === 'execute') {
      const command = typeof args.command === 'string' ? args.command : ''
      const commandArgs = Array.isArray(args.args) && args.args.every((value) => typeof value === 'string') ? args.args as string[] : []
      if (!command) return { ok: false, error: 'A command is required for VM execution.' }

      await prewarmOriVmForIntent({ tool: 'ori_vm', action: 'execute', committed: true })
      const timeoutSeconds = typeof args.timeout_seconds === 'number' ? args.timeout_seconds : 10
      return { ok: true, ...(await runInOriVm(command, commandArgs, timeoutSeconds)) }
    }

    if (action === 'write') {
      if (typeof args.path !== 'string' || typeof args.content !== 'string') return { ok: false, error: 'A path and text content are required for VM writes.' }

      await prewarmOriVmForIntent({ tool: 'ori_vm', action: 'write_and_execute', committed: true })
      return { ok: true, ...(await writeToOriVm(args.path, args.content)) }
    }

    if (action === 'read') {
      if (typeof args.path !== 'string') return { ok: false, error: 'A path is required for VM reads.' }

      await prewarmOriVmForIntent({ tool: 'ori_vm', action: 'execute', committed: true })
      return { ok: true, ...(await readFromOriVm(args.path)) }
    }

    return { ok: false, error: 'Unsupported VM action.' }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'VM operation failed.' }
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
    content: 'You are Ori, a user-owned AI being developed inside Ori Platform. Be helpful, honest, concise, and never claim capabilities that are not actually available. Your intelligence is provided by Ori\'s private TensorFlow runtime. You have internal server-side tools available through Ori Core. Use a tool only when the task genuinely requires it. Never expose internal infrastructure, provider names, API routes, credentials, tool plumbing, or sandbox implementation details to the user. Never claim you changed production or the user\'s computer when you only performed an internal operation. When a time-aware greeting is appropriate, use the greeting provided by the platform. Never expose the internal clock context unless explicitly asked.',
  }
  void clock

  let workingMessages: ChatMessage[] = [
    systemMessage,
    ...messages.filter((message) => message.role !== 'system'),
  ]

  try {
    let finalData: any = null

    for (let step = 0; step < 4; step += 1) {
      const response = await fetch(`${INTELLIGENCE_URL}/v1/chat`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${INTELLIGENCE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: workingMessages, tools: INTERNAL_TOOLS }),
        signal: AbortSignal.timeout(45_000),
      })

      const text = await response.text()
      let data: any = null
      try { data = JSON.parse(text) } catch { data = null }

      if (!response.ok) {
        console.error('Ori TensorFlow runtime failed:', { status: response.status, detail: text.slice(0, 1000) })
        return NextResponse.json({ error: data?.error || `Ori TensorFlow runtime returned HTTP ${response.status}.`, code: 'INTELLIGENCE_REQUEST_FAILED' }, { status: 502 })
      }

      finalData = data
      const toolCalls = Array.isArray(data?.tool_calls) ? data.tool_calls : []
      if (!toolCalls.length) break

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: typeof data?.content === 'string' ? data.content : '',
        tool_calls: toolCalls as ToolCall[],
      }
      workingMessages = [...workingMessages, assistantMessage]

      for (const toolCall of toolCalls) {
        if (!toolCall?.id || toolCall?.type !== 'function' || typeof toolCall?.function?.name !== 'string') {
          workingMessages.push({
            role: 'tool',
            content: JSON.stringify({ ok: false, error: 'Invalid internal tool call.' }),
          })
          continue
        }

        const toolResult = await executeTool(toolCall as ToolCall)
        workingMessages.push({
          role: 'tool',
          content: JSON.stringify(toolResult),
          tool_call_id: toolCall.id,
        })
      }
    }

    const content = typeof finalData?.content === 'string' ? finalData.content.trim() : ''
    if (!content) return NextResponse.json({ error: 'Ori received an empty response from its TensorFlow intelligence runtime.', code: 'INTELLIGENCE_EMPTY_RESPONSE' }, { status: 502 })

    return NextResponse.json({
      content,
      model: finalData?.model ?? 'ori-tensorflow',
    })
  } catch (error) {
    console.error('Ori TensorFlow runtime connection error:', error)
    return NextResponse.json({ error: 'Ori could not connect to its private TensorFlow intelligence runtime.', code: 'INTELLIGENCE_NETWORK_ERROR' }, { status: 502 })
  }
}
