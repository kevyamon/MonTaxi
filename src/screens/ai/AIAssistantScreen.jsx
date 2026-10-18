import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  Pressable, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { CustomAlertModal } from '../../components/common/CustomAlertModal';
import { useAuth } from '../../context/AuthContext';
import { aiApi } from '../../api/ai.api';
import { getApiErrorMessage } from '../../api/client';

const SUGGESTION_CHIPS = [
  { id: 'fares', icon: 'pricetag-outline', text: 'Quels sont les tarifs des forfaits Éco et VIP ?' },
  { id: 'zones', icon: 'navigate-outline', text: 'Quelles sont les villes desservies ?' },
  { id: 'order', icon: 'car-sport-outline', text: 'Comment commander un taxi ?' },
  { id: 'driver', icon: 'person-add-outline', text: 'Comment devenir chauffeur partenaire ?' },
  { id: 'payment', icon: 'wallet-outline', text: 'Quels sont les modes de paiement acceptés ?' }
];

export const AIAssistantScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '', onPrimary: null });

  const firstName = user?.fullName ? user.fullName.split(' ')[0] : 'à vous';
  const welcomeText = `Bonjour ${firstName}, je suis MonTaxi IA, comment puis-je vous aider aujourd'hui ?`;

  const fetchHistory = async () => {
    try {
      setInitialLoading(true);
      const res = await aiApi.getHistory();
      if (res.success && Array.isArray(res.data?.messages) && res.data.messages.length > 0) {
        setMessages(res.data.messages);
      } else {
        setMessages([{ role: 'model', text: welcomeText, timestamp: new Date() }]);
      }
    } catch {
      setMessages([{ role: 'model', text: welcomeText, timestamp: new Date() }]);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async (textToSend = inputText) => {
    const cleanText = (textToSend || '').trim();
    if (!cleanText || loading) return;

    setInputText('');
    setMessages((prev) => [...prev, { role: 'user', text: cleanText, timestamp: new Date() }]);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);

    try {
      setLoading(true);
      const res = await aiApi.sendMessage(cleanText);
      if (res.success && res.data?.reply) {
        setMessages((prev) => [...prev, { role: 'model', text: res.data.reply, timestamp: new Date() }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: getApiErrorMessage(err) || 'Désolé, une erreur est survenue lors du traitement.', timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const handleClearHistory = () => {
    setAlertConfig({
      visible: true,
      type: 'warning',
      title: 'Effacer la discussion ?',
      message: 'Tout l’historique des échanges avec MonTaxi IA sera supprimé.',
      buttonText: 'Effacer',
      secondaryText: 'Annuler',
      onPrimary: async () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        try {
          await aiApi.clearHistory();
          setMessages([{ role: 'model', text: welcomeText, timestamp: new Date() }]);
        } catch {}
      },
      onSecondary: () => setAlertConfig((prev) => ({ ...prev, visible: false }))
    });
  };

  const renderMessageItem = ({ item }) => {
    const isUser = item.role === 'user';
    const timeFormatted = item.timestamp
      ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="chatbubble-ellipses" size={13} color={COLORS.primaryDark} />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
          <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.aiBubbleText]}>{item.text}</Text>
          {timeFormatted ? (
            <Text style={[styles.bubbleTime, isUser ? styles.userTime : styles.aiTime]}>{timeFormatted}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && styles.btnPressed]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
        </Pressable>

        <View style={styles.headerTitleBox}>
          <View style={styles.titleWithDot}>
            <Text style={styles.headerTitle}>MonTaxi IA</Text>
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.headerSub}>Assistant Officiel 24/7</Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.headerBtn, pressed && styles.btnPressed]}
          onPress={handleClearHistory}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.textPrimary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {initialLoading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator size="large" color={COLORS.primaryDark} />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => `msg_${index}`}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              messages.length <= 1 ? (
                <View style={styles.chipsSection}>
                  <Text style={styles.chipsTitle}>Suggestions fréquentes :</Text>
                  <View style={styles.chipsContainer}>
                    {SUGGESTION_CHIPS.map((chip) => (
                      <Pressable
                        key={chip.id}
                        style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                        onPress={() => handleSend(chip.text)}
                      >
                        <Ionicons name={chip.icon} size={15} color={COLORS.primaryDark} />
                        <Text style={styles.chipText}>{chip.text}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : null
            }
            ListFooterComponent={
              loading ? (
                <View style={styles.typingContainer}>
                  <View style={styles.aiAvatar}>
                    <Ionicons name="chatbubble-ellipses" size={13} color={COLORS.primaryDark} />
                  </View>
                  <View style={styles.typingBubble}>
                    <ActivityIndicator size="small" color={COLORS.primaryDark} />
                    <Text style={styles.typingText}>MonTaxi IA rédige sa réponse...</Text>
                  </View>
                </View>
              ) : null
            }
          />
        )}

        {/* Barre de saisie */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.textInput}
            placeholder="Posez votre question à MonTaxi IA..."
            placeholderTextColor={COLORS.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              (!inputText.trim() || loading) && styles.sendBtnDisabled,
              pressed && styles.btnPressed
            ]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || loading}
          >
            <Ionicons name="send" size={18} color={COLORS.textLight} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttonText={alertConfig.buttonText}
        secondaryButtonText={alertConfig.secondaryText}
        onPrimaryPress={alertConfig.onPrimary}
        onSecondaryPress={alertConfig.onSecondary}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    ...SHADOWS.small
  },
  headerBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.card, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
  btnPressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },
  headerTitleBox: { alignItems: 'center' },
  titleWithDot: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: COLORS.textPrimary },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  headerSub: { fontSize: 11, fontWeight: '700', color: COLORS.textPrimary, opacity: 0.8 },
  keyboardContainer: { flex: 1 },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  listContent: { padding: 16, paddingBottom: 24, gap: 12 },
  chipsSection: { marginBottom: 14, marginTop: 8 },
  chipsTitle: { fontSize: 12.5, fontWeight: '800', color: COLORS.textSecondary, marginBottom: 8 },
  chipsContainer: { gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small
  },
  chipPressed: { backgroundColor: COLORS.primaryLight },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, flex: 1 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  aiAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '82%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble: { backgroundColor: COLORS.primaryDark, borderBottomRightRadius: 4, ...SHADOWS.small },
  aiBubble: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderBottomLeftRadius: 4, ...SHADOWS.small },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  userBubbleText: { color: COLORS.textLight, fontWeight: '500' },
  aiBubbleText: { color: COLORS.textPrimary, fontWeight: '500' },
  bubbleTime: { fontSize: 9.5, marginTop: 4, alignSelf: 'flex-end' },
  userTime: { color: COLORS.textMuted },
  aiTime: { color: COLORS.textMuted },
  typingContainer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  typingText: { fontSize: 12, color: COLORS.textSecondary, fontStyle: 'italic' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.textPrimary,
    maxHeight: 100
  },
  sendBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center', ...SHADOWS.small },
  sendBtnDisabled: { opacity: 0.4 }
});
