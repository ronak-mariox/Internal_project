import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Badge, Button, IconCircle, ScreenContainer, StatusTimeline } from '../../components';
import { Icon } from '../../icons/Icon';
import { useRegistration } from '../../context/RegistrationContext';
import { api, getApiErrorMessage } from '../../services/api';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'KYCPending'>;

const TIMELINE_STEPS = [
  { label: 'Application Submitted', sublabel: '12 Sep 2024, 14:32 IST', status: 'done' as const },
  { label: 'Document Verification', sublabel: 'In progress — est. 24 hours', status: 'active' as const },
  { label: 'Background Check', sublabel: 'Est. 1 business day', status: 'pending' as const },
  { label: 'Account Activation', sublabel: 'Upon approval', status: 'pending' as const },
];

const DOCUMENTS: { label: string; tone: 'success' | 'warning' }[] = [
  { label: 'GST Certificate', tone: 'warning' },
  { label: 'PAN Card', tone: 'success' },
  { label: 'Trade License', tone: 'warning' },
  { label: 'Bank Details', tone: 'success' },
];

export function KYCPendingScreen({ navigation }: Props) {
  const { data } = useRegistration();
  const [checking, setChecking] = useState(false);

  async function handleRefresh() {
    setChecking(true);
    try {
      const { data: status } = await api.get<{
        status: string;
        kycStatus: string;
        referenceId: string | null;
        rejectionReason: string | null;
      }>('/vendor/registration/status');

      if (status.status === 'active') {
        navigation.replace('KYCApproved');
      } else if (status.status === 'rejected') {
        navigation.replace('KYCRejected', { rejectionReason: status.rejectionReason ?? undefined });
      }
      // Otherwise still pending (or suspended) — stay on this screen. An admin has to
      // approve the application via the admin panel, so during local testing this will
      // typically remain "pending".
    } catch (error) {
      Alert.alert('Could not refresh status', getApiErrorMessage(error, 'Please try again.'));
    } finally {
      setChecking(false);
    }
  }

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification Status</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.hero}>
          <IconCircle
            icon="clock"
            size={80}
            iconSize={36}
            iconColor="#F79009"
            backgroundColor={colors.warningSurface}
            badge={
              <View style={styles.refreshBadge}>
                <Icon name="refresh-cw" size={13} color={colors.white} />
              </View>
            }
          />
          <Text style={styles.heading}>Verification Pending</Text>
          <Text style={styles.subtitle}>Your documents are under review by our verification team</Text>
        </View>

        <View style={styles.referenceRow}>
          <Text style={styles.referenceLabel}>Reference ID:</Text>
          <Text style={styles.referenceValue}>{data.referenceId ?? '—'}</Text>
          <View style={styles.referenceSpacer} />
          <Text
            style={styles.copyText}
            onPress={() => Alert.alert('Copied', `${data.referenceId} copied to clipboard.`)}
          >
            Copy
          </Text>
        </View>

        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <View style={styles.warningDot} />
            <Text style={styles.warningTitle}>Document Verification in Progress</Text>
          </View>
          <Text style={styles.warningBody}>
            Our team is reviewing your GST certificate, PAN, and business proof documents. This
            typically takes 1–2 business days.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.timelineWrapper}>
            <StatusTimeline steps={TIMELINE_STEPS} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Documents Status</Text>
          <View style={styles.documentsList}>
            {DOCUMENTS.map((doc, index) => (
              <View
                key={doc.label}
                style={[styles.documentRow, index < DOCUMENTS.length - 1 && styles.documentRowDivider]}
              >
                <Text style={styles.documentLabel}>{doc.label}</Text>
                <Badge label={doc.tone === 'success' ? 'Verified' : 'Under Review'} tone={doc.tone} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            label="Refresh Status"
            loading={checking}
            icon={<Icon name="refresh-cw" size={16} color={colors.white} />}
            onPress={handleRefresh}
          />
          <Button
            label="Contact Support"
            variant="text"
            onPress={() => Alert.alert('Contact Support', 'Support contact coming soon.')}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.labelSemibold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
    gap: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  refreshBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 9999,
    backgroundColor: '#F79009',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  referenceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  referenceValue: {
    ...typography.labelSemibold,
    color: colors.textPrimary,
  },
  referenceSpacer: {
    flex: 1,
  },
  copyText: {
    ...typography.tiny,
    fontFamily: fontFamilies.medium,
    color: colors.primary,
  },
  warningCard: {
    padding: spacing.xl,
    borderRadius: radii.xl,
    backgroundColor: colors.warningSurface,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    gap: spacing.xs,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  warningDot: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: '#F79009',
  },
  warningTitle: {
    ...typography.labelSemibold,
    color: colors.warningDark,
  },
  warningBody: {
    ...typography.caption,
    color: '#A16207',
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
  },
  cardTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.72,
  },
  timelineWrapper: {
    paddingTop: spacing.lg,
  },
  documentsList: {
    paddingTop: spacing.md,
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  documentRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  documentLabel: {
    ...typography.label,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
  },
  footer: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
