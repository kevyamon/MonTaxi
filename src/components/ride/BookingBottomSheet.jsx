import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

export const BookingBottomSheet = ({
  visible,
  onClose,
  onConfirmOrder,
  pickupAddress = 'Abobo, à 30m de Marché central',
  loading = false
}) => {
  const [destination, setDestination] = useState('');
  const [selectedTier, setSelectedTier] = useState('eco'); // 'eco' | 'vip'

  const estimatedPrices = {
    eco: 1200,
    vip: 2200
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
        <View style={styles.sheetContainer}>
          {/* Header du BottomSheet avec bouton de fermeture */}
          <View style={styles.sheetHeader}>
            <View style={styles.dragHandle} />
            <Pressable
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              onPress={onClose}
            >
              <Ionicons name="close" size={22} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.sheetTitle}>Nouvelle Course</Text>

          {/* Adresses Départ & Arrivée */}
          <View style={styles.locationsCard}>
            <View style={styles.locationRow}>
              <View style={[styles.dot, styles.dotPickup]} />
              <View style={styles.locationInputWrapper}>
                <Text style={styles.locationLabel}>Point de départ</Text>
                <Text style={styles.locationValue} numberOfLines={1}>{pickupAddress}</Text>
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
                />
              </View>
            </View>
          </View>

          {/* Choix des Forfaits Éco / VIP */}
          <Text style={styles.sectionTitle}>Choisissez votre forfait</Text>
          <View style={styles.tiersContainer}>
            {/* Forfait Éco */}
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
              <Text style={styles.tierSubtext}>Course standard partagée</Text>
              <Text style={styles.tierPrice}>{estimatedPrices.eco} FCFA</Text>
            </Pressable>

            {/* Forfait VIP */}
            <Pressable
              style={[
                styles.tierCard,
                selectedTier === 'vip' && styles.tierCardVipActive
              ]}
              onPress={() => setSelectedTier('vip')}
            >
              <View style={styles.tierHeader}>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color={selectedTier === 'vip' ? COLORS.secondaryDark : COLORS.textSecondary}
                />
                <Text style={styles.tierName}>VIP</Text>
              </View>
              <Text style={styles.tierSubtext}>Course privée exclusive</Text>
              <Text style={styles.tierPrice}>{estimatedPrices.vip} FCFA</Text>
            </Pressable>
          </View>

          {/* Bouton de confirmation */}
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
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end'
  },
  sheetContainer: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '85%',
    ...SHADOWS.large
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 32
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.border
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardSecondary,
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
    marginTop: 8,
    marginBottom: 16
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
    marginVertical: 10,
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
    marginTop: 18,
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
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: 10
  },
  confirmButton: {
    marginTop: 20
  }
});
