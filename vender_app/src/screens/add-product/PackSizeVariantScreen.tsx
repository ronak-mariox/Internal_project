import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import {
  AddProductHeader,
  Button,
  FormSectionCard,
  Input,
  ScreenContainer,
  SelectField,
  Switch,
} from '../../components';
import { Icon } from '../../icons/Icon';
import { PACK_TYPES, WEIGHT_UNITS } from '../../data/categories';
import { ProductVariant, useProductDraft } from '../../context/ProductDraftContext';
import { colors, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'PackSizeVariant'>;

export function PackSizeVariantScreen({ navigation }: Props) {
  const { draft, updatePackSize } = useProductDraft();
  const [netWeight, setNetWeight] = useState(draft.packSize?.netWeight ?? '');
  const [unit, setUnit] = useState(draft.packSize?.unit ?? WEIGHT_UNITS[0]);
  const [packType, setPackType] = useState(draft.packSize?.packType ?? '');
  const [itemsPerPack, setItemsPerPack] = useState(draft.packSize?.itemsPerPack ?? '1');
  const [variantsEnabled, setVariantsEnabled] = useState(draft.packSize?.variantsEnabled ?? false);
  const [variants, setVariants] = useState<ProductVariant[]>(draft.packSize?.variants ?? []);
  const [error, setError] = useState<string | undefined>();

  function addVariant() {
    setVariants(prev => [
      ...prev,
      {
        id: `v${Date.now()}`,
        size: '',
        mrp: '',
        sellingPrice: '',
        stock: '',
        isPrimary: prev.length === 0,
      },
    ]);
  }

  function updateVariant(id: string, patch: Partial<ProductVariant>) {
    setVariants(prev => prev.map(variant => (variant.id === id ? { ...variant, ...patch } : variant)));
  }

  function removeVariant(id: string) {
    setVariants(prev => prev.filter(variant => variant.id !== id));
  }

  function setPrimary(id: string) {
    setVariants(prev => prev.map(variant => ({ ...variant, isPrimary: variant.id === id })));
  }

  function handleContinue() {
    if (!netWeight.trim()) {
      setError('Enter the net weight or volume');
      return;
    }
    updatePackSize({
      netWeight: netWeight.trim(),
      unit,
      packType,
      itemsPerPack: itemsPerPack.trim() || '1',
      variantsEnabled,
      variants,
    });
    navigation.navigate('ProductMRP');
  }

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AddProductHeader
        title="Pack Size & Variants"
        currentStep={5}
        onBack={() => navigation.goBack()}
        onSaveDraft={() => navigation.navigate('ProductCatalog')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <FormSectionCard title="Primary Pack Size">
          <View style={styles.row}>
            <View style={styles.weightField}>
              <Input
                label="Net Weight / Volume"
                required
                value={netWeight}
                onChangeText={text => {
                  setNetWeight(text);
                  if (error) setError(undefined);
                }}
                placeholder="500"
                keyboardType="numeric"
                error={error}
              />
            </View>
            <View style={styles.unitField}>
              <SelectField label="Unit" value={unit} options={WEIGHT_UNITS} onChange={setUnit} />
            </View>
          </View>

          <SelectField
            label="Pack Type"
            value={packType}
            options={PACK_TYPES}
            onChange={setPackType}
            placeholder="Select pack type"
          />

          <Input
            label="Items per Pack"
            value={itemsPerPack}
            onChangeText={setItemsPerPack}
            placeholder="1"
            keyboardType="numeric"
            helperText="e.g. 6 for a pack of 6 bottles"
          />
        </FormSectionCard>

        <View style={styles.card}>
          <View style={styles.variantsHeaderRow}>
            <Text style={styles.cardTitle}>Variants (Optional)</Text>
            <Switch value={variantsEnabled} onChange={setVariantsEnabled} />
          </View>
          <Text style={styles.variantsSubtitle}>Add multiple sizes/weights for the same product</Text>

          {variantsEnabled ? (
            <View style={styles.variantsList}>
              {variants.map(variant => (
                <View key={variant.id} style={[styles.variantRow, variant.isPrimary && styles.variantRowPrimary]}>
                  <Pressable
                    style={[styles.sizeChip, variant.isPrimary && styles.sizeChipPrimary]}
                    onPress={() => setPrimary(variant.id)}
                  >
                    <Text style={[styles.sizeChipText, variant.isPrimary && styles.sizeChipTextPrimary]}>
                      {variant.size || `${netWeight || '—'}`}
                    </Text>
                  </Pressable>
                  <View style={styles.variantInputsColumn}>
                    <View style={styles.variantInputsRow}>
                      <VariantMiniInput
                        placeholder="Size"
                        value={variant.size}
                        onChangeText={text => updateVariant(variant.id, { size: text })}
                      />
                      <VariantMiniInput
                        placeholder="MRP"
                        value={variant.mrp}
                        onChangeText={text => updateVariant(variant.id, { mrp: text })}
                        keyboardType="numeric"
                      />
                      <VariantMiniInput
                        placeholder="SP"
                        value={variant.sellingPrice}
                        onChangeText={text => updateVariant(variant.id, { sellingPrice: text })}
                        keyboardType="numeric"
                      />
                      <VariantMiniInput
                        placeholder="Stock"
                        value={variant.stock}
                        onChangeText={text => updateVariant(variant.id, { stock: text })}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                  {variant.isPrimary ? <Text style={styles.primaryLabel}>Primary</Text> : null}
                  <Pressable onPress={() => removeVariant(variant.id)} hitSlop={8}>
                    <Icon name="trash" size={14} color={colors.error} />
                  </Pressable>
                </View>
              ))}
              <Pressable style={styles.addVariantButton} onPress={addVariant}>
                <Icon name="plus" size={14} color={colors.textSecondary} />
                <Text style={styles.addVariantText}>Add another size</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={styles.footer}>
          <Button label="Continue" onPress={handleContinue} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function VariantMiniInput({
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  return (
    <View style={styles.miniInputWrapper}>
      <Input value={value} onChangeText={onChangeText} placeholder={placeholder} keyboardType={keyboardType} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  weightField: {
    flex: 1,
  },
  unitField: {
    width: 132,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.72,
  },
  variantsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  variantsSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  variantsList: {
    gap: spacing.md,
  },
  variantRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.lg,
  },
  variantRowPrimary: {
    borderColor: colors.primary,
  },
  sizeChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  sizeChipPrimary: {
    backgroundColor: colors.primarySurface,
    borderColor: colors.primary,
  },
  sizeChipText: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  sizeChipTextPrimary: {
    color: colors.primary,
  },
  variantInputsColumn: {
    flex: 1,
  },
  variantInputsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  miniInputWrapper: {
    width: 76,
  },
  primaryLabel: {
    ...typography.tinyBold,
    color: colors.primary,
  },
  addVariantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
  },
  addVariantText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
});
