import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

let hasPlayedDriverVideoSession = false;

export const HomeCardDriver = ({ isOnline, onToggleStatus, loading, totalRides = 0 }) => {
  const videoRef = useRef(null);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Video
          ref={videoRef}
          source={require('../../../assets/homevid.mp4')}
          style={styles.taxiVideo}
          resizeMode={ResizeMode.COVER}
          shouldPlay={!hasPlayedDriverVideoSession}
          isLooping={false}
          isMuted={true}
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded && status.didJustFinish) {
              hasPlayedDriverVideoSession = true;
            }
          }}
        />
        <View style={[styles.statusBadge, isOnline ? styles.onlineBadge : styles.offlineBadge]}>
          <View style={[styles.statusDot, isOnline ? styles.onlineDot : styles.offlineDot]} />
          <Text style={[styles.statusText, isOnline ? styles.onlineText : styles.offlineText]}>
            {isOnline ? 'En Ligne (Prêt à recevoir)' : 'Hors Ligne'}
          </Text>
        </View>
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.title}>
          {isOnline ? 'Prêt pour votre prochaine course' : 'Passez en ligne pour travailler'}
        </Text>
        <Text style={styles.description}>
          {isOnline
            ? 'Vous recevrez automatiquement les notifications et alertes radar des clients à proximité.'
            : 'Activez votre disponibilité pour commencer à recevoir des courses dans votre zone.'}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalRides}</Text>
            <Text style={styles.statLabel}>Courses réalisées</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>5.0</Text>
            <Text style={styles.statLabel}>Note moyenne</Text>
          </View>
        </View>

        <PrimaryButton
          title={isOnline ? 'Se déconnecter (Pause)' : 'Passer en ligne'}
          onPress={onToggleStatus}
          loading={loading}
          variant={isOnline ? 'outline' : 'primary'}
          icon={
            <Ionicons
              name={isOnline ? 'pause-circle' : 'play-circle'}
              size={20}
              color={isOnline ? COLORS.primaryDark : COLORS.textPrimary}
            />
          }
          style={styles.toggleButton}
        />
      </View>
    </View>
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
  imageWrapper: {
    height: 190,
    width: '100%',
    backgroundColor: COLORS.backgroundSecondary,
    position: 'relative',
    overflow: 'hidden'
  },
  taxiVideo: {
    width: '100%',
    height: '100%'
  },
  statusBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
    ...SHADOWS.small
  },
  onlineBadge: {
    backgroundColor: COLORS.successLight
  },
  offlineBadge: {
    backgroundColor: COLORS.cardSecondary
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  onlineDot: {
    backgroundColor: COLORS.success
  },
  offlineDot: {
    backgroundColor: COLORS.textMuted
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700'
  },
  onlineText: {
    color: COLORS.success
  },
  offlineText: {
    color: COLORS.textSecondary
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
    marginTop: 6
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 16
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: 'center'
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2
  },
  toggleButton: {
    marginTop: 4
  }
});
