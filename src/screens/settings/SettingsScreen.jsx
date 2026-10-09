import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../theme/colors';
import { HeaderCurved } from '../../components/common/HeaderCurved';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { CustomAlertModal } from '../../components/common/CustomAlertModal';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../api/user.api';
import { authApi } from '../../api/auth.api';
import { uploadApi } from '../../api/upload.api';
import { getApiErrorMessage } from '../../api/client';

export const SettingsScreen = () => {
  const { user, logout, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false, type: 'info', title: '', message: '', secondaryText: null, onSecondary: null
  });

  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const showAlert = (type, title, message, secondaryText = null, onSecondary = null) => {
    setAlertConfig({ visible: true, type, title, message, secondaryText, onSecondary });
  };
  const closeAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  const handlePickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        showAlert('warning', 'Permission requise', 'L’accès à votre galerie est nécessaire pour choisir une photo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.85
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedAvatar(result.assets[0].uri);
      }
    } catch (e) {
      showAlert('error', 'Erreur de sélection', 'Impossible d’accéder aux photos.');
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedAvatar) return;
    try {
      setUploadingAvatar(true);
      const res = await uploadApi.uploadAvatar(selectedAvatar);
      if (res.success) {
        updateUser(res.data.user || { ...user, avatarUrl: res.data.avatarUrl });
        setSelectedAvatar(null);
        showAlert('success', 'Photo mise à jour', 'Votre photo de profil a été enregistrée avec succès.');
      }
    } catch (e) {
      showAlert('error', 'Échec du téléversement', getApiErrorMessage(e));
    } finally {
      setUploadingAvatar(false);
    }
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
      showAlert('error', 'Erreur de mise à jour', getApiErrorMessage(e));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      showAlert('warning', 'Champs requis', 'Veuillez renseigner votre mot de passe actuel et le nouveau.');
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
      showAlert('error', 'Erreur', getApiErrorMessage(e));
    } finally {
      setSavingPassword(false);
    }
  };

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';
  const displayAvatarUri = selectedAvatar || user?.avatarUrl;

  return (
    <View style={styles.container}>
      <HeaderCurved title="Paramètres" subtitle="Gestion de votre compte" user={user} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section Photo de Profil Cloudinary */}
        <View style={styles.avatarSectionCard}>
          <View style={styles.avatarRow}>
            <Pressable style={styles.avatarWrapper} onPress={handlePickAvatar}>
              {displayAvatarUri ? (
                <Image source={{ uri: displayAvatarUri }} style={styles.avatarImg} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarLetter}>{initial}</Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color={COLORS.textLight} />
              </View>
            </Pressable>

            <View style={styles.avatarMeta}>
              <Text style={styles.avatarTitle}>Photo de profil</Text>
              <Text style={styles.avatarSubtitle}>
                {selectedAvatar ? 'Nouvelle photo sélectionnée' : 'Appuyez pour changer'}
              </Text>
              <Pressable style={styles.choosePhotoBtn} onPress={handlePickAvatar}>
                <Text style={styles.choosePhotoBtnText}>Choisir une image</Text>
              </Pressable>
            </View>
          </View>

          {selectedAvatar && (
            <View style={styles.confirmUploadBox}>
              <PrimaryButton
                title={uploadingAvatar ? 'Téléversement...' : 'Confirmer et envoyer la photo'}
                onPress={handleUploadAvatar}
                loading={uploadingAvatar}
                icon={!uploadingAvatar ? <Ionicons name="cloud-upload-outline" size={18} color={COLORS.textLight} /> : null}
              />
              <Pressable style={styles.cancelAvatarBtn} onPress={() => setSelectedAvatar(null)} disabled={uploadingAvatar}>
                <Text style={styles.cancelAvatarText}>Annuler</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Section Informations Personnelles */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Informations Personnelles</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom complet</Text>
            <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Numéro de téléphone</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Adresse e-mail</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
          </View>
          <PrimaryButton title="Enregistrer le profil" onPress={handleUpdateProfile} loading={savingProfile} style={styles.saveBtn} />
        </View>

        {/* Section Sécurité & Mot de passe */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sécurité & Mot de passe</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe actuel</Text>
            <TextInput style={styles.input} placeholder="Votre mot de passe actuel" secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nouveau mot de passe (min. 6 car.)</Text>
            <TextInput style={styles.input} placeholder="Nouveau mot de passe" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
          </View>
          <PrimaryButton title="Changer le mot de passe" variant="outline" onPress={handleChangePassword} loading={savingPassword} style={styles.saveBtn} />
        </View>

        {/* Zone Déconnexion & Suppression */}
        <View style={styles.dangerZone}>
          <PrimaryButton title="Se déconnecter" variant="outline" onPress={logout} icon={<Ionicons name="log-out-outline" size={20} color={COLORS.primaryDark} />} />
          <Pressable style={({ pressed }) => [styles.deleteButton, pressed && styles.deleteButtonPressed]} onPress={() => showAlert('warning', 'Supprimer mon compte ?', 'Cette action est irréversible.', 'Annuler', closeAlert)}>
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
            <Text style={styles.deleteButtonText}>Supprimer définitivement mon compte</Text>
          </Pressable>
        </View>
      </ScrollView>

      <CustomAlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} secondaryButtonText={alertConfig.secondaryText} onSecondaryPress={alertConfig.onSecondary} onClose={closeAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 20, paddingBottom: 140, gap: 16 },
  avatarSectionCard: {
    backgroundColor: COLORS.card, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.border, gap: 14, ...SHADOWS.small
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrapper: {
    width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: COLORS.primaryDark, position: 'relative', overflow: 'visible', ...SHADOWS.small
  },
  avatarImg: { width: 64, height: 64, borderRadius: 32 },
  avatarPlaceholder: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.backgroundSecondary, alignItems: 'center', justifyContent: 'center'
  },
  avatarLetter: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary },
  cameraBadge: {
    position: 'absolute', bottom: -2, right: -2, width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primaryDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.card
  },
  avatarMeta: { flex: 1, gap: 3 },
  avatarTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  avatarSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  choosePhotoBtn: { alignSelf: 'flex-start', marginTop: 4, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: COLORS.backgroundSecondary, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  choosePhotoBtnText: { fontSize: 11.5, fontWeight: '700', color: COLORS.primaryDark },
  confirmUploadBox: { gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  cancelAvatarBtn: { alignItems: 'center', paddingVertical: 6 },
  cancelAvatarText: { fontSize: 12.5, fontWeight: '700', color: COLORS.textMuted },
  sectionCard: {
    backgroundColor: COLORS.card, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: COLORS.border, gap: 12, ...SHADOWS.small
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  inputGroup: { gap: 4 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  input: {
    backgroundColor: COLORS.backgroundSecondary, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14, height: 48, fontSize: 14, color: COLORS.textPrimary
  },
  saveBtn: { marginTop: 4 },
  dangerZone: { marginTop: 6, gap: 12, alignItems: 'stretch' },
  deleteButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.dangerLight, borderWidth: 1, borderColor: COLORS.danger, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16
  },
  deleteButtonPressed: { opacity: 0.8 },
  deleteButtonText: { fontSize: 14, color: COLORS.danger, fontWeight: '700' }
});
