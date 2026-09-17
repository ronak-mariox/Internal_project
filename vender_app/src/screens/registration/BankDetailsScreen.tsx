import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button, FormSectionCard, Input, InfoBanner, NavHeader, ProgressSteps, ScreenContainer, SelectField } from '../../components';
import { Icon } from '../../icons/Icon';
import { useRegistration, type BankDetailsData } from '../../context/RegistrationContext';
import { api, getApiErrorMessage } from '../../services/api';
import { colors, fontFamilies, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'BankDetails'>;

const ACCOUNT_TYPES = ['Current Account', 'Savings Account'];

export function BankDetailsScreen({ navigation }: Props) {
  const { data, updateBankDetails } = useRegistration();
  const [form, setForm] = useState<BankDetailsData>(
    data.bankDetails ?? {
      accountHolderName: data.ownerInfo?.fullName?.toUpperCase() ?? '',
      accountNumber: '',
      ifsc: '',
      bankName: '',
      branch: '',
      accountType: 'Current Account',
      verified: false,
    },
  );
  const [confirmAccountNumber, setConfirmAccountNumber] = useState(form.accountNumber);
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  function set<K extends keyof BankDetailsData>(key: K, value: BankDetailsData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const numbersMatch = form.accountNumber.length > 0 && form.accountNumber === confirmAccountNumber;

  async function handleSave() {
    if (!form.accountHolderName || !form.accountNumber || !form.ifsc || !form.bankName || !form.branch) {
      setError('Please fill in all required fields');
      return;
    }
    if (!numbersMatch) {
      setError('Account numbers do not match');
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await api.patch('/vendor/registration/bank-details', {
        accountHolderName: form.accountHolderName,
        accountNumber: form.accountNumber,
        confirmAccountNumber,
        ifsc: form.ifsc,
        bankName: form.bankName,
        branch: form.branch,
        accountType: form.accountType,
      });
      updateBankDetails({ ...form, verified: true });
      navigation.navigate('KYCReview');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your bank details. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable>
      <NavHeader title="Business Registration" onBack={() => navigation.goBack()} />
      <ProgressSteps currentStep={7} totalSteps={8} label="Bank Details" />
      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Bank Details</Text>
          <Text style={styles.subtitle}>Your settlement account for receiving payments</Text>
        </View>

        <FormSectionCard title="Account Details">
          <Input
            label="Account Holder Name"
            required
            leftIcon="user"
            value={form.accountHolderName}
            onChangeText={text => set('accountHolderName', text.toUpperCase())}
            autoCapitalize="characters"
            helperText="Must match business owner name"
          />
          <Input
            label="Account Number"
            required
            leftIcon="credit-card"
            value={form.accountNumber}
            onChangeText={text => set('accountNumber', text.replace(/[^0-9]/g, ''))}
            placeholder="Enter account number"
            keyboardType="number-pad"
          />
          <View>
            <Input
              label="Confirm Account Number"
              required
              leftIcon="credit-card"
              value={confirmAccountNumber}
              onChangeText={setConfirmAccountNumber}
              placeholder="Re-enter account number"
              keyboardType="number-pad"
            />
            {confirmAccountNumber.length > 0 ? (
              <View style={styles.matchRow}>
                <Icon
                  name={numbersMatch ? 'check' : 'x-circle'}
                  size={12}
                  color={numbersMatch ? colors.primary : colors.error}
                  strokeWidth={3}
                />
                <Text style={[styles.matchText, { color: numbersMatch ? colors.primary : colors.error }]}>
                  {numbersMatch ? 'Account numbers match' : 'Account numbers do not match'}
                </Text>
              </View>
            ) : null}
          </View>

          <View style={styles.gap}>
            <Text style={styles.label}>
              IFSC Code <Text style={styles.required}>*</Text>
            </Text>
            <Input
              value={form.ifsc}
              onChangeText={text => set('ifsc', text.toUpperCase().slice(0, 11))}
              placeholder="HDFC0001234"
              autoCapitalize="characters"
              helperText="11-character code, e.g. HDFC0001234"
            />
          </View>

          <Input
            label="Bank Name"
            required
            leftIcon="home"
            value={form.bankName}
            onChangeText={text => set('bankName', text)}
            placeholder="e.g. HDFC Bank"
          />
          <Input
            label="Branch"
            required
            leftIcon="pin"
            value={form.branch}
            onChangeText={text => set('branch', text)}
            placeholder="e.g. Dadar West, Mumbai"
          />

          <SelectField
            label="Account Type"
            value={form.accountType}
            options={ACCOUNT_TYPES}
            onChange={value => set('accountType', value)}
          />
        </FormSectionCard>

        <InfoBanner
          variant="warning"
          message="Ensure the bank account is in the name of the registered business owner. Settlement will fail if names don't match."
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.buttonRow}>
          <View style={styles.buttonRowItem}>
            <Button label="Cancel" variant="outline" onPress={() => navigation.goBack()} />
          </View>
          <View style={styles.buttonRowItem}>
            <Button label="Save" onPress={handleSave} loading={saving} />
          </View>
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
  gap: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: spacing.xs,
  },
  matchText: {
    ...typography.caption,
    fontFamily: fontFamilies.medium,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  buttonRowItem: {
    flex: 1,
  },
});
