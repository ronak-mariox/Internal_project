import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Icon, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeActiveDelivery'>;

export function HomeActiveDeliveryScreen({route, navigation}: Props) {
  const {orderId} = route.params;

  return (
    <Screen backgroundColor={colors.primary} statusBarStyle="light-content" edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Icon name="user" size={18} color={colors.white} />
          </View>
          <View>
            <Text style={styles.headerCaption}>Delivering now</Text>
            <Text style={styles.headerName}>Rahul Sharma</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.activeBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBadgeText}>ACTIVE</Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Icon name="bell" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryCardHeader}>
            <View style={styles.deliveryCardHeaderLeft}>
              <Icon name="bicycle" size={16} color={colors.white} />
              <Text style={styles.deliveryCardHeaderTitle}>Active Delivery</Text>
            </View>
            <Text style={styles.deliveryCardHeaderOrder}>Order #{orderId}</Text>
          </View>

          <View style={styles.deliveryBody}>
            <View style={styles.routeRow}>
              <View style={styles.routeLine}>
                <View style={styles.routeDotPickup} />
                <View style={styles.routeConnector} />
                <View style={styles.routeDotDrop} />
              </View>
              <View style={styles.routeText}>
                <Text style={styles.routeLabel}>PICKUP</Text>
                <Text style={styles.routeTitle}>Swiggy Instamart</Text>
                <Text style={styles.routeSubtitle}>100 Feet Road, Koramangala</Text>
                <View style={styles.routeSpacer} />
                <Text style={styles.routeLabel}>DELIVER TO</Text>
                <Text style={styles.routeTitle}>Arjun K. (Customer)</Text>
                <Text style={styles.routeSubtitle}>5th Cross, HSR Layout, Bengaluru</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <View>
                <Text style={styles.statusLabel}>Current status</Text>
                <Text style={styles.statusValue}>Heading to Pickup</Text>
              </View>
              <View style={styles.statusRight}>
                <Text style={styles.statusLabel}>ETA</Text>
                <Text style={styles.etaValue}>8 min</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <Metric value="3.8 km" label="Distance" />
              <Metric value="₹78" label="Earnings" />
              <Metric value="4" label="Items" />
            </View>
          </View>

          <View style={styles.deliveryActions}>
            <DeliveryAction icon="phone" label="Call" bordered />
            <DeliveryAction icon="message-circle" label="Message" bordered />
            <DeliveryAction icon="alert-circle" label="Issue" danger />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statValue}>₹1,318</Text>
            <Text style={styles.statLabel}>Today's Earnings</Text>
          </View>
          <View style={styles.statTile}>
            <Text style={[styles.statValue, styles.statValueDark]}>12</Text>
            <Text style={styles.statLabel}>Today's Orders</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Navigate to Pickup" icon="navigation" onPress={() => navigation.navigate('NavigateToStore', {orderId})} />
      </View>
    </Screen>
  );
}

function Metric({value, label}: {value: string; label: string}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function DeliveryAction({
  icon,
  label,
  danger,
  bordered,
}: {
  icon: React.ComponentProps<typeof Icon>['name'];
  label: string;
  danger?: boolean;
  bordered?: boolean;
}) {
  return (
    <TouchableOpacity style={[styles.deliveryAction, bordered && styles.deliveryActionBordered]} activeOpacity={0.8}>
      <Icon name={icon} size={15} color={danger ? colors.danger : colors.textSecondary} />
      <Text style={[styles.deliveryActionText, danger && styles.deliveryActionTextDanger]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.md},
  headerLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  avatar: {width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center'},
  headerCaption: {...typography.caption, fontSize: 11, color: 'rgba(255,255,255,0.7)'},
  headerName: {...typography.bodyBold, fontSize: 13, color: colors.white},
  headerRight: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  activeBadge: {flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4},
  activeDot: {width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#A7F3D0'},
  activeBadgeText: {...typography.overline, fontSize: 11, color: colors.white},
  bellButton: {width: 34, height: 34, borderRadius: radius.md, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  body: {flex: 1, padding: spacing.lg, gap: spacing.md, backgroundColor: colors.background},
  deliveryCard: {backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.primary, borderRadius: radius.xxl, overflow: 'hidden'},
  deliveryCardHeader: {backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm},
  deliveryCardHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  deliveryCardHeaderTitle: {...typography.captionSemibold, color: colors.white},
  deliveryCardHeaderOrder: {...typography.captionSemibold, color: '#A7F3D0'},
  deliveryBody: {padding: spacing.lg, gap: spacing.md},
  routeRow: {flexDirection: 'row', gap: spacing.md},
  routeLine: {alignItems: 'center', paddingTop: 3},
  routeDotPickup: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.white},
  routeConnector: {width: 2, flex: 1, backgroundColor: colors.border, minHeight: 30},
  routeDotDrop: {width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger, borderWidth: 2, borderColor: colors.white},
  routeText: {flex: 1},
  routeLabel: {...typography.overline, fontSize: 11, color: colors.textMuted, letterSpacing: 0.4},
  routeTitle: {...typography.labelSemibold, color: colors.textPrimary, marginTop: 1},
  routeSubtitle: {...typography.caption, color: colors.textSecondary},
  routeSpacer: {height: spacing.md},
  statusRow: {flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.primarySurface, borderRadius: radius.md, padding: spacing.md},
  statusRight: {alignItems: 'flex-end'},
  statusLabel: {...typography.caption, fontSize: 11, color: colors.textSecondary},
  statusValue: {...typography.bodyBold, fontSize: 13, color: colors.primary, marginTop: 1},
  etaValue: {...typography.title, fontSize: 16, color: colors.textPrimary, marginTop: 1},
  metricsRow: {flexDirection: 'row', gap: spacing.sm},
  metric: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, paddingVertical: spacing.sm, alignItems: 'center'},
  metricValue: {...typography.bodySemibold, fontSize: 14, color: colors.textPrimary},
  metricLabel: {...typography.caption, fontSize: 10, color: colors.textMuted, marginTop: 1},
  deliveryActions: {flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border},
  deliveryAction: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 48},
  deliveryActionBordered: {borderRightWidth: 1, borderRightColor: colors.border},
  deliveryActionText: {...typography.label, color: colors.textSecondary},
  deliveryActionTextDanger: {color: colors.danger, fontWeight: '600'},
  statsRow: {flexDirection: 'row', gap: spacing.sm},
  statTile: {flex: 1, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md},
  statValue: {...typography.h4, fontSize: 20, color: colors.primary},
  statValueDark: {color: colors.textPrimary},
  statLabel: {...typography.caption, color: colors.textMuted, marginTop: 2},
  footer: {padding: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border},
});
