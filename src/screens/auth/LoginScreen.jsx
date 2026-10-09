import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { CustomAlertModal } from '../../components/common/CustomAlertModal';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('both');

  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: 'error',
    title: '',
    message: ''
  });

  const showAlert = (type, title, message) => {
    setModalConfig({ visible: true, type, title, message });
  };

  const closeAlert = () => {
    setModalConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleIdentifierChange = (text) => {
    setIdentifier(text);
    const trimmed = text.trim();
    if (/^\+?[0-9]/.test(trimmed)) {
      setInputType('phone');
    } else if (trimmed.length > 0) {
      setInputType('email');
    } else {
      setInputType('both');
    }
  };

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      showAlert('warning', 'Champs requis', 'Veuillez saisir votre identifiant et votre mot de passe.');
      return;
    }

    try {
      setLoading(true);
      await login(identifier.trim(), password);
    } catch (error) {
      showAlert('error', 'Erreur de connexion', error.message || 'Identifiant ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 180 }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        bounces={true}
      >
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>MonTaxi</Text>
          <Text style={styles.subtitle}>Connectez-vous pour accéder à vos courses</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {inputType === 'phone'
                ? 'Numéro de téléphone'
                : inputType === 'email'
                ? 'Adresse e-mail'
                : 'E-mail ou Téléphone'}
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name={inputType === 'phone' ? 'call-outline' : 'mail-outline'}
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Ex: 0701020304 ou exemple@mail.ci"
                placeholderTextColor={COLORS.textMuted}
                value={identifier}
                onChangeText={handleIdentifierChange}
                autoCapitalize="none"
                keyboardType={inputType === 'phone' ? 'phone-pad' : 'email-address'}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                placeholderTextColor={COLORS.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={COLORS.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          <PrimaryButton
            title="Se connecter"
            onPress={handleLogin}
            loading={loading}
            style={styles.submitButton}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <Pressable onPress={() => navigation.navigate('Register')} disabled={loading}>
              <Text style={styles.registerLink}>Créer un compte</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <CustomAlertModal
        visible={modalConfig.visible}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onClose={closeAlert}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, backgroundColor: COLORS.background, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...SHADOWS.small
  },
  logoImage: { width: 72, height: 72 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.primaryDark, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, textAlign: 'center' },
  form: { gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.textPrimary },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 52
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  eyeButton: { padding: 6 },
  submitButton: { marginTop: 10 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 20 },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  registerLink: { fontSize: 14, fontWeight: '700', color: COLORS.primaryDark }
});
