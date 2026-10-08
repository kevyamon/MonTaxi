import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { CustomAlertModal } from '../../components/common/CustomAlertModal';
import { useAuth } from '../../context/AuthContext';

export const HelpScreen = ({ navigation }) => {
  const { user, isDriver } = useAuth();

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

  const handleWhatsAppSupport = () => {
    const phone = '2250700000000';
    const message = encodeURIComponent('Bonjour support MonTaxi, j’ai besoin d’une assistance.');
    Linking.openURL(`https://wa.me/${phone}?text=${message}`).catch(() => {
      showAlert('error', 'Erreur WhatsApp', 'Impossible d’ouvrir WhatsApp sur cet appareil.');
    });
  };

  const handleAIAssistant = () => {
    showAlert(
      'info',
      'Assistant IA MonTaxi',
      'Posez vos questions sur le fonctionnement des forfaits Éco/VIP, des tarifs ou de l’application.'
    );
  };

  const passengerCards = [
    {
      title: 'Comment commander un taxi ?',
      text: 'Sur l’accueil, cliquez sur "Commander un taxi", entrez votre destination, choisissez entre le forfait Éco ou VIP, puis confirmez.',
      icon: 'car-sport-outline'
    },
    {
      title: 'Différence entre Éco et VIP',
      text: 'Le forfait Éco est économique pour un trajet partagé. Le forfait VIP vous garantit un taxi privatisé avec confort supérieur.',
      icon: 'sparkles-outline'
    },
    {
      title: 'Modes de paiement acceptés',
      text: 'Vous pouvez régler votre course directement en espèces auprès du chauffeur ou via Wave / Mobile Money.',
      icon: 'wallet-outline'
    }
  ];

  const driverCards = [
    {
      title: 'Comment recevoir des courses ?',
      text: 'Basculez votre statut en mode "En Ligne" depuis la page d’accueil. Vous recevrez des alertes radar automatiques.',
      icon: 'radio-outline'
    },
    {
      title: 'Gestion des étapes d’une course',
      text: 'Validez votre arrivée sur les lieux, démarrez la course dès la montée du client, puis terminez le trajet pour encaisser.',
      icon: 'navigate-outline'
    },
    {
      title: 'Tarification et commissions',
      text: 'Les prix sont calculés automatiquement au kilomètre et à la minute selon le forfait sélectionné par le passager.',
      icon: 'cash-outline'
    }
  ];

  const cards = isDriver ? driverCards : passengerCards;

  return (
    <View style={styles.container}>
      <HeaderCurved
        title="Centre d’Aide"
        subtitle="Guides et support client"
        user={user}
        onProfilePress={() => navigation.navigate('Settings')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Besoin d’aide immédiate ?</Text>
        <View style={styles.supportButtonsRow}>
          <Pressable
            style={({ pressed }) => [styles.supportCard, pressed && styles.cardPressed]}
            onPress={handleWhatsAppSupport}
          >
            <View style={[styles.supportIconBox, { backgroundColor: COLORS.whatsappLight }]}>
              <Ionicons name="logo-whatsapp" size={24} color={COLORS.whatsapp} />
            </View>
            <Text style={styles.supportCardTitle}>Support WhatsApp</Text>
            <Text style={styles.supportCardSub}>Réponse en quelques minutes</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.supportCard, pressed && styles.cardPressed]}
            onPress={handleAIAssistant}
          >
            <View style={[styles.supportIconBox, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="chatbubble-ellipses" size={24} color={COLORS.primaryDark} />
            </View>
            <Text style={styles.supportCardTitle}>Assistant IA</Text>
            <Text style={styles.supportCardSub}>Aide instantanée 24/7</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>
          {isDriver ? 'Guide du Chauffeur' : 'Guide du Passager'}
        </Text>
        <View style={styles.cardsContainer}>
          {cards.map((c, idx) => (
            <View key={idx} style={styles.guideCard}>
              <View style={styles.guideHeader}>
                <Ionicons name={c.icon} size={20} color={COLORS.primaryDark} />
                <Text style={styles.guideTitle}>{c.title}</Text>
              </View>
              <Text style={styles.guideText}>{c.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

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
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 12 },
  supportButtonsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  supportCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  cardPressed: { opacity: 0.8 },
  supportIconBox: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  supportCardTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  supportCardSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  cardsContainer: { gap: 12 },
  guideCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  guideHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  guideTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, flex: 1 },
  guideText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 }
});
