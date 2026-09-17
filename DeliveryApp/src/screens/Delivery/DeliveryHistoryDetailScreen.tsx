import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryHistoryDetail'>;

const OVERVIEW_ROWS = [
  {label: 'Store', value: 'Swiggy Instamart, Koramangala 6th Block'},
  {label: 'Customer', value: 'Priya Mehta, HSR Layout Sector 2'},
  {label: 'Items', value: '3 items · Weight ~2.3 kg'},
  {label: 'Payment', value: 'Pre-paid · ₹537 order value'},
];

const TIMELINE = [
  {label: 'Assigned', time: '2:19 PM'},
  {label: 'Picked up', time: '2:41 PM (wait: 8 min)'},
  {label: 'En route', time: '2:41 PM → 3:04 PM'},
  {label: 'Delivered', time: '3:04 PM · Customer OTP verified'},
];

export function DeliveryHistoryDetailScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Delivery #{orderId}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.statusBanner}>
          <Text style={styles.statusBannerTitle}>DELIVERED</Text>
          <Text style={styles.statusBannerTime}>Sep 6, 3:04 PM</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Overview</Text>
          <View style={[styles.overviewRow, styles.overviewRowBorder]}>
            <Text style={styles.overviewLabel}>Order ID</Text>
            <View style={styles.orderIdRow}>
              <Text style={styles.overviewValue}>#{orderId}</Text>
              <Icon name="copy" size={13} color={colors.textSecondary} />
            </View>
          </View>
          {OVERVIEW_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.overviewRow, index < OVERVIEW_ROWS.length - 1 && styles.overviewRowBorder]}>
              <Text style={styles.overviewLabel}>{row.label}</Text>
              <Text style={styles.overviewValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>4.8 km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>22 min</Text>
            <Text style={styles.statLabel}>Duration</Text>
          </View>
          <View style={styles.statTile}>
            <Icon name="check" size={16} color={colors.primary} />
            <Text style={styles.statLabel}>On-time</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate('OrderTimeline', {orderId})}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Route Timeline</Text>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </View>
          {TIMELINE.map((step, index) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={styles.timelineTrack}>
                <View style={styles.timelineDot}>
                  <Icon name="check" size={12} color={colors.primary} />
                </View>
                {index < TIMELINE.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineText}>
                <Text style={styles.timelineLabel}>{step.label}</Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings</Text>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Base</Text>
            <Text style={styles.earningsValue}>₹50</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>Distance</Text>
            <Text style={styles.earningsValue}>₹28</Text>
          </View>
          <View style={styles.earningsRow}>
            <Text style={styles.earningsLabel}>On-time</Text>
            <Text style={styles.earningsValue}>₹4</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹82</Text>
          </View>
        </View>

        <View style={styles.ratingCard}>
          <Text style={styles.stars}>★★★★★</Text>
          <View style={styles.flex}>
            <Text style={styles.ratingTitle}>Customer rated 5 stars</Text>
            <Text style={styles.ratingQuote}>{'"Fast delivery"'}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Button
            label="View Earnings Detail"
            variant="outline"
            style={styles.flex}
            onPress={() => navigation.navigate('DeliveryHistoryEarnings', {orderId})}
          />
          <Button label="Report an Issue" variant="secondary" style={styles.flex} onPress={() => navigation.navigate('ReportIssue', {orderId})} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  flex: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  body: {padding: 0, paddingBottom: spacing.xxxl},
  statusBanner: {backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.md},
  statusBannerTitle: {...typography.bodyBold, fontSize: 14, color: colors.white, letterSpacing: 0.5},
  statusBannerTime: {...typography.caption, color: 'rgba(255,255,255,0.85)', marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, margin: spacing.lg, marginBottom: 0},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  cardTitleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  overviewRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, marginTop: spacing.xs},
  overviewRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F3F4F6'},
  overviewLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  overviewValue: {...typography.captionMedium, fontSize: 12, color: colors.textPrimary, textAlign: 'right', flexShrink: 1, marginLeft: spacing.md},
  orderIdRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  statsRow: {flexDirection: 'row', gap: spacing.sm, margin: spacing.lg, marginBottom: 0},
  statTile: {flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md, alignItems: 'center'},
  statValue: {...typography.h4, fontSize: 16, color: colors.textPrimary},
  statLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  timelineRow: {flexDirection: 'row', gap: spacing.md, marginTop: spacing.md},
  timelineTrack: {alignItems: 'center'},
  timelineDot: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySurface, alignItems: 'center', justifyContent: 'center'},
  timelineLine: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.primarySurface, marginVertical: 2},
  timelineText: {paddingBottom: spacing.sm},
  timelineLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  timelineTime: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  earningsRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, marginTop: spacing.xs},
  earningsLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  earningsValue: {...typography.caption, fontSize: 12, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodyBold, fontSize: 14, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.lg,
    margin: spacing.lg,
    marginBottom: 0,
  },
  stars: {fontSize: 22, color: colors.warning},
  ratingTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  ratingQuote: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, margin: spacing.lg},
});
