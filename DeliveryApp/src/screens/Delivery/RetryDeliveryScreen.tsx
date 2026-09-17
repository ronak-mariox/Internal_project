import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RetryDelivery'>;

const CONDITIONS = ['Customer confirmed available', 'Address verified', 'Package intact'];

export function RetryDeliveryScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Retry Delivery</Text>
          <Text style={styles.headerSubtitle}>Attempt 2 of 3</Text>
        </View>
        <View style={styles.attemptTag}>
          <Text style={styles.attemptTagText}>Attempt 2/3</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.availableCard}>
          <View style={styles.availableHeader}>
            <View style={styles.availableDot} />
            <Text style={styles.availableTitle}>Priya Mehta is now available</Text>
          </View>
          <Text style={styles.availableSubtitle}>Confirmed via support call at 3:18 PM</Text>
          <Text style={styles.availableLocation}>Location confirmed: Apt 4B, Tower C</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>UPDATED DELIVERY INFO</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order</Text>
            <Text style={styles.rowValue}>#{orderId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>New ETA</Text>
            <Text style={styles.rowValueGreen}>3:28 PM</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Distance</Text>
            <Text style={styles.rowValue}>0.6 km from you</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.conditionsTitle}>Retry conditions</Text>
          {CONDITIONS.map(condition => (
            <View key={condition} style={styles.conditionRow}>
              <View style={styles.conditionCheck}>
                <Icon name="check" size={12} color={colors.primary} />
              </View>
              <Text style={styles.conditionText}>{condition}</Text>
            </View>
          ))}
        </View>

        <View style={styles.timerBanner}>
          <Icon name="clock" size={18} color={colors.warning} />
          <Text style={styles.timerText}>
            You have <Text style={styles.timerBold}>20 minutes</Text> to complete this delivery.
          </Text>
        </View>

        <Button
          label="Start Navigation — 0.6 km"
          icon="navigation"
          onPress={() => navigation.navigate('CustomerNavigationActive', {orderId})}
        />
        <Button
          label="Cannot Retry — Escalate"
          variant="secondary"
          textColor={colors.danger}
          onPress={() => navigation.navigate('DeliveryFailed', {orderId})}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  headerText: {flex: 1},
  headerTitle: {...typography.title, fontSize: 17, color: colors.textPrimary},
  headerSubtitle: {...typography.caption, color: colors.textSecondary},
  attemptTag: {backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4},
  attemptTagText: {...typography.captionSemibold, fontSize: 12, color: colors.warningText},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  availableCard: {backgroundColor: colors.primarySurfaceAlt, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg},
  availableHeader: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  availableDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  availableTitle: {...typography.bodyBold, fontSize: 15, color: colors.primaryDark},
  availableSubtitle: {...typography.label, fontSize: 13, color: colors.textSecondary, marginTop: spacing.sm},
  availableLocation: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, marginTop: spacing.xs},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodySemibold, fontSize: 13, color: colors.textPrimary},
  rowValueGreen: {...typography.bodySemibold, fontSize: 13, color: colors.primary},
  conditionsTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.sm},
  conditionRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 4},
  conditionCheck: {width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  conditionText: {...typography.body, color: colors.textPrimary},
  timerBanner: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.warningSurface, borderWidth: 1, borderColor: colors.warning, borderRadius: radius.md, padding: spacing.md},
  timerText: {...typography.label, fontSize: 13, color: colors.warningText, flex: 1},
  timerBold: {fontWeight: '700'},
});
