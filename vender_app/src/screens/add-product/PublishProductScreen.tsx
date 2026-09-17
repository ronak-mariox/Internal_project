import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Badge, Button, NavHeader } from '../../components';
import { Icon } from '../../icons/Icon';
import { useProductDraft } from '../../context/ProductDraftContext';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'PublishProduct'>;

const AFTER_PUBLISHING = [
  { icon: 'globe' as const, text: 'Visible to customers on Verdant' },
  { icon: 'package' as const, text: 'Can receive orders immediately' },
  { icon: 'bell' as const, text: 'Category team will review within 24h' },
  { icon: 'check-circle' as const, text: 'Status changes to Active after approval' },
];

export function PublishProductScreen({ navigation }: Props) {
  const { draft, publishDraft, resetDraft } = useProductDraft();
  const basicInfo = draft.basicInfo;
  const packSize = draft.packSize ? `${draft.packSize.netWeight}${draft.packSize.unit.split(' ')[0]}` : '—';

  function handlePublishNow() {
    publishDraft('pending');
    navigation.replace('PublishSuccess');
  }

  function handleSaveDraft() {
    publishDraft('draft');
    resetDraft();
    navigation.reset({ index: 0, routes: [{ name: 'ProductCatalog' }] });
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <NavHeader title="Publish Product" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Icon name="package" size={24} color={colors.textTertiary} />
          </View>
          <View style={styles.summaryTextColumn}>
            <Text style={styles.summaryName}>{basicInfo?.name || 'Untitled Product'}</Text>
            <Text style={styles.summaryMeta}>
              {packSize} · ₹{draft.pricing?.sellingPrice || 0} · {draft.stock?.opening ?? 0} in stock
            </Text>
            <View style={styles.badgeWrapper}>
              <Badge label="Draft" tone="info" />
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>After Publishing</Text>
          {AFTER_PUBLISHING.map((item, index) => (
            <View key={item.text} style={[styles.infoRow, index < AFTER_PUBLISHING.length - 1 && styles.infoRowDivider]}>
              <Icon name={item.icon} size={16} color={colors.primary} />
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button label="Publish Now" onPress={handlePublishNow} />
          <Button label="Save as Draft" variant="outline" onPress={handleSaveDraft} />
          <Button
            label="Schedule for later"
            variant="text"
            onPress={() => Alert.alert('Schedule for later', 'Coming soon.')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: radii.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTextColumn: {
    flex: 1,
    gap: 2,
  },
  summaryName: {
    ...typography.bodySemibold,
    color: colors.textPrimary,
  },
  summaryMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  badgeWrapper: {
    paddingTop: spacing.xs,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  infoTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.72,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoText: {
    ...typography.label,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    flex: 1,
  },
  footer: {
    marginTop: 'auto',
    gap: spacing.lg,
  },
});
