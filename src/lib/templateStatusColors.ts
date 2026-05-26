export const TEMPLATE_STATUS_COLORS = {
  ALL: { activeColor: '#3b82f6', inactiveColor: '#64748b' },
  ACTIVE: { activeColor: '#047857', inactiveColor: '#6b7280', hasDot: true },
  DRAFT: { activeColor: '#b45309', inactiveColor: '#94a3b8', hasDot: true },
  PUBLISHED: { activeColor: '#047857', inactiveColor: '#6b7280', hasDot: true },
  ARCHIVED: { activeColor: '#334155', inactiveColor: '#94a3b8', hasDot: true },
} as const;