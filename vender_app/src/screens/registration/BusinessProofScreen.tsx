import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import {
  Badge,
  Button,
  FileCard,
  FormSectionCard,
  Input,
  NavHeader,
  ProgressSteps,
  ScreenContainer,
  SelectField,
  UploadDropzone,
} from '../../components';
import { useRegistration, type BusinessProofData } from '../../context/RegistrationContext';
import { api, getApiErrorMessage } from '../../services/api';
import { pickAndUploadDocument } from '../../services/upload';
import { filenameFromUrl } from '../../utils/format';
import { colors, fontFamilies, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'BusinessProof'>;

const DOCUMENT_TYPES = [
  'Trade License',
  'Shop & Establishment Certificate',
  'MSME / Udyam Registration',
  'GST Registration Certificate',
  'Certificate of Incorporation',
];

export function BusinessProofScreen({ navigation }: Props) {
  const { data, updateBusinessProof } = useRegistration();
  const [form, setForm] = useState<BusinessProofData>(
    data.businessProof ?? {
      documentType: 'Trade License',
      documentNumber: '',
      issueDate: '',
      expiryDate: '',
      frontUrl: '',
      backUrl: '',
    },
  );
  const [error, setError] = useState<string | undefined>();
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof BusinessProofData>(key: K, value: BusinessProofData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleUploadFront() {
    setUploadingFront(true);
    try {
      const result = await pickAndUploadDocument();
      if (result) set('frontUrl', result.url);
    } catch (err) {
      Alert.alert('Upload failed', getApiErrorMessage(err, 'Could not upload the front side.'));
    } finally {
      setUploadingFront(false);
    }
  }

  async function handleUploadBack() {
    setUploadingBack(true);
    try {
      const result = await pickAndUploadDocument();
      if (result) set('backUrl', result.url);
    } catch (err) {
      Alert.alert('Upload failed', getApiErrorMessage(err, 'Could not upload the back side.'));
    } finally {
      setUploadingBack(false);
    }
  }

  async function handleContinue() {
    if (!form.documentType || !form.documentNumber || !form.issueDate || !form.frontUrl) {
      setError('Please complete the document details and upload the front side');
      return;
    }
    setError(undefined);
    setSaving(true);
    try {
      await api.patch('/vendor/registration/business-proof', {
        documentType: form.documentType,
        documentNumber: form.documentNumber,
        issueDate: form.issueDate,
        expiryDate: form.expiryDate,
        frontUrl: form.frontUrl,
        backUrl: form.backUrl,
      });
      updateBusinessProof(form);
      navigation.navigate('BankDetails');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not save your business proof. Please try again.'));
    } finally {
      setSaving(false);
    }
  }

  const sidesUploaded = (form.frontUrl ? 1 : 0) + (form.backUrl ? 1 : 0);

  return (
    <ScreenContainer backgroundColor={colors.surface} scrollable>
      <NavHeader title="Business Registration" onBack={() => navigation.goBack()} />
      <ProgressSteps currentStep={6} totalSteps={8} label="Business Proof" />
      <View style={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Business Proof</Text>
          <Text style={styles.subtitle}>Upload a valid proof of your business existence</Text>
        </View>

        <FormSectionCard title="Document Details">
          <SelectField
            label="Document Type"
            required
            value={form.documentType}
            options={DOCUMENT_TYPES}
            onChange={value => set('documentType', value)}
          />
          <Input
            label="Document Number"
            required
            leftIcon="hash"
            value={form.documentNumber}
            onChangeText={text => set('documentNumber', text)}
            placeholder="TL/MUM/2023/78945"
          />
          <View>
            <Text style={styles.label}>
              Issue Date <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Input
                  leftIcon="calendar"
                  value={form.issueDate}
                  onChangeText={text => set('issueDate', text)}
                  placeholder="2023-01-01"
                />
              </View>
              <View style={styles.dateItem}>
                <Input
                  leftIcon="calendar"
                  value={form.expiryDate}
                  onChangeText={text => set('expiryDate', text)}
                  placeholder="2025-12-31"
                />
              </View>
            </View>
            <Text style={styles.helperText}>Issue Date — Expiry Date (format: YYYY-MM-DD)</Text>
          </View>
        </FormSectionCard>

        <FormSectionCard>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Document Upload</Text>
            <Badge label={`${sidesUploaded} of 2 sides`} />
          </View>
          {form.frontUrl ? (
            <FileCard
              fileName={filenameFromUrl(form.frontUrl)}
              onReplace={handleUploadFront}
              onDelete={() => set('frontUrl', '')}
            />
          ) : (
            <Button
              label="Upload Front Side"
              variant="outline"
              loading={uploadingFront}
              onPress={handleUploadFront}
            />
          )}
          {form.backUrl ? (
            <FileCard
              fileName={filenameFromUrl(form.backUrl)}
              onReplace={handleUploadBack}
              onDelete={() => set('backUrl', '')}
            />
          ) : (
            <UploadDropzone
              label={uploadingBack ? 'Uploading…' : 'Upload back side (optional)'}
              onPress={handleUploadBack}
            />
          )}
          <Text style={styles.requirementsText}>
            Accepted: JPG, PNG, PDF • Max size: 5MB per file
          </Text>
        </FormSectionCard>

        <FormSectionCard title="Accepted Documents">
          {DOCUMENT_TYPES.map(type => (
            <View key={type} style={styles.bulletRow}>
              <View style={styles.bulletDot} />
              <Text style={styles.bulletText}>{type}</Text>
            </View>
          ))}
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
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  dateRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  dateItem: {
    flex: 1,
  },
  helperText: {
    ...typography.tiny,
    color: colors.textSecondary,
    paddingTop: spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.72,
  },
  requirementsText: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 9999,
    backgroundColor: colors.primary,
  },
  bulletText: {
    ...typography.label,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
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
