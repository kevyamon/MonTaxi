import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

export const ActiveRideSheet = ({ ride, onCompleteDismiss, isDriver = false, onDriverAction }) => {
  if (!ride) return null;

  const isCompleted = ride.status === 'completed';
  const isDriverArriving = ride.status === 'accepted' || ride.status === 'driver_arriving';
  const isInProgress = ride.status === 'in_progress';

  const getStatusBadge = () => {
    switch (ride.status) {
      case 'accepted':
        return { text: 'Chauffeur en route', color: COLORS.primaryDark, bg: COLORS.primaryLight };
      case 'driver_arriving':
        return { text: 'Chauffeur sur place', color: COLORS.warning, bg: COLORS.warningLight };
      case 'in_progress':
        return { text: 'Course en cours', color: COLORS.success, bg: COLORS.successLight };
      case 'completed':
        return { text: 'Course terminée', color: COLORS.success, bg: COLORS.successLight };
      default:
        return { text: 'En cours', color: COLORS.textSecondary, bg: COLORS.cardSecondary };
    }
  };

  const badge = getStatusBadge();

  return (
    <View style={styles.sheetContainer}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
        </View>
        <Text style={styles.tierTag}>{ride.tier?.toUpperCase() || 'ÉCO'}</Text>
      </View>

      {/* Détails du chauffeur ou passager */}
      <View style={styles.userCard}>
        <View style={styles.avatarBox}>
          <Ionicons name="person" size={24} color={COLORS.primaryDark} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {isDriver ? ride.passenger?.fullName || 'Passager' : ride.driver?.fullName || 'Chauffeur MonTaxi'}
          </Text>
          <Text style={styles.userPhone}>
            {isDriver ? ride.passenger?.phone : ride.driver?.phone || 'Téléphone masqué'}
          </Text>
        </View>
        <View style={styles.fareBox}>
          <Text style={styles.fareAmount}>{ride.fare?.totalPrice || 0} F</Text>
          <Text style={styles.fareLabel}>Espèces / Wave</Text>
        </View>
      </View>

      {/* Adresses */}
      <View style={styles.routeBox}>
        <View style={styles.routeItem}>
          <Ionicons name="radio-button-on" size={14} color={COLORS.primaryDark} />
          <Text style={styles.routeText} numberOfLines={1}>
            {ride.pickupLocation?.address || 'Départ'}
          </Text>
        </View>
        <View style={styles.routeItem}>
          <Ionicons name="location" size={14} color={COLORS.danger} />
          <Text style={styles.routeText} numberOfLines={1}>
            {ride.dropoffLocation?.address || 'Destination'}
          </Text>
        </View>
      </View>

      {/* Boutons d'action Chauffeur ou Passager */}
      {isDriver && (
        <View style={styles.actionsContainer}>
          {ride.status === 'accepted' && (
            <PrimaryButton
              title="Je suis arrivé sur place"
              onPress={() => onDriverAction('arrived')}
              style={styles.actionBtn}
            />
          )}
          {ride.status === 'driver_arriving' && (
            <PrimaryButton
              title="Démarrer la course"
              onPress={() => onDriverAction('start')}
              style={styles.actionBtn}
            />
          )}
          {ride.status === 'in_progress' && (
            <PrimaryButton
              title="Terminer la course"
              variant="secondary"
              onPress={() => onDriverAction('complete')}
              style={styles.actionBtn}
            />
          )}
        </View>
      )}

      {isCompleted && (
        <PrimaryButton
          title="Terminer et revenir à l’accueil"
          onPress={onCompleteDismiss}
          style={styles.completeBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.medium
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700'
  },
  tierTag: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMuted
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  userPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2
  },
  fareBox: {
    alignItems: 'flex-end'
  },
  fareAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  fareLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2
  },
  routeBox: {
    marginTop: 14,
    gap: 8
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  routeText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1
  },
  actionsContainer: {
    marginTop: 16
  },
  actionBtn: {
    width: '100%'
  },
  completeBtn: {
    marginTop: 16
  }
});
