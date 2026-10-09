import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';
import { TierOptionCard } from './TierOptionCard';
import { rideApi } from '../../api/ride.api';
import { searchLandmarks } from '../../constants/landmarks.constants';
import { calculateDistanceKm, resolveDestination, validateDestinationInput } from '../../services/location.service';

export const BookingBottomSheet = ({
  visible,
  onClose,
  onConfirmOrder,
  pickupAddress = 'Position actuelle',
  pickupCoords = { latitude: 5.2719, longitude: -3.5956 },
  zoneId = null,
  loading = false
}) => {
  const [destination, setDestination] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedDestinationCoords, setSelectedDestinationCoords] = useState(null);
  const [selectedTier, setSelectedTier] = useState('eco');
  const [calculating, setCalculating] = useState(false);
  const [estimation, setEstimation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDestinationChange = (text) => {
    setDestination(text);
    setErrorMessage('');
    if (estimation) setEstimation(null);
    setSelectedDestinationCoords(null);
    if (text.trim().length >= 2) {
      setSuggestions(searchLandmarks(text, zoneId).slice(0, 4));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLandmark = (landmark) => {
    setDestination(landmark.name);
    setSelectedDestinationCoords({ latitude: landmark.latitude, longitude: landmark.longitude });
    setSuggestions([]);
    setErrorMessage('');
    triggerEstimate({ latitude: landmark.latitude, longitude: landmark.longitude }, landmark.name);
  };

  const triggerEstimate = async (destCoords, destName) => {
    try {
      setCalculating(true);
      setErrorMessage('');
      const distKm = calculateDistanceKm(pickupCoords, destCoords);
      const res = await rideApi.estimateFare({
        distanceKm: distKm,
        pickupCoordinates: [pickupCoords.longitude, pickupCoords.latitude],
        dropoffCoordinates: [destCoords.longitude, destCoords.latitude]
      });
      if (res.success && res.data) setEstimation(res.data);
    } catch (e) {
      const fallbackDist = calculateDistanceKm(pickupCoords, destCoords);
      const duration = Math.max(3, Math.round((fallbackDist / 25) * 60 + 2));
      const ecoPrice = Math.min(700, Math.round(300 + fallbackDist * 200));
      const vipPrice = Math.min(1500, Math.round(600 + fallbackDist * 350));
      setEstimation({ distanceKm: fallbackDist, durationMin: duration, fares: { eco: ecoPrice, vip: vipPrice } });
    } finally {
      setCalculating(false);
    }
  };

  const handleManualEstimate = async () => {
    const val = validateDestinationInput(destination);
    if (!val.valid) {
      setErrorMessage(val.error);
      return;
    }

    try {
      setCalculating(true);
      setSuggestions([]);
      const resolved = await resolveDestination(destination, pickupCoords, zoneId);
      setSelectedDestinationCoords(resolved.coordinates);
      await triggerEstimate(resolved.coordinates, resolved.address);
    } catch (err) {
      setErrorMessage(err.message || 'Impossible de localiser cette destination.');
    } finally {
      setCalculating(false);
    }
  };

  const handleOrder = () => {
    if (!destination.trim() || !estimation) return;
    onConfirmOrder({
      pickupAddress,
      dropoffAddress: destination.trim(),
      dropoffCoords: selectedDestinationCoords || {
        latitude: pickupCoords.latitude + 0.008,
        longitude: pickupCoords.longitude + 0.008
      },
      tier: selectedTier,
      estimation
    });
  };

  const handleClose = () => {
    setEstimation(null);
    setDestination('');
    setSuggestions([]);
    setErrorMessage('');
    setSelectedDestinationCoords(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdropDismiss} onPress={handleClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.sheetHeader}>
            <View style={styles.dragHandle} />
            <Pressable style={styles.closeButton} onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.sheetTitle}>Commander un taxi</Text>

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
                <View style={styles.destinationRow}>
                  <TextInput
                    style={styles.destinationInput}
                    placeholder="Ex: Carrefour Pain Sucré, Marché..."
                    placeholderTextColor={COLORS.textMuted}
                    value={destination}
                    onChangeText={handleDestinationChange}
                    onSubmitEditing={handleManualEstimate}
                    returnKeyType="search"
                  />
                  <Pressable
                    style={[styles.chooseBtn, (!destination.trim() || calculating) && styles.chooseBtnDisabled]}
                    onPress={handleManualEstimate}
                    disabled={!destination.trim() || calculating}
                  >
                    {calculating ? (
                      <ActivityIndicator size="small" color={COLORS.textLight} />
                    ) : (
                      <Text style={styles.chooseBtnText}>Choisir</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {suggestions.length > 0 && (
            <View style={styles.suggestionsCard}>
              <Text style={styles.suggestionsHeader}>Repères et carrefours connus</Text>
              {suggestions.map((item, idx) => (
                <Pressable key={idx} style={styles.suggestionItem} onPress={() => handleSelectLandmark(item)}>
                  <Ionicons name="location-sharp" size={16} color={COLORS.primaryDark} />
                  <Text style={styles.suggestionText}>{item.name}</Text>
                  <Text style={styles.suggestionZone}>{item.zone}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {estimation && (
            <View style={styles.estimateBanner}>
              <Ionicons name="navigate-circle" size={18} color={COLORS.primaryDark} />
              <Text style={styles.estimateBannerText}>
                Itinéraire calculé : {estimation.distanceKm} km (~{estimation.durationMin} min)
              </Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Choisissez votre forfait</Text>
          <View style={styles.tiersContainer}>
            <TierOptionCard
              tierKey="eco"
              name="Éco"
              subtext="Taxi partagé"
              priceText={estimation ? `${estimation.fares.eco} FCFA` : 'Tarif au choix'}
              iconName="people"
              selected={selectedTier === 'eco'}
              onPress={() => setSelectedTier('eco')}
            />
            <TierOptionCard
              tierKey="vip"
              name="VIP"
              subtext="Taxi privatisé"
              priceText={estimation ? `${estimation.fares.vip} FCFA` : 'Tarif au choix'}
              iconName="shield-checkmark"
              selected={selectedTier === 'vip'}
              onPress={() => setSelectedTier('vip')}
            />
          </View>

          <PrimaryButton
            title={estimation ? 'Confirmer la commande' : 'Choisissez un itinéraire'}
            onPress={handleOrder}
            loading={loading}
            disabled={!destination.trim() || !estimation}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.25)', justifyContent: 'flex-end' },
  backdropDismiss: { ...StyleSheet.absoluteFillObject },
  sheetContainer: { backgroundColor: COLORS.background, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingBottom: 32, paddingTop: 12, borderTopWidth: 1, borderColor: COLORS.border, ...SHADOWS.large },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 30 },
  dragHandle: { width: 42, height: 4, borderRadius: 2, backgroundColor: COLORS.divider },
  closeButton: { position: 'absolute', right: 0, top: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.backgroundSecondary, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginTop: 6, marginBottom: 14 },
  locationsCard: { backgroundColor: COLORS.backgroundSecondary, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dotPickup: { backgroundColor: COLORS.primaryDark },
  dotDropoff: { backgroundColor: COLORS.danger },
  locationsDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8, marginLeft: 22 },
  locationInputWrapper: { flex: 1 },
  locationLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  locationValue: { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', marginTop: 2 },
  destinationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  destinationInput: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', paddingVertical: 4 },
  chooseBtn: { backgroundColor: COLORS.primaryDark, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  chooseBtnDisabled: { opacity: 0.5 },
  chooseBtnText: { fontSize: 12, fontWeight: '800', color: COLORS.textLight },
  suggestionsCard: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 10, marginTop: 8, ...SHADOWS.small },
  suggestionsHeader: { fontSize: 11, fontWeight: '700', color: COLORS.textMuted, marginBottom: 6, paddingLeft: 4 },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  suggestionText: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, flex: 1 },
  suggestionZone: { fontSize: 11, color: COLORS.textMuted, fontWeight: '500' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.dangerLight, padding: 10, borderRadius: 10, marginTop: 10 },
  errorText: { fontSize: 12, color: COLORS.danger, fontWeight: '600', flex: 1 },
  estimateBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.primaryLight, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginTop: 12 },
  estimateBannerText: { fontSize: 13, fontWeight: '800', color: COLORS.primaryDark },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginTop: 14, marginBottom: 8 },
  tiersContainer: { flexDirection: 'row', gap: 12 },
  confirmButton: { marginTop: 16 }
});
