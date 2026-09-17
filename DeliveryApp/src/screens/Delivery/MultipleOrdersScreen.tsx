import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';
import {Button, Screen} from '../../components';
import {colors, radius, spacing, typography} from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MultipleOrders'>;

const OFFERS = [
  {
    orderId: 'VR-84730',
    store: 'Zomato Express',
    items: '2 items',
    countdown: 24,
    dotColor: colors.primary,
    area: 'BTM Layout Sector 1',
    distanceFromYou: '0.8 km away',
    deliveryDistance: '2.4 km delivery',
    pay: '₹62',
    total: '3.2 km',
    eta: '18 min',
  },
  {
    orderId: 'VR-84731',
    store: "McDonald's, Koramangala",
    items: '4 items',
    countdown: 16,
    dotColor: colors.warning,
    area: 'Domlur Layout',
    distanceFromYou: '1.4 km away',
    deliveryDistance: '4.1 km delivery',
    pay: '₹94',
    total: '5.5 km',
    eta: '28 min',
  },
  {
    orderId: 'VR-84732',
    store: 'BigBasket Now',
    items: '6 items',
    countdown: 8,
    dotColor: colors.danger,
    area: 'Ejipura',
    distanceFromYou: '2.1 km away',
    deliveryDistance: '1.9 km delivery',
    pay: '₹76',
    total: '4.0 km',
    eta: '22 min',
  },
];

export function MultipleOrdersScreen({navigation}: Props) {
  return (
    <Screen backgroundColor={colors.dark900} edges={['top', 'bottom']} scroll>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>MULTIPLE REQUESTS AVAILABLE</Text>
          <Text style={styles.headerTitle}>Choose your next order</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{OFFERS.length} new</Text>
        </View>
      </View>

      <View style={styles.body}>
        {OFFERS.map(offer => (
          <View key={offer.orderId} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.dot, {backgroundColor: offer.dotColor}]} />
                <Text style={styles.storeText}>{offer.store}</Text>
                <View style={styles.itemsTag}>
                  <Text style={styles.itemsTagText}>{offer.items}</Text>
                </View>
              </View>
              <View style={[styles.countdown, {borderColor: offer.dotColor}]}>
                <Text style={[styles.countdownText, {color: offer.dotColor}]}>{offer.countdown}</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <View style={styles.routeLine}>
                <View style={styles.routeDotPickup} />
                <View style={styles.routeConnector} />
                <View style={styles.routeDotDrop} />
              </View>
              <View style={styles.routeText}>
                <Text style={styles.routeLine1}>
                  {offer.store} · <Text style={styles.routeGreen}>{offer.distanceFromYou}</Text>
                </Text>
                <Text style={styles.routeLine2}>
                  {offer.area} · <Text style={styles.routeMuted}>{offer.deliveryDistance}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricValuePay}>{offer.pay}</Text>
                <Text style={styles.metricLabel}>Pay</Text>
              </View>
              <View style={styles.metricPlain}>
                <Text style={styles.metricValue}>{offer.total}</Text>
                <Text style={styles.metricLabel}>Total</Text>
              </View>
              <View style={styles.metricPlain}>
                <Text style={styles.metricValue}>{offer.eta}</Text>
                <Text style={styles.metricLabel}>ETA</Text>
              </View>
              <TouchableOpacity
                style={styles.acceptButton}
                activeOpacity={0.85}
                onPress={() => navigation.replace('AcceptingOrder', {orderId: offer.orderId})}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          label="Skip All — Wait for Next"
          variant="secondary"
          style={styles.skipButton}
          textColor={colors.textMuted}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {backgroundColor: colors.dark900, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingTop: spacing.xl, paddingBottom: spacing.md},
  headerLabel: {...typography.overline, fontSize: 11, color: colors.dark600, letterSpacing: 0.5},
  headerTitle: {...typography.title, fontSize: 18, color: colors.white, marginTop: 2},
  headerBadge: {backgroundColor: colors.dark800, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.xs},
  headerBadgeText: {...typography.bodyBold, fontSize: 14, color: colors.primary},
  body: {padding: spacing.lg, gap: spacing.md, backgroundColor: colors.dark900},
  card: {backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.xxl, overflow: 'hidden'},
  cardHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingHorizontal: spacing.md, paddingVertical: spacing.sm},
  cardHeaderLeft: {flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexShrink: 1},
  dot: {width: 8, height: 8, borderRadius: 4},
  storeText: {...typography.captionSemibold, color: colors.textLabel},
  itemsTag: {backgroundColor: colors.background, borderRadius: 4, paddingHorizontal: spacing.xs, paddingVertical: 1},
  itemsTagText: {...typography.micro, fontSize: 10, color: colors.textMuted},
  countdown: {width: 38, height: 38, borderRadius: 19, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center'},
  countdownText: {...typography.bodyBold, fontSize: 13},
  cardBody: {flexDirection: 'row', gap: spacing.sm, padding: spacing.md},
  routeLine: {alignItems: 'center', paddingTop: 3, gap: 2},
  routeDotPickup: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary},
  routeConnector: {width: 1, height: 18, backgroundColor: colors.border},
  routeDotDrop: {width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger},
  routeText: {flex: 1, gap: spacing.sm},
  routeLine1: {...typography.caption, fontSize: 12, color: colors.textLabel},
  routeLine2: {...typography.caption, fontSize: 12, color: colors.textLabel},
  routeGreen: {color: colors.primary},
  routeMuted: {color: colors.textSecondary},
  metricsRow: {flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, paddingBottom: spacing.md},
  metric: {flex: 1, backgroundColor: colors.primarySurface, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: radius.sm, paddingVertical: spacing.xs, alignItems: 'center'},
  metricPlain: {flex: 1, backgroundColor: colors.background, borderRadius: radius.sm, paddingVertical: spacing.xs, alignItems: 'center'},
  metricValuePay: {...typography.captionSemibold, color: colors.primary},
  metricValue: {...typography.captionSemibold, color: colors.textPrimary},
  metricLabel: {...typography.micro, fontSize: 9, color: colors.textMuted, marginTop: 1},
  acceptButton: {backgroundColor: colors.primary, borderRadius: radius.sm, height: 44, paddingHorizontal: spacing.md, alignItems: 'center', justifyContent: 'center'},
  acceptButtonText: {...typography.bodyBold, fontSize: 13, color: colors.white},
  footer: {padding: spacing.lg, backgroundColor: colors.dark900, borderTopWidth: 1, borderTopColor: colors.dark800},
  skipButton: {backgroundColor: colors.dark800, borderColor: colors.dark800},
});
