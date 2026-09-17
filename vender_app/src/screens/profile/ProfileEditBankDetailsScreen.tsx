import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button, Input, NavHeader, ScreenContainer } from '../../components';
import { Icon } from '../../icons/Icon';
import { useProfile } from '../../context/ProfileContext';
import { colors, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileEditBankDetails'>;

export function ProfileEditBankDetailsScreen({ navigation }: Props) {
  const { bankDetails, updateBankDetails } = useProfile();

  const [accountHolderName, setAccountHolderName] = useState(bankDetails.accountHolderName);
  const [bankName, setBankName] = useState(bankDetails.bankName);
  const [ifsc, setIfsc] = useState(bankDetails.ifsc);
  // Account number is left blank rather than pre-filled with the masked value —
  // matches Figma's blank "Enter/Re-enter account number" fields and avoids
  // silently re-saving an already-masked number.
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    if (isSaving) return;
    if (!accountHolderName.trim() || !bankName.trim() || !accountNumber.trim() || ifsc.length !== 11) {
      setError('Please fill in all required fields');
      return;
    }
    if (accountNumber !== confirmAccountNumber) {
      setError('Account numbers do not match');
      return;
    }
    if (!confirmed) {
      setError('Please confirm these details are accurate');
      return;
    }
    setError(undefined);
    setIsSaving(true);
    try {
      await updateBankDetails({
        accountHolderName: accountHolderName.trim(),
        bankName: bankName.trim(),
        ifsc,
        accountNumber,
      });
      navigation.goBack();
    } catch {
      setError('Could not save bank details — please check your connection and try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScreenContainer scrollable={false} backgroundColor={colors.white}>
      <NavHeader title="Edit Bank Details" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.warningBanner}>
            <Icon name="alert-triangle" size={14} color={colors.warningDark} />
            <Text style={styles.warningText}>
              Changes require fresh verification. Settlements pause for 1–2 business days.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Account Holder Name"
              required
              value={accountHolderName}
              onChangeText={text => setAccountHolderName(text.toUpperCase())}
              autoCapitalize="characters"
            />
            <Input
              label="Account Number"
              required
              value={accountNumber}
              onChangeText={text => setAccountNumber(text.replace(/[^0-9]/g, ''))}
              placeholder="Enter account number"
              keyboardType="number-pad"
            />
            <Input
              label="Confirm Account Number"
              required
              value={confirmAccountNumber}
              onChangeText={text => setConfirmAccountNumber(text.replace(/[^0-9]/g, ''))}
              placeholder="Re-enter account number"
              keyboardType="number-pad"
            />
            <Input
              label="IFSC Code"
              required
              value={ifsc}
              onChangeText={text => setIfsc(text.toUpperCase().slice(0, 11))}
              placeholder="HDFC0001234"
              autoCapitalize="characters"
              rightElement={<Icon name="refresh-cw" size={14} color={colors.primary} />}
            />
            <Input label="Bank Name" required value={bankName} onChangeText={setBankName} />

            <Pressable style={styles.confirmRow} onPress={() => setConfirmed(v => !v)} hitSlop={8}>
              <View style={[styles.checkbox, confirmed && styles.checkboxChecked]}>
                {confirmed ? <Icon name="check" size={12} color={colors.white} strokeWidth={3} /> : null}
              </View>
              <Text style={styles.confirmText}>I confirm these details are accurate.</Text>
            </Pressable>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Save & Verify" onPress={handleSave} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.xl,
    gap: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.warningSurface,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 20.8,
    color: colors.warningDark,
    flex: 1,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  confirmText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
