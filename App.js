import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { AppNavigator, navigate } from './src/navigation/AppNavigator';
import { registerNotificationListeners } from './src/services/pushNotification.service';
import { COLORS } from './src/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    const unsubscribe = registerNotificationListeners(
      (notification) => {
        // Notification reçue au premier plan
      },
      (response) => {
        // Clic sur notification push dans la barre d'état Android
        const data = response?.notification?.request?.content?.data;
        if (data?.rideId) {
          navigate('Home');
        } else if (data?.type === 'notification') {
          navigate('Notifications');
        }
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SocketProvider>
          <StatusBar style="dark" backgroundColor={COLORS.background} />
          <AppNavigator />
        </SocketProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
