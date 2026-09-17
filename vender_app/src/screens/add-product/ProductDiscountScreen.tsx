import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { AddProductHeader, Button, FormSectionCard, ScreenContainer, Switch } from '../../components';
import { DiscountMode, useProductDraft } from '../../context/ProductDraftContext';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProductDiscount'>;

export function ProductDiscountScreen({ navigation }: Props) {
  const { draft, updateDiscount, computedDiscountPercent } = useProductDraft();
  const mrp = parseFloat(draft.pricing?.mrp ?? '0') || 0;
  const sellingPrice = parseFloat(draft.pricing?.sellingPrice ?? '0') || 0;

  const [mode, setMode] = useState<DiscountMode>(draft.discount.mode);
  const [value, setValue] = useState(
    draft.discount.value || String(computedDiscountPercent() || 0),
  );
  const [limitedTimeOffer, setLimitedTimeOffer] = useState(draft.discount.limitedTimeOffer);

  function handleContinue() {
    updateDiscount({ mode, value: value.trim(), limitedTimeOffer });
    navigation.navigate('ProductTaxInfo');
  }

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AddProductHeader
        title="Discount"
        currentStep={6}
        onBack={() => navigation.goBack()}
        onSaveDraft={() => navigation.navigate('ProductCatalog')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <FormSectionCard>
          <View style={styles.modeRow}>
            <Pressable
              style={[styles.modeOption, mode === 'percentage' && styles.modeOptionActive]}
              onPress={() => setMode('percentage')}
            >
              <Text style={[styles.modeText, mode === 'percentage' && styles.modeTextActive]}>
                Percentage (%)
              </Text>
            </Pressable>
            <Pressable
              style={[styles.modeOption, mode === 'fixed' && styles.modeOptionActive]}
              onPress={() => setMode('fixed')}
            >
              <Text style={[styles.modeText, mode === 'fixed' && styles.modeTextActive]}>
                Fixed Amount (₹)
              </Text>
            </Pressable>
          </View>

          <View>
            <Text style={styles.label}>Discount ({mode === 'percentage' ? '%' : '₹'})</Text>
            <View style={styles.amountField}>
              <TextInput
                value={value}
                onChangeText={text => setValue(text.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                placeholderTextColor={colors.textTertiary}
                keyboardType="decimal-pad"
                style={styles.amountInput}
              />
              <Text style={styles.amountSuffix}>{mode === 'percentage' ? '%' : '₹'}</Text>
            </View>
          </View>

          <View style={styles.previewRow}>
            <Text style={styles.previewText}>
              MRP ₹{mrp || 0} → Selling ₹{sellingPrice || 0}
            </Text>
            <Text style={styles.previewBadge}>
              {mrp > 0 && mrp > sellingPrice
                ? `${(((mrp - sellingPrice) / mrp) * 100).toFixed(1)}% off`
                : '—'}
            </Text>
          </View>
        </FormSectionCard>

        <View style={styles.card}>
          <View style={styles.offerRow}>
            <View style={styles.offerTextColumn}>
              <Text style={styles.offerTitle}>Limited Time Offer</Text>
              <Text style={styles.offerSubtitle}>Add a special discount for a set period</Text>
            </View>
            <Switch value={limitedTimeOffer} onChange={setLimitedTimeOffer} />
          </View>
        </View>

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
  modeRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  modeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modeOptionActive: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  modeText: {
    ...typography.bodySemibold,
    fontFamily: fontFamilies.medium,
    color: colors.textSecondary,
  },
  modeTextActive: {
    color: colors.primary,
    fontFamily: fontFamilies.bold,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  amountField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
  },
  amountInput: {
    fontSize: 26,
    fontFamily: fontFamilies.extrabold,
    color: colors.warningDark,
    padding: 0,
    flex: 1,
  },
  amountSuffix: {
    ...typography.h2,
    fontSize: 22,
    color: colors.textSecondary,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  previewText: {
    ...typography.label,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  previewBadge: {
    ...typography.labelSemibold,
    color: colors.warningDark,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  offerTextColumn: {
    flex: 1,
    gap: 2,
  },
  offerTitle: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
  },
  offerSubtitle: {
    ...typography.tiny,
    color: colors.textSecondary,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
