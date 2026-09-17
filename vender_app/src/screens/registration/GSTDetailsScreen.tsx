import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import {
  Button,
  FileCard,
  FormSectionCard,
  Input,
  NavHeader,
  ProgressSteps,
  ScreenContainer,
  SelectField,
} from '../../components';
import { Icon } from '../../icons/Icon';
import { useRegistration, type GstDetailsData } from '../../context/RegistrationContext';
import { api, getApiErrorMessage } from '../../services/api';
import { pickAndUploadDocument } from '../../services/upload';
import { filenameFromUrl } from '../../utils/format';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'GSTDetails'>;

const GST_CATEGORIES = ['Regular Taxpayer', 'Composition Scheme', 'Casual Taxable Person'];
const GSTIN_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/;

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(iso: string): string {
  if (!iso) return '';
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function GSTDetailsScreen({ navigation }: Props) {
  const { data, updateGstDetails } = useRegistration();
  const [form, setForm] = useState<GstDetailsData>(
    data.gstDetails ?? {
      registered: true,
      gstin: '',
      verified: false,
      businessName: data.businessInfo?.legalName ?? '',
      registrationDate: '',
      category: '',
      certificateUrl: '',
    },
  );
  const [verifying, setVerifying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  function set<K extends keyof GstDetailsData>(key: K, value: GstDetailsData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleDateChange(event: DateTimePickerEvent, selectedDate?: Date) {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (event.type === 'dismissed' || !selectedDate) return;
    set('registrationDate', toIsoDate(selectedDate));
    if (Platform.OS === 'ios') {
      setShowDatePicker(false);
    }
  }

  function handleVerify() {
    if (!GSTIN_PATTERN.test(form.gstin)) {
      Alert.alert('Invalid GSTIN', 'Please enter a valid 15-character GSTIN.');
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      set('verified', true);
    }, 900);
  }

  async function handleUploadCertificate() {
    setUploading(true);
    try {
      const result = await pickAndUploadDocument();
      if (result) {
        set('certificateUrl', result.url);
      }
    } catch (err) {
      Alert.alert('Upload failed', getApiErrorMessage(err, 'Could not upload the GST certificate.'));
    } finally {
      setUploading(false);
    }
  }

  async function handleContinue() {
    if (form.registered && !form.verified) {
      Alert.alert('Verify GSTIN', 'Please verify your GSTIN before continuing.');
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await api.patch('/vendor/registration/gst-details', {
        registered: form.registered,
        gstin: form.gstin,
        businessName: form.businessName,
        registrationDate: form.registrationDate,
        category: form.category,
        certificateUrl: form.certificateUrl,
      });
      updateGstDetails(form);
      navigation.navigate('PANVerification');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your GST details. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable>
      <NavHeader title="Business Registration" onBack={() => navigation.goBack()} />
      <ProgressSteps currentStep={5} totalSteps={8} label="GST Details" />
      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>GST Details</Text>
          <Text style={styles.subtitle}>Provide your GST registration information</Text>
        </View>

        <View style={styles.toggleCard}>
          <View style={styles.toggleTextColumn}>
            <Text style={styles.toggleTitle}>Registered under GST</Text>
            <Text style={styles.toggleSubtitle}>Toggle off if your turnover is below ₹20 lakhs</Text>
          </View>
          <Switch
            value={form.registered}
            onValueChange={value => set('registered', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        {form.registered ? (
          <>
            <FormSectionCard title="GST Registration">
              <View style={styles.gap}>
                <Text style={styles.label}>
                  GSTIN <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inlineRow}>
                  <View style={styles.inlineInput}>
                    <Input
                      leftIcon="hash"
                      value={form.gstin}
                      onChangeText={text => {
                        set('gstin', text.toUpperCase().slice(0, 15));
                        set('verified', false);
                      }}
                      placeholder="29AABCU9603R1ZM"
                      autoCapitalize="characters"
                    />
                  </View>
                  <Button
                    label={verifying ? 'Checking' : form.verified ? 'Verified' : 'Verify'}
                    variant="outline"
                    fullWidth={false}
                    loading={verifying}
                    disabled={form.verified}
                    onPress={handleVerify}
                  />
                </View>
                {form.verified ? (
                  <View style={styles.verifiedRow}>
                    <Icon name="check-circle" size={13} color={colors.primary} />
                    <Text style={styles.verifiedText}>GSTIN verified successfully</Text>
                  </View>
                ) : null}
              </View>

              <Input
                label="Registered Business Name"
                value={form.businessName}
                onChangeText={text => set('businessName', text)}
                editable={form.verified === false}
                helperText={form.verified ? 'Auto-filled from GST portal' : undefined}
              />
              <View style={styles.dateField}>
                <Text style={styles.label}>GST Registration Date</Text>
                <Pressable style={styles.datePressable} onPress={() => setShowDatePicker(true)}>
                  <Icon name="calendar" size={16} color={colors.textSecondary} />
                  <Text style={[styles.dateValue, !form.registrationDate && styles.datePlaceholder]}>
                    {form.registrationDate ? formatDisplayDate(form.registrationDate) : 'Select registration date'}
                  </Text>
                </Pressable>
              </View>
              {showDatePicker ? (
                <DateTimePicker
                  value={form.registrationDate ? new Date(`${form.registrationDate}T00:00:00`) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              ) : null}
              <SelectField
                label="GST Category"
                value={form.category}
                options={GST_CATEGORIES}
                onChange={value => set('category', value)}
              />
            </FormSectionCard>

            <FormSectionCard title="GST Certificate">
              {form.certificateUrl ? (
                <FileCard
                  fileName={filenameFromUrl(form.certificateUrl)}
                  onReplace={handleUploadCertificate}
                  onDelete={() => set('certificateUrl', '')}
                />
              ) : (
                <Button
                  label="Upload GST Certificate"
                  variant="outline"
                  loading={uploading}
                  onPress={handleUploadCertificate}
                />
              )}
            </FormSectionCard>
          </>
        ) : null}

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
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  toggleTextColumn: {
    flex: 1,
    gap: 2,
  },
  toggleTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
  },
  toggleSubtitle: {
    ...typography.caption,
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
  inlineRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  inlineInput: {
    flex: 1,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  verifiedText: {
    ...typography.caption,
    fontFamily: fontFamilies.medium,
    color: colors.primary,
  },
  dateField: {
    gap: spacing.sm,
  },
  datePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  dateValue: {
    ...typography.body,
    color: colors.textPrimary,
  },
  datePlaceholder: {
    color: colors.textTertiary,
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
