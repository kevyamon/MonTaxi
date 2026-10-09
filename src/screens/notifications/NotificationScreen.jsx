import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { ItemActionModal } from '../../components/common/ItemActionModal';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { userApi } from '../../api/user.api';

export const NotificationScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  const fetchNotifications = async () => {
    try {
      const res = await userApi.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications);
      }
    } catch (e) {
      console.warn('[NotificationScreen] Erreur :', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Écoute Socket.IO en temps réel pour les notifications
  useEffect(() => {
    if (!socket) return;

    socket.on('notification:new', (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    socket.on('ride:update', () => {
      fetchNotifications();
    });

    return () => {
      socket.off('notification:new');
      socket.off('ride:update');
    };
  }, [socket]);

  const handleMarkAllRead = async () => {
    try {
      await userApi.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleDeleteNotif = async () => {
    if (!selectedNotif) return;
    const notifId = selectedNotif._id;
    const prev = [...notifications];
    setNotifications((list) => list.filter((n) => n._id !== notifId));
    setSelectedNotif(null);

    try {
      await userApi.deleteNotification(notifId);
    } catch (e) {
      console.warn('[NotificationScreen] Erreur suppression notif :', e);
      setNotifications(prev);
    }
  };

  const handleArchiveNotif = async () => {
    if (!selectedNotif) return;
    const notifId = selectedNotif._id;
    const prev = [...notifications];
    setNotifications((list) => list.filter((n) => n._id !== notifId));
    setSelectedNotif(null);

    try {
      await userApi.archiveNotification(notifId);
    } catch (e) {
      console.warn('[NotificationScreen] Erreur archivage notif :', e);
      setNotifications(prev);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          !item.isRead && styles.unreadCard,
          pressed && styles.cardPressed
        ]}
        onLongPress={() => setSelectedNotif(item)}
      >
        <View style={styles.iconBox}>
          <Ionicons
            name={item.type === 'ride_update' ? 'car-sport' : 'notifications'}
            size={20}
            color={COLORS.primaryDark}
          />
        </View>
        <View style={styles.contentBox}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timeText}>
            {new Date(item.createdAt).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCurved
        title="Alertes"
        subtitle="Vos notifications en direct"
        user={user}
        onProfilePress={() => navigation.navigate('Settings')}
        showLocationPin={false}
      />

      <View style={styles.actionsBar}>
        <Text style={styles.countText}>{notifications.length} notifications</Text>
        {notifications.length > 0 && (
          <Pressable onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Tout marquer comme lu</Text>
          </Pressable>
        )}
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={COLORS.primaryDark} size="large" />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="notifications-off-outline" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyTitle}>Aucune notification</Text>
          <Text style={styles.emptySubtitle}>Vous êtes à jour !</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />}
        />
      )}

      <ItemActionModal
        visible={!!selectedNotif}
        title="Gérer l’alerte"
        onClose={() => setSelectedNotif(null)}
        onDelete={handleDeleteNotif}
        onArchive={handleArchiveNotif}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  countText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  markReadText: { fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginTop: 12 },
  emptySubtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  listContent: { paddingHorizontal: 20, paddingBottom: 130, gap: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'flex-start',
    ...SHADOWS.small
  },
  cardPressed: { opacity: 0.85 },
  unreadCard: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  contentBox: { flex: 1 },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  message: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3, lineHeight: 16 },
  timeText: { fontSize: 11, color: COLORS.textMuted, marginTop: 6 }
});
