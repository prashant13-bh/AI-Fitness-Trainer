export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 26,
    xl: 28,
    '2xl': 32,
    '3xl': 38,
    '4xl': 44,
  },
} as const;

export type TypographySizes = keyof typeof typography.sizes;
