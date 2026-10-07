import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../../theme/colors';

export const HeaderCurved = ({ title = 'MonTaxi', subtitle, user, onProfilePress }) => {
  const insets = useSafeAreaInsets();
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <Text style={styles.brandTitle}>{title}</Text>
          <Text style={styles.addressSubtitle} numberOfLines={1} ellipsizeMode="tail">
            {subtitle || 'Abidjan, Côte d’Ivoire'}
          </Text>
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
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: -0.5
  },
  addressSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  avatarPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }]
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryDark
  },
  curvedBottom: {
    position: 'absolute',
    bottom: -10,
    left: 40,
    right: 40,
    height: 10,
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    opacity: 0.3
  }
});
