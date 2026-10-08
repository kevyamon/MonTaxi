import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

export const BookingBottomSheet = ({
  visible,
  onClose,
  onConfirmOrder,
  pickupAddress = 'Position actuelle',
  loading = false
}) => {
  const [destination, setDestination] = useState('');
  const [selectedTier, setSelectedTier] = useState('eco');

  const estimatedPrices = {
    eco: '300 - 700 FCFA',
    vip: '700 - 1 500 FCFA'
  };

  const handleOrder = () => {
    if (!destination.trim()) return;
    onConfirmOrder({
      pickupAddress,
      dropoffAddress: destination.trim(),
      tier: selectedTier
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdropDismiss} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <View style={styles.dragHandle} />
            <Pressable
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              onPress={onClose}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.sheetTitle}>Commander un taxi</Text>

          <View style={styles.locationsCard}>
            <View style={styles.locationRow}>
              <View style={[styles.dot, styles.dotPickup]} />
              <View style={styles.locationInputWrapper}>
                <Text style={styles.locationLabel}>Point de départ</Text>
                <Text style={styles.locationValue} numberOfLines={1}>
                  {pickupAddress}
                </Text>
              </View>
            </View>

            <View style={styles.locationsDivider} />

            <View style={styles.locationRow}>
              <View style={[styles.dot, styles.dotDropoff]} />
              <View style={styles.locationInputWrapper}>
                <Text style={styles.locationLabel}>Destination</Text>
                <TextInput
                  style={styles.destinationInput}
                  placeholder="Où souhaitez-vous aller ?"
                  placeholderTextColor={COLORS.textMuted}
                  value={destination}
                  onChangeText={setDestination}
                  autoFocus
                />
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Choisissez votre forfait</Text>
          <View style={styles.tiersContainer}>
            <Pressable
              style={[
                styles.tierCard,
                selectedTier === 'eco' && styles.tierCardActive
              ]}
              onPress={() => setSelectedTier('eco')}
            >
              <View style={styles.tierHeader}>
                <Ionicons
                  name="people"
                  size={20}
                  color={selectedTier === 'eco' ? COLORS.primaryDark : COLORS.textSecondary}
                />
                <Text style={styles.tierName}>Éco</Text>
              </View>
              <Text style={styles.tierSubtext}>Taxi partagé (Plafond 700F)</Text>
              <Text style={styles.tierPrice}>{estimatedPrices.eco}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.tierCard,
                selectedTier === 'vip' && styles.tierCardVipActive
              ]}
              onPress={() => setSelectedTier('vip')}
            >
              <View style={styles.tierHeader}>
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color={selectedTier === 'vip' ? COLORS.secondaryDark : COLORS.textSecondary}
                />
                <Text style={styles.tierName}>VIP</Text>
              </View>
              <Text style={styles.tierSubtext}>Taxi privatisé (Plafond 1500F)</Text>
              <Text style={styles.tierPrice}>{estimatedPrices.vip}</Text>
            </Pressable>
          </View>

          <PrimaryButton
            title="Confirmer la commande"
            onPress={handleOrder}
            loading={loading}
            disabled={!destination.trim()}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.2)',
    justifyContent: 'flex-end'
  },
  backdropDismiss: {
    ...StyleSheet.absoluteFillObject
  },
  sheetContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.large
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 30
  },
  dragHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.divider
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pressed: {
    opacity: 0.7
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 6,
    marginBottom: 14
  },
  locationsCard: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  dotPickup: {
    backgroundColor: COLORS.primaryDark
  },
  dotDropoff: {
    backgroundColor: COLORS.danger
  },
  locationsDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    marginLeft: 22
  },
  locationInputWrapper: {
    flex: 1
  },
  locationLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  locationValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 2
  },
  destinationInput: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 2,
    paddingVertical: 2
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 16,
    marginBottom: 10
  },
  tiersContainer: {
    flexDirection: 'row',
    gap: 12
  },
  tierCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  tierCardActive: {
    borderColor: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight
  },
  tierCardVipActive: {
    borderColor: COLORS.secondaryDark,
    backgroundColor: COLORS.secondaryLight
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  tierName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  tierSubtext: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4
  },
  tierPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 8
  },
  confirmButton: {
    marginTop: 18
  }
});
