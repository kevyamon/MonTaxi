import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { useAuth } from '../../context/AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Champs requis', 'Veuillez renseigner toutes les informations.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mot de passe', 'Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    try {
      setLoading(true);
      await register({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      });
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Impossible de créer votre compte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 20 }
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez le réseau MonTaxi</Text>
      </View>

      <View style={styles.roleSelector}>
        <Pressable
          style={[styles.roleOption, role === 'client' && styles.roleOptionActive]}
          onPress={() => setRole('client')}
        >
          <Ionicons name="person" size={16} color={role === 'client' ? COLORS.primaryDark : COLORS.textMuted} />
          <Text style={[styles.roleText, role === 'client' && styles.roleTextActive]}>Passager</Text>
        </Pressable>
        <Pressable
          style={[styles.roleOption, role === 'driver' && styles.roleOptionActive]}
          onPress={() => setRole('driver')}
        >
          <Ionicons name="car-sport" size={16} color={role === 'driver' ? COLORS.primaryDark : COLORS.textMuted} />
          <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Chauffeur</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom complet</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput style={styles.input} placeholder="Ex: Jean Kouassi" placeholderTextColor={COLORS.textMuted} value={fullName} onChangeText={setFullName} />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput style={styles.input} placeholder="Ex: 0701020304" placeholderTextColor={COLORS.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse e-mail</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput style={styles.input} placeholder="exemple@mail.ci" placeholderTextColor={COLORS.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mot de passe (min. 6 car.)</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} style={styles.icon} />
            <TextInput style={styles.input} placeholder="Au moins 6 caractères" placeholderTextColor={COLORS.textMuted} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textSecondary} />
            </Pressable>
          </View>
        </View>

        <PrimaryButton title="S’inscrire" onPress={handleRegister} loading={loading} style={styles.submitBtn} />

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Déjà inscrit ?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.background, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 16 },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    ...SHADOWS.small
  },
  logoImage: { width: 42, height: 42 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.primaryDark, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  roleSelector: { flexDirection: 'row', backgroundColor: COLORS.backgroundSecondary, borderRadius: 12, padding: 3, borderWidth: 1, borderColor: COLORS.border, marginBottom: 14 },
  roleOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 9, gap: 6 },
  roleOptionActive: { backgroundColor: COLORS.card, ...SHADOWS.small },
  roleText: { fontSize: 13, fontWeight: '600', color: COLORS.textMuted },
  roleTextActive: { color: COLORS.primaryDark, fontWeight: '700' },
  form: { gap: 10 },
  inputGroup: { gap: 4 },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.textPrimary },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundSecondary, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, height: 46 },
  icon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: COLORS.textPrimary, fontWeight: '500' },
  submitBtn: { marginTop: 6 },
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 12 },
  footerText: { fontSize: 13, color: COLORS.textSecondary },
  loginLink: { fontSize: 13, fontWeight: '700', color: COLORS.primaryDark }
});
