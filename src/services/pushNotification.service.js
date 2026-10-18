import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Configuration du comportement des notifications au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

const NOTIFICATION_CHANNEL_ID = 'montaxi-rides';

/**
 * Configure le canal de notification Android haute priorité
 */
export const setupNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name: 'Courses & Alertes MonTaxi',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#40E0D0',
      sound: 'default',
      enableVibrate: true,
      showBadge: true
    });
  }
};

/**
 * Demande les permissions et récupère le jeton Expo Push du terminal
 * @returns {Promise<string|null>} Le jeton Expo Push ou null en cas de refus
 */
export const registerForPushNotificationsAsync = async () => {
  let token = null;

  try {
    await setupNotificationChannel();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[PushService] Permission de notification non accordée.');
      return null;
    }

    // Extraction robuste du projectId EAS
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId ??
      '93d5e4f9-b8a0-4e5f-a328-660b55d2393b';

    const tokenResponse = await Notifications.getExpoPushTokenAsync({
      projectId
    });

    token = tokenResponse?.data || null;
  } catch (error) {
    console.warn('[PushService] Erreur lors de la récupération du jeton push :', error?.message);
  }

  return token;
};

/**
 * Attache les écouteurs de réception et d'interaction avec les notifications
 * @param {Function} onReceived - Callback lors de la réception au premier plan
 * @param {Function} onResponse - Callback lors du clic sur la notification
 * @returns {Function} Fonction de nettoyage des écouteurs
 */
export const registerNotificationListeners = (onReceived, onResponse) => {
  const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    if (typeof onReceived === 'function') {
      onReceived(notification);
    }
  });

  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    if (typeof onResponse === 'function') {
      onResponse(response);
    }
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
};
