import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { useProfile } from '../../context/ProfileContext';
import { Button, NavHeader, ScreenContainer } from '../../components';
import { Icon } from '../../icons/Icon';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileStoreInfo'>;

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowDivider]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
        {value}
      </Text>
    </View>
  );
}

export function ProfileStoreInfoScreen({ navigation }: Props) {
  const { profile } = useProfile();
  const { store } = profile;

  return (
    <ScreenContainer scrollable={false}>
      <NavHeader title="Store Information" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.coverPlaceholder}>
          <Icon name="camera" size={32} color={colors.textSecondary} />
          <Text style={styles.coverPlaceholderText}>Add Cover Photo</Text>
          <View style={styles.changePill}>
            <Text style={styles.changePillText}>Change</Text>
          </View>
        </View>

        <View style={styles.card}>
          <InfoRow label="Store Name" value={profile.storeName} />
          <InfoRow label="Category" value={store.category} />
          <InfoRow label="Description" value={store.description} last />
        </View>

        <View style={styles.buttonWrapper}>
          <Button label="Edit Store Details" onPress={() => navigation.navigate('EditProfile')} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    paddingBottom: spacing.xxxl,
  },
  coverPlaceholder: {
    height: 160,
    width: '100%',
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  coverPlaceholderText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 19.5,
    color: colors.textSecondary,
  },
  changePill: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  changePillText: {
    ...typography.tiny,
    color: colors.white,
  },
  card: {
    backgroundColor: colors.white,
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  infoRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 19.5,
    color: colors.textSecondary,
    width: 120,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    flex: 1,
  },
  buttonWrapper: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
});
