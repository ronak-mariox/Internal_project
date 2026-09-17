import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'FailedDeliveries'>;

const FAILED_ITEMS = [
  {orderId: 'VR-84780', route: 'Zomato → BTM', time: 'Sep 5, 2:10 PM', reason: 'Customer unreachable', amount: '₹40 earned (partial)'},
  {orderId: 'VR-84745', route: 'Swiggy → Whitefield', time: 'Aug 31, 7:30 PM', reason: 'Wrong address provided', amount: '₹40 earned'},
];

export function FailedDeliveriesScreen({navigation}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Failed Deliveries</Text>
      </View>

      <View style={styles.subheader}>
        <Text style={styles.subheaderText}>2 failed deliveries (last 30 days)</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {FAILED_ITEMS.map(item => (
          <View key={item.orderId} style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.orderId}>#{item.orderId}</Text>
              <View style={styles.failedPill}>
                <Text style={styles.failedPillText}>FAILED</Text>
              </View>
            </View>
            <Text style={styles.route}>{item.route}</Text>
            <Text style={styles.time}>{item.time}</Text>
            <View style={styles.bottomRow}>
              <Text style={styles.reason}>{item.reason}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
            <View style={styles.issueRow}>
              <Text style={styles.issueLabel}>Issue:</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('IssueResolution', {orderId: item.orderId})}>
                <Text style={styles.issueLink}>View Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.infoBanner}>
          <Icon name="info" size={16} color={colors.primary} />
          <Text style={styles.infoBannerText}>Both failures were documented. Your rating was not affected.</Text>
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
  subheader: {backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  subheaderText: {...typography.label, fontSize: 13, color: colors.textSecondary},
  body: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md, ...shadows.sm},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  orderId: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  failedPill: {backgroundColor: '#FEF3F2', borderRadius: radius.sm, paddingHorizontal: 8, paddingVertical: 2},
  failedPillText: {...typography.captionSemibold, fontSize: 10, color: '#D92D20'},
  route: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 4},
  time: {...typography.caption, fontSize: 11, color: colors.textMuted, marginTop: 2},
  bottomRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm},
  reason: {...typography.captionMedium, fontSize: 12, color: colors.warning},
  amount: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
  issueRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm},
  issueLabel: {...typography.caption, fontSize: 12, color: colors.textSecondary},
  issueLink: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
  infoBanner: {flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.md},
  infoBannerText: {...typography.label, fontSize: 13, color: colors.primaryDark, flex: 1},
});
