import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';
import { Button, IconCircle, InfoBanner, ScreenContainer } from '../../components';
import { colors, fontFamilies, radii, spacing, typography } from '../../theme';
import { useRegistration } from '../../context/RegistrationContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'KYCRejected'>;

const REASONS = [
  {
    title: 'GST Certificate',
    action: 'Re-upload',
    description: 'Document is expired (expired on 31 Mar 2023). Please upload a valid certificate.',
    target: 'GSTDetails' as const,
  },
  {
    title: 'Business Address',
    action: 'Correct',
    description: 'Pincode 400001 does not match city Mumbai. Please verify your address.',
    target: 'BusinessInfo' as const,
  },
  {
    title: 'Bank Account',
    action: 'Correct',
    description: "Account holder name (PRIYA SHARMA) doesn't match GST registered name (SHARMA ENTERPRISES).",
    target: 'BankDetails' as const,
  },
];

const FIX_STEPS = [
  'Upload valid (unexpired) GST certificate',
  'Verify and correct your business address',
  'Ensure bank account holder name matches GST name',
];

export function KYCRejectedScreen({ navigation, route }: Props) {
  const { data } = useRegistration();
  const rejectionReason = route.params?.rejectionReason;

  return (
    <ScreenContainer scrollable>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Verification Status</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.hero}>
          <IconCircle
            icon="x-circle"
            size={80}
            iconSize={40}
            iconColor={colors.error}
            backgroundColor={colors.errorSurface}
          />
          <Text style={styles.heading}>Verification Failed</Text>
          <Text style={styles.subtitle}>
            Your application couldn't be approved.{'\n'}Please correct the issues and resubmit.
          </Text>
          <View style={styles.refPill}>
            <Text style={styles.refLabel}>Ref: </Text>
            <Text style={styles.refValue}>{data.referenceId ?? '—'}</Text>
          </View>
        </View>

        {rejectionReason ? (
          <View style={styles.reasonsCard}>
            <Text style={styles.reasonsTitle}>Rejection Reason</Text>
            <Text style={styles.reasonDescription}>{rejectionReason}</Text>
          </View>
        ) : (
          <View style={styles.reasonsCard}>
            <Text style={styles.reasonsTitle}>Rejection Reasons ({REASONS.length})</Text>
            {REASONS.map((reason, index) => (
              <View
                key={reason.title}
                style={[styles.reasonRow, index < REASONS.length - 1 && styles.reasonRowDivider]}
              >
                <View style={styles.reasonHeader}>
                  <Text style={styles.reasonTitle}>{reason.title}</Text>
                  <Pressable onPress={() => navigation.navigate(reason.target)} hitSlop={8}>
                    <Text style={styles.reasonAction}>{reason.action}</Text>
                  </Pressable>
                </View>
                <Text style={styles.reasonDescription}>{reason.description}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.fixCard}>
          <Text style={styles.fixTitle}>How to Fix</Text>
          {FIX_STEPS.map((step, index) => (
            <View key={step} style={styles.fixRow}>
              <View style={styles.fixBadge}>
                <Text style={styles.fixBadgeText}>{index + 1}</Text>
              </View>
              <Text style={styles.fixText}>{step}</Text>
            </View>
          ))}
        </View>

        <InfoBanner
          variant="info"
          message="You have 2 resubmission attempts remaining. After correction, your application will be reviewed within 24 hours."
        />

        <View style={styles.footer}>
          <Button
            label="Correct Details & Resubmit"
            onPress={() => navigation.navigate('KYCReview')}
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
  refPill: {
    flexDirection: 'row',
    backgroundColor: colors.errorSurface,
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: spacing.md,
  },
  refLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  refValue: {
    ...typography.caption,
    fontFamily: fontFamilies.bold,
    color: colors.error,
  },
  reasonsCard: {
    padding: spacing.xl,
    borderRadius: radii.xl,
    backgroundColor: colors.errorSurface,
    borderWidth: 1.5,
    borderColor: colors.errorBorder,
  },
  reasonsTitle: {
    ...typography.labelSemibold,
    color: colors.error,
    paddingBottom: spacing.lg,
  },
  reasonRow: {
    paddingVertical: spacing.md,
  },
  reasonRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.errorBorder,
  },
  reasonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reasonTitle: {
    ...typography.captionBold,
    color: colors.error,
  },
  reasonAction: {
    ...typography.captionSemibold,
    color: colors.error,
    textDecorationLine: 'underline',
  },
  reasonDescription: {
    ...typography.captionBold,
    fontFamily: fontFamilies.regular,
    color: colors.errorDark,
    paddingTop: spacing.xs,
  },
  fixCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
  },
  fixTitle: {
    ...typography.captionSemibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.72,
  },
  fixRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  fixBadge: {
    width: 18,
    height: 18,
    borderRadius: 9999,
    backgroundColor: colors.errorSurface,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  fixBadgeText: {
    ...typography.tinyBold,
    color: colors.error,
    fontSize: 10,
  },
  fixText: {
    ...typography.captionBold,
    fontFamily: fontFamilies.regular,
    color: colors.textPrimary,
    flex: 1,
  },
  footer: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
});
