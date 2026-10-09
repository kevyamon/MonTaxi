import React, { useState, useEffect, useCallback } from 'react';
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
import { getCurrentPosition, evaluateLocation } from '../../services/location.service';
import { rideApi } from '../../api/ride.api';
import { driverApi } from '../../api/driver.api';

export const HomeScreen = ({ navigation }) => {
  const { user, isDriver, updateUser } = useAuth();
  const { socket } = useSocket();

  // Localisation & Geofencing
  const [coords, setCoords] = useState({ latitude: 5.2719, longitude: -3.5956 });
  const [locationAddress, setLocationAddress] = useState('Recherche de votre position...');
  const [isInCoverage, setIsInCoverage] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);

  // Flux Passager
  const [showBookingSheet, setShowBookingSheet] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('Recherche d’un chauffeur proche...');
  const [activeRide, setActiveRide] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  // Flux Chauffeur
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

  const refreshLocation = useCallback(async () => {
    try {
      setLocationLoading(true);
      const pos = await getCurrentPosition();
      if (pos) {
        setCoords(pos);
        const evalResult = await evaluateLocation(pos.latitude, pos.longitude);
        setIsInCoverage(evalResult.isInCoverage);
        setLocationAddress(evalResult.address);
      } else {
        // Fallback Bonoua
        const defaultEval = await evaluateLocation(5.2719, -3.5956);
        setCoords({ latitude: 5.2719, longitude: -3.5956 });
        setIsInCoverage(defaultEval.isInCoverage);
        setLocationAddress(defaultEval.address);
      }
    } catch (err) {
      console.warn('[HomeScreen] Erreur chargement position :', err);
    } finally {
      setLocationLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshLocation();
  }, [refreshLocation]);

  useEffect(() => {
    if (!socket) return;

    socket.on('ride:search:progress', (data) => setSearchStatus(data.message));
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
    if (!isInCoverage) {
      showAlert('error', 'Zone non couverte', 'Vous devez être dans une zone d’activité pour commander.');
      return;
    }
    try {
      setOrderLoading(true);
      setShowBookingSheet(false);
      setIsSearching(true);
      setSearchStatus('Recherche d’un chauffeur proche...');

      const ridePayload = {
        tier,
        pickupLocation: {
          address: pickupAddress,
          coordinates: [coords.longitude, coords.latitude]
        },
        dropoffLocation: {
          address: dropoffAddress,
          coordinates: [coords.longitude + 0.008, coords.latitude + 0.008]
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
        subtitle={locationAddress}
        user={user}
        onProfilePress={() => navigation.navigate('Settings')}
        showLocationPin={true}
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
          <HomeCardPassenger
            onOrderPress={() => setShowBookingSheet(true)}
            isInCoverage={isInCoverage}
            onRefreshLocation={refreshLocation}
            locationLoading={locationLoading}
          />
        )}
      </ScrollView>

      <BookingBottomSheet
        visible={showBookingSheet}
        onClose={() => setShowBookingSheet(false)}
        onConfirmOrder={handleOrderConfirm}
        pickupAddress={locationAddress}
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
