import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, IconBackButton, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectIssueReason'>;

const REASONS = [
  'Did not answer calls',
  'Phone switched off',
  'Wrong contact number',
  'Customer refused delivery',
  'Customer unavailable at address',
  'Customer asked to cancel',
];

export function SelectIssueReasonScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [selected, setSelected] = useState(REASONS[0]);
  const [priority, setPriority] = useState<'low' | 'high'>('high');

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Select Reason</Text>
          <Text style={styles.headerSubtitle}>Delivery Issue · Order #{orderId}</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.fieldLabel}>Main reason</Text>
        <View style={styles.mainReasonChip}>
          <Text style={styles.mainReasonText}>Customer Unreachable</Text>
          <Icon name="x" size={16} color={colors.primary} />
        </View>

        <Text style={styles.sectionLabel}>Specific reason</Text>
        <View style={styles.reasonsList}>
          {REASONS.map(reason => {
            const isSelected = reason === selected;
            return (
              <TouchableOpacity
                key={reason}
                style={[styles.reasonRow, isSelected && styles.reasonRowSelected]}
                activeOpacity={0.8}
                onPress={() => setSelected(reason)}>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>Escalation level</Text>
        <View style={styles.priorityRow}>
          <TouchableOpacity
            style={[styles.priorityPill, priority === 'low' && styles.priorityPillActive]}
            activeOpacity={0.8}
            onPress={() => setPriority('low')}>
            <View style={[styles.priorityDot, priority === 'low' && styles.priorityDotActive]} />
            <Text style={[styles.priorityText, priority === 'low' && styles.priorityTextActive]}>Low Priority</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.priorityPill, priority === 'high' && styles.priorityPillActive]}
            activeOpacity={0.8}
            onPress={() => setPriority('high')}>
            <View style={[styles.priorityDot, priority === 'high' && styles.priorityDotActive]} />
            <Text style={[styles.priorityText, priority === 'high' && styles.priorityTextActive]}>High Priority</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactLabel}>IMPACT PREVIEW</Text>
          <View style={styles.impactRow}>
            <Text style={styles.impactRowLabel}>Earnings</Text>
            <Text style={styles.impactRowValueGreen}>₹40 guaranteed</Text>
          </View>
          <View style={styles.impactRow}>
            <Text style={styles.impactRowLabel}>Order</Text>
            <Text style={styles.impactRowValue}>Reassigned or returned</Text>
          </View>
          <View style={styles.impactRow}>
            <Text style={styles.impactRowLabel}>Your rating</Text>
            <Text style={styles.impactRowValueGreen}>Not affected</Text>
          </View>
        </View>

        <Button
          label="Confirm Reason"
          icon="arrow-right"
          iconPosition="right"
          onPress={() => navigation.navigate('UploadEvidence', {orderId})}
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
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  fieldLabel: {...typography.label, color: colors.textSecondary},
  mainReasonChip: {flexDirection: 'row', alignSelf: 'flex-start', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySurface, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  mainReasonText: {...typography.bodySemibold, fontSize: 14, color: colors.primaryDark},
  sectionLabel: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  reasonsList: {gap: spacing.sm},
  reasonRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md},
  reasonRowSelected: {borderColor: colors.primary, backgroundColor: colors.primarySurfaceAlt},
  radio: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center'},
  radioSelected: {borderColor: colors.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary},
  reasonText: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  priorityRow: {flexDirection: 'row', gap: spacing.sm},
  priorityPill: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.pill, paddingVertical: spacing.sm},
  priorityPillActive: {backgroundColor: colors.dark900, borderColor: colors.dark900},
  priorityDot: {width: 12, height: 12, borderRadius: 3, borderWidth: 2, borderColor: colors.textSecondary},
  priorityDotActive: {borderColor: colors.white, backgroundColor: colors.white},
  priorityText: {...typography.bodyMedium, fontSize: 14, color: colors.textSecondary},
  priorityTextActive: {color: colors.white},
  impactCard: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  impactLabel: {...typography.captionSemibold, fontSize: 13, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  impactRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4},
  impactRowLabel: {...typography.label, color: colors.textSecondary},
  impactRowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary},
  impactRowValueGreen: {...typography.labelSemibold, fontSize: 13, color: colors.primary},
});
