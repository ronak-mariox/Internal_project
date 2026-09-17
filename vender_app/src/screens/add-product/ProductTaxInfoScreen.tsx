import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { AddProductHeader, Button, FormSectionCard, Input, ScreenContainer, SelectField } from '../../components';
import { Icon } from '../../icons/Icon';
import { COMMON_GST_RATES, GST_RATES } from '../../data/categories';
import { useProductDraft } from '../../context/ProductDraftContext';
import { colors, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProductTaxInfo'>;

export function ProductTaxInfoScreen({ navigation }: Props) {
  const { draft, updateTax } = useProductDraft();
  const initialLabel = GST_RATES.find(item => item.value === draft.tax?.gstRate)?.label ?? '';
  const [gstLabel, setGstLabel] = useState(initialLabel);
  const [hsnCode, setHsnCode] = useState(draft.tax?.hsnCode ?? '');
  const [error, setError] = useState<Record<string, string>>({});

  function handleContinue() {
    const nextErrors: Record<string, string> = {};
    if (!gstLabel) nextErrors.gst = 'Select a GST rate';
    if (!hsnCode.trim()) nextErrors.hsn = 'Enter the HSN code';
    setError(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const gstRate = GST_RATES.find(item => item.label === gstLabel)?.value ?? '';
    updateTax({ gstRate, hsnCode: hsnCode.trim() });
    navigation.navigate('ProductSKU');
  }

  const hsnVerified = hsnCode.trim().length >= 4;

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AddProductHeader
        title="Tax Information"
        currentStep={7}
        onBack={() => navigation.goBack()}
        onSaveDraft={() => navigation.navigate('ProductCatalog')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <FormSectionCard>
          <SelectField
            label="GST Rate"
            required
            value={gstLabel}
            options={GST_RATES.map(item => item.label)}
            onChange={setGstLabel}
            placeholder="Select GST rate"
          />
          {error.gst ? <Text style={styles.errorText}>{error.gst}</Text> : null}

          <Input
            label="HSN Code"
            required
            value={hsnCode}
            onChangeText={setHsnCode}
            placeholder="e.g. 2501"
            leftIcon="hash"
            keyboardType="number-pad"
            error={error.hsn}
            helperText={error.hsn ? undefined : 'Harmonized System of Nomenclature code'}
          />

          {hsnVerified ? (
            <View style={styles.verifiedBanner}>
              <Icon name="check-circle" size={14} color={colors.primaryDark} />
              <Text style={styles.verifiedText}>HSN {hsnCode.trim()} looks valid</Text>
            </View>
          ) : null}
        </FormSectionCard>

        <FormSectionCard title="Common GST Rates">
          {COMMON_GST_RATES.map((item, index) => (
            <View
              key={item.rate}
              style={[styles.rateRow, index === COMMON_GST_RATES.length - 1 && styles.rateRowLast]}
            >
              <View style={[styles.rateChip, item.rate === '0%' && styles.rateChipActive]}>
                <Text style={[styles.rateChipText, item.rate === '0%' && styles.rateChipTextActive]}>
                  {item.rate}
                </Text>
              </View>
              <Text style={styles.rateDescription}>{item.description}</Text>
            </View>
          ))}
        </FormSectionCard>

        <View style={styles.footer}>
          <Button label="Continue" onPress={handleContinue} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: -spacing.sm,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primarySurface,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  verifiedText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rateRowLast: {
    borderBottomWidth: 0,
  },
  rateChip: {
    minWidth: 36,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  rateChipActive: {
    backgroundColor: colors.primarySurface,
  },
  rateChipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  rateChipTextActive: {
    color: colors.primary,
  },
  rateDescription: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
