import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

export const HomeCardPassenger = ({
  onOrderPress,
  isInCoverage = true,
  onRefreshLocation,
  locationLoading = false
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fondu d'entrée doux de la carte
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [fadeAnim]);

  if (!isInCoverage) {
    return (
      <Animated.View style={[styles.cardContainer, styles.outOfZoneCard, { opacity: fadeAnim }]}>
        <View style={styles.outOfZoneHeader}>
          <View style={styles.dangerIconBadge}>
            <Ionicons name="warning-outline" size={32} color={COLORS.danger} />
          </View>
          <Text style={styles.outOfZoneTitle}>Hors de la zone d’activité</Text>
          <Text style={styles.outOfZoneDescription}>
            Votre position actuelle se situe en dehors de la zone d’activité de MonTaxi. Rapprochez-vous d’une zone desservie pour commander un taxi.
          </Text>
        </View>

        <PrimaryButton
          title={locationLoading ? 'Actualisation...' : 'Actualiser ma position'}
          onPress={onRefreshLocation}
          loading={locationLoading}
          icon={!locationLoading ? <Ionicons name="refresh-outline" size={18} color={COLORS.textLight} /> : null}
          style={styles.refreshButton}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.cardContainer, { opacity: fadeAnim }]}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../../assets/homepst.png')}
          style={styles.taxiImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          Besoin d’un taxi maintenant ?
        </Text>
        <Text style={styles.description}>
          Commandez votre course en un clic avec des chauffeurs certifiés et les meilleurs tarifs de la région.
        </Text>

        <PrimaryButton
          title="Commander un taxi"
          onPress={onOrderPress}
          icon={<Ionicons name="car-sport" size={20} color={COLORS.textLight} />}
          style={styles.orderButton}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.medium
  },
  outOfZoneCard: {
    padding: 24,
    borderColor: COLORS.dangerLight,
    backgroundColor: COLORS.card
  },
  outOfZoneHeader: {
    alignItems: 'center',
    marginBottom: 20
  },
  dangerIconBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  outOfZoneTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3
  },
  outOfZoneDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.textSecondary,
    textAlign: 'center'
  },
  refreshButton: {
    marginTop: 8
  },
  imageWrapper: {
    height: 180,
    width: '100%',
    backgroundColor: COLORS.backgroundSecondary,
    position: 'relative',
    overflow: 'hidden'
  },
  taxiImage: {
    width: '100%',
    height: '100%'
  },
  infoContent: {
    padding: 18
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 16
  },
  orderButton: {
    marginTop: 4
  }
});
