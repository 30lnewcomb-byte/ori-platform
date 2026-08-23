export type OriDepth = 'quick' | 'normal' | 'deep'

export type OriRequest = {
  input: string
  depth?: OriDepth
  projectId?: string
}

export type OriResponse = {
  text: string
  model: 'tensorflow-core' | 'mentor'
  depth: OriDepth
}

export interface OriIntelligence {
  respond(request: OriRequest): Promise<OriResponse>
}

/**
 * Placeholder adapter boundary for the planned TensorFlow core + Mentor
 * architecture. It intentionally fails closed until a real model runtime is
 * connected instead of pretending the AI is online.
 */
export class UnconfiguredOriIntelligence implements OriIntelligence {
  async respond(request: OriRequest): Promise<OriResponse> {
    const depth = request.depth ?? 'normal'
    throw new Error(
      `Ori intelligence is not connected yet (requested ${depth} depth). Connect the configured model runtime before handling user input.`,
    )
  }
}
