import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderAccepted'>;

export function OrderAcceptedScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.checkCircle}>
          <Icon name="check" size={36} color={colors.white} />
        </View>
        <Text style={styles.title}>Order Accepted!</Text>
        <Text style={styles.subtitle}>Head to the pickup point now</Text>
      </View>

      <ScrollView style={styles.flex} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.orderCard}>
          <View style={styles.orderCardHeader}>
            <Text style={styles.orderCardHeaderTitle}>Order #{orderId}</Text>
            <View style={styles.itemsBadge}>
              <Text style={styles.itemsBadgeText}>3 Items</Text>
            </View>
          </View>

          <View style={styles.orderCardBody}>
            <View style={styles.routeRow}>
              <View style={styles.routeLine}>
                <View style={styles.routeDotPickup} />
                <View style={styles.routeConnector} />
                <View style={styles.routeDotDrop} />
              </View>
              <View style={styles.routeText}>
                <Text style={styles.routeTitle}>Swiggy Instamart</Text>
                <Text style={styles.routeSubtitle}>100 Feet Road, Koramangala 6th Block</Text>
                <View style={styles.routeSpacer} />
                <Text style={styles.routeTitle}>Flat 302, Sunrise Apts</Text>
                <Text style={styles.routeSubtitle}>HSR Layout Sector 2, Bengaluru</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <Metric value="₹78" label="Earnings" highlighted />
              <Metric value="3.8 km" label="Distance" />
              <Metric value="22 min" label="ETA" />
            </View>
          </View>

          <View style={styles.orderCardActions}>
            <TouchableOpacity style={[styles.orderCardAction, styles.orderCardActionBordered]} activeOpacity={0.8}>
              <Icon name="phone" size={15} color={colors.textSecondary} />
              <Text style={styles.orderCardActionText}>Call Store</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.orderCardAction} activeOpacity={0.8}>
              <Icon name="alert-circle" size={15} color={colors.textSecondary} />
              <Text style={styles.orderCardActionText}>Report Issue</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.acceptanceBanner}>
          <Icon name="bar-chart" size={16} color={colors.primary} />
          <Text style={styles.acceptanceText}>
            Your acceptance rate: <Text style={styles.acceptanceTextStrong}>94%</Text> · Keep it above 80% to maintain bonuses
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Navigate to Pickup — 1.2 km" icon="navigation" onPress={() => navigation.navigate('NavigateToStore', {orderId})} />
      </View>
    </Screen>
  );
}

function Metric({value, label, highlighted}: {value: string; label: string; highlighted?: boolean}) {
  return (
    <View style={styles.metric}>
      <Text style={[styles.metricValue, highlighted && styles.metricValueHighlighted]}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  header: {backgroundColor: colors.primary, alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.xs},
  checkCircle: {width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm},
  title: {...typography.h4, fontSize: 22, color: colors.white},
  subtitle: {...typography.label, color: 'rgba(255,255,255,0.75)'},
  body: {backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md},
  orderCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.xxl, overflow: 'hidden'},
  orderCardHeader: {backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  orderCardHeaderTitle: {...typography.bodyBold, fontSize: 13, color: colors.white},
  itemsBadge: {backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 3},
  itemsBadgeText: {...typography.overline, fontSize: 11, color: colors.white},
  orderCardBody: {padding: spacing.lg, gap: spacing.md},
  routeRow: {flexDirection: 'row', gap: spacing.md},
  routeLine: {alignItems: 'center', paddingTop: 3},
  routeDotPickup: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white},
  routeConnector: {width: 2, flex: 1, backgroundColor: colors.border, minHeight: 28},
  routeDotDrop: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger, borderWidth: 2, borderColor: colors.white},
  routeText: {flex: 1},
  routeTitle: {...typography.bodyBold, fontSize: 13, color: colors.textPrimary},
  routeSubtitle: {...typography.caption, color: colors.textSecondary, marginTop: 1},
  routeSpacer: {height: spacing.md},
  metricsRow: {flexDirection: 'row', gap: spacing.sm},
  metric: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, paddingVertical: spacing.sm, alignItems: 'center'},
  metricValue: {...typography.bodyBold, fontSize: 15, color: colors.textPrimary},
  metricValueHighlighted: {color: colors.primary},
  metricLabel: {...typography.caption, fontSize: 10, color: colors.textMuted, marginTop: 1},
  orderCardActions: {flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border},
  orderCardAction: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 46},
  orderCardActionBordered: {borderRightWidth: 1, borderRightColor: colors.border},
  orderCardActionText: {...typography.label, color: colors.textSecondary},
  acceptanceBanner: {flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  acceptanceText: {flex: 1, ...typography.label, color: colors.textSecondary, lineHeight: 19},
  acceptanceTextStrong: {...typography.labelSemibold, color: colors.primary},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
