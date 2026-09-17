import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryHistoryEarnings'>;

const BREAKDOWN_ROWS = [
  {label: 'Base fare', sub: undefined, value: '₹50.00'},
  {label: 'Distance', sub: '3.6 km × ₹7', value: '₹25.20'},
  {label: 'Pickup bonus', sub: undefined, value: '₹4.00'},
  {label: 'On-time bonus', sub: undefined, value: '₹2.80'},
];

export function DeliveryHistoryEarningsScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Earnings #{orderId}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>TOTAL EARNED</Text>
          <Text style={styles.heroValue}>₹82</Text>
          <Text style={styles.heroSub}>For delivery #{orderId}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Earnings Breakdown</Text>
          {BREAKDOWN_ROWS.map((row, index) => (
            <View key={row.label} style={[styles.row, index < BREAKDOWN_ROWS.length - 1 && styles.rowBorder]}>
              <View>
                <Text style={styles.rowLabel}>{row.label}</Text>
                {row.sub && <Text style={styles.rowSub}>{row.sub}</Text>}
              </View>
              <Text style={styles.rowValue}>{row.value}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹82.00</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Status</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabelMuted}>Method</Text>
            <Text style={styles.rowValueDark}>HDFC UPI</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabelMuted}>Transaction ID</Text>
            <Text style={styles.rowValueDark}>TXN-8840291</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabelMuted}>Credited on</Text>
            <Text style={styles.rowValueGreen}>Sep 9, 11:43 AM</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Related Delivery</Text>
          <TouchableOpacity style={styles.relatedRow} activeOpacity={0.7} onPress={() => navigation.navigate('DeliveryHistoryDetail', {orderId})}>
            <View style={styles.flex}>
              <Text style={styles.relatedOrderId}>#{orderId}</Text>
              <Text style={styles.relatedRoute}>Swiggy Instamart → HSR Layout</Text>
              <Text style={styles.relatedTime}>Sep 6, 3:04 PM · 22 min</Text>
            </View>
            <View style={styles.relatedLink}>
              <Text style={styles.relatedLinkText}>View Delivery</Text>
              <Icon name="chevron-right" size={14} color={colors.primary} />
            </View>
          </TouchableOpacity>
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
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  heroCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, paddingVertical: spacing.xxl, alignItems: 'center'},
  heroLabel: {...typography.captionSemibold, fontSize: 11, color: colors.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase'},
  heroValue: {...typography.display, fontSize: 42, color: colors.primary, fontWeight: '800', marginTop: spacing.xs},
  heroSub: {...typography.caption, color: colors.textSecondary, marginTop: 2},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  cardTitle: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomColor: '#F3F4F6'},
  rowBorder: {borderBottomWidth: 1},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textPrimary},
  rowSub: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 1},
  rowValue: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  rowLabelMuted: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  rowValueDark: {...typography.captionMedium, fontSize: 12, color: colors.textPrimary},
  rowValueGreen: {...typography.captionMedium, fontSize: 12, color: colors.primary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.md, marginTop: spacing.xs},
  totalLabel: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 15, color: colors.primary},
  relatedRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.sm},
  relatedOrderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  relatedRoute: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
  relatedTime: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  relatedLink: {flexDirection: 'row', alignItems: 'center', gap: 4},
  relatedLinkText: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
});
