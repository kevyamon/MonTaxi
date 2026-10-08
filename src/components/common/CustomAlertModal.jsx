import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';

const MODAL_CONFIG = {
  error: {
    icon: 'alert-circle',
    color: COLORS.danger,
    badgeBg: COLORS.dangerLight,
    defaultTitle: 'Erreur',
    buttonColor: COLORS.primaryDark
  },
  success: {
    icon: 'checkmark-circle',
    color: COLORS.success,
    badgeBg: COLORS.successLight,
    defaultTitle: 'Succès',
    buttonColor: COLORS.primaryDark
  },
  warning: {
    icon: 'warning',
    color: COLORS.warning,
    badgeBg: COLORS.warningLight,
    defaultTitle: 'Attention',
    buttonColor: COLORS.primaryDark
  },
  info: {
    icon: 'information-circle',
    color: COLORS.primaryDark,
    badgeBg: COLORS.primaryLight,
    defaultTitle: 'Information',
    buttonColor: COLORS.primaryDark
  }
};

export const CustomAlertModal = ({
  visible,
  type = 'info',
  title,
  message,
  buttonText = 'D’accord',
  onClose,
  secondaryButtonText,
  onSecondaryPress
}) => {
  const config = MODAL_CONFIG[type] || MODAL_CONFIG.info;
  const displayTitle = title || config.defaultTitle;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          <View style={[styles.iconBadge, { backgroundColor: config.badgeBg }]}>
            <Ionicons name={config.icon} size={36} color={config.color} />
          </View>

          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonGroup}>
            {secondaryButtonText && (
              <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={onSecondaryPress || onClose}
              >
                <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.button, styles.primaryButton, { backgroundColor: config.buttonColor }]}
              onPress={onClose}
            >
              <Text style={styles.primaryButtonText}>{buttonText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.large
  },
  iconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24
  },
  buttonGroup: {
    width: '100%',
    flexDirection: 'row',
    gap: 12
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryButton: {
    ...SHADOWS.small
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textLight
  },
  secondaryButton: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary
  }
});
