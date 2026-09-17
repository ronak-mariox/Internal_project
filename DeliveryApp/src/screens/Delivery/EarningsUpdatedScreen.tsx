import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'EarningsUpdated'>;

const TODAY_STATS = [
  {value: '₹428', label: "Today's earnings"},
  {value: '6', label: 'Deliveries completed'},
  {value: '₹71.3', label: 'Avg per delivery'},
  {value: '₹112', label: 'Best delivery'},
];

export function EarningsUpdatedScreen({navigation}: Props) {
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="credit-card" size={28} color={colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Earnings Updated</Text>
        <Text style={styles.headerSubtitle}>Your account has been credited</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.deliveryCard}>
          <Text style={styles.cardTitle}>This Delivery</Text>
          <Text style={styles.amount}>₹82</Text>
          <Row label="Base pay" value="₹50" />
          <Row label="Distance bonus" value="₹28" />
          <Row label="On-time bonus" value="₹4" last />
          <View style={styles.divider} />
          <View style={styles.weeklyRow}>
            <Text style={styles.weeklyLabel}>Weekly total so far</Text>
            <Text style={styles.weeklyValue}>₹1,284 / ₹2,000</Text>
          </View>
          <ProgressBar progress={0.64} height={8} style={styles.progressBar} />
          <Text style={styles.weeklyHint}>64% of weekly target · 3 days remaining</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Today's Summary</Text>
          <View style={styles.statsGrid}>
            {TODAY_STATS.map(stat => (
              <View key={stat.label} style={styles.statTile}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bonusBanner}>
          <Icon name="star" size={20} color={colors.warning} filled />
          <View style={styles.bonusText}>
            <Text style={styles.bonusTitle}>3 more deliveries for ₹150 peak bonus!</Text>
            <Text style={styles.bonusSubtitle}>Complete by 5 PM to earn the peak hour bonus</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continue Delivering →" onPress={goHome} />
        <TouchableOpacity onPress={() => navigation.navigate('EarningsDashboard')}>
          <Text style={styles.statementLink}>View Full Statement</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

function Row({label, value, last}: {label: string; value: string; last?: boolean}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, alignItems: 'center', gap: spacing.xxs, paddingVertical: spacing.xxl},
  headerIcon: {width: 64, height: 64, borderRadius: 32, backgroundColor: colors.successSurface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  headerTitle: {...typography.h4, fontSize: 22, color: colors.textPrimary},
  headerSubtitle: {...typography.body, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  deliveryCard: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primaryBorder, borderRadius: radius.xxl, padding: spacing.xl},
  cardTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  amount: {...typography.display, fontSize: 36, color: colors.primary, marginTop: spacing.sm, marginBottom: spacing.md},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowBorder: {borderBottomWidth: 1, borderBottomColor: colors.border},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, fontWeight: '500', color: colors.textPrimary},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: spacing.sm},
  weeklyRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  weeklyLabel: {...typography.label, color: colors.textSecondary},
  weeklyValue: {...typography.bodyBold, color: colors.textPrimary},
  progressBar: {marginTop: spacing.sm},
  weeklyHint: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: spacing.xs},
  summaryCard: {backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg},
  statsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md},
  statTile: {flexBasis: '47%', flexGrow: 1, backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md},
  statValue: {...typography.title, fontSize: 18, color: colors.textPrimary},
  statLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  bonusBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.warningSurface, borderWidth: 1.5, borderColor: colors.warningBorder, borderRadius: radius.xl, padding: spacing.lg},
  bonusText: {flex: 1},
  bonusTitle: {...typography.bodySemibold, fontSize: 14, color: colors.warningText},
  bonusSubtitle: {...typography.caption, color: '#B45309', marginTop: spacing.xxs},
  footer: {padding: spacing.lg, gap: spacing.md, alignItems: 'center', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  statementLink: {...typography.body, color: colors.textSecondary},
});
