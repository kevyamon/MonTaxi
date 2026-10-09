import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { ItemActionModal } from '../../components/common/ItemActionModal';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { rideApi } from '../../api/ride.api';

export const HistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [tab, setTab] = useState('active'); // 'active' | 'archived'
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);

  const fetchHistory = useCallback(async (isArchivedTab = tab === 'archived') => {
    try {
      const res = await rideApi.getRideHistory(1, 20, isArchivedTab);
      if (res.success && res.data) {
        setRides(res.data.rides);
      }
    } catch (e) {
      console.warn('[HistoryScreen] Erreur :', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    fetchHistory(tab === 'archived');
  }, [tab, fetchHistory]);

  // Écoute Socket.IO en temps réel
  useEffect(() => {
    if (!socket || tab === 'archived') return;

    const onRideUpdated = () => fetchHistory(false);
    socket.on('ride:completed', onRideUpdated);
    socket.on('ride:accepted', onRideUpdated);

    return () => {
      socket.off('ride:completed', onRideUpdated);
      socket.off('ride:accepted', onRideUpdated);
    };
  }, [socket, tab, fetchHistory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleDeleteRide = async () => {
    if (!selectedRide) return;
    const rideId = selectedRide._id;
    const previousRides = [...rides];
    setRides((prev) => prev.filter((r) => r._id !== rideId));
    setSelectedRide(null);

    try {
      await rideApi.deleteRide(rideId);
    } catch (err) {
      console.warn('[HistoryScreen] Erreur suppression API :', err);
      setRides(previousRides);
    }
  };

  const handleArchiveRide = async () => {
    if (!selectedRide) return;
    const rideId = selectedRide._id;
    const previousRides = [...rides];
    setRides((prev) => prev.filter((r) => r._id !== rideId));
    setSelectedRide(null);

    try {
      await rideApi.archiveRide(rideId);
    } catch (err) {
      console.warn('[HistoryScreen] Erreur archivage API :', err);
      setRides(previousRides);
    }
  };

  const handleUnarchiveRide = async () => {
    if (!selectedRide) return;
    const rideId = selectedRide._id;
    const previousRides = [...rides];
    setRides((prev) => prev.filter((r) => r._id !== rideId));
    setSelectedRide(null);

    try {
      await rideApi.unarchiveRide(rideId);
    } catch (err) {
      console.warn('[HistoryScreen] Erreur désarchivage API :', err);
      setRides(previousRides);
    }
  };

  const renderRideItem = ({ item }) => {
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <Pressable
        style={({ pressed }) => [styles.rideCard, pressed && styles.cardPressed]}
        onLongPress={() => setSelectedRide(item)}
      >
        <View style={styles.rideHeader}>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{item.tier === 'vip' ? 'VIP' : 'ÉCO'}</Text>
          </View>
          <Text style={styles.dateText}>{dateFormatted}</Text>
          <Text style={styles.fareText}>{item.fare?.totalPrice || 0} FCFA</Text>
        </View>

        <View style={styles.addressesBox}>
          <View style={styles.addressRow}>
            <Ionicons name="radio-button-on" size={14} color={COLORS.primaryDark} />
            <Text style={styles.addressText} numberOfLines={1}>
              {item.pickupLocation?.address || 'Point de départ'}
            </Text>
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="location" size={14} color={COLORS.danger} />
            <Text style={styles.addressText} numberOfLines={1}>
              {item.dropoffLocation?.address || 'Destination'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCurved
        title="Historique"
        subtitle="Vos courses réalisées"
        user={user}
        onProfilePress={() => navigation.navigate('Settings')}
        showLocationPin={false}
      />

      <View style={styles.segmentContainer}>
        <Pressable
          style={[styles.segmentBtn, tab === 'active' && styles.segmentBtnActive]}
          onPress={() => setTab('active')}
        >
          <Text style={[styles.segmentText, tab === 'active' && styles.segmentTextActive]}>Actives</Text>
        </Pressable>
        <Pressable
          style={[styles.segmentBtn, tab === 'archived' && styles.segmentBtnActive]}
          onPress={() => setTab('archived')}
        >
          <Text style={[styles.segmentText, tab === 'archived' && styles.segmentTextActive]}>Archivées</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={COLORS.primaryDark} size="large" />
        </View>
      ) : rides.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name={tab === 'archived' ? 'archive-outline' : 'time-outline'} size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>
            {tab === 'archived' ? 'Aucune course archivée' : 'Aucune course trouvée'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {tab === 'archived' ? 'Vos courses archivées apparaîtront ici.' : 'Vos courses terminées apparaîtront ici.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item._id}
          renderItem={renderRideItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      <ItemActionModal
        visible={!!selectedRide}
        title="Gérer cette course"
        onClose={() => setSelectedRide(null)}
        onDelete={handleDeleteRide}
        onArchive={tab === 'active' ? handleArchiveRide : undefined}
        onUnarchive={tab === 'archived' ? handleUnarchiveRide : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundSecondary,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 4,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  segmentBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  segmentBtnActive: { backgroundColor: COLORS.card, ...SHADOWS.small },
  segmentText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  segmentTextActive: { color: COLORS.primaryDark, fontWeight: '800' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  listContent: { padding: 20, paddingBottom: 130, gap: 14 },
  rideCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  rideHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  tierBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tierText: { fontSize: 11, fontWeight: '800', color: COLORS.primaryDark },
  dateText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '500' },
  fareText: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  addressesBox: { gap: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addressText: { fontSize: 13, color: COLORS.textSecondary, flex: 1 }
});
