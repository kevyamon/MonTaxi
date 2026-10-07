export const COLORS = {
  // Palette Principale Validée
  primary: '#40E0D0', // Turquoise Moderne
  primaryDark: '#0D9488',
  primaryLight: '#E6FAF8',

  secondary: '#FFFF00', // Jaune Taxi
  secondaryDark: '#EAB308',
  secondaryLight: '#FEF9C3',

  // Fond & Surfaces
  background: '#FFFFFF', // Blanc Pur Standard Mobile
  backgroundSecondary: '#F8FAFC',
  card: '#FFFFFF',
  cardSecondary: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#CBD5E1',

  // Textes & Typographie
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',
  textInverse: '#0F172A',

  // États & Rétroaction (Feedback)
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#06B6D4',
  infoLight: '#CFFAFE',

  // Éléments UI Spécifiques
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#0D9488',
  tabBarInactive: '#94A3B8',
  tabBarCenterButton: '#40E0D0',

  // Réseaux & Services Tiers
  whatsapp: '#16A34A',
  whatsappLight: '#DCFCE7',

  overlay: 'rgba(15, 23, 42, 0.65)',
  shadow: 'rgba(15, 23, 42, 0.08)'
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8
  }
};
