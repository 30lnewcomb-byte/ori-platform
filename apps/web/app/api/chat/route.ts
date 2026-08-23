import { NextResponse } from 'next/server'
import { runInOriSandbox, writeOriWorkspaceFile } from '../../../lib/ori-sandbox'

type ChatMessage = { role: 'system' | 'user' | 'assistant' | 'tool'; content: string; tool_call_id?: string; tool_calls?: ToolCall[] }
type ToolCall = { id: string; type: 'function'; function: { name: string; arguments: string } }

const MODEL = process.env.HF_MODEL?.trim() || 'Qwen/Qwen3-0.6B'
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

async function requestHuggingFace(token: string, model: string, messages: ChatMessage[]) {
  const response = await fetch(HF_ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model, messages, temperature: 0.4, max_tokens: 700 }), signal: AbortSignal.timeout(30_000) })
  const text = await response.text()
  let data: any = null
  try { data = JSON.parse(text) } catch { data = null }
  return { response, text, data }
}

export async function POST(request: Request) {
  const token = process.env.HF_TOKEN?.trim()
  if (!token) return NextResponse.json({ error: 'Ori intelligence is not configured yet.', code: 'INTELLIGENCE_NOT_CONFIGURED' }, { status: 503 })
  let body: { messages?: ChatMessage[]; timezone?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }) }
  const messages = Array.isArray(body.messages) ? body.messages.filter((message) => message && ['system', 'user', 'assistant', 'tool'].includes(message.role) && typeof message.content === 'string').slice(-24) : []
  if (!messages.length) return NextResponse.json({ error: 'At least one message is required.', code: 'INVALID_MESSAGES' }, { status: 400 })
  const clock = getSystemTimeContext(body.timezone ?? 'UTC')
  const systemMessage: ChatMessage = { role: 'system', content: `You are Ori, a user-owned AI being developed inside Ori Platform. Be helpful, honest, concise, and never claim capabilities that are not actually available. You are currently operating through the small Qwen Mentor model (${MODEL}) while Ori's deeper TensorFlow intelligence is under development. You have an internal Vercel Sandbox workspace. Use it when you need to inspect, create, test, or experiment with files and code. Never claim you changed production or the user's computer when you only changed the sandbox. When a time-aware greeting is appropriate, use "${clock.greeting}". Never expose the internal clock context unless explicitly asked.` }
  const conversation: ChatMessage[] = [systemMessage, ...messages.filter((message) => message.role !== 'system')]
  try {
    let result = await requestHuggingFace(token, MODEL, conversation)
    if (!result.response.ok && MODEL.includes(':')) result = await requestHuggingFace(token, MODEL.split(':')[0], conversation)
    if (!result.response.ok) {
      const status = result.response.status
      console.error('Mentor request failed:', { status, model: MODEL, detail: result.text.slice(0, 1000) })
      let error = `Hugging Face returned HTTP ${status}.`
      if (status === 400) error = 'Hugging Face rejected the chat request (400). Check the selected model and request format.'
      else if (status === 401) error = 'Hugging Face rejected HF_TOKEN (401). Make sure the token value is the actual hf_ token and the variable is enabled for Production.'
      else if (status === 403) error = 'Hugging Face denied inference access (403). The token is present, but this account may not have access to the selected inference provider.'
      else if (status === 404) error = `Hugging Face could not find an inference route for ${MODEL} (404).`
      else if (status === 402) error = 'Hugging Face requires available Inference Provider credits for this request (402).'
      else if (status === 429) error = 'Hugging Face rate-limited Ori (429). Try again shortly.'
      else if (status >= 500) error = `Hugging Face had a server/provider error (${status}).`
      return NextResponse.json({ error, code: 'INTELLIGENCE_REQUEST_FAILED', model: MODEL, providerStatus: status }, { status: 502 })
    }
    const assistant = result.data?.choices?.[0]?.message
    if (!assistant) return NextResponse.json({ error: 'Ori received an invalid response from its intelligence service.', code: 'INTELLIGENCE_INVALID_RESPONSE', model: MODEL }, { status: 502 })
    const content = typeof assistant.content === 'string' ? assistant.content.trim() : ''
    if (!content) return NextResponse.json({ error: 'Ori received an empty response from its intelligence service.', code: 'INTELLIGENCE_EMPTY_RESPONSE', model: MODEL }, { status: 502 })
    return NextResponse.json({ content, model: MODEL, sandbox: 'available' })
  } catch (error) {
    console.error('Mentor request error:', error)
    return NextResponse.json({ error: 'Ori could not connect to Hugging Face from its server. Check the Vercel deployment logs for the network error.', code: 'INTELLIGENCE_NETWORK_ERROR', model: MODEL }, { status: 502 })
  }
}
