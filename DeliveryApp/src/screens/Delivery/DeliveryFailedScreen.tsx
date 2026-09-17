import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliveryFailed'>;

export function DeliveryFailedScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Icon name="package" size={36} color={colors.white} />
          <View style={styles.headerBadge}>
            <Icon name="x" size={12} color={colors.white} />
          </View>
        </View>
        <Text style={styles.headerTitle}>Delivery Failed</Text>
        <Text style={styles.headerSubtitle}>Order #{orderId}</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>FAILURE SUMMARY</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer</Text>
            <Text style={styles.rowValue}>Priya Mehta — unreachable</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Attempts</Text>
            <Text style={styles.rowValue}>3 calls, 2 messages, 10 min wait</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Time</Text>
            <Text style={styles.rowValue}>3:12 PM</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Evidence</Text>
            <Text style={styles.rowValueGreen}>2 photos submitted</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>EARNINGS SUMMARY</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Guaranteed</Text>
            <Text style={styles.rowValueGreen}>₹40</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Missed (on completion)</Text>
            <Text style={styles.rowValueRed}>- ₹42</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total credited</Text>
            <Text style={styles.totalValue}>₹40</Text>
          </View>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactLabel}>Impact on stats</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Acceptance rate</Text>
            <Text style={styles.rowValue}>No change</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Completion rate</Text>
            <Text style={styles.rowValue}>Will NOT count against you</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer rating</Text>
            <Text style={styles.rowValue}>No impact</Text>
          </View>
        </View>

        <Button label="Return Order" onPress={() => navigation.navigate('ReturnOrder', {orderId})} />
        <Button label="View Issue Report" variant="secondary" onPress={() => navigation.goBack()} />
        <TouchableOpacity onPress={() => navigation.navigate('IssueSupportContact', {orderId})}>
          <Text style={styles.supportLink}>Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: '#7F1D1D', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerIconWrap: {width: 60, height: 60, alignItems: 'center', justifyContent: 'center'},
  headerBadge: {position: 'absolute', top: -6, right: -4, width: 24, height: 24, borderRadius: 12, backgroundColor: '#991B1B', borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {...typography.h2, fontSize: 26, color: colors.white},
  headerSubtitle: {...typography.bodySemibold, fontSize: 16, color: '#FCA5A5'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  rowValueGreen: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  rowValueRed: {...typography.bodyMedium, fontSize: 13, color: colors.danger},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  totalValue: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  impactCard: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.lg, padding: spacing.lg},
  impactLabel: {...typography.labelSemibold, fontSize: 13, color: colors.warningText, marginBottom: spacing.sm},
  supportLink: {...typography.bodyMedium, fontSize: 15, color: colors.textSecondary, textAlign: 'center'},
});
