import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button, FormSectionCard, Input, NavHeader, ProgressSteps, ScreenContainer, SelectField } from '../../components';
import { Icon } from '../../icons/Icon';
import { useRegistration, type StoreInfoData } from '../../context/RegistrationContext';
import { api, getApiErrorMessage } from '../../services/api';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'StoreInfo'>;

const STORE_TYPES = ['Retail Store', 'Warehouse / Dark Store', 'Home Kitchen', 'Kiosk', 'Online Only'];
const OPERATING_HOURS = ['9:00 AM – 9:00 PM', '24 Hours', '8:00 AM – 8:00 PM', '10:00 AM – 10:00 PM'];

const DEFAULT_LOCATION: StoreInfoData['location'] = {
  address: 'Plot 42, MG Road',
  cityState: 'Dadar West, Mumbai, Maharashtra 400028',
  latitude: 19.0176,
  longitude: 72.8459,
};

export function StoreInfoScreen({ navigation }: Props) {
  const { data, updateStoreInfo } = useRegistration();
  const [form, setForm] = useState<StoreInfoData>(
    data.storeInfo ?? {
      storeName: data.businessInfo?.displayName ?? '',
      storeAddress: data.businessInfo?.addressLine1 ?? '',
      landmark: '',
      contactNumber: '',
      storeType: '',
      operatingHours: '',
      location: DEFAULT_LOCATION,
    },
  );
  const [error, setError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  function set<K extends keyof StoreInfoData>(key: K, value: StoreInfoData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleContinue() {
    if (!form.storeName || !form.storeAddress || !form.contactNumber || !form.storeType) {
      setError('Please fill in all required fields');
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await api.patch('/vendor/registration/store-info', form);
      updateStoreInfo(form);
      navigation.navigate('GSTDetails');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your store information. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  function handleChangeLocation() {
    navigation.navigate('StoreLocation');
  }

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable>
      <NavHeader title="Business Registration" onBack={() => navigation.goBack()} />
      <ProgressSteps currentStep={4} totalSteps={8} label="Store Information" />
      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Store Information</Text>
          <Text style={styles.subtitle}>Details about your physical or online store</Text>
        </View>

        <FormSectionCard title="Store Details">
          <Input
            label="Store Name"
            required
            leftIcon="home"
            value={form.storeName}
            onChangeText={text => set('storeName', text)}
            placeholder="Sharma Kirana Store"
          />
          <Input
            label="Store Address"
            required
            value={form.storeAddress}
            onChangeText={text => set('storeAddress', text)}
            placeholder="Plot 42, MG Road, Dadar West"
          />
          <Input
            label="Landmark"
            value={form.landmark}
            onChangeText={text => set('landmark', text)}
            placeholder="Near Dadar Station"
          />
          <Input
            label="Store Contact Number"
            required
            leftIcon="phone"
            value={form.contactNumber}
            onChangeText={text => set('contactNumber', text)}
            placeholder="+91 22 2654 7890"
            keyboardType="phone-pad"
          />
          <SelectField
            label="Store Type"
            required
            value={form.storeType}
            options={STORE_TYPES}
            onChange={value => set('storeType', value)}
          />
          <SelectField
            label="Operating Hours"
            value={form.operatingHours}
            options={OPERATING_HOURS}
            onChange={value => set('operatingHours', value)}
          />
        </FormSectionCard>

        <FormSectionCard title="Store Location">
          <Pressable style={styles.locationCard} onPress={handleChangeLocation}>
            <View style={styles.locationIconWrapper}>
              <Icon name="pin" size={18} color={colors.primary} />
            </View>
            <View style={styles.locationTextColumn}>
              <Text style={styles.locationAddress}>{form.location.address}</Text>
              <Text style={styles.locationCityState}>{form.location.cityState}</Text>
              <Text style={styles.locationAccuracy}>
                {form.location.latitude.toFixed(4)}° N, {form.location.longitude.toFixed(4)}° E
              </Text>
            </View>
            <Text style={styles.changeText}>Change</Text>
          </Pressable>
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.primarySurface,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    width: '100%',
  },
  locationIconWrapper: {
    paddingTop: 2,
  },
  locationTextColumn: {
    flex: 1,
    gap: 1,
  },
  locationAddress: {
    ...typography.labelSemibold,
    color: colors.textPrimary,
  },
  locationCityState: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  locationAccuracy: {
    ...typography.tiny,
    color: colors.primary,
    paddingTop: 2,
  },
  changeText: {
    ...typography.caption,
    fontFamily: fontFamilies.medium,
    color: colors.primary,
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
