export const colors = {
  primary: '#FF6B35',
  primaryLight: '#FFF0EB',
  primaryDark: '#E55A25',
  primaryMuted: 'rgba(255, 107, 53, 0.15)',

  background: '#FFFFFF',
  surface: '#F8F8F8',
  surfaceElevated: '#FFFFFF',
  overlay: 'rgba(0, 0, 0, 0.40)',

  textPrimary: '#1C1C1E',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',

  border: '#F0F0F0',
  borderFocus: '#FF6B35',
  borderStrong: '#E5E7EB',

  success: '#22C55E',
  successLight: '#F0FDF4',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  error: '#EF4444',
  errorLight: '#FFF5F5',
  neutral: '#E5E7EB',
  neutralDark: '#9CA3AF',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof colors;
