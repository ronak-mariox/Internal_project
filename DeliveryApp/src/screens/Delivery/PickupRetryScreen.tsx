import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Avatar, Button, Icon, ProgressBar, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupRetry'>;

type RetryOption = 'reattempt' | 'ask-store';

const HISTORY = [
  {id: 'first', label: 'First attempt: 2:33 PM (failed)', status: 'done' as const},
  {id: 'retry', label: 'Retry in progress', status: 'active' as const},
  {id: 'final', label: 'Final attempt / cancel', status: 'upcoming' as const},
];

export function PickupRetryScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selected, setSelected] = useState<RetryOption>('reattempt');

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Retry Pickup</Text>
        <Text style={styles.headerSubtitle}>Attempt 2 of 3</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.storeCard}>
          <Avatar initials="SI" size={44} />
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>Swiggy Instamart</Text>
            <Text style={styles.storeMeta}>Last contact: 2:38 PM</Text>
          </View>
          <TouchableOpacity
            style={styles.callChip}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('ContactStore', {orderId})}>
            <Text style={styles.callChipText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.optionCard, selected === 'reattempt' && styles.optionCardSelected]}
          activeOpacity={0.85}
          onPress={() => setSelected('reattempt')}>
          <Text style={styles.optionTitle}>Re-attempt pickup now</Text>
          <Text style={styles.optionSubtitle}>Go back to store entrance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, selected === 'ask-store' && styles.optionCardSelected]}
          activeOpacity={0.85}
          onPress={() => setSelected('ask-store')}>
          <Text style={styles.optionTitle}>Ask store to recheck order</Text>
          <Text style={styles.optionSubtitle}>Call / message the store</Text>
        </TouchableOpacity>

        <View style={styles.timerCard}>
          <Text style={styles.timerText}>
            You have <Text style={styles.timerStrong}>12 minutes</Text> to retry before order cancellation
          </Text>
          <ProgressBar progress={0.6} height={8} fillColor={colors.warning} style={styles.progressBar} />
        </View>

        <View style={styles.historyCard}>
          <Text style={styles.cardLabel}>ATTEMPT HISTORY</Text>
          {HISTORY.map((item, index) => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyDotCol}>
                <View
                  style={[
                    styles.historyDot,
                    item.status === 'done' && styles.historyDotDone,
                    item.status === 'active' && styles.historyDotActive,
                  ]}>
                  {item.status === 'done' && <Icon name="check" size={12} color={colors.white} />}
                  {item.status === 'active' && <View style={styles.historyDotActiveInner} />}
                </View>
                {index < HISTORY.length - 1 && <View style={styles.historyConnector} />}
              </View>
              <Text style={[styles.historyLabel, item.status === 'active' && styles.historyLabelActive]}>{item.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Escalate to Support"
          variant="secondary"
          style={styles.escalateButton}
          fullWidth={false}
          onPress={() => navigation.navigate('PickupSupport', {orderId})}
        />
        <Button
          label="Proceed to Retry"
          style={styles.retryButton}
          fullWidth={false}
          onPress={() =>
            selected === 'reattempt'
              ? navigation.replace('PickupConfirmation', {orderId})
              : navigation.navigate('ContactStore', {orderId})
          }
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.warning, paddingHorizontal: spacing.xxl, paddingTop: spacing.xxl, paddingBottom: spacing.xl},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  headerSubtitle: {...typography.bodyMedium, color: 'rgba(255,255,255,0.9)', marginTop: spacing.xxs},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  storeCard: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  storeInfo: {flex: 1},
  storeName: {...typography.bodyLgMedium, color: colors.textPrimary},
  storeMeta: {...typography.label, color: colors.textSecondary, marginTop: 1},
  callChip: {backgroundColor: colors.primary, borderRadius: radius.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  callChipText: {...typography.labelSemibold, color: colors.white},
  optionCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  optionCardSelected: {borderWidth: 2, borderColor: colors.primary},
  optionTitle: {...typography.bodyLgMedium, color: colors.textPrimary},
  optionSubtitle: {...typography.label, color: colors.textSecondary, marginTop: 1},
  timerCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  timerText: {...typography.label, color: colors.textSecondary},
  timerStrong: {...typography.labelSemibold, color: colors.warning},
  progressBar: {marginTop: spacing.sm},
  historyCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.4, marginBottom: spacing.sm},
  historyRow: {flexDirection: 'row', gap: spacing.md},
  historyDotCol: {alignItems: 'center'},
  historyDot: {width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  historyDotDone: {backgroundColor: colors.primary, borderColor: colors.primary},
  historyDotActive: {backgroundColor: colors.warning, borderColor: colors.warning},
  historyDotActiveInner: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white},
  historyConnector: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.border, marginTop: 3},
  historyLabel: {...typography.label, color: colors.textSecondary, paddingBottom: spacing.md},
  historyLabelActive: {...typography.labelSemibold, color: colors.textPrimary},
  footer: {flexDirection: 'row', gap: spacing.sm, padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
  escalateButton: {flex: 1},
  retryButton: {flex: 1},
});
