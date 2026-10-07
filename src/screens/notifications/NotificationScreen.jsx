import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/user.api';

export const NotificationScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await userApi.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data.notifications);
      }
    } catch (e) {
      console.error('[NotificationScreen] Erreur :', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await userApi.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleDelete = async (id) => {
    try {
      await userApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (e) {}
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.card, !item.isRead && styles.unreadCard]}>
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
        <Pressable onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={COLORS.textMuted} />
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCurved
        title="Notifications"
        subtitle="Vos alertes de courses"
        user={user}
        onProfilePress={() => navigation.navigate('Settings')}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12
  },
  countText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600'
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark
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
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12
  },
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
  unreadCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  contentBox: {
    flex: 1
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  message: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 16
  },
  timeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6
  },
  deleteBtn: {
    padding: 6
  }
});
