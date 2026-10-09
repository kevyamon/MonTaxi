import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

export const HomeCardDriver = ({
  isOnline,
  onToggleStatus,
  loading,
  totalRides = 0,
  isInCoverage = true,
  onRefreshLocation,
  locationLoading = false
}) => {
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.94,
        duration: 90,
        useNativeDriver: true
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 160,
        useNativeDriver: true
      })
    ]).start();
    onToggleStatus();
  };

  if (!isInCoverage) {
    return (
      <View style={[styles.cardContainer, styles.outOfZoneCard]}>
        <View style={styles.outOfZoneHeader}>
          <View style={styles.dangerIconBadge}>
            <Ionicons name="warning-outline" size={32} color={COLORS.danger} />
          </View>
          <Text style={styles.outOfZoneTitle}>Hors de la zone d’activité</Text>
          <Text style={styles.outOfZoneDescription}>
            Votre position se situe en dehors des villes desservies par MonTaxi (Bonoua, Aboisso, Adiaké). Vous ne pouvez pas passer en ligne ni recevoir de courses.
          </Text>
        </View>

        <PrimaryButton
          title={locationLoading ? 'Actualisation...' : 'Actualiser ma position'}
          onPress={onRefreshLocation}
          loading={locationLoading}
          icon={!locationLoading ? <Ionicons name="refresh-outline" size={18} color={COLORS.textLight} /> : null}
          style={styles.refreshButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../../assets/homepst.png')}
          style={styles.taxiImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {isOnline ? 'Prêt pour votre prochaine course' : 'Passez en ligne pour travailler'}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {isOnline
            ? 'Vous recevez automatiquement les notifications et alertes radar des clients à proximité.'
            : 'Activez votre disponibilité pour commencer à recevoir des courses dans votre zone.'}
        </Text>

        <View style={styles.statsContainer}>
          <View style={styles.immersiveStatCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="car-sport" size={16} color={COLORS.primaryDark} />
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>Actif</Text>
              </View>
            </View>
            <Text style={styles.immersiveStatValue}>{totalRides}</Text>
            <Text style={styles.immersiveStatLabel}>Courses réalisées</Text>
          </View>

          <View style={styles.immersiveStatCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: COLORS.warningLight }]}>
                <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.warning} />
              </View>
              <View style={[styles.statusPill, { backgroundColor: COLORS.warningLight }]}>
                <Text style={[styles.statusPillText, { color: COLORS.warning }]}>5.0 / 5</Text>
              </View>
            </View>
            <Text style={styles.immersiveStatValue}>5.0</Text>
            <Text style={styles.immersiveStatLabel}>Note moyenne</Text>
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            style={[
              styles.actionButton,
              isOnline ? styles.actionButtonOffline : styles.actionButtonOnline,
              loading && styles.buttonDisabled
            ]}
            onPress={handlePress}
            disabled={loading}
          >
            <Ionicons
              name={isOnline ? 'pause-circle' : 'play-circle'}
              size={20}
              color={isOnline ? COLORS.textPrimary : COLORS.textLight}
            />
            <Text
              style={[
                styles.actionButtonText,
                isOnline ? styles.actionButtonTextOffline : styles.actionButtonTextOnline
              ]}
            >
              {loading ? 'Mise à jour...' : isOnline ? 'Se mettre en pause' : 'Passer en ligne'}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
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
    height: 130,
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
    padding: 14
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 16,
    marginTop: 3,
    marginBottom: 10
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  immersiveStatCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusPill: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  immersiveStatValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.4
  },
  immersiveStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginTop: 1
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    ...SHADOWS.small
  },
  actionButtonOnline: {
    backgroundColor: COLORS.primaryDark
  },
  actionButtonOffline: {
    backgroundColor: COLORS.backgroundSecondary,
    borderWidth: 1.5,
    borderColor: COLORS.border
  },
  actionButtonText: {
    fontSize: 14.5,
    fontWeight: '800'
  },
  actionButtonTextOnline: {
    color: COLORS.textLight
  },
  actionButtonTextOffline: {
    color: COLORS.textPrimary
  },
  buttonDisabled: {
    opacity: 0.6
  }
});
