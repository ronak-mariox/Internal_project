import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryHistory'>;

type Tab = 'All' | 'Active' | 'Completed' | 'Cancelled';
const TABS: Tab[] = ['All', 'Active', 'Completed', 'Cancelled'];

type Status = 'delivered' | 'cancelled' | 'failed';

const ALL_ITEMS: {orderId: string; route: string; amount: string; status: Status; time: string}[] = [
  {orderId: 'VR-84821', route: 'Swiggy → HSR', amount: '₹82', status: 'delivered', time: 'Sep 6, 3:04 PM'},
  {orderId: 'VR-84815', route: "McDonald's → Koramangala", amount: '₹94', status: 'delivered', time: 'Sep 6, 1:32 PM'},
  {orderId: 'VR-84803', route: 'BigBasket → Ejipura', amount: '₹76', status: 'delivered', time: 'Sep 6, 12:48 PM'},
  {orderId: 'VR-84790', route: "Domino's → Indiranagar", amount: '₹0', status: 'cancelled', time: 'Sep 5, 8:22 PM'},
  {orderId: 'VR-84780', route: 'Zomato → BTM', amount: '₹40', status: 'failed', time: 'Sep 5, 2:10 PM'},
];

const STATUS_META: Record<Status, {label: string; dot: string; bg: string; text: string}> = {
  delivered: {label: 'DELIVERED', dot: colors.primary, bg: colors.primarySurface, text: colors.primary},
  cancelled: {label: 'CANCELLED', dot: colors.textMuted, bg: '#F3F4F6', text: '#6B7280'},
  failed: {label: 'FAILED', dot: '#D92D20', bg: '#FEF3F2', text: '#D92D20'},
};

const COMPLETED_ITEMS = [
  {orderId: 'VR-84821', amount: '₹82', time: 'Sep 6, 3:04 PM · HSR Layout', duration: '22 min'},
  {orderId: 'VR-84815', amount: '₹94', time: 'Sep 6, 1:32 PM · Koramangala', duration: '35 min'},
  {orderId: 'VR-84803', amount: '₹76', time: 'Sep 6, 12:48 PM · Ejipura', duration: '28 min'},
  {orderId: 'VR-84796', amount: '₹62', time: 'Sep 5, 6:44 PM · BTM Layout', duration: '19 min'},
  {orderId: 'VR-84782', amount: '₹114', time: 'Sep 5, 2:18 PM · Indiranagar', duration: '41 min'},
  {orderId: 'VR-84770', amount: '₹88', time: 'Sep 4, 8:32 PM · Whitefield', duration: '31 min'},
];

const DATE_RANGES = ['Today', 'This Week', 'This Month', 'Custom'];

const CANCELLED_ITEMS = [
  {orderId: 'VR-84790', route: "Domino's → Indiranagar", time: 'Sep 5, 8:22 PM', reason: 'Customer cancelled', amount: '₹0 earned', amountGreen: false},
  {orderId: 'VR-84761', route: 'BigBasket → Ejipura', time: 'Sep 2, 5:15 PM', reason: 'Store issue', amount: '₹25 (cancellation fee)', amountGreen: true},
  {orderId: 'VR-84732', route: "McDonald's → HSR", time: 'Aug 29, 1:40 PM', reason: 'Rider cancelled', amount: '₹0', amountGreen: false},
];

const RECENTLY_STARTED = [
  {orderId: 'VR-84826', status: 'Pickup in progress — McDonald\'s'},
  {orderId: 'VR-84827', status: 'Waiting for order — BigBasket'},
];

