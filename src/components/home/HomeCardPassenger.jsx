import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../common/PrimaryButton';

export const HomeCardPassenger = ({ onOrderPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image
          source={require('../../../assets/images/taxi_3d.jpg')}
          style={styles.taxiImage}
          resizeMode="cover"
        />
        <View style={styles.badgePromo}>
          <Ionicons name="flash" size={14} color={COLORS.textPrimary} />
          <Text style={styles.badgeText}>Service Rapide</Text>
        </View>
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.title}>Besoin d’un taxi maintenant ?</Text>
        <Text style={styles.description}>
          Commandez votre course en un clic à Abidjan avec des chauffeurs certifiés et les meilleurs tarifs.
        </Text>

        <View style={styles.tierTagsRow}>
          <View style={styles.tierTag}>
            <Ionicons name="people-outline" size={16} color={COLORS.primaryDark} />
            <Text style={styles.tierTagText}>Forfait Éco</Text>
          </View>
          <View style={[styles.tierTag, styles.vipTag]}>
            <Ionicons name="sparkles-outline" size={16} color={COLORS.secondaryDark} />
            <Text style={[styles.tierTagText, styles.vipTagText]}>Forfait VIP</Text>
          </View>
        </View>

        <PrimaryButton
          title="Commander un taxi"
          onPress={onOrderPress}
          icon={<Ionicons name="car-sport" size={20} color={COLORS.textPrimary} />}
          style={styles.orderButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.medium
  },
  imageWrapper: {
    height: 190,
    width: '100%',
    backgroundColor: COLORS.backgroundSecondary,
    position: 'relative'
  },
  taxiImage: {
    width: '100%',
    height: '100%'
  },
  badgePromo: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    ...SHADOWS.small
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  infoContent: {
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 6
  },
  tierTagsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16
  },
  tierTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6
  },
  tierTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark
  },
  vipTag: {
    backgroundColor: COLORS.secondaryLight
  },
  vipTagText: {
    color: COLORS.secondaryDark
  },
  orderButton: {
    marginTop: 4
  }
});
