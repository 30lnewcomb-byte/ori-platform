import { NextResponse } from 'next/server'
import { runInOriSandbox, writeOriWorkspaceFile } from '../../../lib/ori-sandbox'

type ChatMessage = { role: 'system' | 'user' | 'assistant' | 'tool'; content: string; tool_call_id?: string; tool_calls?: ToolCall[] }
type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } }

const MODEL = process.env.HF_MODEL ?? 'Qwen/Qwen3-0.6B'
const ROUTED_MODEL = MODEL.includes(':') ? MODEL : `${MODEL}:fastest`
const HF_ENDPOINT = 'https://router.huggingface.co/v1/chat/completions'
const SANDBOX_TOOLS = [{ type: 'function', function: { name: 'run_sandbox_command', description: 'Run a safe command inside Ori\'s private isolated Vercel Sandbox workspace.', parameters: { type: 'object', properties: { command: { type: 'string' }, args: { type: 'array', items: { type: 'string' } } }, required: ['command'] } } }, { type: 'function', function: { name: 'write_workspace_file', description: 'Write a text file into Ori\'s private sandbox workspace.', parameters: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] } } }]

function getSystemTimeContext(timeZone: string) {
  const safeTimeZone = typeof timeZone === 'string' && timeZone.includes('/') ? timeZone : 'UTC'
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: safeTimeZone }).format(new Date()))
  return { timeZone: safeTimeZone, greeting: hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening' }
}

async function executeTool(call: ToolCall) {
  let args: Record<string, unknown>
  try { args = JSON.parse(call.function.arguments || '{}') } catch { return { ok: false, error: 'Invalid tool arguments.' } }
  try {
    if (call.function.name === 'run_sandbox_command') {
      const command = typeof args.command === 'string' ? args.command : ''
      const commandArgs = Array.isArray(args.args) && args.args.every((value) => typeof value === 'string') ? args.args as string[] : []
      if (!command) return { ok: false, error: 'A command is required.' }
      return { ok: true, ...(await runInOriSandbox(command, commandArgs)) }
    }
    if (call.function.name === 'write_workspace_file') {
      if (typeof args.path !== 'string' || typeof args.content !== 'string') return { ok: false, error: 'A path and text content are required.' }
      await writeOriWorkspaceFile(args.path, args.content)
      return { ok: true, path: args.path }
    }
    return { ok: false, error: `Unknown tool: ${call.function.name}` }
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : 'Sandbox operation failed.' } }
}

export async function POST(request: Request) {
  const token = process.env.HF_TOKEN?.trim()
  if (!token) return NextResponse.json({ error: 'Ori intelligence is not configured yet.', code: 'INTELLIGENCE_NOT_CONFIGURED' }, { status: 503 })
  let body: { messages?: ChatMessage[]; timezone?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }
  const messages = Array.isArray(body.messages) ? body.messages.filter((message) => message && ['system', 'user', 'assistant', 'tool'].includes(message.role) && typeof message.content === 'string').slice(-24) : []
  if (!messages.length) return NextResponse.json({ error: 'At least one message is required.' }, { status: 400 })
  const clock = getSystemTimeContext(body.timezone ?? 'UTC')
  const systemMessage: ChatMessage = { role: 'system', content: `You are Ori, a user-owned AI being developed inside Ori Platform. Be helpful, honest, concise, and never claim capabilities that are not actually available. You are currently operating through the small Qwen Mentor model (${MODEL}) while Ori's deeper TensorFlow intelligence is under development. You have an internal Vercel Sandbox workspace. Use it when you need to inspect, create, test, or experiment with files and code. Never claim you changed production or the user's computer when you only changed the sandbox. When a time-aware greeting is appropriate, use "${clock.greeting}". Never expose the internal clock context unless explicitly asked.` }
  const conversation: ChatMessage[] = [systemMessage, ...messages.filter((message) => message.role !== 'system')]
  try {
    for (let turn = 0; turn < 4; turn += 1) {
      const requestBody: Record<string, unknown> = { model: ROUTED_MODEL, messages: conversation, temperature: 0.4, max_tokens: 700 }
      if (process.env.ORI_ENABLE_SANDBOX_TOOLS === 'true') { requestBody.tools = SANDBOX_TOOLS; requestBody.tool_choice = 'auto' }
      const response = await fetch(HF_ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody), signal: AbortSignal.timeout(30_000) })
      if (!response.ok) { const detail = await response.text(); console.error('Mentor request failed:', response.status, detail); return NextResponse.json({ error: 'Ori could not reach its intelligence service.', code: 'INTELLIGENCE_REQUEST_FAILED', model: ROUTED_MODEL, providerStatus: response.status }, { status: 502 }) }
      const data = await response.json(); const assistant = data?.choices?.[0]?.message
      if (!assistant) return NextResponse.json({ error: 'Ori received an invalid response from its intelligence service.', code: 'INTELLIGENCE_INVALID_RESPONSE', model: ROUTED_MODEL }, { status: 502 })
      const toolCalls: ToolCall[] = Array.isArray(assistant.tool_calls) ? assistant.tool_calls : []
      if (!toolCalls.length) { const content = assistant.content; if (typeof content !== 'string' || !content.trim()) return NextResponse.json({ error: 'Ori received an empty response from its intelligence service.', code: 'INTELLIGENCE_EMPTY_RESPONSE', model: ROUTED_MODEL }, { status: 502 }); return NextResponse.json({ content, model: MODEL, sandbox: 'available' }) }
      conversation.push({ role: 'assistant', content: typeof assistant.content === 'string' ? assistant.content : '', tool_calls: toolCalls })
      for (const call of toolCalls) conversation.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(await executeTool(call)) })
    }
    return NextResponse.json({ error: 'Ori reached its workspace operation limit for this request.', code: 'SANDBOX_TURN_LIMIT', model: ROUTED_MODEL }, { status: 502 })
  } catch (error) { console.error('Mentor request error:', error); return NextResponse.json({ error: 'Ori could not reach its intelligence service.', code: 'INTELLIGENCE_NETWORK_ERROR', model: ROUTED_MODEL }, { status: 502 }) }
}
