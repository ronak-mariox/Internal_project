import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button, InfoBanner, NavHeader, ProgressSteps, ScreenContainer } from '../../components';
import { Icon, IconName } from '../../icons/Icon';
import { useStoreSetup, type StoreStatusValue } from '../../context/StoreSetupContext';
import { api, getApiErrorMessage } from '../../services/api';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'StoreStatus'>;

const OPTIONS: { value: StoreStatusValue; icon: IconName; title: string; subtitle: string }[] = [
  { value: 'open', icon: 'sun', title: 'Open', subtitle: 'Accepting orders normally' },
  { value: 'closed', icon: 'moon', title: 'Closed', subtitle: 'Not accepting any orders' },
  {
    value: 'temporarily-closed',
    icon: 'pause-circle',
    title: 'Temporarily Closed',
    subtitle: 'Paused for a set duration',
  },
];

export function StoreStatusScreen({ navigation }: Props) {
  const { data, setStoreStatus } = useStoreSetup();
  const [selected, setSelected] = useState<StoreStatusValue>(data.storeStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();

  function handleSelect(value: StoreStatusValue) {
    setSelected(value);
    if (value === 'temporarily-closed') {
      navigation.navigate('TempClosure');
    }
  }

  async function handleContinue() {
    if (selected === 'temporarily-closed') {
      // Already saved via ClosureConfirmationScreen -> PATCH /temp-closure.
      navigation.navigate('StoreSetupComplete');
      return;
    }
    setSaving(true);
    setError(undefined);
    try {
      await api.patch('/vendor/store-setup/status', { storeStatus: selected });
      setStoreStatus(selected);
      navigation.navigate('StoreSetupComplete');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable>
      <NavHeader title="Store Setup" onBack={() => navigation.goBack()} />
      <ProgressSteps currentStep={7} totalSteps={7} label="Store Status" />
      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Store Status</Text>
          <Text style={styles.subtitle}>Control when customers can place orders at your store</Text>
        </View>

        <View style={styles.optionsList}>
          {OPTIONS.map(option => {
            const isSelected = selected === option.value;
            return (
              <Pressable
                key={option.value}
                style={[styles.option, isSelected && styles.optionSelected]}
                onPress={() => handleSelect(option.value)}
              >
                <View style={[styles.optionIcon, isSelected && styles.optionIconSelected]}>
                  <Icon name={option.icon} size={24} color={isSelected ? colors.primary : colors.textSecondary} />
                </View>
                <View style={styles.optionTextColumn}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected ? <Icon name="check" size={14} color={colors.white} strokeWidth={3} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.scheduleCard}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <View style={styles.scheduleRow}>
            <View style={styles.scheduleDot} />
            <View>
              <Text style={styles.scheduleTitle}>Open today: 9:00 AM – 9:00 PM</Text>
              <Text style={styles.scheduleSubtitle}>Next: Closed Sunday</Text>
            </View>
          </View>
        </View>

        <InfoBanner
          variant="success"
          message="Status changes based on your schedule. You can override it manually anytime from the Dashboard."
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.footer}>
          <Button label="Save & Continue" onPress={handleContinue} loading={saving} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    gap: spacing.xl,
  },
  headingBlock: {
    gap: spacing.xxs,
  },
  heading: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.label,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  optionsList: {
    gap: spacing.lg,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionSelected: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primaryBorder,
  },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconSelected: {
    backgroundColor: 'rgba(28,166,114,0.13)',
  },
  optionTextColumn: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    ...typography.bodyLarge,
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  optionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  scheduleCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.72,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  scheduleDot: {
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  scheduleTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
  },
  scheduleSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
});
