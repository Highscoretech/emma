export const colors = {
  primary: '#1976FF',
  primaryDark: '#0D47A1',
  primaryLight: '#64B5F6',
  accent: '#40C4FF',
  white: '#FFFFFF',
  whiteAlpha70: 'rgba(255,255,255,0.7)',
  whiteAlpha80: 'rgba(255,255,255,0.8)',
  background: '#F5F8FF',
  surface: '#FFFFFF',
  text: '#0B1F3A',
  textMuted: '#5A6B85',
  border: '#E1E8F5',
  success: '#2E7D32',
  warning: '#ED6C02',
  danger: '#C62828',
} as const;

export const gradient = {
  primary: [colors.primary, colors.primaryLight] as const,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  button: { fontSize: 18, fontWeight: '600' as const },
} as const;
