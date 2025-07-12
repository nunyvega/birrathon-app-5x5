import { Platform } from 'react-native';

// Apple's iOS Color Palette
export const Colors = {
  // System Colors
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemIndigo: '#5856D6',
  systemOrange: '#FF9500',
  systemPink: '#FF2D92',
  systemPurple: '#AF52DE',
  systemRed: '#FF3B30',
  systemTeal: '#30B0C7',
  systemYellow: '#FFCC00',
  
  // System Grays
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray3: '#C7C7CC',
  systemGray4: '#D1D1D6',
  systemGray5: '#E5E5EA',
  systemGray6: '#F2F2F7',
  
  // Labels
  label: '#000000',
  secondaryLabel: '#3C3C43',
  tertiaryLabel: '#3C3C43',
  quaternaryLabel: '#3C3C43',
  
  // Fills
  systemFill: '#787880',
  secondarySystemFill: '#787880',
  tertiarySystemFill: '#767680',
  quaternarySystemFill: '#747480',
  
  // Backgrounds
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  
  // Grouped Backgrounds
  systemGroupedBackground: '#F2F2F7',
  secondarySystemGroupedBackground: '#FFFFFF',
  tertiarySystemGroupedBackground: '#F2F2F7',
  
  // Separators
  separator: '#3C3C43',
  opaqueSeparator: '#C6C6C8',
  
  // Link
  link: '#007AFF',
  
  // Custom App Colors
  accent: '#007AFF',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Semantic Colors
  cardBackground: '#FFFFFF',
  cardBackgroundSecondary: '#F2F2F7',
  destructive: '#FF3B30',
  
  // Chart Colors
  chartPrimary: '#007AFF',
  chartSecondary: '#34C759',
  chartTertiary: '#FF9500',
  chartQuaternary: '#AF52DE',
  
  // Workout Specific
  workoutPrimary: '#007AFF',
  workoutSecondary: '#34C759',
  restTimer: '#FF9500',
};

// Apple's Typography System
export const Typography = {
  // Large Title
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    lineHeight: 41,
    letterSpacing: 0.37,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  
  // Title 1
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    letterSpacing: 0.36,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  
  // Title 2
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: 0.35,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  
  // Title 3
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 25,
    letterSpacing: 0.38,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'System',
  },
  
  // Headline
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  
  // Body
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: -0.41,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  
  // Callout
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 21,
    letterSpacing: -0.32,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  
  // Subheadline
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: -0.24,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  
  // Footnote
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: -0.08,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  
  // Caption 1
  caption1: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  
  // Caption 2
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 13,
    letterSpacing: 0.07,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'System',
  },
  
  // Monospace (for timers)
  monospace: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: 0,
    fontFamily: Platform.OS === 'ios' ? 'SF Mono' : 'monospace',
  },
};

// Apple's Spacing System
export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  xxxxl: 32,
  xxxxxl: 40,
  xxxxxxl: 48,
  
  // Semantic Spacing
  cardPadding: 16,
  sectionPadding: 20,
  screenPadding: 20,
  listItemPadding: 16,
  buttonPadding: 12,
  
  // Component Specific
  tabBarHeight: 83,
  headerHeight: 44,
  searchBarHeight: 36,
  cellHeight: 44,
  accessoryHeight: 29,
};

// Apple's Shadow System
export const Shadows = {
  // iOS Shadow Levels
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  
  // Card Shadow
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Button Shadow
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
};

// Apple's Border Radius System
export const BorderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  
  // Semantic Radius
  button: 8,
  card: 16,
  input: 8,
  badge: 12,
  
  // Component Specific
  large: 16,
  medium: 12,
  small: 8,
  xsmall: 4,
};

// Apple's Button Styles
export const ButtonStyles = {
  // Primary Button
  primary: {
    backgroundColor: Colors.systemBlue,
    borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 50,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...Shadows.button,
  },
  
  // Secondary Button
  secondary: {
    backgroundColor: Colors.systemGray6,
    borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 50,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Destructive Button
  destructive: {
    backgroundColor: Colors.systemRed,
    borderRadius: BorderRadius.button,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 50,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    ...Shadows.button,
  },
  
  // Outline Button
  outline: {
    backgroundColor: 'transparent',
    borderRadius: BorderRadius.button,
    borderWidth: 1,
    borderColor: Colors.systemBlue,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    minHeight: 50,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Compact Button
  compact: {
    backgroundColor: Colors.systemBlue,
    borderRadius: BorderRadius.small,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: 32,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
};

// Apple's Card Styles
export const CardStyles = {
  // Default Card
  default: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    ...Shadows.card,
  },
  
  // Elevated Card
  elevated: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    ...Shadows.level3,
  },
  
  // Flat Card
  flat: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
    borderWidth: 1,
    borderColor: Colors.systemGray5,
  },
  
  // Inset Card
  inset: {
    backgroundColor: Colors.cardBackgroundSecondary,
    borderRadius: BorderRadius.card,
    padding: Spacing.cardPadding,
  },
};

// Apple's Layout System
export const Layout = {
  // Screen Container
  screen: {
    flex: 1,
    backgroundColor: Colors.systemGroupedBackground,
  },
  
  // Section Container
  section: {
    marginVertical: Spacing.md,
  },
  
  // Row Container
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  // Column Container
  column: {
    flexDirection: 'column' as const,
  },
  
  // Centered Container
  centered: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // Spacer
  spacer: {
    flex: 1,
  },
};

// Apple's Animation Timings
export const Animations = {
  // Durations
  fast: 150,
  normal: 300,
  slow: 500,
  
  // Easing
  easeInOut: 'ease-in-out',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  
  // Spring Configs
  spring: {
    damping: 15,
    stiffness: 150,
  },
  
  // Bounce Config
  bounce: {
    damping: 8,
    stiffness: 100,
  },
};

// Apple's Haptics
export const Haptics = {
  light: () => {
    // Implementation would use Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  },
  medium: () => {
    // Implementation would use Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  },
  heavy: () => {
    // Implementation would use Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
  },
  success: () => {
    // Implementation would use Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
  },
  warning: () => {
    // Implementation would use Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
  },
  error: () => {
    // Implementation would use Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
  },
};

// Utility Functions
export const Utils = {
  // Get semantic color based on context
  getSemanticColor: (type: 'primary' | 'secondary' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'primary': return Colors.systemBlue;
      case 'secondary': return Colors.systemGray;
      case 'success': return Colors.systemGreen;
      case 'warning': return Colors.systemOrange;
      case 'error': return Colors.systemRed;
      default: return Colors.systemBlue;
    }
  },
  
  // Get text color based on background
  getTextColor: (background: string) => {
    // Simple check for light/dark background
    return background === Colors.systemBackground ? Colors.label : Colors.systemBackground;
  },
  
  // Scale spacing based on screen size
  scaleSpacing: (value: number, factor: number = 1) => {
    return Math.round(value * factor);
  },
};

export default {
  Colors,
  Typography,
  Spacing,
  Shadows,
  BorderRadius,
  ButtonStyles,
  CardStyles,
  Layout,
  Animations,
  Haptics,
  Utils,
}; 