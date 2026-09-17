import React from 'react';
import { Alert, ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { NavHeader, ScreenContainer } from '../../components';
import { Icon, IconName } from '../../icons/Icon';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'AddProduct'>;

const STEP_CHIPS = [
  '1. Basic Info',
  '2. Images',
  '3. Category',
  '4. Description',
  '5. Variants',
  '6. Pricing',
  '7. Tax',
  '8. Identifiers',
  '9. Stock',
  '10. Availability',
];

const METHODS: {
  key: string;
  icon: IconName;
  title: string;
  description: string;
  badge?: string;
  background: string;
  border: string;
  iconBackground: string;
}[] = [
  {
    key: 'manual',
    icon: 'edit',
    title: 'Add Manually',
    description: 'Fill in product details step by step',
    badge: 'Recommended',
    background: colors.primarySurface,
    border: colors.primary,
    iconBackground: colors.overlayLight50,
  },
  {
    key: 'scan',
    icon: 'barcode',
    title: 'Scan Barcode',
    description: 'Auto-fill details by scanning product barcode',
    background: '#EFF8FF',
    border: '#B2DDFF',
    iconBackground: colors.overlayLight50,
  },
  {
    key: 'bulk',
    icon: 'upload',
    title: 'Bulk Upload',
    description: 'Upload multiple products via Excel/CSV file',
    background: '#F5F3FF',
    border: '#C4B5FD',
    iconBackground: colors.overlayLight50,
  },
];

export function AddProductScreen({ navigation }: Props) {
  function handleMethod(key: string) {
    if (key === 'manual') {
      navigation.navigate('ProductBasicInfo');
      return;
    }
    Alert.alert('Coming soon', 'This add-product method is not available in this preview yet.');
  }

  return (
    <ScreenContainer backgroundColor={colors.white}>
      <NavHeader title="Add Product" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>How would you like to add?</Text>
          <Text style={styles.subtitle}>Choose a method to add products to your catalog</Text>
        </View>

        <View style={styles.methodList}>
          {METHODS.map(method => (
            <Pressable
              key={method.key}
              onPress={() => handleMethod(method.key)}
              style={[styles.methodCard, { backgroundColor: method.background, borderColor: method.border }]}
            >
              <View style={[styles.methodIconWrapper, { backgroundColor: method.iconBackground }]}>
                <Icon name={method.icon} size={28} color={colors.textPrimary} />
              </View>
              <View style={styles.methodTextColumn}>
                <View style={styles.methodTitleRow}>
                  <Text style={styles.methodTitle}>{method.title}</Text>
                  {method.badge ? (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>{method.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              <Icon name="chevron-right" size={18} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryText}>Manual entry takes ~5 minutes · 10 steps</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
            {STEP_CHIPS.map(chip => (
              <View key={chip} style={styles.chip}>
                <Text style={styles.chipText}>{chip}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    gap: spacing.xxl,
  },
  headingBlock: {
    gap: spacing.xs,
  },
  heading: {
    ...typography.h3,
    fontSize: 20,
    lineHeight: 30,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.label,
    fontFamily: fontFamilies.regular,
    color: colors.textSecondary,
  },
  methodList: {
    gap: spacing.xl,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xl,
    padding: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: 1.5,
  },
  methodIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTextColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  methodTitle: {
    ...typography.bodySemibold,
    fontSize: 15,
    fontFamily: fontFamilies.bold,
    color: colors.textPrimary,
  },
  badgePill: {
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgePillText: {
    ...typography.tinyBold,
    color: colors.white,
  },
  methodDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  summaryText: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  chipText: {
    ...typography.tinyBold,
    fontFamily: fontFamilies.medium,
    color: colors.textSecondary,
  },
});
