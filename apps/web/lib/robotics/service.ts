import { randomUUID } from 'node:crypto'
import type { PerceptionInput, PerceptionResult, PlanResult, RobotState, RoboticsCommand, RoboticsCommandResult } from './types'

const mode = process.env.ORI_ROBOTICS_MODE === 'mock' ? 'mock' : process.env.ORI_ROBOTICS_MODE === 'real' ? 'real' : 'disconnected'
const robotId = process.env.ORI_ROBOT_ID?.trim() || null
const model = process.env.HF_MODEL?.trim() || 'Qwen/Qwen3-0.6B'

function now() { return new Date().toISOString() }

export function getRoboticsState(): RobotState {
  return {
    robotId,
    connection: { connected: mode !== 'disconnected', mode, robotId, lastSeenAt: mode === 'mock' ? now() : null },
    timestamp: now(),
    joints: [],
    footContacts: {},
    batteryPercent: null,
    pose: null,
    capabilities: ['get_robot_state', 'get_camera_frame', 'get_depth_data', 'get_foot_contacts', 'get_joint_states', 'walk_to', 'turn', 'look_at', 'plan_route', 'climb_stairs', 'stop_robot'],
  }
}

function validateCommand(command: RoboticsCommand): string | null {
  if (!command || typeof command !== 'object' || typeof command.name !== 'string') return 'Command name is required.'
  if (command.name === 'walk_to' || command.name === 'plan_route' || command.name === 'look_at') {
    if (!command.target || !['x', 'y', 'z'].every((key) => Number.isFinite(command.target[key as keyof typeof command.target]))) return 'A finite x/y/z target is required.'
  }
  if (command.name === 'walk_to' && command.speed !== undefined && (!Number.isFinite(command.speed) || command.speed <= 0 || command.speed > 1)) return 'Walk speed must be between 0 and 1.'
  if (command.name === 'turn' && (!Number.isFinite(command.degrees) || Math.abs(command.degrees) > 3600)) return 'Turn degrees must be finite and within ±3600.'
  if (command.name === 'climb_stairs' && command.steps !== undefined && (!Number.isInteger(command.steps) || command.steps < 1 || command.steps > 100)) return 'Steps must be an integer from 1 to 100.'
  return null
}

export async function executeRoboticsCommand(command: RoboticsCommand): Promise<RoboticsCommandResult> {
  const invalid = validateCommand(command)
  const timestamp = now()
  if (invalid) return { accepted: false, commandId: randomUUID(), mode, status: 'rejected', message: invalid, timestamp }
  if (command.name !== 'stop_robot' && mode === 'disconnected') return { accepted: false, commandId: randomUUID(), mode, status: 'rejected', message: 'No robot is connected. Real hardware commands are disabled until a robotics connector is configured.', timestamp }
  if (mode === 'mock') return { accepted: true, commandId: randomUUID(), mode, status: 'completed', message: 'Command executed in explicitly configured MOCK mode. No physical hardware was contacted.', timestamp }
  if (mode === 'real') return { accepted: false, commandId: randomUUID(), mode, status: 'rejected', message: 'Real robotics mode is enabled, but no hardware transport adapter is installed. No physical command was sent.', timestamp }
  return { accepted: false, commandId: randomUUID(), mode, status: 'rejected', message: 'Robotics command rejected because the service is disconnected.', timestamp }
}

async function callMentor(prompt: string): Promise<{ text: string; model: string }> {
  const token = process.env.HF_TOKEN?.trim()
  if (!token) throw new Error('HF_TOKEN is not configured.')
  const response = await fetch('https://router.huggingface.co/v1/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: 'You are Ori Robotics planner. Produce concise, safety-aware high-level robotics reasoning. Never issue raw motor commands. Treat the local robotics safety controller as authoritative.' }, { role: 'user', content: prompt }], temperature: 0.2, max_tokens: 500 }),
    signal: AbortSignal.timeout(30000),
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`Hugging Face returned HTTP ${response.status}: ${text.slice(0, 300)}`)
  const data = JSON.parse(text)
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || !content.trim()) throw new Error('Mentor returned no usable reasoning.')
  return { text: content.trim(), model }
}

function lines(text: string) { return text.split(/\n+/).map((line) => line.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean).slice(0, 12) }

export async function planRoboticsTask(input: { goal: string; state?: unknown }): Promise<PlanResult> {
  if (!input.goal?.trim()) throw new Error('A planning goal is required.')
  const mentor = await callMentor(`Goal: ${input.goal.trim()}\nCurrent robot state: ${JSON.stringify(input.state ?? getRoboticsState())}\nReturn a high-level numbered plan and explicit safety notes.`)
  const parsed = lines(mentor.text)
  return { model: mentor.model, provider: 'Hugging Face Inference Router', steps: parsed, safetyNotes: ['Local robotics safety must validate every physical action before execution.', 'Planner output is advisory and must not be treated as a motor command.'], timestamp: now() }
}

export async function analyzeRoboticsPerception(input: PerceptionInput): Promise<PerceptionResult> {
  if (!input.imageBase64 && !input.depth && !input.labels?.length && !input.context?.trim()) throw new Error('Perception input is required.')
  const summary = [input.context?.trim(), input.labels?.length ? `Known labels: ${input.labels.join(', ')}` : '', input.depth ? `Depth matrix supplied: ${input.depth.length} rows` : '', input.imageBase64 ? 'Image supplied.' : ''].filter(Boolean).join('\n')
  const mentor = await callMentor(`Analyze this robotics perception metadata. Do not invent visual facts that are not present in the supplied data.\n${summary}`)
  return { model: mentor.model, provider: 'Hugging Face Inference Router', observations: lines(mentor.text), confidence: null, timestamp: now() }
}
