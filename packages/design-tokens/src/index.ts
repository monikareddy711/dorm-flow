export const tokens = {
  colors: {
    primary: '#005691',
    primaryLight: '#0077c8',
    primaryDark: '#003a61',
    primarySoft: '#eaf3f9',
    secondary: '#008479',
    status: {
      submitted: '#6b7280',
      reviewed: '#3b82f6',
      assigned: '#8b5cf6',
      inProgress: '#f59e0b',
      resolved: '#10b981',
      closed: '#4b5563',
      rejected: '#ef4444',
    },
    urgency: {
      low: '#10b981',
      medium: '#3b82f6',
      high: '#f97316',
      emergency: '#dc2626',
    },
    background: {
      app: '#f8fafc',
      card: '#ffffff',
    },
    text: {
      main: '#0f172a',
      muted: '#64748b',
      light: '#94a3b8',
      inverse: '#ffffff',
    },
  },
  breakpoints: {
    mobile: 360,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },
} as const;

export type DesignTokens = typeof tokens;
