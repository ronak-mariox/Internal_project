import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IssueResolution'>;

const ACTIONS = [
  {title: 'Issue reported', time: '3:12 PM'},
  {title: 'Support reviewed', time: '3:13 PM'},
  {title: 'Customer contacted by support', time: '3:14 PM'},
  {title: 'Order reassigned', time: '3:16 PM'},
  {title: 'Your earnings protected', time: '3:16 PM'},
];

export function IssueResolutionScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="check" size={32} color={colors.white} />
        </View>
        <Text style={styles.headerTitle}>Issue Resolved</Text>
        <Text style={styles.headerSubtitle}>Issue #ISS-29847</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>RESOLUTION DETAILS</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Resolution type</Text>
            <Text style={styles.rowValue}>Order reassigned to another rider</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Customer</Text>
            <Text style={styles.rowValue}>Notified via SMS</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Your earnings</Text>
            <Text style={styles.rowValueGreen}>₹40 guaranteed (tonight)</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Resolution time</Text>
            <Text style={styles.rowValue}>4 minutes</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.actionsTitle}>Actions taken</Text>
          {ACTIONS.map((action, index) => (
            <View key={action.title} style={styles.actionRow}>
              <View style={styles.actionDotCol}>
                <View style={styles.actionDot}>
                  <Icon name="check" size={12} color={colors.primary} />
                </View>
                {index < ACTIONS.length - 1 && <View style={styles.actionConnector} />}
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionTime}>{action.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.protectedBanner}>
          <Text style={styles.protectedText}>
            This incident will <Text style={styles.protectedBold}>NOT affect</Text> your acceptance rate or customer rating.
          </Text>
        </View>

        <Button label="Back to Home" onPress={() => navigation.navigate('OrderReassigned', {orderId})} />
        <Button label="View Earnings" variant="secondary" onPress={() => navigation.navigate('EarningsDashboard')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, alignItems: 'center', gap: spacing.xs, paddingTop: spacing.xxl, paddingBottom: spacing.xxl, paddingHorizontal: spacing.xl},
  headerIcon: {width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xs},
  headerTitle: {...typography.h3, fontSize: 24, color: colors.white},
  headerSubtitle: {...typography.body, color: '#A7F3D0'},
  flex: {flex: 1},
  body: {padding: spacing.lg, gap: spacing.md},
  card: {backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg},
  cardLabel: {...typography.captionSemibold, fontSize: 12, color: colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: spacing.sm},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: spacing.xxs, gap: spacing.md},
  rowLabel: {...typography.label, fontSize: 13, color: colors.textSecondary},
  rowValue: {...typography.bodyMedium, fontSize: 13, color: colors.textPrimary, textAlign: 'right', flexShrink: 1},
  rowValueGreen: {...typography.bodyBold, fontSize: 13, color: colors.primary, textAlign: 'right'},
  actionsTitle: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary, marginBottom: spacing.md},
  actionRow: {flexDirection: 'row', gap: spacing.md},
  actionDotCol: {alignItems: 'center'},
  actionDot: {width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primarySurface, borderWidth: 2, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center'},
  actionConnector: {width: 2, flex: 1, minHeight: 20, backgroundColor: colors.border, marginTop: 2},
  actionText: {flex: 1, paddingBottom: spacing.md},
  actionTitle: {...typography.bodyMedium, fontSize: 14, color: colors.textPrimary},
  actionTime: {...typography.caption, fontSize: 12, color: colors.textSecondary, marginTop: 1},
  protectedBanner: {backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, padding: spacing.md},
  protectedText: {...typography.label, fontSize: 13, color: colors.primaryDark},
  protectedBold: {fontWeight: '700'},
});
