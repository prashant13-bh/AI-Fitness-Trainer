import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    android: { elevation: 2 },
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
    default: {},
  }),
  elevated: Platform.select({
    android: { elevation: 6 },
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12 },
    default: {},
  }),
  sheet: Platform.select({
    android: { elevation: 16 },
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.08, shadowRadius: 16 },
    default: {},
  }),
} as const;
