import { NextResponse } from 'next/server'
import { prewarmOriVmForIntent, readFromOriVm, runInOriVm, writeToOriVm } from '../../../lib/ori-vm'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  tool_call_id?: string
  tool_calls?: ToolCall[]
}

type ToolCall = {
  id: string
  type: 'function'
  function: { name: string; arguments: string }
}

type ToolResult = Record<string, unknown>

type IntelligenceResponse = {
  content?: unknown
  model?: unknown
  tool_calls?: unknown
  error?: unknown
}

const INTELLIGENCE_URL =
  process.env.ORI_INTELLIGENCE_URL?.trim().replace(/\/$/, '')
const INTELLIGENCE_API_KEY = process.env.ORI_INTELLIGENCE_API_KEY?.trim()

const INTERNAL_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'ori_vm',
      description:
        "Internal Ori capability for controlled work in Ori's private isolated workspace. Use only when the task genuinely requires creating, reading, or executing workspace content. Never expose infrastructure details to the user.",
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['execute', 'write', 'read'],
            description: 'The concrete workspace operation to perform.',
          },
          command: {
            type: 'string',
            description: 'Allowlisted command to execute. Required for execute.',
          },
          args: {
            type: 'array',
            items: { type: 'string' },
            description: 'Arguments for the allowlisted command.',
          },
          path: {
            type: 'string',
            description: 'Workspace-relative path. Required for write and read.',
          },
          content: {
            type: 'string',
            description: 'UTF-8 text to write. Required for write.',
          },
          timeout_seconds: {
            type: 'integer',
            minimum: 1,
            maximum: 30,
            description: 'Execution timeout in seconds.',
          },
        },
        required: ['action'],
        additionalProperties: false,
      },
    },
  },
] as const

function getSystemTimeContext(timeZone: string) {
  const safeTimeZone =
    typeof timeZone === 'string' && timeZone.includes('/') ? timeZone : 'UTC'
  const hour = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: safeTimeZone,
    }).format(new Date()),
  )
  return {
    greeting:
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening',
  }
}

function isToolCall(value: unknown): value is ToolCall {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ToolCall>
  return (
    typeof candidate.id === 'string' &&
    candidate.type === 'function' &&
    typeof candidate.function === 'object' &&
    candidate.function !== null &&
    typeof candidate.function.name === 'string' &&
    typeof candidate.function.arguments === 'string'
  )
}

function isToolCallArray(value: unknown): value is ToolCall[] {
  return Array.isArray(value) && value.every(isToolCall)
}

function parseToolArguments(raw: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(raw || '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as Record<string, unknown>
  } catch {
    return null
  }
}

function getString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? value
    : []
}

async function executeTool(call: ToolCall): Promise<ToolResult> {
  if (call.function.name !== 'ori_vm') {
    return { ok: false, error: 'Unknown internal tool.' }
  }

  const args = parseToolArguments(call.function.arguments)
  if (!args) return { ok: false, error: 'Invalid tool arguments.' }

  try {
    const action = getString(args.action)

    if (action === 'execute') {
      const command = getString(args.command)
      if (!command) {
        return { ok: false, error: 'A command is required for VM execution.' }
      }

      const commandArgs = getStringArray(args.args)
      const timeoutSeconds =
        typeof args.timeout_seconds === 'number' &&
        Number.isInteger(args.timeout_seconds)
          ? Math.min(Math.max(args.timeout_seconds, 1), 30)
          : 10

      await prewarmOriVmForIntent({
        tool: 'ori_vm',
        action: 'execute',
        committed: true,
      })

      return {
        ok: true,
        ...(await runInOriVm(command, commandArgs, timeoutSeconds)),
      }
    }

    if (action === 'write') {
      const path = getString(args.path)
      const textContent = getString(args.content)
      if (path === null || textContent === null) {
        return {
          ok: false,
          error: 'A path and text content are required for VM writes.',
        }
      }

      await prewarmOriVmForIntent({
        tool: 'ori_vm',
        action: 'write_and_execute',
        committed: true,
      })

      return {
        ok: true,
        ...(await writeToOriVm(path, textContent)),
      }
    }

    if (action === 'read') {
      const path = getString(args.path)
      if (path === null) {
        return { ok: false, error: 'A path is required for VM reads.' }
      }

      return {
        ok: true,
        ...(await readFromOriVm(path)),
      }
    }

    return { ok: false, error: 'Unsupported VM action.' }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'VM operation failed.',
    }
  }
}

