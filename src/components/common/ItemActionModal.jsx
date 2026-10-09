import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';

export const ItemActionModal = ({
  visible,
  title = 'Options de l’élément',
  onClose,
  onDelete,
  onArchive
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <View style={styles.actionsList}>
            {onArchive && (
              <Pressable
                style={({ pressed }) => [styles.actionRow, pressed && styles.actionPressed]}
                onPress={() => {
                  onClose();
                  onArchive();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: COLORS.primaryLight }]}>
                  <Ionicons name="archive-outline" size={20} color={COLORS.primaryDark} />
                </View>
                <Text style={styles.actionText}>Archiver</Text>
              </Pressable>
            )}

            {onDelete && (
              <Pressable
                style={({ pressed }) => [styles.actionRow, pressed && styles.actionPressed]}
                onPress={() => {
                  onClose();
                  onDelete();
                }}
              >
                <View style={[styles.iconBox, { backgroundColor: COLORS.dangerLight }]}>
                  <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                </View>
                <Text style={[styles.actionText, { color: COLORS.danger }]}>Supprimer</Text>
              </Pressable>
            )}
          </View>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Annuler</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.large
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    paddingBottom: 10
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center'
  },
  actionsList: {
    gap: 8,
    marginBottom: 14
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundSecondary,
    gap: 12
  },
  actionPressed: {
    opacity: 0.8
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary
  }
});
