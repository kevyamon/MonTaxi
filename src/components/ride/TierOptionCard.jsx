import React, { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';

export const TierOptionCard = ({
  tierKey,
  name,
  subtext,
  priceText,
  iconName,
  selected,
  onPress
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 90,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 160,
        useNativeDriver: true
      })
    ]).start();
    onPress();
  };

  const isVip = tierKey === 'vip';
  const activeColor = isVip ? COLORS.secondaryDark : COLORS.primaryDark;
  const activeBg = isVip ? COLORS.secondaryLight : COLORS.primaryLight;
  const activeBorder = isVip ? COLORS.secondaryDark : COLORS.primaryDark;

  return (
    <Animated.View style={[{ flex: 1, transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        style={[
          styles.card,
          selected && { borderColor: activeBorder, backgroundColor: activeBg }
        ]}
        onPress={handlePress}
      >
        <View style={styles.header}>
          <Ionicons
            name={iconName}
            size={20}
            color={selected ? activeColor : COLORS.textSecondary}
          />
          <Text style={styles.name}>{name}</Text>
        </View>
        <Text style={styles.subtext}>{subtext}</Text>
        <Text
          style={[
            styles.price,
            selected && { color: activeColor }
          ]}
        >
          {priceText}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  subtext: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textMuted,
    marginTop: 8
  }
});
