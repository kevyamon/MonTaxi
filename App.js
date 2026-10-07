import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/context/AuthContext';
import { SocketProvider } from './src/context/SocketContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/theme/colors';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
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
