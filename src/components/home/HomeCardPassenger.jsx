import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

// Flag de session pour jouer la vidéo une seule fois par ouverture de l'application
let hasPlayedPassengerVideoSession = false;

export const HomeCardPassenger = ({
  onOrderPress,
  isInCoverage = true,
  onRefreshLocation,
  locationLoading = false
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef(null);

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
        <Video
          ref={videoRef}
          source={require('../../../assets/homevid.mp4')}
          style={styles.taxiVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay={!hasPlayedPassengerVideoSession}
          positionMillis={hasPlayedPassengerVideoSession ? 0 : undefined}
          isLooping={false}
          isMuted={true}
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              hasPlayedPassengerVideoSession = true;
            }
          }}
        />
        <View style={styles.badgePromo}>
          <Ionicons name="flash" size={14} color={COLORS.textPrimary} />
          <Text style={styles.badgeText}>Service Rapide</Text>
        </View>
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.title}>Besoin d’un taxi maintenant ?</Text>
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
    height: 200,
    width: '100%',
    backgroundColor: COLORS.backgroundSecondary,
    position: 'relative',
    overflow: 'hidden'
  },
  taxiVideo: {
    width: '100%',
    height: '100%'
  },
  badgePromo: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    ...SHADOWS.small
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  infoContent: {
    padding: 20
  },
  title: {
    fontSize: 20,
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
