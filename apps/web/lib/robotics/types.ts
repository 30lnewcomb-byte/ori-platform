export const ROBOTICS_COMMANDS = ['walk_to', 'turn', 'look_at', 'plan_route', 'climb_stairs', 'stop_robot'] as const
export type RoboticsCommandName = (typeof ROBOTICS_COMMANDS)[number]

export type Vector3 = { x: number; y: number; z: number }
export type RobotConnection = { connected: boolean; mode: 'real' | 'mock' | 'disconnected'; robotId: string | null; lastSeenAt: string | null }
export type JointState = { id: string; position: number; velocity: number | null; effort: number | null }
export type RobotState = {
  robotId: string | null
  connection: RobotConnection
  timestamp: string
  joints: JointState[]
  footContacts: Record<string, boolean>
  batteryPercent: number | null
  pose: { position: Vector3; headingDeg: number } | null
  capabilities: string[]
}

export type RoboticsCommand =
  | { name: 'walk_to'; target: Vector3; speed?: number }
  | { name: 'turn'; degrees: number; speed?: number }
  | { name: 'look_at'; target: Vector3 }
  | { name: 'plan_route'; target: Vector3 }
  | { name: 'climb_stairs'; direction: 'up' | 'down'; steps?: number }
  | { name: 'stop_robot'; reason?: string }

export type RoboticsCommandResult = {
  accepted: boolean
  commandId: string
  mode: 'real' | 'mock' | 'disconnected'
  status: 'queued' | 'rejected' | 'completed'
  message: string
  timestamp: string
}

export type PerceptionInput = { imageBase64?: string; depth?: number[][]; labels?: string[]; context?: string }
export type PerceptionResult = { model: string; provider: string; observations: string[]; confidence: number | null; timestamp: string }
export type PlanResult = { model: string; provider: string; steps: string[]; safetyNotes: string[]; timestamp: string }
