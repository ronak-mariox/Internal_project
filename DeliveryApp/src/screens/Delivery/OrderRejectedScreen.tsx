import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderRejected'>;

const RATE_BEFORE = 94;
const RATE_AFTER = 93;

export function OrderRejectedScreen({route, navigation}: Props) {
  const {orderId, reason} = route.params;

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="x" size={32} color={colors.danger} />
      </View>
      <Text style={styles.title}>Order Rejected</Text>
      <Text style={styles.subtitle}>
        You rejected order <Text style={styles.subtitleStrong}>#{orderId}</Text>. Reason: {reason}.
      </Text>

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Acceptance Rate Impact</Text>
        <View style={styles.rateRow}>
          <View style={styles.rateBox}>
            <Text style={styles.rateValue}>{RATE_BEFORE}%</Text>
            <Text style={styles.rateLabel}>Before</Text>
          </View>
          <Icon name="arrow-right" size={18} color={colors.textMuted} />
          <View style={[styles.rateBox, styles.rateBoxAfter]}>
            <Text style={[styles.rateValue, styles.rateValueAfter]}>{RATE_AFTER}%</Text>
            <Text style={styles.rateLabel}>After</Text>
          </View>
        </View>
        <View style={styles.progressBlock}>
          <ProgressBar progress={RATE_AFTER / 100} height={6} trackColor={colors.border} />
          <View style={styles.progressLabelsRow}>
            <Text style={styles.progressLabelText}>0%</Text>
            <Text style={styles.progressLabelWarning}>80% threshold</Text>
            <Text style={styles.progressLabelText}>100%</Text>
          </View>
        </View>
      </View>

      <View style={styles.tipBanner}>
        <Text style={styles.tipText}>
          <Text style={styles.tipTextStrong}>Tip:</Text> Accept your next 3 orders to bring your rate back above 95% and qualify for
          peak-hour bonuses.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Back to Dashboard" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
        <Button label="View Acceptance Stats" variant="secondary" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  iconWrap: {width: 100, height: 100, borderRadius: 50, backgroundColor: colors.dangerSurface, borderWidth: 2, borderColor: colors.dangerBorder, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  title: {...typography.h3, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl},
  subtitleStrong: {...typography.bodySemibold, color: colors.textPrimary},
  impactCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, marginBottom: spacing.lg},
  impactTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textLabel, marginBottom: spacing.md},
  rateRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  rateBox: {flex: 1, backgroundColor: colors.background, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center'},
  rateBoxAfter: {backgroundColor: colors.dangerSurface, borderWidth: 1, borderColor: colors.dangerBorder},
  rateValue: {...typography.h4, fontSize: 18, color: colors.textPrimary},
  rateValueAfter: {color: colors.danger},
  rateLabel: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  progressBlock: {backgroundColor: colors.background, borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.md},
  progressLabelsRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs},
  progressLabelText: {...typography.caption, fontSize: 10, color: colors.textMuted},
  progressLabelWarning: {...typography.caption, fontSize: 10, color: colors.warning},
  tipBanner: {width: '100%', backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.xl},
  tipText: {...typography.label, color: '#13845A', lineHeight: 19},
  tipTextStrong: {fontWeight: '700'},
  actions: {width: '100%', gap: spacing.sm},
});
