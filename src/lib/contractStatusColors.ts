export const CONTRACT_STATUS_COLORS = {
  ALL: { activeColor: '#3b82f6', inactiveColor: '#64748b', hasDot: false },
  DRAFT: {
    activeColor: '#334155',
    inactiveColor: '#94a3b8',
    hasDot: true,
  },
  PENDING_SIGNATURE: {
    activeColor: '#1d4ed8',
    inactiveColor: '#64748b',
    hasDot: true,
  },
  ACTIVE: {
    activeColor: '#047857',
    inactiveColor: '#6b7280',
    hasDot: true,
  },
  EXPIRING_SOON: {
    activeColor: '#b45309',
    inactiveColor: '#64748b',
    hasDot: true,
  },
  EXPIRED: {
    activeColor: '#b91c1c',
    inactiveColor: '#64748b',
    hasDot: true,
  },
  TERMINATED: {
    activeColor: '#6b7280',
    inactiveColor: '#94a3b8',
    hasDot: true,
  },
} as const;

export type ContractStatus = keyof typeof CONTRACT_STATUS_COLORS;