export function DeliveryHistoryScreen({navigation}: Props) {
  const [tab, setTab] = useState<Tab>('All');
  const [dateRange, setDateRange] = useState('This Week');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="chevron-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery History</Text>
        <TouchableOpacity hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="filter" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {tab === 'All' && (
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>142</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>18</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>₹8,240</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabRow} style={styles.tabScroll}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[styles.tabPill, tab === t && styles.tabPillActive]} activeOpacity={0.8} onPress={() => setTab(t)}>
            <Text style={[styles.tabPillText, tab === t && styles.tabPillTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {tab === 'Completed' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow} style={styles.dateScroll}>
          {DATE_RANGES.map(d => (
            <TouchableOpacity key={d} style={[styles.datePill, dateRange === d && styles.datePillActive]} activeOpacity={0.8} onPress={() => setDateRange(d)}>
              <Text style={[styles.datePillText, dateRange === d && styles.datePillTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {tab === 'Completed' && (
        <View style={styles.summaryBanner}>
          <Text style={styles.summaryBannerText}>18 deliveries · ₹1,284 earned this week</Text>
        </View>
      )}

      {tab === 'Cancelled' && (
        <View style={styles.plainBanner}>
          <Text style={styles.plainBannerText}>3 cancellations this month</Text>
        </View>
      )}

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {tab === 'All' &&
          ALL_ITEMS.map(item => {
            const meta = STATUS_META[item.status];
            return (
              <TouchableOpacity
                key={item.orderId}
                style={styles.allRow}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.status === 'delivered') {
                    navigation.navigate('DeliveryHistoryDetail', {orderId: item.orderId});
                  } else if (item.status === 'cancelled') {
                    setTab('Cancelled');
                  } else {
                    navigation.navigate('FailedDeliveries');
                  }
                }}>
                <View style={[styles.dot, {backgroundColor: meta.dot}]} />
                <View style={styles.flex}>
                  <View style={styles.allRowTop}>
                    <Text style={styles.allOrderId}>#{item.orderId}</Text>
                    <Text style={styles.allAmount}>{item.amount}</Text>
                  </View>
                  <View style={styles.allRowMid}>
                    <Text style={styles.allRouteText}>{item.route}</Text>
                    <View style={[styles.statusPill, {backgroundColor: meta.bg}]}>
                      <Text style={[styles.statusPillText, {color: meta.text}]}>{meta.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.allTime}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        {tab === 'All' && (
          <TouchableOpacity style={styles.loadMore} activeOpacity={0.7}>
            <Text style={styles.loadMoreText}>Load more</Text>
          </TouchableOpacity>
        )}

        {tab === 'Active' && (
          <>
            <View style={styles.activeCard}>
              <View style={styles.activeTopRow}>
                <View style={styles.flex}>
                  <Text style={styles.activeOrderId}>#VR-84828</Text>
                  <Text style={styles.activeStore}>Swiggy Instamart, Koramangala</Text>
                </View>
                <Text style={styles.activeAmount}>₹78</Text>
              </View>
              <View style={styles.activeStatusRow}>
                <View style={styles.activeStatusDot} />
                <Text style={styles.activeStatusText}>En Route to Customer</Text>
              </View>
              <View style={styles.activeMetaRow}>
                <View>
                  <Text style={styles.activeMetaLabel}>Customer</Text>
                  <Text style={styles.activeMetaValue}>Indiranagar 5th Main</Text>
                </View>
                <View>
                  <Text style={styles.activeMetaLabel}>Remaining</Text>
                  <Text style={styles.activeMetaValue}>2.1 km</Text>
                </View>
                <View>
                  <Text style={styles.activeMetaLabel}>ETA</Text>
                  <Text style={styles.activeMetaValue}>12 min</Text>
                </View>
              </View>
              <Text style={styles.activeEarningsNote}>Earnings: ₹78 (pending)</Text>
              <Button label="View Details" onPress={() => navigation.navigate('HomeActiveDelivery', {orderId: 'VR-84828'})} />
            </View>

            <Text style={styles.sectionLabel}>RECENTLY STARTED</Text>
            {RECENTLY_STARTED.map(item => (
              <View key={item.orderId} style={styles.recentRow}>
                <View style={styles.flex}>
                  <Text style={styles.recentOrderId}>#{item.orderId}</Text>
                  <Text style={styles.recentStatus}>{item.status}</Text>
                </View>
                <View style={styles.recentDot} />
              </View>
            ))}
          </>
        )}

        {tab === 'Completed' &&
          COMPLETED_ITEMS.map(item => (
            <TouchableOpacity
              key={item.orderId}
              style={styles.completedRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('DeliveryHistoryDetail', {orderId: item.orderId})}>
              <View style={[styles.dot, {backgroundColor: colors.primary}]} />
              <View style={styles.flex}>
                <View style={styles.allRowTop}>
                  <Text style={styles.allOrderId}>#{item.orderId}</Text>
                  <Text style={styles.completedAmount}>{item.amount}</Text>
                </View>
                <View style={styles.allRowTop}>
                  <Text style={styles.completedTime}>{item.time}</Text>
                  <Text style={styles.completedDuration}>{item.duration}</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={14} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        {tab === 'Completed' && (
          <View style={styles.completedFooter}>
            <View style={styles.completedFooterCol}>
              <Text style={styles.completedFooterValue}>₹1,284</Text>
              <Text style={styles.completedFooterLabel}>Total</Text>
            </View>
            <View style={styles.completedFooterDivider} />
            <View style={styles.completedFooterCol}>
              <Text style={styles.completedFooterValue}>₹71.3</Text>
              <Text style={styles.completedFooterLabel}>Avg</Text>
            </View>
            <View style={styles.completedFooterDivider} />
            <View style={styles.completedFooterCol}>
              <Text style={[styles.completedFooterValue, styles.completedFooterValueGreen]}>₹114</Text>
              <Text style={styles.completedFooterLabel}>Best</Text>
            </View>
          </View>
        )}

        {tab === 'Cancelled' &&
          CANCELLED_ITEMS.map(item => (
            <View key={item.orderId} style={styles.cancelCard}>
              <View style={styles.allRowTop}>
                <Text style={styles.allOrderId}>#{item.orderId}</Text>
                <View style={styles.cancelledPill}>
                  <Text style={styles.cancelledPillText}>CANCELLED</Text>
                </View>
              </View>
              <Text style={styles.cancelRoute}>{item.route}</Text>
              <Text style={styles.cancelTime}>{item.time}</Text>
              <View style={styles.cancelBottomRow}>
                <Text style={styles.cancelReason}>{item.reason}</Text>
                <Text style={[styles.cancelAmount, item.amountGreen && styles.cancelAmountGreen]}>{item.amount}</Text>
              </View>
            </View>
          ))}
        {tab === 'Cancelled' && (
          <View style={styles.infoBanner}>
            <Icon name="info" size={16} color={colors.primary} />
            <Text style={styles.infoBannerText}>Cancellation fee applies when customer cancels after order was picked up.</Text>
          </View>
        )}
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
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: 52,
    paddingBottom: spacing.md,
  },
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  statsRow: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, padding: spacing.lg},
  statTile: {flex: 1, backgroundColor: colors.background, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: 'center'},
  statValue: {...typography.h4, fontSize: 18, color: colors.textPrimary},
  statLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  tabScroll: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, flexGrow: 0},
  tabRow: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  tabPill: {backgroundColor: '#F3F4F6', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.xs},
  tabPillActive: {backgroundColor: colors.primary},
  tabPillText: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary},
  tabPillTextActive: {color: colors.white},
  dateScroll: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, flexGrow: 0},
  dateRow: {flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  datePill: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 5},
  datePillActive: {backgroundColor: colors.primarySurface, borderColor: colors.primary},
  datePillText: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary},
  datePillTextActive: {color: colors.primary},
  summaryBanner: {backgroundColor: colors.primarySurface, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  summaryBannerText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  plainBanner: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  plainBannerText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxxl},
  dot: {width: 10, height: 10, borderRadius: 5, marginTop: 4},
  allRow: {flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  allRowTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  allRowMid: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2},
  allOrderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  allAmount: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  allRouteText: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  allTime: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  statusPill: {borderRadius: radius.sm, paddingHorizontal: 7, paddingVertical: 2},
  statusPillText: {...typography.captionSemibold, fontSize: 10},
  loadMore: {alignItems: 'center', paddingVertical: spacing.md},
  loadMoreText: {...typography.labelSemibold, fontSize: 14, color: colors.primary},
  activeCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.md,
  },
  activeTopRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  activeOrderId: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  activeStore: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  activeAmount: {...typography.h4, fontSize: 16, color: colors.primary},
  activeStatusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  activeStatusDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  activeStatusText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
  activeMetaRow: {flexDirection: 'row', gap: spacing.xl},
  activeMetaLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  activeMetaValue: {...typography.captionMedium, fontSize: 12, color: colors.textPrimary, marginTop: 1},
  activeEarningsNote: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  sectionLabel: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: spacing.sm},
  recentRow: {flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  recentOrderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  recentStatus: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  recentDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning},
  completedRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md},
  completedAmount: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  completedTime: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  completedDuration: {...typography.caption, fontSize: 11, color: colors.textMuted},
  completedFooter: {flexDirection: 'row', backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: spacing.md, marginTop: spacing.sm},
  completedFooterCol: {flex: 1, alignItems: 'center'},
  completedFooterDivider: {width: 1, backgroundColor: colors.border},
  completedFooterValue: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  completedFooterValueGreen: {color: colors.primary},
  completedFooterLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary, marginTop: 2},
  cancelCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cancelledPill: {backgroundColor: '#F3F4F6', borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2},
  cancelledPillText: {...typography.captionSemibold, fontSize: 10, color: '#6B7280'},
  cancelRoute: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 4},
  cancelTime: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 4},
  cancelBottomRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm},
  cancelReason: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  cancelAmount: {...typography.labelSemibold, fontSize: 12, color: colors.textMuted},
  cancelAmountGreen: {color: colors.primary},
  infoBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.xs},
  infoBannerText: {...typography.label, fontSize: 13, color: colors.primaryDark, flex: 1},
});
