import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { CustomAlertModal } from '../../components/common/CustomAlertModal';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/user.api';
import { authApi } from '../../api/auth.api';

export const SettingsScreen = ({ navigation }) => {
  const { user, logout, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: 'info',
    title: '',
    message: '',
    secondaryText: null,
    onSecondary: null
  });

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const showAlert = (type, title, message, secondaryText = null, onSecondary = null) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
      secondaryText,
      onSecondary
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, visible: false }));
  };

  const handleUpdateProfile = async () => {
    try {
      setSavingProfile(true);
      const res = await userApi.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase()
      });
      if (res.success) {
        updateUser(res.data);
        showAlert('success', 'Profil mis à jour', 'Vos informations ont été enregistrées avec succès.');
      }
    } catch (e) {
      showAlert('error', 'Erreur de mise à jour', e.message || 'Impossible de mettre à jour le profil.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      showAlert('warning', 'Champs requis', 'Veuillez saisir votre mot de passe actuel et votre nouveau mot de passe.');
      return;
    }
    if (newPassword.length < 6) {
      showAlert('warning', 'Mot de passe trop court', 'Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }
    try {
      setSavingPassword(true);
      await authApi.updatePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      showAlert('success', 'Succès', 'Votre mot de passe a été modifié avec succès.');
    } catch (e) {
      showAlert('error', 'Erreur', e.message || 'Mot de passe actuel incorrect.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    showAlert(
      'warning',
      'Supprimer mon compte ?',
      'Cette action est irréversible. Toutes vos données seront désactivées.',
      'Annuler',
      closeAlert
    );
  };

  return (
    <View style={styles.container}>
      <HeaderCurved title="Paramètres" subtitle="Gestion de votre compte" user={user} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Informations Personnelles</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse e-mail</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>
          <PrimaryButton
            title="Enregistrer le profil"
            onPress={handleUpdateProfile}
            loading={savingProfile}
            style={styles.saveBtn}
          />
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sécurité & Mot de passe</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe actuel</Text>
            <TextInput
              style={styles.input}
              placeholder="Votre mot de passe actuel"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nouveau mot de passe (min. 6 car.)</Text>
            <TextInput
              style={styles.input}
              placeholder="Nouveau mot de passe"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
          <PrimaryButton
            title="Changer le mot de passe"
            variant="outline"
            onPress={handleChangePassword}
            loading={savingPassword}
            style={styles.saveBtn}
          />
        </View>

        <View style={styles.dangerZone}>
          <PrimaryButton
            title="Se déconnecter"
            variant="outline"
            onPress={logout}
            icon={<Ionicons name="log-out-outline" size={20} color={COLORS.primaryDark} />}
          />
          <Pressable
            style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]}
            onPress={handleDeleteAccount}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            <Text style={styles.deleteButtonText}>Supprimer définitivement mon compte</Text>
          </Pressable>
        </View>
      </ScrollView>

      <CustomAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        secondaryButtonText={alertConfig.secondaryText}
        onSecondaryPress={alertConfig.onSecondary}
        onClose={closeAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, gap: 18 },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    ...SHADOWS.small
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  inputGroup: { gap: 4 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: COLORS.textPrimary
  },
  saveBtn: { marginTop: 4 },
  dangerZone: { marginTop: 8, gap: 14, alignItems: 'stretch' },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16
  },
  deleteButtonPressed: {
    opacity: 0.8
  },
  deleteButtonText: {
    fontSize: 14,
    color: COLORS.danger,
    fontWeight: '700'
  }
});
