import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderCancelledByCustomer'>;

export function OrderCancelledByCustomerScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="x" size={28} color={colors.white} />
        </View>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Order Cancelled by Customer</Text>
        <Text style={styles.subtitle}>Priya Mehta cancelled order #{orderId}.</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CANCELLATION DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Cancelled at</Text>
            <Text style={styles.rowValue}>3:11 PM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Reason</Text>
            <Text style={styles.rowValue}>Changed mind</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Your status at cancellation</Text>
            <Text style={styles.rowValueWarning}>En route to delivery</Text>
          </View>
        </View>

        <View style={styles.protectionCard}>
          <View style={styles.protectionHeader}>
            <Icon name="shield" size={16} color={colors.primary} />
            <Text style={styles.protectionTitle}>Earnings Protection Applied</Text>
          </View>
          <View style={styles.protectionRow}>
            <Text style={styles.protectionFeeLabel}>Cancellation fee</Text>
            <Text style={styles.protectionFeeValue}>₹25 guaranteed</Text>
          </View>
          <Text style={styles.protectionNote}>You will receive partial earnings for travel distance covered.</Text>
        </View>

        <Text style={styles.sectionLabel}>Next Steps</Text>

        <TouchableOpacity
          style={styles.primaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
          <View style={styles.primaryOptionIcon}>
            <Icon name="home" size={20} color={colors.white} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.primaryOptionTitle}>Return to home / next delivery</Text>
            <Text style={styles.primaryOptionSubtitle}>Your earnings are secured</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NavigateToStore', {orderId})}>
          <View style={styles.secondaryOptionIcon}>
            <Icon name="package" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.optionText}>
            <Text style={styles.secondaryOptionTitle}>Return order to store</Text>
            <Text style={styles.secondaryOptionSubtitle}>If already collected from store</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Have questions about your earnings? </Text>
        <Text style={styles.footerLink}>Contact Support</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.dark800, alignItems: 'center', justifyContent: 'center', height: 100},
  headerIcon: {width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center'},
  titleBlock: {alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.lg, gap: spacing.xs},
  title: {...typography.h4, fontSize: 20, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.labelSemibold, color: colors.textPrimary},
  rowValueWarning: {...typography.label, fontWeight: '600', color: colors.warning},
  divider: {height: 1, backgroundColor: colors.background},
  protectionCard: {backgroundColor: colors.primarySurfaceAlt, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.lg, padding: spacing.md},
  protectionHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs},
  protectionTitle: {...typography.bodyBold, fontSize: 13, color: colors.primary},
  protectionRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm},
  protectionFeeLabel: {...typography.label, color: colors.primary},
  protectionFeeValue: {...typography.title, fontSize: 15, color: colors.primary},
  protectionNote: {...typography.caption, color: colors.primary, marginTop: spacing.xs},
  sectionLabel: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  primaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md},
  primaryOptionIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  primaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.white},
  primaryOptionSubtitle: {...typography.caption, fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 1},
  secondaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md},
  secondaryOptionIcon: {width: 36, height: 36, borderRadius: radius.sm, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  secondaryOptionTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  secondaryOptionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  optionText: {flex: 1},
  footer: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  footerText: {...typography.label, color: colors.textSecondary},
  footerLink: {...typography.labelSemibold, color: colors.primary, textDecorationLine: 'underline'},
});
