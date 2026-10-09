import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home/HomeScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { NotificationScreen } from '../screens/notifications/NotificationScreen';
import { HelpScreen } from '../screens/help/HelpScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { CustomTabBar } from '../components/common/CustomTabBar';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      backBehavior="history"
      screenOptions={{
        headerShown: false
      }}
      initialRouteName="Home"
    >
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Help" component={HelpScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};
