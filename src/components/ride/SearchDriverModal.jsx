import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator, Alert, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

export const SearchDriverModal = ({ visible, onCancelSearch, statusMessage }) => {
  const [dots, setDots] = useState('');
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [visible]);

  const handleCancelPress = () => {
    setShowConfirmCancel(true);
  };

  const confirmCancel = () => {
    setShowConfirmCancel(false);
    onCancelSearch();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          {showConfirmCancel ? (
            <View style={styles.confirmBox}>
              <Ionicons name="alert-circle" size={44} color={COLORS.warning} />
              <Text style={styles.confirmTitle}>Annuler la recherche ?</Text>
              <Text style={styles.confirmText}>
                Êtes-vous sûr de vouloir interrompre la recherche de votre taxi ?
              </Text>
              <View style={styles.confirmButtonsRow}>
                <PrimaryButton
                  title="Non, continuer"
                  variant="outline"
                  onPress={() => setShowConfirmCancel(false)}
                  style={styles.confirmBtn}
                />
                <PrimaryButton
                  title="Oui, annuler"
                  variant="danger"
                  onPress={confirmCancel}
                  style={styles.confirmBtn}
                />
              </View>
            </View>
          ) : (
            <View style={styles.radarBox}>
              <View style={styles.pulseOuter}>
                <View style={styles.pulseInner}>
                  <Ionicons name="car-sport" size={32} color={COLORS.primaryDark} />
                </View>
              </View>

              <Text style={styles.title}>Recherche en cours{dots}</Text>
              <Text style={styles.stepMessage}>
                {statusMessage || 'Recherche d’un chauffeur proche...'}
              </Text>

              <ActivityIndicator color={COLORS.primaryDark} size="small" style={styles.spinner} />

              <Pressable
                style={({ pressed }) => [styles.cancelLink, pressed && styles.pressed]}
                onPress={handleCancelPress}
              >
                <Text style={styles.cancelLinkText}>Annuler la recherche</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  contentContainer: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...SHADOWS.large
  },
  radarBox: {
    alignItems: 'center',
    width: '100%'
  },
  pulseOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  pulseInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  stepMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center'
  },
  spinner: {
    marginVertical: 18
  },
  cancelLink: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  cancelLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.danger
  },
  pressed: {
    opacity: 0.7
  },
  confirmBox: {
    alignItems: 'center',
    width: '100%'
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 12
  },
  confirmText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18
  },
  confirmButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    width: '100%'
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 10
  }
});
