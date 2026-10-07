import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SHADOWS } from '../../theme/colors';

export const PrimaryButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger'
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.cardSecondary;
    switch (variant) {
      case 'secondary':
        return COLORS.secondary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return COLORS.danger;
      case 'primary':
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textMuted;
    switch (variant) {
      case 'secondary':
        return COLORS.textPrimary;
      case 'outline':
        return COLORS.primaryDark;
      case 'danger':
        return COLORS.textLight;
      case 'primary':
      default:
        return COLORS.textPrimary;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && styles.outlineBorder,
        variant !== 'outline' && !disabled && SHADOWS.small,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon ? icon : null}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    minHeight: 52,
    gap: 8
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }]
  },
  buttonDisabled: {
    opacity: 0.6
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: COLORS.primaryDark
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2
  }
});