export async function POST(request: Request) {
  if (!INTELLIGENCE_URL || !INTELLIGENCE_API_KEY) {
    return NextResponse.json(
      {
        error: 'Ori TensorFlow intelligence runtime is not configured yet.',
        code: 'INTELLIGENCE_NOT_CONFIGURED',
      },
      { status: 503 },
    )
  }

  let body: { messages?: ChatMessage[]; timezone?: string }
  try {
    body = (await request.json()) as {
      messages?: ChatMessage[]
      timezone?: string
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    )
  }

  const messages = Array.isArray(body.messages)
    ? body.messages
        .filter(
          (message) =>
            message &&
            ['system', 'user', 'assistant', 'tool'].includes(message.role) &&
            typeof message.content === 'string',
        )
        .slice(-24)
    : []

  if (!messages.length) {
    return NextResponse.json(
      { error: 'At least one message is required.', code: 'INVALID_MESSAGES' },
      { status: 400 },
    )
  }

  const clock = getSystemTimeContext(body.timezone ?? 'UTC')
  const systemMessage: ChatMessage = {
    role: 'system',
    content:
      "You are Ori, a user-owned AI being developed inside Ori Platform. Be helpful, honest, concise, and never claim capabilities that are not actually available. Your intelligence is provided by Ori's private TensorFlow runtime. You have internal server-side tools available through Ori Core. Use a tool only when the task genuinely requires it. Never expose internal infrastructure, provider names, API routes, credentials, tool plumbing, or sandbox implementation details to the user. Never claim you changed production or the user's computer when you only performed an internal operation. When a time-aware greeting is appropriate, use the greeting provided by the platform. Never expose the internal clock context unless explicitly asked.",
  }
  void clock

  let workingMessages: ChatMessage[] = [
    systemMessage,
    ...messages.filter((message) => message.role !== 'system'),
  ]

  try {
    let finalData: IntelligenceResponse = {}

    for (let step = 0; step < 4; step += 1) {
      const response = await fetch(INTELLIGENCE_URL + '/v1/chat', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + INTELLIGENCE_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: workingMessages,
          tools: INTERNAL_TOOLS,
        }),
        signal: AbortSignal.timeout(45_000),
      })

      const text = await response.text()
      let data: IntelligenceResponse = {}

      try {
        const parsed: unknown = JSON.parse(text)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          data = parsed as IntelligenceResponse
        }
      } catch {
        data = {}
      }

      if (!response.ok) {
        console.error('Ori TensorFlow runtime failed:', {
          status: response.status,
          detail: text.slice(0, 1000),
        })

        const errorMessage =
          typeof data.error === 'string'
            ? data.error
            : 'Ori TensorFlow runtime returned HTTP ' + response.status + '.'

        return NextResponse.json(
          { error: errorMessage, code: 'INTELLIGENCE_REQUEST_FAILED' },
          { status: 502 },
        )
      }

      finalData = data
      const toolCalls = isToolCallArray(data.tool_calls)
        ? data.tool_calls
        : []

      if (!toolCalls.length) break

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: getString(data.content) ?? '',
        tool_calls: toolCalls,
      }

      workingMessages = [...workingMessages, assistantMessage]

      for (const toolCall of toolCalls) {
        const toolResult = await executeTool(toolCall)

        workingMessages.push({
          role: 'tool',
          content: JSON.stringify(toolResult),
          tool_call_id: toolCall.id,
        })
      }
    }

    const content = getString(finalData.content)?.trim() ?? ''
    if (!content) {
      return NextResponse.json(
        {
          error:
            "Ori received an empty response from its TensorFlow intelligence runtime.",
          code: 'INTELLIGENCE_EMPTY_RESPONSE',
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      content,
      model: getString(finalData.model) ?? 'ori-tensorflow',
    })
  } catch (error) {
    console.error('Ori TensorFlow runtime connection error:', error)
    return NextResponse.json(
      {
        error:
          'Ori could not connect to its private TensorFlow intelligence runtime.',
        code: 'INTELLIGENCE_NETWORK_ERROR',
      },
      { status: 502 },
    )
  }
}
