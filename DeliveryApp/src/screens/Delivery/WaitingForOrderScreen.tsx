import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'WaitingForOrder'>;

const START_SECONDS = 8 * 60 + 24;
const RING_SIZE = 140;
const STROKE_WIDTH = 8;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TIMELINE = [
  {id: 'arrived', title: 'Arrived at store', subtitle: '2:33 PM', status: 'done' as const},
  {id: 'waiting', title: 'Waiting for order', subtitle: null, status: 'active' as const},
  {id: 'collect', title: 'Collect order', subtitle: null, status: 'upcoming' as const},
  {id: 'deliver', title: 'Start delivery', subtitle: null, status: 'upcoming' as const},
];

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function WaitingForOrderScreen({route, navigation}: Props) {
  const {orderId} = route.params;
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {return;}
    const timer = setTimeout(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  const progress = 1 - secondsLeft / START_SECONDS;

  return (
    <Screen edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.timerWrap}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RADIUS} stroke={colors.border} strokeWidth={STROKE_WIDTH} fill="none" />
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            stroke={colors.warning}
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            rotation={-90}
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.timerLabel}>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </View>
      </View>
      <Text style={styles.waitingText}>Waiting for order at store</Text>

      <View style={styles.card}>
        <Text style={styles.storeName}>Swiggy Instamart</Text>
        <Text style={styles.storeAddress}>Koramangala 6th Block</Text>
        <Text style={styles.metaText}>
          Staff contacted at <Text style={styles.metaStrong}>2:28 PM</Text>
        </Text>
        <Text style={styles.metaText}>
          Expected ready: <Text style={styles.metaWarning}>2:41 PM</Text>
        </Text>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ContactStore', {orderId})}>
          <Icon name="phone" size={18} color={colors.textSecondary} />
          <Text style={styles.actionLabel}>Call Store</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} activeOpacity={0.85}>
          <Icon name="bell" size={18} color={colors.textSecondary} />
          <Text style={styles.actionLabel}>Send Reminder</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ReportStoreIssue', {orderId})}>
          <Icon name="alert-triangle" size={18} color={colors.danger} />
          <Text style={styles.actionLabel}>Report Issue</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timelineCard}>
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
                {step.status === 'done' && <Icon name="check" size={12} color={colors.white} />}
                {step.status === 'active' && <View style={styles.timelineDotActiveInner} />}
              </View>
              {index < TIMELINE.length - 1 && <View style={styles.timelineConnector} />}
            </View>
            <View style={styles.timelineText}>
              <Text style={[styles.timelineTitle, step.status === 'upcoming' && styles.timelineTitleMuted]}>{step.title}</Text>
              {step.subtitle && <Text style={styles.timelineSubtitle}>{step.subtitle}</Text>}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.huge, gap: spacing.md},
  timerWrap: {width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center'},
  timerLabel: {position: 'absolute'},
  timerText: {...typography.h2, fontSize: 26, color: colors.textPrimary},
  waitingText: {...typography.bodyMedium, color: colors.textSecondary},
  card: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, gap: 4},
  storeName: {...typography.title, fontSize: 15, color: colors.textPrimary},
  storeAddress: {...typography.label, color: colors.textSecondary},
  metaText: {...typography.label, color: colors.textSecondary, marginTop: spacing.xs},
  metaStrong: {...typography.labelSemibold, color: colors.textPrimary},
  metaWarning: {...typography.labelSemibold, color: colors.warning},
  actionsRow: {flexDirection: 'row', gap: spacing.sm, width: '100%'},
  actionButton: {flex: 1, alignItems: 'center', gap: 5, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, paddingVertical: spacing.md},
  actionLabel: {...typography.micro, fontSize: 10, color: colors.textSecondary, fontWeight: '600'},
  timelineCard: {width: '100%', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg},
  cardLabel: {...typography.overline, color: colors.textSecondary, letterSpacing: 0.8, marginBottom: spacing.sm},
  timelineRow: {flexDirection: 'row', gap: spacing.md},
  timelineDotCol: {alignItems: 'center'},
  timelineDot: {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  timelineDotDone: {backgroundColor: colors.primary, borderColor: colors.primary},
  timelineDotActive: {borderColor: colors.warning, backgroundColor: colors.warningSurface},
  timelineDotActiveInner: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning},
  timelineConnector: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.border, marginTop: 4},
  timelineText: {flex: 1, paddingBottom: spacing.md},
  timelineTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  timelineTitleMuted: {...typography.body, color: colors.textSecondary},
  timelineSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
});
