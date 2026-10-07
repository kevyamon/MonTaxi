import React from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../../theme/colors';

export const SplashScreenView = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="dark-content" />
      <Image
        source={require('../../../assets/splash.png')}
        style={styles.splashImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  splashImage: {
    width: '80%',
    height: '60%'
  }
});
