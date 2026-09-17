import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useProfile } from '../../context/ProfileContext';
import { Badge, Button, Input, NavHeader, ScreenContainer } from '../../components';
import { Icon } from '../../icons/Icon';
import { colors, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'EditProfile'>;

const DESCRIPTION_MAX_LENGTH = 150;

function deriveDisplayName(storeName: string): string {
  return storeName.replace(/\s+Store$/i, '').trim() || storeName;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

export function EditProfileScreen({ navigation }: Props) {
  const { profile, updateProfileBasics, updateOwnerInfo, updateStoreInfo } = useProfile();

  const [storeName, setStoreName] = useState(profile.storeName);
  const [displayName, setDisplayName] = useState(deriveDisplayName(profile.storeName));
  const [description, setDescription] = useState(profile.store.description);
  const [whatsapp, setWhatsapp] = useState(profile.owner.phone);

  function handleChangeLogo() {
    Alert.alert('Change Logo', 'Coming soon.');
  }

  function handleChangeCover() {
    Alert.alert('Change Cover', 'Coming soon.');
  }

  function handleSave() {
    updateProfileBasics({ storeName });
    updateStoreInfo({ description });
    updateOwnerInfo({ phone: whatsapp });
    navigation.goBack();
  }

  return (
    <ScreenContainer scrollable={false}>
      <NavHeader
        title="Edit Profile"
        onBack={() => navigation.goBack()}
        rightLabel="Save"
        onRightPress={handleSave}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Store Details" />
        <View style={styles.card}>
          <Input label="Store Name" value={storeName} onChangeText={setStoreName} placeholder="Store name" />
          <Input
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
          />
          <View style={styles.fieldGroup}>
            <View style={styles.descriptionHeaderRow}>
              <Text style={styles.fieldLabel}>Store Description</Text>
              <Text style={styles.charCount}>
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </Text>
            </View>
            <TextInput
              style={styles.textarea}
              value={description}
              onChangeText={text => setDescription(text.slice(0, DESCRIPTION_MAX_LENGTH))}
              placeholder="Describe your store..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              maxLength={DESCRIPTION_MAX_LENGTH}
              textAlignVertical="top"
            />
          </View>
        </View>

        <SectionHeader title="Contact" />
        <View style={styles.card}>
          <Input
            label="Email"
            value={profile.owner.email}
            onChangeText={() => {}}
            editable={false}
            leftIcon="lock"
            rightElement={<Badge label="Verified" tone="success" />}
          />
          <Input
            label="WhatsApp Number"
            value={whatsapp}
            onChangeText={setWhatsapp}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />
        </View>

        <SectionHeader title="Store Media" />
        <View style={styles.card}>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Store Logo</Text>
            <View style={styles.logoRow}>
              <Pressable style={styles.logoBox} onPress={handleChangeLogo}>
                <Icon name="camera" size={20} color={colors.textPrimary} />
              </Pressable>
              <Pressable onPress={handleChangeLogo} hitSlop={8}>
                <Text style={styles.mediaLink}>Change Logo</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Cover Image</Text>
            <Pressable style={styles.coverBox} onPress={handleChangeCover}>
              <Icon name="camera" size={20} color={colors.textPrimary} />
              <Text style={styles.mediaLinkSmall}>Change Cover</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.footer}>
          <Button label="Save Changes" onPress={handleSave} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.surface,
  },
  sectionHeader: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionHeaderText: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  fieldGroup: {
    width: '100%',
    gap: spacing.sm,
  },
  descriptionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    ...typography.label,
    color: colors.textPrimary,
  },
  charCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  textarea: {
    ...typography.body,
    color: colors.textPrimary,
    height: 84,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.md,
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaLink: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  mediaLinkSmall: {
    ...typography.labelSemibold,
    color: colors.primary,
  },
  coverBox: {
    marginTop: spacing.md,
    height: 80,
    width: '100%',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
});
