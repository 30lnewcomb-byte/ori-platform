export const DEFAULT_ORI_PREFERENCES = {
  appearance: 'light',
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

export const APPEARANCE_OPTIONS = [
  {
    value: 'system',
    label: 'System',
    description: 'Follow your device setting.',
    previewClass: 'previewSystem',
  },
  {
    value: 'light',
    label: 'Light',
    description: 'Soft white with charcoal navigation.',
    previewClass: 'previewLight',
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'A dark canvas with lighter text.',
    previewClass: 'previewDark',
  },
] as const

export const ACCENT_OPTIONS = [
  { value: 'blue', label: 'Blue', color: '#3979c6' },
  { value: 'green', label: 'Green', color: '#288357' },
  { value: 'yellow', label: 'Yellow', color: '#9c6900' },
  { value: 'pink', label: 'Pink', color: '#bd4f83' },
  { value: 'orange', label: 'Orange', color: '#b85c2a' },
  { value: 'purple', label: 'Purple', color: '#795bc0' },
  { value: 'neutral', label: 'Neutral', color: '#4d5968' },
] as const
