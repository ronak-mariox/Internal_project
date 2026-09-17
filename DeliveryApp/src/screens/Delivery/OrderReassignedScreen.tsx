import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderReassigned'>;

export function OrderReassignedScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="refresh" size={44} color={colors.white} />
        <Text style={styles.headerTitle}>Order Reassigned</Text>
        <Text style={styles.headerSubtitle}>Another rider will complete this delivery.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>REASSIGNMENT DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>#{orderId} · Priya Mehta</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.rowLabel}>New rider</Text>
          <View style={styles.riderRow}>
            <Avatar initials="RK" size={36} backgroundColor="#DBEAFE" textColor="#1D4ED8" />
            <View style={styles.riderText}>
              <Text style={styles.riderName}>Rajesh K. — 4.8</Text>
              <Text style={styles.riderMeta}>2.1 km away</Text>
            </View>
            <Icon name="star" size={14} color={colors.warning} filled />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>ETA for customer</Text>
            <Text style={styles.rowValueGreen}>3:35 PM</Text>
          </View>
        </View>

        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Your earnings (protected)</Text>
          <View style={styles.row}>
            <Text style={styles.earningsRowLabel}>Travel to pickup</Text>
            <Text style={styles.earningsRowValue}>₹20</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.earningsRowLabel}>Pickup completion</Text>
            <Text style={styles.earningsRowValue}>₹20</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹40 (tonight)</Text>
          </View>
        </View>

        <View style={styles.reasonCard}>
          <Text style={styles.reasonLabel}>Why reassigned?</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reason</Text>
            <Text style={styles.rowValue}>Customer unreachable — escalated</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Initiated by</Text>
            <Text style={styles.rowValue}>Verdant Support</Text>
          </View>
        </View>

        <Text style={styles.notifyText}>The customer will be notified about the reassignment.</Text>

        <Button label="Back to Dashboard" onPress={() => navigation.navigate('DeliveryClosed', {orderId})} />
        <Button label="View Next Order" variant="secondary" onPress={goHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: '#0284C7', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  headerSubtitle: {...typography.body, color: '#BAE6FD', textAlign: 'center'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  rowValueGreen: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  divider: {height: 1, backgroundColor: colors.border, marginVertical: spacing.sm},
  riderRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.sm},
  riderText: {flex: 1},
  riderName: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  riderMeta: {...typography.label, fontSize: 13, color: colors.textSecondary},
  earningsCard: {backgroundColor: colors.primarySurfaceAlt, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg},
  earningsLabel: {...typography.labelSemibold, fontSize: 13, color: colors.primaryDark, marginBottom: spacing.sm},
  earningsRowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  earningsRowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  totalRow: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.primaryBorder, paddingTop: spacing.sm, marginTop: spacing.xs},
  totalLabel: {...typography.bodySemibold, fontSize: 14, color: colors.primaryDark},
  totalValue: {...typography.bodyBold, fontSize: 15, color: colors.primaryDark},
  reasonCard: {backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  reasonLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textSecondary, marginBottom: spacing.xs},
  notifyText: {...typography.label, fontSize: 13, color: colors.textSecondary, textAlign: 'center'},
});
