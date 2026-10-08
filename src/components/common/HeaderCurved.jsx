import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';

export const HeaderCurved = ({ title = 'MonTaxi', subtitle, user, onProfilePress }) => {
  const insets = useSafeAreaInsets();
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={styles.brandTitle}>{title}</Text>
          <View style={styles.locationBadge}>
            <Ionicons name="location-sharp" size={14} color={COLORS.secondary} style={styles.pinIcon} />
            <Text style={styles.addressSubtitle} numberOfLines={1} ellipsizeMode="tail">
              {subtitle || 'Position actuelle'}
            </Text>
          </View>
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
      <View style={styles.curvedBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 22,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...SHADOWS.large
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
    color: COLORS.textLight,
    letterSpacing: -0.6
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3
  },
  pinIcon: {
    marginRight: 4
  },
  addressSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    flexShrink: 1
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.card,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
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
    color: COLORS.primaryDark
  },
  curvedBottom: {
    position: 'absolute',
    bottom: -8,
    left: 45,
    right: 45,
    height: 8,
    backgroundColor: COLORS.primaryDark,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    opacity: 0.35
  }
});
