import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Icon, IconBackButton} from '../../components';
import {colors, radius, shadows, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTimeline'>;

const STEPS = [
  {time: '2:19 PM', label: 'Order Assigned', sub: 'Ravi Kumar accepted #VR-84821'},
  {time: '2:22 PM', label: 'Navigate to Store', sub: 'Swiggy Instamart, Koramangala · 1.2 km'},
  {time: '2:33 PM', label: 'Arrived at Store', sub: 'Check-in confirmed'},
  {time: '2:34 PM', label: 'Waiting for Order', sub: 'Store preparing order'},
  {time: '2:41 PM', label: 'Order Ready', sub: '3 items verified and collected'},
  {time: '2:41 PM', label: 'Navigate to Customer', sub: 'HSR Layout Sector 2 · 3.6 km'},
  {time: '2:58 PM', label: 'Arrived at Customer', sub: 'Apt 4B, Tower C'},
  {time: '3:04 PM', label: 'Customer Verified', sub: 'OTP confirmed · Priya Mehta'},
  {time: '3:04 PM', label: 'Delivered', sub: 'Order handed over successfully'},
];

export function OrderTimelineScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton onPress={() => navigation.goBack()} />
        <View>
          <Text style={styles.headerTitle}>Order Timeline · #{orderId}</Text>
          <Text style={styles.headerSubtitle}>Complete order journey</Text>
        </View>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {STEPS.map((step, index) => (
            <View key={`${step.label}-${index}`} style={styles.stepRow}>
              <View style={styles.stepTrack}>
                <View style={styles.stepDot}>
                  <Icon name="check" size={12} color={colors.white} />
                </View>
                {index < STEPS.length - 1 && <View style={styles.stepLine} />}
              </View>
              <View style={styles.stepText}>
                <View style={styles.stepHeaderRow}>
                  <Text style={styles.stepTime}>{step.time}</Text>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                </View>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
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
  headerSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  body: {padding: spacing.lg, paddingBottom: spacing.xxxl},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.xl, padding: spacing.lg, ...shadows.sm},
  stepRow: {flexDirection: 'row', gap: spacing.md},
  stepTrack: {alignItems: 'center'},
  stepDot: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  stepLine: {width: 2, flex: 1, minHeight: 24, backgroundColor: colors.primarySurface, marginVertical: 2},
  stepText: {paddingBottom: spacing.lg, flex: 1},
  stepHeaderRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  stepTime: {...typography.captionSemibold, fontSize: 12, color: colors.primary},
  stepLabel: {...typography.labelSemibold, fontSize: 13, color: colors.textPrimary},
  stepSub: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 2},
});
