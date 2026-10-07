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
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isCenter = route.name === 'Home';
        const iconInfo = icons[route.name] || { active: 'ellipse', inactive: 'ellipse-outline', label: route.name };

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
                <Ionicons name={isFocused ? 'home' : 'home-outline'} size={28} color={COLORS.textLight} />
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
                size={22}
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
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.tabBarBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.large
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4
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
    marginTop: -22
  },
  centerButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.background,
    ...SHADOWS.medium
  },
  centerButtonActive: {
    backgroundColor: COLORS.primaryDark
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }]
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3
  },
  tabLabelActive: {
    color: COLORS.tabBarActive
  },
  tabLabelInactive: {
    color: COLORS.tabBarInactive
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.background
  },
  badgeText: {
    color: COLORS.textLight,
    fontSize: 9,
    fontWeight: '800'
  }
});
