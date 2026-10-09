import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';

export const CustomTabBar = ({ state, descriptors, navigation, unreadNotifications = 0 }) => {
  const insets = useSafeAreaInsets();

  const icons = {
    History: { active: 'time', inactive: 'time-outline', label: 'Historique' },
    Notifications: { active: 'notifications', inactive: 'notifications-outline', label: 'Alertes' },
    Home: { active: 'home', inactive: 'home-outline', label: 'Accueil' },
    Help: { active: 'help-circle', inactive: 'help-circle-outline', label: 'Aide' },
    Settings: { active: 'settings', inactive: 'settings-outline', label: 'Réglages' }
  };

  return (
    <View
      style={[
        styles.floatingContainer,
        { bottom: insets.bottom > 0 ? insets.bottom + 8 : 16 }
      ]}
    >
      <View style={styles.tabBarInner}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenter = route.name === 'Home';
          const iconInfo = icons[route.name] || {
            active: 'ellipse',
            inactive: 'ellipse-outline',
            label: route.name
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (isCenter) {
            return (
              <View key={route.key} style={styles.centerButtonWrapper}>
                <Pressable
                  style={({ pressed }) => [
                    styles.centerButton,
                    isFocused && styles.centerButtonActive,
                    pressed && styles.buttonPressed
                  ]}
                  onPress={onPress}
                >
                  <Ionicons
                    name={isFocused ? 'home' : 'home-outline'}
                    size={26}
                    color={COLORS.textLight}
                  />
                </Pressable>
                <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                  {iconInfo.label}
                </Text>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              style={({ pressed }) => [styles.tabItem, pressed && styles.buttonPressed]}
              onPress={onPress}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isFocused ? iconInfo.active : iconInfo.inactive}
                  size={21}
                  color={isFocused ? COLORS.tabBarActive : COLORS.tabBarInactive}
                />
                {route.name === 'Notifications' && unreadNotifications > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.tabLabelActive : styles.tabLabelInactive
                ]}
              >
                {iconInfo.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 18,
    right: 18,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabBarInner: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.large
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20
  },
  centerButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3.5,
    borderColor: COLORS.card,
    ...SHADOWS.medium
  },
  centerButtonActive: {
    backgroundColor: COLORS.primaryDark
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.94 }]
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2
  },
  tabLabelActive: {
    color: COLORS.tabBarActive,
    fontWeight: '700'
  },
  tabLabelInactive: {
    color: COLORS.tabBarInactive
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -9,
    backgroundColor: COLORS.danger,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.card
  },
  badgeText: {
    color: COLORS.textLight,
    fontSize: 9,
    fontWeight: '800'
  }
});
