import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';

export const HeaderCurved = ({
  title = 'MonTaxi',
  subtitle,
  user,
  onProfilePress,
  showLocationPin = false,
  isDriver = false,
  isOnline = false
}) => {
  const insets = useSafeAreaInsets();
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />

      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={styles.brandTitle}>{title}</Text>
          <View style={styles.subtitleRow}>
            {showLocationPin && (
              <Ionicons
                name="location-sharp"
                size={14}
                color={COLORS.textPrimary}
                style={styles.pinIcon}
              />
            )}
            <Text style={styles.addressSubtitle} numberOfLines={1} ellipsizeMode="tail">
              {subtitle || 'Position non trouvée, veuillez actualiser'}
            </Text>
          </View>

          {isDriver && (
            <View style={styles.driverStatusWrapper}>
              <View style={[styles.statusTagBlack, isOnline ? styles.statusTagOnline : styles.statusTagOffline]}>
                <View style={[styles.statusDotSmall, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
                <Text style={[styles.statusTagText, { color: isOnline ? '#10B981' : '#EF4444' }]}>
                  {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.avatarButton,
            pressed && styles.avatarPressed
          ]}
          onPress={onProfilePress}
        >
          {user?.avatarUrl ? (
            <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    ...SHADOWS.medium
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  textContainer: {
    flex: 1,
    marginRight: 12
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.6
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3
  },
  pinIcon: {
    marginRight: 4
  },
  addressSubtitle: {
    fontSize: 13,
    color: COLORS.textPrimary,
    opacity: 0.85,
    fontWeight: '600',
    flexShrink: 1
  },
  driverStatusWrapper: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusTagBlack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    ...SHADOWS.small
  },
  statusTagOnline: {
    borderColor: 'rgba(16, 185, 129, 0.4)'
  },
  statusTagOffline: {
    borderColor: 'rgba(239, 68, 68, 0.4)'
  },
  statusDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5
  },
  statusTagText: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.6
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...SHADOWS.small
  },
  avatarPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }]
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary
  }
});
