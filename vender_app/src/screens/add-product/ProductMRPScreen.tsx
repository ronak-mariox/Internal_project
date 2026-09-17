import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { AddProductHeader, Button, FormSectionCard, InfoBanner, ScreenContainer } from '../../components';
import { useProductDraft } from '../../context/ProductDraftContext';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProductMRP'>;

export function ProductMRPScreen({ navigation }: Props) {
  const { draft, updatePricing } = useProductDraft();
  const [mrp, setMrp] = useState(draft.pricing?.mrp ?? '');
  const [gstInclusive, setGstInclusive] = useState(draft.pricing?.mrpGstInclusive ?? true);
  const [error, setError] = useState<string | undefined>();

  function handleContinue() {
    if (!mrp.trim() || parseFloat(mrp) <= 0) {
      setError('Enter a valid MRP');
      return;
    }
    updatePricing({
      mrp: mrp.trim(),
      mrpGstInclusive: gstInclusive,
      sellingPrice: draft.pricing?.sellingPrice ?? '',
    });
    navigation.navigate('ProductSellingPrice');
  }

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AddProductHeader
        title="Maximum Retail Price"
        currentStep={6}
        onBack={() => navigation.goBack()}
        onSaveDraft={() => navigation.navigate('ProductCatalog')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <FormSectionCard>
          <View>
            <View style={styles.labelRow}>
              <Text style={styles.label}>MRP (₹)</Text>
              <Text style={styles.required}> *</Text>
            </View>
            <View style={[styles.amountField, error && styles.amountFieldError]}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                value={mrp}
                onChangeText={text => {
                  setMrp(text.replace(/[^0-9.]/g, ''));
                  if (error) setError(undefined);
                }}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
                style={styles.amountInput}
              />
            </View>
            <Text style={error ? styles.errorText : styles.helperText}>
              {error ?? 'MRP as printed on product packaging. Cannot exceed this for selling price.'}
            </Text>
          </View>

          <InfoBanner
            variant="warning"
            message="MRP is the maximum price you can legally charge customers. Selling above MRP is prohibited."
          />
        </FormSectionCard>

        <FormSectionCard title="MRP Includes">
          <View style={styles.gstRow}>
            <Pressable
              style={[styles.gstOption, gstInclusive && styles.gstOptionActive]}
              onPress={() => setGstInclusive(true)}
            >
              <View style={[styles.radioOuter, gstInclusive && styles.radioOuterActive]}>
                {gstInclusive ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={[styles.gstOptionText, gstInclusive && styles.gstOptionTextActive]}>
                GST Inclusive (MRP includes tax)
              </Text>
            </Pressable>
            <Pressable
              style={[styles.gstOption, !gstInclusive && styles.gstOptionActive]}
              onPress={() => setGstInclusive(false)}
            >
              <View style={[styles.radioOuter, !gstInclusive && styles.radioOuterActive]}>
                {!gstInclusive ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={[styles.gstOptionText, !gstInclusive && styles.gstOptionTextActive]}>
                GST Exclusive (MRP before tax)
              </Text>
            </Pressable>
          </View>
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
  labelRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
  },
  required: {
    ...typography.label,
    color: colors.error,
  },
  amountField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  amountFieldError: {
    borderColor: colors.error,
  },
  currencySymbol: {
    ...typography.h2,
    fontSize: 22,
    color: colors.textSecondary,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontFamily: fontFamilies.extrabold,
    color: colors.textPrimary,
    padding: 0,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.sm,
  },
  gstRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  gstOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  gstOptionActive: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 9999,
    backgroundColor: colors.white,
  },
  gstOptionText: {
    ...typography.tiny,
    color: colors.textSecondary,
    flex: 1,
  },
  gstOptionTextActive: {
    color: colors.primaryDark,
    fontFamily: fontFamilies.semibold,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
