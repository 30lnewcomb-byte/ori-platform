export const DEFAULT_ORI_PREFERENCES = {
  appearance: 'system',
  accent: 'blue',
} as const

export const APPEARANCES = ['system', 'light', 'dark'] as const
export const ACCENT_COLORS = ['blue', 'green', 'yellow', 'pink', 'orange', 'purple', 'neutral'] as const

export type OriAppearance = (typeof APPEARANCES)[number]
export type OriAccent = (typeof ACCENT_COLORS)[number]
export type OriPreferences = {
  appearance: OriAppearance
  accent: OriAccent
}

export function normalizeOriPreferences(value: unknown): OriPreferences {
  if (!value || typeof value !== 'object') return DEFAULT_ORI_PREFERENCES

  const candidate = value as Record<string, unknown>
  const appearance = APPEARANCES.includes(candidate.appearance as OriAppearance)
    ? candidate.appearance as OriAppearance
    : DEFAULT_ORI_PREFERENCES.appearance
  const accent = ACCENT_COLORS.includes(candidate.accent as OriAccent)
    ? candidate.accent as OriAccent
    : DEFAULT_ORI_PREFERENCES.accent

  return { appearance, accent }
}
