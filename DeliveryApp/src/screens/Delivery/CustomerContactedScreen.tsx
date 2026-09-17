import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CustomerContacted'>;

const TIMELINE = [
  {id: 'arrived', title: 'Arrived at location', subtitle: '3:08 PM', status: 'done' as const},
  {id: 'contacted', title: 'Customer contacted', subtitle: '3:09 PM', status: 'done' as const},
  {id: 'waiting', title: 'Waiting for customer', subtitle: 'Active', status: 'active' as const},
  {id: 'complete', title: 'Complete delivery', subtitle: null, status: 'upcoming' as const},
];

export function CustomerContactedScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Icon name="check" size={36} color={colors.white} />
        <Text style={styles.headerTitle}>Customer Contacted!</Text>
        <Text style={styles.headerSubtitle}>Priya Mehta confirmed — on their way down</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>ETA UPDATE</Text>
          <View style={styles.etaRow}>
            <View style={styles.etaTile}>
              <Text style={styles.etaTileLabel}>Customer ETA</Text>
              <Text style={styles.etaTileValueGreen}>3 minutes</Text>
            </View>
            <View style={styles.etaTile}>
              <Text style={styles.etaTileLabel}>New window</Text>
              <Text style={styles.etaTileValue}>3:11 PM</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Icon name="clock" size={14} color={colors.textSecondary} />
            <Text style={styles.statusText}>
              Status: <Text style={styles.statusValue}>Waiting (active)</Text>
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>TIMELINE</Text>
          {TIMELINE.map((step, index) => (
            <View key={step.id} style={styles.timelineRow}>
              <View style={styles.timelineDotCol}>
                <View
                  style={[
                    styles.timelineDot,
                    step.status === 'done' && styles.timelineDotDone,
                    step.status === 'active' && styles.timelineDotActive,
                  ]}>
                  {step.status === 'done' && <Icon name="check" size={10} color={colors.white} />}
                  {step.status === 'active' && <View style={styles.timelineDotActiveInner} />}
                </View>
                {index < TIMELINE.length - 1 && (
                  <View style={[styles.timelineConnector, step.status === 'upcoming' && styles.timelineConnectorMuted]} />
                )}
              </View>
              <View style={styles.timelineText}>
                <Text style={[styles.timelineTitle, step.status === 'upcoming' && styles.timelineTitleMuted]}>{step.title}</Text>
                {step.subtitle && (
                  <Text style={[styles.timelineSubtitle, step.status === 'active' && styles.timelineSubtitleActive]}>
                    {step.subtitle}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Proceed to Deliver" onPress={() => navigation.navigate('DeliveryVerification', {orderId})} />
        <Button
          label="Contact Again"
          variant="secondary"
          icon="phone"
          onPress={() => navigation.navigate('CallingException', {orderId})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.xxs, paddingTop: spacing.xl, paddingBottom: spacing.xl},
  headerTitle: {...typography.title, fontSize: 18, color: colors.white, marginTop: spacing.xs},
  headerSubtitle: {...typography.label, color: 'rgba(255,255,255,0.85)'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  cardLabel: {...typography.captionMedium, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: spacing.sm},
  etaRow: {flexDirection: 'row', gap: spacing.sm},
  etaTile: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, padding: spacing.md},
  etaTileLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  etaTileValueGreen: {...typography.title, fontSize: 16, color: colors.primary, marginTop: 3},
  etaTileValue: {...typography.title, fontSize: 16, color: colors.textPrimary, marginTop: 3},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm},
  statusText: {...typography.label, color: colors.textSecondary},
  statusValue: {...typography.labelSemibold, color: colors.warning},
  timelineRow: {flexDirection: 'row', gap: spacing.md},
  timelineDotCol: {alignItems: 'center'},
  timelineDot: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  timelineDotDone: {backgroundColor: colors.primary, borderColor: colors.primary},
  timelineDotActive: {backgroundColor: colors.warning, borderColor: colors.warning},
  timelineDotActiveInner: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white},
  timelineConnector: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.primary, marginTop: 3},
  timelineConnectorMuted: {backgroundColor: colors.border},
  timelineText: {flex: 1, paddingBottom: spacing.md},
  timelineTitle: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  timelineTitleMuted: {color: colors.textMuted},
  timelineSubtitle: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  timelineSubtitleActive: {color: colors.warning},
  footer: {padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
