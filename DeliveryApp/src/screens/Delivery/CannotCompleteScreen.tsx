import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CannotComplete'>;

export function CannotCompleteScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const goHome = () => navigation.reset({index: 0, routes: [{name: 'Home'}]});

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="x" size={26} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>Delivery Cannot Be Completed</Text>
        <Text style={styles.headerSubtitle}>Order #{orderId} — Priya Mehta</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>SUMMARY OF ATTEMPTS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Attempts</Text>
            <Text style={styles.rowValue}>3 calls, 2 messages, 10 min wait</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Address verified</Text>
            <Icon name="check" size={16} color={colors.primary} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer unreachable</Text>
            <Icon name="check" size={16} color={colors.primary} />
          </View>
        </View>

        <Text style={styles.sectionLabel}>What would you like to do?</Text>

        <TouchableOpacity
          style={styles.primaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ReturnOrder', {orderId})}>
          <Icon name="refresh" size={22} color={colors.primary} />
          <View style={styles.optionText}>
            <Text style={styles.primaryOptionTitle}>Return to store</Text>
            <Text style={styles.optionSubtitle}>Required for food/perishables — Recommended</Text>
          </View>
          <View style={styles.recTag}>
            <Text style={styles.recTagText}>REC</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DeliverySuccess', {orderId})}>
          <Icon name="map-pin" size={22} color={colors.textPrimary} />
          <View style={styles.optionText}>
            <Text style={styles.secondaryOptionTitle}>Safe drop at location</Text>
            <Text style={styles.optionSubtitle}>Only if permitted by order</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryOption}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ReportIssue', {orderId})}>
          <Icon name="alert-circle" size={22} color={colors.textPrimary} />
          <View style={styles.optionText}>
            <Text style={styles.secondaryOptionTitle}>Escalate — Support takes over</Text>
            <Text style={styles.optionSubtitle}>Support will handle this order</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.protectionBanner}>
          <Text style={styles.protectionLabel}>Earnings protection</Text>
          <Text style={styles.protectionAmount}>Guaranteed partial earnings: ₹40</Text>
          <Text style={styles.protectionNote}>Full earnings if customer cancellation confirmed</Text>
        </View>

        <Button label="Confirm Cannot Complete" variant="outline" style={styles.confirmButton} textColor={colors.danger} onPress={goHome} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.dark800, alignItems: 'center', gap: spacing.xs, paddingTop: spacing.xxl, paddingBottom: spacing.xl, paddingHorizontal: spacing.xl},
  headerIcon: {width: 52, height: 52, borderRadius: 26, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs},
  headerTitle: {...typography.h4, fontSize: 20, color: colors.white, textAlign: 'center'},
  headerSubtitle: {...typography.body, color: '#D1D5DB'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.xxs},
  rowLabel: {...typography.label, color: colors.textSecondary},
  rowValue: {...typography.label, fontWeight: '500', color: colors.textPrimary},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  primaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg},
  secondaryOption: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionText: {flex: 1},
  primaryOptionTitle: {...typography.bodyLgMedium, fontSize: 15, color: '#13845A'},
  secondaryOptionTitle: {...typography.bodyMedium, fontSize: 15, color: colors.textPrimary},
  optionSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  recTag: {backgroundColor: colors.primary, borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 3},
  recTagText: {...typography.captionSemibold, fontSize: 11, color: colors.white},
  protectionBanner: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.lg},
  protectionLabel: {...typography.labelSemibold, fontSize: 13, color: colors.warningText},
  protectionAmount: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary, marginTop: spacing.xs},
  protectionNote: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: 2},
  confirmButton: {borderColor: colors.danger},
});
