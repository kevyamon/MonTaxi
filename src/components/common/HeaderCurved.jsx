import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Pressable, StatusBar, Animated } from 'react-native';
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
  isOnline = false,
  locationLoading = false
}) => {
  const insets = useSafeAreaInsets();
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';

  // Animation radar douce pour la recherche de position
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    if (locationLoading) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: true
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: true
          })
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(0);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [locationLoading, pulseAnim]);

  const displaySubtitle = subtitle || 'Position non trouvée, veuillez actualiser';

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />

      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          {/* Ligne Titre + Badge chauffeur en ligne */}
          <View style={styles.titleRow}>
            <Text style={styles.brandTitle} numberOfLines={1}>
              {title}
            </Text>
            {isDriver && (
              <View
                style={[
                  styles.statusTagBlack,
                  isOnline ? styles.statusTagOnline : styles.statusTagOffline
                ]}
              >
                <View
                  style={[
                    styles.statusDotSmall,
                    { backgroundColor: isOnline ? '#10B981' : '#EF4444' }
                  ]}
                />
                <Text
                  style={[
                    styles.statusTagText,
                    { color: isOnline ? '#10B981' : '#EF4444' }
                  ]}
                >
                  {isOnline ? 'EN LIGNE' : 'HORS LIGNE'}
                </Text>
              </View>
            )}
          </View>

          {/* Ligne Sous-titre / Position avec animation radar */}
          <View style={styles.subtitleRow}>
            {locationLoading ? (
              <View style={styles.radarContainer}>
                <Animated.View
                  style={[
                    styles.radarHalo,
                    {
                      transform: [
                        {
                          scale: pulseAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.9]
                          })
                        }
                      ],
                      opacity: pulseAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.65, 0]
                      })
                    }
                  ]}
                />
                <View style={styles.radarCore} />
              </View>
            ) : (
              showLocationPin && (
                <Ionicons
                  name="location-sharp"
                  size={14}
                  color={COLORS.textPrimary}
                  style={styles.pinIcon}
                />
              )
            )}

            <Animated.Text
              style={[
                styles.addressSubtitle,
                locationLoading && {
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.55, 1.0]
                  })
                }
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {displaySubtitle}
            </Animated.Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 18,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'nowrap'
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.6
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4
  },
  pinIcon: {
    marginRight: 4,
    marginTop: 1.5
  },
  addressSubtitle: {
    fontSize: 12,
    lineHeight: 16.5,
    color: COLORS.textPrimary,
    opacity: 0.88,
    fontWeight: '600',
    flexShrink: 1
  },
  radarContainer: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginTop: 1.5
  },
  radarHalo: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.textPrimary
  },
  radarCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.textPrimary
  },
  statusTagBlack: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
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
    width: 6,
    height: 6,
    borderRadius: 3
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5
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
