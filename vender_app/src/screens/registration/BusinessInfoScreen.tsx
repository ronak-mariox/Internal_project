import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import {
  Button,
  FormSectionCard,
  Input,
  NavHeader,
  ProgressSteps,
  ScreenContainer,
  SelectField,
} from '../../components';
import { useRegistration, type BusinessInfoData } from '../../context/RegistrationContext';
import { api, getApiErrorMessage } from '../../services/api';
import { colors, fontFamilies, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'BusinessInfo'>;

const CATEGORIES = ['Grocery & Essentials', 'Electronics', 'Fashion', 'Health & Beauty', 'Home & Kitchen'];
const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh'];

export function BusinessInfoScreen({ navigation }: Props) {
  const { data, updateBusinessInfo } = useRegistration();
  const [form, setForm] = useState<BusinessInfoData>(
    data.businessInfo ?? {
      legalName: '',
      displayName: '',
      category: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
    },
  );
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  function set<K extends keyof BusinessInfoData>(key: K, value: BusinessInfoData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleContinue() {
    if (!form.legalName || !form.displayName || !form.category || !form.addressLine1 || !form.city || !form.state) {
      setError('Please fill in all required fields');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Invalid pincode. Please check and re-enter.');
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await api.patch('/vendor/registration/business-info', { ...form, country: 'India' });
      updateBusinessInfo(form);
      navigation.navigate('OwnerInfo');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your business information. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable>
      <NavHeader title="Business Registration" onBack={() => navigation.goBack()} />
      <ProgressSteps currentStep={2} totalSteps={8} label="Business Information" />
      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Business Information</Text>
          <Text style={styles.subtitle}>Enter your official business details as per registration</Text>
        </View>

        <FormSectionCard title="Business Details">
          <Input
            label="Legal Business Name"
            required
            value={form.legalName}
            onChangeText={text => set('legalName', text)}
            placeholder="Sharma Enterprises"
            helperText="As registered with MCA / government"
          />
          <Input
            label="Display Store Name"
            required
            value={form.displayName}
            onChangeText={text => set('displayName', text)}
            placeholder="Sharma Kirana"
            helperText="Name shown to customers"
          />
          <SelectField
            label="Business Category"
            required
            value={form.category}
            options={CATEGORIES}
            onChange={value => set('category', value)}
          />
        </FormSectionCard>

        <FormSectionCard title="Business Address">
          <Input
            label="Address Line 1"
            required
            value={form.addressLine1}
            onChangeText={text => set('addressLine1', text)}
            placeholder="Plot 42, MG Road"
          />
          <Input
            label="Address Line 2"
            value={form.addressLine2}
            onChangeText={text => set('addressLine2', text)}
            placeholder="Landmark, area (optional)"
          />
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Input
                label="City"
                required
                value={form.city}
                onChangeText={text => set('city', text)}
                placeholder="Mumbai"
              />
            </View>
            <View style={styles.rowItem}>
              <SelectField
                label="State"
                required
                value={form.state}
                options={STATES}
                onChange={value => set('state', value)}
              />
            </View>
          </View>
          <Input
            label="Pincode"
            required
            value={form.pincode}
            onChangeText={text => set('pincode', text.replace(/[^0-9]/g, '').slice(0, 6))}
            placeholder="400001"
            keyboardType="number-pad"
            error={error && !/^\d{6}$/.test(form.pincode) ? error : undefined}
          />
          <Input label="Country" value="India" onChangeText={() => undefined} editable={false} />
        </FormSectionCard>

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
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  rowItem: {
    flex: 1,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  footer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});
