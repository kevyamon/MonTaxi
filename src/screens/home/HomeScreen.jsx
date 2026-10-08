import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { HomeCardPassenger } from '../../components/home/HomeCardPassenger';
import { HomeCardDriver } from '../../components/home/HomeCardDriver';
import { BookingBottomSheet } from '../../components/ride/BookingBottomSheet';
import { SearchDriverModal } from '../../components/ride/SearchDriverModal';
import { ActiveRideSheet } from '../../components/ride/ActiveRideSheet';
import { CustomAlertModal } from '../../components/common/CustomAlertModal';
import { rideApi } from '../../api/ride.api';
import { driverApi } from '../../api/driver.api';

export const HomeScreen = ({ navigation }) => {
  const { user, isDriver, updateUser } = useAuth();
  const { socket } = useSocket();

  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('Recherche d’un chauffeur proche...');
  const [activeRide, setActiveRide] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  const [isOnline, setIsOnline] = useState(user?.driverInfo?.isOnline || false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: ''
  });

  const showAlert = (type, title, message) => {
    setAlertConfig({ visible: true, type, title, message });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('ride:search:progress', (data) => {
      setSearchStatus(data.message);
    });

    socket.on('ride:search:timeout', (data) => {
      setIsSearching(false);
      showAlert('warning', 'Recherche terminée', data.message);
    });

    socket.on('ride:accepted', (data) => {
      setIsSearching(false);
      setActiveRide(data.ride);
    });

    socket.on('ride:driver_arrived', () => {
      setActiveRide((prev) => (prev ? { ...prev, status: 'driver_arriving' } : null));
    });

    socket.on('ride:started', () => {
      setActiveRide((prev) => (prev ? { ...prev, status: 'in_progress' } : null));
    });

    socket.on('ride:completed', (data) => {
      setActiveRide((prev) => (prev ? { ...prev, status: 'completed', fare: data.fare } : null));
    });

    return () => {
      socket.off('ride:search:progress');
      socket.off('ride:search:timeout');
      socket.off('ride:accepted');
      socket.off('ride:driver_arrived');
      socket.off('ride:started');
      socket.off('ride:completed');
    };
  }, [socket]);

  const handleOrderConfirm = async ({ pickupAddress, dropoffAddress, tier }) => {
    try {
      setOrderLoading(true);
      setShowBookingSheet(false);
      setIsSearching(true);
      setSearchStatus('Recherche d’un chauffeur proche...');

      const ridePayload = {
        tier,
        pickupLocation: {
          address: pickupAddress,
          coordinates: [-4.008256, 5.359952]
        },
        dropoffLocation: {
          address: dropoffAddress,
          coordinates: [-4.015256, 5.368952]
        }
      };

      const res = await rideApi.createRide(ridePayload);
      if (res.success) {
        setActiveRide(res.data);
      }
    } catch (error) {
      setIsSearching(false);
      showAlert('error', 'Erreur de commande', error.message || 'Impossible d’initier la course.');
    } finally {
      setOrderLoading(false);
    }
  };

  const handleToggleOnline = async () => {
    try {
      setStatusLoading(true);
      const newStatus = !isOnline;
      const res = await driverApi.updateStatus(newStatus);
      if (res.success) {
        setIsOnline(newStatus);
        updateUser({ driverInfo: { ...user?.driverInfo, isOnline: newStatus } });
      }
    } catch (err) {
      showAlert('error', 'Erreur', err.message || 'Impossible de mettre à jour votre statut.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleDriverAction = async (actionType) => {
    if (!activeRide) return;
    try {
      if (actionType === 'arrived') await rideApi.notifyArrived(activeRide._id);
      if (actionType === 'start') await rideApi.startRide(activeRide._id);
      if (actionType === 'complete') await rideApi.completeRide(activeRide._id);
    } catch (err) {
      showAlert('error', 'Erreur', err.message || 'Opération impossible.');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderCurved
        title="MonTaxi"
        subtitle="Abobo, à 30m de Marché central"
        user={user}
        onProfilePress={() => navigation.navigate('Settings')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeRide ? (
          <ActiveRideSheet
            ride={activeRide}
            isDriver={isDriver}
            onDriverAction={handleDriverAction}
            onCompleteDismiss={() => setActiveRide(null)}
          />
        ) : isDriver ? (
          <HomeCardDriver
            isOnline={isOnline}
            onToggleStatus={handleToggleOnline}
            loading={statusLoading}
            totalRides={user?.driverInfo?.totalRides || 0}
          />
        ) : (
          <HomeCardPassenger onOrderPress={() => setShowBookingSheet(true)} />
        )}
      </ScrollView>

      <BookingBottomSheet
        visible={showBookingSheet}
        onClose={() => setShowBookingSheet(false)}
        onConfirmOrder={handleOrderConfirm}
        loading={orderLoading}
      />

      <SearchDriverModal
        visible={isSearching}
        statusMessage={searchStatus}
        onCancelSearch={() => {
          setIsSearching(false);
          if (activeRide) rideApi.cancelRide(activeRide._id, 'Annulée par l’utilisateur');
          setActiveRide(null);
        }}
      />

      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={closeAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    padding: 20
  }
});
