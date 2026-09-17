import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'RequestTimedOut'>;

export function RequestTimedOutScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen backgroundColor={colors.background} edges={['top', 'bottom']} contentContainerStyle={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name="clock" size={44} color={colors.textMuted} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>0</Text>
        </View>
      </View>
      <View style={styles.expiredBadge}>
        <Text style={styles.expiredBadgeText}>REQUEST EXPIRED</Text>
      </View>
      <Text style={styles.title}>Request Timed Out</Text>
      <Text style={styles.subtitle}>
        Order <Text style={styles.subtitleStrong}>#{orderId}</Text> expired before a response was given. It has been assigned to another
        rider.
      </Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardOrderId}>#{orderId}</Text>
          <View style={styles.expiredTag}>
            <Text style={styles.expiredTagText}>EXPIRED</Text>
          </View>
        </View>
        <Row label="Pickup" value="Swiggy Instamart, Koramangala" />
        <Row label="Drop" value="HSR Layout Sector 2" />
        <Row label="Earnings" value="₹78 (missed)" />
      </View>

      <View style={styles.impactBanner}>
        <Text style={styles.impactTitle}>Timeout Impact</Text>
        <Text style={styles.impactText}>
          Expired requests count against your acceptance rate just like rejections. Try to respond faster to keep your rate high.
        </Text>
      </View>

      <View style={styles.actions}>
        <Button label="Back to Dashboard" onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})} />
        <Text style={styles.footnote}>New requests will appear automatically</Text>
      </View>
    </Screen>
  );
}

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl, paddingVertical: spacing.huge},
  iconWrap: {width: 110, height: 110, borderRadius: 55, backgroundColor: colors.background, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg},
  badge: {position: 'absolute', right: 4, bottom: 4, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.dark600, borderWidth: 3, borderColor: colors.background, alignItems: 'center', justifyContent: 'center'},
  badgeText: {...typography.bodyBold, fontSize: 14, color: colors.white},
  expiredBadge: {backgroundColor: colors.dark600, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 4, marginBottom: spacing.md},
  expiredBadgeText: {...typography.overline, fontSize: 11, color: colors.white},
  title: {...typography.h3, color: colors.textPrimary},
  subtitle: {...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg},
  subtitleStrong: {...typography.bodySemibold, color: colors.textPrimary},
  card: {width: '100%', opacity: 0.7, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, padding: spacing.lg, gap: spacing.sm, marginBottom: spacing.lg},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  cardOrderId: {...typography.bodyBold, fontSize: 14, color: colors.dark600},
  expiredTag: {backgroundColor: colors.textMuted, borderRadius: 6, paddingHorizontal: spacing.sm, paddingVertical: 2},
  expiredTagText: {...typography.overline, fontSize: 11, color: colors.white},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  rowLabel: {...typography.caption, color: colors.textMuted},
  rowValue: {...typography.caption, color: colors.dark600},
  impactBanner: {width: '100%', backgroundColor: '#FFFAEB', borderWidth: 1, borderColor: '#FEC84B', borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.xl},
  impactTitle: {...typography.captionSemibold, color: '#B54708', marginBottom: 2},
  impactText: {...typography.caption, color: colors.warningText, lineHeight: 16},
  actions: {width: '100%', gap: spacing.md, alignItems: 'center'},
  footnote: {...typography.caption, color: colors.textMuted},
});
