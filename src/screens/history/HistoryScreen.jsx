import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { useAuth } from '../../context/AuthContext';
import { rideApi } from '../../api/ride.api';

export const HistoryScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await rideApi.getRideHistory();
      if (res.success && res.data) {
        setRides(res.data.rides);
      }
    } catch (e) {
      console.error('[HistoryScreen] Erreur chargement historique :', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderRideItem = ({ item }) => {
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <View style={styles.rideCard}>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCurved
        title="Historique"
        subtitle="Vos courses réalisées"
        user={user}
        onProfilePress={() => navigation.navigate('Settings')}
      />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={COLORS.primaryDark} size="large" />
        </View>
      ) : rides.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="time-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Aucune course trouvée</Text>
          <Text style={styles.emptySubtitle}>Vos courses terminées apparaîtront ici.</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 12
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4
  },
  listContent: {
    padding: 20,
    gap: 14
  },
  rideCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  rideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  tierBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  tierText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark
  },
  dateText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '500'
  },
  fareText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary
  },
  addressesBox: {
    gap: 8
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  addressText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1
  }
});
